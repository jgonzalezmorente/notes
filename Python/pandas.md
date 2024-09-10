# **Guía Completa de Pandas para Python**

## **1. Instalación y configuración**

Antes de comenzar, asegúrate de instalar Pandas:

```bash
pip install pandas
```

Luego, impórtala en tu script:

```python
import pandas as pd
```

---

## **2. Estructuras principales: DataFrame y Series**

### **2.1. Series**

#### ¿Qué es una Series?
Una **Series** es una estructura unidimensional en Pandas, similar a una lista o columna en una tabla. Cada valor tiene un índice, lo que permite acceder a los elementos de manera eficiente.

#### Crear una Series:
```python
s = pd.Series([25, 30, 35, 40], index=['Ana', 'Luis', 'Pedro', 'Marta'])
print(s)
```

Salida:
|     |   |
|-----|---|
| Ana   | 25 |
| Luis  | 30 |
| Pedro | 35 |
| Marta | 40 |

### **2.2. DataFrame**

#### ¿Qué es un DataFrame?
Un **DataFrame** es una estructura bidimensional (como una tabla) en la que se organizan los datos en filas y columnas. Cada columna es una Series.

#### Crear un DataFrame:
```python
data = {
    "Nombre": ["Ana", "Luis", "Pedro", "Marta"],
    "Edad": [25, 30, 35, 40],
    "Ciudad": ["Madrid", "Barcelona", "Valencia", "Madrid"],
    "Salario": [3000, 3500, 4000, 4500]
}

df = pd.DataFrame(data)
print(df)
```

Salida:
| Nombre | Edad | Ciudad     | Salario |
|--------|------|------------|---------|
| Ana    | 25   | Madrid     | 3000    |
| Luis   | 30   | Barcelona  | 3500    |
| Pedro  | 35   | Valencia   | 4000    |
| Marta  | 40   | Madrid     | 4500    |

---

## **3. Operaciones básicas con DataFrames**

### **3.1. Ver los primeros y últimos datos**

- **Ver las primeras filas**:
```python
df.head()  # Muestra las primeras 5 filas por defecto
```

- **Ver las últimas filas**:
```python
df.tail()  # Muestra las últimas 5 filas
```

### **3.2. Acceder a columnas**
```python
df["Nombre"]  # Devuelve una Series
```

Acceder a varias columnas:
```python
df[["Nombre", "Edad"]]  # Devuelve un DataFrame
```

### **3.3. Acceder a filas**

- **Por índice (con `iloc`)**:
```python
df.iloc[0]  # Primera fila
```

- **Por etiquetas (con `loc`)**:
```python
df.loc[0]  # Primera fila según el índice
```

### **3.4. Modificar valores**

Modificar el valor de una celda:
```python
df.at[0, 'Edad'] = 26
```

Modificar una columna completa:
```python
df["Edad"] += 1
```

---

## **4. Operaciones avanzadas con DataFrames**

### **4.1. Filtrar datos**

Filtrar por una condición:
```python
df_filtrado = df[df["Edad"] > 30]
```

Filtrar con varias condiciones:
```python
df_filtrado = df[(df["Edad"] > 30) & (df["Ciudad"] == "Madrid")]
```

### **4.2. Ordenar datos**
```python
df_sorted = df.sort_values(by="Edad", ascending=False)
```

### **4.3. Agrupar datos**

Agrupar por columna y calcular agregados:
```python
df_grouped = df.groupby("Ciudad")["Salario"].mean()
```

### **4.4. Aplicar funciones**
```python
df["Salario_modificado"] = df["Salario"].apply(lambda x: x * 1.1)
```

---

## **5. Operaciones con datos faltantes (Missing Data)**

### **5.1. Detectar valores faltantes**
```python
df.isna().sum()  # Número de NaN por columna
```

### **5.2. Rellenar valores faltantes**
```python
df["Edad"].fillna(df["Edad"].mean(), inplace=True)
```

### **5.3. Eliminar filas o columnas con NaN**
```python
df.dropna()  # Elimina filas con NaN
```

---

## **6. Operaciones con fechas**

