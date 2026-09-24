export interface Vraag {
  vraag: string;
  antwoord: string;
}

export interface KamerPatient {
  id: string;
  naam: string;
  leeftijd: number;
  reden: string;
  briefing: string;
  vragen: Vraag[];
  /** Wat de dokter hardop tegen de patiënt zegt. */
  dokterZin: string;
  /** Wat de agent intussen afhandelt. */
  beleid: string[];
}

export const KAMER: KamerPatient[] = [
  {
    id: "hendriks",
    naam: "J. Hendriks",
    leeftijd: 61,
    reden: "Bloeddrukcontrole",
    briefing:
      "Hendriks. Thuismetingen 138 over 84, amlodipine 5, lab normaal. Doel: kort contact, tensie, relatie. Geen medicatiewijziging voorbereid.",
    vragen: [
      {
        vraag: "Wat was zijn nierfunctie?",
        antwoord: "eGFR 78, vorige maand. Stabiel over drie jaar. Kalium 4,1. Geen reden tot zorg.",
      },
      {
        vraag: "Mag ik de amlodipine ophogen?",
        antwoord:
          "Kan veilig naar 10 milligram. Maar met 138 over 84 zit hij binnen streefwaarde. Ik zou het laten.",
      },
      {
        vraag: "Heeft hij orthostase gemeten?",
        antwoord: "Ja, twee keer thuis. Geen daling van betekenis. Hij noemt wel lichte enkeloedeem 's avonds.",
      },
      {
        vraag: "Wanneer zag ik hem voor het laatst?",
        antwoord: "Zeven maanden geleden. Toen 146 over 90. Sindsdien alleen thuismetingen en één receptronde.",
      },
    ],
    dokterZin: "Het gaat goed, we houden de medicatie gelijk, tot volgend jaar.",
    beleid: [
      "Dossier bijgewerkt.",
      "Volgende controle over 12 maanden klaargezet.",
      "Geen recept nodig.",
      "Patiëntinfo bloeddruk nagezonden.",
    ],
  },
  {
    id: "meijer",
    naam: "P. Meijer",
    leeftijd: 51,
    reden: "Aanhoudende buikklachten",
    briefing:
      "Meijer, 51. Aanhoudende buikklachten na een volledig autonoom voortraject. Lab, ontlasting en echo zonder verklaring. Dit is geen protocol meer. Dit is jouw tijd: een mens die het verhaal hoort.",
    vragen: [
      { vraag: "Wat is er al uitgesloten?", antwoord: "Coeliakie, IBD via calprotectine, anemie, lever- en pancreasenzymen, echo abdomen. Alles negatief." },
      { vraag: "Is hij afgevallen?", antwoord: "Vier kilo in vijf maanden, geleidelijk. Geen nachtelijke klachten, geen bloed." },
      { vraag: "Wat weet je over zijn context?", antwoord: "Reorganisatie op het werk sinds februari, slaapt slecht. Hij bracht dat zelf niet ter sprake bij mij." },
      { vraag: "Wat zou een verwijzing opleveren?", antwoord: "MDL-poli heeft 9 weken wachttijd en geen duidelijke vraagstelling. Ik zou eerst jouw beoordeling afwachten." },
    ],
    dokterZin: "Ik snap dat dit lang duurt. Ik wil je over drie weken opnieuw zien, met de tijd ervoor.",
    beleid: [
      "Dossier bijgewerkt met het verhaal, niet alleen de uitslagen.",
      "Dubbel consult over 3 weken bij jou klaargezet.",
      "Verwijzing MDL blijft klaarstaan, niet verstuurd.",
      "Proefbehandeling voorbereid, wacht op jouw akkoord.",
    ],
  },
  {
    id: "peters",
    naam: "L. Peters",
    leeftijd: 56,
    reden: "Duizeligheid bij omdraaien",
    briefing:
      "Peters, 56. Duizeligheid bij omdraaien in bed, seconden kort. Past bij BPPD. Geen neurologische alarmsymptomen, geen nieuwe medicatie. Jij doet de Dix-Hallpike. Ik luister mee.",
    vragen: [
      { vraag: "Zijn er alarmsymptomen?", antwoord: "Nee. Geen gehoorverlies, geen dubbelzien, geen hoofdpijn, geen uitval." },
      { vraag: "Welke medicatie gebruikt zij?", antwoord: "Alleen levothyroxine 75. TSH drie weken geleden normaal." },
      { vraag: "Hoe lang duurt het al?", antwoord: "Elf dagen. Duidelijk positiekgebonden, nooit langer dan een halve minuut." },
      { vraag: "Wat is de volgende stap als Epley niet helpt?", antwoord: "Herhalen na een week, dan pas vestibulair onderzoek. Ik houd dat pad klaar." },
    ],
    dokterZin: "We doen nu die kanteloefening, daarna oefen je hem thuis een week.",
    beleid: [
      "Dossier bijgewerkt: Dix-Hallpike positief rechts.",
      "Epley-instructie met filmpje nagezonden.",
      "Controle over 7 dagen klaargezet.",
      "Geen recept nodig.",
    ],
  },
  {
    id: "mulder",
    naam: "K. Mulder",
    leeftijd: 29,
    reden: "Hoest, drie weken",
    briefing: "Mulder, 29. Drie weken hoest, geen koorts, niet ziek. Roker. Kort contact. Ik luister mee.",
    vragen: [
      { vraag: "Is er koorts geweest?", antwoord: "Twee dagen, in week één, tot 38,2. Sindsdien niet meer." },
      { vraag: "Rookt hij nog?", antwoord: "Twaalf per dag. Hij gaf vorige maand aan te willen minderen." },
      { vraag: "Is een thoraxfoto zinvol?", antwoord: "Niet bij dit beeld. Bij aanhouden na zes weken wel — dat pad staat klaar." },
    ],
    dokterZin: "Dit trekt weg. Kom terug als het over drie weken nog niet beter is.",
    beleid: [
      "Dossier bijgewerkt.",
      "Vangnet over 3 weken klaargezet.",
      "Geen recept nodig.",
      "Uitnodiging stoppen-met-roken gaat vanavond uit.",
    ],
  },
  {
    id: "devries",
    naam: "M. de Vries",
    leeftijd: 68,
    reden: "Presyncope bij inspanning",
    briefing:
      "De Vries, 68. Bijna-flauwvallen bij inspanning, twee keer deze maand. Dit is bewust niet geautomatiseerd: inspanningsgebonden presyncope hoort bij een dokter. Ik heb de cardioloog-verwijzing klaarstaan, maar verzend niets zonder jou.",
    vragen: [
      { vraag: "Is er een souffle bekend?", antwoord: "Twee jaar geleden genoteerd als zacht systolisch. Nooit nader onderzocht." },
      { vraag: "Wat liet het ECG zien?", antwoord: "Sinusritme, linkerventrikelhypertrofie-criteria positief. Vanochtend gemaakt door de assistente." },
      { vraag: "Familieanamnese?", antwoord: "Broer overleed op 58-jarige leeftijd, plotseling, oorzaak onbekend." },
      { vraag: "Hoe snel kan zij bij de cardioloog terecht?", antwoord: "Spoedpoli morgenochtend 09:20. Ik houd die plek vast tot jij besluit." },
    ],
    dokterZin: "Dit wil ik door de cardioloog laten zien, morgenochtend al. Tot die tijd rustig aan.",
    beleid: [
      "Dossier bijgewerkt: inspanningsgebonden presyncope.",
      "Verwijzing cardiologie verstuurd met ECG.",
      "Spoedpoli morgen 09:20 bevestigd.",
      "Inspanningsadvies naar haar telefoon gestuurd.",
    ],
  },
];
