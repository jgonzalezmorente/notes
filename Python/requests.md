# Guía Completa de `requests` en Python

## Instalación

```bash
pip install requests
```

## Importación

```python
import requests
```

## Métodos HTTP básicos

### GET

```python
response = requests.get("https://api.example.com/data")
```

### POST

```python
response = requests.post("https://api.example.com/data", data={'key': 'value'})
```

### PUT

```python
response = requests.put("https://api.example.com/data/1", data={'key': 'new_value'})
```

### DELETE

```python
response = requests.delete("https://api.example.com/data/1")
```

## Parámetros en la URL (query params)

```python
params = {'search': 'python', 'limit': 10}
response = requests.get("https://api.example.com/search", params=params)
```

## Cabeceras personalizadas

```python
headers = {'Authorization': 'Bearer <token>', 'User-Agent': 'my-app/0.1'}
response = requests.get("https://api.example.com/protected", headers=headers)
```

## Enviar datos JSON

```python
json_data = {'name': 'Antonio', 'age': 40}
response = requests.post("https://api.example.com/users", json=json_data)
```

## Enviar formularios (form-urlencoded)

```python
form_data = {'username': 'antonio', 'password': '1234'}
response = requests.post("https://api.example.com/login", data=form_data)
```

## Subida de ficheros

```python
files = {'file': open('document.pdf', 'rb')}
response = requests.post("https://api.example.com/upload", files=files)
```

## Tiempo de espera (timeout)

```python
response = requests.get("https://api.example.com", timeout=5)
```

## Comprobar el código de estado

```python
if response.status_code == 200:
    print("OK")
elif response.status_code == 404:
    print("No encontrado")
```

## Leer el contenido de la respuesta

```python
text = response.text
binary = response.content
json_data = response.json()
```

## Manejo de errores

```python
try:
    response = requests.get("https://api.example.com", timeout=5)
    response.raise_for_status()
except requests.exceptions.HTTPError as errh:
    print("Error HTTP:", errh)
except requests.exceptions.ConnectionError as errc:
    print("Error de conexión:", errc)
except requests.exceptions.Timeout as errt:
    print("Timeout:", errt)
except requests.exceptions.RequestException as err:
    print("Error inesperado:", err)
```

## Sesiones

```python
session = requests.Session()
session.headers.update({'Authorization': 'Bearer <token>'})

response = session.get("https://api.example.com/me")
response = session.post("https://api.example.com/post", json={'key': 'value'})
```

## Redirecciones automáticas

```python
response = requests.get("http://example.com", allow_redirects=False)
```

## Autenticación HTTP Básica

```python
from requests.auth import HTTPBasicAuth

response = requests.get("https://api.example.com", auth=HTTPBasicAuth('user', 'pass'))
# o más corto:
response = requests.get("https://api.example.com", auth=('user', 'pass'))
```

## Cookies

### Leer cookies:

```python
for name, value in response.cookies.items():
    print(name, value)
```

### Enviar cookies:

```python
cookies = {'session_id': 'abcd1234'}
response = requests.get("https://api.example.com/dashboard", cookies=cookies)
```

## Proxies

Un proxy es un servidor intermediario que enruta las peticiones HTTP.

```python
proxies = {
    "http": "http://10.10.1.10:3128",
    "https": "http://10.10.1.10:1080",
}
response = requests.get("https://api.example.com", proxies=proxies)
```

Con autenticación:

```python
proxies = {
    "https": "http://usuario:clave@proxy.empresa.com:8080"
}
```

## Verificar certificados SSL

```python
response = requests.get("https://secure.example.com", verify=True)
# Para desactivarlo (no recomendado):
response = requests.get("https://secure.example.com", verify=False)
```

## Stream de respuesta

```python
with requests.get("https://example.com/largefile.zip", stream=True) as r:
    with open("output.zip", "wb") as f:
        for chunk in r.iter_content(chunk_size=8192):
            f.write(chunk)
```

## Hook de respuesta

```python
def print_url(r, *args, **kwargs):
    print("Request to:", r.url)

response = requests.get("https://example.com", hooks={'response': print_url})
```
