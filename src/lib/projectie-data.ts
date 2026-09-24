/** Wat er al op de muur staat voordat de patiënt binnenkomt. Geen dossier, geen klikwerk. */

export interface Feit {
  label: string;
  waarde: string;
}

export const FEITEN: Record<string, Feit[]> = {
  hendriks: [
    { label: "Thuismetingen", waarde: "138/84 — gemiddelde 14 dagen" },
    { label: "Medicatie", waarde: "Amlodipine 5 mg, trouw opgehaald" },
    { label: "Lab", waarde: "eGFR 78 · kalium 4,1 · normaal" },
    { label: "Laatst gezien", waarde: "7 maanden geleden, toen 146/90" },
    { label: "Doel vandaag", waarde: "Kort contact, tensie, relatie" },
    { label: "Voorbereid", waarde: "Geen medicatiewijziging" },
  ],
  meijer: [
    { label: "Klacht", waarde: "Buikklachten, vijf maanden" },
    { label: "Uitgesloten", waarde: "Coeliakie · IBD · anemie · echo" },
    { label: "Gewicht", waarde: "−4 kg in 5 maanden, geleidelijk" },
    { label: "Context", waarde: "Reorganisatie werk, slaapt slecht" },
    { label: "Doel vandaag", waarde: "Het verhaal horen. Geen protocol." },
    { label: "Klaargezet", waarde: "MDL-verwijzing — niet verstuurd" },
  ],
  peters: [
    { label: "Klacht", waarde: "Draaiduizelig bij omdraaien, 11 dagen" },
    { label: "Duur per aanval", waarde: "Seconden, positiegebonden" },
    { label: "Alarmsymptomen", waarde: "Geen uitval, gehoor intact" },
    { label: "Medicatie", waarde: "Levothyroxine 75 · TSH normaal" },
    { label: "Doel vandaag", waarde: "Dix-Hallpike en Epley" },
    { label: "Klaargezet", waarde: "Epley-instructie met filmpje" },
  ],
  mulder: [
    { label: "Klacht", waarde: "Hoest, drie weken, niet ziek" },
    { label: "Koorts", waarde: "2 dagen in week 1, tot 38,2" },
    { label: "Roken", waarde: "12 per dag, wil minderen" },
    { label: "Onderzoek", waarde: "Thoraxfoto nu niet zinvol" },
    { label: "Doel vandaag", waarde: "Kort contact, vangnet" },
  ],
  devries: [
    { label: "Klacht", waarde: "Presyncope bij inspanning, 2× deze maand" },
    { label: "ECG vanochtend", waarde: "Sinusritme, LVH-criteria positief" },
    { label: "Auscultatie", waarde: "Zacht systolisch geruis, 2 jaar bekend" },
    { label: "Familie", waarde: "Broer plots overleden op 58 jaar" },
    { label: "Klaargezet", waarde: "Spoedpoli cardiologie morgen 09:20" },
    { label: "Doel vandaag", waarde: "Mens nodig — jij beslist" },
  ],
};

/** Korte stemregels: de agent wijst naar wat er al staat, leest niets voor. */
export const WIJSZINNEN = {
  dag: "Hier zie je de samenvatting van deze dag.",
  afspraken: "Hier zie je de volgende afspraken.",
  wacht: (naam: string) =>
    `${naam} is de eerste. Hij is nog niet in de kamer. Hier zie je alvast wat je nodig hebt.`,
  wachtVolgende: (naam: string) => `${naam} is de volgende. Hier zie je alvast wat je nodig hebt.`,
  binnen: "Patiënt is in de kamer.",
  regelen: "Jij praat. Wij regelen.",
};

export const STEMHINTS = {
  briefing: ["“beluisteren”", "“overslaan”"],
  dag: ["“verder”", "“eerste patiënt”"],
  wacht: ["“binnen”", "“hij is er”"],
  consult: ["“kalium”", "“orthostase”", "“ik leg het beleid uit”"],
};
