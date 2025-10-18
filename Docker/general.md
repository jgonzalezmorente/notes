# **Guía completa de Docker y Docker Compose**

### Índice:

1. [¿Qué es Docker?](#qué-es-docker)
2. [Conceptos clave en Docker](#conceptos-clave-en-docker)

   * [Imágenes](#1-imágenes)
   * [Contenedores](#2-contenedores)
   * [Dockerfile](#3-dockerfile)
   * [Volúmenes](#4-volúmenes)
   * [Redes](#5-redes)
3. [Comandos básicos de Docker](#comandos-básicos-de-docker)
4. [Cómo crear un Dockerfile](#cómo-crear-un-dockerfile)
5. [¿Qué es Docker Compose?](#qué-es-docker-compose)
6. [Docker Compose: Comandos clave](#docker-compose-comandos-clave)
7. [Docker Compose: Levantar y reconstruir un solo contenedor](#levantar-y-reconstruir-un-solo-contenedor-con-docker-compose)

   * [Usar `--no-deps` para evitar levantar dependencias](#usar-no-deps-para-evitar-levantar-dependencias)
8. [Cómo crear un archivo `docker-compose.yml`](#cómo-crear-un-archivo-docker-composeyml)
9. [Volúmenes en Docker Compose](#volúmenes-en-docker-compose)
10. [Redes en Docker Compose](#redes-en-docker-compose)
11. [Ejemplo práctico con Docker Compose, volúmenes y redes](#ejemplo-práctico-con-docker-compose-volúmenes-y-redes)
12. [Buenas prácticas y consejos](#buenas-prácticas-y-consejos)
13. [Recursos adicionales](#recursos-adicionales)

---

### **¿Qué es Docker?**

Docker es una plataforma de contenedores que permite a los desarrolladores empaquetar aplicaciones y sus dependencias en un **contenedor**. Esto asegura que la aplicación funcione de manera coherente en diferentes entornos, como desarrollo, pruebas y producción, independientemente de las configuraciones del sistema.

* **Contenedor**: Es una instancia ejecutable de una imagen Docker. Es ligero y contiene todo lo necesario para ejecutar una aplicación (código, bibliotecas, configuraciones).
* **Imagen**: Es una plantilla inmutable a partir de la cual se crean los contenedores. Las imágenes se crean utilizando **Dockerfiles**.

---

### **Conceptos clave en Docker**

#### **1. Imágenes**

Las **imágenes** son plantillas de solo lectura que incluyen todo lo que necesita una aplicación para ejecutarse: código fuente, bibliotecas, herramientas y configuraciones.

* Se pueden crear con un **Dockerfile**.
* Las imágenes se almacenan en **Docker Hub** o en repositorios privados.

#### **2. Contenedores**

Los **contenedores** son instancias de imágenes que están en ejecución. Son ligeros y portátiles, y contienen todo lo necesario para ejecutar una aplicación de manera aislada.

#### **3. Dockerfile**

El **Dockerfile** es un archivo de texto que contiene una serie de instrucciones para construir una imagen Docker. Define el sistema base, las bibliotecas necesarias, variables de entorno y cómo debe ejecutarse la aplicación.

#### **4. Volúmenes**

Los **volúmenes** en Docker permiten que los contenedores **persistan datos** fuera de su ciclo de vida. Esto es útil para almacenar bases de datos, archivos de configuración o cualquier dato que deba mantenerse incluso si el contenedor se elimina.

#### **5. Redes**

Las **redes** en Docker permiten la comunicación entre contenedores de manera segura y aislada. Docker crea redes virtuales a las que puedes conectar uno o más contenedores, permitiendo que los servicios se comuniquen entre sí.

---

### **Comandos básicos de Docker**

1. **Construir una imagen** a partir de un Dockerfile:

   ```bash
   docker build -t nombre-de-la-imagen .
   ```

2. **Correr un contenedor** a partir de una imagen:

   ```bash
   docker run -d --name nombre-del-contenedor nombre-de-la-imagen
   ```

3. **Listar contenedores**:

   ```bash
   docker ps          # Contenedores en ejecución
   docker ps -a       # Todos los contenedores, incluidos los detenidos
   ```

4. **Detener y eliminar contenedores**:

   ```bash
   docker stop nombre-del-contenedor
   docker rm nombre-del-contenedor
   ```

5. **Eliminar imágenes**:

   ```bash
   docker rmi nombre-de-la-imagen
   ```

6. **Ver logs de un contenedor**:

   ```bash
   docker logs nombre-del-contenedor
   ```

7. **Acceder al contenedor**:

   ```bash
   docker exec -it nombre-del-contenedor /bin/bash
   ```

---

### **Cómo crear un Dockerfile**

El **Dockerfile** es el punto de partida para crear imágenes personalizadas. Aquí tienes un ejemplo básico para una aplicación Node.js:

```dockerfile
# Usa una imagen base oficial de Node.js
FROM node:14

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Expone el puerto en el que la aplicación se ejecutará
EXPOSE 3000

# Define el comando por defecto para ejecutar la aplicación
CMD ["npm", "start"]
```

Para construir una imagen usando este Dockerfile:

```bash
docker build -t nombre-de-la-imagen .
```

---

### **¿Qué es Docker Compose?**

Docker Compose es una herramienta que permite definir y ejecutar aplicaciones **multi-contenedor** mediante un archivo **`docker-compose.yml`**. Este archivo describe los servicios que forman parte de tu aplicación, cómo interactúan, sus volúmenes, redes, entre otras configuraciones.

En lugar de iniciar manualmente cada contenedor, puedes orquestar todos los servicios relacionados con un solo comando.

---

### **Docker Compose: Comandos clave**

1. **Iniciar servicios definidos en `docker-compose.yml`**:

   ```bash
   docker-compose up
   ```

2. **Detener todos los servicios**:

   ```bash
   docker-compose down
   ```

3. **Correr servicios en segundo plano (modo detached)**:

   ```bash
   docker-compose up -d
   ```

4. **Ver los logs de los servicios**:

   ```bash
   docker-compose logs
   ```

5. **Reconstruir contenedores (si el código o el Dockerfile han cambiado)**:

   ```bash
   docker-compose build
   ```

---

### **Levantar y reconstruir un solo contenedor con Docker Compose**

Cuando tienes varios servicios definidos en `docker-compose.yml` y quieres reconstruir y levantar solo uno, sin afectar los demás que ya están en ejecución, puedes hacerlo fácilmente.

#### Levantar y reconstruir solo un servicio:

```bash
docker-compose up --build -d nombre_servicio
```

O con la nueva sintaxis:

```bash
docker compose up --build -d nombre_servicio
```

Esto hace lo siguiente:

* Reconstruye la imagen del servicio si hay cambios.
* Levanta ese servicio (lo reemplaza si ya está corriendo).
* No afecta al resto de servicios en ejecución.

---

#### **Usar `no-deps` para evitar levantar dependencias**

A veces, el servicio que quieres reconstruir **depende de otros** (por ejemplo, una base de datos), pero **no quieres reiniciar esos contenedores**.
En ese caso, puedes usar la opción `--no-deps`:

```bash
docker-compose up -d --no-deps --build nombre_servicio
```

Este comando:

* **Reconstruye la imagen** del servicio `nombre_servicio`.
* **Levanta o reemplaza solo ese contenedor**, sin iniciar sus dependencias definidas con `depends_on`.
* Es ideal cuando **solo has modificado el código fuente** o la configuración de un servicio concreto y **no quieres interrumpir el resto**.

💡 **Ejemplo práctico**:

Supón que tu `docker-compose.yml` define:

```yaml
services:
  web:
    build: ./web
    depends_on:
      - db
  db:
    image: postgres
```

Si ejecutas:

```bash
docker-compose up -d --no-deps --build web
```

Se reconstruye y reinicia **solo `web`**, **sin tocar `db`**, aunque `web` dependa de él.

---

#### **Forzar recreación de un servicio (aunque no haya cambios en la imagen):**

```bash
docker-compose up -d --force-recreate nombre_servicio
```

Este comando:

* Elimina y vuelve a crear el contenedor, aunque no haya cambios.
* Es útil cuando necesitas limpiar el estado interno del contenedor (por ejemplo, variables de entorno, volúmenes temporales, etc.).

#### **Forzar recreación de todos los servicios:**

```bash
docker-compose up -d --force-recreate
```

#### **Para hacer solo `build`:**

```bash
docker-compose build nombre_servicio
```

O con la nueva sintaxis:

```bash
docker compose build nombre_servicio
```

Esto permite mantener todos los servicios en marcha y trabajar sobre uno solo de forma aislada.

---

### **Cómo crear un archivo `docker-compose.yml`**

*(se mantiene igual que en tu versión original)*

---

### **Volúmenes en Docker Compose**

*(igual que antes)*

---

### **Redes en Docker Compose**

*(igual que antes)*

---

### **Ejemplo práctico con Docker Compose, volúmenes y redes**

*(igual que antes)*

---

### **Buenas prácticas y consejos**

1. **Usar volúmenes para persistir datos importantes**: Usa volúmenes para bases de datos o archivos que necesiten persistir entre reinicios de contenedores.
2. **Utiliza redes para aislar servicios**: Si tienes servicios que no deberían comunicarse con otros, define redes separadas para aislarlos.
3. **Recrear contenedores cuando cambies el código**: Si cambias el código de la aplicación, usa `docker-compose up --build` para recrear los contenedores y asegurarte de que se reflejan los cambios.
4. **Múltiples archivos de Compose para entornos**: Puedes tener varios archivos `docker-compose.yml` para diferentes entornos (desarrollo, producción) y combinarlos con el comando `-f`.

---

### **Recursos adicionales**

* **Documentación oficial de Docker**: [https://docs.docker.com](https://docs.docker.com)
* **Docker Compose Docs**: [https://docs.docker.com/compose/](https://docs.docker.com/compose/)