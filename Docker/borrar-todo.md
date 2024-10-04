
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