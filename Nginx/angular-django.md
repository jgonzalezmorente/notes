# NGINX - Angular y Django

### Archivo de configuración:

```nginx
upstream gunicorn-django {
    server unix:/path/to/django/run/gunicorn.sock fail_timeout=0;
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;  # Redirige HTTP a HTTPS
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    # Configuración SSL
    ssl_certificate /path/to/ssl/certificate.pem;
    ssl_certificate_key /path/to/ssl/certificate.key;

    ssl_session_timeout 1d;               # Tiempo durante el cual los parámetros de una sesión SSL pueden reutilizarse
    ssl_session_cache shared:MozSSL:10m;  # 40000 sesiones compartidas en cache SSL
    ssl_session_tickets off;              # Desactiva los tickets de sesión para mayor seguridad

    ssl_protocols TLSv1.2 TLSv1.3;        # Versiones más actuales y seguras de TLS
    ssl_prefer_server_ciphers off;        # Permite al cliente elegir el cifrado preferido

    # Seguridad adicional
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # Logs
    access_log /dev/stdout;
    error_log /dev/stderr;

    # API Django
    location /api/ {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_redirect off;
        proxy_pass http://gunicorn-django;
    }

    # Ficheros estáticos de Django
    location /static/ {
        alias /path/to/django/staticfiles/;
    }

    # Ficheros multimedia de Django
    location /media/ {
        alias /path/to/django/media/;
    }

    # Frontend Angular
    location / {
        root /path/to/angular/dist;
        try_files $uri $uri/ /index.html;
    }

    # Archivos estáticos (Angular)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        root /path/to/angular/dist;
        expires 1y;
        add_header Cache-Control "public";
    }

    # Habilitar compresión
    gzip on;
    gzip_types text/css application/javascript image/svg+xml;
    gzip_min_length 256;
}
```

### Explicación paso por paso:

#### 1. **`upstream` block**
   ```nginx
   upstream gunicorn-django {
       server unix:/path/to/django/run/gunicorn.sock fail_timeout=0;
   }
   ```

   - **`upstream`**: Define un upstream llamado `gunicorn-django`. Este upstream será usado para dirigir el tráfico a la aplicación Django, que está gestionada por **Gunicorn**.
   - **`server unix:/path/to/django/run/gunicorn.sock`**: Especifica el uso de un **socket Unix** para la comunicación con Gunicorn, lo que permite gestionar eficientemente las solicitudes HTTP entre Nginx y Gunicorn.
   - **`fail_timeout=0`**: Indica que Nginx debe intentar conectarse sin tiempo de espera en caso de error.

---

#### 2. **Servidor HTTP que redirige a HTTPS**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       return 301 https://$server_name$request_uri;  # Redirige HTTP a HTTPS
   }
   ```

   - **`listen 80`**: Indica que el servidor escucha en el puerto **80**, que es el puerto predeterminado para HTTP (no cifrado).
   - **`server_name your-domain.com`**: Especifica el nombre de dominio que Nginx debe atender.
   - **`return 301 https://$server_name$request_uri;`**: Redirige todas las solicitudes HTTP a HTTPS. El código **301** indica que la redirección es permanente. La redirección asegura que los usuarios siempre utilicen conexiones seguras (HTTPS).

---

#### 3. **Servidor HTTPS (Seguridad SSL)**
   ```nginx
   server {
       listen 443 ssl;
       server_name your-domain.com;
   ```

   - **`listen 443 ssl`**: Indica que el servidor escucha en el puerto **443**, que es el puerto predeterminado para conexiones **HTTPS** (seguras y cifradas con SSL/TLS).
   - **`server_name your-domain.com`**: Especifica el nombre del dominio que se maneja en este servidor.

---

#### 4. **Configuración de SSL**
   ```nginx
   ssl_certificate /path/to/ssl/certificate.pem;
   ssl_certificate_key /path/to/ssl/certificate.key;

   ssl_session_timeout 1d;
   ssl_session_cache shared:MozSSL:10m;
   ssl_session_tickets off;
   ```

   - **`ssl_certificate`**: Define la ruta al **certificado SSL** público de tu dominio. Este archivo es proporcionado por una autoridad certificadora (CA).
   - **`ssl_certificate_key`**: Especifica la ruta a la **clave privada** asociada con el certificado SSL, utilizada para cifrar y descifrar las conexiones.
   - **`ssl_session_timeout 1d`**: Configura la duración de las sesiones SSL a 1 día. Esto significa que los parámetros de la sesión SSL se pueden reutilizar durante 24 horas.
   - **`ssl_session_cache shared:MozSSL:10m`**: Crea un caché compartido de 10 MB para las sesiones SSL, lo que permite que las sesiones se reutilicen, mejorando el rendimiento.
   - **`ssl_session_tickets off`**: Desactiva los **tickets de sesión SSL**, lo que mejora la seguridad al evitar la reutilización de claves de cifrado.

---

#### 5. **Protocolos y Cifrado SSL**
   ```nginx
   ssl_protocols TLSv1.2 TLSv1.3;
   ssl_prefer_server_ciphers off;
   ```

   - **`ssl_protocols TLSv1.2 TLSv1.3`**: Permite únicamente las versiones **más seguras** de TLS (1.2 y 1.3), asegurando que las conexiones sean seguras y compatibles con los navegadores modernos.
   - **`ssl_prefer_server_ciphers off`**: Permite que el **cliente** (navegador) elija el cifrado preferido, lo que generalmente mejora la compatibilidad.

