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

## Testing

### Testing en NestJS con Repositorios Mock

Cuando realizas pruebas unitarias en una aplicación NestJS, es crucial evitar las conexiones reales a bases de datos para mantener las pruebas rápidas y confiables. En lugar de conectar con una base de datos real, puedes usar **repositorios mock** que simulan el comportamiento de los repositorios reales. Esto es especialmente útil cuando tus servicios dependen de repositorios proporcionados por TypeORM.

### Problema: Dependencia de Repositorios

En muchas aplicaciones, las clases de servicio dependen de repositorios (`Repository`) para interactuar con la base de datos. En un entorno de pruebas, no queremos hacer una conexión real a la base de datos, pero necesitamos que las clases de servicio sigan funcionando correctamente. Para resolver esto, podemos crear **mock repositories**.

### Solución: Creación de Repositorios Mock

NestJS proporciona una función llamada `getRepositoryToken()` en el paquete `@nestjs/typeorm`. Esta función te permite obtener un token que representa al repositorio de una entidad específica, lo cual es necesario para reemplazarlo con un mock en tus pruebas.

### Ejemplo de Implementación

Supongamos que tienes un servicio `UsersService` que depende de `UsersRepository`. Durante las pruebas, puedes reemplazar `UsersRepository` con un repositorio mock.

#### Paso 1: Crear el Repositorio Mock

Primero, define un mock de tu repositorio que simule el comportamiento del repositorio real. Puedes hacerlo manualmente o usando una librería como `jest` para crear el mock.

```typescript
const mockRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
};
```

#### Paso 2: Configurar el Módulo de Pruebas

Luego, configura el módulo de pruebas y proporciona el repositorio mock usando `getRepositoryToken()`.

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    mockRepo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Agrega aquí tus pruebas unitarias utilizando el mockRepo
});
```

#### Paso 3: Escribir Pruebas

Ahora puedes escribir tus pruebas unitarias utilizando el servicio y el repositorio mock. Como `mockRepo` es un objeto simulado, puedes controlar su comportamiento en cada prueba.

**Ejemplo de Prueba:**

```typescript
it('should return an array of users', async () => {
  const usersArray = [{ id: 1, name: 'John' }];
  mockRepo.find.mockReturnValue(usersArray);

  const result = await service.findAll();
  expect(result).toEqual(usersArray);
  expect(mockRepo.find).toHaveBeenCalledTimes(1);
});
```

### Explicación del Proceso

1. **`getRepositoryToken(User)`**: Esta función obtiene un token que representa al repositorio de la entidad `User`. NestJS utiliza este token para inyectar la dependencia correcta en el servicio.
  
2. **`useValue: mockRepository`**: En el módulo de pruebas, `useValue` reemplaza el repositorio real con el mock. Cada vez que `UsersService` intenta acceder a `UsersRepository`, NestJS le proporcionará el `mockRepository`.

3. **Simulación del Comportamiento**: Dentro de tus pruebas, puedes simular diferentes comportamientos del repositorio mock (como `find`, `save`, `remove`) para cubrir varios escenarios de prueba.

### Resumen

- **Repositorios Mock**: Utiliza repositorios mock para evitar la dependencia de una base de datos real en tus pruebas unitarias.
- **`getRepositoryToken()`**: Esta función permite reemplazar repositorios reales con mocks en el contexto de pruebas.
- **Ejecución de Pruebas**: Los mocks permiten ejecutar pruebas rápidas y confiables, simulando el comportamiento de las operaciones de base de datos.

Este enfoque asegura que tus pruebas unitarias sean rápidas, independientes y fáciles de mantener, sin necesidad de una conexión a una base de datos real.

## Async Configuration

### Configuración Asíncrona en TypeORM con NestJS

En algunos casos, puede ser necesario configurar el módulo de TypeORM de forma asíncrona, especialmente cuando las opciones de configuración dependen de valores que no están disponibles en el momento de la compilación, como variables de entorno, configuraciones externas, o servicios que necesitan ser inyectados. NestJS proporciona varios métodos para manejar la configuración asíncrona utilizando `forRootAsync()`.

### Métodos para Configuración Asíncrona

1. **`useFactory`**: Permite usar una función de fábrica para proporcionar las opciones de configuración de TypeORM. Esta función puede ser asíncrona y puede recibir dependencias inyectadas.

2. **`useClass`**: Permite utilizar una clase que implemente la interfaz `TypeOrmOptionsFactory` para proporcionar las opciones de configuración. Esta clase se instancia dentro de `TypeOrmModule` y se utiliza para generar las opciones.

3. **`useExisting`**: Reutiliza un proveedor existente para proporcionar las opciones de configuración en lugar de crear una nueva instancia.

### 1. Configuración Asíncrona con `useFactory`

Esta es una de las formas más flexibles de proporcionar configuración asíncrona. Puedes definir una función de fábrica que devuelva las opciones de configuración, y esta función puede ser asíncrona y tener dependencias inyectadas.

**Ejemplo con `useFactory` y `ConfigService`:**

```typescript
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get('HOST'),
    port: +configService.get('PORT'),
    username: configService.get('USERNAME'),
    password: configService.get('PASSWORD'),
    database: configService.get('DATABASE'),
    entities: [],
    synchronize: true,
  }),
  inject: [ConfigService],
});
```

**Explicación:**

- **`useFactory`**: Define una función de fábrica que retorna las opciones de configuración. Aquí, `configService` se utiliza para obtener valores de configuración.
- **`inject`**: Especifica las dependencias que deben ser inyectadas en la función de fábrica, en este caso, `ConfigService`.

### 2. Configuración Asíncrona con `useClass`

Este método permite utilizar una clase que implemente la interfaz `TypeOrmOptionsFactory`. La clase proporcionará las opciones de configuración cuando se invoque su método `createTypeOrmOptions()`.

**Ejemplo con `useClass`:**

```typescript
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [],
      synchronize: true,
    };
  }
}

TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService,
});
```

**Explicación:**

- **`useClass`**: Se especifica una clase (`TypeOrmConfigService`) que implementa la interfaz `TypeOrmOptionsFactory`. Esta clase es instanciada y su método `createTypeOrmOptions()` es llamado para obtener las opciones de configuración.

### 3. Configuración Asíncrona con `useExisting`

Si ya tienes una instancia de un servicio que proporciona la configuración, puedes reutilizarla en lugar de crear una nueva instancia. Este método es útil cuando el servicio de configuración ya está siendo gestionado por otro módulo.

**Ejemplo con `useExisting`:**

```typescript
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useExisting: ConfigService,
});
```

**Explicación:**

- **`useExisting`**: Reutiliza un proveedor existente (`ConfigService`) para proporcionar las opciones de configuración. A diferencia de `useClass`, no se crea una nueva instancia del servicio; en su lugar, se usa la instancia ya gestionada por otro módulo.

### Consideraciones

- **Nombre de la Conexión**: Si estás utilizando múltiples conexiones, asegúrate de definir la propiedad `name` al mismo nivel que `useFactory`, `useClass`, o `useExisting`. Esto permite que NestJS registre correctamente la fuente de datos bajo el token de inyección adecuado.

### Resumen

- **`useFactory`**: Ideal cuando necesitas configurar de forma dinámica y asíncrona, y cuando las opciones dependen de otros servicios o valores de configuración.
- **`useClass`**: Útil cuando prefieres encapsular la lógica de configuración en una clase que sigue la interfaz `TypeOrmOptionsFactory`.
- **`useExisting`**: Reutiliza una instancia existente de un servicio, evitando la creación de una nueva.

Cada uno de estos métodos ofrece una forma flexible de manejar la configuración asíncrona en aplicaciones NestJS, permitiéndote adaptar la configuración de TypeORM a las necesidades de tu aplicación, ya sea que las opciones de configuración dependan de servicios externos, variables de entorno, o cualquier otro recurso.

## Custom DataSource Factory

### `Custom DataSource Factory` en NestJS con TypeORM

En NestJS, cuando configuramos TypeORM de forma asíncrona utilizando `useFactory`, `useClass`, o `useExisting`, es posible que queramos tener un control más granular sobre cómo se crea e inicializa la conexión a la base de datos (es decir, el `DataSource`). Para ello, NestJS permite especificar una función personalizada `dataSourceFactory`, que se encarga de crear y configurar el `DataSource` en lugar de dejar que `TypeOrmModule` lo haga automáticamente.

### ¿Qué es `dataSourceFactory`?

`dataSourceFactory` es una función que recibe las `DataSourceOptions` configuradas y devuelve una promesa que resuelve en una instancia de `DataSource` de TypeORM. Esto permite personalizar cómo se crea la conexión a la base de datos, lo cual es útil en escenarios avanzados, como la configuración de estrategias de conexión, el manejo de conexiones en clústeres, o la integración con servicios externos que gestionan bases de datos.

### Ejemplo de Implementación

Aquí tienes un ejemplo de cómo podrías utilizar `dataSourceFactory` junto con `useFactory` para crear un `DataSource` personalizado:

```typescript
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  // useFactory para configurar DataSourceOptions
  useFactory: (configService: ConfigService): DataSourceOptions => ({
    type: 'mysql',
    host: configService.get('HOST'),
    port: +configService.get('PORT'),
    username: configService.get('USERNAME'),
    password: configService.get('PASSWORD'),
    database: configService.get('DATABASE'),
    entities: [],
    synchronize: true,
  }),
  // dataSourceFactory para crear y devolver un DataSource personalizado
  dataSourceFactory: async (options: DataSourceOptions) => {
    const dataSource = new DataSource(options);
    await dataSource.initialize();
    return dataSource;
  },
});
```

### Explicación del Código

1. **`useFactory`**: Configura las `DataSourceOptions` de TypeORM. Aquí se utilizan valores de configuración obtenidos a través de `ConfigService` (por ejemplo, host, puerto, usuario, contraseña, etc.).

2. **`dataSourceFactory`**: Esta función recibe las `DataSourceOptions` configuradas y crea una instancia personalizada de `DataSource`. Luego, inicializa la conexión con `dataSource.initialize()` y devuelve la instancia inicializada.

### ¿Cuándo usar `dataSourceFactory`?

- **Personalización Avanzada**: Si necesitas realizar alguna personalización avanzada en la creación del `DataSource`, como la configuración de opciones adicionales no manejadas por defecto por TypeOrmModule.
- **Gestión Externa del `DataSource`**: Si tu aplicación requiere que el `DataSource` sea gestionado por un servicio externo o si necesitas realizar operaciones adicionales antes de que el `DataSource` esté listo para ser usado.

### Resumen

- **`dataSourceFactory`**: Permite tener un control total sobre cómo se crea e inicializa el `DataSource` en TypeORM.
- **Uso en `forRootAsync`**: Se utiliza junto con métodos como `useFactory`, `useClass`, o `useExisting` para configurar la conexión de TypeORM de forma asíncrona.
- **Flexibilidad**: Ofrece la flexibilidad necesaria para gestionar casos avanzados o personalizados en la configuración de la base de datos, proporcionando un `DataSource` completamente adaptado a las necesidades de la aplicación.

Este enfoque es particularmente útil en aplicaciones que requieren una configuración de base de datos más compleja o cuando se necesita integrar con servicios externos que manejan la creación o gestión de la base de datos.

## Sequelize

### Integración de Sequelize con NestJS

Sequelize es una alternativa a TypeORM para trabajar con bases de datos relacionales en aplicaciones NestJS. Al usar el paquete `@nestjs/sequelize`, puedes aprovechar el ORM Sequelize, junto con `sequelize-typescript`, que proporciona decoradores adicionales para definir entidades de forma declarativa en TypeScript.

### Instalación de Dependencias

Para empezar, necesitas instalar las dependencias necesarias. En este ejemplo, usaremos MySQL como el sistema de gestión de bases de datos relacionales, pero Sequelize también soporta otros sistemas como PostgreSQL, Microsoft SQL Server, SQLite y MariaDB.

**Comandos de instalación:**

```bash
$ npm install --save @nestjs/sequelize sequelize sequelize-typescript mysql2
$ npm install --save-dev @types/sequelize
```

### Configuración Básica

Una vez que hayas instalado las dependencias, el siguiente paso es importar `SequelizeModule` en tu módulo principal (`AppModule`), configurando los detalles de conexión a la base de datos.

#### Ejemplo de `AppModule`:

```typescript
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      models: [],  // Aquí se registrarán tus modelos de Sequelize
    }),
  ],
})
export class AppModule {}
```

### Propiedades de Configuración

El método `forRoot()` soporta todas las propiedades de configuración que expone el constructor de Sequelize. Aquí se describen algunas propiedades adicionales que puedes configurar:

- **`retryAttempts`**: Número de intentos para conectarse a la base de datos en caso de fallo (por defecto: 10).
- **`retryDelay`**: Retraso entre los intentos de reconexión (en milisegundos, por defecto: 3000 ms).
- **`autoLoadModels`**: Si es `true`, los modelos se cargarán automáticamente (por defecto: `false`).
- **`keepConnectionAlive`**: Si es `true`, la conexión no se cerrará cuando la aplicación se apague (por defecto: `false`).
- **`synchronize`**: Si es `true`, los modelos cargados automáticamente se sincronizarán con la base de datos (por defecto: `true`).

### Inyección de Sequelize

Después de configurar Sequelize en tu módulo principal, el objeto Sequelize estará disponible para ser inyectado en cualquier parte de tu aplicación sin necesidad de importar módulos adicionales.

#### Ejemplo de Servicio con Inyección de Sequelize:

```typescript
import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AppService {
  constructor(private sequelize: Sequelize) {}
  
  // Ejemplo de uso de Sequelize en un método
  async getDatabaseInfo() {
    const dbInfo = await this.sequelize.query('SELECT DATABASE()');
    return dbInfo;
  }
}
```

### Uso de Modelos

En Sequelize, las entidades (similares a las "entidades" en TypeORM) se definen como modelos. Puedes definir tus modelos usando decoradores de `sequelize-typescript` y luego registrarlos en el arreglo `models` dentro de la configuración de `SequelizeModule`.

#### Ejemplo de Modelo:

```typescript
import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class User extends Model<User> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column
  name: string;

  @Column
  email: string;
}
```

#### Registro del Modelo en `AppModule`:

```typescript
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      models: [User],  // Registra aquí tus modelos
      autoLoadModels: true, // Opcional: carga automática de modelos
      synchronize: true, // Sincronización automática con la base de datos
    }),
  ],
})
export class AppModule {}
```

### Resumen

- **Sequelize con NestJS**: Usar Sequelize como ORM en lugar de TypeORM, aprovechando la integración proporcionada por `@nestjs/sequelize` y `sequelize-typescript`.
- **Configuración Flexible**: La configuración de Sequelize se hace en el `AppModule` usando `SequelizeModule.forRoot()`, donde se especifican las opciones de conexión a la base de datos.
- **Modelos**: Las entidades se definen como modelos de Sequelize, y se registran en la configuración del módulo para su uso en la aplicación.
- **Inyección de Sequelize**: El objeto Sequelize se puede inyectar en cualquier parte de la aplicación para realizar operaciones de base de datos.

Este enfoque te permite aprovechar las características de Sequelize junto con la potencia de NestJS para construir aplicaciones robustas y bien estructuradas que interactúan con bases de datos relacionales.

## Models

### Uso de Modelos con Sequelize en NestJS

Sequelize utiliza el patrón **Active Record**, donde las clases de los modelos representan directamente las tablas en la base de datos, y estas clases contienen métodos para interactuar con los datos. A continuación, te explico cómo definir un modelo, configurarlo en NestJS, y usarlo en un servicio.

### Definición del Modelo `User`

Primero, definimos un modelo `User` utilizando decoradores de `sequelize-typescript`. Este modelo representará una tabla `Users` en la base de datos.

**user.model.ts**

```typescript
import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column({ defaultValue: true })
  isActive: boolean;
}
```

**Explicación:**

- **`@Table`**: Decorador que indica que la clase representa una tabla en la base de datos.
- **`@Column`**: Decorador que define una columna en la tabla para cada propiedad de la clase.

### Registro del Modelo en `AppModule`

Para que Sequelize reconozca el modelo `User`, debes registrarlo en el módulo principal (`AppModule`), especificándolo en la propiedad `models` dentro de la configuración de `SequelizeModule`.

**app.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/user.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      models: [User],  // Registro del modelo
    }),
  ],
})
export class AppModule {}
```

