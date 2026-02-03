
import { Pupil, Subject } from './types';

export const TEACHERS = [
  "ALYSA JULIA ANAK THORNLEY",
  "DAYANG ERINA NATASHA BINTI ABANG ABBEHA",
  "DAVE BIN ASON",
  "FAID BIN ZULKIFLI",
  "GRACE ANAK KANA",
  "JESSICA ANAK KATANG",
  "MARIATI BINTI PADLAM",
  "MUHAMMAD AIMAN CYPRIAN BIN MUHD NIZAM",
  "RAFFI BIN SMAIL",
  "RAZELI BIN SIRAT",
  "REBENA BINTI ASIN",
  "SAHARUDDIN BIN SAPIAE",
  "IZWANSYAH BIN LAMUHAMMADE"
];

export const RAW_PUPILS: Record<string, string[]> = {
  "1": [
    "CLARARISSA LIVONIA BINTI LEHAN",
    "MIA ARIANA BINTI ANDUKHA ELRONDY",
    "DANIELSON BIN JASON"
  ],
  "2": [
    "MELYSHA",
    "MICHAEL ABRAHAM MELKISEDEK",
    "NUR QYSSTINA QHAYSARA BINTI MOHD IQBAL QUSSYAIRI",
    "RAZIA ROSSA ANAK STEFFENS ANDY",
    "FARIZ NAUFAL BIN FIRDAUS AHSENG",
    "ASHRIQ AQIEL BIN RAZAN"
  ],
  "3": [
    "RAYYEN HAYDEN BIN ALOYSIS",
    "LUCIA AMANDA BINTI ZUINI",
    "VELLVET GEORGIANA ZHI LIM",
    "KAYZILL KAYNOVIL BIN INI",
    "RACHELL ERCILIA"
  ],
  "4": [
    "NUR FARINA BINTI ABDULLAH",
    "ABDULLAH HANIF BIN RAFFI",
    "CYRIL IGNATIUS BIN KALUNI",
    "MOHAMAD AADI PUTRA BIN ABDULLAH"
  ],
  "5": [
    "ARMELLICIANA BINTI ARYANG",
    "JACKSON BIN JULUIENG",
    "JERALD DAMIAN BIN JASON",
    "KYRA KIRANA BINTI MAULANA",
    "VINCE DENZEL ZHEN LIM"
  ],
  "6": [
    "DANNY ALVES BIN MAULANA",
    "KEARLY FAYREENDY BIN KENNEDY",
    "NUR ANISYA BINTI JAMEJAMY",
    "RACHEL JANE ANAK STEFFENS ANDY"
  ]
};

// Disusun mengikut abjad dalam setiap kelas
export const ALL_PUPILS: Pupil[] = Object.entries(RAW_PUPILS).flatMap(([year, names]) => {
  const sortedNames = [...names].sort((a, b) => a.localeCompare(b));
  return sortedNames.map(name => ({
    id: `${year}-${name.replace(/\s+/g, '-').toLowerCase()}`,
    name,
    year: parseInt(year)
  }));
});

export const OFFICIALS = {
  COORDINATOR: "Encik Raffi bin Smail",
  COORDINATOR_TITLE: "Penolong Kanan Pentadbiran dan Akademik, SK Kg Klid/Plajau",
  HEADMASTER: "Encik Razeli bin Sirat",
  HEADMASTER_TITLE: "Guru Besar SK Kg Klid/Plajau, Dalat"
};
