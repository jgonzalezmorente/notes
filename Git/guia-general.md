# Guía Completa de Git

**Índice**

1. [Introducción a Git](#1-introducción-a-git)
2. [Instalación y Configuración Inicial](#2-instalación-y-configuración-inicial)
3. [Conceptos Básicos](#3-conceptos-básicos)
4. [Comandos Esenciales de Git](#4-comandos-esenciales-de-git)
5. [Trabajando con Ramas](#5-trabajando-con-ramas)
6. [Repositorios Remotos](#6-repositorios-remotos)
7. [Colaboración y Flujos de Trabajo](#7-colaboración-y-flujos-de-trabajo)
8. [Resolución de Conflictos](#8-resolución-de-conflictos)
9. [Comandos Avanzados](#9-comandos-avanzados)
   - [Rebase](#91-rebase)
   - [Stash](#92-stash)
   - [Cherry-pick](#93-cherry-pick)
   - [Etiquetas (Tags)](#94-etiquetas-tags)
10. [Alias en Git](#10-alias-en-git)
11. [Buenas Prácticas](#10-buenas-prácticas)
12. [Recursos Adicionales](#11-recursos-adicionales)
13. [Conclusión](#12-conclusión)

---

## 1. Introducción a Git

**Git** es un sistema de control de versiones distribuido, diseñado para manejar todo tipo de proyectos con velocidad y eficiencia. Permite a múltiples desarrolladores trabajar juntos de manera simultánea, llevando un registro detallado de todos los cambios realizados en el código fuente a lo largo del tiempo.

**Características clave de Git:**

- **Distribuido**: Cada copia de un repositorio Git es un repositorio completo con historial completo.
- **Velocidad**: Git es rápido en operaciones comunes como commit, branch, merge y log.
- **Integridad**: Cada archivo y commit es chequeado mediante un código hash (SHA-1), lo que garantiza la integridad de los datos.

---

## 2. Instalación y Configuración Inicial

### Instalación

**En Windows:**

1. Descarga el instalador desde [git-scm.com](https://git-scm.com/download/win).
2. Ejecuta el instalador y sigue las instrucciones.

**En macOS:**

- Usa Homebrew:
  ```bash
  brew install git
  ```

**En Linux (Debian/Ubuntu):**

```bash
sudo apt-get update
sudo apt-get install git
```

### Configuración Inicial

Después de instalar Git, configura tu nombre de usuario y correo electrónico:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tuemail@example.com"
```

Verifica tu configuración:

```bash
git config --list
```

---

## 3. Conceptos Básicos

- **Repositorio**: Es el directorio que Git utiliza para almacenar el historial de cambios.
- **Commit**: Una instantánea del estado actual de tu proyecto.
- **Branch (Rama)**: Una línea independiente de desarrollo.
- **Clone**: Copiar un repositorio remoto a tu máquina local.
- **Pull**: Actualizar tu repositorio local con cambios desde el remoto.
- **Push**: Enviar tus cambios locales al repositorio remoto.
- **Merge**: Combinar ramas diferentes en una sola.

---

## 4. Comandos Esenciales de Git

### Inicializar un Repositorio

```bash
git init
```

### Clonar un Repositorio Existente

```bash
git clone https://github.com/usuario/repositorio.git
```

### Ver el Estado del Repositorio

```bash
git status
```

### Añadir Cambios al Área de Preparación (Staging Area)

Agregar un archivo específico:

```bash
git add archivo.txt
```

Agregar todos los cambios:

```bash
git add .
```

### Realizar un Commit

```bash
git commit -m "Mensaje descriptivo del cambio"
```

### Ver el Historial de Commits

```bash
git log
```

### Deshacer Cambios

Deshacer cambios no confirmados en un archivo:

```bash
git checkout -- archivo.txt
```

---

## 5. Trabajando con Ramas

### Crear una Nueva Rama

```bash
git branch nombre_de_la_rama
```

### Listar Ramas

```bash
git branch
```

### Cambiar de Rama

```bash
git checkout nombre_de_la_rama
```

También puedes crear y cambiar a una nueva rama simultáneamente:

```bash
git checkout -b nombre_de_la_rama
```

### Fusionar Ramas (Merge)

Estando en la rama donde quieres aplicar los cambios (por ejemplo, `main`):

```bash
git checkout main
git merge nombre_de_la_rama
```

---

## 6. Repositorios Remotos

### Añadir un Repositorio Remoto

```bash
git remote add origin https://github.com/usuario/repositorio.git
```

### Ver Repositorios Remotos

```bash
git remote -v
```

### Enviar Cambios al Remoto

```bash
git push -u origin nombre_de_la_rama
```

La primera vez que haces push de una rama, utiliza `-u` para establecer el seguimiento.

### Obtener Cambios del Remoto

Actualizar la rama actual con cambios del remoto:

```bash
git pull
```

Obtener datos del remoto sin fusionar:

```bash
git fetch
```

---

## 7. Colaboración y Flujos de Trabajo

### Clonar un Repositorio para Colaborar

```bash
git clone https://github.com/usuario/repositorio.git
```

### Hacer Cambios y Enviar Pull Requests

1. Crea una rama para tu cambio:

   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

2. Haz tus cambios y commits.

3. Empuja tu rama al remoto:

   ```bash
   git push -u origin feature/nueva-funcionalidad
   ```

4. Abre un Pull Request en GitHub para que tus cambios sean revisados y fusionados.

---

## 8. Resolución de Conflictos

Cuando Git no puede fusionar automáticamente los cambios, se producen conflictos.

### Pasos para Resolver Conflictos:

1. Git indicará qué archivos tienen conflictos después de un `merge` o `pull`.
2. Abre los archivos en conflicto y busca las marcas de conflicto:

   ```plaintext
   <<<<<<< HEAD
   Tu versión del código
   =======
   Versión del código en la otra rama
   >>>>>>> rama/remoto
   ```

3. Edita el archivo para resolver el conflicto, eligiendo qué cambios conservar.
4. Una vez resuelto, añade el archivo al área de preparación:

   ```bash
   git add archivo_en_conflicto.txt
   ```

5. Continúa con el merge o commit:

   ```bash
   git commit -m "Resueltos conflictos de fusión"
   ```

---

## 9. Comandos Avanzados

### 9.1. Rebase

El `rebase` reescribe el historial de commits. Es útil para mantener un historial lineal.

Rebasar tu rama sobre `main`:

```bash
git checkout feature/rama
git rebase main
```

**Nota:** Usa `rebase` con precaución, especialmente en ramas compartidas.

### 9.2. Stash

Guarda temporalmente tus cambios sin hacer commit.

Guardar cambios:

```bash
git stash
```

Listar stashes:

```bash
git stash list
```

Recuperar el último stash:

```bash
git stash apply
```

### 9.3. Cherry-pick

Aplica un commit específico a la rama actual.

```bash
git cherry-pick <commit-hash>
```

### 9.4. Etiquetas (Tags)

Crear una etiqueta anotada:

```bash
git tag -a v1.0 -m "Versión 1.0"
```

Listar etiquetas:

```bash
git tag
```

Empujar etiquetas al remoto:

```bash
git push origin --tags
```

---

## 10. Alias en Git

Los alias en Git permiten simplificar comandos largos o repetitivos, haciéndolos más fáciles de recordar y usar. Puedes configurarlos en el archivo de configuración global para que estén disponibles en todos tus proyectos, o solo en un repositorio específico.

### Crear Alias en Git

1. **Configuración en el Archivo Global:**

   Abre el archivo de configuración global de Git con el siguiente comando:
   ```bash
   git config --global -e
   ```

   Dentro de este archivo, añade tus alias en la sección `[alias]`. Aquí tienes algunos ejemplos comunes:

   ```ini
   [alias]
       st = status
       co = checkout
       ci = commit
       br = branch
       lg = log --oneline --graph --all
       last = log -1 HEAD
   ```

2. **Comando Directo para Crear Alias:**

   También puedes agregar alias sin editar el archivo directamente, usando `git config` desde la terminal:

   ```bash
   git config --global alias.st status
   git config --global alias.co checkout
   git config --global alias.ci commit
   git config --global alias.br branch
   git config --global alias.lg "log --graph --abbrev-commit --decorate --format=format:'%C(bold blue)%h%C(reset) - %C(bold green)(%ar)%C(reset) %C(white)%s%C(reset) %C(dim white)- %an%C(reset)%C(bold yellow)%d%C(reset)' --all"
   ```

### Usar Alias en Git

Una vez creados los alias, puedes utilizarlos como si fueran comandos normales. Por ejemplo, en lugar de escribir `git status`, puedes usar el alias:

```bash
git st
```

### Ejemplo de Configuración Completa

A continuación, se muestra un ejemplo de configuración para alias personalizados en Git:

```ini
[user]
    name = jgonzalezmorente
    email = jgonzalezmorente@gmail.com
[init]
    defaultBranch = main
[alias]
    s = status --short
    lg = log --graph --abbrev-commit --decorate --format=format:'%C(bold blue)%h%C(reset) - %C(bold green)(%ar)%C(reset) %C(white)%s%C(reset) %C(dim white)- %an%C(reset)%C(bold yellow)%d%C(reset)' --all
```

Esta configuración define el alias `s` para un estado resumido (`status --short`) y el alias `lg` para un log formateado con color y gráficos para mejorar la visualización del historial.

---

## 11. Buenas Prácticas

- **Commits Atómicos**: Realiza commits que representen cambios pequeños y significativos.
- **Mensajes Claros**: Usa mensajes descriptivos en tus commits.
- **No Subir Archivos Sensibles**: Excluye archivos como claves, contraseñas o configuraciones locales usando `.gitignore`.
- **Ramas para Funcionalidades**: Utiliza ramas para desarrollar nuevas funcionalidades o corregir bugs.
- **Revisiones de Código**: Realiza revisiones mediante Pull Requests antes de fusionar cambios.

---

## 12. Recursos Adicionales

- **Documentación Oficial de Git**: [git-scm.com/docs](https://git-scm.com/docs)
- **Pro Git Book** (libro gratuito): [git-scm.com/book/es/v2](https://git-scm.com/book/es/v2)
- **Tutoriales Interactivos**:
  - [Try Git](https://try.github.io)
  - [Learn Git Branching](https://learngitbranching.js.org/?locale=es_ES)
- **Git Cheatsheet**: [github.github.com/training-kit/es/pdf/git-cheat-sheet.pdf](https://github.github.com/training-kit/es/pdf/git-cheat-sheet.pdf)

---

## 13. Conclusión

Git es una herramienta poderosa y esencial para el desarrollo de software moderno. Dominar sus comandos y entender sus conceptos te permitirá colaborar eficientemente y mantener un historial sólido de tus proyectos. Practica regularmente y consulta la documentación para profundizar en funcionalidades más avanzadas.
