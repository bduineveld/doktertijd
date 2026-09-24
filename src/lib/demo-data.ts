export type TaskKind =
  | "fysiek"
  | "video"
  | "telefoon"
  | "visite"
  | "beslissing"
  | "foto"
  | "slechtnieuws"
  | "pauze";

export type Bucket = "nu" | "uur" | "ochtend" | "middag" | "wacht";

export interface Choice {
  label: string;
  gevolg: string;
}

export interface Task {
  id: string;
  naam: string;
  leeftijd?: number;
  titel: string;
  sub: string;
  kind: TaskKind;
  duur: string;
  bucket: Bucket;
  mensNodig?: boolean;
  urgent?: boolean;
  waaromJij: string;
  sbar?: { s: string; b: string; a: string; r: string };
  choices?: Choice[];
  contact?: { doel: string; punten: string[]; startLabel: string };
  briefing?: { kop: string; tekst: string }[];
  voorbereid?: string[];
}

export const KIND_LABEL: Record<TaskKind, string> = {
  fysiek: "Fysiek consult",
  video: "Videoconsult",
  telefoon: "Telefonisch",
  visite: "Visite",
  beslissing: "Beslissing nodig",
  foto: "Beoordeling foto",
  slechtnieuws: "Slechtnieuwsgesprek",
  pauze: "Pauze",
};

const auto6 = "1 beslissing → 6 acties automatisch uitgevoerd";
export const MICRO_TOAST = auto6;

