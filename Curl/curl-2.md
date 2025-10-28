
# **cURL Command Line Guide**

`curl` is a command-line tool used to transfer data to or from a server using various protocols (HTTP, HTTPS, FTP, etc.). It is commonly used for testing APIs or downloading/uploading files.

---

## **Basic Syntax**

```bash
curl [options] [URL]
```

---

## **Common Use Cases**

### 1. **GET Request**
```bash
curl https://api.example.com/data
```

### 2. **GET with Headers**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.example.com/data
```

### 3. **POST Request with JSON Data**
```bash
curl -X POST -H "Content-Type: application/json" \
     -d '{"key":"value"}' \
     https://api.example.com/data
```

### 4. **PUT Request**
```bash
curl -X PUT -H "Content-Type: application/json" \
     -d '{"key":"newValue"}' \
     https://api.example.com/data/1
```

### 5. **DELETE Request**
```bash
curl -X DELETE https://api.example.com/data/1
```

---

## **Useful Options**

| Option        | Description                             |
|---------------|-----------------------------------------|
| `-X`          | Specifies the request method (GET, POST, etc.) |
| `-H`          | Adds a header to the request            |
| `-d`          | Sends the specified data in a POST/PUT  |
| `-i`          | Includes the HTTP response headers      |
| `-s`          | Silent mode (no progress bar or errors) |
| `-o file.txt` | Saves the output to a file              |
| `-L`          | Follows redirects                       |
| `-u`          | Sends basic auth credentials (user:pass) |

---

## **Examples**

### Save the response to a file:
```bash
curl -o response.json https://api.example.com/data
```

### Follow redirects:
```bash
curl -L https://bit.ly/some-short-url
```

### Send a file (multipart/form-data):
```bash
curl -F "file=@path/to/file.txt" https://api.example.com/upload
```

### Use basic authentication:
```bash
curl -u username:password https://api.example.com/secure-data
```