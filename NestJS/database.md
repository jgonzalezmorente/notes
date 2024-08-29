# Nest - Database

## Database

NestJS es "agnóstico" en cuanto a bases de datos, lo que significa que no está limitado a un tipo específico de base de datos. Puedes integrarlo fácilmente con cualquier base de datos SQL (como MySQL, PostgreSQL) o NoSQL (como MongoDB, Redis).
Dependiendo de tus preferencias y necesidades, puedes usar diferentes opciones para conectarte a una base de datos. A nivel básico, esto se logra simplemente cargando un driver de Node.js adecuado para la base de datos que estás utilizando, de la misma manera que lo harías en otros frameworks de Node.js como Express o Fastify.
NestJS permite el uso directo de cualquier librería de integración de bases de datos en Node.js o de un ORM (Object-Relational Mapping). Algunos ejemplos mencionados son:
   - **MikroORM**: Un ORM que soporta varias bases de datos SQL y NoSQL.
   - **Sequelize**: Un ORM popular para bases de datos SQL.
   - **Knex.js**: Un constructor de consultas SQL flexible.
   - **TypeORM**: Un ORM que funciona con TypeScript y es muy utilizado en la comunidad.
   - **Prisma**: Un ORM moderno que simplifica las interacciones con bases de datos.

   Estos ORMs y librerías operan a un nivel más alto de abstracción, lo que significa que te permiten trabajar con bases de datos de manera más simplificada, sin necesidad de escribir consultas SQL crudas.

Para facilitar aún más la integración, NestJS proporciona paquetes específicos para integrarse con TypeORM, Sequelize y Mongoose. Estos paquetes son:
   - **@nestjs/typeorm**: Para usar TypeORM con NestJS.
   - **@nestjs/sequelize**: Para usar Sequelize con NestJS.
   - **@nestjs/mongoose**: Para usar Mongoose (que es comúnmente utilizado con MongoDB) con NestJS.

   Estas integraciones no solo te permiten usar estos ORMs con facilidad, sino que también ofrecen características adicionales específicas de NestJS, como:
   - **Inyección de modelos/repositorios**: Para facilitar el uso de modelos y repositorios dentro de tus servicios NestJS.
   - **Testabilidad**: Mejora la capacidad de probar tu código, integrando mejor los ORMs con el sistema de testing de NestJS.
   - **Configuración asíncrona**: Permite una configuración más flexible y moderna, que puede ser especialmente útil en aplicaciones complejas.

En resumen, NestJS te da mucha flexibilidad para trabajar con diferentes tipos de bases de datos y herramientas, y además te ofrece integraciones que hacen que el desarrollo sea más fácil y eficiente.

## TypeORM Integration

A continuación se detalla cómo integrar TypeORM, un ORM (Object Relational Mapper) muy maduro para TypeScript, lo que permite trabajar con bases de datos SQL y NoSQL de manera eficiente utilizando TypeScript.

### 1. **¿Qué es TypeORM y por qué usarlo?**
TypeORM es un ORM (Object Relational Mapper) diseñado para TypeScript. Permite interactuar con bases de datos relacionales (como MySQL, PostgreSQL, SQLite) y algunas NoSQL (como MongoDB) de manera más sencilla, utilizando objetos y clases de TypeScript. Dado que está escrito en TypeScript, se integra perfectamente con el framework NestJS.

### 2. **Instalación de Dependencias**
Para empezar a usar TypeORM en tu proyecto NestJS, primero necesitas instalar las dependencias necesarias. En el ejemplo proporcionado, se utiliza MySQL como sistema de gestión de bases de datos, por lo que se instala el cliente de MySQL junto con TypeORM y el paquete de integración de NestJS:

```bash
npm install --save @nestjs/typeorm typeorm mysql2
```

Si estuvieras utilizando otra base de datos, como PostgreSQL o MongoDB, deberías instalar el cliente correspondiente (por ejemplo, `pg` para PostgreSQL o `mongodb` para MongoDB).