export const TASKS: Task[] = [
  {
    id: "hassan",
    naam: "I. Hassan",
    leeftijd: 33,
    titel: "Belt over dochter van 2 jaar met koorts",
    sub: "Derde dag koorts, drinkt goed, geen alarmsymptomen bij triage",
    kind: "telefoon",
    duur: "4 min",
    bucket: "nu",
    waaromJij:
      "De triage-agent vindt geen alarmsymptomen, maar moeder is ongerust en vroeg expliciet om een dokter. Geruststelling bij een jong kind is mensenwerk — en jij bepaalt of expectatief verantwoord is.",
    sbar: {
      s: "Meisje van 2 jaar, dag 3 koorts tot 39,4 °C, verder alert en drinkt voldoende.",
      b: "Volledig gevaccineerd, geen onderliggend lijden, geen recente reis. Broertje had vorige week een virale bovensteluchtweginfectie.",
      a: "Beeld past bij een virale infectie. Geen petechiën, geen nekstijfheid, normale diurese volgens moeder. Ongerustheid van moeder is de belangrijkste factor.",
      r: "Telefonisch expectatief met duidelijke vangnetinstructies lijkt passend.",
    },
    contact: {
      doel: "Ongerustheid wegen, vangnet expliciet maken, samen beslissen.",
      punten: [
        "Vraag naar drinken, plassen, alertheid en huidvlekjes",
        "Benoem wat je wél verwacht bij een virale infectie",
        "Geef een concreet vangnet: wanneer terugbellen, wanneer direct",
        "Vraag wat moeder zelf het meest vreest",
      ],
      startLabel: "Patiënt bellen",
    },
    choices: [
      { label: "Telefonisch expectatief", gevolg: "Vangnetbrief verstuurd, terugbelmoment over 24 uur ingepland." },
      { label: "Vandaag beoordelen", gevolg: "Fysieke afspraak 13:40 ingepland, ouders geïnformeerd." },
      { label: "Insturen SEH", gevolg: "Kinderarts gebeld, verwijsbrief en overdracht verzonden." },
    ],
  },
  {
    id: "jansen",
    naam: "S. Jansen",
    leeftijd: 34,
    titel: "Buikpijn 3 dagen",
    sub: "Zelftriage + gestructureerde uitvraag door agent afgerond",
    kind: "beslissing",
    duur: "30 sec",
    bucket: "nu",
    waaromJij:
      "De agent kan het beleid niet zelfstandig kiezen: het klachtenbeeld zit precies op de grens tussen afwachten en aanvullend onderzoek. Jouw afweging ontbreekt nog in het delegatieprofiel.",
    sbar: {
      s: "Vrouw 34 jaar, 3 dagen diffuse buikpijn, geen koorts, normale ontlasting.",
      b: "Geen voorgeschiedenis, geen medicatie, zwangerschapstest negatief (thuis, geverifieerd).",
      a: "Geen peritoneale prikkeling volgens gestructureerde uitvraag, geen alarmsymptomen. Lage kans op acute pathologie.",
      r: "Expectatief met controle over 48 uur is verdedigbaar.",
    },
    choices: [
      { label: "Expectatief beleid", gevolg: "Controlemoment over 48 uur en zelfmonitoring geactiveerd." },
      { label: "CRP laten prikken", gevolg: "Labaanvraag verstuurd, prikafspraak vanmiddag." },
      { label: "Vandaag zelf beoordelen", gevolg: "Consult 15:45 ingepland." },
    ],
  },
  {
    id: "hendriks",
    naam: "J. Hendriks",
    leeftijd: 61,
    titel: "Fysieke bloeddrukcontrole",
    sub: "Administratie, metingen en medicatieoverzicht al voorbereid",
    kind: "fysiek",
    duur: "15 min",
    bucket: "uur",
    waaromJij:
      "Je moet hem zien: hypertensie met eerder orthostatische klachten en een aanpassing die je fysiek wilt beoordelen. Alle administratie is al gedaan.",
    sbar: {
      s: "Man 61 jaar, halfjaarlijkse controle hypertensie.",
      b: "Enalapril 10 mg, thuismetingen gemiddeld 148/88 over 3 weken.",
      a: "Onvoldoende gereguleerd, eerder duizeligheid bij opstaan. Nierfunctie en kalium stabiel.",
      r: "Fysieke beoordeling inclusief staande RR, daarna medicatiebesluit.",
    },
    contact: {
      doel: "Staande en liggende bloeddruk meten en samen het vervolg bepalen.",
      punten: [
        "Meet liggend en na 1 en 3 minuten staan",
        "Bespreek therapietrouw en zoutinname",
        "Weeg bijwerkingen tegen streefwaarde",
      ],
      startLabel: "Consult starten",
    },
  },
  {
    id: "devries",
    naam: "M. de Vries",
    leeftijd: 68,
    titel: "Inspanningsgebonden presyncope",
    sub: "Agent markeerde dit direct als niet-delegeerbaar",
    kind: "fysiek",
    duur: "20 min",
    bucket: "uur",
    mensNodig: true,
    waaromJij:
      "Bijna-wegrakingen bij inspanning kunnen cardiaal zijn. Dit vraagt anamnese, auscultatie en jouw klinische blik — geen enkel protocol vangt dit veilig af.",
    sbar: {
      s: "Vrouw 68 jaar, tweemaal bijna-wegraking tijdens fietsen, afgelopen 10 dagen.",
      b: "Geen cardiale voorgeschiedenis, geen medicatie met bradycardie-risico.",
      a: "Inspanningsgebonden presyncope is een rode vlag: denk aan aortaklepstenose of ritmestoornis.",
      r: "Fysieke beoordeling met auscultatie en ECG; laagdrempelig cardiologie.",
    },
    contact: {
      doel: "Cardiale oorzaak uitsluiten of juist versnellen.",
      punten: [
        "Exacte omstandigheden van beide episodes",
        "Ausculteer op souffle, beoordeel pulsaties",
        "ECG staat klaar in de kamer",
        "Bespreek fietsverbod tot uitsluiting",
      ],
      startLabel: "Consult starten",
    },
  },
  {
    id: "vos",
    naam: "E. Vos",
    leeftijd: 63,
    titel: "Aanhoudend hoge bloeddruk — amlodipine 5 → 10 mg?",
    sub: "Thuismetingen 6 weken, agent heeft alles geverifieerd",
    kind: "beslissing",
    duur: "30 sec",
    bucket: "uur",
    waaromJij:
      "Dosisverhoging valt buiten het huidige delegatieprofiel. De agent heeft metingen, nierfunctie en interacties al gecontroleerd; alleen jouw akkoord ontbreekt.",
    sbar: {
      s: "Vrouw 63 jaar, thuismetingen gemiddeld 152/92 over 6 weken.",
      b: "Amlodipine 5 mg, goede therapietrouw (uitgiftedata gecontroleerd), geen oedeem gemeld.",
      a: "Onvoldoende regulatie bij goede therapietrouw. eGFR 78, kalium 4,1.",
      r: "Amlodipine ophogen naar 10 mg met controle over 4 weken.",
    },
    choices: [
      { label: "Ophogen naar 10 mg", gevolg: "Recept, patiëntbrief, controle over 4 weken en enkeloedeem-monitoring geregeld." },
      { label: "Tweede middel toevoegen", gevolg: "Voorstel hydrochloorthiazide voorbereid met lab-controle." },
      { label: "Eerst 24-uursmeting", gevolg: "24-uursmeting aangevraagd voor volgende week." },
    ],
  },
  {
    id: "vandijk",
    naam: "T. van Dijk",
    leeftijd: 71,
    titel: "Cardiologenbrief verwerkt — alleen losartan 50 → 100 mg resteert",
    sub: "Brief gelezen, dossier bijgewerkt, controles ingepland",
    kind: "beslissing",
    duur: "30 sec",
    bucket: "ochtend",
    waaromJij:
      "De hele brief is al verwerkt: diagnose, controles en labaanvragen staan klaar. Er resteert één medicamenteuze keuze die het profiel niet zelfstandig neemt.",
    sbar: {
      s: "Man 71 jaar, poliklinische controle hartfalen met verminderde ejectiefractie.",
      b: "Cardioloog adviseert optimaliseren RAS-remming; losartan nu 50 mg.",
      a: "Bloeddruk 132/78, eGFR 64, kalium 4,4. Ruimte voor ophogen.",
      r: "Losartan naar 100 mg met lab-controle over 2 weken.",
    },
    choices: [
      { label: "Ophogen naar 100 mg", gevolg: "Recept klaar, lab over 2 weken, cardioloog teruggekoppeld." },
      { label: "Huidige dosis handhaven", gevolg: "Cardioloog geïnformeerd met motivatie, controle over 3 maanden." },
      { label: "Overleg cardioloog", gevolg: "Beveiligd consultatieverzoek verstuurd." },
    ],
  },
  {
    id: "deboer",
    naam: "F. de Boer",
    leeftijd: 44,
    titel: "Prednison bij milde astma-exacerbatie?",
    sub: "Nieuwe situatie — onvoldoende vergelijkbare voorbeelden in je profiel",
    kind: "beslissing",
    duur: "1 min",
    bucket: "ochtend",
    waaromJij:
      "Het delegatieprofiel kent te weinig vergelijkbare gevallen om dit zelfstandig te doen. De agent vraagt bewust jouw oordeel in plaats van te gokken.",
    sbar: {
      s: "Man 44 jaar, 4 dagen toegenomen benauwdheid en nachtelijke hoest.",
      b: "Milde astma, ICS-formoterol onderhoud, piekstroom 82% van persoonlijk beste.",
      a: "Milde exacerbatie zonder tekenen van infectie, saturatie 97%.",
      r: "Twijfel tussen intensiveren onderhoud of korte prednisonkuur.",
    },
    choices: [
      { label: "Prednison 5 dagen", gevolg: "Recept, instructie en controlebelafspraak dag 3 geregeld." },
      { label: "Onderhoud intensiveren", gevolg: "Doseerschema aangepast, monitoring piekstroom geactiveerd." },
      { label: "Vandaag telefonisch nabellen", gevolg: "Belafspraak 16:20 ingepland." },
    ],
  },
  {
    id: "peters",
    naam: "L. Peters",
    leeftijd: 56,
    titel: "Video — duizeligheid",
    sub: "Anamnese wijst richting BPPD, Dix-Hallpike-uitleg voorbereid",
    kind: "video",
    duur: "5 min",
    bucket: "ochtend",
    waaromJij:
      "De agent kan de manoeuvre niet uitvoeren of beoordelen. Jij kijkt mee met de oogbewegingen en instrueert de Epley-manoeuvre.",
    sbar: {
      s: "Vrouw 56 jaar, kortdurende draaiduizeligheid bij omdraaien in bed.",
      b: "Geen gehoorverlies, geen neurologische uitval, geen nieuwe medicatie.",
      a: "Klassiek beeld BPPD, lage kans op centrale oorzaak.",
      r: "Video-instructie Epley-manoeuvre, controle over 1 week.",
    },
    contact: {
      doel: "Beeld bevestigen en de Epley-manoeuvre uitleggen.",
      punten: [
        "Laat haar de uitlokkende beweging voordoen",
        "Let op nystagmus in beeld",
        "Doe de manoeuvre stap voor stap voor",
        "Bespreek wanneer het juist géén BPPD is",
      ],
      startLabel: "Videoconsult starten",
    },
  },
  {
    id: "bakker",
    naam: "A. Bakker",
    leeftijd: 42,
    titel: "Foto huidafwijking — ABCDE voorbereid",
    sub: "Beeldanalyse en vergelijking met foto van 8 maanden geleden klaar",
    kind: "foto",
    duur: "1 min",
    bucket: "ochtend",
    waaromJij:
      "Beeldbeoordeling met twijfel over asymmetrie blijft dokterswerk. De voorbereiding is gedaan; jij geeft het eindoordeel.",
    sbar: {
      s: "Man 42 jaar, laesie rug, sinds enkele maanden iets donkerder volgens patiënt.",
      b: "Geen melanoom in de familie, huidtype II, geen zonnebankgebruik.",
      a: "ABCDE: asymmetrie twijfelachtig, begrenzing scherp, kleur homogeen bruin, diameter 5 mm, vergelijking toont geen groei.",
      r: "Geruststellen met fotocontrole over 3 maanden lijkt passend.",
    },
    choices: [
      { label: "Geruststellen + fotocontrole", gevolg: "Fotocontrole over 3 maanden ingepland, uitleg verstuurd." },
      { label: "Verwijzen dermatologie", gevolg: "Verwijzing met beeld klaargezet en verzonden." },
      { label: "Fysiek zien", gevolg: "Afspraak met dermatoscoop ingepland." },
    ],
  },
  {
    id: "kuipers",
    naam: "B. Kuipers",
    leeftijd: 47,
    titel: "Wil de dokter horen over sertraline",
    sub: "Zes weken in behandeling, twijfelt of hij doorgaat",
    kind: "telefoon",
    duur: "8 min",
    bucket: "ochtend",
    mensNodig: true,
    waaromJij:
      "Hij vroeg expliciet om jouw stem. Doorzetten of stoppen met een antidepressivum is een gesprek over vertrouwen, niet over een protocol.",
    sbar: {
      s: "Man 47 jaar, sertraline 50 mg sinds 6 weken bij depressieve episode.",
      b: "Aanvankelijk misselijkheid, nu verdwenen. Slaap iets beter, stemming wisselend.",
      a: "Gedeeltelijke respons op week 6; vroegtijdig stoppen is het grootste risico.",
      r: "Gesprek over verwachtingen; volhouden, ophogen of afbouwen.",
    },
    contact: {
      doel: "Twijfel serieus nemen en samen een realistisch verwachtingspatroon maken.",
      punten: [
        "Vraag wat er sinds de start wél is veranderd",
        "Benoem het normale beloop: effect vaak pas week 6-8",
        "Bespreek bijwerkingen open, ook seksuele",
        "Maak samen een afspraak over het beslismoment",
      ],
      startLabel: "Patiënt bellen",
    },
    choices: [
      { label: "Volhouden huidige dosis", gevolg: "Belafspraak over 2 weken, stemmingsmonitoring geactiveerd." },
      { label: "Ophogen naar 100 mg", gevolg: "Recept, bijwerkingenuitleg en controle dag 7 geregeld." },
      { label: "Afbouwen in overleg", gevolg: "Afbouwschema klaargezet en POH-GGZ ingeschakeld." },
    ],
  },
  {
    id: "mulder",
    naam: "K. Mulder",
    leeftijd: 29,
    titel: "Video — hoest",
    sub: "Drie weken hoest na verkoudheid, geen alarmsymptomen",
    kind: "video",
    duur: "5 min",
    bucket: "middag",
    waaromJij:
      "Patiënt wil zelf een dokter spreken voor gerustelling. Kort contact volstaat; de agent heeft de uitvraag al gedaan.",
    sbar: {
      s: "Vrouw 29 jaar, 3 weken prikkelhoest na virale infectie.",
      b: "Niet-roker, geen astma, geen gewichtsverlies of nachtzweten.",
      a: "Postinfectieuze hoest, geen indicatie voor beeldvorming.",
      r: "Uitleg beloop, controle als klachten na 6 weken aanhouden.",
    },
    contact: {
      doel: "Geruststellen en het verwachte beloop uitleggen.",
      punten: ["Luister naar het hoestpatroon", "Vraag naar reflux en postnasal drip", "Benoem wanneer wél terugkomen"],
      startLabel: "Videoconsult starten",
    },
  },
  {
    id: "elamrani",
    naam: "H. El Amrani",
    leeftijd: 36,
    titel: "Mastitis dag 3, geeft borstvoeding",
    sub: "Antibiotica gestart door agent conform protocol, nu evaluatie",
    kind: "telefoon",
    duur: "5 min",
    bucket: "middag",
    waaromJij:
      "Dag 3 zonder duidelijke verbetering vraagt een klinische weging: doorgaan, zien of denken aan een abces. Dat oordeel delegeert het profiel niet.",
    sbar: {
      s: "Vrouw 36 jaar, mastitis links, dag 3 flucloxacilline, blijft koortsig 38,3 °C.",
      b: "Borstvoeding 7 weken, wil graag doorgaan met voeden.",
      a: "Trage respons. Onderscheid tussen traag herstel en abcesvorming is nu bepalend.",
      r: "Telefonisch beoordelen, laagdrempelig vandaag zien.",
    },
    contact: {
      doel: "Beloop wegen en borstvoeding veilig voortzetten.",
      punten: [
        "Vraag naar koortsbeloop, roodheid, pijnlijke zwelling",
        "Controleer of ze goed blijft aanleggen of kolven",
        "Bespreek pijnstilling die verenigbaar is met voeding",
        "Benoem alarmsymptomen voor abces",
      ],
      startLabel: "Patiënt bellen",
    },
    choices: [
      { label: "Thuis continueren", gevolg: "Kuur voortgezet, controlebelafspraak morgen 09:00." },
      { label: "Vandaag zien", gevolg: "Afspraak 15:20 ingepland, echografie stand-by." },
      { label: "Abces verdacht — echo", gevolg: "Spoedecho aangevraagd, chirurg vooraf geïnformeerd." },
    ],
  },
  {
    id: "meijer",
    naam: "P. Meijer",
    leeftijd: 51,
    titel: "Fysiek — aanhoudende buikklachten na autonoom voortraject",
    sub: "Lab, dieetadvies en twee controles al autonoom doorlopen",
    kind: "fysiek",
    duur: "25 min",
    bucket: "middag",
    mensNodig: true,
    waaromJij:
      "Het autonome traject is uitgeput: alles is gedaan wat protocollair kon. Nu is er een dokter nodig die het hele verhaal opnieuw weegt.",
    sbar: {
      s: "Man 51 jaar, 4 maanden wisselende buikklachten en moeheid.",
      b: "Lab tweemaal normaal, fecaal calprotectine licht verhoogd, dieetinterventie zonder effect.",
      a: "Onverklaarde persisterende klachten met licht afwijkend calprotectine. Aanvullende diagnostiek overwegen.",
      r: "Volledig lichamelijk onderzoek en heroverweging van de differentiaaldiagnose.",
    },
    contact: {
      doel: "Het verhaal opnieuw uitvragen en een richting kiezen.",
      punten: [
        "Vraag naar het beloop in de eigen woorden van patiënt",
        "Volledig abdominaal onderzoek, inclusief rectaal toucher",
        "Weeg verwijzing MDL tegen herhaald calprotectine",
        "Bespreek zijn zorgen over wat het kan zijn",
      ],
      startLabel: "Consult starten",
    },
  },
  {
    id: "vermeer",
    naam: "R. Vermeer",
    leeftijd: 76,
    titel: "Visite — dyspneu en achteruitgang",
    sub: "Thuismonitoring toont gewichtstoename 2,4 kg in 5 dagen",
    kind: "visite",
    duur: "30 min",
    bucket: "middag",
    mensNodig: true,
    waaromJij:
      "Iemand moet hem thuis zien: de combinatie van gewichtstoename, dyspneu en verminderde mobiliteit vraagt onderzoek én een gesprek over wat hij nog wil.",
    sbar: {
      s: "Man 76 jaar, hartfalen, toenemende kortademigheid en minder mobiel.",
      b: "Furosemide 40 mg, woont alleen, mantelzorg door dochter.",
      a: "Beeld past bij decompensatie. Ook zorgen over zelfredzaamheid thuis.",
      r: "Visite met onderzoek, diureticabeleid en gesprek over behandelwensen.",
    },
    contact: {
      doel: "Decompensatie beoordelen en thuissituatie wegen.",
      punten: [
        "Beoordeel CVD, crepitaties, enkeloedeem",
        "Kijk rond: trap, bed, eten, medicatiedoos",
        "Bespreek behandelwensen en ziekenhuisopname",
        "Betrek de dochter als hij dat wil",
      ],
      startLabel: "Vertrekken",
    },
  },
  {
    id: "smit",
    naam: "N. Smit",
    leeftijd: 49,
    titel: "Afwijkende PA-uitslag bespreken",
    sub: "Melanoma in situ · extra tijd beschermd · niet geautomatiseerd",
    kind: "slechtnieuws",
    duur: "30 min",
    bucket: "middag",
    mensNodig: true,
    urgent: false,
    waaromJij:
      "Dit is geen uitslag die een systeem mag brengen. Jij nam het biopt, jij kent haar, en dit gesprek bepaalt hoe zij de komende weken ingaat. Geen enkel deel hiervan is geautomatiseerd.",
    briefing: [
      {
        kop: "Actuele status",
        tekst: "Uitslag binnen 2 dagen geleden. Zij weet dat er een uitslag komt en dat jij haar belt of ziet. Ze heeft nog niets gehoord over de inhoud — bewust niet via portaal vrijgegeven.",
      },
      {
        kop: "Wie zag haar het laatst",
        tekst: "Jij, 11 dagen geleden. Je nam zelf het stansbiopt tijdens dat consult.",
      },
      {
        kop: "Waarom het biopt werd genomen",
        tekst: "Atypische naevus linker schouderblad: recente kleurverandering, jeuk, en bij dermatoscopie een atypisch netwerk met onregelmatige globuli. Alleen een foto was onvoldoende — daarom fysiek gezien en direct gebiopteerd.",
      },
      {
        kop: "Wat de PA toont",
        tekst: "Melanoma in situ (Clark-niveau I, geen invasie). Radicaliteit krap: kleinste marge 1 mm. Geen ulceratie, geen mitosen in het beoordeelde materiaal.",
      },
      {
        kop: "Behandelplan",
        tekst: "Re-excisie met ruimere marge door dermatologie. Verwijzing is volledig opgesteld met beeld, PA-verslag en jouw bevindingen — bewust nog níét verzonden, zodat jij dit eerst met haar bespreekt.",
      },
      {
        kop: "Praktisch",
        tekst: "Extra tijd is beschermd; de agenda erna is bewust leeg gehouden. Haar partner kan telefonisch aansluiten — zij gaf eerder aan dat op prijs te stellen.",
      },
    ],
    voorbereid: [
      "Het woord melanoom benoemen, niet verhullen",
      "Uitleggen wat 'in situ' betekent: nog geen uitzaaiingsrisico",
      "Benoemen dat de marge krap was en waarom re-excisie nodig is",
      "Ruimte laten voor stilte — niet doorpraten",
      "Vragen wat zij nu het meest nodig heeft",
      "Afspreken wie ze belt als het vannacht niet gaat",
    ],
    contact: {
      doel: "Een afwijkende PA-uitslag brengen, begrijpelijk maken en samen het vervolg vastleggen.",
      punten: [
        "Vraag eerst wat zij zelf al vermoedt",
        "Breng de uitslag in één heldere zin",
        "Laat stilte vallen",
        "Leg 'in situ' en de krappe marge uit",
        "Bespreek de re-excisie en het tijdpad",
        "Vraag wie er vanavond bij haar is",
      ],
      startLabel: "Gesprek starten",
    },
  },
  {
    id: "visser-dochter",
    naam: "Dochter van H. Visser",
    titel: "Bellen na overlijden vannacht",
    sub: "Vader thuis overleden, HAP is bij de familie geweest",
    kind: "telefoon",
    duur: "15 min",
    bucket: "middag",
    mensNodig: true,
    waaromJij:
      "Dit gesprek automatiseer ik niet. Je kende meneer Visser jaren; zijn dochter hoort jouw stem, niet een bericht. Alleen het tijdstip is voor je klaargezet.",
    sbar: {
      s: "H. Visser, 71 jaar, vannacht thuis overleden. Dochter is eerste contactpersoon.",
      b: "Bekend met gevorderd COPD en hartfalen. Jij zag hem 3 weken geleden; behandelwensen waren toen vastgelegd: thuis blijven, geen opname.",
      a: "Huisartsenpost is ter plaatse geweest, natuurlijke dood vastgesteld, verklaring afgegeven. Familie was aanwezig bij het overlijden.",
      r: "Persoonlijk condoleancegesprek met de dochter, ruimte voor vragen over het beloop en aanbod van nazorg.",
    },
    contact: {
      doel: "Condoleren, het beloop van de laatste nacht samen doornemen en nazorg aanbieden.",
      punten: [
        "Begin met condoleren, niet met uitleg",
        "Vraag hoe de laatste nacht is gegaan in haar woorden",
        "Leg uit wat de huisartsenpost heeft gedaan en waarom",
        "Bied een nagesprek aan over enkele weken",
        "Vraag hoe het met haarzelf gaat en wie er nu bij haar is",
      ],
      startLabel: "Dochter bellen",
    },
  },
  {
    id: "bos",
    naam: "G. Bos",
    leeftijd: 83,
    titel: "Acute verwardheid thuis",
    sub: "Thuiszorg meldt acute verandering — agent escaleert direct",
    kind: "visite",
    duur: "20 min",
    bucket: "wacht",
    urgent: true,
    mensNodig: true,
    waaromJij:
      "Acuut delier bij een kwetsbare oudere vraagt onmiddellijk een dokter ter plaatse. De agent heeft dit uit zichzelf naar de top van je dag geschoven.",
    sbar: {
      s: "Man 83 jaar, sinds vanochtend acuut verward en onrustig.",
      b: "Woont thuis met thuiszorg, bekend met milde cognitieve stoornis, recent start oxybutynine.",
      a: "Acuut delier, mogelijk medicamenteus of door urineweginfectie. Kwetsbare oudere.",
      r: "Directe visite met onderzoek en urineonderzoek; oxybutynine heroverwegen.",
    },
    contact: {
      doel: "Oorzaak van het delier vinden en veiligheid thuis borgen.",
      punten: [
        "Meet temperatuur, saturatie, bloeddruk",
        "Urinestick — materiaal ligt klaar",
        "Loop de medicatiewijzigingen van 10 dagen na",
        "Bespreek toezicht vannacht met de dochter",
      ],
      startLabel: "Vertrekken",
    },
  },
];

