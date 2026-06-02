# CineVault — Онлайн-кинобиблиотека

Веб-приложение для просмотра каталога фильмов, поиска, фильтрации, отзывов и формирования списка избранного. Реализовано по архитектуре Client–Server с разделением FrontEnd и BackEnd.

## Стек технологий

- BackEnd: Python, Django, Django REST Framework, SQLite
- FrontEnd: React, React Router, Axios
- Документация API: drf-spectacular (Swagger / OpenAPI)
- Контейнеризация: Docker, docker-compose

## Возможности

- Каталог из 1000 фильмов (датасет IMDb Top 1000)
- Поиск по названию, фильтрация по жанрам, сортировка по рейтингу и году
- Страница фильма: рейтинги, режиссёры, актёры, жанры, отзывы
- Регистрация и аутентификация по токену
- Избранное и отзывы для авторизованных пользователей
- Переключение светлой и тёмной темы

## Структура проекта

```
WebCourseProject/
├── movie_lib/            BackEnd (Django)
│   ├── movies/           фильмы, жанры, персоны, импорт CSV
│   ├── reviews/          отзывы
│   ├── favorites/        избранное
│   ├── users/            регистрация, вход, выход
│   ├── api/              маршрутизация API, Swagger
│   └── movie_lib/        настройки проекта
├── frontend/             FrontEnd (React + Vite)
│   └── src/
│       ├── pages/        страницы приложения
│       ├── components/   переиспользуемые компоненты
│       ├── contexts/     контекст аутентификации
│       └── services/     обращения к API
├── imdb_top_1000/        исходный CSV-датасет
└── docker-compose.yml    запуск всего стека
```

## Запуск в режиме разработки

Требуется Python с активным окружением и Node.js.

BackEnd:

```bash
cd movie_lib
cp .env.example .env          # затем впишите свой SECRET_KEY
python manage.py migrate
python manage.py import_movies  # импорт фильмов из CSV (при первом запуске)
python manage.py runserver
```

FrontEnd (в отдельном терминале):

```bash
cd frontend
npm install
npm run dev
```

Приложение открывается по адресу http://localhost:5173

## Запуск через Docker

```bash
docker compose up --build
```

Приложение доступно по адресу http://localhost

## Документация API

При запущенном BackEnd:

- Swagger UI: http://127.0.0.1:8000/api/docs/
- OpenAPI-схема: http://127.0.0.1:8000/api/schema/

Подробное описание эндпоинтов — в файле `API_DESCRIPTION.md`. Схема базы данных — в `DB_DESCRIPTION.md`.

## Переменные окружения

Конфигурация BackEnd задаётся в `movie_lib/.env` (шаблон — `movie_lib/.env.example`):

- `SECRET_KEY` — секретный ключ Django (обязателен)
- `DEBUG` — режим отладки (True / False)
- `ALLOWED_HOSTS` — разрешённые хосты через запятую
- `CORS_ALLOWED_ORIGINS` — разрешённые источники для CORS через запятую

## Тестирование

```bash
cd movie_lib
python manage.py test
```

Тесты покрывают регистрацию, аутентификацию, получение списка и карточки фильма, создание отзыва и добавление в избранное.
