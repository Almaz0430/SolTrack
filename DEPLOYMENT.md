# Руководство по развертыванию

Инструкции по развертыванию Solana Music NFT Platform в продакшн среде.

## 🚀 Варианты развертывания

### 1. Docker (Рекомендуется)

#### Создание Docker образов

```bash
# Backend
cd apps/api
docker build -t solana-music-api .

# Frontend
cd apps/web
docker build -t solana-music-web .
```

#### Docker Compose

Создайте `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: solana_music
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  api:
    image: solana-music-api
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/solana_music
      PORT: 3001
      NODE_ENV: production
      SOLANA_RPC_URL: ${SOLANA_RPC_URL}
    ports:
      - "3001:3001"
    depends_on:
      - postgres

  web:
    image: solana-music-web
    environment:
      NEXT_PUBLIC_API_URL: ${API_URL}
      NEXT_PUBLIC_SOLANA_RPC: ${SOLANA_RPC_URL}
    ports:
      - "3000:3000"
    depends_on:
      - api

volumes:
  postgres_data:
```

#### Запуск

```bash
# Создайте .env файл с переменными окружения
echo "DB_USER=solana_user" > .env
echo "DB_PASSWORD=secure_password" >> .env
echo "SOLANA_RPC_URL=https://api.mainnet-beta.solana.com" >> .env
echo "API_URL=https://your-api-domain.com" >> .env

# Запуск
docker-compose -f docker-compose.prod.yml up -d
```

### 2. Vercel + Railway

#### Frontend на Vercel

1. Подключите репозиторий к Vercel
2. Настройте переменные окружения:
   ```
   NEXT_PUBLIC_API_URL=https://your-api.railway.app
   NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
   ```
3. Установите Build Command: `cd apps/web && pnpm build`
4. Установите Output Directory: `apps/web/.next`

#### Backend на Railway

1. Создайте новый проект на Railway
2. Подключите PostgreSQL addon
3. Настройте переменные окружения:
   ```
   DATABASE_URL=postgresql://...
   PORT=3001
   NODE_ENV=production
   SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
   ```
4. Установите Build Command: `cd apps/api && pnpm build`
5. Установите Start Command: `cd apps/api && pnpm start`

### 3. AWS (EC2 + RDS)

#### Настройка RDS PostgreSQL

1. Создайте RDS инстанс PostgreSQL
2. Настройте Security Groups для доступа
3. Запишите connection string

#### Настройка EC2

```bash
# Установка Node.js и pnpm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pnpm

# Клонирование и настройка проекта
git clone <your-repo>
cd HackSolana
pnpm install

# Настройка переменных окружения
sudo nano /etc/environment
# Добавьте переменные

# Настройка systemd сервисов
sudo nano /etc/systemd/system/solana-music-api.service
```

Содержимое сервиса API:

```ini
[Unit]
Description=Solana Music API
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/HackSolana/apps/api
ExecStart=/usr/bin/pnpm start
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

#### Настройка Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔧 Переменные окружения

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Server
PORT=3001
NODE_ENV=production

# Solana
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_NETWORK=mainnet-beta

# Platform settings
PLATFORM_FEE_PERCENTAGE=10
ARTIST_ROYALTY_PERCENTAGE=90

# Security (добавьте в продакшн)
JWT_SECRET=your-jwt-secret
API_KEY=your-api-key
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_NETWORK=mainnet-beta

# Analytics (опционально)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 🔒 Безопасность

### SSL/TLS сертификаты

```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx

# Получение сертификата
sudo certbot --nginx -d your-domain.com

# Автоматическое обновление
sudo crontab -e
# Добавьте: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Firewall настройки

```bash
# UFW настройка
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Backup базы данных

```bash
# Создание backup скрипта
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
rm backup_$DATE.sql
```

## 📊 Мониторинг

### Health checks

API предоставляет health check endpoints:

```bash
# Проверка API
curl https://your-api-domain.com/health

# Проверка базы данных
curl https://your-api-domain.com/api/stats/dashboard
```

### Логирование

Настройте централизованное логирование:

```javascript
// В production добавьте в API
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Метрики

Интегрируйте с системами мониторинга:

- **Prometheus + Grafana** для метрик
- **Sentry** для отслеживания ошибок
- **DataDog** для APM мониторинга

## 🚦 CI/CD Pipeline

### GitHub Actions

Создайте `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: pnpm install
      - run: pnpm test

  deploy-api:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        uses: railway/cli@v2
        with:
          command: up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-web:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 📈 Масштабирование

### Горизонтальное масштабирование

1. **Load Balancer**: Используйте Nginx или AWS ALB
2. **Multiple API instances**: Запустите несколько экземпляров API
3. **Database connection pooling**: Настройте пул соединений

### Кэширование

```javascript
// Redis для кэширования
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Кэширование статистики
app.get('/api/stats/dashboard', async (c) => {
  const cacheKey = `dashboard:${period}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return c.json(JSON.parse(cached));
  }
  
  const data = await getDashboardData(period);
  await redis.setex(cacheKey, 300, JSON.stringify(data)); // 5 минут
  
  return c.json(data);
});
```

### CDN

Настройте CDN для статических ресурсов:

- **Cloudflare** для глобального CDN
- **AWS CloudFront** для интеграции с AWS
- **Vercel Edge Network** при использовании Vercel

## 🔄 Обновления

### Zero-downtime deployment

1. **Blue-Green deployment**
2. **Rolling updates** с Kubernetes
3. **Database migrations** с версионированием

### Rollback стратегия

```bash
# Сохранение предыдущей версии
docker tag solana-music-api:latest solana-music-api:previous

# Быстрый rollback
docker-compose down
docker tag solana-music-api:previous solana-music-api:latest
docker-compose up -d
```

## 📋 Чеклист развертывания

### Перед развертыванием

- [ ] Настроены все переменные окружения
- [ ] Проведено тестирование на staging
- [ ] Настроен мониторинг и алерты
- [ ] Настроен backup базы данных
- [ ] Проверены SSL сертификаты
- [ ] Настроен firewall

### После развертывания

- [ ] Проверены health checks
- [ ] Протестированы основные функции
- [ ] Проверены логи на ошибки
- [ ] Настроены алерты мониторинга
- [ ] Документирован процесс rollback

## 🆘 Troubleshooting

### Частые проблемы

1. **Database connection issues**
   ```bash
   # Проверка подключения
   psql $DATABASE_URL -c "SELECT 1"
   ```

2. **CORS ошибки**
   ```javascript
   // Обновите CORS настройки в API
   app.use('*', cors({
     origin: ['https://your-domain.com'],
     credentials: true
   }));
   ```

3. **Memory issues**
   ```bash
   # Мониторинг памяти
   htop
   # Увеличение лимитов Node.js
   node --max-old-space-size=4096 dist/index.js
   ```

### Логи и отладка

```bash
# Просмотр логов Docker
docker logs solana-music-api

# Просмотр логов systemd
sudo journalctl -u solana-music-api -f

# Проверка производительности
curl -w "@curl-format.txt" -o /dev/null -s https://your-api.com/health
```