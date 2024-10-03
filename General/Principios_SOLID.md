# Principios SOLID

### 1. **Single Responsibility Principle (SRP)**
Cada clase debe tener una sola responsabilidad. Esto significa que una clase debe hacer una sola cosa y tener un único motivo para cambiar.

#### Ejemplo:
Supongamos que tenemos una clase que gestiona tanto la información de un usuario como el envío de correos electrónicos. Esto viola el principio de responsabilidad única.

```typescript
class UserService {
  createUser(name: string, email: string) {
    // Lógica para crear usuario
  }

  sendEmail(email: string, message: string) {
    // Lógica para enviar correo
  }
}
```

Aquí, la clase `UserService` está haciendo dos cosas: gestionando usuarios y enviando correos electrónicos. Podemos refactorizarla para que cada clase tenga una sola responsabilidad.

```typescript
class UserService {
  createUser(name: string, email: string) {
    // Lógica para crear usuario
  }
}

class EmailService {
  sendEmail(email: string, message: string) {
    // Lógica para enviar correo
  }
}
```

Ahora, cada clase tiene una única responsabilidad y solo tiene un motivo para cambiar.

### 2. **Open/Closed Principle (OCP)**
El código debe estar abierto para su extensión, pero cerrado para su modificación. Esto significa que puedes agregar nuevas funcionalidades sin cambiar el código existente.

#### Ejemplo:
Imagina que tienes una clase que calcula el área de figuras geométricas. Si necesitas agregar una nueva figura, tendrías que modificar la clase, lo cual viola OCP.

```typescript
class AreaCalculator {
  calculateArea(shape: any) {
    if (shape instanceof Circle) {
      return Math.PI * shape.radius * shape.radius;
    } else if (shape instanceof Rectangle) {
      return shape.width * shape.height;
    }
  }
}
```

Para cumplir con el principio OCP, puedes utilizar polimorfismo:

```typescript
interface Shape {
  calculateArea(): number;
}

class Circle implements Shape {
  constructor(public radius: number) {}

  calculateArea(): number {
    return Math.PI * this.radius * this.radius;
  }
}

class Rectangle implements Shape {
  constructor(public width: number, public height: number) {}

  calculateArea(): number {
    return this.width * this.height;
  }
}

class AreaCalculator {
  calculateArea(shape: Shape): number {
    return shape.calculateArea();
  }
}
```

Ahora, si quieres agregar una nueva figura geométrica, solo necesitas crear una nueva clase que implemente la interfaz `Shape`.

### 3. **Liskov Substitution Principle (LSP)**
Los objetos de una clase derivada deben poder reemplazar a los objetos de la clase base sin alterar el comportamiento del programa.

#### Ejemplo:
Si tienes una clase base `Bird` y una clase derivada `Penguin`, un pingüino no puede volar, lo que podría violar este principio si se espera que todos los pájaros vuelen.

```typescript
class Bird {
  fly() {
    console.log("Flying");
  }
}

class Penguin extends Bird {
  fly() {
    throw new Error("Penguins can't fly");
  }
}
```

Para cumplir con LSP, puedes cambiar la jerarquía de clases:

```typescript
class Bird {
  layEgg() {
    console.log("Laying an egg");
  }
}

class FlyingBird extends Bird {
  fly() {
    console.log("Flying");
  }
}

class Penguin extends Bird {
  swim() {
    console.log("Swimming");
  }
}
```

Ahora, `Penguin` no hereda el método `fly`, y el principio de sustitución de Liskov se cumple.

### 4. **Interface Segregation Principle (ISP)**
Los clientes no deben estar obligados a depender de interfaces que no usan. En lugar de una interfaz grande, es mejor dividirla en interfaces más pequeñas y específicas.

#### Ejemplo:
Imagina una interfaz grande que obliga a las clases a implementar métodos que no necesitan.

```typescript
interface Worker {
  work(): void;
  eat(): void;
}
```

No todos los trabajadores necesitan implementar ambos métodos. Por ejemplo, los robots no necesitan comer.

```typescript
class HumanWorker implements Worker {
  work() {
    console.log("Working");
  }

  eat() {
    console.log("Eating");
  }
}

class RobotWorker implements Worker {
  work() {
    console.log("Working");
  }

  eat() {
    // No implementa
  }
}
```

Para cumplir con ISP, se deben separar las interfaces.

```typescript
interface Workable {
  work(): void;
}

interface Eatable {
  eat(): void;
}

class HumanWorker implements Workable, Eatable {
  work() {
    console.log("Working");
  }

  eat() {
    console.log("Eating");
  }
}

class RobotWorker implements Workable {
  work() {
    console.log("Working");
  }
}
```

Ahora, `HumanWorker` y `RobotWorker` solo implementan las interfaces que realmente necesitan.

### 5. **Dependency Inversion Principle (DIP)**
Los módulos de alto nivel no deben depender de módulos de bajo nivel. Ambos deben depender de abstracciones. Las abstracciones no deben depender de los detalles; los detalles deben depender de las abstracciones.

#### Ejemplo:
Si una clase de alto nivel depende directamente de una clase de bajo nivel, violamos DIP.

```typescript
class BackendDeveloper {
  develop() {
    console.log("Writing Java code");
  }
}

class Project {
  private developer: BackendDeveloper;

  constructor() {
    this.developer = new BackendDeveloper();
  }

  startDevelopment() {
    this.developer.develop();
  }
}
```

Para cumplir con DIP, podemos depender de una abstracción (una interfaz) en lugar de la implementación concreta.

```typescript
interface Developer {
  develop(): void;
}

class BackendDeveloper implements Developer {
  develop() {
    console.log("Writing Java code");
  }
}

class FrontendDeveloper implements Developer {
  develop() {
    console.log("Writing TypeScript code");
  }
}

class Project {
  private developer: Developer;

  constructor(developer: Developer) {
    this.developer = developer;
  }

  startDevelopment() {
    this.developer.develop();
  }
}
```

De esta forma, `Project` no depende directamente de una implementación concreta, sino de una abstracción (`Developer`).