### 3. **Configuración del Módulo en `AppModule`**
Una vez completada la instalación, debes configurar TypeORM en tu aplicación importando el `TypeOrmModule` en el módulo raíz de la aplicación (`AppModule`). Esto se hace utilizando el método `forRoot()`, donde se definen las configuraciones de la conexión a la base de datos:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // Tipo de base de datos (puede ser postgres, sqlite, etc.)
      host: 'localhost', // Dirección del servidor de base de datos
      port: 3306, // Puerto de conexión
      username: 'root', // Usuario de la base de datos
      password: 'root', // Contraseña del usuario
      database: 'test', // Nombre de la base de datos
      entities: [], // Aquí se registran las entidades (clases que representan tablas)
      synchronize: true, // Sincroniza las entidades con la base de datos (solo para desarrollo)
    }),
  ],
})
export class AppModule {}
```

### **Advertencia Importante:**
La opción `synchronize: true` debería evitarse en entornos de producción, ya que puede modificar automáticamente la estructura de la base de datos y provocar pérdida de datos. Es útil para desarrollo, pero peligroso para producción.

### 4. **Opciones de Configuración Adicionales**
El método `forRoot()` soporta todas las propiedades de configuración del constructor `DataSource` de TypeORM, además de algunas opciones adicionales como:
- **retryAttempts**: Número de intentos de reconexión a la base de datos (por defecto: 10).
- **retryDelay**: Retraso entre los intentos de reconexión en milisegundos (por defecto: 3000).
- **autoLoadEntities**: Si está en `true`, las entidades se cargarán automáticamente sin necesidad de especificarlas manualmente en `entities`.

### 5. **Inyección de `DataSource` y `EntityManager`**
Una vez configurado el módulo, los objetos `DataSource` y `EntityManager` estarán disponibles para ser inyectados en cualquier parte del proyecto, facilitando la interacción con la base de datos en diferentes partes de la aplicación.

Ejemplo de cómo se podría inyectar `DataSource` en el `AppModule`:

```typescript
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(), UsersModule],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
```

Esto permite que `dataSource` esté disponible para su uso en cualquier lugar del módulo.

### **Conclusión**
Integrar TypeORM con NestJS es un proceso sencillo y altamente configurable. La flexibilidad de TypeORM, combinada con las características de NestJS, facilita la creación de aplicaciones robustas que interactúan de manera eficiente con diversas bases de datos. Es importante seguir buenas prácticas, como evitar `synchronize: true` en producción, para asegurar la estabilidad y seguridad de la aplicación.

## Relations

A continuación se explica cómo establecer relaciones entre tablas en una base de datos utilizando TypeORM en NestJS. Las relaciones son conexiones entre dos o más tablas basadas en campos comunes, como claves primarias y foráneas.

### Tipos de Relaciones

TypeORM soporta tres tipos principales de relaciones:

1. **One-to-One (Uno a uno)**:
   - **Descripción**: Cada fila en la tabla primaria tiene una y solo una fila asociada en la tabla secundaria.
   - **Uso en TypeORM**: Se define utilizando el decorador `@OneToOne()`.
   - **Ejemplo**: Un usuario tiene un perfil, y ese perfil está asociado únicamente a ese usuario.

2. **One-to-Many / Many-to-One (Uno a muchos / Muchos a uno)**:
   - **Descripción**: Cada fila en la tabla primaria puede tener una o más filas relacionadas en la tabla secundaria. Este es un tipo de relación muy común.
   - **Uso en TypeORM**: Se define utilizando los decoradores `@OneToMany()` y `@ManyToOne()`.
   - **Ejemplo**: Un usuario puede tener múltiples fotos, pero cada foto pertenece a un solo usuario.

3. **Many-to-Many (Muchos a muchos)**:
   - **Descripción**: Cada fila en la tabla primaria puede estar relacionada con muchas filas en la tabla secundaria, y viceversa.
   - **Uso en TypeORM**: Se define utilizando el decorador `@ManyToMany()`.
   - **Ejemplo**: Un usuario puede estar asociado con varios grupos, y cada grupo puede tener varios usuarios.

### Ejemplo de Relación Uno a Muchos

Para ilustrar cómo se define una relación, consideremos la relación "Uno a Muchos" entre `User` y `Photo`. Un usuario puede tener muchas fotos, pero cada foto pertenece a un solo usuario.

#### Definición de la entidad `User`:

```typescript
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Photo } from '../photos/photo.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(type => Photo, photo => photo.user)
  photos: Photo[];
}
```

#### Desglose de la relación:

- **Decorador `@OneToMany()`**: Este decorador se utiliza para definir una relación "Uno a Muchos". En este caso, indica que un `User` puede tener muchas `Photo`.
- **`type => Photo`**: Especifica el tipo de entidad con la que se establece la relación.
- **`photo => photo.user`**: Define cómo se relacionan las entidades, indicando que el campo `user` en `Photo` se utiliza para conectar con `User`.

### Importancia de las Relaciones

Definir correctamente las relaciones es crucial para mantener la integridad de los datos y para facilitar consultas complejas. Por ejemplo, podrías consultar todas las fotos de un usuario específico de manera sencilla si has definido adecuadamente la relación.

### Conclusión

Las relaciones en TypeORM se manejan mediante decoradores que reflejan la naturaleza de las conexiones entre tablas en la base de datos. Al utilizar estos decoradores, puedes modelar de manera efectiva las asociaciones entre entidades en tu aplicación NestJS. Para obtener más detalles y ejemplos avanzados, se recomienda revisar la documentación oficial de TypeORM.

## Auto-load Entities

Cuando configuras TypeORM en NestJS, normalmente debes especificar todas las entidades de tu aplicación en el array `entities` dentro de la configuración de `TypeOrmModule.forRoot()`. Esto puede volverse tedioso y propenso a errores, especialmente en aplicaciones grandes con muchas entidades. Además, tener que referenciar todas las entidades desde el módulo raíz puede romper la separación de responsabilidades y la modularidad de la aplicación, lo que podría causar problemas de mantenimiento y escalabilidad.

### `autoLoadEntities`

Para solucionar este problema, NestJS ofrece la opción `autoLoadEntities`. Cuando esta opción se establece en `true`, TypeORM automáticamente cargará todas las entidades que se hayan registrado a través del método `forFeature()` en los módulos de la aplicación. Esto significa que no necesitas manualmente agregar cada entidad al array `entities` en la configuración principal.

#### Ejemplo de Uso

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // Otras opciones de configuración
      autoLoadEntities: true, // Activar la carga automática de entidades
    }),
  ],
})
export class AppModule {}
```

