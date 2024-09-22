## **Guía para aplicar arquitectura limpia en un proyecto Django usando Django REST Framework**

### **Objetivo de la guía**

Implementar un proyecto Django que siga los principios de la **arquitectura limpia**, separando claramente las responsabilidades en capas:

1. **Dominio** (`domain`): Contiene la lógica de negocio pura, entidades, casos de uso, repositorios y datasources abstractos.
2. **Infraestructura** (`infrastructure`): Implementaciones concretas de repositorios, datasources, modelos de Django y mapeadores.
3. **Presentación** (`presentation`): Vistas de DRF, serializadores, vistas de administrador y URLs.
4. **Aplicación** (`my_app/models.py`): Archivo que importa los modelos desde la infraestructura para que Django los reconozca.

---

### **Estructura del proyecto**

```bash
my_project/
├── my_app/
│   ├── presentation/          # Capa de Presentación
│   │   ├── serializers.py     # Serializadores de DRF
│   │   ├── views.py           # Vistas (APIs) de DRF
│   │   ├── admin.py           # Configuración del administrador de Django
│   │   └── urls.py            # URLs de la API
│   │
│   ├── domain/                # Capa de Dominio
│   │   ├── entities/          # Entidades de negocio (@dataclass)
│   │   │   └── user.py
│   │   ├── datasources/       # Datasources abstractos
│   │   │   └── user_data_source.py
│   │   ├── repositories/      # Repositorios abstractos
│   │   │   └── user_repository.py
│   │   ├── use_cases/         # Casos de uso
│   │   │   └── create_user_use_case.py
│   │   └── __init__.py
│   │
│   ├── infrastructure/        # Capa de Infraestructura
│   │   ├── models/            # Modelos de Django
│   │   │   └── user.py
│   │   ├── datasources/       # Implementaciones de datasources
│   │   │   └── user_data_source_impl.py
│   │   ├── repositories/      # Implementaciones de repositorios
│   │   │   └── user_repository_impl.py
│   │   ├── mappers/           # Mapeadores entre entidades y modelos
│   │   │   └── user_mapper.py
│   │   └── __init__.py
│   │
│   ├── models.py              # Archivo que importa los modelos de infraestructura
│   └── __init__.py
│
├── my_project/
│   ├── settings.py            # Configuración de Django
│   └── urls.py                # URLs principales del proyecto
└── manage.py
```

---

### **1. Archivo `models.py` a nivel de aplicación**

Este archivo importa todos los modelos desde la capa de infraestructura para que Django pueda reconocerlos y manejarlos correctamente, especialmente para migraciones y el panel de administración.

```python
# my_app/models.py
from my_app.infrastructure.models.user import UserModel

# Si tienes más modelos, impórtalos aquí
```

---

### **2. Capa de Presentación (`presentation/`)**

#### **2.1. Serializadores (`serializers.py`)**

Los **serializadores** convierten las entidades de dominio en formatos adecuados para la API (por ejemplo, JSON) y validan los datos entrantes.

```python
# my_app/presentation/serializers.py
from rest_framework import serializers

class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=100)
```

#### **2.2. Vistas de API (`views.py`)**

Las **vistas** reciben las solicitudes HTTP y llaman a los casos de uso correspondientes en la capa de dominio. Aquí también se realiza la inyección de dependencias de las implementaciones de los repositorios.

```python
# my_app/presentation/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from my_app.presentation.serializers import UserSerializer
from my_app.domain.use_cases.create_user_use_case import CreateUserUseCase
from my_app.infrastructure.repositories.user_repository_impl import UserRepositoryImpl

class CreateUserView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            # Inyección manual del repositorio
            user_repository = UserRepositoryImpl()
            create_user_use_case = CreateUserUseCase(user_repository)
            user = create_user_use_case.execute(name=serializer.validated_data['name'])

            # Serializar la respuesta
            response_serializer = UserSerializer(user)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

#### **2.3. Vistas de administrador (`admin.py`)**

Configura el panel de administración de Django para gestionar los modelos.

```python
# my_app/presentation/admin.py
from django.contrib import admin
from my_app.infrastructure.models.user import UserModel

@admin.register(UserModel)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
```

#### **2.4. URLs de la aplicación (`urls.py`)**

Define las rutas de acceso a las vistas de la API.

```python
# my_app/presentation/urls.py
from django.urls import path
from my_app.presentation.views import CreateUserView

urlpatterns = [
    path('create-user/', CreateUserView.as_view(), name='create_user'),
]
```

---

### **3. Capa de Dominio (`domain/`)**

#### **3.1. Entidades (`entities/`)**

Las **entidades** representan los objetos de negocio y usan `@dataclass` para simplificar el código.

```python
# my_app/domain/entities/user.py
from dataclasses import dataclass, field
from typing import Optional

@dataclass
class User:
    id: Optional[int] = field(default=None)
    name: str = field(default='')
```

#### **3.2. Repositorios abstractos (`repositories/`)**

Los **repositorios** definen interfaces para las operaciones de acceso a datos.

```python
# my_app/domain/repositories/user_repository.py
from abc import ABC, abstractmethod
from typing import Optional
from my_app.domain.entities.user import User

