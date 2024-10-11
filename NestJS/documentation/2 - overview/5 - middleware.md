## Índice

1. [Middleware](#middleware)
1. [Inyección de dependencias](#inyección-de-dependencias)
1. [Wildcards en rutas](#wildcards-en-rutas)
1. [Middleware consumer](#middleware-consumer)
1. [Exclusión de rutas](#exclusión-de-rutas)
1. [Middleware funcional](#middleware-funcional)
1. [Múltiples middleware](#múltiples-middleware)
1. [Middleware Global](#middleware-global)

### Middleware

El middleware es una función que se llama **antes** del controlador de la ruta. Las funciones de middleware tienen acceso a los objetos [request](https://expressjs.com/en/4x/api.html#req) (solicitud) y [response](https://expressjs.com/en/4x/api.html#res) (respuesta), así como a la función `next()` dentro del ciclo de solicitud-respuesta de la aplicación. La función de **next** es comúnmente representada por una variable llamada `next`.

![middleware](https://docs.nestjs.com/assets/Middlewares_1.png)

Los middleware en Nest son, por defecto, equivalentes a los middleware de [express](https://expressjs.com/en/guide/using-middleware.html). La siguiente descripción de la documentación oficial de Express detalla las capacidades del middleware:

<blockquote class="external">
  Las funciones de middleware pueden realizar las siguientes tareas:
  <ul>
    <li>ejecutar cualquier código.</li>
    <li>hacer cambios en los objetos de solicitud y respuesta.</li>
    <li>finalizar el ciclo de solicitud-respuesta.</li>
    <li>llamar a la siguiente función de middleware en la pila.</li>
    <li>si la función de middleware actual no finaliza el ciclo de solicitud-respuesta, debe llamar a <code>next()</code> para pasar el control a la siguiente función de middleware. De lo contrario, la solicitud quedará pendiente.</li>
  </ul>
</blockquote>

---

### Nota:

- **Función principal del middleware**: Los middlewares interceptan la solicitud antes de que llegue al controlador y pueden ejecutar varias tareas como:
  - Modificar la solicitud o respuesta.
  - Verificar autenticación o autorización.
  - Validar datos de entrada.
  - Registrar logs o gestionar excepciones.

- **Finalizar el ciclo de solicitud-respuesta**: Un middleware puede finalizar el ciclo enviando una respuesta directamente con métodos como `res.send()`, `res.json()`, o `res.end()`. Esto es útil en casos como:
  - **Autenticación fallida**: Por ejemplo, si falta un token de autorización, puede devolver un error 401.
  - **Validación de datos**: Si los datos de la solicitud no son válidos, puede devolver un error 400.
  - **Manejo de excepciones**: Para gestionar errores globalmente, evitando que lleguen al controlador.
  - **Redirecciones**: Un middleware puede redirigir una solicitud a otra ruta.

- **No finalizar el ciclo**: Si el middleware no necesita enviar una respuesta, debe llamar a `next()` para que el control pase al siguiente middleware o al controlador. Por ejemplo, en middlewares de registro de solicitudes o modificación de cabeceras.

- **Responsabilidad del controlador**: En general, los controladores son los responsables principales de gestionar la lógica de negocio y enviar la respuesta al cliente.

---

Puedes implementar middleware personalizado en Nest mediante una función o una clase con un decorador `@Injectable()`. La clase debe implementar la interfaz `NestMiddleware`, mientras que la función no tiene requisitos especiales. Empecemos por implementar una característica de middleware simple utilizando el método basado en clase.

> **Advertencia**: `Express` y `fastify` manejan los middleware de manera diferente y proporcionan diferentes firmas de métodos, puedes leer más al respecto [aquí](/techniques/performance#middleware).

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}
```

#### Inyección de dependencias

El middleware en Nest admite completamente la **inyección de dependencias**. Al igual que con los proveedores y controladores, los middleware pueden inyectar dependencias disponibles dentro del mismo módulo a través del `constructor`.

#### Aplicación de middleware

No hay un lugar para los middleware en el decorador `@Module()`. En su lugar, se configuran utilizando el método `configure()` de la clase del módulo. Los módulos que incluyen middleware deben implementar la interfaz `NestModule`. Configuramos el `LoggerMiddleware` a nivel del `AppModule` de la siguiente manera:

```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('cats');
  }
}
```

En este ejemplo, hemos configurado el `LoggerMiddleware` para los manejadores de rutas del módulo `Cats`. También puedes restringir el middleware a un método de solicitud específico pasando un objeto que contiene la ruta y el método de solicitud a `forRoutes()`.

```typescript
import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'cats', method: RequestMethod.GET });
  }
}
```

> **Sugerencia**: El método `configure()` se puede hacer asíncrono utilizando `async/await` (por ejemplo, puedes esperar a que se complete una operación asíncrona dentro del cuerpo del método `configure()`).

> **Advertencia**: Cuando usas el adaptador `express`, la aplicación Nest registrará automáticamente `json` y `urlencoded` del paquete `body-parser`. Si deseas personalizar ese middleware, debes desactivar el middleware global configurando la opción `bodyParser` en `false` al crear la aplicación con `NestFactory.create()`.

#### Wildcards en rutas

Las rutas basadas en patrones también son compatibles. Por ejemplo, el asterisco se usa como **wildcard** y coincide con cualquier combinación de caracteres:

```typescript
forRoutes({ path: 'ab*cd', method: RequestMethod.ALL });
```

El camino `'ab*cd'` coincidirá con `abcd`, `ab_cd`, `abecd`, etc. Sin embargo, en `fastify`, los wildcards como `*` no son compatibles y debes usar parámetros como `(.*)`.

#### Middleware consumer

El `MiddlewareConsumer` es una clase auxiliar que proporciona métodos incorporados para gestionar los middleware. Todos ellos pueden encadenarse utilizando el estilo fluido (fluent interface). El método `forRoutes()` puede tomar una cadena de texto, varias cadenas de texto, un objeto `RouteInfo`, una clase de controlador, o varias clases de controladores.

```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';
import { CatsController } from './cats/cats.controller';

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(CatsController);
  }
}
```

> **Sugerencia**: El método `apply()` puede tomar un solo middleware o varios middlewares separados por comas.

#### Exclusión de rutas

En ocasiones, querrás **excluir** ciertas rutas de la aplicación de middleware. Puedes hacer esto fácilmente con el método `exclude()`.

```typescript
consumer
  .apply(LoggerMiddleware)
  .exclude(
    { path: 'cats', method: RequestMethod.GET },
    { path: 'cats', method: RequestMethod.POST },
    'cats/(.*)',
  )
  .forRoutes(CatsController);
```

En este ejemplo, `LoggerMiddleware` se aplicará a todas las rutas del `CatsController` excepto las especificadas en el método `exclude()`.

#### Middleware funcional

El middleware `LoggerMiddleware` que hemos utilizado es bastante simple. No tiene miembros, métodos adicionales ni dependencias. Por lo tanto, en lugar de definirlo en una clase, podemos usar un middleware funcional.

```typescript
import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log('Request...');
  next();
};
```

Y lo aplicamos en el `AppModule`:

```typescript
consumer
  .apply(logger)
  .forRoutes(CatsController);
```

> **Sugerencia**: Usa middleware funcional cuando no necesites dependencias.

#### Múltiples middleware

Para aplicar múltiples middleware que se ejecuten secuencialmente, proporciona una lista separada por comas dentro del método `apply()`:

```typescript
consumer.apply(cors(), helmet(), logger).forRoutes(CatsController);
```

#### Middleware global

Si deseas aplicar middleware a todas las rutas registradas, puedes utilizar el método `use()` proporcionado por la instancia `INestApplication`:

```typescript
const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(3000);
```

> **Sugerencia**: No es posible acceder al contenedor de inyección de dependencias (DI) en un middleware global. Puedes usar middleware funcional en este caso o usar un middleware de clase y aplicarlo globalmente con `.forRoutes('*')` dentro del `AppModule`.