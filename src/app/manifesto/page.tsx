'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLang } from '@/hooks/useLang';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const sections = [
  {
    num: '01',
    image: '/xts-photo5.png',
    imageAlt: 'Mogadishu city at night',
    imagePosition: 'object-center',
    accent: '#c9a227',
    en: {
      eyebrow: 'Pillar One',
      title: 'Democracy & Governance',
      body: 'XTS believes that a strong democracy is the foundation of lasting peace. We commit to holding free and fair elections at every level of government, establishing an independent judiciary that serves all Somalis equally, and creating transparent institutions that are accountable to the people. We will repeal all laws that restrict freedom of speech, press, and peaceful assembly.',
    },
    so: {
      eyebrow: 'Tiirka Koowaad',
      title: 'Dimuqraadiyad & Xukumaad',
      body: 'XTS waxay aaminsan tahay in dimuqraadiyad xooggan ay tahay aasaaska nabadda joogtada ah. Waxaan ballanqaadaynaa inaan qabanno doorashooyin xor ah oo caddaaladda ah oo heer kasta oo dowladnimo ka jira, in la aasaaso garsoor madax-bannaan oo adeega Soomaalida oo dhan si siman, iyo in la abuuro hay\'aado cad oo xisaabtanka shacabka u ah.',
    },
    points: {
      en: ['Free and fair elections within 18 months', 'Independent anti-corruption commission', 'Freedom of press and civil liberties', 'Decentralized governance for all regions'],
      so: ['Doorashooyin xor ah oo caddaaladda ah 18 bilood gudahood', 'Guddiga madax-bannaan ee la-dagaallanka musuqmaasuqa', 'Xorriyaadka saxaafadda iyo xuquuqda madaniga', 'Xukumaad kala-bixiso gobolada oo dhan'],
    },
  },
  {
    num: '02',
    image: '/xts-6.jpg',
    imageAlt: 'Somali farmland and rivers from the air',
    imagePosition: 'object-center',
    accent: '#22c55e',
    en: {
      eyebrow: 'Pillar Two',
      title: 'Economic Growth & Jobs',
      body: "Somalia's natural resources and strategic location make it uniquely positioned for rapid economic development. XTS will prioritize creating an environment where Somali entrepreneurs can thrive, attracting foreign investment, and ensuring that economic growth benefits all Somalis — not just the elite.",
    },
    so: {
      eyebrow: 'Tiirka Labaad',
      title: 'Kobaca Dhaqaalaha & Shaqada',
      body: 'Kheyraadka dabiiciga ah ee Soomaaliya iyo goobteeda taariikhiga ah waxay ka dhigaan meel gaar ah oo horumarka dhaqaale ee degdegga ah. XTS waxay u doorbideysaa abuuridda deegaan oo ganacsatada Soomaaliyeed ku barwaaqaysan karaan, jiitidda maalgashiga shisheeye, iyo hubinta in kobaca dhaqaale uu u faa\'ideeyo Soomaalida oo dhan.',
    },
    points: {
      en: ['Zero-tax zones for new businesses', '500,000 jobs created in 5 years', 'Investment in fishing, agriculture & tech', 'National development bank for SMEs'],
      so: ['Goobaha canshuurta la\'aanta ee ganacsiyada cusub', '500,000 shaqo oo la abuuray 5 sano gudahood', 'Maalgashadda kalluumeysiga, beeraha iyo teknoolajiyada', 'Bangiga horumarinta qaranka ee ganacsiyada yaryar'],
    },
  },
  {
    num: '03',
    image: '/1.jpeg',
    imageAlt: 'Somali child smiling while reading books',
    imagePosition: 'object-top',
    accent: '#3b82f6',
    en: {
      eyebrow: 'Pillar Three',
      title: 'Education & Youth',
      body: 'The future of Somalia is its youth. XTS commits to making quality education accessible to every Somali child, regardless of region or economic background. We will invest in technical training, universities, and scholarship programs to develop the next generation of Somali leaders — every child deserves to read, dream, and succeed.',
    },
    so: {
      eyebrow: 'Tiirka Saddexaad',
      title: 'Waxbarasho & Dhalinyarada',
      body: 'Mustaqbalka Soomaaliya waa dhalinyaradooda. XTS waxay ballanqaadaysaa in waxbarasho tayo leh laga helo ilmo kasta oo Soomaaliyeed, gobolka ama xaaladda dhaqaale ha ahaatee. Waxaanu ku maalgashanayaa tababarka farsamada, jaamacadaha, iyo barnaamijyada deeqaha — ilmo kasta wuxuu mudan yahay inuu akhristo, riyoodo, uguna guulaysto.',
    },
    points: {
      en: ['Free education from grade 1 through 12', '50 new universities by 2030', 'Vocational training for 500,000 youth', 'Competitive scholarships for study abroad'],
      so: ['Waxbarasho bilaash ah fasalka 1 ilaa 12', '50 jaamacadood cusub 2030 ka hor', 'Tababar xirfadeed oo loogu talagalay 500,000 dhallinyaradood', 'Deeqo tartan leh ee dibadda waxbarashadeed'],
    },
  },
  {
    num: '04',
    image: '/2.jpeg',
    imageAlt: 'Somali coastline aerial view',
    imagePosition: 'object-center',
    accent: '#ef4444',
    en: {
      eyebrow: 'Pillar Four',
      title: 'Security & Lasting Peace',
      body: 'No development is possible without security. XTS has a comprehensive plan to address the root causes of conflict in Somalia — including clan tensions, economic inequality, and the influence of extremist groups. We will build a professional national security force that protects all Somalis, and invest in reconciliation that heals decades of division.',
    },
    so: {
      eyebrow: 'Tiirka Afraad',
      title: 'Amniga & Nabadda Joogtada',
      body: 'Ma jirto horumar aan ammaan lahayn. XTS waxay leedahay qorshaha dhammaystiran ee looga jawaabo sababaha aasaasiga ah ee colaadda Soomaaliya — oo ay ku jiraan xiisaha qabiilka, sinnaanta dhaqaale, iyo saameynta kooxaha xagji-doonka ah. Waxaan dhisaynaa ciidan amni oo xirfadleh oo difaacaya Soomaalida oo dhan.',
    },
    points: {
      en: ['Demobilize and reintegrate militia fighters', 'Community policing & justice programs', 'Counter-terrorism cooperation with allies', 'National clan reconciliation commissions'],
      so: ['Ka-hor-joogista iyo dib-u-dhiska dagaalyahanada milishiyada', 'Barnaamijyada booliisku bulshooyinka ah', 'Iskaashiga la-dagaallanka argagixisada ee xulafada', 'Guddiyada heshiisinta qabiilka ee qaranka'],
    },
  },
];

