# Servidor SFTP con OpenSSH (paso a paso + explicación)

## 0) Requisitos y concepto

* **OpenSSH** ya incluye SFTP. No hace falta instalar “otro SFTP”: basta con **configurar** sshd para que un usuario quede **enjaulado (chroot)** en un directorio y sólo pueda usar SFTP (sin shell).
* Usaremos:

  * **Directorio raíz del chroot:** `/sftp` (debe ser de **root** y no escribible).
  * **Zona de subida de archivos:** `/sftp/upload` (propiedad del usuario SFTP).

---

## 1) Instalar/activar OpenSSH

```bash
# Ubuntu / Debian
sudo apt update -y
sudo apt install -y openssh-server

# Amazon Linux / RHEL / CentOS
# sudo yum install -y openssh-server

# Asegura que está activo
sudo systemctl enable ssh
sudo systemctl start ssh
sudo systemctl status ssh
```

**Qué hace:**

* Instala el servicio SSH (servidor) que incluye SFTP.
* `enable` lo arranca automáticamente al iniciar el sistema.
* `start` lo arranca ahora.
* `status` te confirma que está activo.

---

## 2) Crear el usuario SFTP (aislado)

```bash
# Crea usuario sin privilegios administrativos
sudo adduser sftpuser
# Define una contraseña (solo si vas a permitir login por password)
sudo passwd sftpuser
```

**Qué hace:**

* `adduser sftpuser` crea el usuario y su home (`/home/sftpuser`).
* `passwd` fija una contraseña si vas a permitir autenticación por contraseña (si usarás **sólo clave SSH**, este paso no es estrictamente necesario).

> Recomendado: usuario **dedicado** (no uses `ec2-user`, `ubuntu` o tu propio usuario).

---

## 3) Crear la jaula (chroot) y permisos correctos

```bash
# Crea la jaula SFTP y el subdirectorio de trabajo
sudo mkdir -p /sftp/upload

# El directorio chroot (/sftp) DEBE ser de root y no escribible
sudo chown root:root /sftp
sudo chmod 755 /sftp

# El área de subida sí es del usuario SFTP
sudo chown sftpuser:sftpuser /sftp/upload
```

**Qué hace y por qué es crítico:**

* **SFTP chroot** exige que el directorio raíz del chroot (`/sftp`) **pertenezca a root** y **no sea escribible** por nadie más; si no, **sshd rechaza la conexión**.
* El usuario **sí** necesita un sitio donde escribir → por eso usamos `/sftp/upload` (propiedad de `sftpuser`).

---

## 4) Configurar `sshd_config` para SFTP enjaulado

Edita la configuración:

```bash
sudo nano /etc/ssh/sshd_config
```

Añade (o asegúrate de tener) estas líneas al final:

```
# Usa el subsistema SFTP interno (más seguro y simple)
Subsystem sftp internal-sftp

# Regla específica para el usuario SFTP
Match User sftpuser
    ChrootDirectory /sftp
    ForceCommand internal-sftp
    PasswordAuthentication yes
    X11Forwarding no
    AllowTcpForwarding no
    PermitTunnel no
```
| Línea                        | Qué hace                                                 | Motivo                                                        |
| ---------------------------- | -------------------------------------------------------- | ------------------------------------------------------------- |
| `Match User sftpuser`        | Aplica todo lo siguiente solo a este usuario.            | Permite aislar la configuración sin afectar a otros.          |
| `ChrootDirectory /sftp`      | Enjaula al usuario dentro de `/sftp`.                    | Evita que vea o acceda al resto del sistema.                  |
| `ForceCommand internal-sftp` | Obliga a usar el subsistema interno de SFTP (sin shell). | Impide ejecutar comandos SSH o abrir terminales.              |
| `PasswordAuthentication yes` | Permite login por contraseña (opcional).                 | Útil si no usas claves SSH.                                   |
| `X11Forwarding no`           | Desactiva reenvío gráfico (X11).                         | No aplica a SFTP y mejora la seguridad.                       |
| `AllowTcpForwarding no`      | Desactiva reenvío de puertos (port forwarding).          | Evita que el usuario use SSH como túnel TCP.                  |
| `PermitTunnel no`            | Desactiva túneles de red SSH (TUN/TAP).                  | Evita que el usuario cree una VPN o túnel cifrado usando SSH. |

> **Opcional (si quieres acceso con contraseña):**
>
> ```
> PasswordAuthentication yes
> ```
>
> (Si prefieres sólo clave SSH, déjalo en `no` o por defecto.)

**Qué hace cada directiva:**

* `Subsystem sftp internal-sftp`: usa el SFTP **integrado** en sshd (sin binarios externos).
* `Match User sftpuser`: todo lo que va dentro aplica **sólo** a ese usuario.
* `ChrootDirectory /sftp`: “enjaula” al usuario en `/sftp`. No podrá ver nada fuera.
* `ForceCommand internal-sftp`: **bloquea el shell**; sólo podrá usar SFTP.
* `X11Forwarding no` / `AllowTcpForwarding no`: medidas de **endurecimiento** (no necesita túneles/gráficos).

Antes de reiniciar, **valida** la sintaxis:

