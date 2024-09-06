### Guía de uso de `pyenv` y `pyenv-virtualenv`

`pyenv` es una herramienta para gestionar diferentes versiones de Python en tu sistema. `pyenv-virtualenv` es un complemento que añade la capacidad de gestionar entornos virtuales para cada versión de Python que tengas instalada.

#### Instalación de `pyenv` y `pyenv-virtualenv`

##### En macOS y Linux
1. **Instala las dependencias necesarias**:

   ```bash
   # Para macOS
   brew install pyenv pyenv-virtualenv

   # Para Linux (ejemplo con Ubuntu/Debian)
   sudo apt-get update
   sudo apt-get install -y make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev libncursesw5-dev xz-utils tk-dev libffi-dev liblzma-dev python3-openssl git
   ```

2. **Configura `pyenv` en tu shell**:
   Añade estas líneas a tu archivo `.bashrc` o `.zshrc`:

   ```bash
   export PATH="$HOME/.pyenv/bin:$PATH"
   eval "$(pyenv init --path)"
   eval "$(pyenv init -)"
   eval "$(pyenv virtualenv-init -)"
   ```

   Luego, reinicia tu shell:

   ```bash
   exec "$SHELL"
   ```

##### En Windows
Para Windows, la alternativa más fácil es usar [pyenv-win](https://github.com/pyenv-win/pyenv-win). No obstante, el proceso difiere un poco, y la funcionalidad de `pyenv-virtualenv` no está disponible de forma nativa. Puedes usar `venv` o `virtualenv`.

### Uso básico de `pyenv`

1. **Listar todas las versiones de Python disponibles**:

   ```bash
   pyenv install --list
   ```

   Esto muestra una lista de versiones de Python que puedes instalar con `pyenv`.

2. **Instalar una versión específica de Python**:

   ```bash
   pyenv install 3.x.x
   ```

3. **Listar versiones de Python instaladas**:

   ```bash
   pyenv versions
   ```

4. **Cambiar la versión global de Python** (la que se utilizará por defecto):

   ```bash
   pyenv global 3.x.x
   ```

5. **Establecer una versión local de Python en un proyecto** (solo aplicable dentro del directorio del proyecto):

   ```bash
   pyenv local 3.x.x
   ```

6. **Comprobar la versión de Python actual**:

   ```bash
   python --version
   ```

7. **Eliminar una versión de Python**:

   ```bash
   pyenv uninstall 3.x.x
   ```

### Uso de `pyenv-virtualenv`

`pyenv-virtualenv` te permite crear entornos virtuales basados en las versiones de Python instaladas con `pyenv`.

1. **Crear un entorno virtual**:

   ```bash
   pyenv virtualenv 3.x.x my-virtualenv
   ```

   - `3.x.x`: La versión de Python en la que se basa el entorno virtual.
   - `my-virtualenv`: El nombre que le das al entorno virtual.

2. **Activar un entorno virtual**:

   ```bash
   pyenv activate my-virtualenv
   ```

3. **Desactivar un entorno virtual**:

   ```bash
   pyenv deactivate
   ```

4. **Listar todos los entornos virtuales**:

   ```bash
   pyenv virtualenvs
   ```

5. **Eliminar un entorno virtual**:

   ```bash
   pyenv uninstall my-virtualenv
   ```

6. **Activación automática**:
   Si estás en un proyecto y quieres activar un entorno virtual automáticamente al entrar en el directorio, puedes usar un archivo `.python-version`:

   ```bash
   pyenv local my-virtualenv
   ```

### Ubicación de los entornos virtuales

Los entornos virtuales creados con `pyenv-virtualenv` se guardan en el directorio:

```bash
~/.pyenv/versions/
```

Dentro de este directorio, verás las versiones de Python instaladas, así como los entornos virtuales que creaste.

#### Notas adicionales:

- **Integración con `pipenv`**: Si prefieres usar `pipenv` para gestionar dependencias, puedes configurarlo para usar versiones de Python instaladas con `pyenv`.
  
- **Problemas comunes**: Si tienes problemas con la compilación de algunas versiones de Python, asegúrate de tener instaladas las dependencias correctas (en Linux). Algunas versiones requieren `openssl` o `readline`.
