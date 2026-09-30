# EPFK College Organizer

Застосунок для організації навчання в коледжі.

## Структура

```text
frontend/                  React + Vite
  src/
    App.tsx                кореневий компонент
    main.tsx               точка входу
    pages/                 сторінки
    features/              функціональні модулі з власними компонентами, хуками й API
    components/            спільні компоненти, якщо з'являться
    assets/                зображення та шрифти, якщо з'являться
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

API перевіряється через `GET /health` і повертає `{ "status": "ok" }`.

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
