# API Janitor

TODO бейджи на CI/CD

## Что это?

Сервис предоставляет информацию о наличии обновлений, а также хосты для запросов.

## Как развернуть и запустить для разработки?

Установка зависимостей и запуск для разработки:

    - npm install
    - npm start

Запуск тестов:

    - npm t

## Как изменить минимальную допустимую версию?

## Как указать сообщение для нужной версии?

## Как собрать?

    - npm run build

## Как задеплоить?

    - cp config/settings.example.yml config/settings.yml
    - ???
    - node build/index.js --debug --port 8080

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
% curl -i 'localhost:8080/janitor?platform=ios&osVersion=14&appVersion=3.0.1' \
    -H "Content-Type: application/json" \
    -H "Accept: application/json"
    
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 106
Date: Wed, 06 Oct 2021 11:44:46 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"appLink":"ios_app_store_link","message":"upToDate","blockApp":false,"urls":["https://bitzlato.com/api"]}
```
<br />

Пример успешного запроса. Приложение устарело, но обновление не требуется:
```
% curl -i 'localhost:8080/janitor?platform=ios&osVersion=14&appVersion=3.0.0' -H "Content-Type: application/json" -H "Accept: application/json"
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 108
Date: Wed, 06 Oct 2021 11:30:36 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"appLink":"ios_app_store_link","message":"needUpdate","blockApp":false,"urls":["https://test.com/api"]}%
```
<br />

Пример успешного запроса. Приложение устарело, требуется обновление:
```
% curl -i 'localhost:8080/janitor?platform=ios&osVersion=14&appVersion=2.9.9' -H "Content-Type: application/json" -H "Accept: application/json"
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 112
Date: Wed, 06 Oct 2021 11:29:29 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"appLink":"ios_app_store_link","message":"needUpdateForce","blockApp":true,"urls":["https://test.com/api"]}%
```
<br />

Пример запроса с ошибкой:
```
% curl -i  'localhost:8080/janitor?platform=symbian&osVersion=14&appVersion=1.0.0' -H "Content-Type: application/json" -H "Accept: application/json"
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