### Configuración del Módulo `UsersModule`

El siguiente paso es configurar el módulo que gestionará el modelo `User`. Para ello, usamos `SequelizeModule.forFeature()` para registrar el modelo dentro del ámbito del módulo `UsersModule`.

**users.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
```

**Explicación:**

- **`SequelizeModule.forFeature([User])`**: Este método registra el modelo `User` dentro del alcance del módulo `UsersModule`, permitiendo que el modelo sea inyectado y utilizado en los servicios y controladores dentro de este módulo.

### Uso del Modelo en el Servicio `UsersService`

En el servicio `UsersService`, utilizamos el decorador `@InjectModel()` para inyectar el modelo `User` y luego utilizarlo para realizar operaciones en la base de datos.

**users.service.ts**

```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  findOne(id: string): Promise<User> {
    return this.userModel.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }
}
```

**Explicación:**

- **`@InjectModel(User)`**: Inyecta el modelo `User` en el servicio. `userModel` es ahora una referencia directa a la clase `User`, lo que permite realizar operaciones en la base de datos, como `findAll`, `findOne`, y `destroy`.
- **Operaciones CRUD**: Los métodos `findAll`, `findOne`, y `remove` muestran cómo interactuar con los datos usando el modelo inyectado.

### Re-exportación de Modelos

Si necesitas usar el modelo `User` fuera del módulo que lo registró (por ejemplo, en otro módulo), debes re-exportar el módulo `SequelizeModule` con el modelo registrado.

**users.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  exports: [SequelizeModule]
})
export class UsersModule {}
```

