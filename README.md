# EPFK College Organizer

Застосунок для організації навчання в коледжі.

## Структура

```text
frontend/                  React + Vite
  src/
    App.tsx                кореневий компонент
    main.tsx               точка входу
    pages/                 компоненти маршрутів та збирання сторінок
    components/            спільний layout і UI-блоки в папках відповідних сторінок
    features/              типи, хуки та логіка за функціональними напрямами
    services/api/          спільні клієнти для запитів до backend
    mocks/                 тимчасові набори демонстраційних даних
    themes/                палітри світлої й темної тем у JSON
    assets/                зображення та брендова графіка
backend/                   NestJS
  src/
    main.ts                запуск сервера
    app.module.ts          збирання модулів
    health/                перевірка доступності API
    <feature>/             модуль, контролер, сервіс, DTO та тести функції
  test/                    наскрізні тести
```

Каталоги для майбутніх функцій створюємо, коли з'являється код. Код конкретної функції зберігаємо разом, спільний код виносимо лише за потреби. Модуль NestJS експортує тільки ті провайдери, які потрібні іншим модулям.

## Запуск

Потрібен Node.js, сумісний із версіями залежностей у `package.json`.

Для локального входу налаштуйте ключі Clerk за інструкцією в [AUTH.md](AUTH.md), скопіювавши `.env.example` у `.env` для frontend і backend.

```powershell
cd backend
npm ci
npm run start:dev
```

В іншому терміналі:

```powershell
cd frontend
npm ci
npm run dev
```

API перевіряється через `GET /health` і повертає `{ "status": "ok" }`. Розклад доступний через `GET /api/schedule`; бекенд повертає обидва тижні, шість часових слотів і масиви з шістьма заняттями або `null` на кожен день. Джерело демонстраційних даних — `backend/src/schedule/schedule.json`.

## Перевірка

```powershell
cd backend
npm run build
npm test
npm run test:e2e

cd ../frontend
npm run build
npm run lint
```
