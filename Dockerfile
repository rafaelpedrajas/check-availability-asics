FROM node:23-slim

# Establecer directorio de trabajo
WORKDIR /app

# Copiar solo package.json y lock para instalar antes
COPY package*.json ./

# Instalar dependencias del sistema para sqlite3 y Playwright
RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  sqlite3 \
  libsqlite3-dev \
  wget \
  curl \
  gnupg \
  ca-certificates \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libdrm2 \
  libgbm1 \
  libnspr4 \
  libnss3 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  cron

# Instalar dependencias y compilar sqlite3 dentro del contenedor
RUN npm install --build-from-source sqlite3

# Instalar navegadores para Playwright
RUN npx playwright install --with-deps

# Copiar el resto del código
COPY . .

# Configurar cronjob para ejecutar el bot cada 5 minutos
COPY cronjob /etc/cron.d/botcron
RUN chmod 0644 /etc/cron.d/botcron

# Mantener cron corriendo en primer plano
CMD ["cron", "-f"]
