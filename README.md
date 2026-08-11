# Pilotech Toshiba — Site Jekyll + Tailwind (précompilé)

Site climatisation & pompes à chaleur Toshiba (distinct du site VMI).
CSS Tailwind précompilé (`assets/css/style.css`) + FontAwesome auto-hébergé. Zéro CDN.
Couleur de marque : primary #E31837 (rouge Toshiba).

## Recompiler le CSS (après ajout/modif de pages)
```
npm install
npm run css        # ou : npx tailwindcss -c tailwind.config.js -i src/input.css -o assets/css/style.css --minify
```
> Committer assets/css/style.css : GitHub Pages ne lance pas Tailwind.

## Publier : GitHub Pages (Deploy from branch main /root).
