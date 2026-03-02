# BookIt – Notifications Service

Notifications service je mikrostoritev v sistemu BookIt, ki skrbi za pošiljanje e-mail obvestil uporabnikom (npr. ob uspešni rezervaciji ali preklicu termina).

## Funkcionalnosti
- pošiljanje e-mail obvestil prek SMTP,
- pošiljanje potrditve ob rezervaciji,
- pošiljanje obvestila ob preklicu rezervacije.

## Okoljske spremenljivke
```env
PORT=3003
SMTP_HOST=<smtp_host>
SMTP_PORT=<smtp_port>
SMTP_USER=<smtp_user>
SMTP_PASS=<smtp_password>
SMTP_FROM=<from_email>
```

## Zagon

```bash
npm install
nest start
# ali
npm run start:dev
```

API teče na `http://localhost:3003`  
Swagger: `http://localhost:3003/docs`

## Testi

```bash
npm test
```

Unit testi preverjajo pošiljanje e-mailov z uporabo mockanega SMTP odjemalca (brez dejanskega pošiljanja sporočil).