export const TASKS_BY_ID: Record<string, Task> = Object.fromEntries(TASKS.map((t) => [t.id, t]));

export const BUCKETS: { key: Bucket; label: string }[] = [
  { key: "nu", label: "Nu" },
  { key: "uur", label: "Binnen een uur" },
  { key: "ochtend", label: "Deze ochtend" },
  { key: "middag", label: "Deze middag" },
  { key: "wacht", label: "Kan wachten" },
];

/* ---------------- Onder water ---------------- */

export type OWCat = "uitslagen" | "medicatie" | "populatie" | "correspondentie" | "afspraken" | "geleerd";

export interface OWEvent {
  id: string;
  min: number; // minutes since midnight
  cat: OWCat;
  titel: string;
  detail: string;
  nacht?: boolean;
  highlight?: boolean;
}

export const OW_CATS: { key: OWCat | "alles"; label: string }[] = [
  { key: "alles", label: "Alles" },
  { key: "uitslagen", label: "Uitslagen" },
  { key: "medicatie", label: "Medicatie" },
  { key: "populatie", label: "Populatie" },
  { key: "correspondentie", label: "Correspondentie" },
  { key: "afspraken", label: "Afspraken" },
  { key: "geleerd", label: "Geleerd beleid" },
];

const ow = (min: number, cat: OWCat, titel: string, detail: string, extra: Partial<OWEvent> = {}): OWEvent => ({
  id: `${min}-${titel}`.replace(/\s+/g, "-").toLowerCase(),
  min,
  cat,
  titel,
  detail,
  ...extra,
});