### **6.1. Convertir a formato de fecha**
```python
df["Fecha"] = pd.to_datetime(df["Fecha"], format='%d/%m/%Y')
```

### **6.2. Extraer partes de la fecha**
```python
df["Año"] = df["Fecha"].dt.year
df["Mes"] = df["Fecha"].dt.month
```

---

## **7. Lectura y escritura de archivos**

### **7.1. Leer archivos**

Leer un archivo CSV:
```python
df = pd.read_csv("archivo.csv")
```

Leer un archivo Excel:
```python
df = pd.read_excel("archivo.xlsx", sheet_name="Hoja1")
```

### **7.2. Guardar archivos**

Guardar como CSV:
```python
df.to_csv("salida.csv", index=False)
```

Guardar como Excel:
```python
df.to_excel("salida.xlsx", sheet_name="Hoja1", index=False)
```

---

## **8. Fusionar y concatenar DataFrames**

### **8.1. Concatenar DataFrames**
```python
df_concatenado = pd.concat([df1, df2], axis=0)  # Añade filas
```

### **8.2. Merge (equivalente a JOIN en SQL)**
```python
df_merged = pd.merge(df1, df2, on="id_empleado", how="left")
```

---

## **9. Tablas pivote**

### **9.1. Crear una tabla pivote**
```python
pivot_table = df.pivot_table(values="Salario", index="Ciudad", columns="Género", aggfunc="mean")
```

Salida:
| Género    | F     | M     |
|-----------|-------|-------|
| Barcelona | 3800  | 3500  |
| Madrid    | 3750  | NaN   |
| Valencia  | NaN   | 4100  |

### **9.2. Deshacer una tabla pivote con `melt`**
```python
df_melted = pd.melt(df, id_vars=["Ciudad"], value_vars=["Salario", "Género"])
```

---

## **10. Estadísticas descriptivas**

Obtener estadísticas básicas:
```python
df.describe()
```

Obtener la media de una columna:
```python
df["Edad"].mean()
```

---

## **11. Graficar con Pandas**

Pandas tiene integración con **Matplotlib** para gráficos rápidos:

```python
import matplotlib.pyplot as plt
df["Edad"].plot(kind="hist")
plt.show()
```

---

## **12. Iterar sobre DataFrames**

### **12.1. Usar `iterrows()`**

**¿Qué es `iterrows()`?**

`iterrows()` devuelve cada fila de un DataFrame como una tupla `(índice, Series)`. Esto permite acceder a los datos de una fila.

#### Ejemplo:
```python
for index, row in df.iterrows():
    print(index, row["Nombre"], row["Edad"])
```

### **12.2. Usar `itertuples()`**

**¿Qué es `itertuples()`?**

`itertuples()` es más rápido que `iterrows()` y devuelve cada fila como una tupla nombrada.

#### Ejemplo:
```python
for row in df.itertuples():
    print(row.Nombre, row.Edad)
```

---

## **13. Buenas prácticas y optimización**

### **13.1. Operaciones vectorizadas**

Pandas está optimizado para realizar operaciones directamente sobre columnas (operaciones vectorizadas). Por ejemplo:

```python
df["Nueva_Columna"] = df["Columna1"] + df["Columna2"]
```

Esta es mucho más rápida que iterar sobre filas usando un bucle `for`.

### **13.2. Optimización de tipos de datos**

Para optimizar el uso de memoria, puedes cambiar el tipo de datos de una columna:

```python
df["Edad"] = pd.to_numeric(df["Edad"], downcast="integer")
```

---

## **Conclusión**

Pandas es una biblioteca increíblemente poderosa para la manipulación de datos en Python. Con esta guía, cubres desde lo básico (creación y manejo de DataFrames) hasta operaciones avanzadas (tablas pivote, iteración eficiente, optimización). Recuerda que Pandas está diseñado para trabajar de manera **vectorizada**, lo que permite que las operaciones sobre columnas sean rápidas y eficientes.

Esta guía está pensada para darte una comprensión sólida y práctica de cómo trabajar con Pandas, permitiéndote manipular y analizar datos de manera eficiente en

 tus proyectos.