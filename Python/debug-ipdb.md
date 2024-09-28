### Introducción a `ipdb`
`ipdb` es una versión mejorada de `pdb`, el depurador estándar de Python. Se integra con IPython, lo que significa que puedes aprovechar las características interactivas de IPython, como el autocompletado, el historial de comandos y otras mejoras mientras depuras tu código.

### Instalación
Para instalar `ipdb`, puedes hacerlo con `pip`:

```bash
pip install ipdb
```

### Uso básico
Para usar `ipdb`, simplemente importa el módulo e inserta `ipdb.set_trace()` donde desees detener la ejecución y entrar en el modo de depuración:

```python
import ipdb

def suma(a, b):
    ipdb.set_trace()  # Detiene la ejecución aquí
    resultado = a + b
    return resultado

resultado = suma(5, 10)
```

Cuando el código se detiene en `ipdb.set_trace()`, entrarás en el modo interactivo de depuración, donde podrás inspeccionar variables, ejecutar comandos paso a paso y ajustar tu código según sea necesario.

### Comandos básicos de `ipdb`

Estos son los comandos más utilizados en `ipdb`:

| Comando | Descripción |
|---------|-------------|
| `n` (next) | Ejecuta la siguiente línea de código dentro del mismo nivel de la pila. |
| `s` (step) | Entra en la siguiente función llamada, si hay alguna en la línea actual. |
| `c` (continue) | Continúa la ejecución hasta el siguiente punto de ruptura o el final del programa. |
| `q` (quit) | Sale del depurador y del programa actual. |
| `l` (list) | Muestra el código fuente alrededor de la línea actual. |
| `p` (print) | Imprime el valor de una variable o expresión. |
| `b` (break) | Establece un punto de ruptura en una línea específica. |
| `cl` (clear) | Elimina puntos de ruptura. |
| `r` (return) | Continúa la ejecución hasta que la función actual retorne. |
| `u` (up) | Sube un nivel en la pila de llamadas. |
| `d` (down) | Baja un nivel en la pila de llamadas. |
| `ll` (longlist) | Muestra todo el código fuente de la función actual. |
| `h` (help) | Muestra ayuda interactiva para el uso de `ipdb`. |

### Establecer puntos de ruptura (`b`)
Puedes establecer puntos de ruptura en tu código de diferentes maneras. Por ejemplo, para establecer un punto de ruptura en una línea específica:

```bash
(ipdb) b 15  # Establece un punto de ruptura en la línea 15 del archivo actual
```

O puedes establecerlo en una función específica:
```bash
(ipdb) b mi_modulo.mi_funcion  # Establece un punto de ruptura en la función `mi_funcion`
```

Para listar todos los puntos de ruptura, utiliza:
```bash
(ipdb) b
```

### Continuar la ejecución (`c`)
Después de establecer los puntos de ruptura, puedes continuar la ejecución hasta el siguiente punto de interrupción utilizando el comando `c` (continue).

```bash
(ipdb) c
```

### Avanzar línea por línea (`n` y `s`)
- `n` (next): Ejecuta la siguiente línea de código sin entrar en funciones anidadas.
- `s` (step): Entra dentro de las funciones llamadas en la línea actual y las ejecuta paso a paso.

### Inspección de variables
Para ver el valor de una variable, simplemente escribe el nombre de la variable o usa el comando `p` (print):
```bash
(ipdb) p variable
```

También puedes usar `whatis` para ver el tipo de la variable:
```bash
(ipdb) whatis variable
```

Para ver todas las variables locales en el ámbito actual:
```bash
(ipdb) locals()
```

Y para ver las variables globales:
```bash
(ipdb) globals()
```

### Eliminar puntos de ruptura (`cl`)
Si deseas eliminar un punto de ruptura, puedes hacerlo con el comando `cl` seguido del número del punto de ruptura:
```bash
(ipdb) cl 1  # Elimina el punto de ruptura número 1
```

Si deseas eliminar todos los puntos de ruptura:
```bash
(ipdb) cl
```

### Listar el código fuente (`l` y `ll`)
- `l` (list): Muestra una porción del código fuente alrededor de la línea actual.
- `ll` (longlist): Muestra todo el código fuente de la función actual.

### Avanzar en la pila de llamadas (`u` y `d`)
- `u` (up): Sube un nivel en la pila de llamadas, útil para inspeccionar el contexto de la función que llamó a la actual.
- `d` (down): Baja un nivel en la pila de llamadas, útil para volver al contexto de la función actual después de haber subido con `u`.

### Regresar de una función (`r`)
El comando `r` (return) continúa la ejecución hasta que la función actual regresa:
```bash
(ipdb) r
```

### Comandos adicionales útiles
- **`a` (args)**: Muestra los argumentos de la función actual.
- **`bt` (backtrace)**: Muestra el rastro de la pila de llamadas.
- **`!`**: Ejecuta código Python arbitrario directamente en el depurador.
  ```bash
  (ipdb) !resultado = suma(5, 10)
  ```

### Depuración condicional
Puedes establecer puntos de ruptura condicionales que solo se activarán cuando se cumpla una condición. Esto es útil para evitar detenerse en cada iteración de un bucle.

```bash
(ipdb) b 10, x > 5  # Solo se activará si x > 5 en la línea 10
```

### Uso de `%debug` en Jupyter Notebook
En un entorno Jupyter Notebook, puedes utilizar el comando mágico `%debug` para entrar en modo de depuración después de que ocurra una excepción. Por ejemplo:

```python
def division(a, b):
    return a / b

division(5, 0)  # Esto lanza una excepción
```

Después de que ocurra la excepción, puedes ejecutar `%debug` en una nueva celda para entrar en el modo de depuración y ver el estado del programa en el momento del error.

### Resumen de comandos clave de `ipdb`

| Comando | Descripción |
|---------|-------------|
| `n` (next) | Ejecuta la siguiente línea de código dentro del mismo nivel de la pila. |
| `s` (step) | Entra en la siguiente función llamada, si hay alguna en la línea actual. |
| `c` (continue) | Continúa la ejecución hasta el siguiente punto de ruptura o el final del programa. |
| `q` (quit) | Sale del depurador y del programa actual. |
| `l` (list) | Muestra el código fuente alrededor de la línea actual. |
| `p variable` | Imprime el valor de una variable. |
| `b` (break) | Establece un punto de ruptura. |
| `cl` (clear) | Elimina puntos de ruptura. |
| `r` (return) | Continúa la ejecución hasta que la función actual retorne. |
| `u` (up) | Sube un nivel en la pila de llamadas. |
| `d` (down) | Baja un nivel en la pila de llamadas. |
| `ll` (longlist) | Muestra todo el código fuente de la función actual. |
| `a` (args) | Muestra los argumentos de la función actual. |
| `bt` (backtrace) | Muestra el rastro de la pila de llamadas. |
| `whatis variable` | Muestra el tipo de una variable. |

### Conclusión

`ipdb` es una herramienta poderosa y versátil para depurar código Python, proporcionando una experiencia mejorada en comparación con el depurador estándar `pdb`. Con su integración con IPython, `ipdb` te ofrece un entorno interactivo más rico, con características como el autocompletado, historial y manejo más intuitivo de comandos.

Ya sea que estés depurando código en un proyecto pequeño o estés trabajando en scripts más complejos, `ipdb` puede hacer que el proceso sea más eficiente y fluido. Si necesitas ayuda adicional o quieres profundizar en algún comando en particular, no dudes en preguntar.