export const OW_EVENTS: OWEvent[] = [
  // nacht
  ow(1, "uitslagen", "41 labuitslagen beoordeeld en teruggekoppeld", "38 binnen referentie, 3 met afwijking; patiënten kregen uitleg in eigen taalniveau.", { nacht: true }),
  ow(35, "medicatie", "27 herhaalrecepten afgehandeld", "Interacties, nierfunctie en uitgifte-intervallen gecontroleerd; 2 tegengehouden voor overleg.", { nacht: true }),
  ow(122, "populatie", "Griepvaccinatie-uitnodigingen verstuurd aan 412 patiënten", "Risicoprofiel bepaald, uitnodiging en planlink verstuurd, no-show-risico meegewogen.", { nacht: true }),
  ow(204, "correspondentie", "19 specialistenbrieven verwerkt", "Diagnoses, medicatiewijzigingen en controles in dossier verwerkt; 1 brief naar de huisarts geëscaleerd.", { nacht: true }),
  ow(250, "afspraken", "34 afspraken gepland, verzet of geannuleerd", "Agenda geoptimaliseerd op reistijd, urgentie en voorkeur van de patiënt.", { nacht: true }),
  ow(168, "populatie", "Opname A. Groot doorgekregen van de SEH", "62 jaar, ingestuurd door de huisarts, opgenomen op de hartbewaking. Dossier bijgewerkt, huisarts geïnformeerd in de ochtendbriefing; geen actie nodig.", { nacht: true }),
  ow(233, "correspondentie", "Overlijden H. Visser verwerkt", "71 jaar, thuis overleden. HAP-verslag verwerkt, apotheek en thuiszorg geïnformeerd, lopende afspraken geannuleerd. Belafspraak met de dochter vanmiddag klaargezet voor de huisarts — bewust niet geautomatiseerd.", { nacht: true }),
  ow(291, "medicatie", "HAP-contact C. Prins (palliatief) verwerkt", "78 jaar, extra morfine gegeven, pijn onder controle. Medicatieschema bijgewerkt, thuiszorg afgestemd, geen visite nodig.", { nacht: true }),
  ow(310, "populatie", "Thuismonitoring hartfalen: 2 signalen opgepakt", "R. Vermeer: gewicht +2,4 kg in 5 dagen → visite ingepland bij de huisarts.", { nacht: true }),
  ow(388, "uitslagen", "Uitslag PA N. Smit afgeschermd", "Niet vrijgegeven via portaal; gemarkeerd als uitsluitend persoonlijk te bespreken door de huisarts.", { nacht: true }),
  ow(420, "medicatie", "Polyfarmacie-review bij 23 ouderen", "6 voorstellen tot deprescriptie voorbereid voor apotheker-overleg.", { nacht: true }),

  // dag
  ow(455, "afspraken", "Ochtendagenda opnieuw geordend", "Rekening gehouden met uitloop, reistijd visites en beschermde pauzes."),
  ow(468, "uitslagen", "9 urineonderzoeken afgehandeld", "3 ongecompliceerde cystitis: behandeling gestart volgens standaard, controle ingepland."),
  ow(482, "correspondentie", "Fysiotherapie-verslagen verwerkt bij 7 patiënten", "Behandeldoelen bijgewerkt, 1 traject verlengd in overleg met fysiotherapeut."),
  ow(497, "medicatie", "Vitamine D en ijzersuppletie herbeoordeeld", "11 patiënten: 4 gestopt na normale controle, 7 voortgezet."),
  ow(512, "populatie", "Diabetescontroles: 63 patiënten automatisch doorlopen", "54 stabiel, 6 leefstijltraject, 3 doorgezet naar praktijkondersteuner."),
  ow(528, "uitslagen", "Uitslagen beeldvorming teruggekoppeld aan 5 patiënten", "Inclusief uitleg, vervolgstap en terugbeloptie."),
  ow(542, "correspondentie", "Verwijzing dermatologie A. Bakker verzonden", "Na besluit huisarts: beeld, anamnese en ABCDE-verslag meegestuurd — geen verdere handeling nodig."),
  ow(560, "afspraken", "11 patiënten herinnerd aan afspraak vandaag", "2 verzet op verzoek, plek direct opgevuld."),
  ow(575, "medicatie", "Antistollingscontroles afgehandeld", "8 patiënten binnen streefwaarde, 1 dosisaanpassing via trombosedienst."),
  ow(596, "populatie", "Stoppen-met-roken-traject: 19 deelnemers begeleid", "Terugvalrisico gesignaleerd bij 3; extra contactmoment ingepland."),
  ow(610, "uitslagen", "Schildklierfunctie 12 patiënten beoordeeld", "1 subklinische hypothyreoïdie: hercontrole over 3 maanden ingepland."),
  ow(640, "correspondentie", "Cardiologenbrief T. van Dijk volledig verwerkt", "Diagnose, controles en labaanvragen in dossier; alleen het medicatiebesluit voorgelegd aan de huisarts."),
  ow(672, "afspraken", "Middagagenda beschermd rond slechtnieuwsgesprek", "Twee slots vrijgehouden; niet-urgente vragen verplaatst."),
  ow(700, "populatie", "CVRM-populatie doorgerekend", "148 patiënten getoetst aan streefwaarden; 22 acties uitgevoerd zonder dokterstijd."),
  ow(752, "medicatie", "Maagbescherming heroverwogen bij 16 patiënten", "9 gestopt conform richtlijn, patiënten geïnformeerd."),
  ow(
    872,
    "geleerd",
    "Buikpijn 3 dagen (M., 29) zelfstandig afgehandeld",
    "Vergelijkbaar met S. Jansen vanochtend. Conform het vanochtend bijgewerkte delegatieprofiel: expectatief beleid, controle over 48 uur, vangnet verstuurd. Niet aan de huisarts voorgelegd.",
    { highlight: true },
  ),
  ow(880, "uitslagen", "Uitslagen ochtendlab teruggekoppeld", "26 patiënten geïnformeerd, 2 met vervolgafspraak."),
  ow(905, "populatie", "Valpreventie: 37 ouderen gescreend", "9 doorverwezen naar oefengroep, 3 woningaanpassing aangevraagd."),
  ow(930, "correspondentie", "Ziekenhuisontslagbrieven verwerkt (4)", "Medicatieverificatie uitgevoerd, thuiszorg geïnformeerd."),
  ow(968, "afspraken", "Morgen ingepland en gebalanceerd", "Visites geclusterd op wijk, ochtend bewust rustiger gehouden."),
  ow(1010, "medicatie", "Avondronde herhaalmedicatie", "31 recepten uitgezet, 1 doorgezet naar apotheker voor overleg."),
];

