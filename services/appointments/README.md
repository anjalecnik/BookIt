# BookIt – Appointments Service

Appointments service je mikrostoritev v sistemu BookIt, ki skrbi za upravljanje razpoložljivih terminov in rezervacij.

## Funkcionalnosti

- hranjenje predefiniranih terminov za storitve (**fitnes**, **zdravnik**, **frizer**),
- pregled in filtriranje razpoložljivih terminov,
- rezervacija termina,
- preklic rezervacije,
- zagotavljanje, da je posamezen termin lahko rezerviran največ enkrat.

## Okoljske spremenljivke

```env
PORT=3002
DATABASE_URL=<postgres_url>
NOTIFICATIONS_URL=http://notifications:3003
RABBITMQ_URL=amqp://rabbitmq:5672
```

## Zagon

```bash
npm install
nest start
# ali
npm run start:dev
```

API teče na `http://localhost:3002`  
Swagger: `http://localhost:3002/docs`

## Testi

```bash
npm test
```

Unit testi preverjajo poslovno logiko in uporabljajo mocke (brez baze in zunanjih storitev).
