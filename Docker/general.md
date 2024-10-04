# **Guía completa de Docker y Docker Compose**

### Índice:
1. [¿Qué es Docker?](#qué-es-docker)
1. [Conceptos clave en Docker](#conceptos-clave-en-docker)
   - [Imágenes](#1-imágenes)
   - [Contenedores](#2-contenedores)
   - [Dockerfile](#3-dockerfile)
   - [Volúmenes](#4-volúmenes)
   - [Redes](#5-redes)
1. [Comandos básicos de Docker](#comandos-básicos-de-docker)
1. [Cómo crear un Dockerfile](#cómo-crear-un-dockerfile)
1. [¿Qué es Docker Compose?](#qué-es-docker-compose)
1. [Docker Compose: Comandos clave](#docker-compose-comandos-clave)
1. [Cómo crear un archivo `docker-compose.yml`](#cómo-crear-un-archivo-docker-composeyml)
1. [Volúmenes en Docker Compose](#volúmenes-en-docker-compose)
1. [Redes en Docker Compose](#redes-en-docker-compose)
1. [Ejemplo práctico con Docker Compose, volúmenes y redes](#ejemplo-práctico-con-docker-compose-volúmenes-y-redes)
1. [Buenas prácticas y consejos](#buenas-prácticas-y-consejos)
1. [Guía para limpiar todo en Docker](#guía-para-limpiar-todo-en-docker)
1. [Recursos adicionales](#recursos-adicionales)

---

### **¿Qué es Docker?**
Docker es una plataforma de contenedores que permite a los desarrolladores empaquetar aplicaciones y sus dependencias en un **contenedor**. Esto asegura que la aplicación funcione de manera coherente en diferentes entornos, como desarrollo, pruebas y producción, independientemente de las configuraciones del sistema.

- **Contenedor**: Es una instancia ejecutable de una imagen Docker. Es ligero y contiene todo lo necesario para ejecutar una aplicación (código, bibliotecas, configuraciones).
- **Imagen**: Es una plantilla inmutable a partir de la cual se crean los contenedores. Las imágenes se crean utilizando **Dockerfiles**.

---

### **Conceptos clave en Docker**

#### **1. Imágenes**
Las **imágenes** son plantillas de solo lectura que incluyen todo lo que necesita una aplicación para ejecutarse: código fuente, bibliotecas, herramientas y configuraciones.

- Se pueden crear con un **Dockerfile**.
- Las imágenes se almacenan en **Docker Hub** o en repositorios privados.

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

6. **Acceder al contenedor**:
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

### **Cómo crear un archivo `docker-compose.yml`**

Un archivo `docker-compose.yml` es un archivo de configuración YAML que define los servicios (contenedores), volúmenes, redes y otras configuraciones necesarias para ejecutar una aplicación. Aquí tienes un ejemplo básico de una aplicación web con Node.js y PostgreSQL.

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
    environment:
      - DB_HOST=db
      - DB_USER=usuario
      - DB_PASS=contraseña
    depends_on:
      - db

  db:
    image: postgres:12
    environment:
      POSTGRES_USER: usuario
      POSTGRES_PASSWORD: contraseña
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

- **`services`**: Define los contenedores (servicios) que se ejecutarán.
- **`build`**: Construye la imagen de la aplicación a partir de un Dockerfile.
- **`ports`**: Mapea el puerto del host al puerto dentro del contenedor.
- **`volumes`**: Define volúmenes para persistir datos.
- **`depends_on`**: Especifica que el servicio `app` depende de `db` para ejecutarse correctamente.

---

### **Volúmenes en Docker Compose**

Los volúmenes son útiles para **persistir datos** y compartir archivos entre contenedores. En Docker Compose, puedes definir volúmenes globalmente o por servicio.

#### **Tipos de volúmenes en Docker**

1. **Volúmenes gestionados por Docker**: Docker se encarga de gestionar el almacenamiento.
   ```yaml
   volumes:
     db_data:  # Volumen gestionado por Docker
   ```

2. **Bind mounts**: Mapea una carpeta del sistema anfitrión directamente al contenedor.
   ```yaml
   services:
     app:
       volumes:
         - ./data:/app/data  # Mapea una carpeta local a una carpeta dentro del contenedor
   ```

#### **Cómo funcionan en Docker Compose**

En el ejemplo anterior:
```yaml
volumes:
  db_data:
```
Este volumen se utilizará para almacenar datos persistentes de PostgreSQL en el servicio `db`. Incluso si detienes o eliminas el contenedor, los datos persistirán.

---

### **Redes en Docker Compose**

Las **redes** permiten que los servicios se comuniquen entre sí dentro del entorno de Docker. Docker Compose crea una red por defecto, pero puedes definir redes adicionales si es necesario.

#### **Cómo definir redes en Docker Compose**

Puedes definir redes personalizadas en el archivo `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    networks:
      - front-end
      - back-end

  db:
    image: postgres:12
    networks:
      - back-end

networks:
  front-end:
  back-end:
```

En este ejemplo:
- El servicio `app` está conectado tanto

 a la red `front-end` como a `back-end`.
- El servicio `db` solo está conectado a `back-end`.
- Esto permite que `app` y `db` se comuniquen entre sí a través de la red `back-end`, pero el acceso a `app` también está disponible en `front-end`.

---

### **Ejemplo práctico con Docker Compose, volúmenes y redes**

Supongamos que quieres crear una aplicación Node.js con PostgreSQL, con volúmenes para persistir los datos de la base de datos y una red interna para la comunicación entre los servicios.

**Archivo `docker-compose.yml`**:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
    environment:
      - DB_HOST=db
      - DB_USER=usuario
      - DB_PASS=contraseña
    depends_on:
      - db
    networks:
      - app-network

  db:
    image: postgres:12
    environment:
      POSTGRES_USER: usuario
      POSTGRES_PASSWORD: contraseña
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - app-network

volumes:
  db_data:

networks:
  app-network:
```

**Explicación**:
- **Volúmenes**: El volumen `db_data` persiste los datos de PostgreSQL, permitiendo que los datos sobrevivan aunque el contenedor de `db` sea eliminado.
- **Redes**: La red `app-network` permite que los servicios `app` y `db` se comuniquen entre sí. El servicio `app` puede acceder a `db` mediante el hostname `db`.

---

### **Buenas prácticas y consejos**

1. **Usar volúmenes para persistir datos importantes**: Usa volúmenes para bases de datos o archivos que necesiten persistir entre reinicios de contenedores.
2. **Utiliza redes para aislar servicios**: Si tienes servicios que no deberían comunicarse con otros, define redes separadas para aislarlos.
3. **Recrear contenedores cuando cambies el código**: Si cambias el código de la aplicación, usa `docker-compose up --build` para recrear los contenedores y asegurarte de que se reflejan los cambios.
4. **Múltiples archivos de Compose para entornos**: Puedes tener varios archivos `docker-compose.yml` para diferentes entornos (desarrollo, producción) y combinarlos con el comando `-f`.

---

### Guía para Limpiar Todo en Docker

#### 1. Detener y Eliminar Todos los Contenedores

Primero, necesitas detener todos los contenedores que estén en ejecución y eliminarlos:

```bash
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
```

- **Explicación**:
  - `docker ps -aq`: Lista los IDs de todos los contenedores (en ejecución o detenidos).
  - `docker stop $(docker ps -aq)`: Detiene todos los contenedores en ejecución.
  - `docker rm $(docker ps -aq)`: Elimina todos los contenedores detenidos.

#### 2. Eliminar Todas las Redes No Predeterminadas

Para asegurarte de que todas las redes que no sean las predeterminadas se eliminen:

```bash
docker network prune
```

- **Explicación**:
  - Este comando elimina todas las redes no utilizadas. Las redes predeterminadas no se verán afectadas.

#### 3. Eliminar Todos los Volúmenes

Para eliminar **todos** los volúmenes, ejecuta el siguiente comando:

```bash
docker volume rm $(docker volume ls -q)
```

- **Explicación**:
  - `docker volume ls -q`: Lista los IDs de todos los volúmenes.
  - `docker volume rm $(docker volume ls -q)`: Elimina todos los volúmenes listados.

#### 4. Eliminar Imágenes y Caché de Docker

Finalmente, puedes usar el siguiente comando para limpiar todas las imágenes, caché y otros elementos innecesarios:

```bash
docker system prune -a --volumes
```

- **Explicación**:
  - `docker system prune`: Elimina todos los recursos no utilizados (contenedores detenidos, redes no utilizadas, imágenes huérfanas y caché).
  - `-a`: Elimina todas las imágenes no utilizadas (incluyendo las no huérfanas).
  - `--volumes`: Elimina todos los volúmenes que no estén en uso.

### Resumen Rápido de Comandos

```bash
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
docker network prune
docker volume rm $(docker volume ls -q)
docker system prune -a --volumes
```

### Advertencia

Estos comandos eliminarán todos los recursos en Docker, por lo que **asegúrate de que no necesitas conservar ninguna imagen, volumen, contenedor o red antes de ejecutarlos**.

### **Recursos adicionales**

- **Documentación oficial de Docker**: [https://docs.docker.com](https://docs.docker.com)
- **Docker Compose Docs**: [https://docs.docker.com/compose/](https://docs.docker.com/compose/)