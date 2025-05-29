# Guía de SSH y SCP

## 1. Introducción a SSH

SSH (*Secure Shell*) es un protocolo que permite establecer conexiones remotas seguras a un servidor a través de una red no segura.

El comando básico para conectarse a un servidor es:

```bash
ssh usuario@servidor
```

Si el servidor utiliza un puerto diferente al predeterminado (22), puedes especificarlo así:

```bash
ssh usuario@servidor -p 2222
```

Para salir de una sesión SSH:

```bash
exit
```

---

## 2. Generación de un par de claves para autenticación sin contraseña

La autenticación con clave SSH permite conectarse sin tener que escribir una contraseña, utilizando un par de claves: una **clave pública** y una **clave privada**.

### 2.1 Generar el par de claves

Ejecuta este comando en tu máquina local:

```bash
ssh-keygen -t rsa -b 4096 -C "comentario"
```

* `-t rsa`: tipo de clave (RSA en este caso).
* `-b 4096`: tamaño en bits.
* `-C "comentario"`: opcional, sirve para identificar la clave (puede ser un correo o una descripción).

Esto generará dos archivos en `~/.ssh/`:

* `id_rsa` (clave privada, **no debes compartirla**).
* `id_rsa.pub` (clave pública, que se copia al servidor).

### 2.2 Copiar la clave pública al servidor

Para autorizar conexiones sin contraseña, debes copiar la clave pública al archivo `~/.ssh/authorized_keys` del servidor.

#### Usando `ssh-copy-id` (forma fácil)

```bash
ssh-copy-id usuario@servidor
```

Si usas un puerto diferente:

```bash
ssh-copy-id -p 2222 usuario@servidor
```

#### Manualmente (si no tienes `ssh-copy-id`)

```bash
cat ~/.ssh/id_rsa.pub | ssh usuario@servidor "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

Verifica los permisos en el servidor:

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

Ahora podrás conectarte sin contraseña:

```bash
ssh usuario@servidor
```

---

## 3. Transferencia de archivos con SCP

SCP (*Secure Copy Protocol*) permite copiar archivos entre tu máquina local y un servidor remoto de forma segura.

### 3.1 Copiar un archivo **al servidor**

```bash
scp archivo.txt usuario@servidor:/ruta/destino/
```

Si el servidor usa otro puerto:

```bash
scp -P 2222 archivo.txt usuario@servidor:/ruta/destino/
```

### 3.2 Copiar un archivo **desde el servidor a tu máquina local**

```bash
scp usuario@servidor:/ruta/remota/archivo.txt ./
```

### 3.3 Copiar un directorio completo

Para subir un directorio de forma recursiva:

```bash
scp -r directorio usuario@servidor:/ruta/destino/
```

Para descargarlo:

```bash
scp -r usuario@servidor:/ruta/remota/directorio ./
```

### 3.4 Usar alias definidos en `~/.ssh/config`

Si has configurado un alias en `~/.ssh/config` como este:

```ini
Host midestino
  HostName 192.168.1.10
  User jose
  IdentityFile ~/.ssh/id_rsa
```

Puedes usarlo directamente con `scp`:

```bash
scp midestino:/ruta/remota/archivo.txt ./
```

O para copiar carpetas:

```bash
scp -r midestino:/ruta/remota/carpeta ./carpeta_local/
```

### 3.5 Descargar directamente al Escritorio de Windows desde WSL

Si estás usando **Ubuntu en Windows (WSL)**, puedes acceder a tu escritorio con:

```bash
/mnt/c/Users/TU_USUARIO/Desktop/
```

Ejemplo:

```bash
scp midestino:/home/jose/archivo.txt /mnt/c/Users/TU_USUARIO/Desktop/
```

Reemplaza `TU_USUARIO` por tu nombre de usuario en Windows.

---

## 4. Cómo funciona internamente la autenticación por claves SSH

La autenticación con claves públicas y privadas se basa en criptografía asimétrica.

1. **Generación del par de claves**

   * La clave privada (`id_rsa`) se guarda localmente y no se comparte.
   * La clave pública (`id_rsa.pub`) se copia en el servidor dentro de `~/.ssh/authorized_keys`.

2. **Proceso de conexión**

   * El servidor busca una clave pública que coincida.
   * Envía un reto cifrado con esa clave.
   * El cliente responde con una firma usando su clave privada.
   * El servidor verifica la firma con la clave pública.

Este proceso asegura que solo quien tenga la clave privada puede autenticarse.

---

## 5. Configuración avanzada

### 5.1 Archivo de configuración para accesos rápidos

Puedes crear un archivo `~/.ssh/config` con accesos rápidos:

```ini
Host servidor-pruebas
    HostName 192.168.1.10
    User jose
    Port 2222
    IdentityFile ~/.ssh/id_rsa
```

Con eso, en lugar de escribir todo el comando, puedes usar:

```bash
ssh servidor-pruebas
```

Y también:

```bash
scp servidor-pruebas:/ruta/archivo.txt ./
```

### 5.2 Desactivar contraseñas y permitir solo claves en el servidor

Edita `/etc/ssh/sshd_config` en el servidor y configura:

```ini
PasswordAuthentication no
PubkeyAuthentication yes
```

Reinicia el servicio SSH:

```bash
sudo systemctl restart ssh
```

---

## 6. Resolución de problemas

Si no puedes conectarte sin contraseña, revisa:

* **Permisos correctos en el servidor**:

  ```bash
  chmod 700 ~/.ssh
  chmod 600 ~/.ssh/authorized_keys
  ```
* **Que la clave pública esté realmente en `~/.ssh/authorized_keys`.**
* **Que el servidor tenga habilitada la autenticación con claves en `/etc/ssh/sshd_config`.**
* **Usa modo verbose para ver más detalles**:

  ```bash
  ssh -v usuario@servidor
  ```

Si necesitas revisar los logs del servidor:

```bash
sudo journalctl -u ssh -n 50 --no-pager
```

---

## 7. Conclusión

SSH y SCP son herramientas fundamentales para la administración remota de servidores. El uso de claves SSH mejora la seguridad y permite automatizar conexiones sin necesidad de contraseñas. Si además usas WSL, puedes integrar fácilmente transferencias entre Linux y el entorno Windows.