### Controladores

Los controladores son responsables de manejar las **solicitudes** entrantes y devolver **respuestas** al cliente.

El propósito de un controlador es recibir solicitudes específicas para la aplicación. El mecanismo de **enrutamiento** controla qué controlador recibe qué solicitudes. Frecuentemente, cada controlador tiene más de una ruta, y diferentes rutas pueden realizar diferentes acciones.

Para crear un controlador básico, usamos clases y **decoradores**. Los decoradores asocian clases con los metadatos necesarios y permiten que Nest cree un mapa de enrutamiento (vinculando solicitudes a los controladores correspondientes).

> **Sugerencia**: Para crear rápidamente un controlador CRUD con validación incorporada, puedes usar el generador CRUD del CLI: `nest g resource [name]`.

#### Enrutamiento

En el siguiente ejemplo, usaremos el decorador `@Controller()`, que es **necesario** para definir un controlador básico. Especificaremos un prefijo de ruta opcional `cats`. Usar un prefijo de ruta en el decorador `@Controller()` nos permite agrupar fácilmente un conjunto de rutas relacionadas y minimizar código repetitivo. Por ejemplo, podríamos agrupar un conjunto de rutas que gestionan interacciones con una entidad `cats` bajo la ruta `/cats`.

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```

> **Sugerencia**: Para crear un controlador utilizando el CLI, simplemente ejecuta el comando `$ nest g controller [name]`.

El decorador `@Get()` antes del método `findAll()` le indica a Nest que cree un controlador para una ruta específica de solicitudes HTTP (en este caso, GET). La ruta se determina concatenando el prefijo opcional declarado en el controlador y cualquier ruta especificada en el decorador del método.

En nuestro ejemplo, una solicitud GET a la ruta `/cats` será manejada por el método `findAll()`, que devolverá un código de estado 200 y la respuesta asociada (en este caso, una cadena).

#### Opciones para manipular respuestas

Nest proporciona dos enfoques diferentes para manipular las respuestas:

1. **Enfoque estándar (recomendado)**: Cuando un manejador de solicitudes devuelve un objeto o arreglo de JavaScript, se serializa automáticamente a JSON. Si devuelve un tipo primitivo (como `string` o `number`), Nest enviará el valor sin intentar serializarlo. El código de estado por defecto es 200, excepto en solicitudes POST, que usan el código 201. Puedes cambiarlo utilizando el decorador `@HttpCode(...)`.

2. **Enfoque específico de la biblioteca**: Puedes usar el objeto de respuesta específico de la biblioteca (como Express) mediante el decorador `@Res()`. Esto te permite construir respuestas utilizando métodos específicos de la biblioteca, como `response.status(200).send()`.

> **Advertencia**: Si usas `@Res()`, el enfoque estándar se desactiva automáticamente para esa ruta. Puedes habilitar ambas opciones usando `@Res({ passthrough: true })`.

#### Objeto de solicitud

Los manejadores de rutas a menudo necesitan acceder a los detalles de la solicitud del cliente. Puedes acceder al objeto de solicitud de Express utilizando el decorador `@Req()` en la firma del método.

```typescript
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(@Req() request: Request): string {
    return 'This action returns all cats';
  }
}
```

Este objeto contiene información como la cadena de consulta, parámetros, encabezados HTTP y el cuerpo de la solicitud.

#### Parámetros de ruta

Si necesitas aceptar datos dinámicos en las rutas (por ejemplo, `GET /cats/1`), puedes definir rutas con parámetros utilizando tokens en la ruta y el decorador `@Param()`.

```typescript
@Get(':id')
findOne(@Param('id') id: string): string {
  return `This action returns a #${id} cat`;
}
```

#### Código de estado

El código de estado de la respuesta es 200 por defecto, pero puedes cambiarlo usando el decorador `@HttpCode()`.

```typescript
@Post()
@HttpCode(204)
create() {
  return 'This action adds a new cat';
}
```

#### Encabezados

Puedes especificar encabezados de respuesta personalizados utilizando el decorador `@Header()` o manipulando el objeto de respuesta de la biblioteca.

```typescript
@Post()
@Header('Cache-Control', 'none')
create() {
  return 'This action adds a new cat';
}
```

#### Redirección

Puedes redirigir una respuesta a una URL específica utilizando el decorador `@Redirect()`.

```typescript
@Get()
@Redirect('https://nestjs.com', 301)
```

También puedes determinar dinámicamente el código de estado o la URL de redirección devolviendo un objeto que siga la interfaz `HttpRedirectResponse`.

```typescript
@Get('docs')
@Redirect('https://docs.nestjs.com', 302)
getDocs(@Query('version') version) {
  if (version && version === '5') {
    return { url: 'https://docs.nestjs.com/v5/' };
  }
}
```

#### Wildcards en rutas

Las rutas basadas en patrones también son compatibles. Por ejemplo, el asterisco se usa como un comodín que coincidirá con cualquier combinación de caracteres.

```typescript
@Get('ab*cd')
findAll() {
  return 'This route uses a wildcard';
}
```

El patrón `'ab*cd'` coincidirá con `abcd`, `ab_cd`, `abecd`, y otras variaciones. Los caracteres `?`, `+`, `*` y `()` son subconjuntos de sus contrapartes en expresiones regulares.

#### Manejo asincrónico

Nest admite el uso de funciones asíncronas (`async/await`) en los manejadores de rutas.

```typescript
@Get()
async findAll(): Promise<any[]> {
  return [];
}
```

También puedes devolver flujos observables de RxJS, que Nest gestionará automáticamente suscribiéndose al flujo y tomando el último valor emitido.

```typescript
@Get()
findAll(): Observable<any[]> {
  return of([]);
}
```

#### Payload de la solicitud

Puedes utilizar el decorador `@Body()` para manejar los datos enviados en una solicitud POST. Es recomendable definir un DTO (Data Transfer Object) para estructurar los datos de entrada.

```typescript
export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}

