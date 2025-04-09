# Practical Guide: `select_related` and `prefetch_related` in Django

## What are they?

These Django ORM methods are used to **optimize database access** when dealing with related models. They reduce the number of SQL queries and improve performance by efficiently loading related objects.

| Method             | Relation Type                      | Queries Generated          | When to Use                                     |
|--------------------|-------------------------------------|-----------------------------|--------------------------------------------------|
| `select_related`   | `ForeignKey`, `OneToOneField`       | Single query (JOIN)         | One-to-one or many-to-one relationships          |
| `prefetch_related` | `ManyToMany`, reverse relationships | Multiple optimized queries  | One-to-many or many-to-many relationships        |

---

## Models used in the examples

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

## `select_related`: loads using JOIN (one single query)

### Example
```python
books = Book.objects.select_related('author').all()

for book in books:
    print(book.author.name)
```

### SQL query generated
```sql
SELECT * FROM book
INNER JOIN author ON book.author_id = author.id;
```

### When to use
- For `ForeignKey` or `OneToOneField` relationships.
- When you frequently access fields of the related model.
- Note: It uses `INNER JOIN`, so rows with `NULL` foreign keys are excluded.

---

## `prefetch_related`: multiple optimized queries

### Example
```python
authors = Author.objects.prefetch_related('book_set').all()

for author in authors:
    for book in author.book_set.all():
        print(book.title)
```

### SQL queries executed
1. `SELECT * FROM author;`
2. `SELECT * FROM book WHERE author_id IN (...);`

### When to use
- For reverse relationships (`book_set`) and `ManyToManyField`.
- When you need to retrieve collections of related objects efficiently.

---

## Advanced example: `ManyToManyField` with `Prefetch`

### Goal
Display each author, their books, and the categories of each book.

```python
from django.db.models import Prefetch

authors = Author.objects.prefetch_related(
    Prefetch('book_set__categories')
).all()

for author in authors:
    print(f"Author: {author.name}")
    for book in author.book_set.all():
        print(f"  Book: {book.title}")
        for category in book.categories.all():
            print(f"    Category: {category.name}")
```

### SQL queries executed
1. Query for all authors
2. Query for books by those authors
3. Query for categories linked to those books (via many-to-many table)

Only three queries are made, no matter how many authors, books, or categories exist.

---

## Advanced usage: filtering and renaming with `Prefetch`

### Using `to_attr`
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

### When to use `Prefetch`
- To filter, annotate, or order related querysets.
- To store the results in a custom attribute with `to_attr`.
- To avoid naming conflicts or simplify access.

---

## How to inspect the generated SQL queries

In the Django shell:
```python
from django.db import connection

print(len(connection.queries))
for q in connection.queries:
    print(q['sql'])
```

Or use the `django-debug-toolbar` in development for a visual overview of all executed queries.

---

## Summary

- Use `select_related` for forward relationships (`ForeignKey`, `OneToOneField`).
- Use `prefetch_related` for reverse (`book_set`) or many-to-many relationships.
- Use `Prefetch` when you need more control over related querysets (e.g., filtering or custom attributes).
- Avoid preloading relationships unnecessarily — it consumes memory even if the data is never used.
