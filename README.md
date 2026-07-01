# KVIFF 60 — festivalový průvodce (PWA)

Osobní plánovač filmů, přesunů mezi kiny a okolí na festivalu v Karlových Varech.
Vite + React + PWA. Data jsou zatím napevno (program 8.–11. 7.), ukládání běží přes `localStorage` (per zařízení).

## Spuštění lokálně
```bash
npm install
npm run dev        # vývoj na http://localhost:5173
npm run build      # produkční build do dist/
npm run preview    # náhled buildu
```

## Nasazení na Vercel (nejjednodušší cesta)
1. Nahraj tuto složku do nového Git repozitáře (GitHub/GitLab).
2. Na vercel.com → **Add New… → Project** → vyber repozitář.
3. Vercel sám detekuje **Vite**. Nech výchozí:
   - Build Command: `vite build` (nebo `npm run build`)
   - Output Directory: `dist`
4. **Deploy** → dostaneš veřejnou URL.

Alternativně přes CLI:
```bash
npm i -g vercel
vercel            # první deploy (preview)
vercel --prod     # produkční nasazení
```

## Přidání na plochu telefonu (PWA)
- **iPhone (Safari):** Sdílet → *Přidat na plochu*.
- **Android (Chrome):** menu ⋮ → *Přidat na plochu / Nainstalovat aplikaci*.
Appka pak jede na celou obrazovku a funguje i offline (po prvním načtení).

## Co je „live" a co ne
- Hosting + offline PWA: ✅ ostré.
- Program filmů, doprovodný program, otevírací doby podniků: zatím **statická data** v `src/App.jsx`.
  Druhá fáze = scraper/ETL, který je bude aktualizovat do databáze.

## Struktura
```
index.html            # PWA meta tagy
vite.config.js        # Vite + vite-plugin-pwa (manifest, service worker)
src/main.jsx          # vstupní bod Reactu
src/App.jsx           # celá aplikace (UI + data)
public/icon-*.png     # ikony aplikace
```