@Post()
async create(@Body() createCatDto: CreateCatDto) {
  return 'This action adds a new cat';
}
```

> **Sugerencia**: El `ValidationPipe` puede filtrar las propiedades no permitidas, manteniendo solo las incluidas en el DTO.

#### Manejo de errores

Nest proporciona mecanismos avanzados para manejar errores y excepciones. Puedes aprender más sobre esto en el capítulo de [manejo de excepciones](https://docs.nestjs.com/exception-filters).

#### Ejemplo completo de controlador

Aquí tienes un ejemplo que utiliza varios decoradores para crear un controlador básico:

```typescript
import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CreateCatDto, UpdateCatDto, ListAllEntities } from './dto';

@Controller('cats')
export class CatsController {
  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return 'This action adds a new cat';
  }

  @Get()
  findAll(@Query() query: ListAllEntities) {
    return `This action returns all cats (limit: ${query.limit} items)`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return `This action updates a #${id} cat`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}
```

Este controlador expone varios métodos para acceder y manipular datos internos.

### Acerca de los módulos

Con el controlador definido, Nest aún no sabe que `CatsController` existe. Los controladores siempre pertenecen a un módulo, por lo que es necesario incluir el controlador en la propiedad `controllers` del decorador `@Module()`.

```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';

@Module({
  controllers: [CatsController],
})
export class AppModule {}
```

Con esto, Nest ahora puede reflejar qué controladores deben montarse en la aplicación.

### Enfoque específico de la biblioteca

Hasta ahora, hemos discutido el enfoque estándar de Nest para manejar respuestas. El segundo enfoque es utilizar un objeto de respuesta específico de la biblioteca. Para inyectar este objeto, usamos el decorador `@Res()`.

```typescript
import { Controller, Get, Post, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Controller('cats')
export class CatsController {
  @Post()
  create(@Res() res: Response

) {
    res.status(HttpStatus.CREATED).send();
  }

  @Get()
  findAll(@Res() res: Response) {
    res.status(HttpStatus.OK).json([]);
  }
}
```

Este enfoque proporciona mayor control sobre el objeto de respuesta, permitiendo manipular encabezados, cookies y más. Sin embargo, tiene la desventaja de que el código se vuelve dependiente de la plataforma subyacente, lo que dificulta las pruebas y la reutilización del código.

Para resolver esto, puedes habilitar el modo "passthrough" para seguir utilizando algunas características de Nest mientras manipulas directamente el objeto de respuesta.

```typescript
@Get()
findAll(@Res({ passthrough: true }) res: Response) {
  res.status(HttpStatus.OK);
  return [];
}
```

Con este enfoque, puedes interactuar con el objeto de respuesta nativo (por ejemplo, establecer cookies o encabezados), pero dejar que el framework maneje el resto de la respuesta.