Con esta configuración, cada vez que utilizas `TypeOrmModule.forFeature()` en un módulo para registrar entidades, esas entidades se agregarán automáticamente a la configuración de TypeORM, sin necesidad de listarlas manualmente en el módulo raíz (`AppModule`).

### Limitaciones

- **Entidades no registradas con `forFeature()`**: Una advertencia importante es que las entidades que no se registran directamente usando `forFeature()` pero que están referenciadas en otras entidades (por ejemplo, a través de relaciones) **no** serán incluidas automáticamente por la configuración `autoLoadEntities`. Esto significa que si tienes una entidad que no está directamente registrada pero se usa dentro de otra entidad, deberás asegurarte de registrarla adecuadamente o incluirla manualmente en el array `entities`.

### Ventajas

- **Simplificación de la Configuración**: Reduce la necesidad de gestión manual de entidades en el módulo raíz, haciendo que el código sea más limpio y fácil de mantener.
- **Modularidad**: Permite mantener la modularidad de la aplicación, evitando la filtración de detalles de implementación del módulo raíz a otros módulos.

### Conclusión

La propiedad `autoLoadEntities` es una herramienta útil para simplificar la configuración de TypeORM en aplicaciones NestJS, especialmente en aplicaciones con muchas entidades distribuidas en diferentes módulos. Sin embargo, es importante tener en cuenta sus limitaciones y asegurarse de que todas las entidades necesarias estén registradas correctamente, ya sea a través de `forFeature()` o manualmente, para evitar problemas en tiempo de ejecución.

## Separating Entity Definition

A continuación se explica cómo se puede separar la definición de las entidades en NestJS usando **esquemas de entidad** (`EntitySchema`). Este enfoque es útil para aquellos que prefieren organizar su código de manera diferente o que quieren mantener la lógica de la entidad separada de otras partes del código.

### ¿Qué es un EntitySchema?

Un `EntitySchema` en TypeORM es una forma alternativa de definir entidades utilizando un objeto de configuración en lugar de decoradores en una clase. Esto permite definir una entidad de manera más estructurada y, en algunos casos, puede facilitar la reutilización o la generación automática de código.

### Ejemplo de Separación de Definición de Entidades

En lugar de definir una entidad `User` utilizando decoradores directamente en una clase, puedes usar un `EntitySchema` para definir la estructura de la entidad en un archivo separado.

#### Definir el Esquema de la Entidad

```typescript
import { EntitySchema } from 'typeorm';
import { User } from './user.entity';

export const UserSchema = new EntitySchema<User>({
  name: 'User', // Nombre de la entidad
  target: User, // Clase de destino, opcional si solo se usa el esquema
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true, // Clave primaria autogenerada
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true, // Valor por defecto
    },
  },
  relations: {
    photos: {
      type: 'one-to-many', // Relación de uno a muchos
      target: 'Photo', // Nombre de la entidad relacionada
    },
  },
});
```

### Consideraciones Importantes

- **Nombre y Target**: Si proporcionas la opción `target` (que suele ser la clase a la que corresponde el esquema), el valor de `name` debe coincidir con el nombre de la clase destino. Si no proporcionas `target`, puedes usar cualquier nombre para `name`.
- **Definición de Relaciones**: Al igual que con las entidades tradicionales, puedes definir relaciones entre entidades en el `EntitySchema`, como `one-to-many`, `many-to-one`, etc.

### Uso del Esquema en un Módulo

