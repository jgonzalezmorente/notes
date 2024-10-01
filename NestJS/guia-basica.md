# Guía Básica para Desarrollar una API REST con Nest.js, TypeORM, PostgreSQL, WebSockets y BullMQ

## Paso 1: **Introducción a Nest.js**

### 1.1 Instalación de Nest.js

1. Asegúrate de tener **Node.js** instalado (recomendado: versión 14+).
2. Instala el CLI de Nest.js globalmente:
   ```bash
   npm install -g @nestjs/cli
   ```

3. Crea un nuevo proyecto:
   ```bash
   nest new my-nestjs-project
   ```

4. Navega al directorio del proyecto:
   ```bash
   cd my-nestjs-project
   ```

## Paso 2: **Creación de una API REST**

### 2.1 Crear Controladores y Servicios

1. Crea un módulo, controlador y servicio para manejar una entidad simple (ej: productos):
   ```bash
   nest generate module products
   nest generate controller products
   nest generate service products
   ```

2. Define las rutas básicas en el controlador `products.controller.ts`:
   ```typescript
   import { Controller, Get, Post, Body, Param } from '@nestjs/common';

   @Controller('products')
   export class ProductsController {
     @Get()
     getAllProducts() {
       return 'This will return all products';
     }

     @Post()
     createProduct(@Body() product: any) {
       return 'This will create a product';
     }

     @Get(':id')
     getProductById(@Param('id') id: string) {
       return `This will return product with ID ${id}`;
     }
   }
   ```

3. Enlaza la lógica de negocio en el servicio `products.service.ts`.

### 2.2 DTOs y Validación de Datos

1. Crea un DTO para manejar la validación de datos:
   ```bash
   nest generate class products/dto/create-product.dto --no-spec
   ```

2. Define el DTO `create-product.dto.ts`:
   ```typescript
   import { IsString, IsNumber } from 'class-validator';

   export class CreateProductDto {
     @IsString()
     name: string;

     @IsNumber()
     price: number;
   }
   ```

3. Actualiza el controlador para validar los datos del cuerpo de la petición:
   ```typescript
   import { CreateProductDto } from './dto/create-product.dto';

   @Post()
   createProduct(@Body() createProductDto: CreateProductDto) {
     return `This will create a product: ${createProductDto.name}`;
   }
   ```

## Paso 3: **Conexión con Base de Datos usando TypeORM y PostgreSQL**

### 3.1 Instalar TypeORM y PostgreSQL

1. Instala las dependencias necesarias:
   ```bash
   npm install --save @nestjs/typeorm typeorm pg
   ```

2. Configura la conexión a la base de datos en `app.module.ts`:
   ```typescript
   import { Module } from '@nestjs/common';
   import { TypeOrmModule } from '@nestjs/typeorm';

   @Module({
     imports: [
       TypeOrmModule.forRoot({
         type: 'postgres',
         host: 'localhost',
         port: 5432,
         username: 'postgres',
         password: 'password',
         database: 'test_db',
         autoLoadEntities: true,
         synchronize: true,
       }),
     ],
   })
   export class AppModule {}
   ```

### 3.2 Definir Entidades con TypeORM

1. Crea una entidad `Product`:
   ```bash
   nest generate class products/product.entity --no-spec
   ```

2. Define la entidad `product.entity.ts`:
   ```typescript
   import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

   @Entity()
   export class Product {
     @PrimaryGeneratedColumn()
     id: number;

     @Column()
     name: string;

     @Column('decimal')
     price: number;
   }
   ```

3. Configura el repositorio en `products.module.ts`:
   ```typescript
   import { TypeOrmModule } from '@nestjs/typeorm';
   import { Product } from './product.entity';

   @Module({
     imports: [TypeOrmModule.forFeature([Product])],
   })
   export class ProductsModule {}
   ```

4. En el servicio, implementa la lógica CRUD usando el repositorio de TypeORM.

## Paso 4: **Autenticación y Autorización con JWT**

### 4.1 Instalación de Dependencias de JWT

1. Instala los paquetes necesarios:
   ```bash
   npm install --save @nestjs/jwt passport-jwt @nestjs/passport passport
   ```

2. Configura el módulo de autenticación con `Passport` y `JWT`.

### 4.2 Implementar Estrategia JWT

1. Crea un servicio de autenticación para manejar el login y la generación de tokens JWT.
2. Protege rutas usando guardias (`@UseGuards(AuthGuard('jwt'))`).

## Paso 5: **Implementar WebSockets**

### 5.1 Configuración de WebSockets

1. Instala el paquete `ws`:
   ```bash
   npm install --save @nestjs/websockets @nestjs/platform-socket.io
   ```

2. Crea un Gateway para manejar WebSockets:
   ```bash
   nest generate gateway notifications
   ```

3. Implementa eventos y lógica de conexión dentro del Gateway.

## Paso 6: **Trabajo en Segundo Plano con BullMQ**

### 6.1 Instalar BullMQ

1. Instala las dependencias necesarias:
   ```bash
   npm install --save @nestjs/bull bullmq ioredis
   ```

2. Configura BullMQ y Redis en el módulo de aplicación.

3. Define un job y un procesador para tareas en segundo plano.

### 6.2 Ejemplo de Cola de Trabajo

1. Crea un módulo de colas:
   ```bash
   nest generate module queues
   ```

2. Implementa un procesador de tareas (por ejemplo, envío de correos).

## Paso 7: **Manejo de Errores y Logging**

1. Implementa interceptores globales para manejar excepciones personalizadas.
2. Configura un sistema de logging adecuado para la aplicación.

## Paso 8: **Testing en Nest.js**

### 8.1 Configurar Pruebas Unitarias

1. Usa Jest para escribir pruebas unitarias y de integración para tus controladores y servicios.

### 8.2 Mocking de Servicios Externos

1. Usa mocks y spies para probar servicios que dependan de la base de datos o servicios externos.

## Paso 9: **Despliegue y Seguridad**

### 9.1 Configuración de Variables de Entorno

1. Usa paquetes como `dotenv` para gestionar variables de entorno.

### 9.2 Despliegue con Docker

1. Crea un `Dockerfile` para contenerizar la aplicación.
2. Configura una pipeline de CI/CD si es necesario.

## Paso 10: **Documentación de la API**

1. Instala y configura **Swagger** para generar documentación automática:
   ```bash
   npm install --save @nestjs/swagger swagger-ui-express
   ```

2. Accede a la documentación en `/api`.