### Integración en Otros Módulos

Cuando otro módulo, como `UserHttpModule`, necesita usar `UsersService` o el modelo `User`, simplemente importa `UsersModule`.

**users-http.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [UsersModule],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UserHttpModule {}
```

### Resumen

- **Patrón Active Record**: Sequelize sigue el patrón Active Record, permitiendo que los modelos interactúen directamente con la base de datos.
- **Definición de Modelos**: Los modelos se definen usando decoradores de `sequelize-typescript` y se registran en los módulos apropiados.
- **Inyección de Modelos**: Los modelos se inyectan en los servicios usando `@InjectModel`, lo que permite realizar operaciones en la base de datos de manera sencilla y directa.
- **Re-exportación de Módulos**: Si otros módulos necesitan acceder a los modelos, se debe re-exportar el módulo que contiene los modelos registrados.

Este enfoque permite manejar las entidades de la base de datos de manera organizada y modular, manteniendo la aplicación estructurada y fácil de mantener.

## Relations

### Relaciones en Sequelize con NestJS

Las relaciones en Sequelize permiten establecer asociaciones entre tablas, que se reflejan en los modelos definidos en tu aplicación. Estas relaciones se basan en campos comunes entre las tablas, generalmente involucrando claves primarias y foráneas.

### Tipos de Relaciones

1. **One-to-One (Uno a Uno)**: Cada fila en la tabla primaria tiene una única fila asociada en la tabla secundaria.
2. **One-to-Many / Many-to-One (Uno a Muchos / Muchos a Uno)**: Cada fila en la tabla primaria puede tener una o más filas relacionadas en la tabla secundaria.
3. **Many-to-Many (Muchos a Muchos)**: Cada fila en la tabla primaria puede estar relacionada con muchas filas en la tabla secundaria, y viceversa.

### Definiendo Relaciones en Modelos

Para definir relaciones entre modelos en Sequelize utilizando `sequelize-typescript`, se utilizan decoradores específicos. A continuación, se muestra un ejemplo de cómo definir una relación **One-to-Many** entre un modelo `User` y un modelo `Photo`.

### Ejemplo de Relación One-to-Many

Imagina que quieres definir que un usuario puede tener varias fotos asociadas. Para ello, usas el decorador `@HasMany()` en el modelo `User` para indicar esta relación.

**user.model.ts**

```typescript
import { Column, Model, Table, HasMany } from 'sequelize-typescript';
import { Photo } from '../photos/photo.model';

