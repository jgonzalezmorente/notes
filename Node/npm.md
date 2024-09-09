# Guía de Uso de npm

**npm** es la herramienta que te permite gestionar dependencias de JavaScript en tu proyecto, así como ejecutar scripts y publicar paquetes.

### Instalación de npm

npm viene instalado automáticamente cuando instalas **Node.js**. Para verificar que lo tienes instalado, puedes ejecutar:

```bash
npm --version
```

Si necesitas actualizar **npm** a la última versión, puedes hacerlo con:

```bash
npm install -g npm
```

---

### 1. Inicializar un proyecto con npm

El primer paso para empezar un proyecto con npm es inicializar el archivo `package.json`. Este archivo contiene información sobre tu proyecto y sus dependencias.

```bash
npm init
```

Este comando te pedirá varios detalles sobre tu proyecto. Si quieres usar la configuración por defecto, puedes usar:

```bash
npm init -y
```

Esto creará un archivo `package.json` básico.

---

### 2. Instalación de paquetes

Puedes instalar paquetes (librerías o herramientas) en tu proyecto utilizando el siguiente comando:

#### Instalación de un paquete en el proyecto local

```bash
npm install <nombre-del-paquete>
```

Por ejemplo, para instalar **express**:

```bash
npm install express
```

Esto añadirá **express** como una dependencia en tu archivo `package.json` y creará una carpeta `node_modules` donde se almacenará.

#### Instalación global de un paquete

Si deseas instalar un paquete globalmente, para que esté disponible en todo tu sistema, usa la opción `-g`:

```bash
npm install -g <nombre-del-paquete>
```

Por ejemplo, para instalar **gulp-cli** globalmente:

```bash
npm install -g gulp-cli
```

Esto te permitirá usar **gulp-cli** desde cualquier parte del sistema sin estar atado a un proyecto en particular.

---

### 3. Gestión de Dependencias

Hay dos tipos de dependencias que puedes instalar:

#### Dependencias regulares

Estas son dependencias que tu proyecto necesita en producción. Se instalan con:

```bash
npm install <nombre-del-paquete>
```

#### Dependencias de desarrollo

Estas son dependencias que solo necesitas durante el desarrollo (por ejemplo, linters o herramientas de testing). Se instalan con la opción `--save-dev`:

```bash
npm install --save-dev <nombre-del-paquete>
```

Por ejemplo, para instalar **jest** como dependencia de desarrollo:

```bash
npm install --save-dev jest
```

---

### 4. Desinstalar paquetes

Si necesitas eliminar un paquete, puedes usar el siguiente comando:

#### Desinstalar un paquete localmente

```bash
npm uninstall <nombre-del-paquete>
```

Esto eliminará el paquete de `node_modules` y lo quitará del archivo `package.json`.

#### Desinstalar un paquete globalmente

```bash
npm uninstall -g <nombre-del-paquete>
```

---

### 5. Actualización de paquetes

Para actualizar un paquete a su última versión, puedes usar el siguiente comando:

```bash
npm update <nombre-del-paquete>
```

Si deseas actualizar todas las dependencias de tu proyecto, puedes ejecutar:

```bash
npm update
```

#### Actualizar globalmente

Si quieres actualizar los paquetes instalados globalmente, usa el siguiente comando:

```bash
npm update -g
```

---

### 6. Ejecución de scripts

En el archivo `package.json` puedes definir scripts que ejecuten comandos específicos, por ejemplo:

```json
"scripts": {
  "start": "node app.js",
  "test": "jest"
}
```

Luego puedes ejecutar estos scripts con el siguiente comando:

```bash
npm run <nombre-del-script>
```

Por ejemplo:

```bash
npm run start
```

El script `start` es especial, y puedes ejecutarlo sin usar `run`:

```bash
npm start
```

---

### 7. Instalación de una versión específica de un paquete

Si necesitas instalar una versión específica de un paquete, puedes hacerlo especificando la versión después del nombre del paquete:

```bash
npm install <nombre-del-paquete>@<versión>
```

Por ejemplo, para instalar **express** versión 4.17.1:

```bash
npm install express@4.17.1
```

---

### 8. Reinstalación de dependencias

Si necesitas reinstalar todas las dependencias (por ejemplo, después de clonar un proyecto desde un repositorio), puedes usar el siguiente comando:

```bash
npm install
```

Esto instalará todas las dependencias listadas en `package.json`.

---

### 9. Limpiar el caché de npm

A veces es útil limpiar el caché de **npm**, especialmente si tienes problemas con las instalaciones de paquetes. Puedes hacerlo con:

```bash
npm cache clean --force
```

---

### 10. Paquetes globales y locales

- **Paquetes locales**: Instalados solo para el proyecto actual y almacenados en la carpeta `node_modules`.
- **Paquetes globales**: Instalados para que estén disponibles en todo el sistema y puedes usarlos en cualquier proyecto sin tener que instalarlos localmente.

Para ver todos los paquetes instalados globalmente:

```bash
npm list -g --depth 0
```

---

### 11. Ver detalles de un paquete

Si quieres ver más detalles sobre un paquete, como su versión, dependencias, etc., puedes usar el siguiente comando:

```bash
npm info <nombre-del-paquete>
```

---

### 12. Publicar un paquete en npm

Si has desarrollado un paquete y quieres publicarlo en el registro de npm, puedes hacerlo de la siguiente manera:

1. Asegúrate de que has iniciado sesión en npm:

   ```bash
   npm login
   ```

2. Publica tu paquete:

   ```bash
   npm publish
   ```

---

### Resumen de Comandos Clave

| Comando                              | Descripción                                         |
| ------------------------------------ | --------------------------------------------------- |
| `npm init`                           | Inicializa un nuevo proyecto y crea `package.json`. |
| `npm install`                        | Instala todas las dependencias listadas en `package.json`. |
| `npm install <paquete>`              | Instala un paquete en el proyecto.                  |
| `npm install -g <paquete>`           | Instala un paquete globalmente.                     |
| `npm uninstall <paquete>`            | Desinstala un paquete del proyecto.                 |
| `npm update <paquete>`               | Actualiza un paquete a la última versión.           |
| `npm run <script>`                   | Ejecuta un script definido en `package.json`.       |
| `npm list`                           | Lista las dependencias instaladas.                  |
| `npm list -g --depth 0`              | Lista los paquetes globales instalados.             |
| `npm info <paquete>`                 | Muestra información detallada sobre un paquete.     |
| `npm cache clean --force`            | Limpia el caché de npm.                             |
| `npm publish`                        | Publica un paquete en el registro de npm.           |