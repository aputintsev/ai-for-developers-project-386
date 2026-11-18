# Календарь звонков


[![hexlet-check](https://github.com/aputintsev/ai-for-developers-project-386/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/aputintsev/ai-for-developers-project-386/actions)

«Запись на звонок» это упрощённый сервис бронирования времени по мотивам Cal.com.

Cal.com это сервис, где пользователь публикует доступные интервалы, а другой человек выбирает свободное время и бронирует встречу. У нашего приложения тот же базовый сценарий: владелец публикует доступное время для встреч, а другой пользователь выбирает свободный слот и записывается на звонок.

В проекте нет авторизации, личных кабинетов и интеграций с внешними календарями. Функциональность намеренно ограничена, чтобы сосредоточиться на главном.

В результате должно получиться небольшое, но законченное приложение.

Есть два типа пользователей: Владелец и Гость.
Владелец календаря в приложении один и задан заранее. Он заводит типы встреч, у каждого есть название, описание и длительность, и смотрит список предстоящих встреч всех типов. 
Гость заходит без регистрации, выбирает тип встречи, открывает календарь на ближайшие 14 дней и записывается на свободный слот. Слот длится столько, сколько выбранный тип встречи. Одно и то же время нельзя занять дважды, даже разными типами встреч.

Окно записи занимает 14 календарных дней и сдвигается с течением времени. Начало с сегодняшнего или завтрашнего дня, часы работы владельца и часовой пояс вы выбираете и записываете в спецификации. Длительность слота совпадает с длительностью типа встречи, шаг доступных стартов тоже фиксируется в спецификации. Пересечение интервалов запрещено, включая частичное наложение разных типов. Следующая встреча может начинаться в момент окончания предыдущей. Правила действуют и для двух запросов, пришедших одновременно.

Данные хранятся в памяти процесса. Перезапуск сбрасывает записи.

Учебный проект Хекслета: https://ru.hexlet.io/programs/ai-for-developers
Как это должно работать (примеры экранов): https://files.hexlet.app/a/2ipc5m

## Стек

- Vite & Typescript - для бэкенда
- shadcn/ui - для фронтенда

Обязательная часть работы с API состоит из TypeSpec-контракта, сгенерированной OpenAPI-спецификации и клиентского SDK для фронтенда. До выбора инструментов проверьте, что для языка фронтенда есть генератор клиента из OpenAPI. Серверные типы и маршруты генерируются, если выбранный фреймворк это поддерживает. При отсутствии серверного генератора бекенд реализуется по контракту и проверяется тестами.

## Установка

<!-- Опишите установку: клонирование, зависимости, переменные окружения -->

```bash
git clone https://github.com/aputintsev/ai-for-developers-project-386.git
cd ai-for-developers-project-386
```

## Использование

Приложение должно собираться в Docker-образ и запускаться в контейнере.

<!-- Добавьте примеры запуска и запись asciinema — именно это смотрит работодатель -->

---

<details>
<summary>Автоматические тесты Хекслета</summary>

Тесты запускаются на каждый коммит. За запуск отвечает файл `.github/workflows/hexlet-check.yml` — не удаляйте и не переименовывайте ни его, ни репозиторий.

</details>

## О Хекслете

[Хекслет](https://ru.hexlet.io/) — школа программирования: авторские программы обучения с практикой, поддержкой наставников и реальными проектами, которые остаются в резюме. Этот репозиторий — один из таких проектов.

## Development and quality checks

Install [mise](https://mise.jdx.dev/getting-started.html), then from the repository root:

```sh
mise trust
mise install
mise run setup
mise run check
```

`setup` installs npm dependencies from the lockfile, Playwright Chromium, and hk Git hooks.
`check` runs ESLint (warnings fail), secret history scanning, GitHub Actions lint,
Renovate schema validation, TypeScript/Vite build, smoke tests, and OSV vulnerability
scanning. OSV needs network access. GitHub Actions runs this same command on every
push and pull request, and weekly to detect newly published vulnerabilities.
The generated Hexlet workflow is maintained separately.

Before commit, hk checks staged JavaScript/TypeScript and staged secrets. Before
push, it runs `mise run check`. CI remains the gate when hooks are bypassed.
`mise run fix` applies ESLint's available automatic fixes.

```sh
mise run dev        # foreground Vite
mise run dev:start  # background Vite, managed by mise/pitchfork
mise run dev:logs
mise run dev:stop
```

Open http://localhost:5173 after starting the background server. Daemons are an
experimental mise feature; they start only on request. Smoke tests manage their
own isolated Vite server and do not require this background process.

Renovate configuration is in `renovate.json`; enable the Renovate GitHub App for
this repository to receive update PRs. Releases must age seven days before an
update is proposed. The schema in `schemas/renovate.schema.json` is a snapshot of
https://docs.renovatebot.com/renovate-schema.json and must be updated from that
source, not edited manually. Tool versions live in `mise.toml`; npm dependencies
are reproduced by `call-calendar/package-lock.json`.

The npm override for `minimatch` keeps transitive copies on the patched v11 line
(GHSA-g3hv-75wg-m249). Revisit the override when upstream dependencies upgrade.

After editing the API contract in `call-calendar/api/main.tsp`, regenerate OpenAPI
and the TypeScript SDK in order.

```sh
mise run generate:openapi
mise run generate:sdk
```

Browser tests default to Playwright Chromium. Set `PLAYWRIGHT_CHROMIUM_CHANNEL=chrome`
to run them with an existing Google Chrome installation.
