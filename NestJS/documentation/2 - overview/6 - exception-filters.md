## Índice

1. [Introducción](#introducción)
1. [Lanzando excepciones estándar](#lanzando-excepciones-estándar)
1. [Excepciones personalizadas](#excepciones-personalizadas)
1. [Excepciones HTTP integradas](#excepciones-http-integradas)
1. [Exception Filters](#exception-filters)
1. [Arguments host](#arguments-host)
1. [Binding filters](#binding-filters)
1. [Capturando todas las excepciones](#capturando-todas-las-excepciones)
1. [Herencia](#herencia)

### Introducción

Nest tiene una capa de **excepciones** incorporada que se encarga de procesar todas las excepciones no manejadas en la aplicación. Cuando una excepción no es gestionada por el código de tu aplicación, es capturada por esta capa, que automáticamente envía una respuesta amigable y adecuada al usuario.

![middleware](https://docs.nestjs.com/assets/Filter_1.png)

Por defecto, esta acción la realiza un **filtro de excepciones global** integrado, que maneja las excepciones del tipo `HttpException` (y sus subclases). Cuando se detecta una excepción **no reconocida** (ni `HttpException` ni sus subclases), el filtro de excepciones genera la siguiente respuesta JSON predeterminada:

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

> **Sugerencia**: El filtro global de excepciones admite parcialmente la librería `http-errors`. Cualquier excepción que tenga las propiedades `statusCode` y `message` se rellenará correctamente y se enviará como respuesta.

#### Lanzando excepciones estándar

Nest proporciona una clase integrada llamada `HttpException`, expuesta por el paquete `@nestjs/common`. En aplicaciones basadas en HTTP REST/GraphQL, es una buena práctica enviar objetos de respuesta HTTP estándar cuando ocurren ciertos errores.

Por ejemplo, en el controlador `CatsController`, si el método `findAll()` lanza una excepción, podemos codificarlo de la siguiente manera:

```typescript
@Get()
async findAll() {
  throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
}
```

Cuando el cliente llama a este endpoint, la respuesta es:

```json
{
  "statusCode": 403,
  "message": "Forbidden"
}
```

El constructor de `HttpException` toma dos argumentos:

- `response`: define el cuerpo de la respuesta JSON, que puede ser una cadena o un objeto.
- `status`: define el código de estado HTTP.

Además, hay un **tercer** argumento opcional (`options`), que permite proporcionar una causa del error. Aunque esta causa no se serializa en la respuesta, es útil para el registro de errores.

Aquí un ejemplo que sobreescribe el cuerpo de la respuesta y añade una causa del error:

```typescript
@Get()
async findAll() {
  try {
    await this.service.findAll()
  } catch (error) {
    throw new HttpException({
      status: HttpStatus.FORBIDDEN,
      error: 'This is a custom message',
    }, HttpStatus.FORBIDDEN, {
      cause: error
    });
  }
}
```

#### Excepciones personalizadas

Aunque Nest ofrece excepciones HTTP predeterminadas, también puedes crear tus propias excepciones personalizadas que heredan de `HttpException`. De este modo, Nest las reconoce automáticamente y se encarga de la respuesta de error.

```typescript
export class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}
```

Podemos usar `ForbiddenException` en nuestro método:

```typescript
@Get()
async findAll() {
  throw new ForbiddenException();
}
```

#### Excepciones HTTP integradas

Nest proporciona varias excepciones HTTP integradas, que heredan de `HttpException`:

- `BadRequestException`
- `UnauthorizedException`
- `NotFoundException`
- `ForbiddenException`
- `NotAcceptableException`
- `RequestTimeoutException`
- `ConflictException`
- `GoneException`
- `HttpVersionNotSupportedException`
- `PayloadTooLargeException`
- `UnsupportedMediaTypeException`
- `UnprocessableEntityException`
- `InternalServerErrorException`
- `NotImplementedException`
- `ImATeapotException`
- `MethodNotAllowedException`
- `BadGatewayException`
- `ServiceUnavailableException`
- `GatewayTimeoutException`
- `PreconditionFailedException`

Estas excepciones permiten también agregar descripciones y causas de error:

```typescript
throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Descripción del error' })
```
#### Exception Filters

Aunque el filtro de excepciones base puede manejar muchos casos automáticamente, puedes desear tener **control total** sobre la capa de excepciones. Por ejemplo, puedes querer agregar registros adicionales o modificar el esquema de respuesta JSON según ciertos factores dinámicos. Los **filtros de excepciones** están diseñados para cumplir con este propósito. Te permiten controlar el flujo de manejo de excepciones y el contenido de la respuesta enviada al cliente.

Veamos cómo crear un filtro de excepción que sea responsable de capturar excepciones que son instancias de la clase `HttpException` y que implemente una lógica personalizada de respuesta. Para hacerlo, necesitamos acceder a los objetos `Request` y `Response` subyacentes. Accederemos al objeto `Request` para extraer la URL original y agregar esa información en los registros. Usaremos el objeto `Response` para tomar el control directo de la respuesta que se envía, utilizando el método `response.json()`.

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

> **Sugerencia**: Todos los filtros de excepciones deben implementar la interfaz `ExceptionFilter<T>`. Esto requiere que implementes el método `catch(exception: T, host: ArgumentsHost)`.

El decorador `@Catch(HttpException)` enlaza el filtro de excepciones a las excepciones del tipo `HttpException`. Este decorador puede tomar un solo parámetro o una lista de excepciones separadas por comas, lo que te permite configurar el filtro para varios tipos de excepciones al mismo tiempo.

#### Arguments host

El parámetro `catch()` recibe dos argumentos: el **exception** y el **host**. El argumento **exception** es el objeto que representa la excepción que está siendo procesada en ese momento. El segundo argumento, **host**, es un objeto de tipo `ArgumentsHost`. Este objeto es una utilidad muy poderosa que te permitirá manejar de manera flexible el contexto de la ejecución.

`ArgumentsHost` tiene un nivel de abstracción que permite funcionar en varios contextos diferentes, no solo en HTTP, sino también en Microservicios y WebSockets. Esto significa que podemos escribir filtros de excepción que funcionen en múltiples entornos. En el contexto de HTTP, que es lo que estamos viendo en el ejemplo, `ArgumentsHost` se usa para obtener las referencias a los objetos `Request` y `Response` que se están pasando al manejador original (es decir, al método del controlador donde se originó la excepción).

En el ejemplo que hemos visto anteriormente, usamos métodos auxiliares de `ArgumentsHost` como `switchToHttp()` para cambiar al contexto HTTP y obtener los objetos `Request` y `Response`:

```typescript
const ctx = host.switchToHttp();
const response = ctx.getResponse<Response>();
const request = ctx.getRequest<Request>();
```

Esto nos permite acceder a los detalles de la solicitud (como la URL solicitada) y controlar directamente la respuesta que enviamos al cliente, como vimos en el código de ejemplo del filtro de excepciones.

> **Sugerencia**: Para saber más sobre `ArgumentsHost`, puedes consultar el capítulo de [execution context](https://docs.nestjs.com/fundamentals/execution-context).

La razón por la que `ArgumentsHost` es tan flexible es porque funciona de manera agnóstica al contexto, lo que lo hace útil para manejar no solo solicitudes HTTP, sino también otros entornos como microservicios y WebSockets. Esto permite que los filtros de excepción que escribas puedan ser genéricos y adaptarse a cualquier tipo de contexto de ejecución.

### Binding filters

Los filtros de excepciones en Nest.js te permiten tener un control granular sobre cómo manejar las excepciones en diferentes niveles de tu aplicación. Vamos a ver cómo vincular nuestro nuevo `HttpExceptionFilter` al método `create()` del `CatsController`.

```typescript
@Post()
@UseFilters(new HttpExceptionFilter())
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}
```

El decorador `@UseFilters()` se utiliza para aplicar un filtro de excepciones a un método específico. En este caso, se ha creado una instancia del filtro `HttpExceptionFilter` directamente en la llamada al decorador.

#### Alternativa con inyección de dependencias

También podemos pasar la clase del filtro directamente en lugar de la instancia. Esto permite que el framework gestione la creación de la instancia, habilitando la inyección de dependencias:

```typescript
@Post()
@UseFilters(HttpExceptionFilter)
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}
```

> **Sugerencia:** Es preferible usar clases en lugar de instancias para aplicar los filtros cuando sea posible. Esto reduce el uso de memoria, ya que Nest puede reutilizar la misma instancia de la clase del filtro a lo largo de todo el módulo.

#### Niveles de alcance de los filtros

En el ejemplo anterior, el filtro `HttpExceptionFilter` se aplica únicamente al manejador del método `create()`, por lo que se considera de **alcance a nivel de método**. Sin embargo, los filtros pueden ser aplicados en distintos niveles:

1. **Alcance a nivel de método**: como vimos en el ejemplo.
2. **Alcance a nivel de controlador**: aplicando el filtro a todo el controlador.
3. **Alcance global**: aplicando el filtro a todos los controladores y manejadores de rutas.

##### Alcance a nivel de controlador

Para aplicar un filtro a todas las rutas dentro de un controlador, simplemente aplicamos el decorador `@UseFilters()` a la clase del controlador:

```typescript
@UseFilters(new HttpExceptionFilter())
export class CatsController {}
```

Este código aplicará el filtro `HttpExceptionFilter` a todos los métodos dentro de `CatsController`.

##### Alcance global

Para aplicar un filtro de excepciones global en toda la aplicación, usamos el método `useGlobalFilters()` durante la inicialización de la aplicación:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
```

> **Advertencia**: El método `useGlobalFilters()` no configura filtros para gateways o aplicaciones híbridas.

#### Inyección de dependencias en filtros globales

Los filtros globales registrados fuera de cualquier módulo (como en el ejemplo anterior con `useGlobalFilters()`) no pueden inyectar dependencias, ya que se registran fuera del contexto de los módulos. Para solucionar este problema, puedes registrar un filtro de alcance global **dentro** de un módulo utilizando el token `APP_FILTER`:

```typescript
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
```

> **Sugerencia**: Aunque registres el filtro en un módulo específico, este filtro será global y aplicará a toda la aplicación. Puedes registrar varios filtros globales de esta manera, simplemente añadiendo más entradas en el array de `providers`.

### Capturando todas las excepciones

Para capturar **todas** las excepciones no manejadas (independientemente del tipo de excepción), puedes dejar la lista de parámetros del decorador `@Catch()` vacía, es decir, `@Catch()`.

En el ejemplo siguiente, el código es agnóstico a la plataforma ya que utiliza el [adaptador HTTP](./faq/http-adapter) para gestionar la respuesta, en lugar de usar directamente los objetos específicos de la plataforma (`Request` y `Response`).

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // En ciertas situaciones, el `httpAdapter` puede no estar disponible
    // en el constructor, por lo que deberíamos resolverlo aquí.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
```

#### Explicación

Este filtro es capaz de manejar cualquier tipo de excepción, no solo las que heredan de `HttpException`. En el código:

1. **`exception: unknown`**: Esto indica que el tipo de excepción puede ser cualquiera.
2. **`host: ArgumentsHost`**: Nos permite acceder al contexto del argumento, que podría ser un contexto HTTP, WebSocket o microservicio. En este caso, utilizamos `host.switchToHttp()` para obtener el contexto HTTP.
3. **`httpAdapterHost`**: Se usa para abstraer la plataforma subyacente, lo que permite que el filtro funcione en diferentes plataformas, como `Express` o `Fastify`.

El filtro determina el código de estado HTTP correcto basándose en si la excepción es una instancia de `HttpException`. Si no lo es, asigna un código de estado **500 (Internal Server Error)**. Luego, se construye un cuerpo de respuesta JSON que incluye el código de estado, la marca de tiempo y la ruta de la solicitud.

Aquí tienes una versión sintetizada para agregar a tus apuntes:

---

### Explicación adicional sobre el uso de `httpAdapter`:

El `httpAdapter` permite que el código sea **independiente del framework HTTP** utilizado (como Express o Fastify) al proporcionar una capa de abstracción para manejar las solicitudes y respuestas. Las ventajas clave incluyen:

- **Independencia del framework**: Facilita el cambio entre diferentes frameworks HTTP sin necesidad de modificar el código, ya que `httpAdapter` maneja las diferencias entre ellos.
- **Abstracción del manejo de solicitudes y respuestas**: Permite usar métodos agnósticos como `httpAdapter.getRequestUrl()` para obtener la URL de la solicitud o `httpAdapter.reply()` para enviar respuestas, evitando código específico del framework.
- **Facilita la migración**: Si decides cambiar de Express a Fastify, el uso de `httpAdapter` minimiza la necesidad de cambios en el código.
- **Compatibilidad futura**: Aprovecha la infraestructura interna de Nest.js, garantizando compatibilidad con futuras versiones o nuevos adaptadores de servidor.

#### Advertencia

> **Advertencia:** Cuando se combina un filtro que captura todas las excepciones con otro filtro que está limitado a un tipo específico de excepción, el filtro de "Capturar todo" debe ser declarado primero. Esto garantiza que el filtro específico pueda manejar correctamente el tipo de excepción al que está ligado.

### Herencia

En la mayoría de los casos, crearás filtros de excepciones personalizados para satisfacer los requisitos específicos de tu aplicación. Sin embargo, puede haber casos en los que simplemente quieras extender el filtro de excepciones global predeterminado y modificar su comportamiento en función de ciertos factores.

Para delegar el procesamiento de excepciones al filtro base, debes extender la clase `BaseExceptionFilter` y llamar al método `catch()` heredado.

```typescript
import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
  }
}
```

Este enfoque permite que el filtro personalizado herede la funcionalidad de la clase base y sobreescriba su comportamiento si es necesario, delegando el manejo de la excepción al filtro base en cualquier caso en el que no desees personalizar el flujo.

#### Advertencia

> **Advertencia**: Los filtros de ámbito de método y de controlador que extienden `BaseExceptionFilter` no deben ser instanciados directamente con `new`. En su lugar, debes permitir que el framework los instancie automáticamente.

### Filtros globales con herencia

Los filtros globales **sí** pueden extender el filtro base. Existen dos maneras principales de hacer esto:

#### Primer Método: Inyección de `HttpAdapter`

En el siguiente ejemplo, inyectamos la referencia de `HttpAdapter` cuando instanciamos el filtro global personalizado:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.listen(3000);
}
bootstrap();
```

Aquí, se obtiene el `httpAdapter` desde el contenedor de dependencias de Nest, lo que permite manejar excepciones de manera genérica en cualquier plataforma subyacente, como `Express` o `Fastify`.

#### Segundo Método: Uso del Token `APP_FILTER`

Otra forma de registrar un filtro global es utilizando el token `APP_FILTER`. Este enfoque es útil cuando deseas que el filtro se registre en un módulo y puedas aprovechar la inyección de dependencias dentro del filtro.

```typescript
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
```

Este enfoque es útil cuando el filtro necesita acceder a otras dependencias que se resuelven en el contexto del módulo de Nest. Además, al usar `APP_FILTER`, permites que Nest gestione el ciclo de vida del filtro y reutilice su instancia en toda la aplicación.

Ambos métodos permiten extender el filtro de excepciones predeterminado y personalizar su comportamiento para adaptarse mejor a las necesidades de la aplicación.