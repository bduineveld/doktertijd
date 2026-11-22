import { useEffect, useState } from "react";

const KEY = "doktertijd-mens-uit-de-loop";
const EVT = "doktertijd-mens-uit-de-loop-change";

/** Taken die verdwijnen als "Volledig autonoom" aan staat. */
export const MAX_DELEGATIE_IDS = [
  "bakker",
  "jansen",
  "vos",
  "deboer",
  "vandijk",
  "hassan",
  "elamrani",
] as const;

export const MAX_DELEGATIE_TOAST = "Volledig autonoom. Jij ziet alleen menselijke zorg.";

/** Standaard UIT: alleen een expliciete "1" zet de schakelaar aan. */
export function getMaxDelegatie(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "1";
}

export function setMaxDelegatie(v: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, v ? "1" : "0");
  window.dispatchEvent(new CustomEvent(EVT, { detail: v }));
}

/** Gedeelde schakelaar over alle schermen heen. */
export function useMaxDelegatie(): [boolean, (v: boolean) => void] {
  const [aan, setAan] = useState(false);

  useEffect(() => {
    setAan(getMaxDelegatie());
    const h = () => setAan(getMaxDelegatie());
    window.addEventListener(EVT, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(EVT, h);
      window.removeEventListener("storage", h);
    };
  }, []);

  return [aan, setMaxDelegatie];
}
