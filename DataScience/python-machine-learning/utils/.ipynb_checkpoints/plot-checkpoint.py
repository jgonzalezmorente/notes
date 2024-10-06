import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap

# Función para graficar las regiones de decisión del clasificador
def plot_decision_regions(X, y, classifier, resolution=0.02):
    # Definir un generador de marcadores y un mapa de colores para las clases
    markers = ('s', 'x', 'o', '^', 'v')  # Diferentes marcadores para las clases
    colors = ('red', 'blue', 'lightgreen', 'gray', 'cyan')  # Colores para las clases
    cmap = ListedColormap(colors[:len(np.unique(y))])  # Mapa de colores ajustado al número de clases únicas en y

    # Representar la superficie de decisión
    # Calcular los límites de los ejes en la característica 1 (x1) y característica 2 (x2)
    x1_min, x1_max = X[:, 0].min() - 1, X[:, 0].max() + 1  # Límite mínimo y máximo de x1 con margen
    x2_min, x2_max = X[:, 1].min() - 1, X[:, 1].max() + 1  # Límite mínimo y máximo de x2 con margen

    # Crear una cuadrícula de puntos dentro de los límites establecidos
    # np.meshgrid genera dos matrices 2D que contienen todas las combinaciones de coordenadas x1 y x2.
    # La matriz xx1 tendrá el mismo número de filas y columnas que la matriz xx2.
    # Cada elemento de xx1 contiene el valor correspondiente del vector de coordenadas x1 repetido por filas.
    # Cada elemento de xx2 contiene el valor correspondiente del vector de coordenadas x2 repetido por columnas.
    # Ejemplo de salida: si np.arange(x1_min, x1_max, resolution) genera [1, 2, 3] y np.arange(x2_min, x2_max, resolution) genera [4, 5], 
    # entonces:
    # xx1:
    # [[1, 2, 3],
    #  [1, 2, 3]]
    # xx2:
    # [[4, 4, 4],
    #  [5, 5, 5]]
    xx1, xx2 = np.meshgrid(
        np.arange(x1_min, x1_max, resolution),  # Coordenadas x1 dentro del rango con la resolución especificada
        np.arange(x2_min, x2_max, resolution)   # Coordenadas x2 dentro del rango con la resolución especificada
    )

    # Predecir la clase para cada punto en la cuadrícula generada
    
    # Aplanar las cuadrículas, hacer predicciones y transponer para el clasificador
    Z = classifier.predict(np.array([xx1.ravel(), xx2.ravel()]).T) 
    Z = Z.reshape(xx1.shape)  # Ajustar la forma de las predicciones a la cuadrícula original para poder graficar

    # Dibujar la superficie de decisión en el gráfico
    plt.contourf(xx1, xx2, Z, alpha=0.3, cmap=cmap)  # Usar contourf para rellenar las regiones con colores de clase
    plt.xlim(xx1.min(), xx1.max())  # Establecer límites del gráfico en el eje x (característica 1)
    plt.ylim(xx2.min(), xx2.max())  # Establecer límites del gráfico en el eje y (característica 2)

    # Graficar los puntos de datos reales
    for idx, cl in enumerate(np.unique(y)):  # Iterar sobre las clases únicas en y
        plt.scatter(
            x=X[y==cl, 0],  # Puntos de característica 1 para la clase cl
            y=X[y==cl, 1],  # Puntos de característica 2 para la clase cl
            alpha=0.8,  # Transparencia de los puntos
            c=colors[idx],  # Color correspondiente a la clase
            marker=markers[idx],  # Marcador correspondiente a la clase
            label=cl,  # Etiqueta de la clase
            edgecolor='black' if markers[idx] != 'x' else None # Borde negro alrededor de los puntos para mejor visibilidad
        )