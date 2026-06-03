import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('XTS@Admin2025!', 12);

  await prisma.adminUser.upsert({
    where: { email: 'admin@xts-party.so' },
    update: {},
    create: {
      email: 'admin@xts-party.so',
      password,
      name: 'XTS Administrator',
      role: 'SUPER_ADMIN',
    },
  });

  // Delete old posts so we can re-seed with better content
  await prisma.newsPost.deleteMany({});

  await prisma.newsPost.createMany({
    data: [
      // ── Article 1: Founding Story ─────────────────────────────────────────
      {
        titleEn: 'Why XTS Was Born: A Movement Built From the Ground Up',
        titleSo: 'Sababta XTS Loogu Aasaasay: Dhaqdhaqaaq Ka Dhashay Shacabka',
        excerpt: `XTS was not born in a palace or a foreign capital. It was born in the dust of Mogadishu's streets, in the silence of unemployment, and in the grief of a generation watching their country suffer.`,
        contentEn: `XTS was not born in a palace or a foreign capital. It was born in the dust of Mogadishu's streets, in the silence of unemployment, and in the grief of a generation watching their country suffer.

The founder of Xisbiga Tallaabada Shacabka grew up understanding what it truly means to struggle. He worked early morning shifts under the blazing Somali sun just to earn enough for a meal. He waited tables in a small restaurant while watching politicians eat lavishly at nearby hotels, promising change they never delivered. He witnessed a neighbour — a young man with a disability — denied basic government services because he could not afford to bribe officials. He studied by candlelight when the city's power grid failed again. He lived alone, far from family, carrying the weight of a broken system on his shoulders every single day.

But he did not become bitter. He became determined.

In 2026, after years of watching Somalia's crises deepen — the youth drowning in the Mediterranean trying to escape hopelessness, the 3.9 million displaced from their homes, the corruption that stole from the poorest citizens — he decided that silence was no longer an option.

"I am not a politician," he said when founding the party. "I am a Somali. And every Somali who has suffered deserves someone who has felt that same pain standing up for them."

Xisbiga Tallaabada Shacabka — The People's Progress Party — was registered in 2026 with a single founding principle: Somalia belongs to its people, not its elites. Every policy XTS proposes, every promise XTS makes, comes directly from the real experiences of real Somali people.

This is not a party of the powerful. It is a party of the fisherman, the student, the disabled worker, the single mother, the unemployed graduate, and the refugee dreaming of home.

Somalia's change will not come from outside. It will come from within — from people who have lived the struggle and refuse to accept that this is all their country can be.

XTS is that refusal. And it is just getting started.`,
        contentSo: `XTS kuma dhalan guri qurxoon ama caasimad ajnabiyeed. Waxay ka dhashay boodhadhka jidadka Muqdisho, aamusnaan shaqo-la'aanta, iyo murugada jiil araya dalkooda xanuunsan.

Aasaasaha Xisbiga Tallaabada Shacabka wuxuu kobcay isagoo si dhab ah u fahmaya macnaha halista. Wuxuu shaqeyn jiray saacadihii hore ee subaxnimada oo qorraxda Soomaaliyeed ee kulul ku dhacayso si uu u helayo lacag cuntada u filan. Wuxuu marinkiyo meel cunno-kariye yar ah si uu uga dheceeyо siyaasiyiinta cuntada dabacsan ee hudheelada u dhow cuna, ballan siinaya isbedel uusan waligiis waafajin. Wuxuu arkay deriskii — nin yar oo naafo ah — oo laga diday adeegyada dowladda aasaasiga ah maxaa yeelay uusan awoodi karin in uu lacag siiya mas'uuliyiinta.

Laakiin ma noqon mid murugo leh. Wuxuu noqday mid go'aan leh.

Sanadkii 2026-kii, ka dib sanado fara badan oo uu arkay dhibaatooyinka Soomaaliya oo sii xoqaya — dhalinyarada ku dhex dammanaynta Badda Medditerranean iyagoo ka cararaya yaabku, 3.9 milyan oo guri ka barakacay, musuqmaasuqka xaday shacabka ugu faqriga — wuxuu go'aansaday in aamusnaan aanay dib dhici karin.

"Aniga ma aha siyaasi," ayuu yidhi markii uu xisbiga aasaasay. "Aniga waxaan ahay Soomaali. Soomaali kasta oo xanuunsaday wuxuu mudan yahay in qof dareemay xanuunkii la mid ah uu u taagan yahay."

Xisbiga Tallaabada Shacabka waxaa lagu diiwaangeliyay 2026-kii iyada oo leh mabda' aasaas ah keliya: Soomaaliya waxay u leedahay shacabkeeda, ma aha ganacsatada. Siyaasad kasta oo XTS soo jeediso, ballan kasta oo XTS bixiso, waxay si toos ah uga timaadaa waayo-aragnimadii dhabta ahayd ee dadka Soomaaliyeed ee dhabta ah.

Tanu ma aha xisbi xoog leh. Waa xisbi kalluumaysataha, ardayga, shaqaalaha naafonimada qaba, hooyadda keliya, qofka waxbarashada heysta laakiin shaqada kaga waayay, iyo qaxootiga riyoonaya gurigiisa.

Isbedelka Soomaaliya kuma yimaado dibadda. Wuxuu ka yimaadaa gudaha — dadka noolaaday halganka oo diidanaya in tani ay tahay waxa kaliya ee dalkoodu noqon karo.

XTS waa diidmadaasi. Waxaana ay aad u horeeyaan.`,
        published: true,
      },

      // ── Article 2: Mediterranean Crisis ──────────────────────────────────
      {
        titleEn: "Somalia's Youth Are Drowning — XTS Says Enough",
        titleSo: "Dhalinyarada Soomaaliya Waxay Ku Dammanaynayaan Badda — XTS Waxay Tidhi Ku Filan",
        excerpt: 'Over 2,333 migrants died in the Mediterranean in 2024 alone. Many were young Somali men and women fleeing unemployment and hopelessness. XTS demands this stops — by building real opportunity inside Somalia.',
        contentEn: `Over 2,333 people died in the Mediterranean Sea in 2024 alone, according to the International Organization for Migration. The Central Mediterranean route — from Libya to Italy — claimed 1,699 of those lives. Many of them were young Somali men and women who saw no future at home.

This is not a migration story. This is a failure of governance story.

When 67% of Somali youth cannot find work, when schools lack teachers, when hospitals lack medicine, when corruption consumes every public institution — young people do not choose to risk the sea. They are pushed there by a system that has abandoned them.

The journey from Somalia to Libya alone is a nightmare. Young people cross through Ethiopia, Sudan, and the Sahara Desert — a journey that takes months and costs everything they have. In Libya, they are detained in camps where violence, trafficking, and abuse are routine. Then they are forced onto overcrowded rubber boats and told to hope.

Many do not make it.

XTS refuses to accept this as normal. Our response is concrete:

First, we will create 500,000 jobs through infrastructure investment, technology, and vocational training — giving youth a reason to stay.

Second, we will build a national youth entrepreneurship fund, providing small loans to Somali youth who want to start businesses.

Third, we will launch an emergency diplomatic campaign to improve conditions for Somali migrants currently stranded in Libya and to open safe return corridors.

No young Somali should have to choose between drowning and a life with no future. XTS is building the third option: a Somalia worth staying for.

The Mediterranean will stop claiming Somali lives when Somalia starts offering Somali lives a future. That is our promise.`,
        contentSo: `In ka badan 2,333 qof ayaa ku dhintay Badda Medditerranean oo kaliya sanadkii 2024-kii, sida ay sheegtay Hay'adda Caalamiga ee Socdaalka. Waddada Badda Medditerranean ee Dhexe — Libya ilaa Talyaaniga — waxay qaadatay 1,699 ka mid ah nafaahaaas. Kuwaas badan waxay ahaayeen dhalinyaro Soomaaliyeed oo wiil iyo gabdhood ah oo mustaqbal kuma arkin dalkooda.

Tanu ma aha sheeko socdaal. Waa sheeko fashil xukuumad.

Markay 67% dhalinyarada Soomaaliyeed shaqo heli kari waayaan, markay dugsiyadu macallimiin la'yihiin, markay isbitaalladu daawo la'yihiin, markay musuqmaasuqu cunaan hay'ad kasta oo guud — dhalinyaradu xiligan kama dooranayaan khatarta badda. Waxaa riixaya nidaam iska daayay.

Safarka laga bilaabo Soomaaliya ilaa Libya oo keliya waa xamar. Dhalinyarada waxay maraan Itoobiya, Suudaan, iyo Saxaraha — safar dhawr bilood qaata oo kharash ku leh wax kasta oo ay leeyihiin. Libya, waxaa lagu haystaa xero ay ku caadi tahay rabshad, dadkufsiga, iyo dulmi. Kadibna waxaa lagu qasbaa doonyaha goomaarka oo buuxa loona yidhaahdo "rajaynta."

Badan baa gaartaa.

XTS waxay diidaysaa in tani ay caadi u noqoto. Jawaabteenu waa la taaban karo:

Marka hore, waxaan abuuraynnaa 500,000 shaqo iyada oo loo marayo maalgashiga kaabayaasha, teknoolojiyada, iyo tababarka xirfadlaha — dhalinyaradana siineysa sababta ay ku joogaan.

Marka labaad, waxaan dhisi doonaa sanduuqa kaabista shirkadaha dhalinyarada qaranka, adigoo siinaya deynta yar dhalinyarada Soomaaliyeed ee raba in ay shirkado furayaan.

Marka saddexaad, waxaan bilaabi doonaa ololaha diblomaasiyadda degdegga ee si loo hagaajiyo xaaladaha socdaalayaasha Soomaaliyeed ee hadda ku xidhan Libya iyo in la furo jidadka soo noqoshada nabadda ah.

Dhalinin Soomaaliyeed kama ubaahna in ay u dooranaan dhimashada badda iyo nolol mustaqbal la'aan. XTS waxay dhisaysaa doorashada saddexaad: Soomaaliya mudan in lagu sugo.

Badda Medditerranean waxay joojin doontaa in ay nafaha Soomaaliyeed qaadato markay Soomaaliya bilaabto in ay nafaha Soomaaliyeed siiso mustaqbal. Taasi waa ballanqaadkeenna.`,
        published: true,
      },

      // ── Article 3: IDP Crisis ────────────────────────────────────────────
      {
        titleEn: '3.9 Million Displaced: XTS Pledges to Bring Every Family Home',
        titleSo: '3.9 Milyan Oo Barakacay: XTS Waxay Ballanqaadaysaa In Qoys Kasta Loo Celiyo Gurigiisa',
        excerpt: `Somalia has one of the world's largest internally displaced populations — 3.9 million people forced from their homes by conflict, drought, and floods. XTS has a concrete plan to resettle every family.`,
        contentEn: `Somalia is home to one of the world's largest internally displaced populations. According to UNHCR, 3.9 million Somalis are currently living as internally displaced persons — forced from their homes by conflict, drought, and flooding. In 2024 alone, 342,000 more people were displaced in just eight months.

80% of the displaced are women and children.

These are not statistics on a page. These are mothers who fled in the night with nothing but their children. These are farmers who watched their crops burn in drought. These are families who built homes with their own hands, only to see them swept away in floods. These are people who had lives, had hopes, had futures — until they didn't.

XTS visited IDP camps in Baidoa, Mogadishu, and Kismayo. What we saw was not acceptable in any nation that calls itself functional. Overcrowded shelters with no sanitation. Children with no schooling. Adults with no work permits in cities that don't want them. Families living in this condition not for days or weeks — but for years. Decades.

Somalia's displacement crisis is not unsolvable. It requires political will, planning, and investment — three things the current system has failed to provide. XTS's National Return and Resettlement Plan includes:

Rebuilding destroyed towns and villages in liberated areas, providing safe housing before asking families to return.

Establishing a Displaced Persons Commission with the power to allocate land, provide documentation, and coordinate services across regions.

Launching a National Emergency Employment Program in resettlement areas, so that returning families have income from day one.

Partnering with UNHCR, OCHA, and international donors to fund the programme transparently.

Somalia cannot move forward while 3.9 million of its people are stuck in limbo. When XTS governs, no Somali family will spend another decade in a camp. Every displaced Somali deserves a home — their own home — in their own country.

This is not charity. This is justice. And it is XTS's first commitment.`,
        contentSo: `Soomaaliya waxay haysataa mid ka mid ah tirada ugu badan ee barakacayaasha gudaha adduunka. Sida ay sheegtay UNHCR, 3.9 milyan Soomaali ah ayaa hadda ugu nool ahaan barakacayaasha gudaha — oo laga eriyay guryahooda colaad, abaar, iyo daad dartood. Sanadkii 2024-kii oo keliya, 342,000 qof oo dheeraad ah ayaa lagu barakiciyay oo kaliya siddeed bilood gudahood.

80% barakacayaasha waxay yihiin haween iyo carruur.

Kuwani ma aha tiro warqad ku taal. Kuwani waa hooyooyin baxday habeenkii iyagoo leh gaar ahaan caruurtooda. Kuwani waa beeralayda daawada beerashadeeda oo abaar gubaysay. Kuwani waa qoysas dhisay guryahooda gacmahooda, oo kaliya si daadu u qaaddo. Kuwani waa dad nolol lahaayeen, rajo lahaayeen, mustaqbal lahaayeen — ilaa uusan jirin.

XTS waxay booqatay xeradaha barakacayaasha Baydhabo, Muqdisho, iyo Kismaayo. Waxa aannay aragnay lama aqbali karo wadan iska yidhaahda shaqaynaya. Aqoonsiga xad-dhaaf ah oo nadiifayn la'aan. Carruur dugsiga la'anta. Dadweyne aan ruqsad shaqo lahayn magaalooyinka aan rabsanin. Qoysas ku nool xaaladdan ma aha maalmood ama todobaadyo — laakiin sanado. Tobankii sano.

Dhibaatada barakacada Soomaaliya lama xallin karo ma aha. Waxay u baahan tahay rabitaan siyaasadeed, qorsheyn, iyo maalgashin — saddex waxyaalood oo nidaamka hadda ku guuldareystay in uu bixiyo. Qorshaha Soo-noqoshada iyo Dib-u-dejinta Qaranka ee XTS wuxuu ka kooban yahay:

Dib u dhisidda tuulooyinka iyo degaanada burburay ee goobaha la xoreeyay, si guryaha nabadda ah loo bixiyo ka hor inta qoysaska la codsanin in ay soo noqdaan.

Aasaasidda Guddida Barakacayaasha oo awood u leh in ay dhul u qaybiso, waraaqdaha goo'amiso, oo adeegyada ka koordiniyaan gobolada oo dhan.

Bilaabidda Barnaamijka Xaaladda Degdegga ee Shaqada Qaranka ee goobaha dib-u-dejinta, si qoysaska soo noqda ay dakhli u yeeshaan maalintii koobaad.

Iskaashiga UNHCR, OCHA, iyo deeqayaasha caalamiga si barnaamijka si shaaffaysan loogu maalgeliyo.

Soomaaliya sii dhicin kartaa hore halka 3.9 milyan shacabkeeda ay ku xidsan yihiin xaalad liita. Marka XTS xukumo, qoys Soomaaliyeed kuma noolaan doono toban sano kale xero. Soomaali kasta oo barakacay wuxuu mudan yahay guri — gurigiisa gaarka ah — dalalkiisa gaarka ah.

Tani ma aha sadaqo. Tani waa caddaalad. Waxayna tahay ballanqaadkii ugu horreeya ee XTS.`,
        published: true,
      },

      // ── Article 4: XTS Youth Program ─────────────────────────────────────
      {
        titleEn: 'XTS Launches National Youth Employment Drive — 500,000 Jobs by 2030',
        titleSo: 'XTS Waxay Bilaabaysaa Qorshe Shaqo Dhalinyarada — 500,000 Shaqo Sanadka 2030-ka Ka Hor',
        excerpt: 'With 33.9% youth unemployment according to World Bank data, XTS is announcing a five-year plan to create half a million jobs across Somalia through infrastructure, technology, and skills training.',
        contentEn: `According to the World Bank and International Labour Organization, Somalia's youth unemployment rate stands at 33.9% — and when informal underemployment is counted, the real figure is significantly higher. This means that out of every three young Somalis of working age, at least one has no job, no income, and no clear path forward.

This is not a minor economic problem. This is a national emergency.

When young people have no work, they have three choices: wait in poverty, attempt the deadly journey to Europe, or join armed groups that offer money and a sense of belonging. Every option is a tragedy. And every option is a result of political failure, not personal weakness.

XTS is launching the Somalia National Employment Drive — our commitment to create 500,000 jobs within five years of taking office. This is not a slogan. It is a plan with specific components:

Infrastructure Jobs: Somalia needs roads, bridges, ports, hospitals, and schools. Every construction project will prioritise local hiring. We estimate 150,000 jobs through infrastructure investment in the first three years.

Technology and Digital Economy: Somalia has one of the highest mobile money adoption rates in the world. We will build a national digital economy strategy, supporting Somali tech startups and training 50,000 youth in digital skills — coding, data, design, and e-commerce.

Fishing and Agriculture: Somalia has 3,300 kilometres of coastline — the longest in Africa. Our seas are rich with fish. Our rivers Jubba and Shabelle can sustain large-scale agriculture. We will invest in irrigation, fishing equipment, cold storage, and market access to create 100,000 jobs in the primary sector.

Vocational Training Centres: We will build a vocational training centre in every region — teaching construction, mechanics, electrical work, healthcare assistance, and other skilled trades. 80,000 youth will complete vocational training in the first three years.

Entrepreneurship Fund: Young Somalis with good ideas deserve a chance. We will create a national micro-loan fund, providing interest-free small business loans to youth entrepreneurs aged 18 to 35.

The youth of Somalia are not the problem. They are the solution — if given the tools. XTS will give them the tools.`,
        contentSo: `Sida ay sheegtay Bangiga Adduunka iyo Hay'adda Shaqada Caalamiga ah, heerka shaqo-la'aanta dhalinyarada Soomaaliya wuxuu taagan yahay 33.9% — markana la xisaabiyo shaqo-la'aanta aan rasmiga ahayn, tiradda dhab ahi aad ayay ka sarreysaa. Tani macnaheedu waa in ka mid ah saddex dhalinyaro Soomaaliyeed oo da'da shaqada ah, ugu yaraan mid kuma jirto shaqo, dakhli, ama jid wax lagu dhaqaaqi karo.

Tani ma aha dhibaato dhaqaale yar. Tani waa xaaladda degdegga qaranka.

Markay dhalinyaradu shaqo la'yihiin, waxay haystaan saddex doorasho: sugidda saboolnimada, isku dayga safarka Yurub ee halista leh, ama ku biirsashada kooxaha hubeysan ee lacag iyo meel ka bixinaya. Doorasho kasta waa murugo. Doorasho kastana waa natiijada fashilka siyaasadeed, karti xumo shakhsiyeed ma aha.

XTS waxay bilaabaysaa Qorshaha Shaqada Qaranka ee Soomaaliya — ballanqaadkeenna ee abuurista 500,000 shaqo shan sano gudahood ka dib marka xilka la helo. Tani ma aha ereyad halgam. Waa qorshe leh qaybaha gaarka ah:

Shaqooyinka Kaabayaasha: Soomaaliya waxay u baahan tahay jidad, buundooyin, dekedaha, isbitaallada, iyo dugsiyada. Mashruuc dhisme kasta wuxuu u soo hormarinayaa kiraysta maxalliga ah. Waxaan qiyaasaynaa 150,000 shaqo iyada oo loo marayo maalgashiga kaabayaasha saddexdii sano ee ugu horreeya.

Teknoolojiyada iyo Dhaqaalaha Dijitaalka: Soomaaliya waxay leedahay mid ka mid ah heerarka ugu sarreeya adduunka ee qaadashada lacag-guurinta mobilka. Waxaan dhisi doonaa istiraatiijiyadda dhaqaalaha dijitaalka ee qaranka, taageeridda shirkadaha teknolojiyadda Soomaaliyeed iyo tababarida 50,000 dhalinyaro xirfadaha dijitaalka — koodhanka, xogta, naqshadaynta, iyo ganacsiga elektroniga.

Kalluumeysiga iyo Beeraha: Soomaaliya waxay leedahay 3,300 km oo xeeb ah — ugu dheer Afrika. Badahayagu kalluun badan ayey leeyihiin. Webiyaasha Jubba iyo Shabeelle waxay illaali karaan beeraha balaadhka leh. Waxaan maalgelin doonaa waraabinta, qalab kalluumeysiga, kaydinta qaboojinta, iyo gaadhsiinta suuqa si loo abuuro 100,000 shaqo qaybta aasaasiga ah.

Xarumaha Tababarka Xirfadlaha: Waxaan dhisi doonaa xarun tababar xirfadlaha oo gobol kasta ah — dhismaha, mishiinka, shaqada korontada, gargaarka caafimaadka, iyo ganacsiyada xirfadeed kale. 80,000 dhalinyaro ayaa dhammayn doona tababarka xirfadlaha saddexdii sano ee ugu horreeya.

Sanduuqa Ganacsiga: Dhalinyarada Soomaaliyeed ee fikrado wanaagsan leh waxay mudan yihiin fursad. Waxaan abuuri doonaa sanduuqa deynta yar-yar ee qaranka, siinaya deynta ganacsiga ee faa'iido la'aanta dhalinyarada 18 ilaa 35 jirka ah ee raba in ay shirkado bilaabaan.

Dhalinyarada Soomaaliya ma aha dhibaatada. Waxay yihiin xalka — haddii lagu siiyaan qalab. XTS wuxuu siinayaa qalab.`,
        published: true,
      },
    ],
  });

  console.log('✅ Seed complete');
  console.log('📧 Admin: admin@xts-party.so');
  console.log('🔑 Password: XTS@Admin2025!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
