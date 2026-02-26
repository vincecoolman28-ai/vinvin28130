
export interface Doctor {
  id?: number;
  nom: string;
  prenom: string;
  specialite: string;
  lieu: string;
  rdv: string;
  secretariat_cs: string;
  secretariat_hospi: string;
  dect: string;
}

export interface GuardEntry {
  specialite: string;
  garde: string;
  avis: string;
}

export interface ServiceEntry {
  equipe: string;
  fonctions: string;
  numeros: string;
  specialites: string;
  localisation: string;
  type?: string; 
}

export interface DrhContact {
  name: string;
  role: string;
  phone?: string;
  highlight?: boolean;
}

export interface DrhSection {
  title: string;
  contacts: DrhContact[];
  category?: 'Médical' | 'PNM' | 'Support';
}

export interface DrhOrientation {
  title: string;
  icon: string;
  description: string;
  action?: {
    label: string;
    link: string;
  };
  subCases?: string[];
  list?: string[];
}

export interface MapPoint {
  id: string;
  label: string;
  type: 'porte-impaire' | 'porte-paire' | 'autre-point';
  infoHtml: string;
}

export interface UsefulNumberItem {
  label: string;
  contact?: string;
  num: string;
  itemIcon?: string;
}

export interface UsefulNumberCategory {
  title: string;
  icon: string;
  items: UsefulNumberItem[];
  colorTheme?: 'red' | 'orange' | 'purple' | 'teal' | 'blue';
}

export interface EncadrementEntry {
  pole: string;
  nom: string;
  perimetre: string;
  tel: string;
  localisation: string;
  isLeader?: boolean;
}

export interface ServiceLocationEntry {
  code: string;
  service: string;
  porte: string;
  niveau: string;
  batiment: string;
  tel: string;
}

export interface OrganigrammeEntry {
  pole: string;
  service: string;
  titre: string;
  nom: string;
  tel?: string;
}

export interface SecretariatEntry {
  id: string;
  name: string;
  contentHtml: string;
}

export interface ExamEntry {
  nom: string;
  categorie: string;
  lieu: string;
  batiment: string;
  contact: string;
  details?: string;
}

export interface PlanEntry {
  pole: string;
  ug: string;
  libelleUg: string;
  ul: string;
  lits?: string;
  ua: string;
  posteDeSoins?: string;
}

export enum ViewState {
  ACCUEIL = 'ACCUEIL',
  ANNUAIRE = 'ANNUAIRE',
  GARDES = 'GARDES',
  CONSULTATIONS = 'CONSULTATIONS',
  DRH = 'DRH',
  SECRETARIATS = 'SECRETARIATS',
  ENCADREMENT = 'ENCADREMENT',
  CADRES = 'CADRES',
  CHEFS = 'CHEFS',
  PLAN = 'PLAN',
  UTILES = 'UTILES',
  LOSSERAND = 'LOSSERAND',
  QUI_FAIT_QUOI = 'QUI_FAIT_QUOI',
  EXAMENS = 'EXAMENS',
  GPS = 'GPS',
  CONTACT = 'CONTACT',
  PLAN_HOSPITALIER = 'PLAN_HOSPITALIER'
}
