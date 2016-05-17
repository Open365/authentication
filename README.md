Authentication Service
======================

## Overview

Backend service to authenticate users.

## How to use it

Usage examples can be found at: *src/lib/samples*

```bash
echo Sending a Login Request to Authentication via amqp
node src/lib/samples/SendLoginRequestMessage.sample.js
```

The request to add a permission is:

- path:/users/alex.fiestas/permissions
- method: PUT
- body:

```javascript
{
    "permissions": [
        "foo.bar",
        "some.stuff"
    ]
}
```

```bash
curl 'http://localhost:8196/permissions/v1/principals/alex.fiestas/permissions' -X PUT \
-H 'Pragma: no-cache' -H 'Origin: chrome-extension://fdmmgilgnpjigdojojpjoooidkmcomcm' -H \
'Accept-Encoding: gzip,deflate,sdch' -H 'card: {"username":"markus","expiration":23564}' \
-H 'Accept-Language: en-US,en;q=0.8' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.104 Safari/537.36' \
-H 'Content-Type: text/plain;charset=UTF-8' -H 'Accept: */*' -H 'Cache-Control: no-cache' -H 'signature: 9s5h9s65h9s5gh9sfg9h6dfv0b67sf7gb6' \
-H 'Cookie: csrftoken=BGpvMCeVuXc6Akf9l8mzExrXMX3R4286; m=34e2:|ca3:t|4a01:t|2c69:t|47ba:t|1a28:f|54e1:t|77cb:t' \
-H 'Connection: keep-alive' --data-binary '{"permissions":["foo.bar", "some.stuff"]}' --compressed
```

Or in postman import:
```bash
{"id":"d02be18c-8416-6539-4e6d-0e86c0a47e30","name":"permissions","timestamp":1417445237411,"requests":[{"collectionId":"d02be18c-8416-6539-4e6d-0e86c0a47e30","id":"2c146e1d-d047-ba9a-a46c-74f3e2eb48a6","name":"Add permissions","description":"","url":"http://localhost:8196/permissions/v1/users/alex.fiestas/permissions","method":"PUT","headers":"card: {\"username\":\"markus\",\"expiration\":23564}\nsignature: 9s5h9s65h9s5gh9sfg9h6dfv0b67sf7gb6\n","data":"{\"permissions\":[\"foo.bar\", \"some.stuff\"]}","dataMode":"raw","timestamp":0,"responses":[],"version":2}]}
```

## Quick help

* Install modules

```bash
	$ npm install
```

* Check tests

```bash
    $ grunt test
```