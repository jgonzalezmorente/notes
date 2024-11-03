# Guía de Uso de Kernels en Jupyter

### Índice

1. [¿Qué es un Kernel en Jupyter?](#1-qué-es-un-kernel-en-jupyter)
2. [¿Para qué se usa un Kernel?](#2-para-qué-se-usa-un-kernel)
3. [¿Cómo se crean los Kernels?](#3-cómo-se-crean-los-kernels)
   - [Pasos para crear un Kernel](#pasos-para-crear-un-kernel)
4. [¿Cómo se listan los Kernels en Jupyter?](#4-cómo-se-listan-los-kernels-en-jupyter)
5. [¿Cómo se eliminan los Kernels en Jupyter?](#5-cómo-se-eliminan-los-kernels-en-jupyter)
6. [Ejemplos avanzados y Tips adicionales](#6-ejemplos-avanzados-y-tips-adicionales)
   - [Renombrar un Kernel](#renombrar-un-kernel)
   - [Actualizar o Reinstalar un Kernel](#actualizar-o-reinstalar-un-kernel)
7. [Resumen](#7-resumen)

---

### 1. ¿Qué es un Kernel en Jupyter?

Un **kernel** en Jupyter es el proceso que ejecuta el código dentro de un notebook. Cada notebook en Jupyter Notebook o JupyterLab necesita un kernel activo para poder ejecutar código. Los kernels permiten que Jupyter soporte múltiples lenguajes, como Python, R, Julia, y más. En el contexto de Python, el kernel más común es **ipykernel**, que permite la ejecución de código Python en notebooks.

### 2. ¿Para qué se usa un Kernel?

- **Ejecutar código**: Cuando ejecutas una celda en un notebook, el kernel interpreta el código y devuelve la salida.
- **Mantener el estado**: El kernel conserva las variables, funciones y cualquier otra información definida en el notebook durante la sesión.
- **Soporte de múltiples lenguajes**: Jupyter puede manejar distintos lenguajes de programación mediante diferentes kernels, permitiendo que un solo entorno soporte múltiples tipos de notebooks.

### 3. ¿Cómo se crean los Kernels?

Para crear un kernel en Jupyter, normalmente necesitas un entorno virtual o una instalación de Python en la que instales `ipykernel`. A continuación se muestra el proceso para crear un kernel basado en Python.

#### Pasos para crear un Kernel

1. **Crea un entorno virtual (opcional pero recomendado)**:

   ```bash
   python -m venv nombre_del_entorno
   source nombre_del_entorno/bin/activate  # Activa el entorno en Linux/macOS
   nombre_del_entorno\Scripts\activate     # Activa el entorno en Windows
   ```

2. **Instala ****`ipykernel`**** en el entorno**:

   ```bash
   pip install ipykernel
   ```

3. **Registra el kernel en Jupyter**:

   - Usa el siguiente comando para registrar el entorno como un kernel de Jupyter:

     ```bash
     python -m ipykernel install --user --name=nombre_del_kernel --display-name "Nombre para mostrar en Jupyter"
     ```

   - **`--user`**: Instala el kernel solo para el usuario actual.

   - **`--name`**: Nombre interno para el kernel.

   - **`--display-name`**: Nombre que aparecerá en Jupyter Notebook o JupyterLab.

#### Ejemplo completo:

```bash
python -m venv data-science
source data-science/bin/activate
pip install ipykernel
python -m ipykernel install --user --name=data-science --display-name "Data Science Kernel"
```

Esto creará un kernel llamado `data-science` y lo registrará como `"Data Science Kernel"` en Jupyter.

### 4. ¿Cómo se listan los Kernels en Jupyter?

Para ver todos los kernels registrados en Jupyter, usa el siguiente comando:

```bash
jupyter kernelspec list
```

Esto mostrará una lista de todos los kernels disponibles y sus ubicaciones. Ejemplo de salida:

```
Available kernels:
  python3       /usr/local/share/jupyter/kernels/python3
  data-science  /Users/usuario/.local/share/jupyter/kernels/data-science
```

### 5. ¿Cómo se eliminan los Kernels en Jupyter?

Si deseas eliminar un kernel específico de Jupyter, puedes usar el siguiente comando:

```bash
jupyter kernelspec uninstall nombre_del_kernel
```

Por ejemplo, para eliminar el kernel `data-science`, ejecuta:

```bash
jupyter kernelspec uninstall data-science
```

### 6. Ejemplos avanzados y Tips adicionales

#### Renombrar un Kernel

Si deseas cambiar el nombre que aparece en Jupyter, puedes editar el archivo `kernel.json` del kernel. Este archivo se encuentra en la ruta donde se registró el kernel, por ejemplo:

```plaintext
~/.local/share/jupyter/kernels/data-science/kernel.json
```

Edita el archivo y modifica el campo `display_name`:

```json
{
  "argv": [
    "/path/to/python",
    "-m",
    "ipykernel_launcher",
    "-f",
    "{connection_file}"
  ],
  "display_name": "Nuevo Nombre para Jupyter",
  "language": "python"
}
```

#### Actualizar o Reinstalar un Kernel

Si necesitas actualizar el kernel (por ejemplo, para cambiar su entorno), puedes:

1. Eliminar el kernel anterior con `jupyter kernelspec uninstall nombre_del_kernel`.
2. Registrar el kernel nuevamente usando `ipykernel`.

### 7. Resumen

- **Crear un Kernel**: Usando `python -m ipykernel install --user --name=<nombre> --display-name "<nombre visible>"`.
- **Listar Kernels**: `jupyter kernelspec list`.
- **Eliminar un Kernel**: `jupyter kernelspec uninstall <nombre>`.