Una vez que hayas definido el `EntitySchema`, puedes usarlo en un módulo de la misma manera que usarías una entidad definida con decoradores.

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from './user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema])], // Registro del esquema en lugar de una entidad
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
```

En este ejemplo, `TypeOrmModule.forFeature([UserSchema])` registra el `UserSchema` como la definición de la entidad `User` dentro del módulo `UsersModule`. Esto permite que los servicios y controladores del módulo usen el repositorio asociado a `UserSchema` de la misma manera que lo harían con una entidad tradicional.

### Ventajas del Uso de `EntitySchema`

- **Organización**: Mantener la lógica de las entidades separada de la lógica de la aplicación puede hacer que el código sea más limpio y fácil de mantener.
- **Flexibilidad**: Puede ser más fácil trabajar con generación automática de código, migraciones o integración con herramientas externas.
- **Compatibilidad**: Es compatible con TypeORM y puedes usar un `EntitySchema` donde normalmente se espera una entidad.

### Conclusión

El uso de `EntitySchema` en lugar de decoradores es una opción válida y útil para definir entidades en TypeORM, especialmente si prefieres una separación más clara entre la lógica de la entidad y otras partes de tu código. Esta técnica puede simplificar la gestión de entidades en proyectos grandes o complejos, proporcionando una mayor flexibilidad y claridad en la organización del código.

## TypeORM Transactions

Las transacciones en bases de datos son un conjunto de operaciones que se ejecutan de manera que todas se completen correctamente o ninguna de ellas se aplique. Esto asegura que la base de datos permanezca en un estado coherente, incluso en caso de errores durante el proceso.

### Estrategias para Manejar Transacciones en TypeORM

La documentación menciona varias estrategias para manejar transacciones en TypeORM, pero recomienda específicamente el uso de la clase `QueryRunner` porque ofrece un control completo sobre la transacción. A continuación, te explico cómo se implementa este enfoque y también te presento una alternativa más sencilla.

#### 1. **Inyección de `DataSource`**

Primero, debes inyectar el objeto `DataSource` en tu servicio. Este objeto es crucial porque se utiliza para crear instancias de `QueryRunner`, que son las herramientas que gestionan las transacciones.

```typescript
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(private dataSource: DataSource) {}
}
```

Aquí, `DataSource` se importa del paquete `typeorm` y se inyecta en el servicio `UsersService`.

#### 2. **Uso de `QueryRunner` para Gestionar una Transacción**

Una vez que tienes el `DataSource`, puedes crear una transacción usando `QueryRunner`. Aquí está el paso a paso:

```typescript
async createMany(users: User[]) {
  const queryRunner = this.dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    // Guardar varios usuarios dentro de la transacción
    await queryRunner.manager.save(users[0]);
    await queryRunner.manager.save(users[1]);

    // Confirmar la transacción si todo sale bien
    await queryRunner.commitTransaction();
  } catch (err) {
    // Si ocurre un error, revertir la transacción
    await queryRunner.rollbackTransaction();
  } finally {
    // Liberar el queryRunner manualmente
    await queryRunner.release();
  }
}
```

**Explicación del Código:**

- **Crear `QueryRunner`**: Se crea una instancia de `QueryRunner` a partir del `DataSource`.
- **Conectar y Comenzar la Transacción**: El `QueryRunner` se conecta a la base de datos y se inicia una transacción.
- **Operaciones de Base de Datos**: Dentro del bloque `try`, se realizan las operaciones necesarias (por ejemplo, guardar múltiples usuarios).
- **Confirmar o Revertir la Transacción**: Si todas las operaciones son exitosas, se confirma la transacción con `commitTransaction()`. Si ocurre un error, se revierte con `rollbackTransaction()`.
- **Liberar `QueryRunner`**: Finalmente, el `QueryRunner` se libera para evitar fugas de memoria o conexiones innecesarias.

Este método te ofrece un control total sobre la transacción, lo cual es útil para operaciones complejas.

#### 3. **Enfoque Alternativo: `transaction` del `DataSource`**

Si no necesitas tanto control, TypeORM también ofrece un enfoque más simplificado para manejar transacciones mediante el método `transaction` del `DataSource`.

```typescript
async createMany(users: User[]) {
  await this.dataSource.transaction(async manager => {
    await manager.save(users[0]);
    await manager.save(users[1]);
  });
}
```

**Explicación del Código:**

- **`transaction` de `DataSource`**: Este método acepta un callback que recibe un `EntityManager`. Dentro de este callback, puedes realizar las operaciones de base de datos como guardar usuarios.
- **Automatización**: TypeORM se encarga automáticamente de confirmar la transacción si todas las operaciones son exitosas, o de revertirla si ocurre un error.

### Consideraciones para Pruebas

Cuando trabajas con `QueryRunner`, las pruebas unitarias pueden ser más complicadas porque necesitarías simular (`mock`) todo el objeto `DataSource`. Una buena práctica es utilizar una clase fábrica (por ejemplo, `QueryRunnerFactory`) que encapsule la creación del `QueryRunner`, facilitando la simulación en las pruebas.

Crear una `QueryRunnerFactory` en NestJS es una forma de encapsular la lógica de creación de instancias de `QueryRunner`, lo que facilita la reutilización del código y simplifica las pruebas unitarias al permitir una fácil simulación (`mocking`) de las operaciones relacionadas con las transacciones.

Aquí te muestro cómo puedes crear una `QueryRunnerFactory` en tu aplicación NestJS.

### 1. **Crear la Interface para la Fábrica**

Primero, puedes definir una interfaz que describa los métodos que quieres exponer en tu `QueryRunnerFactory`. Esto te ayudará a limitar el conjunto de métodos que necesitas simular en las pruebas.

```typescript
import { QueryRunner } from 'typeorm';

