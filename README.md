# 🏃‍♂️ Asics Availability Bot

Este proyecto es un **bot automático** que rastrea la tienda online de [Asics Outlet España](https://outlet.asics.com) en busca de zapatillas disponibles en la **talla 50.5**, filtrando por un modelo específico (por defecto: `nimbus`). Si encuentra una coincidencia, envía una **notificación con imagen y precio por Telegram**.

> 🔁 Se ejecuta automáticamente cada 5 minutos gracias a un cronjob dentro de Docker.

---

## 📦 ¿Qué hace exactamente?

- Accede a la web de Asics con `Playwright` (modo stealth).
- Detecta productos disponibles en la talla deseada.
- Filtra por un modelo específico.
- Guarda si ya ha sido notificado ese producto hoy en una base de datos SQLite local.
- Notifica vía Telegram (foto, título y precio).
- Si ocurre un error durante el scraping, **también lo notifica por Telegram**.

---

## 🚀 Requisitos

- Docker y Docker Compose instalados.
- Un bot de Telegram configurado.
- Un grupo o canal donde se desea recibir las notificaciones.

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

> ✅ El `CHAT_ID` puede ser negativo si es un grupo o canal.

---

## 🐳 Despliegue con Docker

1. Clona este repositorio:

```bash
git clone https://github.com/rafaelpedrajas/check-availability-asics.git
cd check-availability-asics
```

2. Crea tu `.env` como se indica arriba.

3. Lanza el contenedor en modo desarrollo:

```bash
docker compose up -d
```

> Esto mantendrá el bot en ejecución continua y ejecutará `bot.mjs` cada 5 minutos vía cron.

---

## 🧪 Desarrollo (hot reload)

Este proyecto está preparado para desarrollo en vivo:

- Se monta el código local dentro del contenedor (`./:/app`).
- No es necesario hacer `docker build` tras cada cambio.
- Puedes entrar al contenedor y ejecutar el bot manualmente:

```bash
docker exec -it asics-availability sh
node bot.mjs
```

---

## 🗃 Estructura del proyecto

```
.
├── db/                  # Base de datos SQLite local
├── utils/               # Lógica: scraping, Telegram, base de datos
├── bot.mjs              # Script principal
├── Dockerfile
├── docker-compose.yml
├── cronjob              # Tarea de cron (cada 5 min)
├── .env.example         # Variables de entorno a copiar
├── .dockerignore        # Ignora archivos innecesarios para Docker
├── .gitignore           # Ignora archivos locales o sensibles para GitHub
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

**Versión 1.0 (Estable)**  
✔️ Funcionalidad completa: detección, notificación y persistencia.  
🛠 En desarrollo: versión 2.0 para múltiples tallas y modelos.

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