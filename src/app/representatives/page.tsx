'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Search, MapPin, Building2, Globe, Flag, Mail, CheckCircle2, Info } from 'lucide-react';
import Link from 'next/link';
import { useLang } from '@/hooks/useLang';

/* ─── Somalia Federal Political Structure ──────────────────────────────────
   Sources: Federal Government of Somalia, IFES, UNDP Somalia
   North East State (Waqooyi Bari) = Bari region — capital Bosaso
   SSC-Khaatumo is NOT included (disputed / not recognised by XTS)
   ─────────────────────────────────────────────────────────────────────────── */

interface Constituency {
  id: string;
  en: string;
  so: string;
  capital: string;
  region: string;
  seats: number;
  type: 'district' | 'region' | 'state';
}

interface PoliticalBody {
  key: string;
  level: 'federal' | 'state';
  house?: 'upper' | 'lower';
  stateKey?: string;
  en: string;
  so: string;
  description: string;
  descriptionSo: string;
  totalSeats: number;
  color: string;
  icon: string;
  constituencies: Constituency[];
}

const BODIES: PoliticalBody[] = [
  /* ──────────────────── FEDERAL UPPER HOUSE ──────────────────── */
  {
    key: 'upper',
    level: 'federal',
    house: 'upper',
    en: 'Upper House — Senate (Golaha Guurtida)',
    so: 'Golaha Guurtida — Senate',
    description: '54 senators — 6 elected per each Federal Member State. Represents state interests at the national level.',
    descriptionSo: '54 xildhibaan — 6 waxaa doorta dawlad-gobol kasta. Ugu wakiliya danaha gobolka heerka qaranka.',
    totalSeats: 54,
    color: '#3b82f6',
    icon: '🏛',
    constituencies: [
      { id: 'u-ne',  en: 'North East State',   so: 'Waqooyi Bari',        capital: 'Las Anod',    region: 'Sool',          seats: 6, type: 'state' },
      { id: 'u-gm',  en: 'Galmudug State',      so: 'Galmudug',            capital: 'Dhusamareb',  region: 'Galgadud',      seats: 6, type: 'state' },
      { id: 'u-hs',  en: 'Hirshabelle State',   so: 'Hirshabelle',         capital: 'Jowhar',      region: 'Middle Shabelle', seats: 6, type: 'state' },
      { id: 'u-bn',  en: 'Benadir (Mogadishu)', so: 'Banaadir (Muqdisho)', capital: 'Mogadishu',   region: 'Benadir',       seats: 6, type: 'state' },
      { id: 'u-sw',  en: 'South West State',    so: 'Koonfur Galbeed',     capital: 'Baidoa',      region: 'Bay',           seats: 6, type: 'state' },
      { id: 'u-jb',  en: 'Jubaland State',      so: 'Jubbaland',           capital: 'Kismayo',     region: 'Lower Juba',    seats: 6, type: 'state' },
      { id: 'u-sl',  en: 'Somaliland',          so: 'Somaliland',          capital: 'Hargeisa',    region: 'Waqooyi Galbeed', seats: 6, type: 'state' },
      { id: 'u-ot',  en: 'Other Regions',       so: 'Gobollada Kale',      capital: '—',           region: '—',             seats: 12, type: 'region' },
    ],
  },

  /* ──────────────────── FEDERAL LOWER HOUSE ──────────────────── */
  {
    key: 'lower',
    level: 'federal',
    house: 'lower',
    en: 'Lower House — House of the People (Golaha Shacabka)',
    so: 'Golaha Shacabka — Aqalka Hoose',
    description: '275 MPs elected from constituencies across all regions of Somalia. The primary legislative chamber of the Federal Parliament.',
    descriptionSo: '275 wakiil oo laga doorto degmooyinka dhammaan gobollada Soomaaliya. Golfaha sharciga nidaamka ugu weyn ee Barlamaanka Federaalka.',
    totalSeats: 275,
    color: '#c9a227',
    icon: '🏛',
    constituencies: [
      { id: 'l-bn1', en: 'Mogadishu — Hodan',       so: 'Muqdisho — Hodaan',        capital: 'Hodan',        region: 'Benadir', seats: 8,  type: 'district' },
      { id: 'l-bn2', en: 'Mogadishu — Wadajir',     so: 'Muqdisho — Wadajir',       capital: 'Wadajir',      region: 'Benadir', seats: 7,  type: 'district' },
      { id: 'l-bn3', en: 'Mogadishu — Dharkenley',  so: 'Muqdisho — Dharkenley',    capital: 'Dharkenley',   region: 'Benadir', seats: 7,  type: 'district' },
      { id: 'l-bn4', en: 'Mogadishu — Waberi',      so: 'Muqdisho — Waaberi',       capital: 'Waberi',       region: 'Benadir', seats: 6,  type: 'district' },
      { id: 'l-bn5', en: 'Mogadishu — Heliwa',      so: 'Muqdisho — Heliwa',        capital: 'Heliwa',       region: 'Benadir', seats: 6,  type: 'district' },
      { id: 'l-ne1', en: 'North East — Las Anod',    so: 'Waqooyi Bari — Laascaanood', capital: 'Las Anod',    region: 'Sool',   seats: 10, type: 'region' },
      { id: 'l-ne2', en: 'North East — Erigavo',    so: 'Waqooyi Bari — Ceerigaabo',  capital: 'Erigavo',     region: 'Sanaag', seats: 8,  type: 'region' },
      { id: 'l-ne3', en: 'North East — Buuhoodle',  so: 'Waqooyi Bari — Buuhoodle',   capital: 'Buuhoodle',   region: 'Cayn',   seats: 6,  type: 'region' },
      { id: 'l-gm1', en: 'Galmudug — Dhusamareb',  so: 'Galmudug — Dhuusamarreeb', capital: 'Dhusamareb',   region: 'Galgadud', seats: 8, type: 'region' },
      { id: 'l-gm2', en: 'Galmudug — Adado',       so: 'Galmudug — Cadaado',       capital: 'Adado',        region: 'Galgadud', seats: 6, type: 'region' },
      { id: 'l-hs1', en: 'Hirshabelle — Jowhar',   so: 'Hirshabelle — Jawhar',     capital: 'Jowhar',       region: 'Middle Shabelle', seats: 9, type: 'region' },
      { id: 'l-hs2', en: 'Hirshabelle — Beledweyne',so: 'Hirshabelle — Beledweyne', capital: 'Beledweyne',   region: 'Hiiraan', seats: 8,  type: 'region' },
      { id: 'l-sw1', en: 'South West — Baidoa',    so: 'Koonfur Galbeed — Baydhabo',capital: 'Baidoa',      region: 'Bay',     seats: 10, type: 'region' },
      { id: 'l-sw2', en: 'South West — Baraawe',   so: 'Koonfur Galbeed — Barawe', capital: 'Baraawe',      region: 'Lower Shabelle', seats: 7, type: 'region' },
      { id: 'l-sw3', en: 'South West — Buur Hakaba',so: 'Koonfur Galbeed — Buur Hakaba', capital: 'Buur Hakaba', region: 'Bay', seats: 6, type: 'region' },
      { id: 'l-jb1', en: 'Jubaland — Kismayo',     so: 'Jubbaland — Kismaayo',     capital: 'Kismayo',      region: 'Lower Juba', seats: 10, type: 'region' },
      { id: 'l-jb2', en: 'Jubaland — Garbaharey',  so: 'Jubbaland — Garbahaareey', capital: 'Garbaharey',   region: 'Gedo', seats: 7,     type: 'region' },
      { id: 'l-jb3', en: 'Jubaland — Afmadow',     so: 'Jubbaland — Afmadow',      capital: 'Afmadow',      region: 'Lower Juba', seats: 6, type: 'region' },
      { id: 'l-sl1', en: 'Somaliland — Hargeisa',  so: 'Somaliland — Hargeysa',    capital: 'Hargeisa',     region: 'Waqooyi Galbeed', seats: 10, type: 'region' },
      { id: 'l-sl2', en: 'Somaliland — Berbera',   so: 'Somaliland — Berbera',     capital: 'Berbera',      region: 'Saaxil', seats: 6,  type: 'region' },
      { id: 'l-sl3', en: 'Somaliland — Borama',    so: 'Somaliland — Boorama',     capital: 'Borama',       region: 'Awdal',  seats: 6,  type: 'region' },
    ],
  },

  /* ──────────────────── NORTH EAST STATE (WAQOOYI BARI) ──────────────────── */
  {
    key: 'northeast',
    level: 'state',
    stateKey: 'northeast',
    en: 'North East State Assembly (Waqooyi Bari)',
    so: 'Golaha Shacabka Waqooyi Bari',
    description: 'State parliament of North East State, capital Las Anod (Laascaanood). Covers three regions: Sool, Sanaag, and Cayn (SSC).',
    descriptionSo: 'Golaha gobolka Waqooyi Bari, caasimaddiisu waa Laascaanood. Waxay daboolaysaa saddex gobol: Sool, Sanaag, iyo Cayn (SSC).',
    totalSeats: 69,
    color: '#3b82f6',
    icon: '🏛',
    constituencies: [
      /* ── Sool Region ── */
      { id: 'ne-s1', en: 'Las Anod (Laascaanood)', so: 'Laascaanood',  capital: 'Las Anod',   region: 'Sool',  seats: 16, type: 'district' },
      { id: 'ne-s2', en: 'Taleh (Taleex)',          so: 'Taleex',       capital: 'Taleh',      region: 'Sool',  seats: 10, type: 'district' },
      { id: 'ne-s3', en: 'Hudun (Xuddur)',           so: 'Xuddur',       capital: 'Hudun',      region: 'Sool',  seats: 7,  type: 'district' },
      { id: 'ne-s4', en: "Bo'ame (Boocame)",         so: 'Boocame',      capital: "Bo'ame",     region: 'Sool',  seats: 6,  type: 'district' },
      /* ── Sanaag Region ── */
      { id: 'ne-a1', en: 'Erigavo (Ceerigaabo)',     so: 'Ceerigaabo',   capital: 'Erigavo',    region: 'Sanaag', seats: 12, type: 'district' },
      { id: 'ne-a2', en: 'Badhan',                   so: 'Badhan',       capital: 'Badhan',     region: 'Sanaag', seats: 6,  type: 'district' },
      { id: 'ne-a3', en: 'Las Khorey (Laasqoray)',   so: 'Laasqoray',    capital: 'Las Khorey', region: 'Sanaag', seats: 5,  type: 'district' },
      { id: 'ne-a4', en: 'Dhahar',                   so: 'Dhahar',       capital: 'Dhahar',     region: 'Sanaag', seats: 4,  type: 'district' },
      { id: 'ne-a5', en: 'Hingalol',                 so: 'Hingalol',     capital: 'Hingalol',   region: 'Sanaag', seats: 3,  type: 'district' },
      /* ── Cayn Region ── */
      { id: 'ne-c1', en: 'Buuhoodle',                so: 'Buuhoodle',    capital: 'Buuhoodle',  region: 'Cayn',  seats: 0,  type: 'district' },
      { id: 'ne-c2', en: 'Widhwidh',                 so: 'Widhwidh',     capital: 'Widhwidh',   region: 'Cayn',  seats: 0,  type: 'district' },
    ],
  },

  /* ──────────────────── GALMUDUG STATE ──────────────────── */
  {
    key: 'galmudug',
    level: 'state',
    stateKey: 'galmudug',
    en: 'Galmudug State Assembly',
    so: 'Golaha Shacabka Galmudug',
    description: 'State parliament of Galmudug, capital Dhusamareb. Covers central Somalia including Mudug and Galgadud regions.',
    descriptionSo: 'Golaha gobolka Galmudug, caasimaddiisu waa Dhuusamarreeb. Waxay daboolaysaa bartamaha Soomaaliya.',
    totalSeats: 54,
    color: '#8b5cf6',
    icon: '🏛',
    constituencies: [
      { id: 'gm-1', en: 'Dhusamareb',    so: 'Dhuusamarreeb',    capital: 'Dhusamareb',  region: 'Galgadud', seats: 12, type: 'district' },
      { id: 'gm-2', en: 'Adado',         so: 'Cadaado',          capital: 'Adado',       region: 'Galgadud', seats: 10, type: 'district' },
      { id: 'gm-3', en: 'Galkayo South', so: 'Gaalkacyo Koonfur', capital: 'Galkayo',    region: 'Mudug',    seats: 10, type: 'district' },
      { id: 'gm-4', en: 'Abudwak',       so: 'Abudwaaq',         capital: 'Abudwak',     region: 'Galgadud', seats: 8,  type: 'district' },
      { id: 'gm-5', en: 'Balad Hawo',    so: 'Balad Hawo',       capital: 'Balad Hawo',  region: 'Galgadud', seats: 7,  type: 'district' },
      { id: 'gm-6', en: 'Cabudwaaq',     so: 'Cabudwaaq',        capital: 'Cabudwaaq',   region: 'Galgadud', seats: 7,  type: 'district' },
    ],
  },

  /* ──────────────────── HIRSHABELLE STATE ──────────────────── */
  {
    key: 'hirshabelle',
    level: 'state',
    stateKey: 'hirshabelle',
    en: 'Hirshabelle State Assembly',
    so: 'Golaha Shacabka Hirshabelle',
    description: 'State parliament of Hirshabelle, capital Jowhar. Covers Hiiraan and Middle Shabelle regions.',
    descriptionSo: 'Golaha gobolka Hirshabelle, caasimaddiisu waa Jawhar. Waxay daboolaysaa gobolada Hiiraan iyo Shabeellaha Dhexe.',
    totalSeats: 60,
    color: '#06b6d4',
    icon: '🏛',
    constituencies: [
      { id: 'hs-1', en: 'Jowhar',     so: 'Jawhar',      capital: 'Jowhar',     region: 'Middle Shabelle', seats: 14, type: 'district' },
      { id: 'hs-2', en: 'Beledweyne', so: 'Beledweyne',  capital: 'Beledweyne', region: 'Hiiraan',         seats: 14, type: 'district' },
      { id: 'hs-3', en: 'Mahadaay',   so: 'Mahadaay',    capital: 'Mahadaay',   region: 'Middle Shabelle', seats: 10, type: 'district' },
      { id: 'hs-4', en: 'Buloburde',  so: 'Buuloburde',  capital: 'Buloburde',  region: 'Hiiraan',         seats: 10, type: 'district' },
      { id: 'hs-5', en: 'Balcad',     so: 'Balcad',      capital: 'Balcad',     region: 'Middle Shabelle', seats: 7,  type: 'district' },
      { id: 'hs-6', en: 'Bulo Burto', so: 'Bulo Burto',  capital: 'Bulo Burto', region: 'Hiiraan',         seats: 5,  type: 'district' },
    ],
  },

  /* ──────────────────── BENADIR ──────────────────── */
  {
    key: 'benadir',
    level: 'state',
    stateKey: 'benadir',
    en: 'Benadir Regional Administration — Mogadishu',
    so: 'Maamulka Gobolka Banaadir — Muqdisho',
    description: 'The Benadir Regional Administration governs Mogadishu, the capital city. 17 districts, each electing local council members.',
    descriptionSo: 'Maamulka Gobolka Banaadir wuxuu maamulaa Muqdisho, caasimadda dalka. 17 degmo, midkood wuxuu dooranayaa xubnaha golaha degmada.',
    totalSeats: 102,
    color: '#c9a227',
    icon: '🏙',
    constituencies: [
      { id: 'bn-1',  en: 'Hodan',           so: 'Hodaan',           capital: 'Hodan',      region: 'Benadir', seats: 8,  type: 'district' },
      { id: 'bn-2',  en: 'Wadajir',         so: 'Wadajir',          capital: 'Wadajir',    region: 'Benadir', seats: 7,  type: 'district' },
      { id: 'bn-3',  en: 'Dharkenley',      so: 'Dharkenley',       capital: 'Dharkenley', region: 'Benadir', seats: 7,  type: 'district' },
      { id: 'bn-4',  en: 'Waberi',          so: 'Waaberi',          capital: 'Waberi',     region: 'Benadir', seats: 6,  type: 'district' },
      { id: 'bn-5',  en: 'Heliwa',          so: 'Heliwa',           capital: 'Heliwa',     region: 'Benadir', seats: 6,  type: 'district' },
      { id: 'bn-6',  en: 'Abdiaziz',        so: 'Cabdiciziis',      capital: 'Abdiaziz',   region: 'Benadir', seats: 6,  type: 'district' },
      { id: 'bn-7',  en: 'Bondhere',        so: 'Bondhere',         capital: 'Bondhere',   region: 'Benadir', seats: 6,  type: 'district' },
      { id: 'bn-8',  en: 'Hamar Jajab',     so: 'Xamar Jajab',      capital: 'Hamar Jajab',region: 'Benadir', seats: 6,  type: 'district' },
      { id: 'bn-9',  en: 'Hamar Weyne',     so: 'Xamar Weyne',      capital: 'Hamar Weyne',region: 'Benadir', seats: 5,  type: 'district' },
      { id: 'bn-10', en: 'Shangani',        so: 'Shangaani',        capital: 'Shangani',   region: 'Benadir', seats: 5,  type: 'district' },
      { id: 'bn-11', en: 'Karan',           so: 'Kaaraan',          capital: 'Karan',      region: 'Benadir', seats: 5,  type: 'district' },
      { id: 'bn-12', en: 'Kaxda',           so: 'Kaxda',            capital: 'Kaxda',      region: 'Benadir', seats: 5,  type: 'district' },
      { id: 'bn-13', en: 'Daynile',         so: 'Daynile',          capital: 'Daynile',    region: 'Benadir', seats: 5,  type: 'district' },
      { id: 'bn-14', en: 'Shibis',          so: 'Shibiis',          capital: 'Shibis',     region: 'Benadir', seats: 5,  type: 'district' },
      { id: 'bn-15', en: 'Yaqshid',         so: 'Yaqshid',          capital: 'Yaqshid',    region: 'Benadir', seats: 4,  type: 'district' },
      { id: 'bn-16', en: 'Warta Nabadda',   so: 'Warta Nabadda',    capital: 'Warta Nabadda', region: 'Benadir', seats: 4, type: 'district' },
      { id: 'bn-17', en: 'Deynile',         so: 'Deynile',          capital: 'Deynile',    region: 'Benadir', seats: 2,  type: 'district' },
    ],
  },

  /* ──────────────────── SOUTH WEST STATE ──────────────────── */
  {
    key: 'southwest',
    level: 'state',
    stateKey: 'southwest',
    en: 'South West State Assembly',
    so: 'Golaha Shacabka Koonfur Galbeed',
    description: 'State parliament of South West State, capital Baidoa. Covers Bay, Bakool and Lower Shabelle regions.',
    descriptionSo: 'Golaha gobolka Koonfur Galbeed, caasimaddiisu waa Baydhabo. Waxay daboolaysaa gobolada Bay, Bakool iyo Shabeellaha Hoose.',
    totalSeats: 69,
    color: '#22c55e',
    icon: '🏛',
    constituencies: [
      { id: 'sw-1', en: 'Baidoa',      so: 'Baydhabo',   capital: 'Baidoa',      region: 'Bay',            seats: 14, type: 'district' },
      { id: 'sw-2', en: 'Baraawe',     so: 'Barawe',     capital: 'Baraawe',     region: 'Lower Shabelle', seats: 10, type: 'district' },
      { id: 'sw-3', en: 'Buur Hakaba', so: 'Buur Hakaba', capital: 'Buur Hakaba', region: 'Bay',           seats: 9,  type: 'district' },
      { id: 'sw-4', en: 'Huddur',      so: 'Xuddur',     capital: 'Huddur',      region: 'Bakool',         seats: 9,  type: 'district' },
      { id: 'sw-5', en: 'Wajid',       so: 'Waajid',     capital: 'Wajid',       region: 'Bakool',         seats: 8,  type: 'district' },
      { id: 'sw-6', en: 'Marka',       so: 'Marka',      capital: 'Marka',       region: 'Lower Shabelle', seats: 10, type: 'district' },
      { id: 'sw-7', en: 'Kurtunwarey', so: 'Kurtunwarey', capital: 'Kurtunwarey', region: 'Lower Shabelle', seats: 5, type: 'district' },
      { id: 'sw-8', en: 'Qoryooley',   so: 'Qoryooley',  capital: 'Qoryooley',   region: 'Lower Shabelle', seats: 4,  type: 'district' },
    ],
  },

  /* ──────────────────── JUBALAND STATE ──────────────────── */
  {
    key: 'jubaland',
    level: 'state',
    stateKey: 'jubaland',
    en: 'Jubaland State Assembly',
    so: 'Golaha Shacabka Jubbaland',
    description: 'State parliament of Jubaland, capital Kismayo. Covers Gedo, Middle Juba and Lower Juba regions.',
    descriptionSo: 'Golaha gobolka Jubbaland, caasimaddiisu waa Kismaayo. Waxay daboolaysaa gobolada Gedo, Jubada Dhexe iyo Jubada Hoose.',
    totalSeats: 75,
    color: '#f97316',
    icon: '🏛',
    constituencies: [
      { id: 'jb-1', en: 'Kismayo',    so: 'Kismaayo',     capital: 'Kismayo',    region: 'Lower Juba',  seats: 16, type: 'district' },
      { id: 'jb-2', en: 'Garbaharey', so: 'Garbahaareey', capital: 'Garbaharey', region: 'Gedo',        seats: 12, type: 'district' },
      { id: 'jb-3', en: 'Bulo Hawa',  so: 'Bulo Hawa',    capital: 'Bulo Hawa',  region: 'Gedo',        seats: 10, type: 'district' },
      { id: 'jb-4', en: 'Afmadow',    so: 'Afmadow',      capital: 'Afmadow',    region: 'Lower Juba',  seats: 10, type: 'district' },
      { id: 'jb-5', en: 'Saakow',     so: 'Saakow',       capital: 'Saakow',     region: 'Middle Juba', seats: 9,  type: 'district' },
      { id: 'jb-6', en: "Bu'aale",    so: "Bu'aale",      capital: "Bu'aale",    region: 'Middle Juba', seats: 9,  type: 'district' },
      { id: 'jb-7', en: 'Doolow',     so: 'Doolow',       capital: 'Doolow',     region: 'Gedo',        seats: 9,  type: 'district' },
    ],
  },

  /* ──────────────────── SOMALILAND ──────────────────── */
  {
    key: 'somaliland',
    level: 'state',
    stateKey: 'somaliland',
    en: 'Somaliland — House of Representatives & Guurti',
    so: 'Somaliland — Golaha Wakiillada & Golaha Guurtida',
    description: 'Somaliland has its own bicameral parliament: House of Representatives (82 seats) and Guurti (Senate). XTS will field candidates across Somaliland regions.',
    descriptionSo: 'Somaliland waxay leedahay barlamaan laba-gole ah: Golaha Wakiillada (82 kursi) iyo Golaha Guurtida (Guurti). XTS waxay musharaxyada ka soo dhigi doontaa Somaliland oo dhan.',
    totalSeats: 82,
    color: '#84cc16',
    icon: '🏛',
    constituencies: [
      { id: 'sl-1', en: 'Hargeisa', so: 'Hargeysa',   capital: 'Hargeisa', region: 'Waqooyi Galbeed', seats: 24, type: 'district' },
      { id: 'sl-2', en: 'Berbera',  so: 'Berbera',    capital: 'Berbera',  region: 'Saaxil',          seats: 12, type: 'district' },
      { id: 'sl-3', en: 'Borama',   so: 'Boorama',    capital: 'Borama',   region: 'Awdal',           seats: 14, type: 'district' },
      { id: 'sl-4', en: 'Burao',    so: 'Burco',      capital: 'Burao',    region: 'Togdheer',        seats: 14, type: 'district' },
      { id: 'sl-5', en: 'Erigavo',  so: 'Ceerigaabo', capital: 'Erigavo',  region: 'Sanaag',          seats: 10, type: 'district' },
      { id: 'sl-6', en: 'Ainabo',   so: 'Caynabo',    capital: 'Ainabo',   region: 'Togdheer',        seats: 8,  type: 'district' },
    ],
  },
];