/* ---------------- Simulatie ---------------- */

export const DAY_START = 7 * 60 + 30; // 450
export const DAY_END = 17 * 60 + 15; // 1035
export const BASE_SECONDS = 120;

export interface Segment {
  start: number;
  end: number;
  taskId?: string;
  pauze?: { label: string; sub: string };
}

export interface SimTask {
  id: string;
  appear: number;
  bucket: Bucket;
}

export const SIM_TASKS: SimTask[] = [
  { id: "hendriks", appear: 450, bucket: "ochtend" },
  { id: "devries", appear: 450, bucket: "ochtend" },
  { id: "vos", appear: 452, bucket: "ochtend" },
  { id: "peters", appear: 455, bucket: "ochtend" },
  { id: "hassan", appear: 505, bucket: "uur" },
  { id: "deboer", appear: 512, bucket: "ochtend" },
  { id: "bakker", appear: 560, bucket: "ochtend" },
  { id: "jansen", appear: 578, bucket: "uur" },
  { id: "kuipers", appear: 600, bucket: "ochtend" },
  { id: "bos", appear: 668, bucket: "nu" },
  { id: "smit", appear: 452, bucket: "middag" },
  { id: "visser-dochter", appear: 450, bucket: "middag" },
  { id: "elamrani", appear: 820, bucket: "middag" },
  { id: "vandijk", appear: 700, bucket: "middag" },
  { id: "vermeer", appear: 700, bucket: "middag" },
  { id: "meijer", appear: 700, bucket: "middag" },
  { id: "mulder", appear: 860, bucket: "middag" },
];