class UserRepository(ABC):
    @abstractmethod
    def save(self, user: User) -> User:
        pass

    @abstractmethod
    def find_by_id(self, user_id: int) -> Optional[User]:
        pass
```

#### **3.3. Datasources abstractos (`datasources/`)**

Los **datasources** proporcionan una capa adicional de abstracción para las fuentes de datos.

```python
# my_app/domain/datasources/user_data_source.py
from abc import ABC, abstractmethod
from my_app.domain.entities.user import User

class UserDataSource(ABC):
    @abstractmethod
    def save(self, user: User) -> User:
        pass
```

#### **3.4. Casos de uso (`use_cases/`)**

Los **casos de uso** encapsulan la lógica de negocio específica.

```python
# my_app/domain/use_cases/create_user_use_case.py
from my_app.domain.entities.user import User
from my_app.domain.repositories.user_repository import UserRepository

class CreateUserUseCase:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def execute(self, name: str) -> User:
        user = User(name=name)
        saved_user = self.user_repository.save(user)
        return saved_user
```

---

### **4. Capa de Infraestructura (`infrastructure/`)**

#### **4.1. Modelos de Django (`models/`)**

Los **modelos** representan las tablas de la base de datos y están acoplados al ORM de Django.

```python
# my_app/infrastructure/models/user.py
from django.db import models

class UserModel(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
```

#### **4.2. Mapeadores (`mappers/`)**

Los **mapeadores** convierten entre entidades de dominio y modelos de infraestructura.

```python
# my_app/infrastructure/mappers/user_mapper.py
from my_app.domain.entities.user import User
from my_app.infrastructure.models.user import UserModel

class UserMapper:
    @staticmethod
    def to_entity(user_model: UserModel) -> User:
        return User(id=user_model.id, name=user_model.name)

    @staticmethod
    def to_model(user: User) -> UserModel:
        return UserModel(id=user.id, name=user.name)
```

#### **4.3. Datasources implementación (`datasources/`)**

Implementación concreta del datasource utilizando el ORM de Django.

```python
# my_app/infrastructure/datasources/user_data_source_impl.py
from my_app.domain.datasources.user_data_source import UserDataSource
from my_app.domain.entities.user import User
from my_app.infrastructure.models.user import UserModel
from my_app.infrastructure.mappers.user_mapper import UserMapper

class UserDataSourceImpl(UserDataSource):
    def save(self, user: User) -> User:
        user_model = UserMapper.to_model(user)
        user_model.save()
        return UserMapper.to_entity(user_model)
```

#### **4.4. Repositorios implementación (`repositories/`)**

Implementación concreta del repositorio que utiliza el datasource.

```python
# my_app/infrastructure/repositories/user_repository_impl.py
from my_app.domain.repositories.user_repository import UserRepository
from my_app.domain.entities.user import User
from my_app.infrastructure.datasources.user_data_source_impl import UserDataSourceImpl
from typing import Optional

class UserRepositoryImpl(UserRepository):
    def __init__(self):
        self.datasource = UserDataSourceImpl()

    def save(self, user: User) -> User:
        return self.datasource.save(user)

    def find_by_id(self, user_id: int) -> Optional[User]:
        # Implementación de búsqueda si es necesario
        pass
```

---

### **5. Configuración adicional**

#### **5.1. `settings.py`**

Asegúrate de incluir tu aplicación y `rest_framework` en `INSTALLED_APPS`.

```python
# my_project/settings.py
INSTALLED_APPS = [
    # Apps de Django
    'django.contrib.admin',
    'django.contrib.auth',
    # ...

    # Django REST Framework
    'rest_framework',

    # Tu aplicación
    'my_app',
]
```

#### **5.2. URLs principales (`my_project/urls.py`)**

Incluye las rutas de tu aplicación y del panel de administración.

```python
# my_project/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('my_app.presentation.urls')),
]
```

---

### **6. Resumen y beneficios**

- **Desacoplamiento**: Las capas están claramente separadas, permitiendo cambiar detalles de implementación sin afectar al dominio.
- **Mantenibilidad**: La estructura facilita el mantenimiento y escalabilidad del proyecto.
- **Flexibilidad**: Puedes reemplazar componentes (como cambiar de base de datos) sin impactar la lógica de negocio.
- **Pruebas**: Es más sencillo escribir pruebas unitarias para cada capa de manera aislada.

---

### **Conclusión**

Esta guía te proporciona un punto de partida sólido para implementar la **arquitectura limpia** en un proyecto Django con **Django REST Framework**. Al seguir esta estructura, lograrás un código más organizado, mantenible y preparado para escalar en el futuro.

---

**Notas finales:**

- **Inyección de dependencias**: Se realiza de manera manual en las vistas, lo cual es suficiente para proyectos pequeños y medianos. Para proyectos más grandes, podrías considerar utilizar un contenedor de dependencias.
- **Uso de `@dataclass`**: Simplifica la definición de entidades en el dominio y mejora la legibilidad del código.
- **Mapeadores**: Aseguran que el dominio permanece independiente de los detalles de infraestructura, facilitando el mantenimiento y las pruebas.