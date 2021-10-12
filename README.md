# Janitor

[![CI](https://github.com/bitzlato/janitor/actions/workflows/main.yml/badge.svg?branch=master)](https://github.com/bitzlato/janitor/actions/workflows/main.yml)

## Что это?

Сервис предоставляет информацию о наличии обновлений мобильного приложения,
а также список URL-ов для запросов к API.

## Как развернуть и запустить для разработки?

Установка зависимостей и запуск для разработки:

    yarn
    yarn start

Запуск тестов:

    yarn test

## Как изменить минимальную допустимую версию?

1) В файле конфигурации ``config/settings.yml`` в разделе ``versions`` заменить неподдерживаемую
   ``version`` на необходимую.
   Например, если минимальная версия теперь ``3.0.1``, а в конфиге стоит ``<3.0.0``, то ``<3.0.0`` заменить на ``<3.0.1``
   
1) Заменить минимальную допустимую версию

## Как указать сообщение для нужной версии?

В файле конфигурации ``config/settings.yml`` в разделе ``versions`` поменять ``message`` на нужное сообщение
у соответствующей версии

## Как собрать?

    yarn build

## Как запустить локально?

    docker-compose up --build -d

## Как задеплоить на сервер?

Прописать [переменные окружения](https://direnv.net) `APP_USER` и `APP_HOST`
 
    make deploy

## Инкрементация версии проекта

При выполнении скрипта инкрементации, создается коммит и тег с новой версией проекта.

Инкрементация patch:

      yarn version:patch

Инкрементация minor:

      yarn version:minor

Инкрементация major:

      yarn version:major



## Какие endpoint-ы предоставляет

| Endpoint      |   Параметры      | Ответ   |Описание       |
| ------------- | -----------   | ------------- | --- |
| GET /janitor      | <p>platform  - android или ios</p><p>osVersion - 13\14\15</p><p>appVersion - 3.0.0</p> | `` { appLink: string, message: string, blockApp: boolean, urls: string[] }`` | Проверка версии приложения, а также предоставление списка хостов для запросов |

<br />


Соблюдаем https://jsonapi.org/format/#content-negotiation.
Клиент обязательно должен указать в заголовках запроса:

```
Content-Type: application/json
Accept: application/json
```

<br />

Пример успешного запроса. Обновление приложения не требуется:
```sh
% curl -i 'localhost:8080/?platform=ios&osVersion=14&appVersion=3.0.1' \
    -H "Content-Type: application/json" \
    -H "Accept: application/json"
    
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 106
Date: Wed, 06 Oct 2021 11:44:46 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"appLink":"ios_app_store_link","message":"Обновлений нет","blockApp":false,"urls":["https://bitzlato.com/api"]}
```
<br />

Пример успешного запроса. Приложение устарело, но обновление не требуется:
```sh
% curl -i 'localhost:8080/?platform=ios&osVersion=14&appVersion=3.0.0' \
    -H "Content-Type: application/json" \
    -H "Accept: application/json"
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 108
Date: Wed, 06 Oct 2021 11:30:36 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"appLink":"ios_app_store_link","message":"Вам желательно обновиться","blockApp":false,"urls":["https://test.com/api"]}%
```
<br />

Пример успешного запроса. Приложение устарело, требуется обновление:
```sh
% curl -i 'localhost:8080/?platform=ios&osVersion=14&appVersion=2.9.9' \
    -H "Content-Type: application/json" \
    -H "Accept: application/json"
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 112
Date: Wed, 06 Oct 2021 11:29:29 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"appLink":"ios_app_store_link","message":"Данная версия приложения больше не поддерживается. Вам необходимо обновить приложение","blockApp":true,"urls":["https://test.com/api"]}%
```
<br />

Пример запроса с ошибкой:
```sh
% curl -i  'localhost:8080/?platform=symbian&osVersion=14&appVersion=1.0.0' \
    -H "Content-Type: application/json" \
    -H "Accept: application/json"
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Content-Length: 86
Date: Wed, 06 Oct 2021 10:31:50 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":"Available platforms: [android, ios]. You specified: symbian","status":400}%
```

## Авторы

https://github.com/velsamm
