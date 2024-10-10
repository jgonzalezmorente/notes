## Índice

1. [Providers](#providers)
1. [Servicios](#servicios)
1. [Inyección de dependencias](#inyección-de-dependencias)
1. [Alcances](#alcances)
1. [Proveedores personalizados](#proveedores-personalizados)
1. [Proveedores opcionales](#proveedores-opcionales)
1. [Inyección basada en propiedades](#inyección-basada-en-propiedades)
1. [Registro de providers](#registro-de-providers)
1. [Instanciación manual](#instanciación-manual)

### Providers

Los **providers** son un concepto fundamental en Nest. Muchas de las clases básicas de Nest, como servicios, repositorios, fábricas y helpers, pueden ser tratadas como **providers**. La idea principal de un provider es que puede ser **inyectado** como una dependencia, lo que significa que los objetos pueden establecer diversas relaciones entre sí, y la función de "conectar" estos objetos puede delegarse en gran medida al sistema de ejecución de Nest.

![providers](https://docs.nestjs.com/assets/Components_1.png)

En el capítulo anterior, creamos un simple `CatsController`. Los controladores deben manejar solicitudes HTTP y delegar tareas más complejas a **providers**. Los providers son clases simples de JavaScript que se declaran como `providers` dentro de un [módulo](/modules).

> **Sugerencia**: Dado que Nest permite diseñar y organizar dependencias de una manera más orientada a objetos (OO), se recomienda seguir los principios [SOLID](https://en.wikipedia.org/wiki/SOLID).

#### Servicios

Comencemos creando un simple `CatsService`. Este servicio será responsable de almacenar y recuperar datos, y está diseñado para ser utilizado por el `CatsController`, por lo que es un buen candidato para ser definido como un provider.

```typescript
import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
```

> **Sugerencia**: Para crear un servicio utilizando el CLI, simplemente ejecuta el comando `$ nest g service cats`.

Nuestro `CatsService` es una clase básica con una propiedad y dos métodos. Lo nuevo aquí es el uso del decorador `@Injectable()`. Este decorador indica que `CatsService` es una clase que puede ser gestionada por el contenedor de inversión de control (IoC) de Nest. Además, este ejemplo utiliza una interfaz `Cat`, que se ve de esta forma:

```typescript
export interface Cat {
  name: string;
  age: number;
  breed: string;
}
```

Ahora que tenemos una clase de servicio para recuperar gatos, vamos a utilizarla dentro del `CatsController`:

```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

El `CatsService` se **inyecta** a través del constructor de la clase. Observa el uso de la sintaxis `private` en el constructor, lo cual nos permite declarar e inicializar el miembro `catsService` en la misma ubicación.

Aquí tienes una nota sintetizada para tus apuntes de Nest.js:

---

### Nota sobre el uso de `@Injectable()` en Nest.js:

- **Clases sin `@Injectable()`**:
  - Se pueden registrar como providers en el array `providers` de un módulo y ser inyectadas en otras clases (como controladores) **sin problemas**, siempre que no necesiten recibir dependencias.
  - **Limitación**: Si una clase sin `@Injectable()` intenta recibir dependencias en su constructor (por ejemplo, inyectar otro servicio), Nest.js no gestionará estas dependencias, y se obtendrá `undefined`.

- **Clases con `@Injectable()`**:
  - Además de ser inyectables en otras clases, pueden recibir dependencias en su constructor. El decorador `@Injectable()` habilita el manejo completo de inyección de dependencias en Nest.js, permitiendo resolver y proveer otros servicios dentro del constructor.

- **Conclusión**: El decorador `@Injectable()` no es solo para hacer una clase inyectable, sino que también permite que esa clase pueda recibir otras dependencias inyectadas.

---

#### Inyección de dependencias

Nest se construye en torno al patrón de diseño comúnmente conocido como **Inyección de dependencias**. Gracias a las capacidades de TypeScript, manejar dependencias en Nest es muy fácil, ya que se resuelven simplemente por tipo. En el ejemplo anterior, Nest resolverá `catsService` creando y devolviendo una instancia de `CatsService` o, en el caso normal de un singleton, devolviendo la instancia existente si ya se ha solicitado en otro lugar.

```typescript
constructor(private catsService: CatsService) {}
```

#### Alcances

Los providers normalmente tienen un ciclo de vida sincronizado con el ciclo de vida de la aplicación. Cuando la aplicación se inicia, cada dependencia debe resolverse, y por lo tanto, cada provider debe instanciarse. Sin embargo, también es posible hacer que el ciclo de vida de un provider sea por solicitud (**request-scoped**). Puedes leer más sobre estas técnicas [aquí](https://docs.nestjs.com/fundamentals/injection-scopes).

#### Proveedores personalizados

Nest tiene un contenedor IoC integrado que resuelve las relaciones entre los providers. Aunque esto subyace en la función de inyección de dependencias, es mucho más poderoso. Hay varias formas de definir un provider: puedes usar valores simples, clases o fábricas síncronas o asíncronas. Más ejemplos se pueden encontrar [aquí](https://docs.nestjs.com/fundamentals/dependency-injection).

#### Proveedores opcionales

En algunos casos, podrías tener dependencias que no necesariamente deben resolverse. Por ejemplo, tu clase puede depender de un **objeto de configuración**, pero si no se pasa ninguno, se deben usar los valores predeterminados. Para indicar que un provider es opcional, utiliza el decorador `@Optional()` en la firma del constructor.

```typescript
import { Injectable, Optional, Inject } from '@nestjs/common';

@Injectable()
export class HttpService<T> {
  constructor(@Optional() @Inject('HTTP_OPTIONS') private httpClient: T) {}
}
```

#### Inyección basada en propiedades

La técnica que hemos utilizado hasta ahora se llama **inyección basada en constructor**, ya que los providers se inyectan a través del método constructor. En algunos casos específicos, la **inyección basada en propiedades** puede ser útil. Por ejemplo, si tu clase principal depende de varios providers, inyectarlos a través de propiedades puede ser más conveniente.

```typescript
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class HttpService<T> {
  @Inject('HTTP_OPTIONS')
  private readonly httpClient: T;
}
```

> **Advertencia**: Si tu clase no extiende otra clase, deberías preferir siempre la **inyección basada en constructor**.

#### Registro de providers

Ahora que hemos definido un provider (`CatsService`), y tenemos un consumidor de ese servicio (`CatsController`), necesitamos registrar el servicio en el módulo correspondiente para que Nest pueda realizar la inyección. Esto se hace editando el archivo del módulo (`app.module.ts`) y agregando el servicio al array `providers` del decorador `@Module()`.

```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class AppModule {}
```

Nest ahora podrá resolver las dependencias de la clase `CatsController`.

#### Estructura de directorios

Esta es la estructura de directorios que deberíamos tener ahora:

```
src
├── cats
│   ├── dto
│   │   └── create-cat.dto.ts
│   ├── interfaces
│   │   └── cat.interface.ts
│   ├── cats.controller.ts
│   └── cats.service.ts
├── app.module.ts
└── main.ts
```

#### Instanciación manual

Hasta ahora, hemos discutido cómo Nest maneja automáticamente la resolución de dependencias. Sin embargo, en algunas circunstancias, es posible que necesites recuperar o instanciar providers de manera manual. Hay dos maneras de hacer esto:

- Para obtener instancias existentes o instanciar providers dinámicamente, puedes utilizar la [referencia al módulo](https://docs.nestjs.com/fundamentals/module-ref).
- Para obtener providers dentro de la función `bootstrap()` (por ejemplo, en aplicaciones independientes sin controladores), puedes revisar las [aplicaciones autónomas](https://docs.nestjs.com/standalone-applications).