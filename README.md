# DokterTijd

**Dokterstijd alleen waar een dokter nodig is.**

Fictieve hackathondemo van een huisartsenpraktijk met 5.000 patiënten waarin AI
alles afhandelt wat geen dokter nodig heeft. Er zijn geen echte patiëntgegevens
in deze app.

## Pagina's

| Route | Wat je ziet |
| --- | --- |
| `/` | **Spreekkamer** – muurprojectie voor de spreekkamer, bediend met je stem. Geen toetsenbord, geen dossier. |
| `/werkdag` | **Mijn werkdag** – alleen de taken waarvoor een dokter nodig is, met SBAR-samenvatting per patiënt. |
| `/simuleer` | **Simuleer een dag** – een volledige huisartsendag in 2030 in twee minuten. |
| `/onder-water` | **Onder water** – alle zorg die nooit bij de dokter terechtkomt. |

De schakelaar **Volledig autonoom** in de kop verbergt taken die de AI zelf kan
afronden (fotobeoordelingen, korte overlegjes). De keuze wordt in de browser
onthouden.

De spreekkamer gebruikt de spraak-API's van de browser (`speechSynthesis` en
`SpeechRecognition`). Gebruik Chrome of Edge voor de volledige ervaring.

## Lokaal draaien

Vereist Node.js 22 of hoger.

```sh
npm install
npm run dev
```

Overige scripts:

```sh
npm run build     # productiebuild in .output/
npm run preview   # bekijk de productiebuild
npm run lint      # eslint
npm run format    # prettier
```

## Techniek

- [TanStack Start](https://tanstack.com/start) met file-based routing in `src/routes/`
- React 19, TypeScript
- Tailwind CSS 4 met shadcn/ui-componenten in `src/components/ui/`
- Demodata en logica in `src/lib/`

Het project is oorspronkelijk gegenereerd met Lovable en wordt nu zelfstandig
onderhouden.
