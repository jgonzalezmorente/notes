## Índice

1. [Primeros pasos](#primeros-pasos)
1. [Lenguaje](#lenguaje)
1. [Requisitos previos](#requisitos-previos)
1. [Configuración del proyecto](#configuración-del-proyecto)
1. [Arquitectura del proyecto](#arquitectura-del-proyecto)
1. [Plataforma](#plataforma)
1. [Ejecutando la aplicación](#ejecutando-la-aplicación)
1. [Linting y formateo](#linting-y-formateo)

### Primeros pasos

En este conjunto de artículos, se cubren los fundamentos principales de Nest.js. Para familiarizarte con los bloques esenciales de Nest, se construirá una aplicación básica CRUD que demostrará muchas características importantes a un nivel introductorio. Este proceso ayudará a entender cómo se estructura una aplicación en Nest y qué elementos clave se utilizan.

### Lenguaje

Nest.js está diseñado para trabajar principalmente con TypeScript debido a su capacidad de aprovechar las características modernas del lenguaje, como la tipificación estática. Sin embargo, también es compatible con JavaScript puro. Si prefieres usar JavaScript sin TypeScript, necesitarás un compilador como Babel. Los ejemplos en la documentación estarán en TypeScript, pero puedes alternar entre ambos lenguajes.

### Requisitos previos

Antes de comenzar con Nest.js, es importante asegurarte de que Node.js esté instalado en tu sistema, con una versión de al menos 16 o superior.

### Configuración del proyecto

Para configurar un nuevo proyecto, el CLI de Nest facilita la creación de la estructura inicial con los siguientes comandos:

```bash
$ npm i -g @nestjs/cli
$ nest new project-name
```

El comando anterior creará una carpeta `project-name`, instalará los módulos de Node y otros archivos iniciales, y organizará las carpetas principales del proyecto dentro de `src/`.

### Arquitectura del proyecto

Al crear un proyecto con el CLI de Nest, se generan varios archivos en la carpeta `src/`, cada uno con un propósito específico en la aplicación:

- **app.controller.ts**: Un controlador básico que define una ruta específica.
- **app.controller.spec.ts**: Pruebas unitarias para el controlador.
- **app.module.ts**: El módulo raíz de la aplicación, donde se configuran los distintos módulos que la componen.
- **app.service.ts**: Un servicio simple con un único método, utilizado por el controlador.
- **main.ts**: El archivo de entrada de la aplicación que utiliza `NestFactory` para crear una instancia de la aplicación y ponerla en marcha.

### Código de ejemplo en `main.ts`

El archivo `main.ts` contiene el código que inicializa la aplicación. Aquí se usa la clase `NestFactory` para crear una instancia de la aplicación Nest, y se configura para escuchar en el puerto 3000:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

Este código es esencial para que la aplicación comience a escuchar solicitudes HTTP entrantes. El método `NestFactory.create()` crea una instancia de la aplicación a partir del módulo raíz `AppModule`, y `app.listen(3000)` indica que la aplicación escuchará en el puerto 3000.

### Plataforma

Nest.js es un framework agnóstico de plataforma, lo que significa que puede funcionar con diferentes frameworks HTTP de Node.js. Actualmente, Nest soporta dos plataformas de manera predeterminada:

- **Express**: Es un framework web minimalista y ampliamente utilizado en la comunidad de Node.js. El paquete `@nestjs/platform-express` es el que se usa por defecto en Nest.

- **Fastify**: Es un framework que se enfoca en ser extremadamente rápido y eficiente, con bajo overhead. Si prefieres mayor rendimiento, puedes optar por usar Fastify en lugar de Express.

Cuando se pasa un tipo específico al método `NestFactory.create()`, como se muestra a continuación, se obtiene un objeto `app` que tendrá métodos exclusivos para la plataforma seleccionada:

```typescript
const app = await NestFactory.create<NestExpressApplication>(AppModule);
```

De esta manera, puedes acceder a las funcionalidades específicas de Express o Fastify según el framework que elijas.

Nest facilita la creación de adaptadores para trabajar con otros frameworks HTTP si es necesario. Esto permite reutilizar las partes lógicas del código a través de diferentes tipos de aplicaciones, haciendo que Nest.js sea altamente flexible.

### Ejecutando la aplicación

Después de configurar el proyecto, puedes iniciar la aplicación utilizando el siguiente comando:

```bash
$ npm run start
```

Este comando iniciará el servidor HTTP que escuchará en el puerto especificado en el archivo `main.ts` (por defecto, el puerto 3000). Una vez en marcha, puedes abrir tu navegador y navegar a `http://localhost:3000/` para ver el mensaje `Hello World!`.

Durante el desarrollo, es útil ejecutar la aplicación en modo de desarrollo con el siguiente comando:

```bash
$ npm run start:dev
```

Este comando vigilará los cambios en los archivos y recompilará automáticamente la aplicación, lo que facilita un ciclo de desarrollo más rápido.

### Linting y formateo

Nest.js incluye herramientas de linting y formateo preconfiguradas, como `eslint` y `prettier`. Estas herramientas ayudan a mantener el código limpio y uniforme. Puedes ejecutar los siguientes comandos para realizar el linting o el formateo del código:

```bash
# Lint y corrección automática con eslint
$ npm run lint

# Formateo del código con prettier
$ npm run format
```

Estas herramientas también están integradas para que funcionen bien en entornos donde el uso de un IDE no es relevante, como en la integración continua o en los hooks de Git.

---
