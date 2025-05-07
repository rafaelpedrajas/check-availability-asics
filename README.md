# 🏃‍♂️ Asics Availability Bot

Este proyecto es un **bot automático** que rastrea la tienda online de [Asics Outlet España](https://outlet.asics.com) en busca de zapatillas disponibles en **múltiples tallas y modelos personalizados**, y envía una **notificación con imagen, precio y enlace por Telegram**.

> 🔁 Se ejecuta automáticamente cada 5 minutos gracias a un cronjob dentro de Docker.

---

## 📦 ¿Qué hace exactamente?

- Accede a la web de Asics con `Playwright` en modo stealth.
- Rechaza automáticamente el banner de cookies.
- Detecta productos disponibles en la talla deseada usando una URL sin paginación (`sz=100`).
- Filtra productos por modelo y talla según configuración.
- Guarda si ya se notificó ese modelo/talla ese día para evitar repeticiones.
- Notifica vía Telegram (foto, nombre, precio y botón con enlace).
- Si ocurre un error durante el scraping, **también lo notifica por Telegram**.
- Permite gestionar los modelos y tallas directamente desde Telegram.

---

## ✨ Novedades en la Versión 2

- ✅ Soporte para múltiples modelos y tallas, desde base de datos SQLite.
- ✅ Comandos de Telegram para añadir, listar o eliminar tallas/modelos.
- ✅ Sistema de comandos `/add`, `/list`, `/delete`, `/help`.
- ✅ Scraping optimizado sin necesidad de hacer clic en "ver más".
- ✅ Protección del bot: solo responde si el mensaje viene del grupo autorizado.
- ✅ Registro automático de comandos en el bot al iniciar.

---

## 🚀 Requisitos

- Docker y Docker Compose instalados.
- Un bot de Telegram configurado.
- Un grupo o canal donde se desea recibir las notificaciones (y su `chat_id`).
- Node.js solo si deseas probar en local fuera de Docker.

---

## ⚙️ Configuración

1. Duplica el archivo `.env.example` que viene en el repositorio:

```bash
cp .env.example .env
```

2. Rellena las variables con tu token de bot y chat ID:

```env
TELEGRAM_TOKEN=123456789:ABCDefghijklmn...
TELEGRAM_CHAT_ID=-10028239567890
```

> ✅ El `CHAT_ID` puede ser negativo si es un grupo. Solo se aceptan comandos y se notificará a ese chat.

---

## 🐳 Despliegue con Docker

1. Clona este repositorio:

```bash
git clone https://github.com/rafaelpedrajas/check-availability-asics.git
cd check-availability-asics
```

2. Crea tu `.env` como se indica arriba.

3. Lanza el contenedor:

```bash
docker compose up --build -d
```

Esto mantendrá el bot en ejecución continua, ejecutando `bot.mjs` cada 5 minutos vía cron y dejando el bot de Telegram escuchando comandos.

---

## 💬 Comandos disponibles en Telegram

| Comando       | Descripción |
|---------------|-------------|
| `/add`        | Añadir modelo y talla. Ej: `/add nimbus 50.5` |
| `/list`       | Ver todos los modelos/tallas registrados |
| `/delete`     | Eliminar un modelo/talla. Ej: `/delete nimbus 50.5` |
| `/help`       | Mostrar la ayuda de uso del bot |

> 🛡️ Solo se aceptan comandos si el `chat_id` coincide con el configurado en `.env`.

---

## 🧪 Desarrollo (hot reload)

Este proyecto está preparado para desarrollo en vivo:

- Se monta el código local dentro del contenedor (`./:/app`).
- No es necesario hacer `docker build` tras cada cambio en el código fuente.
- Puedes entrar al contenedor y ejecutar el bot manualmente:

```bash
docker exec -it asics-availability sh
node bot.mjs
```

También puedes ejecutar el bot de Telegram en local con:

```bash
npm run telegram
```

---

## 🗃 Estructura del proyecto

```
.
├── db/                        # Base de datos SQLite
│   └── state.sqlite
├── utils/                     # Lógica del bot
│   ├── db.mjs                 # Operaciones en la BD
│   ├── notifier.mjs           # Envío a Telegram
│   ├── scraper.mjs            # Scraping con Playwright
│   ├── commands.mjs           # Lógica de comandos
│   └── stealth.mjs            # Configuración stealth del navegador
├── bot.mjs                    # Script principal para comprobar stock
├── telegram-bot.mjs           # Escucha comandos de Telegram
├── register-commands.mjs      # Registra comandos oficiales en el bot
├── Dockerfile
├── docker-compose.yml
├── cronjob                    # Tarea programada cada 5 min
├── .env.example               # Plantilla de entorno
├── .dockerignore
├── .gitignore
```

---

## ✅ Tecnología usada

- [Node.js 23](https://nodejs.org/)
- [Playwright](https://playwright.dev/)
- [SQLite](https://www.sqlite.org/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- Docker + cron

---

## 📌 Estado del proyecto

**Versión 2.0 (Estable)**  
✔️ Soporte completo para múltiples modelos y tallas.  
⚙️ Preparado para despliegue en Portainer o Docker en cualquier entorno.  
🧪 En evaluación: futura versión 3 para notificaciones más avanzadas y múltiples usuarios.

---

## 🤝 Contribuciones

Este proyecto es de código abierto. Si quieres colaborar:

1. Haz un fork.
2. Crea una rama con tus mejoras: `git checkout -b mejora-nueva`
3. Haz tus cambios y `commit`.
4. Abre un Pull Request.

---

## 🛡 Licencia

MIT — libre para uso y modificación. Dale una estrella ⭐ si te ha sido útil.

---

## 🧠 Autor

Creado por [@rafaelpedrajas](https://github.com/rafaelpedrajas) para facilitar la compra de zapatillas difíciles de encontrar 😊
