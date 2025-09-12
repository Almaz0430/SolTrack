# API Документация - Управление дропами

## Обзор

Бэкенд API для управления NFT дропами на платформе Solana Music NFT. Использует Prisma ORM с SQLite для хранения данных.

## Структура данных

### Drop (Дроп)

```typescript
interface Drop {
  id: string;                    // Уникальный идентификатор
  name: string;                  // Название дропа
  artist: string;                // Имя артиста
  price: string;                 // Цена в SOL (строка для точности)
  totalSupply: number;           // Общий тираж
  mintedSupply: number;          // Количество заминченных NFT
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'; // Статус
  createdAt: string;             // Дата создания (ISO string)
  updatedAt: string;             // Дата обновления (ISO string)
  artistRoyalty: string;         // Роялти артиста в % (строка)
  platformFee: string;           // Комиссия платформы в % (строка)
  description?: string;          // Описание (опционально)
  imageUrl?: string;             // URL изображения (опционально)
  musicUrl?: string;             // URL музыки (опционально)
}
```

### Статусы дропов

- `DRAFT` - Черновик (можно редактировать и удалять)
- `ACTIVE` - Активный (доступен для покупки)
- `COMPLETED` - Завершенный (все NFT заминчены или дроп закрыт)
- `CANCELLED` - Отмененный

## API Endpoints

### 1. Получить все дропы

```
GET /api/drops
```

**Query параметры:**
- `status` (опционально) - Фильтр по статусу (`DRAFT`, `ACTIVE`, `COMPLETED`, `CANCELLED`)
- `search` (опционально) - Поиск по названию или артисту

**Ответ:**
```json
{
  "success": true,
  "data": [Drop[]],
  "count": number
}
```

**Пример запроса:**
```
GET /api/drops?status=ACTIVE&search=rock
```

### 2. Получить дроп по ID

```
GET /api/drops/:id
```

**Ответ:**
```json
{
  "success": true,
  "data": Drop
}
```

### 3. Создать новый дроп

```
POST /api/drops
```

**Тело запроса:**
```json
{
  "name": "string",              // Обязательно
  "artist": "string",            // Обязательно
  "price": "string",             // Обязательно (например, "2.5000")
  "totalSupply": number,         // Обязательно
  "artistRoyalty": "string",     // Обязательно (например, "90.00")
  "platformFee": "string",       // Обязательно (например, "10.00")
  "description": "string",       // Опционально
  "imageUrl": "string",          // Опционально
  "musicUrl": "string",          // Опционально
  "status": "DRAFT"              // Опционально (по умолчанию "DRAFT")
}
```

**Ответ:**
```json
{
  "success": true,
  "data": Drop,
  "message": "Дроп успешно создан"
}
```

### 4. Обновить дроп

```
PUT /api/drops/:id
```

**Тело запроса:** (все поля опциональны)
```json
{
  "name": "string",
  "artist": "string",
  "price": "string",
  "totalSupply": number,
  "status": "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED",
  "artistRoyalty": "string",
  "platformFee": "string",
  "description": "string",
  "imageUrl": "string",
  "musicUrl": "string"
}
```

**Ответ:**
```json
{
  "success": true,
  "data": Drop,
  "message": "Дроп успешно обновлен"
}
```

### 5. Удалить дроп

```
DELETE /api/drops/:id
```

**Ограничения:**
- Нельзя удалить активный дроп с заминченными NFT

**Ответ:**
```json
{
  "success": true,
  "message": "Дроп успешно удален"
}
```

### 6. Активировать дроп

```
POST /api/drops/:id/activate
```

**Условия:**
- Дроп должен быть в статусе `DRAFT`
- Все обязательные поля должны быть заполнены

**Ответ:**
```json
{
  "success": true,
  "data": Drop,
  "message": "Дроп успешно активирован"
}
```

### 7. Завершить дроп

```
POST /api/drops/:id/complete
```