@Table
export class User extends Model {
  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column({ defaultValue: true })
  isActive: boolean;

  @HasMany(() => Photo)
  photos: Photo[];
}
```

**photo.model.ts**

```typescript
import { Column, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../users/user.model';

@Table
export class Photo extends Model {
  @Column
  url: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
```

### Explicación de los Decoradores

1. **`@HasMany(() => Photo)`**:
   - Este decorador en el modelo `User` establece una relación **One-to-Many** con el modelo `Photo`.
   - `photos: Photo[]` en el modelo `User` será un arreglo que contenga las fotos asociadas a ese usuario.

2. **`@ForeignKey(() => User)`**:
   - Este decorador en el modelo `Photo` define la clave foránea `userId`, que establece la relación con el modelo `User`.

3. **`@BelongsTo(() => User)`**:
   - Este decorador en el modelo `Photo` establece la relación inversa, indicando que cada foto pertenece a un usuario.

### Consideraciones

- **Clave Foránea**: Es importante definir las claves foráneas en los modelos secundarios (como `Photo`) para establecer correctamente las relaciones.
- **Decoradores Relacionales**: `@HasMany`, `@BelongsTo`, `@HasOne`, y `@BelongsToMany` son decoradores que te permiten definir los diferentes tipos de relaciones en Sequelize.
  
### Resumen

- **Relaciones en Sequelize**: Las relaciones entre tablas se definen utilizando decoradores específicos que establecen cómo se relacionan los modelos entre sí.
- **Decoradores Específicos**: Usa `@HasMany`, `@BelongsTo`, `@ForeignKey`, entre otros, para definir y configurar las relaciones entre modelos.
- **Modelos Relacionados**: Los modelos relacionados en una relación `One-to-Many` incluyen un arreglo del modelo secundario en el modelo primario (por ejemplo, `User` tiene muchas `Photo`).

Este enfoque facilita la gestión de relaciones complejas entre tablas en tu base de datos relacional, manteniendo el código organizado y fácil de mantener.

## Autoload

### Carga Automática de Modelos en Sequelize con NestJS

Configurar manualmente los modelos en el arreglo `models` de las opciones de conexión puede ser tedioso y propenso a errores, especialmente en aplicaciones grandes. Además, referenciar modelos directamente en el módulo raíz puede romper los límites del dominio de la aplicación y causar problemas de mantenimiento. Para abordar estos problemas, Sequelize con NestJS permite la carga automática de modelos.

### Configuración de Carga Automática de Modelos

Puedes habilitar la carga automática de modelos configurando las propiedades `autoLoadModels` y `synchronize` en `true` dentro del objeto de configuración pasado al método `forRoot()` del `SequelizeModule`.

#### Ejemplo de Configuración

```typescript
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      autoLoadModels: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
```

**Explicación de las Propiedades:**

1. **`autoLoadModels: true`**:
   - Esta propiedad permite que todos los modelos registrados a través del método `forFeature()` sean automáticamente agregados al arreglo `models` en la configuración de la conexión. Esto evita la necesidad de especificar manualmente cada modelo.

2. **`synchronize: true`**:
   - Habilita la sincronización automática de los modelos con la base de datos. Esto significa que Sequelize creará o actualizará las tablas en la base de datos para reflejar la estructura definida en los modelos.

### Consideraciones Importantes

- **Modelos Referenciados**: Ten en cuenta que los modelos que no estén registrados explícitamente a través del método `forFeature()`, pero que sean referenciados en otro modelo a través de una asociación, no se cargarán automáticamente. Es importante asegurarse de que todos los modelos relevantes estén registrados.

- **Uso en Producción**: Aunque la propiedad `synchronize` es conveniente durante el desarrollo, se recomienda desactivarla en entornos de producción para evitar la sincronización automática que podría causar pérdidas de datos inadvertidas.

### Resumen

- **Carga Automática**: Usar `autoLoadModels: true` permite que los modelos sean automáticamente cargados en la configuración de Sequelize, reduciendo la necesidad de configuraciones manuales.
- **Sincronización**: `synchronize: true` sincroniza automáticamente los modelos con la base de datos, creando o actualizando tablas según sea necesario.
- **Configuración Simplificada**: Este enfoque simplifica la configuración, especialmente en aplicaciones grandes, y ayuda a mantener los límites del dominio más claros al evitar referencias innecesarias en el módulo raíz.

Este método de configuración es ideal para agilizar el desarrollo y mantener un código más limpio y organizado, especialmente en proyectos donde la cantidad de modelos puede crecer rápidamente.

## Sequelize Transactions

### Transacciones en Sequelize con NestJS

Las transacciones en una base de datos representan una unidad de trabajo que se ejecuta de manera coherente y se trata de forma independiente de otras transacciones. Esto asegura que las operaciones realizadas dentro de una transacción se completen exitosamente o, en caso de error, se reviertan completamente, manteniendo la integridad de los datos.

### Estrategias para Manejar Transacciones en Sequelize

Sequelize ofrece varias estrategias para manejar transacciones. A continuación, se muestra cómo implementar una transacción gestionada (auto-callback) en un servicio NestJS.

### Implementación de Transacciones

#### 1. **Inyectar la Instancia de Sequelize**

Primero, necesitamos inyectar la instancia de Sequelize en el servicio que gestionará la transacción. Esto se hace de manera normal mediante el constructor de la clase.

```typescript
import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class UsersService {
  constructor(private sequelize: Sequelize) {}
}
```

#### 2. **Crear una Transacción Gestionada**

Ahora, utilizamos la instancia de Sequelize para crear una transacción. En este ejemplo, se utiliza el método `transaction()` de Sequelize, que recibe una función de callback asíncrona donde se ejecutan las operaciones dentro de la transacción.

```typescript
async createMany() {
  try {
    await this.sequelize.transaction(async (t) => {
      const transactionHost = { transaction: t };

      await this.userModel.create(
        { firstName: 'Abraham', lastName: 'Lincoln' },
        transactionHost,
      );
      await this.userModel.create(
        { firstName: 'John', lastName: 'Boothe' },
        transactionHost,
      );
    });
  } catch (err) {
    // Si ocurre un error, la transacción se revierte automáticamente.
    // `err` contendrá el error que causó el rechazo de la promesa dentro del callback de la transacción.
  }
}
```

**Explicación:**

- **`this.sequelize.transaction()`**: Inicia una nueva transacción. Este método acepta una función de callback asíncrona donde se ejecutan las operaciones de la base de datos.
- **`transactionHost`**: Este objeto contiene la transacción (`t`) y se pasa como opción en cada operación de Sequelize para asegurarse de que se ejecuten dentro de la misma transacción.
- **Rollback automático**: Si cualquier operación dentro de la transacción falla, Sequelize automáticamente revierte la transacción, asegurando que no se apliquen cambios parciales.

### Testing y Mocking

Para probar esta clase sin realizar una conexión real a la base de datos, necesitarás hacer mocking de la instancia de Sequelize. Como la instancia de Sequelize expone varios métodos, puede ser complejo de mockear directamente. Una solución recomendada es usar una clase de ayuda, como `TransactionRunner`, que encapsule la lógica de la transacción y exponga solo los métodos necesarios.

**Ejemplo Simplificado de Mocking:**

```typescript
class TransactionRunner {
  constructor(private sequelize: Sequelize) {}

  async runTransaction(work: (t: Transaction) => Promise<void>) {
    return this.sequelize.transaction(work);
  }
}
```

Con esta clase, puedes simplificar el mocking en los tests:

```typescript
const mockSequelize = {
  transaction: jest.fn((work) => work(mockTransaction)),
};

const runner = new TransactionRunner(mockSequelize as any);
await runner.runTransaction(async (t) => {
  // Operaciones de prueba dentro de la transacción
});
```

### Resumen

- **Gestión de Transacciones**: Sequelize permite manejar transacciones fácilmente mediante el método `transaction()`, que asegura que todas las operaciones dentro de la transacción se completen o se reviertan en caso de error.
- **Inyección de Sequelize**: La instancia de Sequelize se inyecta en el servicio para gestionar la creación de transacciones.
- **Mocking**: Para facilitar el testing, se recomienda encapsular la lógica de transacciones en una clase de ayuda, lo que simplifica el mocking y la prueba de las funcionalidades relacionadas con transacciones.

Este enfoque permite manejar operaciones complejas en la base de datos de manera segura y eficiente, manteniendo la integridad de los datos en todo momento.

Entiendo que el concepto de mocking, especialmente aplicado a Sequelize, puede ser un poco complejo si no estás familiarizado con las pruebas unitarias y cómo se simulan dependencias en estos contextos. Voy a desglosarlo de una manera más clara y detallada.

### ¿Qué es un "Mock"?

Un **mock** es una versión simulada de una dependencia real que se usa en pruebas unitarias para aislar el código que estás probando. En lugar de interactuar con la dependencia real (por ejemplo, una base de datos), interactúas con un objeto simulado que imita el comportamiento de esa dependencia.

### ¿Por qué hacer mocking de Sequelize?

Cuando pruebas código que interactúa con una base de datos, no siempre es deseable o práctico hacer pruebas con la base de datos real, porque:

1. **Las pruebas se vuelven lentas** debido a las operaciones de I/O.
2. **Es difícil configurar el estado de la base de datos** de manera repetible para cada prueba.
3. **Podrías alterar datos reales** si no tienes cuidado.

En su lugar, puedes "mockear" Sequelize para que las pruebas se ejecuten más rápido y de manera más confiable, sin necesidad de una base de datos real.

### Ejemplo con Mock de Sequelize

Supongamos que tienes un servicio (`UsersService`) que usa Sequelize para gestionar usuarios en la base de datos. Este servicio tiene un método `createMany` que crea varios usuarios dentro de una transacción.

#### Código Real

```typescript
import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(private sequelize: Sequelize, private userModel: typeof User) {}

  async createMany(users: { firstName: string; lastName: string }[]) {
    return this.sequelize.transaction(async (t) => {
      for (const user of users) {
        await this.userModel.create(user, { transaction: t });
      }
    });
  }
}
```

#### Objetivo del Mocking

Queremos probar `UsersService.createMany()` sin usar una base de datos real. Para ello, necesitamos mockear dos cosas:

1. **El método `transaction` de Sequelize** para que no haga una transacción real.
2. **El modelo `User`** para que no interactúe con la base de datos.

#### Creación del Mock

1. **Mock del Modelo `User`**: Simulamos el método `create` del modelo `User`.

2. **Mock de `Sequelize`**: Simulamos el método `transaction` de Sequelize.

```typescript
// Mock del método `create` del modelo `User`
const mockUserModel = {
  create: jest.fn(),  // Simula el método `create`
};

// Mock del método `transaction` de Sequelize
const mockTransaction = { commit: jest.fn(), rollback: jest.fn() };
const mockSequelize = {
  transaction: jest.fn((callback) => callback(mockTransaction)),  // Simula `transaction`
};

// Instancia del servicio usando los mocks
const service = new UsersService(mockSequelize as any, mockUserModel as any);

// Prueba unitaria
describe('UsersService', () => {
  it('should create multiple users within a transaction', async () => {
    const users = [
      { firstName: 'Abraham', lastName: 'Lincoln' },
      { firstName: 'John', lastName: 'Boothe' },
    ];

    await service.createMany(users);

    // Verificar que `transaction` fue llamado
    expect(mockSequelize.transaction).toHaveBeenCalledTimes(1);

    // Verificar que `create` fue llamado dos veces
    expect(mockUserModel.create).toHaveBeenCalledTimes(2);

    // Verificar que `create` fue llamado con los datos correctos
    expect(mockUserModel.create).toHaveBeenCalledWith(users[0], { transaction: mockTransaction });
    expect(mockUserModel.create).toHaveBeenCalledWith(users[1], { transaction: mockTransaction });
  });
});
```

### Desglose del Ejemplo

- **`jest.fn()`**: Crea una función simulada que puedes configurar y controlar en tus pruebas. 
  - **Ejemplo**: `jest.fn((callback) => callback(mockTransaction))` simula el método `transaction` de Sequelize, ejecutando el callback y pasando un mock de la transacción.
  
- **`mockUserModel.create`**: Simula el método `create` del modelo `User`, lo que permite verificar que se llame con los argumentos correctos sin interactuar realmente con la base de datos.

- **`mockSequelize.transaction`**: Simula el comportamiento de `transaction`, ejecutando el callback pasado y simulando que se ha hecho una transacción sin tocar la base de datos.

### Resumen

- **Mocking**: Es una técnica para simular dependencias externas, como Sequelize, para hacer que las pruebas sean rápidas y seguras.
- **Uso de `jest.fn()`**: Te permite crear funciones simuladas que imitan el comportamiento de métodos reales de Sequelize, como `transaction` y `create`.
- **Pruebas sin Base de Datos**: Al usar mocks, puedes probar la lógica de tu aplicación sin necesidad de una base de datos real, lo que facilita las pruebas unitarias y las hace más eficientes.

Este enfoque es fundamental en el testing moderno, ya que permite a los desarrolladores asegurar la calidad del código sin depender de recursos externos costosos en términos de tiempo y configuración.

En el ejemplo anterior no mencioné directamente el uso de `TransactionRunner`, pero puedo explicarte cómo lo incorporarías en una prueba si decides encapsular la lógica de la transacción en una clase como `TransactionRunner`.

### ¿Qué es `TransactionRunner`?

`TransactionRunner` es una clase de ayuda que encapsula la lógica para manejar transacciones en Sequelize. Esto es útil porque te permite centralizar el manejo de transacciones, facilitando su prueba y reutilización. Además, simplifica el mocking en las pruebas unitarias, ya que solo necesitas mockear un número limitado de métodos en lugar de toda la API de Sequelize.

### Definiendo `TransactionRunner`

Primero, vamos a definir la clase `TransactionRunner`:

```typescript
import { Sequelize, Transaction } from 'sequelize-typescript';

export class TransactionRunner {
  constructor(private sequelize: Sequelize) {}

  async runTransaction<T>(work: (transaction: Transaction) => Promise<T>): Promise<T> {
    return this.sequelize.transaction(work);
  }
}
```

### Modificando `UsersService` para usar `TransactionRunner`

Ahora, actualizamos el servicio `UsersService` para que utilice `TransactionRunner` en lugar de interactuar directamente con Sequelize:

```typescript
import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { TransactionRunner } from './transaction-runner';

@Injectable()
export class UsersService {
  constructor(
    private userModel: typeof User,
    private transactionRunner: TransactionRunner,
  ) {}

  async createMany(users: { firstName: string; lastName: string }[]) {
    return this.transactionRunner.runTransaction(async (t) => {
      for (const user of users) {
        await this.userModel.create(user, { transaction: t });
      }
    });
  }
}
```

### Probando `UsersService` con `TransactionRunner`

Ahora que `UsersService` utiliza `TransactionRunner`, podemos enfocarnos en mockear `TransactionRunner` en nuestras pruebas unitarias.

#### Mocking y Pruebas

1. **Mocking del `TransactionRunner`**:
   - Mockeamos el método `runTransaction` de `TransactionRunner` para simular el comportamiento de la transacción.

2. **Mock del Modelo `User`**:
   - También necesitamos mockear el modelo `User` como antes.

```typescript
import { Transaction } from 'sequelize';
import { TransactionRunner } from './transaction-runner';
import { UsersService } from './users.service';

const mockUserModel = {
  create: jest.fn(),
};

const mockTransaction: Transaction = {} as Transaction;  // Simulación básica de la transacción

const mockTransactionRunner = {
  runTransaction: jest.fn((work) => work(mockTransaction)),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    service = new UsersService(mockUserModel as any, mockTransactionRunner as any);
  });

  it('should create multiple users within a transaction', async () => {
    const users = [
      { firstName: 'Abraham', lastName: 'Lincoln' },
      { firstName: 'John', lastName: 'Boothe' },
    ];

    await service.createMany(users);

    expect(mockTransactionRunner.runTransaction).toHaveBeenCalledTimes(1);
    expect(mockUserModel.create).toHaveBeenCalledTimes(2);
    expect(mockUserModel.create).toHaveBeenCalledWith(users[0], { transaction: mockTransaction });
    expect(mockUserModel.create).toHaveBeenCalledWith(users[1], { transaction: mockTransaction });
  });
});
```

### Explicación

- **`mockTransactionRunner.runTransaction`**: Simula la ejecución de una transacción. Este mock permite verificar que `runTransaction` se haya llamado correctamente y que la lógica de transacción dentro del callback funcione como se espera.

- **Inyección de `TransactionRunner`**: Al inyectar `TransactionRunner` en `UsersService`, las pruebas se simplifican porque solo necesitas controlar `runTransaction` y el modelo `User`.

### Resumen

- **`TransactionRunner`**: Centraliza la lógica de manejo de transacciones en una clase reutilizable.
- **Pruebas Simplificadas**: Al utilizar `TransactionRunner`, el mock y las pruebas se simplifican, porque reduces la cantidad de métodos que necesitas mockear.
- **Mocking**: En las pruebas unitarias, mockeas `runTransaction` de `TransactionRunner` para verificar que la transacción se maneje como se espera.

Este enfoque te proporciona un código más modular y pruebas más fáciles de escribir y mantener, ya que reduces la complejidad de interactuar directamente con la API de Sequelize en cada prueba.