export interface IQueryRunnerFactory {
  createQueryRunner(): QueryRunner;
}
```

### 2. **Implementar la Fábrica**

Ahora puedes crear una clase que implemente esta interfaz. Esta clase se encargará de crear instancias de `QueryRunner` usando el `DataSource` inyectado.

```typescript
import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { IQueryRunnerFactory } from './query-runner-factory.interface';

@Injectable()
export class QueryRunnerFactory implements IQueryRunnerFactory {
  constructor(private readonly dataSource: DataSource) {}

  createQueryRunner(): QueryRunner {
    return this.dataSource.createQueryRunner();
  }
}
```

### 3. **Usar la Fábrica en Tu Servicio**

Ahora, en lugar de inyectar directamente `DataSource` en tu servicio, puedes inyectar la `QueryRunnerFactory`. Esto te permitirá usar la fábrica para crear instancias de `QueryRunner`.

```typescript
import { Injectable } from '@nestjs/common';
import { QueryRunnerFactory } from './query-runner-factory';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly queryRunnerFactory: QueryRunnerFactory) {}

  async createMany(users: User[]) {
    const queryRunner = this.queryRunnerFactory.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(users[0]);
      await queryRunner.manager.save(users[1]);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
```

### 4. **Pruebas Unitarias**

Cuando escribas pruebas unitarias, puedes simular (`mock`) la `QueryRunnerFactory` para devolver un `QueryRunner` simulado. Esto facilita la prueba de la lógica de transacción sin necesidad de interactuar con una base de datos real.

#### Ejemplo de Prueba con Jest

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { QueryRunnerFactory } from './query-runner-factory';
import { QueryRunner } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let queryRunnerFactory: QueryRunnerFactory;
  let queryRunner: QueryRunner;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: QueryRunnerFactory,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              manager: {
                save: jest.fn(),
              },
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    queryRunnerFactory = module.get<QueryRunnerFactory>(QueryRunnerFactory);
    queryRunner = queryRunnerFactory.createQueryRunner();
  });

  it('should commit transaction when no errors occur', async () => {
    const users = [{}, {}]; // Datos simulados de usuarios
    await service.createMany(users);

    expect(queryRunner.connect).toHaveBeenCalled();
    expect(queryRunner.startTransaction).toHaveBeenCalled();
    expect(queryRunner.manager.save).toHaveBeenCalledTimes(2);
    expect(queryRunner.commitTransaction).toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalled();
  });

  it('should rollback transaction on error', async () => {
    queryRunner.manager.save = jest.fn().mockRejectedValueOnce(new Error('Error de prueba'));

    const users = [{}, {}]; // Datos simulados de usuarios
    await expect(service.createMany(users)).rejects.toThrow('Error de prueba');

    expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalled();
  });
});
```

- **`QueryRunnerFactory`**: Encapsula la lógica de creación de `QueryRunner`, facilitando la reutilización y simplificando las pruebas.
- **Interfaz**: Define una interfaz (`IQueryRunnerFactory`) para limitar los métodos que necesitas simular en las pruebas.
- **Pruebas Unitarias**: Usar una fábrica te permite simular el `QueryRunner`, lo que hace más fácil probar tu lógica de transacción sin necesidad de una base de datos real.

Este enfoque mejora la modularidad y testabilidad de tu código, haciendo que las pruebas unitarias sean más manejables y menos dependientes de la infraestructura.

### Resumen

- **`QueryRunner`**: Ofrece control total sobre la transacción, ideal para escenarios complejos.
- **Método `transaction`**: Es más sencillo y adecuado para la mayoría de las operaciones de transacción.
- **Pruebas**: Considera abstraer la creación de `QueryRunner` para simplificar las pruebas unitarias.

Ambos enfoques son válidos, y la elección depende de las necesidades específicas de tu aplicación y el nivel de control que necesites sobre las transacciones.

## Subscribers

Los **Subscribers** en TypeORM son una poderosa característica que te permite escuchar y reaccionar a eventos específicos que ocurren en entidades, como antes o después de insertar, actualizar, eliminar, entre otros. Esto es útil para realizar tareas automatizadas o ejecutar lógica adicional cuando se producen ciertos eventos en la base de datos.

### Implementación de un Subscriber

Aquí te explico cómo implementar y utilizar un `Subscriber` en NestJS con TypeORM, basándome en el ejemplo proporcionado.

#### 1. **Crear el Subscriber**

Primero, debes crear una clase que implemente la interfaz `EntitySubscriberInterface`. Esta interfaz define varios métodos que puedes utilizar para engancharte a eventos específicos, como `beforeInsert`, `afterInsert`, `beforeUpdate`, etc.

**Ejemplo de un Subscriber para la entidad `User`:**

```typescript
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { User } from './user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  // Especifica a qué entidad está suscrito este Subscriber
  listenTo() {
    return User;
  }

  // Método que se ejecuta antes de insertar un nuevo usuario
  beforeInsert(event: InsertEvent<User>) {
    console.log(`ANTES DE INSERTAR USUARIO: `, event.entity);
  }
}
```

**Explicación del Código:**

- **`@EventSubscriber()`**: Este decorador indica que la clase es un Subscriber de eventos de TypeORM.
- **`EntitySubscriberInterface<User>`**: La interfaz asegura que la clase implemente los métodos correspondientes a los eventos que deseas escuchar para la entidad `User`.
- **`listenTo()`**: Este método define a qué entidad está suscrito el Subscriber; en este caso, a la entidad `User`.
- **`beforeInsert()`**: Este método se ejecuta justo antes de que un `User` sea insertado en la base de datos. En este ejemplo, simplemente se imprime en la consola la entidad que se va a insertar.

#### 2. **Registrar el Subscriber en el Módulo**

Para que el Subscriber funcione, debes registrarlo como un proveedor dentro del módulo correspondiente.

**Ejemplo de Registro en `UsersModule`:**

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSubscriber } from './user.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UserSubscriber],
  controllers: [UsersController],
})
export class UsersModule {}
```

**Explicación del Código:**

- **`providers: [UsersService, UserSubscriber]`**: Aquí se registra la clase `UserSubscriber` como un proveedor dentro del módulo `UsersModule`, lo que permite que el Subscriber escuche los eventos relacionados con la entidad `User`.

### Consideraciones

- **No Request-Scoped**: Es importante tener en cuenta que los Subscribers no pueden ser de tipo request-scoped. Esto significa que su ciclo de vida no está vinculado a una solicitud HTTP específica, sino que son singleton dentro del contexto de la aplicación.
  
### ¿Cuándo Usar Subscribers?

Los Subscribers son útiles en situaciones donde necesitas realizar acciones automáticas o implementar lógica adicional cuando ocurren eventos específicos en la base de datos. Ejemplos comunes incluyen:

- **Auditoría**: Registrar quién y cuándo se insertó, actualizó o eliminó un registro.
- **Validaciones o Ajustes**: Modificar los datos antes de que se inserten o actualicen en la base de datos.
- **Integraciones**: Disparar eventos para integraciones con otros sistemas cuando ciertos cambios ocurren en la base de datos.

### Resumen

Los Subscribers en TypeORM te permiten engancharte a eventos de entidades y reaccionar a ellos, lo que te da un control fino sobre lo que sucede en la base de datos en momentos clave. En NestJS, solo necesitas definir el Subscriber, registrarlo como proveedor en el módulo correspondiente, y ya estarás listo para usar esta poderosa herramienta.

## Migrations

Las migraciones en TypeORM son una herramienta esencial para gestionar y actualizar de manera incremental el esquema de la base de datos, asegurando que esté sincronizado con el modelo de datos de la aplicación sin perder los datos existentes. A continuación te explico cómo funcionan las migraciones, cómo generarlas, ejecutarlas y revertirlas.

### Concepto de Migraciones

Una migración es un archivo que contiene instrucciones para realizar cambios en la estructura de la base de datos, como crear o modificar tablas, columnas, índices, etc. Estos cambios se aplican de manera incremental, lo que significa que cada migración construye sobre la anterior. Esto permite actualizar el esquema de la base de datos en diferentes entornos (desarrollo, pruebas, producción) de forma controlada y coherente.

### Creación de Migraciones

Para crear migraciones, TypeORM proporciona una CLI (interfaz de línea de comandos) que genera un archivo de migración basado en los cambios detectados en tus entidades.

**Ejemplo de Comando para Generar una Migración:**

```bash
npx typeorm migration:generate -n CreateUsersTable
```

**Explicación:**

- **`npx typeorm`**: Ejecuta la CLI de TypeORM.
- **`migration:generate`**: Comando para generar una nueva migración.
- **`-n CreateUsersTable`**: Especifica el nombre de la migración. En este caso, la migración se llamará `CreateUsersTable`.

Este comando inspecciona las entidades de tu aplicación y genera un archivo de migración que contiene las operaciones necesarias para ajustar la base de datos al estado actual del modelo de datos.

### Ejecución de Migraciones

Una vez generada una migración, puedes aplicarla a la base de datos utilizando el comando `run`.

**Ejemplo de Comando para Ejecutar una Migración:**

```bash
npx typeorm migration:run
```

Este comando aplicará todas las migraciones pendientes a la base de datos, ejecutando las instrucciones contenidas en los archivos de migración en el orden en que fueron creados.

### Revertir Migraciones

Si necesitas deshacer una migración (por ejemplo, si cometiste un error o quieres volver a un estado anterior del esquema), puedes revertirla utilizando el comando `revert`.

**Ejemplo de Comando para Revertir la Última Migración:**

```bash
npx typeorm migration:revert
```

Este comando deshará la última migración ejecutada. Puedes ejecutar este comando varias veces si necesitas revertir más de una migración.

### Consideraciones Importantes

1. **Migraciones y el Código de la Aplicación:**
   - Las clases de migración están separadas del código fuente de la aplicación NestJS.
   - No puedes aprovechar características específicas de NestJS, como la inyección de dependencias, dentro de las migraciones porque estas son gestionadas por la CLI de TypeORM.

2. **Ciclo de Vida de las Migraciones:**
   - Las migraciones son mantenidas por la CLI de TypeORM, lo que significa que debes utilizar los comandos CLI para gestionarlas (generar, ejecutar, revertir).

3. **Prácticas Recomendadas:**
   - Genera migraciones automáticamente utilizando `migration:generate` para evitar errores manuales.
   - Siempre prueba tus migraciones en un entorno de desarrollo antes de aplicarlas en producción.
   - Manten un control estricto sobre el orden de las migraciones para evitar conflictos o dependencias incorrectas entre ellas.

### Resumen

Las migraciones en TypeORM son una herramienta poderosa para gestionar los cambios en el esquema de la base de datos de manera controlada y ordenada. Utilizando la CLI de TypeORM, puedes generar, ejecutar y revertir migraciones, asegurando que tu base de datos evoluciona junto con el modelo de datos de tu aplicación sin perder integridad ni datos. Aunque las migraciones están separadas del ciclo de vida de la aplicación NestJS, siguen siendo un componente crítico para mantener la consistencia en entornos de desarrollo y producción.


## Multiple databases

Cuando trabajas con proyectos que requieren múltiples conexiones a bases de datos, NestJS y TypeORM te permiten configurarlas de manera efectiva utilizando el módulo `TypeOrmModule`. Este enfoque es útil cuando diferentes partes de tu aplicación necesitan acceder a distintas bases de datos.

### Configuración de Múltiples Conexiones a Bases de Datos

Para configurar múltiples conexiones de bases de datos en NestJS, debes seguir estos pasos:

#### 1. **Configuración Básica de Conexiones**

Primero, debes definir las conexiones a las bases de datos en tu módulo principal (`AppModule`). Cada conexión puede tener su propio conjunto de entidades y configuración de conexión.

**Ejemplo de Configuración:**

```typescript
const defaultOptions = {
  type: 'postgres',
  port: 5432,
  username: 'user',
  password: 'password',
  database: 'db',
  synchronize: true,
};

