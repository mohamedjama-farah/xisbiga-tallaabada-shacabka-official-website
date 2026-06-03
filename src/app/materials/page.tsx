'use client';
import { Download, Printer, FileText, Image as ImageIcon, Share2, BookOpen } from 'lucide-react';
import { useLang } from '@/hooks/useLang';

const materials = [
  {
    category: { en: 'Party Branding', so: 'Astaanta Xisbiga' },
    items: [
      {
        icon: ImageIcon,
        titleEn: 'XTS Official Logo (PNG)',
        titleSo: 'Summada Rasmiga ah ee XTS (PNG)',
        descEn: 'High-resolution XTS logo for print and digital use.',
        descSo: 'Summada XTS ee qayb sare u leh oo loogu talagalay daabacaadda iyo isticmaalka dhijitaalka.',
        color: 'text-blue-400',
        bg: 'bg-blue-400/10',
        border: 'border-blue-400/20',
        file: '/logo.png',
        ext: 'PNG',
      },
      {
        icon: ImageIcon,
        titleEn: 'Party Flag Design',
        titleSo: 'Naqshadda Calanka Xisbiga',
        descEn: 'Official XTS party flag artwork for events and offices.',
        descSo: 'Fanka calanka xisbiga XTS ee rasmiga ah oo loogu talagalay dhacdooyinka iyo xafiisyada.',
        color: 'text-gold',
        bg: 'bg-gold/10',
        border: 'border-gold/20',
        file: '/logo.png',
        ext: 'PNG',
      },
    ],
  },
  {
    category: { en: 'Print Materials', so: 'Agabka Daabacaadda' },
    items: [
      {
        icon: Printer,
        titleEn: 'Campaign Poster A4',
        titleSo: 'Boostarka Olole A4',
        descEn: 'Printable A4 campaign poster — can be printed at any copy shop.',
        descSo: 'Booster olole la daabaci karo A4 — waxaa lagu daabici karaa dukaanka nuqul kasta.',
        color: 'text-green-400',
        bg: 'bg-green-400/10',
        border: 'border-green-400/20',
        file: null,
        ext: 'PDF',
      },
      {
        icon: Printer,
        titleEn: 'Membership Card Template',
        titleSo: 'Naqshadda Kaarka Xubnimada',
        descEn: 'Printable membership card — approved members get a personalized version.',
        descSo: 'Kaarka xubnimada la daabici karo — xubnaha la ansixiyey waxay helaan nooc shakhsi ah.',
        color: 'text-purple-400',
        bg: 'bg-purple-400/10',
        border: 'border-purple-400/20',
        file: null,
        ext: 'PDF',
      },
      {
        icon: Printer,
        titleEn: 'Door Hanger (Canvasser)',
        titleSo: 'Qalabtada Albaabka (Canvasser)',
        descEn: 'Leave-behind door hanger for canvassers to hang on home doors.',
        descSo: 'Qalabta albaabka oo ay canvassers-ku ku qaadaan albaabada guryaha.',
        color: 'text-orange-400',
        bg: 'bg-orange-400/10',
        border: 'border-orange-400/20',
        file: null,
        ext: 'PDF',
      },
    ],
  },
  {
    category: { en: 'Documents & Guides', so: 'Dukumeentiyada & Hagaha' },
    items: [
      {
        icon: FileText,
        titleEn: 'Party Policy Platform (Somali)',
        titleSo: 'Qorshaha Siyaasadeed (Soomaali)',
        descEn: 'Full XTS policy document in Somali language.',
        descSo: 'Dukumeentiga siyaasadda XTS oo buuxa afka Soomaaliga.',
        color: 'text-red-400',
        bg: 'bg-red-400/10',
        border: 'border-red-400/20',
        file: null,
        ext: 'PDF',
      },
      {
        icon: BookOpen,
        titleEn: 'How to Vote Guide',
        titleSo: 'Hagaha Sida Loo Codeyn',
        descEn: 'Step-by-step voter registration and voting guide for Somali citizens. Open and print to PDF.',
        descSo: 'Hagaha talaabo-talaabooyinka diiwaangelinta iyo codeynta muwaadiniinta Soomaalida. Fur oo daabac PDF.',
        color: 'text-cyan-400',
        bg: 'bg-cyan-400/10',
        border: 'border-cyan-400/20',
        file: '/voter-guide',
        ext: 'VIEW',
      },
      {
        icon: FileText,
        titleEn: 'Party Constitution (English)',
        titleSo: 'Dastuurka Xisbiga (Ingiriisi)',
        descEn: 'Official XTS party constitution — full text in English.',
        descSo: 'Dastuurka xisbiga XTS ee rasmiga ah — qoraalka buuxa afka Ingiriisiga.',
        color: 'text-indigo-400',
        bg: 'bg-indigo-400/10',
        border: 'border-indigo-400/20',
        file: null,
        ext: 'PDF',
      },
    ],
  },
  {
    category: { en: 'Social Media Kits', so: 'Agabka Warbaahinta Bulshada' },
    items: [
      {
        icon: Share2,
        titleEn: 'Profile Frame (Facebook / X)',
        titleSo: 'Qaabka Sawirka (Facebook / X)',
        descEn: 'Add the XTS party frame to your profile picture in support of the movement.',
        descSo: 'Ku dar qaabka xisbiga XTS sawirkaaga raakibka si aad u taageerto dhaqdhaqaaqa.',
        color: 'text-blue-300',
        bg: 'bg-blue-300/10',
        border: 'border-blue-300/20',
        file: null,
        ext: 'PNG',
      },
      {
        icon: Share2,
        titleEn: 'Instagram Story Template',
        titleSo: 'Naqshadda Instagram Story',
        descEn: 'Ready-to-share Instagram stories promoting XTS values.',
        descSo: 'Instagram stories diyaar u ah wadaagidda oo kobcisa qiyamka XTS.',
        color: 'text-pink-400',
        bg: 'bg-pink-400/10',
        border: 'border-pink-400/20',
        file: null,
        ext: 'PNG',
      },
    ],
  },
];

