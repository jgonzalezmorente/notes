## Como crear/restaurar un backup de un volumen de Docker

1. **Crear un contenedor temporal**: Utiliza un contenedor temporal para acceder al volumen. Puedes usar un contenedor con una imagen básica como `busybox` o `alpine`. Aquí se muestra cómo montar el volumen en un contenedor temporal y luego copiar los datos a una carpeta local:
- En Linux/macOS:
   ```bash
   docker container run --rm -v nombre_del_volumen:/data -v $(pwd):/backup alpine tar cvf /backup/backup.tar /data
   ```
- En PowerShell:
   ```bash
   docker container run --rm -v nombre_del_volumen:/data -v ${PWD}:/backup alpine tar cvf /backup/backup.tar /data
   ```
   En este comando, `nombre_del_volumen` es el nombre del volumen de Docker que quieres copiar. `/data` es el punto de montaje dentro del contenedor, y `/backup` es el directorio dentro del contenedor conectado al directorio actual de tu máquina local, donde se almacenará el archivo `backup.tar` que contiene los datos del volumen.

   Las opciones `c`, `v` y `f` en el comando `tar` son bastante comunes y sirven para crear, visualizar y especificar archivos, respectivamente, cuando se trabaja con archivos de tarball (a menudo simplemente llamados "tar files"):

   * **c - Crear**: La opción `c` se utiliza para crear un nuevo archivo tar. Por ejemplo, si quieres crear un archivo tar con algunos documentos, usarías `tar -cf archivo.tar documentos/`.
   * **v - Verbose (detallado)**: La opción `v` hace que `tar` muestre una lista detallada de las operaciones que está realizando. Es útil para ver exactamente qué archivos están siendo incluidos o extraídos en un archivo tar. Por ejemplo, `tar -cvf archivo.tar documentos/` mostrará cada archivo mientras se está añadiendo al archivo tar.
   * **f - File (archivo)**: La opción `f` se utiliza para especificar el nombre del archivo tar con el que se va a trabajar. Siempre se utiliza en conjunto con otras opciones para indicar `tar` sobre qué archivo operar. Por ejemplo, si quieres extraer un archivo, usarías algo como `tar -xf archivo.tar`.

2. **Copiar el archivo a otro lugar**: Una vez que tienes el archivo `backup.tar` en tu máquina local, puedes moverlo o copiarlo a cualquier otro lugar, como otro servidor o una ubicación de almacenamiento en la nube. Para copiar el fichero `backup.tar` desde el servidor a tu máquina local, ejecutar el siguiente comando desde tu máquina local:
   ```bash
   scp [usuario]@[host_remoto]:/ruta/del/archivo/remoto /ruta/local/destino
   ```

3. **Restaurar el volumen en otro sistema Docker**: Para restaurar el volumen en otro sistema Docker, primero debes transferir el archivo `backup.tar` al nuevo sistema y luego puedes usar un contenedor temporal para extraer los datos al nuevo volumen. Por ejemplo:
   ```bash
   docker volume create nuevo_volumen
   docker container run --rm -v nuevo_volumen:/data -v "$(pwd):/backup" alpine tar xvf /backup/backup.tar -C /data/..
   ```
   Aquí, `nuevo_volumen` es el nombre del nuevo volumen de Docker donde deseas restaurar los datos.

   La opción `xvf` combinada con `-C` en el comando `tar` es una forma muy útil para extraer el contenido de un archivo tar en un directorio específico:
   * **x - Extraer**: La opción `x` se utiliza para extraer los archivos de un archivo tar existente.
   * **v - Verbose (detallado)**: Al igual que al crear archivos tar, la opción `v` en el modo de extracción muestra una lista detallada de los archivos que se están extrayendo, proporcionando una salida visible de lo que está sucediendo.
   * **f - File (archivo)**: La opción `f` sigue siendo necesaria para especificar el nombre del archivo tar del que se extraerán los archivos.
   * **-C - Directorio de destino**: La opción `-C` se usa para especificar el directorio donde quieres que se extraigan los archivos. Si no usas esta opción, `tar` extraerá los archivos en el directorio actual. Con `-C`, puedes dirigir los archivos a otro lugar.