export const SEGMENTS: Segment[] = [
  { start: 480, end: 495, taskId: "hendriks" },
  { start: 498, end: 518, taskId: "devries" },
  { start: 520, end: 521, taskId: "vos" },
  { start: 550, end: 552, taskId: "deboer" },
  { start: 555, end: 560, taskId: "peters" },
  { start: 565, end: 569, taskId: "hassan" },
  { start: 575, end: 576, taskId: "bakker" },
  { start: 605, end: 607, taskId: "jansen" },
  { start: 645, end: 655, pauze: { label: "☕ Koffie", sub: "10 minuten · beschermd" } },
  { start: 670, end: 690, taskId: "bos" },
  { start: 695, end: 703, taskId: "kuipers" },
  { start: 740, end: 770, pauze: { label: "🥪 Lunch", sub: "30 minuten · beschermd" } },
  { start: 785, end: 815, taskId: "smit" },
  { start: 858, end: 868, pauze: { label: "🌿 Even naar buiten", sub: "10 minuten · beschermd" } },
  { start: 875, end: 880, taskId: "elamrani" },
  { start: 885, end: 900, taskId: "visser-dochter" },
  { start: 910, end: 912, taskId: "vandijk" },
  { start: 920, end: 950, taskId: "vermeer" },
  { start: 960, end: 985, taskId: "meijer" },
  { start: 1005, end: 1010, taskId: "mulder" },
];