---

#### 6. **Encabezados de seguridad adicionales**
   ```nginx
   add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
   add_header X-Frame-Options DENY;
   add_header X-Content-Type-Options nosniff;
   add_header X-XSS-Protection "1; mode=block";
   ```

   - **`Strict-Transport-Security`**: Habilita **HSTS**, lo que le dice al navegador que **siempre** use HTTPS para todas las solicitudes futuras a este dominio, evitando el uso de HTTP. El parámetro `max-age=31536000` establece que la política debe aplicarse durante 1 año.
   - **`X-Frame-Options DENY`**: Evita que la página se cargue en un **iframe**, protegiendo contra ataques de **clickjacking**.
   - **`X-Content-Type-Options nosniff`**: Evita que los navegadores adivinen el tipo de contenido, lo que ayuda a prevenir ataques XSS (Cross-Site Scripting).
   - **`X-XSS-Protection "1; mode=block"`**: Activa la protección contra **Cross-Site Scripting (XSS)** en los navegadores compatibles y bloquea la página si se detecta un ataque.

---

#### 7. **Logs**
   ```nginx
   access_log /dev/stdout;
   error_log /dev/stderr;
   ```

   - **`access_log /dev/stdout`**: Envía los registros de **acceso** (todas las solicitudes al servidor) a la salida estándar, lo cual es útil en entornos Docker o cuando los logs se gestionan externamente.
   - **`error_log /dev/stderr`**: Envía los registros de **errores** a la salida de error estándar, lo cual también es útil en entornos controlados por contenedores.

---

#### 8. **Configuración de la API Django**
   ```nginx
   location /api/ {
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header Host $http_host;
       proxy_redirect off;
       proxy_pass http://gunicorn-django;
   }
   ```

   - **`location /api/`**: Todas las solicitudes a la ruta `/api/` se pasan al servidor **Gunicorn**, que ejecuta la aplicación Django.
   - **`proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`**: Añade la cabecera con la

 IP del cliente original.
   - **`proxy_set_header Host $http_host;`**: Envía la cabecera del **Host** original para que Gunicorn sepa cuál fue el dominio solicitado.
   - **`proxy_pass http://gunicorn-django`**: Pasa las solicitudes a la aplicación Django gestionada por **Gunicorn**.

---

#### 9. **Archivos estáticos y multimedia de Django**
   ```nginx
   location /static/ {
       alias /path/to/django/staticfiles/;
   }

   location /media/ {
       alias /path/to/django/media/;
   }
   ```

   - **`location /static/`**: Sirve los archivos estáticos de Django desde la ruta `/path/to/django/staticfiles/`.
   - **`location /media/`**: Sirve los archivos multimedia (subidos por los usuarios) desde la ruta `/path/to/django/media/`.

---

#### 10. **Configuración del frontend Angular**
   ```nginx
   location / {
       root /path/to/angular/dist;
       try_files $uri $uri/ /index.html;
   }
   ```

   - **`location /`**: Todas las solicitudes que no coincidan con rutas previas serán manejadas por el frontend de Angular.
   - **`try_files $uri $uri/ /index.html`**: Intenta servir el archivo solicitado. Si no lo encuentra, muestra el archivo `index.html`, necesario para aplicaciones SPA como Angular, donde el enrutamiento se gestiona en el lado del cliente.

---

#### 11. **Archivos estáticos de Angular**
   ```nginx
   location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
       root /path/to/angular/dist;
       expires 1y;
       add_header Cache-Control "public";
   }
   ```

   - **`location ~*`**: Maneja archivos estáticos como JavaScript, CSS, imágenes y fuentes usando una expresión regular. Esto permite que los archivos estáticos sean servidos de manera eficiente.
   - **`expires 1y`**: Permite que estos archivos sean cacheados durante **1 año**, lo que mejora el rendimiento al reducir solicitudes al servidor.
   - **`add_header Cache-Control "public";`**: Añade una cabecera que permite que los proxies intermedios y navegadores cacheen los archivos.

---

#### 12. **Compresión GZIP**
   ```nginx
   gzip on;
   gzip_types text/css application/javascript image/svg+xml;
   gzip_min_length 256;
   ```

   - **`gzip on;`**: Activa la compresión GZIP para reducir el tamaño de los archivos enviados al cliente, lo que acelera las descargas.
   - **`gzip_types`**: Especifica qué tipos de archivos serán comprimidos, como CSS, JavaScript y SVG.
   - **`gzip_min_length`**: Solo comprime archivos que tengan un tamaño superior a **256 bytes**, evitando la compresión de archivos muy pequeños.

---

### Resumen:

Este archivo de configuración de **Nginx** está configurado para manejar tanto una API de **Django** como un frontend de **Angular** de manera eficiente, con mecanismos de seguridad adicionales como **HSTS**, protección contra **Clickjacking** y **XSS**, y el uso de compresión **GZIP** para mejorar el rendimiento.

Los placeholders permiten personalizar este archivo para cualquier entorno, simplemente reemplazando las rutas y nombres de dominio específicos de tu sistema.

Si necesitas más detalles o ajustes en la documentación, ¡déjame saber!