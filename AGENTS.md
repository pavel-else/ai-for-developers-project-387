# CalClone — AGENTS.md

Проект в активной разработке. Код есть. Всё решается с пользователем в диалоге.

## Документация

- `docs/entities.md` — сущности (Owner, EventType, Slot, Booking)
- `docs/api.tsp` — API-контракт (TypeSpec)

Оба файла — источник истины по архитектуре. Менять только через пользователя.

## Тестирование

- E2E-тесты в `e2e/` (Playwright, chromium headless)
- API-запросы перехватываются через `page.route()` — реальный бэкенд не нужен
- Запуск: `make test-e2e`, `make test-e2e-ui`, `make test-e2e-debug`
- Хелперы: `e2e/helpers/api.ts` (route interception), `e2e/helpers/fixtures.ts` (мок-данные)

## CI/CD (GitHub Actions)

- `.github/workflows/e2e.yml` — E2E-тесты на push/PR в main
- `.github/workflows/release-please.yml` — автоматические релизы (conventional commits → Release PR → GitHub Release)
- `.github/workflows/commitlint.yml` — проверка conventional commits на PR в main
- `.github/workflows/opencode.yml` — интерактивная работа с агентом по комментариям (`/oc`, `/opencode`) в issues и PR
- `.github/workflows/deploy.yml` — деплой на Render при пуше в `main`
- `.github/workflows/lighthouse.yml` — регулярный Lighthouse-аудит (cron `0 3 * * *` + `workflow_dispatch`): генерирует HTML/JSON-отчёт (artifact `lighthouse-report`, 30 дней) и опционально анализирует агентом OpenCode с созданием issue при деградации метрик >10% относительно `docs/performance-baseline.md`
- Большинство workflow используют `GITHUB_TOKEN` и не требуют дополнительных секретов; исключения: `deploy.yml` требует `RENDER_API_KEY` и `RENDER_SERVICE_ID`, `opencode.yml` и `lighthouse.yml` требуют `OPENCODE_API_KEY`

## Deploy (Render)

- `render.yaml` — Blueprint для сервиса `calcom` (Docker, порт 3001)
- Деплой инициирует `deploy.yml` при пуше в `main` через Render API (`POST /v1/services/{id}/deploys`)
- Разовая настройка (вне репо):
  1. На render.com привязать GitHub → **New + → Blueprint** → выбрать репозиторий (Render создаст сервис из `render.yaml`)
  2. В Account Settings → API Keys создать ключ
  3. Скопировать `serviceId` (`srv-xxxx`) из URL сервиса
  4. В GitHub repo Settings → Secrets and variables → Actions добавить `RENDER_API_KEY` и `RENDER_SERVICE_ID`

## Процесс

1. Сначала обсуждаем изменения с пользователем
2. После утверждения — правим код/docs, коммитим, пушим

## Git

- Коммитить и пушить только когда пользователь явно сказал.
- Ветка: `main`
- Сообщения коммитов — conventional commits (`type: description`). Проверяется локально (`npm run lint:commits`) и в CI.

## Соглашения

- Сущности в `entities.md` описывают поля, а не типы
- API в `api.md` — HTTP-роуты без привязки к конкретному фреймворку
- Статусы Booking: `active`, `cancelled`
- Бритва Оккама: не плодить сущности без необходимости