function SectionCard({ sec, index }: { sec: typeof sections[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const { lang } = useLang();
  const content = lang === 'en' ? sec.en : sec.so;
  const points = lang === 'en' ? sec.points.en : sec.points.so;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl overflow-hidden border border-white/10 bg-white/[0.025]"
    >
      {/* Image header */}
      <div className="relative h-56 sm:h-72 overflow-hidden">
        <Image
          src={sec.image}
          alt={sec.imageAlt}
          fill
          className={`object-cover ${sec.imagePosition} scale-105`}
          sizes="(max-width: 768px) 100vw, 800px"
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040b1c] via-[#040b1c]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040b1c]/40 to-transparent" />

        {/* Number badge — bottom left over image */}
        <div className="absolute bottom-6 left-6 flex items-end gap-4">
          <div
            className="text-[72px] font-black leading-none"
            style={{ color: sec.accent, opacity: 0.25, lineHeight: 1 }}
          >
            {sec.num}
          </div>
          <div className="mb-1">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-2"
              style={{ background: `${sec.accent}18`, border: `1px solid ${sec.accent}35`, color: sec.accent }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: sec.accent }} />
              {content.eyebrow}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 sm:p-10">
        {/* Title — clearly separate from the number which is in the image */}
        <h2
          className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-5 leading-tight"
        >
          {content.title}
        </h2>

        {/* Accent line */}
        <div className="w-12 h-1 rounded-full mb-6" style={{ background: sec.accent }} />

        {/* Body text */}
        <p className="text-white/65 text-base sm:text-lg leading-[1.8] mb-8">
          {content.body}
        </p>

        {/* Policy points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {points.map((pt, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: isEven ? -15 : 15 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.35 + i * 0.08 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/8 hover:border-white/15 transition-colors"
            >
              <CheckCircle2 size={17} className="shrink-0 mt-0.5" style={{ color: sec.accent }} />
              <span className="text-white/75 text-sm leading-relaxed">{pt}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function ManifestoPage() {
  const { lang } = useLang();

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: 'linear-gradient(180deg, #040b1c 0%, #070e24 100%)' }}>
      {/* Dot grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.018]"
        style={{ backgroundImage: 'radial-gradient(circle, #c9a227 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

      <div className="max-w-4xl mx-auto px-4 relative z-10">

        {/* ── Hero header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/25 bg-gold/8 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-gold text-xs font-bold tracking-[0.22em] uppercase">XTS 2025 – 2030</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            {lang === 'en' ? (
              <>Our <span className="text-gold">Manifesto</span></>
            ) : (
              <>Qorsha<span className="text-gold">hayaga</span></>
            )}
          </h1>

          <p className="text-white/55 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
            {lang === 'en'
              ? 'Four pillars. Concrete targets. A funded, actionable plan to build a just, unified, and prosperous Somalia.'
              : 'Afar tiir. Yoolal cad. Qorshe lacag-gashay oo la hirgelin karo si loo dhiso Soomaali cadaalad leh, mideysan, oo barwaaqo leh.'}
          </p>

          {/* Pillar overview chips */}
          <div className="flex flex-wrap justify-center gap-3">
            {sections.map((s) => (
              <div
                key={s.num}
                className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold"
                style={{ borderColor: `${s.accent}35`, color: s.accent, background: `${s.accent}10` }}
              >
                <span className="font-mono opacity-60">{s.num}</span>
                {lang === 'en' ? s.en.title : s.so.title}
              </div>
            ))}
          </div>

          <div className="mt-10 w-24 h-1 bg-gold mx-auto rounded-full" />
        </motion.div>

        {/* ── Section cards ── */}
        <div className="space-y-10">
          {sections.map((sec, i) => (
            <SectionCard key={sec.num} sec={sec} index={i} />
          ))}
        </div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-16 p-10 sm:p-14 rounded-3xl text-center"
          style={{ background: 'linear-gradient(135deg, rgba(201,162,39,0.1) 0%, rgba(201,162,39,0.03) 100%)', border: '1px solid rgba(201,162,39,0.25)' }}
        >
          <div className="text-4xl mb-4">🇸🇴</div>
          <h3 className="text-3xl sm:text-4xl font-black text-white mb-4">
            {lang === 'en' ? 'Ready to Build This Future?' : 'U Diyaar Garoow Dhisidda Mustaqbalkan?'}
          </h3>
          <p className="text-white/50 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            {lang === 'en'
              ? 'Join XTS and be part of the change Somalia needs. Every member matters.'
              : 'XTS ku biir oo ka qayb noqo isbedelka Soomaaliya u baahan tahay. Xubin kasta muhiim tahay.'}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/join">
              <motion.span
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(201,162,39,0.5)' }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 px-10 py-4 bg-gold text-navy font-black text-lg rounded-full cursor-pointer shadow-lg shadow-gold/20"
              >
                {lang === 'en' ? 'Join the Movement' : 'Ku Biir Dhaqdhaqaaqa'}
                <ArrowRight size={20} />
              </motion.span>
            </Link>
            <Link href="/data">
              <motion.span
                whileHover={{ scale: 1.04, backgroundColor: 'rgba(255,255,255,0.06)' }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 px-10 py-4 border border-white/15 text-white/65 font-semibold text-lg rounded-full cursor-pointer transition-all"
              >
                {lang === 'en' ? 'See the Crisis Data' : 'Xogta Dhibaatada Arag'}
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
