# Guía de Uso de NVM (Node Version Manager)

**nvm** es una herramienta para gestionar múltiples versiones de Node.js en tu sistema, lo que es especialmente útil cuando trabajas en proyectos que requieren versiones diferentes de Node.js.

### Instalación de **nvm**

#### Instalación con **Homebrew** (macOS)

Si estás en macOS, una manera sencilla de instalar **nvm** es utilizando **Homebrew**:

1. Asegúrate de tener Homebrew instalado. Si no lo tienes, puedes instalarlo con este comando:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. Instala **nvm** usando Homebrew:

   ```bash
   brew install nvm
   ```

3. Crea un directorio para **nvm** en tu carpeta de inicio:

   ```bash
   mkdir ~/.nvm
   ```

4. Añade estas líneas a tu archivo de configuración del shell (`~/.bashrc`, `~/.zshrc`, o `~/.bash_profile`):

   ```bash
   export NVM_DIR="$HOME/.nvm"
   [ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh" # This loads nvm
   ```

5. Recarga el archivo de configuración del shell con el siguiente comando:

   ```bash
   source ~/.bashrc  # o el archivo correspondiente si usas otro shell
   ```

6. Verifica que **nvm** está instalado correctamente con:

   ```bash
   nvm --version
   ```

#### Instalación Manual

Si prefieres instalar **nvm** manualmente (para sistemas Linux o macOS sin Homebrew), puedes usar el siguiente comando:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
```

Y sigue los mismos pasos de configuración explicados en la sección anterior.

---

### Uso de **nvm**

#### Instalación de una versión específica de Node.js

Para instalar una versión específica de Node.js, simplemente usa:

```bash
nvm install <versión>
```

Por ejemplo, para instalar la versión 16.15.0:

```bash
nvm install 16.15.0
```

Esto descargará e instalará la versión especificada de Node.js.

#### Listar las versiones de Node.js instaladas

Para ver todas las versiones que has instalado en tu sistema:

```bash
nvm ls
```

Esto mostrará todas las versiones de Node.js que tienes instaladas y cuál es la versión activa.

#### Cambiar de versión de Node.js

Puedes cambiar de versión de Node.js con el siguiente comando:

```bash
nvm use <versión>
```

Por ejemplo, para usar la versión 14.18.0:

```bash
nvm use 14.18.0
```

Si quieres establecer una versión como predeterminada, usa:

```bash
nvm alias default <versión>
```

#### Listar todas las versiones disponibles de Node.js

Para ver todas las versiones de Node.js disponibles que puedes instalar con **nvm**:

```bash
nvm ls-remote
```

#### Desinstalar una versión de Node.js

Si deseas desinstalar una versión de Node.js:

```bash
nvm uninstall <versión>
```

Por ejemplo, para desinstalar la versión 12.22.0:

```bash
nvm uninstall 12.22.0
```

#### Instalación de paquetes globales en una versión específica

Cada versión de Node.js tiene su propio conjunto de paquetes globales. Para instalar un paquete global en una versión específica de Node.js, asegúrate de estar usando la versión correcta:

```bash
nvm use <versión>
npm install -g <paquete>
```

#### Mantener los paquetes globales al actualizar Node.js

Para copiar los paquetes globales de una versión antigua de Node.js a una nueva, usa el siguiente comando:

```bash
nvm reinstall-packages <versión-antigua>
```

Ejemplo:

```bash
nvm install 16.15.0
nvm reinstall-packages 14.18.0
```

### Usar un archivo `.nvmrc` en proyectos

Puedes crear un archivo `.nvmrc` en la raíz de tu proyecto con el número de versión de Node.js requerida. Luego, cuando trabajes en ese proyecto, simplemente puedes ejecutar:

```bash
nvm use
```

Esto hará que **nvm** use la versión indicada en el archivo `.nvmrc`.