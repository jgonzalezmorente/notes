# Pipes en NestJS

### Índice

1. [Pipes](#pipes)
2. [Pipes integrados](#pipes-integrados)
3. [Vinculación de pipes](#vinculacion-de-pipes)
4. [Pipes personalizados](#pipes-personalizados)
5. [Validación basada en esquemas](#validacion-basada-en-esquemas)
6. [Validación de esquemas de objetos](#validacion-de-esquemas-de-objetos)
7. [Vinculación de pipes de validación](#vinculacion-de-pipes-de-validacion)
8. [Validador de clases](#validador-de-clases)
9. [Pipes de ámbito global](#pipes-de-ambito-global)
10. [El ValidationPipe integrado](#el-validationpipe-integrado)
11. [Caso de uso de transformación](#caso-de-uso-de-transformacion)
12. [Proporcionar valores predeterminados](#proporcionar-valores-predeterminados)

### Pipes

Un pipe es una clase anotada con el decorador `@Injectable()`, que implementa la interfaz `PipeTransform`.

<figure>
  <img class="illustrative-image" src="https://docs.nestjs.com/assets/Pipe_1.png" />
</figure>

Los pipes tienen dos casos de uso típicos:

- **Transformación**: transformar los datos de entrada a la forma deseada (por ejemplo, de cadena a entero).
- **Validación**: evaluar los datos de entrada y, si son válidos, simplemente pasarlos sin cambios; de lo contrario, lanzar una excepción.

En ambos casos, los pipes operan sobre los `argumentos` que están siendo procesados por un [manejador de rutas del controlador](controllers#route-parameters). Nest interpone un pipe justo antes de que se invoque un método, y el pipe recibe los argumentos destinados al método y opera sobre ellos. Cualquier operación de transformación o validación ocurre en ese momento, después de lo cual se invoca el manejador de rutas con los argumentos (potencialmente) transformados.

Nest viene con varios pipes integrados que se pueden usar directamente. También puedes construir tus propios pipes personalizados. En este capítulo, presentaremos los pipes integrados y mostraremos cómo vincularlos a los manejadores de rutas. Luego, examinaremos varios pipes personalizados para mostrar cómo se puede construir uno desde cero.

> **Sugerencia**: Los pipes se ejecutan dentro de la zona de excepciones. Esto significa que cuando un Pipe lanza una excepción, esta es manejada por la capa de excepciones (filtro global de excepciones y cualquier [filtro de excepciones](/exception-filters) que se aplique al contexto actual). Dado lo anterior, debería quedar claro que cuando se lanza una excepción en un Pipe, no se ejecuta ningún método del controlador. Esto proporciona una técnica de mejores prácticas para validar los datos que ingresan a la aplicación desde fuentes externas en el límite del sistema.

### Pipes integrados

Nest viene con nueve pipes disponibles directamente:

- `ValidationPipe`
- `ParseIntPipe`
- `ParseFloatPipe`
- `ParseBoolPipe`
- `ParseArrayPipe`
- `ParseUUIDPipe`
- `ParseEnumPipe`
- `DefaultValuePipe`
- `ParseFilePipe`

Estos pipes se exportan desde el paquete `@nestjs/common`.

Echemos un vistazo rápido a `ParseIntPipe`. Este es un ejemplo del caso de uso de **transformación**, donde el pipe asegura que un parámetro del manejador de métodos se convierta en un entero de JavaScript (o lanza una excepción si la conversión falla). Más adelante en este capítulo, mostraremos una implementación simple personalizada de un `ParseIntPipe`. En los siguientes ejemplos, mostraremos técnicas aplicables a los otros pipes de transformación integrados (`ParseBoolPipe`, `ParseFloatPipe`, `ParseEnumPipe`, `ParseArrayPipe` y `ParseUUIDPipe`, a los que nos referiremos como los pipes `Parse*` en este capítulo).

### Vinculación de pipes

Para usar un pipe, necesitamos vincular una instancia de la clase del pipe al contexto apropiado. En nuestro ejemplo de `ParseIntPipe`, queremos asociar el pipe con un método de manejador de rutas particular y asegurarnos de que se ejecute antes de que se llame al método. Hacemos esto con la siguiente construcción, a la que nos referiremos como vinculación del pipe a nivel del parámetro del método:

```typescript
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

Esto asegura que se cumpla una de las dos condiciones siguientes: o el parámetro que recibimos en el método `findOne()` es un número (como se espera en nuestra llamada a `this.catsService.findOne()`), o se lanza una excepción antes de que se llame al manejador de la ruta.

Por ejemplo, supongamos que la ruta se llama así:

```bash
GET localhost:3000/abc
```

Nest lanzará una excepción como esta:

```json
{
  "statusCode": 400,
  "message": "Validation failed (numeric string is expected)",
  "error": "Bad Request"
}
```

La excepción evitará que se ejecute el cuerpo del método `findOne()`.

En el ejemplo anterior, pasamos una clase (`ParseIntPipe`), no una instancia, dejando la responsabilidad de la instanciación al framework y habilitando la inyección de dependencias. Al igual que con pipes y guards, también podemos pasar una instancia in situ. Pasar una instancia in situ es útil si queremos personalizar el comportamiento del pipe integrado pasando opciones:

```typescript
@Get(':id')
async findOne(
  @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
  id: number,
) {
  return this.catsService.findOne(id);
}
```

La vinculación de los otros pipes de transformación (todos los pipes **Parse\*** ) funciona de manera similar. Todos estos pipes funcionan en el contexto de la validación de parámetros de ruta, parámetros de cadena de consulta y valores del cuerpo de la solicitud.

Por ejemplo, con un parámetro de cadena de consulta:

```typescript
@Get()
async findOne(@Query('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

Aquí hay un ejemplo de uso de `ParseUUIDPipe` para analizar un parámetro de cadena y validar si es un UUID.

```typescript
@@filename()
@Get(':uuid')
async findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
  return this.catsService.findOne(uuid);
}
@@switch
@Get(':uuid')
@Bind(Param('uuid', new ParseUUIDPipe()))
async findOne(uuid) {
  return this.catsService.findOne(uuid);
}
```

> **Sugerencia**: Cuando uses `ParseUUIDPipe()`, estás analizando UUID en la versión 3, 4 o 5. Si solo necesitas una versión específica del UUID, puedes pasar una versión en las opciones del pipe.

Arriba hemos visto ejemplos de cómo vincular varios pipes de la familia `Parse*` integrados. La vinculación de pipes de validación es un poco diferente; lo discutiremos en la siguiente sección.

> **Sugerencia**: Consulta también [Técnicas de validación](/techniques/validation) para ejemplos extensos de pipes de validación.

### Pipes personalizados

Como se mencionó, puedes construir tus propios pipes personalizados. Aunque Nest proporciona un `ParseIntPipe` y un `ValidationPipe` integrados y robustos, vamos a construir versiones personalizadas simples de cada uno desde cero para ver cómo se construyen los pipes personalizados.

Comenzamos con un simple `ValidationPipe`. Inicialmente, simplemente tomará un valor de entrada y devolverá el mismo valor de inmediato, comportándose como una función de identidad.

```typescript
@@filename(validation.pipe)
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}
@@switch
import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidationPipe {
  transform(value, metadata) {
    return value;
  }
}
```

> **Sugerencia**: `PipeTransform<T, R>` es una interfaz genérica que debe ser implementada por cualquier pipe. La interfaz genérica usa `T` para indicar el tipo del valor de entrada `value`, y `R` para indicar el tipo de retorno del método `transform()`.

Todo pipe debe implementar el método `transform()` para cumplir con el contrato de la interfaz `PipeTransform`. Este método tiene dos parámetros:

- `value`
- `metadata`

El parámetro `value` es el argumento del método que se está procesando actualmente (antes de ser recibido por el método del manejador de la ruta), y `metadata` es la metainformación del argumento que se está procesando. El objeto `metadata` tiene las siguientes propiedades:

```typescript
export interface ArgumentMetadata {
  type: 'body' | 'query' | 'param' | 'custom';
  metatype?: Type<unknown>;
  data?: string;
}
```

Estas propiedades describen el argumento que se está procesando actualmente.

<table>
  <tr>
    <td>
      <code>type</code>
    </td>
    <td>Indica si el argumento es un cuerpo
      <code>@Body()</code>, consulta
      <code>@Query()</code>, parámetro
      <code>@Param()</code> o un parámetro personalizado (lee más
      <a routerLink="/custom-decorators">aquí</a>).</td>
  </tr>
  <tr>
    <td>
      <code>metatype</code>
    </td>
    <td>
      Proporciona el metatipo del argumento, por ejemplo,
      <code>String</code>. Nota: el valor es
      <code>undefined</code> si omites una declaración de tipo en la firma del método del manejador de rutas o si usas JavaScript puro.
    </td>
  </tr>
  <tr>
    <td>
      <code>data</code>
    </td>
    <td>La cadena pasada al decorador, por ejemplo
      <code>@Body('string')</code>. Es
      <code>undefined</code> si dejas los paréntesis del decorador vacíos.</td>
  </tr>
</table>

> **Advertencia**: Las interfaces de TypeScript desaparecen durante la transpilación. Por lo tanto, si el tipo del parámetro de un método se declara como una interfaz en lugar de una clase, el valor de `metatype` será `Object`.

### Validación basada en esquemas

Hagamos que nuestro `ValidationPipe` sea un poco más útil. Observemos más de cerca el método `create()` del `CatsController`, donde probablemente quisiéramos asegurarnos de que el objeto del cuerpo del post sea válido antes de intentar ejecutar nuestro método de servicio.

```typescript
@@filename()
@Post()
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
@@switch
@Post()
async create(@Body() createCatDto) {
  this.catsService.create(createCatDto);
}
```

Centrémonos en el parámetro `createCatDto` del cuerpo. Su tipo es `CreateCatDto`:

```typescript
@@filename(create-cat.dto)
export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}
```

Queremos asegurarnos de que cualquier solicitud entrante al método `create` contenga un cuerpo válido. Entonces, tenemos que validar los tres miembros del objeto `createCatDto`. Podríamos hacer esto dentro del método del manejador de rutas, pero hacerlo no es ideal, ya que rompería el **principio de responsabilidad única** (SRP).

Otro enfoque podría ser crear una **clase validadora** y delegar la tarea allí. Esto tiene la desventaja de que tendríamos que recordar llamar a este validador al comienzo de cada método.

¿Qué tal crear un middleware de validación? Esto podría funcionar, pero lamentablemente no es posible crear un **middleware genérico** que pueda ser utilizado en todos los contextos en toda la aplicación. Esto se debe a que el middleware no conoce el **contexto de ejecución**, incluyendo el manejador que será llamado y cualquiera de sus parámetros.

Este es, por supuesto, exactamente el caso de uso para el cual están diseñados los pipes. Así que vamos a refinar nuestro `ValidationPipe`.

<app-banner-courses></app-banner-courses>

### Validación de esquemas de objetos

Hay varios enfoques disponibles para hacer la validación de objetos de una manera limpia y [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself). Un enfoque común es usar validación basada en **esquemas**. Vamos a probar ese enfoque.

La biblioteca [Zod](https://zod.dev/) permite crear esquemas de una manera sencilla, con una API fácil de leer. Construyamos un pipe de validación que haga uso de esquemas basados en Zod.

Comienza instalando el paquete necesario:

```bash
$ npm install --save zod
```

En el siguiente ejemplo de código, creamos una clase simple que toma un esquema como argumento del `constructor`. Luego aplicamos el método `schema.parse()`, que valida nuestro argumento entrante contra el esquema proporcionado.

Como se mencionó antes, un **validation pipe** devuelve el valor sin cambios o lanza una excepción.

En la siguiente sección, verás cómo proporcionamos el esquema apropiado para un método del controlador usando el decorador `@UsePipes()`. Hacer esto hace que nuestro pipe de validación sea reutilizable en varios contextos, tal como nos propusimos hacer.

```typescript
@@filename()
import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema  } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      throw new BadRequestException('Validation failed');
    }
  }
}
@@switch
import { BadRequestException } from '@nestjs/common';

export class ZodValidationPipe {
  constructor(private schema) {}

  transform(value, metadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      throw new BadRequestException('Validation failed');
    }
  }
}
```

### Vinculación de pipes de validación

Anteriormente, vimos cómo vincular pipes de transformación (como `ParseIntPipe` y el resto de los pipes `Parse*`).

La vinculación de pipes de validación también es muy sencilla.

En este caso, queremos vincular el pipe al nivel de la llamada al método. En nuestro ejemplo actual, necesitamos hacer lo siguiente para usar el `ZodValidationPipe`:

1. Crear una instancia del `ZodValidationPipe`.
2. Pasar el esquema Zod específico del contexto en el constructor de la clase del pipe.
3. Vincular el pipe al método.

Ejemplo de esquema Zod:

```typescript
import { z } from 'zod';

export const createCatSchema = z
  .object({
    name: z.string(),
    age: z.number(),
    breed: z.string(),
  })
  .required();

export type CreateCatDto = z.infer<typeof createCatSchema>;
```

Hacemos esto usando el decorador `@UsePipes()` como se muestra a continuación:

```typescript
@@filename(cats.controller)
@Post()
@UsePipes(new ZodValidationPipe(createCatSchema))
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
@@switch
@Post()
@Bind(Body())
@UsePipes(new ZodValidationPipe(createCatSchema))
async create(createCatDto) {
  this.catsService.create(createCatDto);
}
```

> **Sugerencia**: El decorador `@UsePipes()` se importa desde el paquete `@nestjs/common`.

> **Advertencia**: La biblioteca `zod` requiere que la configuración `strictNullChecks` esté habilitada en tu archivo `tsconfig.json`.

### Validador de clases

> **Advertencia**: Las técnicas en esta sección requieren TypeScript y no están disponibles si tu aplicación está escrita en JavaScript puro.

Veamos una implementación alternativa para nuestra técnica de validación.

Nest funciona bien con la biblioteca [class-validator](https://github.com/typestack/class-validator). Esta poderosa biblioteca te permite usar validación basada en decoradores. La validación basada en decoradores es extremadamente poderosa, especialmente cuando se combina con las capacidades de **Pipe** de Nest, ya que tenemos acceso al `metatype` de la propiedad procesada. Antes de comenzar, necesitamos instalar los paquetes necesarios:

```bash
$ npm i --save class-validator class-transformer
```

Una vez instalados, podemos agregar algunos decoradores a la clase `CreateCatDto`. Aquí vemos una ventaja significativa de esta técnica: la clase `CreateCatDto` sigue siendo la única fuente de verdad para nuestro objeto del cuerpo del post (en lugar de tener que crear una clase de validación separada).

```typescript
@@filename(create-cat.dto)
import { IsString, IsInt } from 'class-validator';

export class CreateCatDto {
  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsString()
  breed: string;
}
```

> **Sugerencia**: Lee más sobre los decoradores de class-validator [aquí](https://github.com/typestack/class-validator#usage).

Ahora podemos crear una clase `ValidationPipe` que use estas anotaciones.

```typescript
@@filename(validation.pipe)
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
```

> **Sugerencia**: Como recordatorio, no necesitas construir un pipe de validación genérico por tu cuenta, ya que el `ValidationPipe` está disponible de forma predeterminada en Nest. El `ValidationPipe` integrado ofrece más opciones que el ejemplo que construimos en este capítulo, el cual se ha mantenido básico para ilustrar la mecánica de un pipe personalizado. Puedes encontrar todos los detalles, junto con muchos ejemplos, [aquí](/techniques/validation).

> **Aviso**: Utilizamos la biblioteca [class-transformer](https://github.com/typestack/class-transformer) anteriormente, la cual fue creada por el mismo autor que la biblioteca **class-validator**, y, como resultado, funcionan muy bien juntas.

Vamos a revisar este código. Primero, observa que el método `transform()` está marcado como `async`. Esto es posible porque Nest admite tanto pipes sincrónicos como **asíncronos**. Hacemos este método `async` porque algunas de las validaciones de class-validator [pueden ser asíncronas](https://github.com/typestack/class-validator#custom-validation-classes) (utilizan Promesas).

Luego, nota que estamos usando destructuración para extraer el campo `metatype` (extrayendo solo este miembro de un `ArgumentMetadata`) en nuestro parámetro `metatype`. Esto es solo una abreviatura para obtener el `ArgumentMetadata` completo y luego tener una declaración adicional para asignar la variable `metatype`.

A continuación, observa la función auxiliar `toValidate()`. Es responsable de omitir el paso de validación cuando el argumento que se está procesando es un tipo nativo de JavaScript (estos no pueden tener decoradores de validación adjuntos, por lo que no hay razón para ejecutarlos a través del paso de validación).

Luego, usamos la función `plainToInstance()` de class-transformer para transformar nuestro objeto de argumento de JavaScript puro en un objeto tipado para que podamos aplicar la validación. La razón por la cual debemos hacer esto es porque el objeto del cuerpo de la solicitud entrante, cuando se deserializa desde la solicitud de red, no tiene **información de tipo** (así es como funciona la plataforma subyacente, como Express). Class-validator necesita usar los decoradores de validación que definimos anteriormente para nuestro DTO, por lo que necesitamos realizar esta transformación para tratar el cuerpo entrante como un objeto adecuadamente decorado, no solo como un objeto genérico.

Finalmente, como se mencionó antes, dado que este es un **pipe de validación**, devuelve el valor sin cambios o lanza una excepción.

El último paso es vincular el `ValidationPipe`. Los pipes pueden ser de ámbito de parámetro, de método, de controlador o global. Anteriormente, con nuestro pipe de validación basado en Zod, vimos un ejemplo de cómo vincular el pipe a nivel del método.
En el ejemplo a continuación, vincularemos la instancia del pipe al decorador `@Body()` del manejador de rutas para que nuestro pipe sea llamado para validar el cuerpo del post.

```typescript
@@filename(cats.controller)
@Post()
async create(
  @Body(new ValidationPipe()) createCatDto: CreateCatDto,
) {
  this.catsService.create(createCatDto);
}
```

Los pipes de ámbito de parámetro son útiles cuando la lógica de validación concierne solo a un parámetro específico.

### Pipes de ámbito global

Dado que el `ValidationPipe` fue creado para ser lo más genérico posible, podemos aprovechar su utilidad configurándolo como un pipe de **ámbito global** para que se aplique a cada manejador de rutas en toda la aplicación.

```typescript
@@filename(main)
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
```

> **Aviso**: En el caso de [aplicaciones híbridas](faq/hybrid-application), el método `useGlobalPipes()` no configura pipes para gateways y microservicios. Para aplicaciones de microservicios "estándar" (no híbridas), `useGlobalPipes()` monta los pipes a nivel global.

Los pipes globales se usan en toda la aplicación, para cada controlador y cada manejador de rutas.

Ten en cuenta que, en términos de inyección de dependencias, los pipes globales registrados desde fuera de cualquier módulo (con `useGlobalPipes()` como en el ejemplo anterior) no pueden inyectar dependencias, ya que la vinculación se ha realizado fuera del contexto de cualquier módulo. Para resolver este problema, puedes configurar un pipe global **directamente desde cualquier módulo** usando la siguiente construcción:

```typescript
@@filename(app.module)
import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
```

> **Sugerencia**: Cuando uses este enfoque para realizar la inyección de dependencias para el pipe, ten en cuenta que, independientemente del módulo donde se emplee esta construcción, el pipe es, de hecho, global. ¿Dónde debería hacerse esto? Elige el módulo donde se define el pipe (`ValidationPipe` en el ejemplo anterior). Además, `useClass` no es la única forma de gestionar el registro de proveedores personalizados. Aprende más [aquí](/fundamentals/custom-providers).

### El ValidationPipe integrado

Como recordatorio, no necesitas construir un pipe de validación genérico por tu cuenta, ya que el `ValidationPipe` está disponible de forma predeterminada en Nest. El `ValidationPipe` integrado ofrece más opciones que el ejemplo que construimos en este capítulo, el cual se ha mantenido básico para ilustrar la mecánica de un pipe personalizado. Puedes encontrar todos los detalles, junto con muchos ejemplos, [aquí](/techniques/validation).

### Caso de uso de transformación

La validación no es el único caso de uso para pipes personalizados. Al comienzo de este capítulo, mencionamos que un pipe también puede **transformar** los datos de entrada al formato deseado. Esto es posible porque el valor devuelto desde el método `transform` sobrescribe completamente el valor anterior del argumento.

¿Cuándo es esto útil? A veces los datos enviados desde el cliente necesitan ser modificados, por ejemplo, convertir una cadena en un número entero antes de que puedan ser manejados adecuadamente por el método del manejador de la ruta. Además, algunos campos de datos requeridos pueden estar ausentes, y nos gustaría aplicar valores predeterminados. Los **pipes de transformación** pueden realizar estas funciones al interponer una función de procesamiento entre la solicitud del cliente y el manejador de solicitudes.

Aquí hay un simple `ParseIntPipe`, que se encarga de convertir una cadena en un valor entero. (Como se mencionó anteriormente, Nest tiene un `ParseIntPipe` integrado que es más sofisticado; incluimos este como un ejemplo simple de un pipe de transformación personalizado).

```typescript
@@filename(parse-int.pipe)
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}
@@switch
import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe {
  transform(value, metadata) {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}
```

Podemos entonces vincular este pipe al parámetro seleccionado como se muestra a continuación:

```typescript
@@filename()
@Get(':id')
async findOne(@Param('id', new ParseIntPipe()) id) {
  return this.catsService.findOne(id);
}
@@switch
@Get(':id')
@Bind(Param('id', new ParseIntPipe()))
async findOne(id) {
  return this.catsService.findOne(id);
}
```

Otro caso útil de transformación sería seleccionar una **entidad de usuario existente** de la base de datos usando un id proporcionado en la solicitud:

```typescript
@@filename()
@Get(':id')
findOne(@Param('id', UserByIdPipe) userEntity: UserEntity) {
  return userEntity;
}
@@switch
@Get(':id')
@Bind(Param('id', UserByIdPipe))
findOne(userEntity) {
  return userEntity;
}
```

Dejamos la implementación de este pipe al lector, pero observa que, al igual que otros pipes de transformación, recibe un valor de entrada (un `id`) y devuelve un valor de salida (un objeto `UserEntity`). Esto puede hacer que tu código sea más declarativo y [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) al abstraer el código repetitivo del manejador y colocarlo en un pipe común.

### Proporcionar valores predeterminados

Los pipes `Parse*` esperan que el valor de un parámetro esté definido. Lanzan una excepción al recibir valores `null` o `undefined`. Para permitir que un endpoint maneje valores de parámetros de cadena de consulta faltantes, debemos proporcionar un valor predeterminado que se inyecte antes de que los pipes `Parse*` operen sobre estos valores. El `DefaultValuePipe` sirve para este propósito. Simplemente instancia un `DefaultValuePipe` en el decorador `@Query()` antes del pipe `Parse*` correspondiente, como se muestra a continuación:

```typescript
@@filename()
@Get()
async findAll(
  @Query('activeOnly', new DefaultValuePipe(false), ParseBoolPipe) activeOnly: boolean,
  @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
) {
  return this.catsService.findAll({ activeOnly, page });
}
```