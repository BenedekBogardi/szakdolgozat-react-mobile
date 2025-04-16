# BrainBoost Mobil alkalmazás – Dokumentáció

Ez a dokumentáció bemutatja az alkalmazás telepítésének és használatának lépéseit fejlesztők és felhasználók számára.

A működést biztosító fontos lépések az alábbiak:

## 1. Fejlesztői dokumentáció

1. Installáljuk az npm mappát

   ```bash
   npm install
   ```
2. IP Címek átírása
   ```bash
   Az (auth) mappa file-jaiban (kivéve layout.tsx) minden "0.0.0.0" átírása szükséges az aktuális IPv4 címre.
   ```
   
3. Start the app

   ```bash
    npx expo start
   ```
   
4. Expo Go
   ```bash
   A programot az Expo Go mobilalkalmazáson keresztül lehet elindítani a QR kód(konzolon jelenik meg) vagy az URL("exp://...") segítségével.
   ```

5. Backend futtatása <br>

   ALAPÉRTELMEZETT JELSZÓ (Az összes felhasználónak): alma
   
   1. Indítsd el a **XAMPP-on** az `Apache` és `MySQL` szervereket.
   2. Importáld az adatbázist a `PhPMyAdmin`-on belül.
   3. Klónozd a backend kódját:
      ```bash
      git clone https://github.com/BenedekBogardi/backend
      cd backend
      npm install
      ```
   4. Az adatbázis csatolva van, feltöltve. Amennyiben mégis probléma akadna:
      1. Hozz létre egy új adatbázist `teaching_website_db` néven a phpMyAdmin felületen.
      2. Az `npx prisma db push`, valamint `npx prisma db seed` parancsok segítségével már kész is a feltöltött adatbázis.
   5. Indítsd el a backend alkalmazást: `npm run start:dev`
   6. Teljes működés
      - A teljes működést csak több eszköz segítségével lehetséges szemléltetni. Ugyan lehet egy másik eszközként kezelve a mobilon kívül a PC is (localhost:8081-es címen), de mivel telefonra lett tervezve az alkalmazás, lehetséges, hogy nem fog hibátlanul működni.

## 2. Felhasználói dokumentáció

### 🔐 Bejelentkezés

- Írj be egy **érvényes e-mail címet** és **jelszót**.
- Az alkalmazásban **regisztráció nem elérhető**, csak a weboldalon keresztül történhet.
- A bejelentkezéshez kattints a **Bejelentkezés** gombra.

---

### 🏠 Főoldal

A főoldalon a beszélgetések **kártyák formájában** jelennek meg:

- Legfelül található a **csoportos csevegés**.
- Alatta jelennek meg a tanárhoz vagy diákhoz tartozó **privát beszélgetések**.
- Jobb felső sarokban egy **profil ikon** található, amelyre kattintva:
  - Megtekinthetők a felhasználó adatai.
  - Kijelentkezhetsz a **Kijelentkezés** gombbal.

---

### 💬 Chat felület

A beszélgetés megnyitásakor:

- Fent láthatók a **korábbi üzenetek**.
- Lent egy **szövegmező** jelenik meg új üzenetek írásához.

Belépéskor automatikusan megjelenik az üzenet:

Gépelés közben megjelenik a **küldés ikon**, amely:

- **Csak akkor látszik**, ha a szövegmező nem üres.
- **Eltűnik**, ha a szöveget törlöd vagy elküldöd az üzenetet.