@Module({
  imports: [
    // Conexión para la base de datos principal de usuarios
    TypeOrmModule.forRoot({
      ...defaultOptions,
      host: 'user_db_host',
      entities: [User],  // Entidades asociadas a esta base de datos
    }),
    // Conexión para la base de datos de álbumes
    TypeOrmModule.forRoot({
      ...defaultOptions,
      name: 'albumsConnection',  // Nombre de la conexión para identificación
      host: 'album_db_host',
      entities: [Album],  // Entidades asociadas a esta base de datos
    }),
  ],
})
export class AppModule {}
```

**Puntos Clave:**

- **Nombres de Conexión**: Es crucial asignar un nombre (`name`) a cada conexión si tienes más de una. Si no especificas un nombre, la conexión se asigna al nombre predeterminado (`default`). No debes tener múltiples conexiones sin nombre o con el mismo nombre, ya que esto podría causar que una conexión sobrescriba a la otra.
  
- **Entidades**: Cada conexión puede tener un conjunto diferente de entidades que estarán disponibles solo dentro de esa conexión.

#### 2. **Uso de Conexiones en Módulos**

Una vez configuradas las conexiones, debes especificar qué conexión usar para cada entidad cuando utilices `TypeOrmModule.forFeature()` y el decorador `@InjectRepository()`.

**Ejemplo de Configuración de Módulo:**

```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),  // Usa la conexión predeterminada
    TypeOrmModule.forFeature([Album], 'albumsConnection'),  // Usa la conexión 'albumsConnection'
  ],
})
export class AppModule {}
```

**Puntos Clave:**

- **`TypeOrmModule.forFeature([User])`**: Esto asocia la entidad `User` con la conexión predeterminada.
- **`TypeOrmModule.forFeature([Album], 'albumsConnection')`**: Esto asocia la entidad `Album` con la conexión `albumsConnection`.

#### 3. **Inyección de Dependencias**

Puedes inyectar un `DataSource`, `EntityManager` o un repositorio específico asociado a una conexión particular utilizando los decoradores `@InjectDataSource()` y `@InjectEntityManager()`.

**Ejemplo de Inyección en un Servicio:**

```typescript
@Injectable()
export class AlbumsService {
  constructor(
    @InjectDataSource('albumsConnection')
    private dataSource: DataSource,
    @InjectEntityManager('albumsConnection')
    private entityManager: EntityManager,
  ) {}
}
```

**Puntos Clave:**

- **`@InjectDataSource('albumsConnection')`**: Inyecta el `DataSource` asociado con la conexión `albumsConnection`.
- **`@InjectEntityManager('albumsConnection')`**: Inyecta el `EntityManager` asociado con la conexión `albumsConnection`.

#### 4. **Inyección en Proveedores**

También puedes inyectar cualquier `DataSource` en los proveedores utilizando `getDataSourceToken()`.

**Ejemplo de Inyección en un Proveedor:**

```typescript
@Module({
  providers: [
    {
      provide: AlbumsService,
      useFactory: (albumsConnection: DataSource) => {
        return new AlbumsService(albumsConnection);
      },
      inject: [getDataSourceToken('albumsConnection')],
    },
  ],
})
export class AlbumsModule {}
```

**Puntos Clave:**

- **`getDataSourceToken('albumsConnection')`**: Este método devuelve el token necesario para inyectar el `DataSource` asociado a la conexión `albumsConnection`.

### Aclaración:

### 1. **Inyección Directa en el Constructor (Primera Forma)**

Cuando utilizas la inyección directa en el constructor, necesitas usar los decoradores `@InjectDataSource()` y `@InjectEntityManager()` para especificar qué instancia específica (en este caso, la conexión o el `EntityManager` de una conexión específica) deseas inyectar.

```typescript
@Injectable()
export class AlbumsService {
  constructor(
    @InjectDataSource('albumsConnection')
    private readonly dataSource: DataSource,
    @InjectEntityManager('albumsConnection')
    private readonly entityManager: EntityManager,
  ) {}

