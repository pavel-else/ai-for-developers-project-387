# CalClone — План разработки

## Этап 1 — Инфраструктура БД

| # | Задача | Файлы |
|---|--------|-------|
| 1.1 | Установить drizzle-orm, drizzle-kit, pg | `backend/package.json` |
| 1.2 | Создать docker-compose.yml с PostgreSQL + backend | `docker-compose.yml` |
| 1.3 | Создать Drizzle-схему (Owner, EventType, Slot, Booking) | `backend/src/db/schema.ts` |
| 1.4 | Создать миграцию (init) + seed | `backend/src/db/migrations/` |
| 1.5 | Создать `backend/src/db/index.ts` (пул соединений) | `backend/src/db/index.ts` |
| 1.6 | Обновить `backend/src/index.ts` — подключение к БД | `backend/src/index.ts` |

## Этап 2 — Миграция логики с in-memory на БД

| # | Задача | Файлы |
|---|--------|-------|
| 2.1 | Переписать Store на Drizzle-запросы | `backend/src/store.ts` |
| 2.2 | Переписать seed на запись в БД | `backend/src/seed.ts` |
| 2.3 | Проверить хендлеры на совместимость | `backend/src/admin/*.ts`, `backend/src/guest/*.ts` |

## Этап 3 — docker-compose + сборка

| # | Задача | Файлы |
|---|--------|-------|
| 3.1 | Создать docker-compose.yml | `docker-compose.yml` |
| 3.2 | Обновить Dockerfile — миграции при старте | `Dockerfile` |
| 3.3 | Обновить Makefile — db-up, db-migrate, dev | `Makefile` |
| 3.4 | Обновить render.yaml — DATABASE_URL | `render.yaml` |

## Этап 4 — Баги

| # | Баг | Файл |
|---|-----|------|
| 4.1 | Создать `.github/workflows/e2e.yml` | `.github/workflows/e2e.yml` |
| 4.2 | Создать `.github/workflows/release-please.yml` | `.github/workflows/release-please.yml` |
| 4.3 | Создать `docs/merge-openapi.mjs` | `docs/merge-openapi.mjs` |
| 4.4 | Добавить `.max(480)` в Zod-схему duration | `backend/src/validation.ts` |
| 4.5 | Показывать бронирования в админ-таблице слотов | `frontend/src/pages/admin/SlotsPage.vue` |
| 4.6 | "Calcome" → "CalClone" | `frontend/index.html` |
