# SSH and SCP Guide

## 1. Introduction to SSH

SSH (*Secure Shell*) is a protocol that allows secure remote connections to a server over an insecure network.

The basic command to connect to a server is:

```bash
ssh user@server
```

If the server uses a port other than the default (22), specify the port:

```bash
ssh user@server -p 2222
```

To exit an SSH session, use:

```bash
exit
```

---

## 2. Generating a Key Pair for Passwordless Authentication

SSH key-based authentication allows connections without entering passwords. This is achieved through a pair of keys: a **public key** and a **private key**.

### 2.1 Generating the Key Pair

Run the following command on your local machine:

```bash
ssh-keygen -t rsa -b 4096 -C "comment"
```

- `-t rsa` specifies the key type (RSA in this case).
- `-b 4096` defines the key size in bits.
- `-C "comment"` is optional and is used to identify the key (it can be an email or a description).

This command generates two files in `~/.ssh/`:

- `id_rsa` (private key, **do not share or expose**).
- `id_rsa.pub` (public key, copied to the server).

### 2.2 Copying the Public Key to the Server

To authorize passwordless connections, the public key must be added to the `~/.ssh/authorized_keys` file on the server.

#### Using `ssh-copy-id` (Easy Method)

```bash
ssh-copy-id user@server
```

If the port is not 22:

```bash
ssh-copy-id -p 2222 user@server
```

#### Manually (If `ssh-copy-id` is Unavailable)

Manually copy the public key to the server:

```bash
cat ~/.ssh/id_rsa.pub | ssh user@server "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

Verify the permissions on the server:

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

Now you can connect without a password:

```bash
ssh user@server
```

---

## 3. File Transfer with SCP

SCP (*Secure Copy Protocol*) allows copying files between your machine and a remote server.

### 3.1 Copying a File to the Server

```bash
scp file.txt user@server:/destination/path/
```

If the server uses a different port:

```bash
scp -P 2222 file.txt user@server:/destination/path/
```

### 3.2 Copying a File from the Server to Your Local Machine

```bash
scp user@server:/remote/path/file.txt ./
```

### 3.3 Copying an Entire Directory

To copy a directory recursively, use `-r`:

```bash
scp -r directory user@server:/destination/path/
```

To download a directory:

```bash
scp -r user@server:/remote/path/directory ./
```

---

## 4. How SSH Key Authentication Works Internally

SSH public and private key authentication is based on asymmetric cryptography.

1. **Generating the Key Pair**
   - The private key (`id_rsa`) remains secure on the local machine.
   - The public key (`id_rsa.pub`) is stored on the server inside `~/.ssh/authorized_keys`.

2. **Connection Process**
   - When a client attempts to connect, the server checks `~/.ssh/authorized_keys` for a matching key.
   - The server sends an encrypted challenge using the public key.
   - The client responds with a code signed with its private key.
   - If the server can verify the signature using the public key, access is granted.

This process ensures that only those with the private key can authenticate.

---

## 5. Advanced Configuration

### 5.1 Configuration File for Quick Access

To simplify the connection, you can configure an alias in `~/.ssh/config`:

```ini
Host my-server
    HostName server.com
    User user
    Port 2222
    IdentityFile ~/.ssh/id_rsa
```

Then, instead of typing the full connection command, you can simply use:

```bash
ssh my-server
```

### 5.2 Disabling Passwords and Allowing Only Keys on the Server

Edit `/etc/ssh/sshd_config` on the server and change:

```ini
PasswordAuthentication no
PubkeyAuthentication yes
```

Then restart the SSH service:

```bash
sudo systemctl restart ssh
```

---

## 6. Troubleshooting

If you cannot connect without a password, check:

- **Correct permissions** on the server:
  ```bash
  chmod 700 ~/.ssh
  chmod 600 ~/.ssh/authorized_keys
  ```
- **That the public key is in `~/.ssh/authorized_keys`** on the server.
- **That the SSH service allows key authentication** in `/etc/ssh/sshd_config`.
- **Enable verbose mode** to debug errors:
  ```bash
  ssh -v user@server
  ```

If you still have issues, check the server logs:

```bash
sudo journalctl -u ssh -n 50 --no-pager
```

---

## 7. Conclusion

SSH and SCP are essential tools for remote server administration. Using SSH keys enhances security and automates connections without requiring passwords.

If you properly configure these mechanisms, you can securely and efficiently connect to your servers.

