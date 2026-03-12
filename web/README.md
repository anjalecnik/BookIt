# BookIt – Web Application

Web aplikacija sistema BookIt, ki uporabnikom omogoča prijavo prek **Google OAuth** ter upravljanje rezervacij terminov.

## Funkcionalnosti

- prijava uporabnika prek Google računa,
- pregled razpoložljivih terminov,
- rezervacija termina,
- preklic rezervacije,
- pregled lastnih rezervacij.

## Okoljske spremenljivke

```env
VITE_WEB_GATEWAY_API=http://localhost:8080/api/web
VITE_GOOGLE_CLIENT_ID=<google_oauth_client_id>
```

## Zagon

```env
npm install
npm run dev
```

Aplikacija teče na `http://localhost:5173`.
