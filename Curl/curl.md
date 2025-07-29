# Guía completa de uso de `curl`

`curl` es una herramienta de línea de comandos para transferencias de datos con URL. Soporta HTTP, HTTPS, FTP, SFTP, SCP, FILE, entre otros.

---

## Instalación

### Linux (Debian/Ubuntu)
```bash
sudo apt install curl
````

### macOS

```bash
brew install curl
```

### Windows

Disponible por defecto desde Windows 10. También puede instalarse con [Chocolatey](https://chocolatey.org/):

```bash
choco install curl
```

---

## Sintaxis básica

```bash
curl [opciones] [URL]
```

---

## Peticiones HTTP

### GET (por defecto)

```bash
curl https://ejemplo.com
```

### POST con `application/x-www-form-urlencoded`

```bash
curl -X POST -d "usuario=antonio&clave=1234" https://ejemplo.com/login
```

### POST con JSON

```bash
curl -X POST -H "Content-Type: application/json" \
     -d '{"usuario": "antonio", "clave": "1234"}' \
     https://ejemplo.com/api/login
```

### PUT

```bash
curl -X PUT -d "nombre=Antonio" https://ejemplo.com/usuarios/1
```

### DELETE

```bash
curl -X DELETE https://ejemplo.com/usuarios/1
```

---

## Descarga de archivos

Guardar con el mismo nombre:

```bash
curl -O https://ejemplo.com/archivo.pdf
```

Guardar con nombre personalizado:

```bash
curl -o nuevo_nombre.pdf https://ejemplo.com/archivo.pdf
```

---

## Autenticación

### Básica (HTTP Basic)

```bash
curl -u usuario:contraseña https://ejemplo.com/privado
```

### Bearer Token

```bash
curl -H "Authorization: Bearer TU_TOKEN" https://ejemplo.com/api
```

---

## Cabeceras personalizadas

```bash
curl -H "X-Custom-Header: valor" https://ejemplo.com
```

Varias cabeceras:

```bash
curl -H "Accept: application/json" -H "X-Token: abc123" https://ejemplo.com
```

---

## Envío de archivos

```bash
curl -F "file=@documento.txt" https://ejemplo.com/upload
```

Con otros campos:

```bash
curl -F "nombre=antonio" -F "cv=@cv.pdf" https://ejemplo.com/registro
```

---

## Redirecciones

Seguir redirecciones:

```bash
curl -L https://ejemplo.com
```

---

## Encabezados de respuesta

Ver respuesta completa:

```bash
curl -i https://ejemplo.com
```

Solo encabezados:

```bash
curl -I https://ejemplo.com
```

---

## Verbosidad y debug

Verbose (ver detalles de la petición):

```bash
curl -v https://ejemplo.com
```

Silencioso (sin barra de progreso):

```bash
curl -s https://ejemplo.com
```

Silencioso pero muestra errores:

```bash
curl -sS https://ejemplo.com
```

---

## Cookies

Enviar cookies:

```bash
curl -b "usuario=antonio; session=xyz" https://ejemplo.com
```

Guardar cookies:

```bash
curl -c cookies.txt https://ejemplo.com
```

Usar cookies guardadas:

```bash
curl -b cookies.txt https://ejemplo.com
```

---

## Reintentos

```bash
curl --retry 5 https://ejemplo.com
```

---

## Tiempo de espera

```bash
curl --max-time 10 https://ejemplo.com
```

---

## Guardar salida

```bash
curl https://ejemplo.com > salida.html
```

---

## Subida de archivos con PUT

```bash
curl -T archivo.txt https://ejemplo.com/destino.txt
```

---

## Mostrar solo código de estado HTTP

```bash
curl -o /dev/null -s -w "%{http_code}\n" https://ejemplo.com
```

---

## Certificados SSL cliente

```bash
curl --cert cliente.pem --key clave.pem https://ejemplo.com
```

Usando certificado `.p12`:

```bash
curl --cert archivo.p12:mipass --cert-type P12 https://ejemplo.com
```

---

## Sugerencia extra: usar `jq` para formatear JSON

```bash
curl -s https://api.ejemplo.com | jq .
```

---

## Recursos útiles

* Documentación oficial: [https://curl.se/docs/](https://curl.se/docs/)
* Manual rápido: `man curl` o `curl --help`
