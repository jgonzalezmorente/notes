
## **Guía paso a paso para usar Alpine Linux Live en un pendrive**

---

### **Paso 1: Descargar la ISO**
Ve a la web oficial:
https://alpinelinux.org/downloads/

1. En la sección **"Standard"**, descarga el archivo ISO llamado:
   ```
   x86_64 → alpine-standard-*.iso
   ```

---

### **Paso 2: Crear el USB booteable**
Desde Windows, usa **Rufus**:

1. Descarga Rufus desde: https://rufus.ie/
2. Inserta tu pendrive (mínimo 512 MB).
3. Configura Rufus así:
   - **Dispositivo:** tu pendrive
   - **Seleccionar imagen:** la ISO de Alpine descargada
   - **Sistema de archivos:** FAT32
   - Clic en **"Empezar"**

---

### **Paso 3: Arrancar desde el USB**
1. Conecta el USB al PC.
2. Enciende el PC y entra en el menú de arranque (normalmente pulsando **F12**, **F2**, **ESC** o **DEL** según tu placa).
3. Selecciona tu pendrive y arranca desde él.
4. Verás la terminal de Alpine con un prompt que empieza así:
   ```bash
   Welcome to Alpine Linux
   ```

---

### **Paso 4: Montar el disco duro**
#### 1. Ver dispositivos conectados:
```bash
lsblk
```
O también:
```bash
fdisk -l
```

Busca una partición tipo NTFS. Ejemplo: `/dev/sda2`

#### 2. Crear punto de montaje y montar:
```bash
mkdir /mnt/windows
mount -t auto /dev/sda2 /mnt/windows
```

#### 3. Ver el contenido:
```bash
ls /mnt/windows
```

---

### **Copiar archivos a otro USB**
Conecta otro pendrive, localízalo (por ejemplo `/dev/sdb1`), móntalo:
```bash
mkdir /mnt/usb
mount /dev/sdb1 /mnt/usb
```

Y luego copia lo que quieras:
```bash
cp -r /mnt/windows/Users/tu_usuario/Documents /mnt/usb/
```