  // Métodos que usan dataSource o entityManager
}
```

- **Decoradores `@InjectDataSource()` y `@InjectEntityManager()`:** Estos decoradores son necesarios para que NestJS sepa qué instancia inyectar, especialmente cuando trabajas con múltiples bases de datos.

### 2. **Inyección Usando una Fábrica (`useFactory`) (Segunda Forma)**

En el enfoque de la fábrica (`useFactory`), la inyección de las dependencias se realiza dentro de la función de fábrica, y no necesitas usar los decoradores `@InjectDataSource()` o `@InjectEntityManager()` dentro del constructor del servicio. La fábrica se encarga de proporcionar las dependencias correctas cuando se instancia el servicio.

```typescript
@Module({
  providers: [
    {
      provide: AlbumsService,
      useFactory: (albumsConnection: DataSource, entityManager: EntityManager) => {
        return new AlbumsService(albumsConnection, entityManager);
      },
      inject: [
        getDataSourceToken('albumsConnection'),
        getEntityManagerToken('albumsConnection'),
      ],
    },
  ],
})
export class AlbumsModule {}
```

Y en el servicio:

```typescript
@Injectable()
export class AlbumsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly entityManager: EntityManager,
  ) {}

  // Métodos que usan dataSource o entityManager
}
```

- **Sin Decoradores:** Como las dependencias se inyectan a través de la fábrica (`useFactory`), no necesitas los decoradores en el constructor.

### Resumen de las Diferencias:

- **Inyección Directa con Decoradores:**
  - Necesitas usar `@InjectDataSource()` y `@InjectEntityManager()` en el constructor para especificar qué instancia inyectar.
  - Es más directo y suele ser suficiente para la mayoría de los casos.

- **Inyección con Fábrica (`useFactory`):**
  - No necesitas usar decoradores en el constructor, ya que las dependencias se inyectan a través de la función de fábrica.
  - Ofrece mayor flexibilidad si necesitas ejecutar lógica adicional durante la creación de instancias o si trabajas con configuraciones más complejas.

Ambos enfoques son válidos, y la elección entre ellos depende de la complejidad de tu aplicación y de si necesitas personalizar la manera en que las dependencias son inyectadas.

### Resumen

1. **Configura múltiples conexiones** en el módulo principal utilizando `TypeOrmModule.forRoot()`, asignando un nombre único a cada conexión.
2. **Asocia entidades** específicas con cada conexión utilizando `TypeOrmModule.forFeature()`, especificando el nombre de la conexión cuando sea necesario.
3. **Inyecta `DataSource`, `EntityManager` o repositorios** específicos en servicios y proveedores utilizando `@InjectDataSource()` y `@InjectEntityManager()` con el nombre de la conexión correspondiente.

Este enfoque permite que una aplicación NestJS maneje múltiples bases de datos de manera eficiente, separando la lógica y las entidades según las necesidades de cada conexión de base de datos.