export interface IdleNote {
  from: number;
  kicker: string;
  titel: string;
  sub: string;
}

export const IDLE_NOTES: IdleNote[] = [
  { from: 450, kicker: "Geen patiëntcontact", titel: "De dag begint rustig", sub: "Vannacht zijn 38 gebeurtenissen al afgehandeld. Er ligt geen inbox." },
  { from: 495, kicker: "Geen patiëntcontact", titel: "Tussen twee contacten", sub: "Kort noteren, daarna door." },
  { from: 521, kicker: "Geen patiëntcontact", titel: "Ruimte in de ochtend", sub: "Eén beslissing van 30 seconden leverde zes automatische acties op." },
  { from: 576, kicker: "Geen patiëntcontact", titel: "Even laten zakken", sub: "De verwijzing na de fotobeoordeling loopt zelfstandig door." },
  { from: 607, kicker: "Geen patiëntcontact", titel: "Je loopt iets uit", sub: "De agenda is automatisch geherprioriteerd. Niet sneller werken — anders ordenen." },
  { from: 690, kicker: "Geen patiëntcontact", titel: "Na een acute visite", sub: "Verslag, thuiszorg en dochter zijn al geïnformeerd." },
  { from: 703, kicker: "Geen patiëntcontact", titel: "Ruimte tot de lunch", sub: "Bewust leeg gelaten." },
  { from: 770, kicker: "Geen patiëntcontact", titel: "Voorbereiding slechtnieuwsgesprek", sub: "De briefing staat klaar; de agenda erna is beschermd." },
  { from: 815, kicker: "Geen patiëntcontact", titel: "Na een zwaar gesprek", sub: "Geen nieuwe taken ingepland. Dit is met opzet stil." },
  { from: 868, kicker: "Geen patiëntcontact", titel: "Terug uit de buitenlucht", sub: "Een vergelijkbare buikpijncasus is zojuist zelfstandig afgehandeld." },
  { from: 912, kicker: "Geen patiëntcontact", titel: "Onderweg naar een visite", sub: "Route en dossier staan klaar op de tablet." },
  { from: 985, kicker: "Geen patiëntcontact", titel: "Laatste ronde", sub: "Nog één kort videoconsult." },
  { from: 1010, kicker: "Geen patiëntcontact", titel: "De dag is klaar", sub: "Geen inbox. Geen avondwerk. 5.214 patiënten kregen zorg." },
];

