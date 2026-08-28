# Filosofarti Fundraising

Sito statico per visualizzare l'avanzamento della raccolta fondi di Filosofarti 2027.

## Aggiornare i dati

Modifica `data/donations.json` e aggiorna questi campi principali:

- `raised`: importo raccolto.
- `supporters`: numero dei sostenitori.
- `latestSupporters`: ultime adesioni da mostrare.
- `businessSupporters`: vetrine o aziende aderenti.
- `questions`: domande adottate dai sostenitori.
- `words`: parole per il Libro e Muro del pensiero.
- `milestones`: soglie e traguardi.

Ogni posto nella platea rappresenta `seatValue` euro raccolti. Con l'obiettivo attuale di 11.000 euro e `seatValue` pari a 100 euro, la pagina mostra 110 posti simbolici.

## Anteprima locale

```bash
npm run serve
```

Poi apri `http://localhost:4173`.

Non aprire direttamente `index.html` con un indirizzo `file://`: alcuni browser bloccano il caricamento di `data/donations.json`. GitHub Pages e il server locale non hanno questo problema.

## Test

```bash
npm test
```

## Pubblicazione GitHub Pages

Il workflow `.github/workflows/pages.yml` pubblica il sito a ogni push su `main`.
Nel repository GitHub abilita Pages usando **GitHub Actions** come sorgente.
