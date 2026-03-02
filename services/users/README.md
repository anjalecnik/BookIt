# BookIt – Users Service

Users service je mikrostoritev v sistemu BookIt, ki skrbi za prijavo uporabnikov prek **Google OAuth** in upravljanje osnovnih podatkov o uporabniku.

## Funkcionalnosti
- prijava uporabnika prek Google računa,
- preverjanje Google `id_token`,
- ustvarjanje ali pridobivanje uporabnika iz baze.

## Okoljske spremenljivke
```env
PORT=3001
DATABASE_URL=<postgres_url>
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```


## Zagon
```bash
npm install
nest start
# ali 
npm run start:dev
```

API teče na `http://localhost:3001`  
Swagger: `http://localhost:3001/docs`

## Testi
```bash
npm test
```
Unit testi preverjajo poslovno logiko in uporabljajo mocke (brez baze in zunanjih storitev).