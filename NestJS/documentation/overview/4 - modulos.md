### Módulos

## Índice
1. [Módulos de funcionalidades](#módulos-de-funcionalidades-feature-modules)
1. [Módulos compartidos](#módulos-compartidos)
1. [Reexportación de módulos](#reexportación-de-módulos)
1. [Inyección de dependencias en módulos](#inyección-de-dependencias-en-módulos)
1. [Módulos globales](#módulos-globales)
1. [Módulos dinámicos](#módulos-dinámicos)

Un **módulo** es una clase que está anotada con el decorador `@Module()`. El decorador `@Module()` proporciona metadatos que **Nest** utiliza para organizar la estructura de la aplicación.

![modules](https://docs.nestjs.com/assets/Modules_1.png)

Cada aplicación de Nest tiene al menos un módulo, conocido como el **módulo raíz**. El módulo raíz es el punto de partida que utiliza Nest para construir el **grafo de la aplicación**, que es la estructura interna que Nest usa para resolver las relaciones entre módulos, proveedores y dependencias. Aunque las aplicaciones pequeñas pueden tener solo el módulo raíz, esta no es la práctica común. Los módulos son **altamente recomendados** como una manera efectiva de organizar tus componentes y capacidades. La mayoría de las aplicaciones emplean múltiples módulos, donde cada uno encapsula un conjunto estrechamente relacionado de **capacidades**.

El decorador `@Module()` toma un único objeto cuyas propiedades describen el módulo:

|               |                                                                                                                                                                                                          |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `providers`   | Los proveedores que serán instanciados por el inyector de Nest y que pueden ser compartidos, al menos, dentro de este módulo                                                                              |
| `controllers` | El conjunto de controladores definidos en este módulo que deben ser instanciados                                                                                                                         |
| `imports`     | La lista de módulos importados que exportan los proveedores requeridos en este módulo                                                                                                                    |
| `exports`     | El subconjunto de `providers` que son proporcionados por este módulo y deberían estar disponibles en otros módulos que importan este módulo. Puedes usar el proveedor en sí o su token (`provide` value) |

Los módulos **encapsulan** proveedores por defecto. Esto significa que no es posible inyectar proveedores que no formen parte directamente del módulo actual o que no sean exportados desde los módulos importados. Por lo tanto, puedes considerar los proveedores exportados desde un módulo como la **interfaz pública** o API del módulo.

#### Módulos de funcionalidades (Feature Modules)

El `CatsController` y el `CatsService` pertenecen al mismo dominio de la aplicación. Dado que están estrechamente relacionados, tiene sentido moverlos a un **módulo de funcionalidad**. Un módulo de funcionalidad organiza el código relevante para una característica específica, manteniendo el código ordenado y estableciendo límites claros. Esto ayuda a gestionar la complejidad y a desarrollar con los principios [SOLID](https://en.wikipedia.org/wiki/SOLID), especialmente a medida que la aplicación o el equipo crecen.

Para demostrar esto, crearemos el `CatsModule`.

```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
```

> **Sugerencia**: Para crear un módulo usando el CLI, simplemente ejecuta el comando `$ nest g module cats`.

Arriba definimos el `CatsModule` en el archivo `cats.module.ts`, y movimos todo lo relacionado con este módulo al directorio `cats`. Lo último que necesitamos hacer es importar este módulo en el módulo raíz (`AppModule`), que está definido en el archivo `app.module.ts`.

```typescript
import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule {}
```

Así es como se ve nuestra estructura de directorios ahora:

```
src
├── cats
│   ├── dto
│   │   └── create-cat.dto.ts
│   ├── interfaces
│   │   └── cat.interface.ts
│   ├── cats.controller.ts
│   ├── cats.module.ts
│   ├── cats.service.ts
├── app.module.ts
└── main.ts
```

#### Módulos compartidos

En Nest, los módulos son **singletons** por defecto. Esto significa que puedes compartir la misma instancia de cualquier proveedor entre múltiples módulos sin esfuerzo.

![shared_modules](https://docs.nestjs.com/assets/Shared_Module_1.png)

Una vez que creas un módulo, este puede ser reutilizado por cualquier otro módulo. Imagina que queremos compartir una instancia del `CatsService` entre varios módulos. Para hacerlo, primero necesitamos **exportar** el proveedor `CatsService` añadiéndolo al array `exports` del módulo, como se muestra a continuación:

```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService]
})
export class CatsModule {}
```

Ahora cualquier módulo que importe `CatsModule` tendrá acceso al `CatsService` y compartirá la misma instancia con todos los demás módulos que lo importen.

#### Reexportación de módulos

Los módulos pueden exportar sus proveedores internos y también pueden reexportar módulos que importan. En el ejemplo siguiente, el `CommonModule` es tanto importado como exportado por el `CoreModule`, lo que lo hace disponible para otros módulos que importan el `CoreModule`.

```typescript
@Module({
  imports: [CommonModule],
  exports: [CommonModule],
})
export class CoreModule {}
```

#### Inyección de dependencias en módulos

Una clase de módulo también puede **inyectar** proveedores (por ejemplo, con fines de configuración):

```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {
  constructor(private catsService: CatsService) {}
}
```

Sin embargo, las clases de módulo en sí mismas no pueden ser inyectadas como proveedores debido a posibles [dependencias circulares](https://docs.nestjs.com/fundamentals/circular-dependency).

#### Módulos globales

Si tienes que importar el mismo conjunto de módulos en todas partes, esto puede volverse tedioso. A diferencia de Angular, donde los `providers` se registran en el ámbito global, Nest encapsula los proveedores dentro del ámbito del módulo. Esto significa que no puedes utilizar los proveedores de un módulo en otro lugar sin importar primero el módulo que los encapsula.

Cuando desees proporcionar un conjunto de proveedores que deberían estar disponibles en todas partes, puedes hacer que el módulo sea **global** utilizando el decorador `@Global()`.

```typescript
import { Module, Global } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
```

El decorador `@Global()` hace que el módulo sea de alcance global. Los módulos globales deben ser registrados **solo una vez**, generalmente por el módulo raíz o núcleo.

> **Sugerencia**: Hacer todo global no es una buena decisión de diseño. Los módulos globales están destinados a reducir la cantidad de código repetido, pero el array `imports` generalmente es la forma preferida de hacer que la API del módulo esté disponible para los consumidores.

#### Módulos dinámicos

El sistema de módulos de Nest incluye una poderosa característica llamada **módulos dinámicos**. Esta característica te permite crear módulos personalizables que pueden registrar y configurar proveedores dinámicamente. Los módulos dinámicos se cubren extensamente [aquí](https://docs.nestjs.com/fundamentals/dynamic-modules).

A continuación, un ejemplo de un módulo dinámico para un `DatabaseModule`:

```typescript
import { Module, DynamicModule } from '@nestjs/common';
import { createDatabaseProviders } from './database.providers';
import { Connection } from './connection.provider';

@Module({
  providers: [Connection],
  exports: [Connection],
})
export class DatabaseModule {
  static forRoot(entities = [], options?): DynamicModule {
    const providers = createDatabaseProviders(options, entities);
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
}
```

> **Sugerencia**: El método `forRoot()` puede devolver un módulo dinámico de forma síncrona o asíncrona (por ejemplo, a través de un `Promise`).

Este módulo define el proveedor `Connection` de manera estática, pero también expone una colección de proveedores en función de los objetos `entities` y `options` que se pasan al método `forRoot()`. Si deseas registrar un módulo dinámico en el ámbito global, puedes establecer la propiedad `global` en `true`.

```typescript
{
  global: true,
  module: DatabaseModule,
  providers: providers,
  exports: providers,
}
```

El módulo `DatabaseModule` puede ser importado y configurado de la siguiente manera:

```typescript
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [DatabaseModule.forRoot([User])],
})
export class AppModule {}
```

Si deseas reexportar un módulo dinámico, puedes omitir la llamada al método `forRoot()` en el array `exports`:

```typescript
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule.forRoot([User])],
  exports: [DatabaseModule

],
})
export class AppModule {}
```

Los [módulos dinámicos](https://docs.nestjs.com/fundamentals/dynamic-modules) se cubren con mayor detalle en el capítulo correspondiente, que incluye un [ejemplo práctico](https://github.com/nestjs/nest/tree/master/sample/25-dynamic-modules).
