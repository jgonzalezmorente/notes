## Índice
1. [Introducción](#introducción)
1. [Filosofía](#filosofía)
1. [Instalación](#instalación)

## Introducción
Nest.js es un framework diseñado para crear aplicaciones del lado del servidor eficientes y escalables utilizando Node.js. Este framework está basado en JavaScript progresivo, pero está completamente construido con TypeScript, lo que permite a los desarrolladores usar cualquiera de los dos lenguajes. Nest.js combina elementos de programación orientada a objetos (OOP), programación funcional (FP) y programación reactiva funcional (FRP).

Internamente, Nest.js utiliza frameworks robustos de servidores HTTP como Express (por defecto) o Fastify (opcional). Aunque Nest proporciona una capa de abstracción sobre estos frameworks, también expone sus APIs directamente, lo que te permite usar módulos de terceros disponibles para Express o Fastify.

### Filosofía
Nest.js se inspira en Angular y ofrece una arquitectura predefinida para crear aplicaciones altamente testeables, escalables, con bajo acoplamiento y fáciles de mantener. Aunque existen muchas librerías y herramientas para Node.js, pocas ofrecen una solución completa a los problemas de arquitectura, y eso es lo que busca resolver Nest.js.

### Instalación
Para empezar con Nest.js, se recomienda usar el CLI de Nest. Con los siguientes comandos, puedes crear un proyecto nuevo con la estructura básica preconfigurada:

```bash
$ npm i -g @nestjs/cli
$ nest new project-name
```

Alternativamente, puedes clonar un proyecto inicial de TypeScript desde GitHub y empezar a trabajar:

```bash
$ git clone https://github.com/nestjs/typescript-starter.git project
$ cd project
$ npm install
$ npm run start
```

También puedes crear un proyecto desde cero instalando manualmente los módulos principales:

```bash
$ npm i --save @nestjs/core @nestjs/common rxjs reflect-metadata
```

En resumen, Nest.js ofrece una solución estructurada para desarrollar aplicaciones backend, apoyándose en las mejores prácticas y facilitando el trabajo con Node.js a través de herramientas como Express o Fastify.