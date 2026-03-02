# 📅 BookIt

## 1. Poslovni problem in namen sistema
BookIt je mikrostoritveni sistem za rezervacijo predefiniranih terminov pri različnih storitvah (npr. fitnes, zdravnik, frizer).

Namen sistema je uporabnikom omogočiti:
- prijavo v sistem prek Google računa,
- pregled razpoložljivih (predefiniranih) terminov,
- rezervacijo izbranega termina,
- preklic obstoječe rezervacije,
- prejem e-mail obvestila o rezervaciji ali preklicu.

Sistem je zasnovan kot spletna aplikacija, ki prek API-vmesnikov komunicira z zalednimi mikrostoritvami.
<br/><br/>

## 2. Glavne domene in mikrostoritve

| Domena / mikrostoritev | Odgovornosti |
|:----------------------|:-------------|
| **Upravljanje uporabnikov** | <ul><li>preverjanje identitete uporabnika prek zunanjega ponudnika (Google),</li><li>povezava Google identitete z internim uporabnikom sistema BookIt,</li><li>vodenje osnovnih podatkov o uporabniku (e-mail, ime).</li></ul> |
| **Upravljanje terminov** | <ul><li>hranjenje in objava predefiniranih terminov,</li><li>omogočanje pregleda in izbire terminov,</li><li>ustvarjanje in preklic rezervacij za izbrane termine,</li><li>zagotavljanje, da je posamezen termin lahko rezerviran največ enkrat.</li></ul> |
| **Obveščanje uporabnikov** | <ul><li>pošiljanje e-mail obvestil ob uspešni rezervaciji,</li><li>pošiljanje e-mail obvestil ob preklicu rezervacije.</li></ul> |
| **Uporabniški vmesnik** | <ul><li>prijava uporabnika prek Google prijave,</li><li>prikaz razpoložljivih terminov,</li><li>omogočanje rezervacije in preklica terminov,</li><li>komunikacija z mikrostoritvami prek API-jev.</li></ul> |

## 3. Arhitektura sistema
![Arhitekturni diagram](https://github.com/user-attachments/assets/4876ef7d-8c82-41e1-aa52-4fe6b83f5b0e)


## 4. Navodila za zagon