```bash
sudo sshd -t
```

Si no muestra nada, es que está OK.

---

## 5) Reiniciar el servicio SSH

```bash
sudo systemctl restart ssh
```

**Qué hace:** recarga la configuración. Si hay errores de permisos en `/sftp` o `/sftp/upload`, aquí suelen aflorar al probar.

---

## 6) (Opcional pero recomendado) Autenticación por **clave SSH**

Genera un par de claves en tu máquina:

```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa_sftp
# (enter, enter… para aceptar por defecto o añadir passphrase)
```

Crea la carpeta `.ssh` del usuario y registra la **clave pública**:

```bash
sudo -u sftpuser mkdir -p /home/sftpuser/.ssh
sudo -u sftpuser bash -c 'cat >> /home/sftpuser/.ssh/authorized_keys' < ~/.ssh/id_rsa_sftp.pub
sudo chmod 700 /home/sftpuser/.ssh
sudo chmod 600 /home/sftpuser/.ssh/authorized_keys
```

**Qué hace:**

* `authorized_keys` es el fichero con las **claves públicas permitidas** para ese usuario.
* Los permisos 700/600 son **obligatorios** para que SSH confíe en ellos.

> Si vas a usar **sólo clave**, en `sshd_config` mantén `PasswordAuthentication no`.

---

## 7) Abrir el puerto en el firewall (si aplica)

```bash
# Ubuntu/Debian con UFW
sudo ufw allow 22/tcp
sudo ufw status
```

**Qué hace:** permite conexiones entrantes al puerto **22** (SSH/SFTP).
En AWS EC2, además, revisa el **Security Group** de la instancia (abre el **puerto 22** sólo a IPs de confianza).

---

## 8) Probar la conexión SFTP

Con contraseña:

```bash
sftp sftpuser@IP_DEL_SERVIDOR
# password cuando la pida
sftp> put fichero.pdf /upload/
```

Con **clave**:

```bash
sftp -i ~/.ssh/id_rsa_sftp sftpuser@IP_DEL_SERVIDOR
sftp> put fichero.pdf /upload/
```

**Qué valida:**

* Que puedes entrar.
* Que el chroot funciona (tu directorio visible será `/` con subcarpeta `/upload`).
* Que puedes **subir** archivos a `/upload`.

---

## 9) Consejos rápidos de seguridad

* Restringe el puerto 22 a **IPs concretas** (Security Group / firewall).
* Preferible **clave SSH** a contraseña.
* Si necesitas varios usuarios, puedes replicar la sección `Match User` para cada uno o usar un `Match Group` y un grupo del sistema.
* Revisa logs si algo falla:

  * Ubuntu/Debian: `/var/log/auth.log`
  * Amazon Linux: `sudo journalctl -u ssh`

---

# Cómo **borrar/deshacer** el servidor SFTP

Si más adelante quieres **eliminar** todo (usuario, carpetas y configuración), haz lo siguiente.

## A) Revertir configuración de `sshd_config`

1. Edita:

   ```bash
   sudo nano /etc/ssh/sshd_config
   ```
2. **Elimina o comenta**:

   * La línea `Subsystem sftp internal-sftp` **solo si la añadiste tú** (puedes dejar la que hubiera por defecto, si existía).
   * El bloque:

     ```
     Match User sftpuser
         ChrootDirectory /sftp
         ForceCommand internal-sftp
         X11Forwarding no
         AllowTcpForwarding no
     ```

   3. (Opcional) Vuelve a tu política anterior de `PasswordAuthentication` si la cambiaste.
3. Valida y reinicia:

   ```bash
   sudo sshd -t
   sudo systemctl restart ssh
   ```

> **Nota:** Si otros usuarios dependen de SFTP, no elimines el `Subsystem` global.

---

## B) Eliminar usuario y sus recursos

> **OJO**: esto borra cuenta y su home. Asegúrate de que no la necesita nadie.

```bash
# Cierra sesiones activas del usuario si las hubiera (opcional)
sudo pkill -u sftpuser

# Borra el usuario y su home
sudo userdel -r sftpuser
```

Ahora borra el chroot y su contenido:

```bash
# Esto elimina toda la jaula y los ficheros subidos
sudo rm -rf /sftp
```

---

## C) (Opcional) Desinstalar OpenSSH Server

```bash
# Ubuntu / Debian
sudo apt remove -y openssh-server
sudo apt autoremove -y
```

> Normalmente **no lo desinstales** si necesitas SSH para administrar el servidor.
> Con quitar el usuario, la jaula y la regla `Match` es suficiente.

---

## D) Cerrar el puerto en el firewall (si lo abriste)

```bash
# UFW
sudo ufw delete allow 22/tcp
sudo ufw status
```

En AWS, **quita** la regla del **Security Group** si abriste el 22.

---

## Checklist de borrado

* [ ] Quitar bloque `Match User sftpuser` de `sshd_config`
* [ ] `sshd -t` y `systemctl restart ssh`
* [ ] `userdel -r sftpuser`
* [ ] `rm -rf /sftp`
* [ ] Cerrar puerto 22 en firewall / Security Group (si no lo necesitas)
* [ ] (Opcional) quitar claves asociadas a ese usuario