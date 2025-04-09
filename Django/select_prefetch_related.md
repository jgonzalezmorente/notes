# Guía práctica: `select_related` y `prefetch_related` en Django

## ¿Qué son?

Estos métodos se utilizan para **optimizar el acceso a la base de datos** cuando trabajas con modelos relacionados, reduciendo el número de consultas SQL y mejorando el rendimiento de tu aplicación.

| Método             | Tipo de relación                    | Consultas generadas      | Cuándo usarlo                                      |
|--------------------|--------------------------------------|---------------------------|----------------------------------------------------|
| `select_related`   | `ForeignKey`, `OneToOneField`        | Una sola consulta (JOIN)  | Relaciones uno-a-uno o muchos-a-uno               |
| `prefetch_related` | `ManyToMany`, relaciones inversas    | Varias consultas optimizadas | Relaciones uno-a-muchos o muchos-a-muchos     |

---

## Modelos utilizados en los ejemplos

```python
class Author(models.Model):
    name = models.CharField(max_length=100)

class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.ForeignKey(Author, null=True, on_delete=models.SET_NULL)
    categories = models.ManyToManyField('Category', blank=True)

class Category(models.Model):
    name = models.CharField(max_length=50)
```

---

## `select_related`: carga mediante JOIN (una sola consulta)

### Ejemplo
```python
books = Book.objects.select_related('author').all()

for book in books:
    print(book.author.name)
```

### Consulta SQL generada
```sql
SELECT * FROM book
INNER JOIN author ON book.author_id = author.id;
```

### Cuándo usarlo
- Para relaciones `ForeignKey` o `OneToOneField`.
- Cuando accedes frecuentemente a datos del modelo relacionado.
- Nota: usa `INNER JOIN`, por lo que omite filas cuyo `author_id` sea `NULL`.

---

## `prefetch_related`: múltiples consultas optimizadas

### Ejemplo
```python
authors = Author.objects.prefetch_related('book_set').all()

for author in authors:
    for book in author.book_set.all():
        print(book.title)
```

### Consultas SQL generadas
1. `SELECT * FROM author;`
2. `SELECT * FROM book WHERE author_id IN (...);`

### Cuándo usarlo
- Para relaciones uno-a-muchos o muchos-a-muchos.
- Especialmente útil en relaciones inversas (`author.book_set`) o `ManyToManyField`.

---

## Ejemplo avanzado: `ManyToManyField` con `Prefetch`

### Objetivo
Mostrar todos los autores, los libros de cada autor, y las categorías de cada libro.

```python
from django.db.models import Prefetch

authors = Author.objects.prefetch_related(
    Prefetch('book_set__categories')
).all()

for author in authors:
    print(f"Autor: {author.name}")
    for book in author.book_set.all():
        print(f"  Libro: {book.title}")
        for category in book.categories.all():
            print(f"    Categoría: {category.name}")
```

### Consultas SQL generadas
1. `SELECT * FROM author;`
2. `SELECT * FROM book WHERE author_id IN (...);`
3. `SELECT * FROM category INNER JOIN book_categories ON ... WHERE book_id IN (...);`

### Resultado
Tres consultas, sin importar cuántos autores, libros o categorías haya. Todos los datos quedan cacheados.

---

## Uso avanzado: `Prefetch` con filtro y atributo personalizado

### Filtro y cambio de nombre con `to_attr`
```python
from django.db.models import Prefetch

authors = Author.objects.prefetch_related(
    Prefetch(
        'book_set',
        queryset=Book.objects.filter(title__icontains='Python'),
        to_attr='python_books'
    )
)

for author in authors:
    for book in author.python_books:
        print(book.title)
```

### Cuándo usar `Prefetch`
- Para filtrar, ordenar o anotar el queryset relacionado.
- Para cambiar el nombre del atributo con `to_attr`.
- Para evitar conflictos de nombres o mejorar la legibilidad.

---

## Cómo inspeccionar las consultas generadas

En consola:
```python
from django.db import connection

print(len(connection.queries))
for q in connection.queries:
    print(q['sql'])
```

O usando `django-debug-toolbar` para una visualización completa en el navegador.

---

## Resumen

- Usa `select_related` para relaciones simples (uno-a-uno, muchos-a-uno).
- Usa `prefetch_related` para relaciones múltiples o inversas (uno-a-muchos, muchos-a-muchos).
- Usa `Prefetch` cuando necesitas más control sobre las relaciones: filtrado, anotaciones o cambio de nombre con `to_attr`.
- No uses estas técnicas si no necesitas los datos relacionados: pueden consumir más memoria sin necesidad.
