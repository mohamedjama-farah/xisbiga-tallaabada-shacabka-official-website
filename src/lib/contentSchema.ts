// ─── CONTENT SCHEMA ─────────────────────────────────────────────────────────
// Defines every editable text section for every page.
// Admin UI reads this to know what fields to show.
// Each entry: { key: 'section.key', label: 'Human label', multiline: bool,
//               defaultEn: '...', defaultSo: '...' }

export interface ContentField {
  key: string;
  label: string;
  multiline?: boolean;
  defaultEn: string;
  defaultSo: string;
}

export interface PageSchema {
  page: string;
  label: string;
  icon: string;
  fields: ContentField[];
}

export const CONTENT_SCHEMA: PageSchema[] = [
  // ── HOME ────────────────────────────────────────────────────────────────
  {
    page: 'home',
    label: 'Home Page',
    icon: '🏠',
    fields: [
      { key: 'hero.tagline',   label: 'Hero Tagline',   defaultEn: "Building Tomorrow's Somalia Together", defaultSo: 'Somalida Berri Wada Dhisayno' },
      { key: 'hero.subtitle',  label: 'Hero Subtitle',  multiline: true, defaultEn: "The People's Progress Party — A new movement for justice, unity, and prosperity.", defaultSo: 'Xisbiga Tallaabada Shacabka — Dhaqdhaqaaq cusub oo xaq, midnimo, iyo horumar u taagan.' },
      { key: 'hero.cta',       label: 'Hero Button',    defaultEn: 'Join the Movement', defaultSo: 'Ku Biir Dhaqdhaqaaqa' },
      { key: 'values.title',   label: 'Values Section Title', defaultEn: 'Our Core Values', defaultSo: 'Qiyamkeenna Aasaasiga' },
      { key: 'value1.title',   label: 'Value 1 — Title', defaultEn: 'Justice for All', defaultSo: 'Cadaaladda Dadka Oo Dhan' },
      { key: 'value1.text',    label: 'Value 1 — Text',  multiline: true, defaultEn: 'Equal rights and opportunities for every Somali, regardless of clan, gender, or region.', defaultSo: 'Xuquuq iyo fursad siman oo Soomaali kasta ah, qabiilka, jinsiga, ama gobolka ayaan loo eegin.' },
      { key: 'value2.title',   label: 'Value 2 — Title', defaultEn: 'National Unity', defaultSo: 'Midnimada Qaranka' },
      { key: 'value2.text',    label: 'Value 2 — Text',  multiline: true, defaultEn: 'One Somalia, one people, one future — beyond clan divisions.', defaultSo: 'Soomaali keliya, shacab keliya, mustaqbal keliya — dhinaca qabiilka.' },
      { key: 'value3.title',   label: 'Value 3 — Title', defaultEn: 'Real Progress', defaultSo: 'Horumar Dhabta ah' },
      { key: 'value3.text',    label: 'Value 3 — Text',  multiline: true, defaultEn: 'Concrete policies that improve healthcare, education, and the economy for all Somalis.', defaultSo: 'Qorshayaal adag oo horumariya caafimaadka, waxbarashada, iyo dhaqaalaha Soomaalida oo dhan.' },
    ],
  },

  // ── ABOUT ───────────────────────────────────────────────────────────────
  {
    page: 'about',
    label: 'About Page',
    icon: 'ℹ️',
    fields: [
      { key: 'header.tag',   label: 'Top Tag (small text)',  defaultEn: 'Who We Are', defaultSo: 'Cidda Aan Nahay' },
      { key: 'mission.title', label: 'Mission Title', defaultEn: 'Our Mission', defaultSo: 'Hadafkeenna' },
      { key: 'mission.text',  label: 'Mission Text', multiline: true, defaultEn: 'Xisbiga Tallaabada Shacabka (XTS) is a progressive political movement dedicated to building a just, united, and prosperous Somalia. We champion the rights of every citizen and work to create a future where all Somalis can thrive.', defaultSo: 'Xisbiga Tallaabada Shacabka (XTS) waa dhaqdhaqaaq siyaasadeed horumarsan oo u heellan in la dhiso Soomaali cadaalad leh, mideysan, oo horumaraysa. Waxaan u doodnaa xuquuqda muwaadin kasta waxaanaan shaqaynaa si aan mustaqbal loo abuuro oo Soomaalida oo dhan ay ku barwaaqaysato.' },
      { key: 'vision.title',  label: 'Vision Title', defaultEn: 'Our Vision', defaultSo: 'Aragtidayada' },
      { key: 'vision.text',   label: 'Vision Text',  multiline: true, defaultEn: 'A Somalia where education, healthcare, infrastructure and rule of law are the foundations of a thriving society for all generations.', defaultSo: 'Soomaali waxbarasho, caafimaad, kaabayaal iyo xukun-xeerku ay yihiin aasaaska bulshada oo dhammaan jiilalka u barwaaqasanaysa.' },
      { key: 'pledge.title',  label: 'Pledge Title', defaultEn: 'Our Pledge', defaultSo: 'Ballanqaadkayaga' },
      { key: 'pledge.text',   label: 'Pledge Text',  multiline: true, defaultEn: 'We pledge transparency, accountability, and servant leadership — putting the needs of the Somali people above all else.', defaultSo: 'Waxaan ballanqaadaynaa wax-sheegidda, xisaabtanka, iyo hoggaaminta adeegida — baahida shacabka Soomaaliyeed ayaan ka hor dhigeynaa wax kale.' },
      { key: 'story.title',   label: 'Story Section Title', defaultEn: 'Our Story', defaultSo: 'Taariikhdeena' },
      { key: 'story.2025a',   label: 'Story — 2025 (founding)', multiline: true, defaultEn: 'XTS founded by a group of dedicated Somali activists and intellectuals with a shared vision.', defaultSo: 'XTS waxaa aasaasay koox dhaqdhaqaaqleyaal iyo aqoonyahannada Soomaaliyeed oo aragtida wadaagta ah.' },
      { key: 'story.2025b',   label: 'Story — 2025 (offices)',  multiline: true, defaultEn: 'First regional offices opened across Somalia, growing our grassroots network.', defaultSo: 'Xafiisyada gobolka ee ugu horreeya ayaa laga furay dalka Soomaaliya, tamarta hoose ee shabakadayadu waa kobtay.' },
      { key: 'story.2026',    label: 'Story — 2026 (members)', multiline: true, defaultEn: 'Nationwide membership drive launched, welcoming thousands of new members.', defaultSo: 'Mashruuca xubnaha ee qaranka oo dhan ayaa la bilaabay, uguna soo dhowaynay kumaan xubo oo cusub.' },
    ],
  },

  // ── POLICY ──────────────────────────────────────────────────────────────
  {
    page: 'policy',
    label: 'Policy Platform',
    icon: '📋',
    fields: [
      { key: 'page.title',    label: 'Page Title',    defaultEn: 'Policy Platform', defaultSo: 'Qorshaha Siyaasadeed' },
      { key: 'page.subtitle', label: 'Page Subtitle', multiline: true, defaultEn: 'Real policies, real change. XTS commits to concrete action on the issues that matter most to Somali families.', defaultSo: 'Qorshayaal dhabta ah, isbeddel dhabta ah. XTS waxay u heellan tahay tallaabooyin adag ee arrimaha ugu muhiimsan ee qoysaska Soomaaliyeed.' },
      { key: 'edu.title',     label: 'Education — Title',   defaultEn: 'Education for All', defaultSo: 'Waxbarasho Dadka Oo Dhan' },
      { key: 'edu.summary',   label: 'Education — Summary', multiline: true, defaultEn: 'Free education without discrimination. Build 500 new rural schools before 2027. Merit-based university scholarships regardless of clan or region.', defaultSo: 'Waxbarasho bilaash ah oo xad-gudub la\'aanta ah. Dhis 500 dugsiyood oo cusub oo miyiga ah 2027 kahor. Bixinta deeqaha jaamacadda ee ardayda ugu wanaagsan ee aan loo eegi qabiilka ama gobolka.' },
      { key: 'health.title',  label: 'Healthcare — Title',  defaultEn: 'Healthcare', defaultSo: 'Caafimaadka' },
      { key: 'health.summary',label: 'Healthcare — Summary',multiline: true, defaultEn: 'Health center within 10km for every Somali by 2028. Free maternal and child healthcare. Train 2,000 new doctors and nurses.', defaultSo: 'Xarun caafimaad 10km gudaheeda ah ee Soomaali kasta 2028 kahor. Daryeel haweeneed iyo tallaalka caruurta oo bilaash ah. Tababar 2,000 dhakhaatiir iyo kalkaaliyayaal cusub.' },
      { key: 'security.title',label: 'Security — Title',    defaultEn: 'Security & Justice', defaultSo: 'Amniga & Cadaaladda' },
      { key: 'security.summary', label: 'Security — Summary', multiline: true, defaultEn: 'Professional, clan-neutral military and police. Independent courts free from political interference. Zero tolerance for corruption at all levels.', defaultSo: 'Ciidan iyo booliisnimo xirfad leh oo aan qabiilka loo eegi. Maxkamado madax-bannaan oo aan siyaasaddu ku faragelin. Eber-dulqaad musuqmaasuqa dhammaan heerarka dowladda.' },
      { key: 'economy.title', label: 'Economy — Title',   defaultEn: 'Economy & Jobs', defaultSo: 'Dhaqaalaha & Shaqada' },
      { key: 'economy.summary',label:'Economy — Summary', multiline: true, defaultEn: 'Create 100,000 jobs in 4 years. Support small businesses with microloans. Modernize agriculture and fishing so Somalia feeds itself.', defaultSo: 'Abuur 100,000 shaqo oo 4 sano gudahood. Taageero ganacsiyada yar-yar ee amaahda yar-yar. Casriyeynta beeraha iyo kalluumaaysiga si ay Soomaaliya u quudinaan oo ay ka dheeraataan.' },
      { key: 'women.title',   label: "Women's Rights — Title",   defaultEn: "Women's Rights", defaultSo: 'Xuquuqda Haweenka' },
      { key: 'women.summary', label: "Women's Rights — Summary", multiline: true, defaultEn: 'At least 30% women in parliament and government offices. End gender-based violence as a national law. Equal pay and opportunity enshrined in law.', defaultSo: 'Ugu yaraan 30% haween ah ee baarlamaanka iyo xafiisyada dowladda. Dhammaad rabshadaha jinsiga ku saabsan ee sharci qaranka ah. Mushahar siman iyo fursad siman oo sharci ku dhisan.' },
      { key: 'diaspora.title',  label: 'Diaspora Policy — Title',   defaultEn: 'Diaspora Rights', defaultSo: 'Xuquuqda Qurbojoog' },
      { key: 'diaspora.summary',label: 'Diaspora Policy — Summary', multiline: true, defaultEn: 'Dual citizenship for all Somali diaspora. Online voter registration so diaspora can vote in elections. A dedicated ministry for Somalis abroad.', defaultSo: 'Dhalashada laba-geesood ee dhammaan qurbojoogta Soomaaliyeed. Diiwaangelinta cod-bixinta online si qurbojoogtu u codeeyaan doorashooyinka. Wasaarad u gaar ah adeegga Soomaalida dibedda.' },
      { key: 'housing.title',  label: 'Housing — Title',   defaultEn: 'Housing & Infrastructure', defaultSo: 'Guriyaha & Kaabayaasha' },
      { key: 'housing.summary',label: 'Housing — Summary', multiline: true, defaultEn: 'Build 50,000 affordable homes in cities. Road networks connecting all regional capitals. Clean water and electricity for every city by 2030.', defaultSo: 'Dhis 50,000 guryood oo qiimo jaban oo magaalooyinka. Wadooyinka gaadiidka oo xidha dhammaan caasimadaha gobolka. Biyo nadiif ah iyo korontada magaalada kasta 2030 kahor.' },
      { key: 'environment.title',  label: 'Environment — Title',   defaultEn: 'Environment', defaultSo: 'Deegaanka' },
      { key: 'environment.summary',label: 'Environment — Summary', multiline: true, defaultEn: 'Ban illegal charcoal export destroying forests. Plant 10 million trees by 2030. Protect Somalia\'s coastline from illegal foreign fishing.', defaultSo: 'Mamnuucida dhoofinta dhuxusha sharci-darro ah ee kaymo-beelinta. Beer 10 milyan oo geed 2030 kahor. Ilaalinta xeebaha Soomaaliya iyo khayraadka badda ee kalluumaaysiga shisheeye ee sharci-darrada ah.' },
      { key: 'tech.title',   label: 'Technology — Title',   defaultEn: 'Technology & Youth', defaultSo: 'Tknoolajiyada & Dhalinyarada' },
      { key: 'tech.summary', label: 'Technology — Summary', multiline: true, defaultEn: 'Free internet in all schools and public libraries. National tech hub in Mogadishu to train 10,000 young coders. Digital government services to reduce corruption and waiting times.', defaultSo: 'Internet bilaash ah dugsiyada iyo maktabadaha dadweynaha oo dhan. Xarun tknoolajiyad qaranka ah oo Muqdisho ku taal si ay 10,000 dhalinyaro oo code-yeeleyaal ah loo tababaro. Adeegyada dowladda ee dhijitaalka ah si loo yareeyo musuqmaasuqa iyo waqtiga sugitaanka.' },
      { key: 'clan.title',   label: 'Clan Equality — Title',   defaultEn: 'Clan Equality', defaultSo: 'Sinnaanta Qabiilka' },
      { key: 'clan.summary', label: 'Clan Equality — Summary', multiline: true, defaultEn: 'Abolish the 4.5 power-sharing system. Replace with one-person-one-vote democracy. Every citizen — regardless of clan — has equal rights before the law and the government.', defaultSo: 'Baabbi\'inta nidaamka wadaagga awooda 4.5. Ka beddel dimuqraadiyad hal-qof-hal-cod ah. Muwaadin kasta — qabiilkiisa ha noqdee — wuu leeyahay xaq siman sharciga iyo dowladda.' },
    ],
  },

  // ── RIGHTS ──────────────────────────────────────────────────────────────
  {
    page: 'rights',
    label: 'Constitutional Rights',
    icon: '⚖️',
    fields: [
      { key: 'page.title',    label: 'Page Title',    defaultEn: 'Constitutional Rights', defaultSo: 'Xuquuqda Dastuuriga' },
      { key: 'page.subtitle', label: 'Page Subtitle', multiline: true, defaultEn: 'Understanding your rights under the Somali Constitution — and how XTS fights to protect them.', defaultSo: 'Fahamka xuquuqdaada ee ku jirta Dastuurka Soomaaliya — iyo sida XTS u difaacayso.' },
      { key: 'equality.title',    label: 'Article — Equality Title',    defaultEn: 'Right to Equality (Article 11)', defaultSo: 'Xaqa Sinnaanta (Maqaalka 11)' },
      { key: 'equality.text',     label: 'Article — Equality Text',     multiline: true, defaultEn: 'Every citizen has equal rights regardless of tribe, gender, region, or religion. XTS demands this be actually enforced — not just written.', defaultSo: 'Muwaadin kasta wuxuu leeyahay xuquuq siman oo qabiilka, jinsiga, gobolka, ama diinta aysan loo eegin. XTS waxay dalbanaysaa in tan si dhab ah loo hirgaliyo — maahan oo keliya lagu qoro.' },
      { key: 'vote.title',        label: 'Article — Vote Title',        defaultEn: 'Right to Vote (Article 38)', defaultSo: 'Xaqa Codeynta (Maqaalka 38)' },
      { key: 'vote.text',         label: 'Article — Vote Text',         multiline: true, defaultEn: 'Every citizen aged 18+ has the right to vote in elections. The 4.5 clan system violates this right by making your clan — not your vote — determine your representation.', defaultSo: 'Muwaadin kasta oo 18+ jirta wuxuu leeyahay xaq u codeynta doorashooyinka. Nidaamka qabiilka 4.5 wuxuu xadgudbaa xuquuqdan iyadoo qabiilkaaga — ee cod-bixintaadu kugu matalayso.' },
      { key: 'expression.title',  label: 'Article — Expression Title',  defaultEn: 'Freedom of Expression (Article 18)', defaultSo: 'Xurriyadda Hadlista (Maqaalka 18)' },
      { key: 'expression.text',   label: 'Article — Expression Text',   multiline: true, defaultEn: 'Every person has the right to free speech, press freedom, and peaceful assembly. XTS will protect journalists and opposition voices.', defaultSo: 'Qof kastaa wuxuu leeyahay xaq hadal xor ah, xorriyadda saxaafadda, iyo shirarka nabad-gelyada ah. XTS waxay ilaalinaysaa saxafiyiinta iyo codadka mucaaradka.' },
      { key: 'minority.title',    label: 'Article — Minority Title',    defaultEn: 'Minority Rights (Article 36)', defaultSo: 'Xuquuqda Yar-yar (Maqaalka 36)' },
      { key: 'minority.text',     label: 'Article — Minority Text',     multiline: true, defaultEn: 'Minority groups are protected under the constitution. XTS will fight to ensure minority clans have full and equal political representation.', defaultSo: 'Kooxaha yar-yar waxaa ilaaliya dastuurka. XTS waxay u diriraysaa in qabiilada yar-yar ay helaan matalana buuxda oo sinnaanta ah ee siyaasadeed.' },
    ],
  },

  // ── SYSTEM ──────────────────────────────────────────────────────────────
  {
    page: 'system',
    label: 'How Somalia Works',
    icon: '🏛️',
    fields: [
      { key: 'page.title',    label: 'Page Title',    defaultEn: 'How Somalia Works', defaultSo: 'Nidaamka Soomaaliya' },
      { key: 'page.subtitle', label: 'Page Subtitle', multiline: true, defaultEn: 'A simple guide to Somalia\'s government structure — and what XTS wants to change.', defaultSo: 'Hagaha fudud ee qaab-dhismeedka dowladda Soomaaliya — iyo waxa XTS rabo in la beddelo.' },
      { key: 'federal.title', label: 'Federal Government — Title', defaultEn: 'The Federal Government', defaultSo: 'Dowladda Federaalka' },
      { key: 'federal.text',  label: 'Federal Government — Text',  multiline: true, defaultEn: 'Somalia is a Federal Republic. The federal government in Mogadishu manages defence, foreign affairs, and national policy. It is made up of the President, Prime Minister, Cabinet, and two houses of parliament.', defaultSo: 'Soomaaliya waa Jamhuuriyad Federaal. Dowladda federaalka ee Muqdisho ayaa maamusho difaaca, arrimaha dibadda, iyo siyaasadda qaranka. Waxaa ka kooban Madaxweynaha, Ra\'iisul Wasaaraha, Golaha Wasiirada, iyo labada gole ee baarlamaanka.' },
      { key: 'problem.title', label: '4.5 Problem — Title', defaultEn: 'The 4.5 Problem', defaultSo: 'Dhibaatada 4.5' },
      { key: 'problem.text',  label: '4.5 Problem — Text',  multiline: true, defaultEn: 'The 4.5 clan power-sharing system means your clan determines your political power — not your vote, not your merit. XTS wants to replace this with true one-person-one-vote democracy.', defaultSo: 'Nidaamka qabiilka 4.5 ee wadaagga awooda waxaa uu ka dhigayaa qabiilkaaga mid go\'aamiya awooda siyaasadeedaada — ma aha codkaaga, ma aha sharafta. XTS waxay doonaysaa in tan lagu beddesho dimuqraadiyad dhabta ah oo hal-qof-hal-cod ah.' },
      { key: 'xts.title',    label: 'XTS Reform — Title', defaultEn: 'What XTS Will Change', defaultSo: 'Waxa XTS Beddeli Doonto' },
      { key: 'xts.text',     label: 'XTS Reform — Text',  multiline: true, defaultEn: 'Replace 4.5 with direct elections. Strengthen federal member states with real budgets. Transparent budgets published monthly. Independent judiciary appointed on merit.', defaultSo: 'Ka beddel 4.5 doorashooyin toos ah. Xooji dowladaha xubnaha federaalka oo haya miisaaniyad dhabta ah. Miisaaniyado shafafan oo bishiiba la daabicaa. Garsoor madaxbanaan oo sharafta loo magacaabo.' },
    ],
  },

  // ── UNITY ───────────────────────────────────────────────────────────────
  {
    page: 'unity',
    label: 'Clan-Neutral Unity',
    icon: '🤝',
    fields: [
      { key: 'page.title',    label: 'Page Title',    defaultEn: 'Clan-Neutral Unity', defaultSo: 'Midnimada Aan Qabiilka Lahayn' },
      { key: 'page.subtitle', label: 'Page Subtitle', multiline: true, defaultEn: 'Somalia\'s biggest obstacle to peace and progress is clan politics. XTS is the only party that stands for every Somali equally.', defaultSo: 'Caqabadda ugu weyn ee Soomaaliya ee nabadda iyo horumarku waa siyaasadda qabiilka. XTS waa xisbi keliya oo si siman u taagan Soomaalida oo dhan.' },
      { key: 'why.title', label: 'Why Clan Unity Matters — Title', defaultEn: 'Why Clan Neutrality Matters', defaultSo: 'Sababta Muhiimka ah ee Sinnaanta Qabiilka' },
      { key: 'why.text',  label: 'Why Clan Unity Matters — Text',  multiline: true, defaultEn: 'When political power depends on which clan you belong to, merit, education, and good governance all suffer. XTS builds a Somalia where your ideas and your work — not your clan name — determine what you can achieve.', defaultSo: 'Marka awooda siyaasadeed ay ku xidnaato qabiilka aad ka tirsan tahay, sharafta, waxbarashada, iyo maamulka wanaagsan oo dhan ayaa dhibaataysa. XTS waxay dhisaysaa Soomaali halka fikradahaagu iyo shaqadaadu — ma aha magaca qabiilkaaga — go\'aamiyaan waxa aad gaadhsiisan kartid.' },
      { key: 'pledge.title', label: 'XTS Pledge — Title', defaultEn: 'The XTS Pledge on Unity', defaultSo: 'Ballanqaadka XTS ee Midnimada' },
      { key: 'pledge.text',  label: 'XTS Pledge — Text',  multiline: true, defaultEn: 'No XTS candidate or official will ever use clan language in their campaigns. All XTS positions are merit-based. All Somali clans are equally welcome in XTS.', defaultSo: 'Musharax ama saraakiil XTS ah ma isticmaali doono luqadda qabiilka olalahoodda. Dhammaan xilalka XTS sharafta ayay ku salaysan yihiin. Dhammaan qabiilada Soomaaliyeed si siman ayay XTS uga soo dhowayn.' },
    ],
  },

  // ── STATES ──────────────────────────────────────────────────────────────
  {
    page: 'states',
    label: 'Federal States',
    icon: '🗺️',
    fields: [
      { key: 'page.title',    label: 'Page Title',    defaultEn: 'Federal States of Somalia', defaultSo: 'Gobolada Federaalka ee Soomaaliya' },
      { key: 'page.subtitle', label: 'Page Subtitle', multiline: true, defaultEn: 'Somalia\'s federal system gives power to regional governments. XTS will make these states stronger, more transparent, and truly accountable to their citizens.', defaultSo: 'Nidaamka federaalka Soomaaliya wuxuu awood siinayaa dowladaha goboleed. XTS waxay ka dhigi doontaa gobolladaas kuwo awood badan, shafafan, oo si dhab ah looga xisaabtami karo muwaadiniintooda.' },
      { key: 'xts.title', label: 'XTS Plan for States — Title', defaultEn: 'XTS Plan for Federal States', defaultSo: 'Qorshaha XTS ee Gobolada Federaalka' },
      { key: 'xts.text',  label: 'XTS Plan for States — Text',  multiline: true, defaultEn: 'Each federal state will receive a guaranteed minimum budget from the federal government. State governors will be directly elected by citizens — not appointed. Each state will publish monthly spending reports.', defaultSo: 'Gobol federaal kasta wuxuu heli doonaa miisaaniye ugu yaraan laga dammaanad qaado ee dowladda federaalka. Guddoomiyeyaasha gobolka si toos ah ayaa loo dooran doonaa muwaadiniintu — ma aha in la magacaabo. Gobol kasta wuxuu daabici doonaa warbixinnada kharashka bishiiba.' },
    ],
  },

  // ── DIASPORA ────────────────────────────────────────────────────────────
  {
    page: 'diaspora',
    label: 'Diaspora (Qurbojoog)',
    icon: '✈️',
    fields: [
      { key: 'page.title',    label: 'Page Title',    defaultEn: 'Somali Diaspora', defaultSo: 'Qurbojoogta Soomaaliyeed' },
      { key: 'hero.heading',  label: 'Hero Heading',  defaultEn: 'The Diaspora Is Part of Somalia', defaultSo: 'Qurbojoogtu Waa Qayb Ka Mid Ah Soomaaliya' },
      { key: 'hero.text',     label: 'Hero Text', multiline: true, defaultEn: 'Whether you are in Minneapolis, London, or Dubai — XTS is your party. The diaspora sends billions to Somalia every year. It is time for your political voice to be heard.', defaultSo: 'Mineaapolis, London, ama Dubai ha joogteen — XTS xisbigaaga ayuu yahay. Qurbojoogtu sannad kasta bilyan ayay u diraysaa Soomaaliya. Hadda waa waqtiga cod-haynta siyaasaddeeda la maqlo.' },
      { key: 'commitments.title', label: 'Commitments Section Title', defaultEn: 'XTS Commitments to the Diaspora', defaultSo: 'Ballanqaadyada XTS ee Qurbojoogta' },
      { key: 'connect.title',     label: 'Connect Section Title',     defaultEn: 'Connect With XTS Diaspora', defaultSo: 'La Xiriir XTS Qurbojoog' },
      { key: 'register.title',    label: 'Registration Card Title',   defaultEn: 'Register Diaspora Wing', defaultSo: 'Diiwaangeli Qaybta Qurbojoog' },
      { key: 'register.desc',     label: 'Registration Card Text', multiline: true, defaultEn: 'Start an official XTS chapter in your city. Contact us to get registered, receive materials, and connect with the national party structure.', defaultSo: 'Bilow qaybta rasmi ah ee XTS magaalaadaada. Nala xiriir si aad u diiwaangashan tahay, agabka hesho, oo lala xidho qaab-dhismeedka xisbiga qaranka.' },
    ],
  },

  // ── WOMEN ───────────────────────────────────────────────────────────────
  {
    page: 'women',
    label: "Women's Wing",
    icon: '👩',
    fields: [
      { key: 'page.title',    label: 'Page Title',    defaultEn: "Women's Wing", defaultSo: 'Goobta Haweenka' },
      { key: 'page.subtitle', label: 'Page Subtitle', multiline: true, defaultEn: 'XTS believes women are equal partners in building Somalia\'s future. Our Women\'s Wing fights for equal rights, equal opportunities, and a political voice for every Somali woman.', defaultSo: 'XTS waxay aaminsan tahay in haweenku ay la-joogaan dhisidda mustaqbalka Soomaaliya. Goobta Haweenkeenna waxay u diriraysaa xuquuq siman, fursad siman, iyo cod siyaasadeed oo haween Soomaaliyeed kasta.' },
      { key: 'join.cta',  label: 'Join Button Text', defaultEn: "Join the Women's Wing", defaultSo: 'Ku Biir Goobta Haweenka' },
    ],
  },

  // ── YOUTH ───────────────────────────────────────────────────────────────
  {
    page: 'youth',
    label: 'Youth Wing',
    icon: '🧑',
    fields: [
      { key: 'page.title',    label: 'Page Title',    defaultEn: 'Youth Wing', defaultSo: 'Goobta Dhalinyarada' },
      { key: 'page.subtitle', label: 'Page Subtitle', multiline: true, defaultEn: 'Somalia\'s youth are not the future — they are the present. XTS Youth Wing empowers young Somalis to lead, advocate, and build the country they deserve.', defaultSo: 'Dhalinyarada Soomaaliya ma aha mustaqbalka — waa hadda. Goobta Dhalinyarada XTS waxay xoojinaysaa dhalinyarada Soomaaliyeed si ay u hoggaamiyaan, u doortaan, oo ay u dhisaan dalka ay mudan yihiin.' },
      { key: 'join.text', label: 'Join Call to Action', multiline: true, defaultEn: 'Join XTS Youth Wing and help build the Somalia your generation deserves.', defaultSo: 'Ku biir Goobta Dhalinyarada XTS oo ka caawi dhisidda Soomaaliya ee jiilkaagu layaabka u leh.' },
    ],
  },

  // ── CONTACT ─────────────────────────────────────────────────────────────
  {
    page: 'contact',
    label: 'Contact Page',
    icon: '📞',
    fields: [
      { key: 'page.title',    label: 'Page Title',    defaultEn: 'Contact Us', defaultSo: 'Na la Xiriir' },
      { key: 'page.subtitle', label: 'Page Subtitle', multiline: true, defaultEn: 'Have a question, want to partner, or need to reach our team? Fill in the form below or use our direct contact details.', defaultSo: 'Su\'aal ma qabtaa, shirikaad rabtaa, ama kooxdayada la xiriir rabtaa? Buuxi foomka hoose ama isticmaal macluumaadka xiriirka tooska ah.' },
      { key: 'address.label', label: 'Address Label',  defaultEn: 'Main Office', defaultSo: 'Xafiiska Dhexe' },
      { key: 'address.value', label: 'Office Address',  defaultEn: 'Mogadishu, Somalia', defaultSo: 'Muqdisho, Soomaaliya' },
      { key: 'phone.label',   label: 'Phone Label',    defaultEn: 'Phone', defaultSo: 'Telefoon' },
      { key: 'phone.value',   label: 'Phone Number',   defaultEn: '+252 61 000 0000', defaultSo: '+252 61 000 0000' },
      { key: 'email.label',   label: 'Email Label',    defaultEn: 'Email', defaultSo: 'Iimayl' },
      { key: 'email.value',   label: 'Contact Email',  defaultEn: 'info@xts-party.so', defaultSo: 'info@xts-party.so' },
    ],
  },

  // ── PRESS ───────────────────────────────────────────────────────────────
  {
    page: 'press',
    label: 'Press Room',
    icon: '📰',
    fields: [
      { key: 'page.title',    label: 'Page Title',    defaultEn: 'Press Room', defaultSo: 'Qolka Saxaafadda' },
      { key: 'page.subtitle', label: 'Page Subtitle', multiline: true, defaultEn: 'Materials, statements, and contact for journalists and media covering XTS and Somali politics.', defaultSo: 'Agabka, bayaanadda, iyo xiriirka saxafiyiinta iyo warbaahinta daboolaysa XTS iyo siyaasadda Soomaaliya.' },
      { key: 'contact.title', label: 'Press Contact Title', defaultEn: 'Press Contact', defaultSo: 'Xiriirka Saxaafadda' },
      { key: 'contact.email', label: 'Press Email',         defaultEn: 'press@xts-party.so', defaultSo: 'press@xts-party.so' },
      { key: 'contact.phone', label: 'Press Phone',         defaultEn: '+252 61 000 0000', defaultSo: '+252 61 000 0000' },
    ],
  },

  // ── BRANCHES ────────────────────────────────────────────────────────────
  {
    page: 'branches',
    label: 'Branch Offices',
    icon: '📍',
    fields: [
      { key: 'page.title',    label: 'Page Title',    defaultEn: 'Branch Offices', defaultSo: 'Xafiisyada Laanta' },
      { key: 'page.subtitle', label: 'Page Subtitle', multiline: true, defaultEn: 'XTS operates across Somalia and internationally. Find your nearest office or diaspora chapter below.', defaultSo: 'XTS waxay ka hawlgashaa Soomaaliya oo dhan iyo caalamka. Ka hel xafiiskaaga ugu dhow ama qaybta qurbojoogta hoose.' },
    ],
  },

  // ── FAQ ─────────────────────────────────────────────────────────────────
  {
    page: 'faq',
    label: 'FAQ Page',
    icon: '❓',
    fields: [
      { key: 'page.title',    label: 'Page Title',    defaultEn: 'Frequently Asked Questions', defaultSo: "Su'aalaha Badanaa La Is Weydiiyo" },
      { key: 'page.subtitle', label: 'Page Subtitle', multiline: true, defaultEn: 'Everything you need to know about XTS, membership, and how to get involved.', defaultSo: 'Wax walba oo aad u baahan tahay in aad ka ogaato XTS, xubinnimada, iyo sida aad uga qayb qaadan kartid.' },
    ],
  },

  // ── EVENTS ──────────────────────────────────────────────────────────────
  {
    page: 'events',
    label: 'Events Page',
    icon: '📅',
    fields: [
      { key: 'page.title',    label: 'Page Title',    defaultEn: 'Events', defaultSo: 'Dhacdooyinka' },
      { key: 'page.subtitle', label: 'Page Subtitle', multiline: true, defaultEn: 'Join XTS events across Somalia and the diaspora — rallies, town halls, volunteer drives, and more.', defaultSo: 'Ku soo biir dhacdooyinka XTS ee Soomaaliya oo dhan iyo qurbojoogta — xafladaha, shirarka bulshada, hawlgalada iskaa-wax-u-qabsiga, iyo kuwo kale.' },
    ],
  },

  // ── GALLERY ─────────────────────────────────────────────────────────────
  {
    page: 'gallery',
    label: 'Gallery Page',
    icon: '🖼️',
    fields: [
      { key: 'page.title',    label: 'Page Title',    defaultEn: 'Media Gallery', defaultSo: 'Sawirrada Warbaahinta' },
      { key: 'page.subtitle', label: 'Page Subtitle', multiline: true, defaultEn: 'Photos and media from XTS events, rallies, and community gatherings across Somalia and the diaspora.', defaultSo: 'Sawirrada iyo warbaahinta dhacdooyinka XTS, xafladaha, iyo kulmida bulshada Soomaaliya oo dhan iyo qurbojoogta.' },
    ],
  },

  // ── NIEC ────────────────────────────────────────────────────────────────
  {
    page: 'niec',
    label: 'Voter Registration',
    icon: '🗳️',
    fields: [
      { key: 'page.title',    label: 'Page Title',    defaultEn: 'Voter Registration', defaultSo: 'Diiwaangelinta Codeynta' },
      { key: 'page.subtitle', label: 'Page Subtitle', multiline: true, defaultEn: 'Register to vote and make your voice count in Somalia\'s elections. XTS will guide you through the process.', defaultSo: 'Isdiiwaangeli si aad u codeeyso oo cod-haynta doorashooyinka Soomaaliya u sameyso. XTS waxay kugu hagi doontaa hannaanka.' },
    ],
  },

  // ── VOLUNTEER ───────────────────────────────────────────────────────────
  {
    page: 'volunteer',
    label: 'Volunteer Page',
    icon: '🙋',
    fields: [
      { key: 'page.title',    label: 'Page Title',    defaultEn: 'Volunteer & Canvass', defaultSo: 'Iskaa Wax u Qabso & Xooge' },
      { key: 'page.subtitle', label: 'Page Subtitle', multiline: true, defaultEn: 'Change happens when people get involved. Volunteer with XTS — knock on doors, share on social media, help at events, or join our canvassing team.', defaultSo: 'Isbeddelu wuxuu dhacaa marka dadku ka qayb qaadaan. Iskaa-wax-u-qabso XTS — garaac albaabada, ku wadaag baraha bulshada, ka caawi dhacdooyinka, ama ku biir kooxda ololayaasheena.' },
    ],
  },

  // ── PETITION ────────────────────────────────────────────────────────────
  {
    page: 'petition',
    label: 'Petitions Page',
    icon: '✍️',
    fields: [
      { key: 'page.title',    label: 'Page Title',    defaultEn: 'Petitions', defaultSo: 'Codsiyo' },
      { key: 'page.subtitle', label: 'Page Subtitle', multiline: true, defaultEn: 'Sign XTS petitions to push for real change in Somalia. Every signature sends a message to decision-makers.', defaultSo: 'Saxeex codsiyada XTS si aad u gacan-siisid isbeddel dhab ah Soomaaliya. Saxiixa kasta fariin ayuu u diraysaa go\'aan-qaatayaasha.' },
    ],
  },

  // ── CANDIDATES ──────────────────────────────────────────────────────────
  {
    page: 'candidates',
    label: 'Candidates Page',
    icon: '🏅',
    fields: [
      { key: 'page.title',    label: 'Page Title',    defaultEn: 'Our Candidates', defaultSo: 'Musharaxiideena' },
      { key: 'page.subtitle', label: 'Page Subtitle', multiline: true, defaultEn: 'Meet the XTS candidates running for office across Somalia — selected for merit, not clan affiliation.', defaultSo: 'Kulan musharaxiida XTS ee u tartamaya xilalka Soomaaliya oo dhan — loo doortay sharafta, ma aha xidhiidhka qabiilka.' },
    ],
  },

  // ── REPRESENTATIVES ─────────────────────────────────────────────────────
  {
    page: 'representatives',
    label: 'Representatives',
    icon: '🏅',
    fields: [
      { key: 'page.title',    label: 'Page Title',    defaultEn: 'Our Representatives', defaultSo: 'Wakiiladeena' },
      { key: 'page.subtitle', label: 'Page Subtitle', multiline: true, defaultEn: 'XTS representatives across Somalia — serving the people, not the clan.', defaultSo: 'Wakiilada XTS ee Soomaaliya oo dhan — u adeegaya shacabka, ma aha qabiilka.' },
    ],
  },

  // ── NEWS ────────────────────────────────────────────────────────────────
  {
    page: 'news',
    label: 'News Page',
    icon: '📰',
    fields: [
      { key: 'page.title',    label: 'Page Title',    defaultEn: 'Latest News', defaultSo: 'Wararka Ugu Dambeeyay' },
      { key: 'page.subtitle', label: 'Page Subtitle', multiline: true, defaultEn: 'The latest updates from XTS — party news, policy announcements, and events coverage.', defaultSo: 'Wararkii ugu dambeeyay ee XTS — wararka xisbiga, dhawaaqyada siyaasadeed, iyo daabacaadda dhacdooyinka.' },
    ],
  },

  // ── MEDIA ───────────────────────────────────────────────────────────────
  {
    page: 'media',
    label: 'Videos & Media',
    icon: '🎥',
    fields: [
      { key: 'page.title',    label: 'Page Title',    defaultEn: 'Videos & Media', defaultSo: 'Fiidiyowyada & Warbaahinta' },
      { key: 'page.subtitle', label: 'Page Subtitle', multiline: true, defaultEn: 'Watch XTS speeches, debates, event coverage and documentary content about Somalia\'s political future.', defaultSo: 'Daawo hadalkii XTS, doodaha, daabacaadda dhacdooyinka iyo qodobada dokumaynteerka ah ee ku saabsan mustaqbalka siyaasadeed ee Soomaaliya.' },
    ],
  },
];

// Helper: get schema for a page
export function getPageSchema(page: string): PageSchema | undefined {
  return CONTENT_SCHEMA.find(s => s.page === page);
}

// Helper: build a default content map { 'section.key': { en: '...', so: '...' } }
export function getDefaultContent(page: string): Record<string, { en: string; so: string }> {
  const schema = getPageSchema(page);
  if (!schema) return {};
  const map: Record<string, { en: string; so: string }> = {};
  for (const field of schema.fields) {
    map[field.key] = { en: field.defaultEn, so: field.defaultSo };
  }
  return map;
}
