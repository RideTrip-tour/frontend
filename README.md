# RideTrip Frontend

Frontend-приложение для RideTrip на базе React + TypeScript + Vite с готовой архитектурой: роутинг, Zustand, JWT-авторизация, axios-клиент с интерсепторами, refresh-токены, уведомления, глобальный loader и error boundary.

## Стек технологий

- React 18
- TypeScript
- Vite
- React Router
- Zustand (state management)
- Axios (API client)
- JWT auth + refresh flow
- Context API (toast-уведомления)

## Возможности проекта

- Инициализирован React + TS через Vite
- Абсолютные импорты (@/...)
- Грамотная структура проекта
- Роутинг с protected routes
- Lazy loading страниц
- Zustand store (auth) + persist
- Axios client с:
- baseURL из .env
- timeout и дефолтными headers
- JWT interceptor
- refresh token flow
- единая обработка ошибок
- API services (auth, user)
- Toast-уведомления
- Глобальный loader
- Error Boundary

## Getting started

### Install dependencies

1. Установка зависимостей:

```bash
npm install
```

2. Запуск в dev-режиме:

```bash
npm run dev
```

3. Сборка:

```bash
npm run build
```

4. Preview сборки:

```bash
npm run preview
```

## Авторизация

Реализовано:

- access token (JWT)
- автоматическая подстановка Authorization header
- refresh token через interceptor
- повтор запроса после обновления токена
- авто-logout при ошибке refresh
- сохранение сессии в localStorage (Zustand persist)

## Уведомления

Toast-система через Context API.

## Error Boundary

Глобальный перехват ошибок React
