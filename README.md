# API Janitor

TODO бейджи на CI/CD

## Что это?

Сервис для проверки версии мобильного приложения.
Предоставляет информацию о наличии обновлений, а также хосты для запросов.

## Как развернуть и запустить для разработки?

    - npm install
    - npm start

## Как изменить минимальную допустимую версию?

## Как указать сообщение для нужной версии?

## Как собрать?

    - npm t
    - npm run build

## Как задеплоить?

    - cp config/settings.example.yml config/settings.yml
    - ???
    - node build/index.js --debug --port 8080

## Какие endpoint-ы предоставляет

| Endpoint      |   Параметры      | Ответ   |Описание       |
| ------------- | -----------   | ------------- | --- |
| GET /janitor      | <p>platform  - android или ios</p><p>osVersion - 13\14\15</p><p>appVersion - 3.0.0</p> | ``{ appLink: string, shouldUpdate: boolean, shouldBlockApp: boolean, urls: string }`` | Проверка версии приложения, а также предоставление списка хостов для запросов |

<br />

Пример успешного запроса:
```
curl "http://localhost:8080/janitor?platform=ios&osVersion=14&appVersion=1.2.3"   
{"appLink":"ios_app_store_link","shouldUpdate":false,"shouldBlockApp":false,"urls":["https://bitzlato.com"]}
```
<br />

Пример запроса с ошибкой:
```
curl "http://localhost:8080/janitor?platform=symbian&osVersion=14&appVersion=1.2.3" 
Bad Request. Available platforms: [android, ios]. You specified: symbian
```

## Авторы

https://github.com/velsamm