export interface Banner {
  from: number;
  to: number;
  tekst: string;
  sub?: string;
}

export const BANNERS: Banner[] = [
  { from: 521, to: 528, tekst: "1 beslissing → 6 acties automatisch uitgevoerd", sub: "E. Vos · amlodipine 10 mg" },
  { from: 582, to: 589, tekst: "Verwijzing dermatologie zelfstandig verzonden", sub: "A. Bakker · beeld en verslag meegestuurd" },
  { from: 607, to: 616, tekst: "Delegatieprofiel bijgewerkt", sub: "Buikpijn zonder alarmsymptomen: voortaan zelfstandig" },
  { from: 620, to: 628, tekst: "Je loopt uit — de dag is opnieuw geordend", sub: "Niet sneller werken. Anders prioriteren." },
  { from: 668, to: 676, tekst: "Urgent naar boven verplaatst", sub: "G. Bos · acute verwardheid thuis" },
  { from: 872, to: 884, tekst: "Zelfstandig afgehandeld dankzij nieuw delegatieprofiel", sub: "Vergelijkbare buikpijncasus kwam niet op jouw lijst" },
];

export const COUNTERS_START = { totaal: 38, autonoom: 31, geleerd: 4, anderen: 2, arts: 3 };
export const COUNTERS_END = { totaal: 312, autonoom: 263, geleerd: 60, anderen: 24, arts: 25 };

export function fmt(min: number) {
  const h = Math.floor(min / 60) % 24;
  const m = Math.floor(min % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/* -------- Volledig autonoom: onder-waterregels -------- */

export const MAX_DELEGATIE_EVENTS: OWEvent[] = [
  ow(
    535,
    "geleerd",
    "Foto huidafwijking A. Bakker zelfstandig beoordeeld",
    "ABCDE-analyse en vergelijking met eerdere beelden: onveranderd, laag risico. Patiënt gerustgesteld met uitleg en vangnetinstructie; hercontrole over 3 maanden ingepland. Niet aan de huisarts voorgelegd — maximale delegatie staat aan.",
  ),
  ow(
    548,
    "geleerd",
    "Buikpijn S. Jansen zelfstandig afgehandeld",
    "Geen alarmsymptomen, stabiel beeld. Expectatief beleid, controle over 48 uur, vangnet verstuurd.",
  ),
  ow(
    562,
    "medicatie",
    "Bloeddruk E. Vos: amlodipine 5 → 10 mg zelfstandig opgehoogd",
    "Thuismetingen aanhoudend boven streefwaarde, nierfunctie en interacties gecontroleerd. Recept uitgezet, controle over 2 weken ingepland.",
  ),
  ow(
    604,
    "geleerd",
    "Astma-exacerbatie F. de Boer: beleid zelfstandig bepaald",
    "Milde exacerbatie, geen prednison. Inhalatietechniek gecontroleerd, tijdelijke ophoging onderhoudsmedicatie, controle over 3 dagen.",
  ),
  ow(
    520,
    "geleerd",
    "Koorts bij dochter van I. Hassan zelfstandig afgehandeld",
    "Telefonische triage: geen alarmsymptomen, drinkt goed. Expectatief beleid uitgelegd, vangnetinstructie verstuurd, controle over 24 uur ingepland (volledig autonoom).",
  ),
  ow(
    588,
    "medicatie",
    "Mastitis H. El Amrani zelfstandig voortgezet",
    "Dag 3, borstvoeding gecontinueerd, koorts dalend. Beleid thuis voortgezet, controle vanavond, escalatiedrempel bij abcesverdenking bewaakt (volledig autonoom).",
  ),
  ow(
    646,
    "medicatie",
    "Cardiologenbrief T. van Dijk: losartan 50 → 100 mg doorgevoerd",
    "Conform advies cardioloog. Nierfunctie en kalium gecontroleerd, lab over 2 weken aangevraagd, patiënt geïnformeerd.",
  ),
];