**Условия:**
- Дроп должен быть в статусе `ACTIVE`

**Ответ:**
```json
{
  "success": true,
  "data": Drop,
  "message": "Дроп успешно завершен"
}
```

### 8. Заполнить базу данных тестовыми данными

```
POST /api/seed
```

Создает тестовые данные в базе данных (только если база пуста).

**Ответ:**
```json
{
  "success": true,
  "message": "Создано 5 тестовых дропов",
  "count": 5
}
```

## Обработка ошибок

Все API endpoints возвращают стандартный формат ошибок:

```json
{
  "success": false,
  "error": "Краткое описание ошибки",
  "message": "Подробное сообщение об ошибке"
}
```

**HTTP статус коды:**
- `200` - Успешный запрос
- `201` - Ресурс создан
- `400` - Ошибка валидации или неверный запрос
- `404` - Ресурс не найден
- `500` - Внутренняя ошибка сервера

## Валидация

### Создание и обновление дропов

1. **Обязательные поля** (при создании):
   - `name` - не пустое
   - `artist` - не пустое
   - `price` - положительное число
   - `totalSupply` - положительное целое число
   - `artistRoyalty` - от 0 до 100
   - `platformFee` - от 0 до 100

2. **Дополнительные проверки:**
   - Сумма `artistRoyalty` + `platformFee` не должна превышать 100%
   - При обновлении `totalSupply` не может быть меньше `mintedSupply`
   - URL поля должны быть валидными URL (если указаны)

3. **Ограничения по статусам:**
   - Активировать можно только дропы в статусе `DRAFT`
   - Завершить можно только дропы в статусе `ACTIVE`
   - Удалить нельзя активные дропы с заминченными NFT

## База данных

Используется Prisma ORM с SQLite. База данных создается автоматически при первом запуске.

### Prisma схема

```prisma
model Drop {
  id            String   @id @default(cuid())
  name          String
  artist        String
  price         String
  totalSupply   Int
  mintedSupply  Int      @default(0)
  status        DropStatus @default(DRAFT)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  artistRoyalty String
  platformFee   String
  description   String?
  imageUrl      String?
  musicUrl      String?

  @@map("drops")
}

enum DropStatus {
  DRAFT
  ACTIVE
  COMPLETED
  CANCELLED
}
```

## Использование на фронтенде

Для работы с API используйте утилиты из `@/lib/api.ts`:

```typescript
import { dropsApi } from '@/lib/api';

// Получить все дропы
const response = await dropsApi.getAll();

// Создать дроп
const newDrop = await dropsApi.create({
  name: 'My Drop',
  artist: 'Artist Name',
  price: '1.5000',
  totalSupply: 100,
  artistRoyalty: '90.00',
  platformFee: '10.00'
});

// Активировать дроп
await dropsApi.activate(dropId);
```

## Prisma команды

```bash
# Генерация клиента после изменения схемы
npx prisma generate

# Создание миграции
npx prisma migrate dev --name migration_name

# Просмотр базы данных
npx prisma studio

# Сброс базы данных
npx prisma migrate reset
```

## Запуск и тестирование

1. Установите зависимости:
```bash
pnpm install
```

2. Запустите сервер разработки:
```bash
pnpm dev
```

3. Заполните базу данных тестовыми данными:
```bash
curl -X POST http://localhost:3000/api/seed
```

4. Откройте админ панель:
```
http://localhost:3000/admin
```

## Примеры использования

### Создание дропа через curl

```bash
curl -X POST http://localhost:3000/api/drops \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Drop",
    "artist": "Test Artist",
    "price": "2.0000",
    "totalSupply": 50,
    "artistRoyalty": "85.00",
    "platformFee": "15.00",
    "description": "Test description"
  }'
```

### Получение всех активных дропов

```bash
curl "http://localhost:3000/api/drops?status=ACTIVE"
```

### Активация дропа

```bash
curl -X POST http://localhost:3000/api/drops/[DROP_ID]/activate
```