/* ─── Single constituency row ──────────────────────────────────────────── */
function ConstituencyRow({ c, color, lang }: { c: Constituency; color: string; lang: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/8"
    >
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
        <div>
          <div className="text-white/80 text-sm font-medium">
            {lang === 'en' ? c.en : c.so}
          </div>
          <div className="text-white/30 text-[10px] mt-0.5 flex items-center gap-2">
            <span className="flex items-center gap-1"><MapPin size={9} /> {c.capital}</span>
            <span className="opacity-50">·</span>
            <span>{lang === 'en' ? 'Region:' : 'Gobol:'} {c.region}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs font-black" style={{ color }}>{c.seats > 0 ? c.seats : '—'}</div>
        <div className="text-white/25 text-[9px]">{c.seats > 0 ? (lang === 'en' ? 'seats' : 'kursi') : ''}</div>
      </div>
    </motion.div>
  );
}

/* ─── Body card ─────────────────────────────────────────────────────────── */
function BodyCard({ body, lang, expanded, onToggle }: { body: PoliticalBody; lang: string; expanded: boolean; onToggle: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={`rounded-2xl border overflow-hidden transition-all duration-300 ${expanded ? 'border-white/20' : 'border-white/8 hover:border-white/15'}`}
      style={{ background: expanded ? `${body.color}06` : 'rgba(255,255,255,0.02)' }}
    >
      <div className="h-1" style={{ background: body.color }} />
      <button onClick={onToggle} className="w-full text-left p-6 group">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="text-3xl mt-0.5">{body.icon}</div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: `${body.color}20`, color: body.color }}>
                  {body.level === 'federal'
                    ? (lang === 'en' ? (body.house === 'upper' ? 'Federal — Upper House' : 'Federal — Lower House') : (body.house === 'upper' ? 'Federaal — Aqalka Sare' : 'Federaal — Aqalka Hoose'))
                    : (lang === 'en' ? 'State Level' : 'Heerka Gobolka')}
                </span>
              </div>
              <h3 className="text-white font-black text-base sm:text-lg leading-tight">
                {lang === 'en' ? body.en : body.so}
              </h3>
              <p className="text-white/45 text-xs mt-1.5 leading-relaxed max-w-lg">
                {lang === 'en' ? body.description : body.descriptionSo}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="text-right">
              <div className="text-2xl font-black" style={{ color: body.color }}>{body.totalSeats}</div>
              <div className="text-white/30 text-[10px]">{lang === 'en' ? 'total seats' : 'kursi guud'}</div>
            </div>
            <div className="text-white/30 text-xs">{expanded ? '▲' : '▼'}</div>
          </div>
        </div>
        {!expanded && (
          <div className="mt-4 ml-16 flex items-center gap-2 text-xs" style={{ color: body.color }}>
            <CheckCircle2 size={12} />
            <span>{body.constituencies.length} {lang === 'en' ? 'constituencies — click to expand' : 'degmo — guji si aad u ballaariso'}</span>
          </div>
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden border-t border-white/8"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="text-white/40 text-xs uppercase tracking-widest font-semibold">
                  {lang === 'en' ? 'Districts / Constituencies & Seats' : 'Degmooyinka & Kuraasta'}
                </div>
              </div>
              <div className="space-y-1">
                {body.constituencies.map(c => (
                  <ConstituencyRow key={c.id} c={c} color={body.color} lang={lang} />
                ))}
              </div>
              <div className="mt-4 p-3 rounded-xl flex items-start gap-2.5 bg-amber-500/6 border border-amber-500/20">
                <Info size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed text-amber-300/80">
                  {lang === 'en'
                    ? 'XTS holds no seats yet. This page shows Somalia\'s constituency structure for information purposes only.'
                    : 'XTS wali ma hayso kursi. Boggan wuxuu muujinayaa qaab-dhismeedka degmooyinka Soomaaliya oo macluumaad kaliya.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────────────── */
export default function RepresentativesPage() {
  const { lang } = useLang();
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'federal' | 'state'>('all');
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const filtered = BODIES.filter(b => {
    if (levelFilter === 'federal' && b.level !== 'federal') return false;
    if (levelFilter === 'state' && b.level !== 'state') return false;
    if (search) {
      const q = search.toLowerCase();
      return b.en.toLowerCase().includes(q) ||
             b.so.toLowerCase().includes(q) ||
             b.constituencies.some(c =>
               c.en.toLowerCase().includes(q) ||
               c.so.toLowerCase().includes(q) ||
               c.capital.toLowerCase().includes(q) ||
               c.region.toLowerCase().includes(q)
             );
    }
    return true;
  });

  return (
    <>
      {/* ── HERO ── */}
      <section className="pt-32 pb-16 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #040b1c 0%, #070e24 100%)' }}>
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(circle, #c9a227 1px, transparent 1px)', backgroundSize: '38px 38px' }} />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.6 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold/10 border border-gold/25 mb-6">
            <Flag size={28} className="text-gold" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/25 bg-gold/8 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-gold text-xs font-bold tracking-[0.22em] uppercase">
              {lang === 'en' ? 'Federal & State Elections — Somalia' : 'Doorashooyinka Federaalka & Gobolka'}
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-5 leading-tight">
            {lang === 'en'
              ? <>Find Your <span className="text-gold">Constituency</span></>
              : <>Raadi <span className="text-gold">Degmadaada</span></>}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-white/55 text-lg max-w-2xl mx-auto mb-6 leading-relaxed">
            {lang === 'en'
              ? 'Browse every federal and state-level constituency in Somalia. Find which parliament your area belongs to — then register as an XTS candidate.'
              : 'Dhammaan degmooyinka federaalka iyo gobolka ee Soomaaliya. Ogaaw barlamaanka ay goobta aad ku noolaatid ku jirto — ka dibna is-diiwaangeli musharax XTS.'}
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-amber-500/8 border border-amber-500/25 mb-8">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
            <span className="text-amber-300 text-xs font-semibold">
              {lang === 'en'
                ? 'XTS is a new party — no seats held yet. Be among the first to register as a candidate.'
                : 'XTS xisbi cusub — wali kursi lama haysto. Ka mid noqo kuwii ugu horreeyay ee is-diiwaangela musharax.'}
            </span>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-3">
            {[
              { n: '275', en: 'Lower House seats',     so: 'Kuraasta Aqalka Hoose',    color: 'text-gold' },
              { n: '54',  en: 'Senate seats',          so: 'Kuraasta Golaha Guurtida', color: 'text-blue-400' },
              { n: '7',   en: 'States & regions',      so: 'Dawlad-gobol & maamul',    color: 'text-green-400' },
              { n: '329+',en: 'Total seats to contest',so: 'Kursi guud',               color: 'text-purple-400' },
            ].map((s, i) => (
              <div key={i} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className={`text-xl font-black ${s.color}`}>{s.n}</div>
                <div className="text-white/40 text-[10px] mt-0.5">{lang === 'en' ? s.en : s.so}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FILTER + CARDS ── */}
      <section className="py-12" style={{ background: '#070e24' }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder={lang === 'en' ? 'Search state, district, region, or city…' : 'Raadi gobol, degmo, ama magaalo…'}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-gold/40 transition-colors text-sm" />
            </div>
            <div className="flex gap-2">
              {([
                { id: 'all',     en: 'All',        so: 'Dhammaan'       },
                { id: 'federal', en: 'Federal',     so: 'Federaal'       },
                { id: 'state',   en: 'State Level', so: 'Heerka Gobolka' },
              ] as const).map(opt => (
                <button key={opt.id} onClick={() => setLevelFilter(opt.id)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all border whitespace-nowrap ${
                    levelFilter === opt.id ? 'bg-gold text-navy border-gold' : 'bg-white/5 text-white/50 border-white/10 hover:border-white/25'
                  }`}>
                  {lang === 'en' ? opt.en : opt.so}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {filtered.map(body => (
              <BodyCard key={body.key} body={body} lang={lang}
                expanded={expandedKey === body.key}
                onToggle={() => setExpandedKey(k => k === body.key ? null : body.key)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16" style={{ background: '#040b1c' }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
              {lang === 'en' ? <>Somalia's <span className="text-gold">Two-Level Election System</span></> : <>Nidaamka <span className="text-gold">Doorashada Laba-Heerka</span> ee Soomaaliya</>}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
                  <Globe size={18} className="text-blue-400" />
                </div>
                <div>
                  <div className="text-white font-black text-sm">{lang === 'en' ? 'Federal Elections' : 'Doorashada Federaalka'}</div>
                  <div className="text-blue-400/70 text-xs">{lang === 'en' ? 'National Parliament' : 'Barlamaanka Qaranka'}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white/5 border border-blue-500/15">
                  <div className="text-blue-300 font-bold text-xs mb-1">Upper House — Golaha Guurtida</div>
                  <div className="text-white/40 text-xs">{lang === 'en' ? '54 senators — 6 per Federal Member State.' : '54 xildhibaan — 6 dawlad-gobol kasta.'}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-blue-500/15">
                  <div className="text-blue-300 font-bold text-xs mb-1">Lower House — Golaha Shacabka</div>
                  <div className="text-white/40 text-xs">{lang === 'en' ? '275 MPs from all constituencies. Main legislative chamber.' : '275 wakiil. Golfaha sharciga ugu weyn.'}</div>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-gold/5 border border-gold/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/25 flex items-center justify-center">
                  <Building2 size={18} className="text-gold" />
                </div>
                <div>
                  <div className="text-white font-black text-sm">{lang === 'en' ? 'State Elections' : 'Doorashada Gobolka'}</div>
                  <div className="text-gold/70 text-xs">{lang === 'en' ? 'Separate from federal' : 'Ka duwan federaalka'}</div>
                </div>
              </div>
              <div className="text-white/45 text-xs leading-relaxed mb-4">
                {lang === 'en'
                  ? 'Each Federal Member State runs its own assembly elections, completely separate from federal elections.'
                  : 'Dawlad-gobol kastaa waxay leedahay doorashooyinkeedii golaha gobolka, oo si buuxda uga duwan doorashada federaalka.'}
              </div>
              <div className="space-y-1.5">
                {[
                  { en: 'North East State — Sool, Sanaag, Cayn', so: 'Waqooyi Bari — Sool, Sanaag, Cayn', color: '#3b82f6' },
                  { en: 'Galmudug', so: 'Galmudug', color: '#8b5cf6' },
                  { en: 'Hirshabelle', so: 'Hirshabelle', color: '#06b6d4' },
                  { en: 'Benadir (Mogadishu)', so: 'Banaadir (Muqdisho)', color: '#c9a227' },
                  { en: 'South West State', so: 'Koonfur Galbeed', color: '#22c55e' },
                  { en: 'Jubaland', so: 'Jubbaland', color: '#f97316' },
                  { en: 'Somaliland', so: 'Somaliland', color: '#84cc16' },
                ].map(s => (
                  <div key={s.en} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                    <span className="text-white/55 text-xs">{lang === 'en' ? s.en : s.so}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact note ── */}
      <section className="py-16" style={{ background: '#070e24' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
            {lang === 'en' ? <>Questions about <span className="text-gold">constituencies?</span></> : <>Su'aalo ku saabsan <span className="text-gold">degmooyinka?</span></>}
          </h3>
          <p className="text-white/50 text-sm leading-relaxed mb-7 max-w-xl mx-auto">
            {lang === 'en'
              ? 'This page is for information only. If you have questions about XTS, political structure, or want to get involved, contact us directly.'
              : 'Boggan waa macluumaad kaliya. Haddaad su\'aalo qabtid oo ku saabsan XTS, qaab-dhismeedka siyaasadda, ama rabtid inaad ka qayb qaadato, nala xiriir si toos ah.'}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/contact">
              <motion.span whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-gold text-navy font-black text-base rounded-full cursor-pointer shadow-lg shadow-gold/20">
                <Mail size={18} /> {lang === 'en' ? 'Contact XTS' : 'Nala Xiriir'}
              </motion.span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
