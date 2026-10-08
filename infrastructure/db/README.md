# PostgreSQL

Локальна база використовує PostgreSQL 17, порт `5432` та постійний Docker volume.
Порт доступний лише на `127.0.0.1`.

Запуск із кореня репозиторію (Docker Desktop має бути запущений):

```powershell
docker compose -f infrastructure/db/docker-compose.yml up -d --wait
cd backend
npm ci
npm run prisma:generate
npm run prisma:deploy
npm run start:dev
```

Перед запуском скопіюйте `backend/.env.example` у `backend/.env`, якщо файл ще
не існує. Якщо він уже існує, додайте `DATABASE_URL` з прикладу, зберігши інші
налаштування.

За замовчуванням база — `epfk_organizer`, користувач — `epfk`, локальний пароль —
`epfk_local_password`. Для інших налаштувань скопіюйте `.env.example` поруч із
Compose у `.env` і змініть значення. Узгодьте `DATABASE_URL` у `backend/.env`
з назвою бази, користувачем, паролем та портом; спеціальні символи пароля в URL
потрібно кодувати. Ці стандартні облікові дані призначені для локальної розробки.

## Міграції

Prisma-схема: `backend/prisma/schema.prisma`. Початкова SQL-міграція:
`backend/prisma/migrations/20261008000000_init/migration.sql`.

Після зміни схеми виконайте в `backend/`:

```powershell
npm run prisma:migrate -- --name describe_change
npm run prisma:generate
```

`prisma:migrate` створює та застосовує міграції для розробки.
`prisma:deploy` застосовує збережені міграції. `prisma:studio` відкриває перегляд бази.
Згенерований клієнт не зберігається в Git; `npm run build` генерує його автоматично.
У сервісах NestJS клієнт доступний через ін'єкцію `PrismaService`.

Імена таблиць і колонок відповідають початковій структурі через `@@map` / `@map`.
У клієнті Prisma моделі мають PascalCase, поля — camelCase. Строкові поля мають
тип `text`, дати — `timestamptz(3)`. Пароль у `user.password` має містити хеш.
`token`, `group_id`, `status_id`, `last_sync`, `task.deadline`, описи та
`event.place` можуть бути `NULL`. `added_at` автоматично отримує поточний час,
`is_completed` за замовчуванням — `false`. Пари користувач–дисципліна та
користувач–завдання унікальні; при видаленні їхніх батьківських записів рядки
зв'язків видаляються каскадно.

`schedule` зберігає лише ID та групу. Список пар залишається в окремому файлі
з ім'ям за ID розкладу. Поточні API з демонстраційними даними ще не перенесені
на читання з БД.

Зупинка зі збереженням даних:

```powershell
docker compose -f infrastructure/db/docker-compose.yml down
```

Не додавайте `-v`, якщо потрібно зберегти дані.