export default function MaterialsPage() {
  const { lang } = useLang();

  return (
    <main className="min-h-screen bg-navy pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-4">
            <Download size={14} className="text-gold" />
            <span className="text-gold text-xs font-semibold uppercase tracking-wider">
              {lang === 'en' ? 'Party Materials' : 'Agabka Xisbiga'}
            </span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            {lang === 'en' ? 'Download & Print Materials' : 'Dejiso & Daabac Agabka'}
          </h1>
          <p className="text-white/50 text-sm max-w-xl mx-auto">
            {lang === 'en'
              ? 'Free downloadable resources for XTS supporters — posters, logos, guides, and social media kits.'
              : 'Kheyraad bilaash ah oo la soo dejisan karo oo loogu talagalay taageerayaasha XTS — boostaro, summado, hagaha, iyo agabka warbaahinta bulshada.'}
          </p>
        </div>

        {/* Note */}
        <div className="bg-gold/5 border border-gold/15 rounded-xl px-5 py-3 mb-10 text-center">
          <p className="text-white/50 text-xs">
            {lang === 'en'
              ? '📋 Some files are being uploaded. Check back soon — or contact us if you need a specific file urgently.'
              : '📋 Qaar ka mid ah faylasha waa la soo rarayaa. Dib u eeg dhawaan — ama nala xiriir haddaad ku baahantahay fayl gaar ah si deg deg ah.'}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {materials.map((section, si) => (
            <div key={si}>
              <h2 className="text-gold text-xs font-black uppercase tracking-widest mb-4">
                {section.category[lang]}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.items.map((item, ii) => {
                  const Icon = item.icon;
                  return (
                    <div key={ii} className={`bg-white/3 border ${item.border} rounded-2xl p-5 flex flex-col gap-3`}>
                      <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.border} border flex items-center justify-center`}>
                        <Icon size={18} className={item.color} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-sm mb-1">
                          {lang === 'en' ? item.titleEn : item.titleSo}
                        </h3>
                        <p className="text-white/40 text-xs leading-relaxed">
                          {lang === 'en' ? item.descEn : item.descSo}
                        </p>
                      </div>
                      {item.file ? (
                        <a
                          href={item.file}
                          download={item.ext !== 'VIEW'}
                          target={item.ext === 'VIEW' ? '_blank' : undefined}
                          rel={item.ext === 'VIEW' ? 'noopener noreferrer' : undefined}
                          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold border transition-all hover:opacity-80 ${item.bg} ${item.border} ${item.color}`}
                        >
                          <Download size={12} />
                          {item.ext === 'VIEW'
                            ? (lang === 'en' ? 'Open & Print to PDF' : 'Fur & Daabac PDF')
                            : (lang === 'en' ? `Download ${item.ext}` : `Dejiso ${item.ext}`)
                          }
                        </a>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold border bg-white/3 border-white/10 text-white/25">
                          {lang === 'en' ? 'Coming Soon' : 'Dhawaan'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center bg-white/3 border border-white/8 rounded-2xl p-8">
          <p className="text-white font-bold mb-1">
            {lang === 'en' ? 'Need custom materials?' : 'Ma u baahantahay agab gaar ah?'}
          </p>
          <p className="text-white/40 text-sm mb-4">
            {lang === 'en'
              ? 'Contact our media team for customised party materials for your area.'
              : 'La xiriir kooxda warbaahintayada agabka xisbiga oo u gaar ah aagahaaga.'}
          </p>
          <a href="/contact" className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold text-navy font-bold text-sm rounded-full hover:bg-gold/90 transition-colors">
            {lang === 'en' ? 'Contact Media Team' : 'La Xiriir Kooxda Warbaahinta'}
          </a>
        </div>
      </div>
    </main>
  );
}
