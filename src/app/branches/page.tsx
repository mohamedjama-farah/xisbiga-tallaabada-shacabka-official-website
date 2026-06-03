'use client';
import { MapPin, Phone, Mail, Clock, Building2 } from 'lucide-react';
import { useLang } from '@/hooks/useLang';

const branches = [
  {
    region: { en: 'Mogadishu (HQ)', so: 'Muqdisho (Xarunta Dhexe)' },
    address: { en: 'Hodan District, Mogadishu, Banadir', so: 'Degmada Hodan, Muqdisho, Banaadir' },
    phone: '+252 61 xxx xxxx',
    email: 'hq@xts.so',
    hours: { en: 'Mon–Fri 8am–5pm', so: 'Isn–Jimc 8am–5pm' },
    type: 'HQ',
    state: { en: 'Banadir', so: 'Banaadir' },
    coordinates: { top: '63%', left: '55%' },
  },
  {
    region: { en: 'Kismayo', so: 'Kismaayo' },
    address: { en: 'Hosinow District, Kismayo, Jubaland', so: 'Degmada Hosinow, Kismaayo, Jubaland' },
    phone: '+252 62 xxx xxxx',
    email: 'kismayo@xts.so',
    hours: { en: 'Mon–Fri 8am–4pm', so: 'Isn–Jimc 8am–4pm' },
    type: 'Branch',
    state: { en: 'Jubaland', so: 'Jubaland' },
    coordinates: { top: '75%', left: '48%' },
  },
  {
    region: { en: 'Baidoa', so: 'Baydhabo' },
    address: { en: 'Central District, Baidoa, South West State', so: 'Degmada Dhexe, Baydhabo, Koonfurta Galbeed' },
    phone: '+252 46 xxx xxxx',
    email: 'baidoa@xts.so',
    hours: { en: 'Mon–Fri 8am–4pm', so: 'Isn–Jimc 8am–4pm' },
    type: 'Branch',
    state: { en: 'South West State', so: 'Koonfurta Galbeed' },
    coordinates: { top: '68%', left: '38%' },
  },
  {
    region: { en: 'Garowe', so: 'Garoowe' },
    address: { en: 'Nugaal Valley, Garowe, Puntland', so: 'Dooxada Nugaal, Garoowe, Puntland' },
    phone: '+252 5 xxx xxxx',
    email: 'garowe@xts.so',
    hours: { en: 'Mon–Fri 8am–4pm', so: 'Isn–Jimc 8am–4pm' },
    type: 'Branch',
    state: { en: 'Puntland', so: 'Puntland' },
    coordinates: { top: '35%', left: '68%' },
  },
  {
    region: { en: 'Dhusamareb', so: 'Dhuusamarreeb' },
    address: { en: 'Dhusamareb, Galmudug State', so: 'Dhuusamarreeb, Gobolka Galmudug' },
    phone: '+252 6 xxx xxxx',
    email: 'galmudug@xts.so',
    hours: { en: 'Mon–Fri 8am–4pm', so: 'Isn–Jimc 8am–4pm' },
    type: 'Branch',
    state: { en: 'Galmudug', so: 'Galmudug' },
    coordinates: { top: '50%', left: '58%' },
  },
  {
    region: { en: 'Beledweyne', so: 'Beledweyne' },
    address: { en: 'Beledweyne, Hirshabelle State', so: 'Beledweyne, Gobolka Hirshabelle' },
    phone: '+252 6 xxx xxxx',
    email: 'hirshabelle@xts.so',
    hours: { en: 'Mon–Fri 8am–4pm', so: 'Isn–Jimc 8am–4pm' },
    type: 'Branch',
    state: { en: 'Hirshabelle', so: 'Hirshabelle' },
    coordinates: { top: '55%', left: '50%' },
  },
  {
    region: { en: 'Hargeisa (Liaison)', so: 'Hargeysa (Xiriir)' },
    address: { en: 'Hargeisa', so: 'Hargeysa' },
    phone: '+252 2 xxx xxxx',
    email: 'hargeisa@xts.so',
    hours: { en: 'Mon–Fri 9am–4pm', so: 'Isn–Jimc 9am–4pm' },
    type: 'Liaison',
    state: { en: 'Northwest', so: 'Waqooyi Galbeed' },
    coordinates: { top: '22%', left: '28%' },
  },
];

const stateColors: Record<string, string> = {
  HQ: 'bg-gold border-gold/50 text-navy',
  Branch: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
  Liaison: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
};

export default function BranchesPage() {
  const { lang } = useLang();

  return (
    <main className="min-h-screen bg-navy pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-4">
            <Building2 size={14} className="text-gold" />
            <span className="text-gold text-xs font-semibold uppercase tracking-wider">
              {lang === 'en' ? 'Branch Offices' : 'Xafiisyada Laanta' }
            </span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            {lang === 'en' ? 'Find Your Nearest XTS Office' : 'Hel Xafiiska XTS ee Kugu Dhow'}
          </h1>
          <p className="text-white/50 text-sm">
            {lang === 'en'
              ? 'XTS has offices across Somalia. Walk in, ask questions, register as a member, or report an issue.'
              : 'XTS waxay leedahay xafiisyo ka dhex jira Soomaaliya. Soo gal, su\'aalo weydii, isdiiwaangeli xubin ahaan, ama soo gudbi arrin.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Visual Map */}
          <div className="bg-white/3 border border-white/8 rounded-2xl p-6 relative overflow-hidden">
            <h2 className="text-white font-bold text-sm mb-4 uppercase tracking-wide">
              {lang === 'en' ? 'Somalia Office Map' : 'Khariidadda Xafiisyada Soomaaliya'}
            </h2>
            {/* SVG-style Somalia silhouette map */}
            <div className="relative w-full aspect-[3/4] bg-[#0d1835] rounded-xl overflow-hidden border border-white/10">
              {/* Simple Somalia shape using CSS clip */}
              <div className="absolute inset-4 rounded-xl" style={{
                background: 'linear-gradient(135deg, #1a2454 60%, #1a3054 100%)',
                clipPath: 'polygon(30% 5%, 55% 3%, 75% 8%, 90% 20%, 95% 35%, 88% 50%, 80% 60%, 70% 75%, 55% 88%, 45% 95%, 30% 90%, 20% 78%, 15% 65%, 12% 50%, 18% 35%, 22% 20%)',
              }} />

              {/* State labels */}
              <div className="absolute text-[9px] text-white/25 font-bold" style={{ top: '18%', left: '30%' }}>WAQOOYI</div>
              <div className="absolute text-[9px] text-white/25 font-bold" style={{ top: '30%', left: '60%' }}>PUNTLAND</div>
              <div className="absolute text-[9px] text-white/25 font-bold" style={{ top: '48%', left: '52%' }}>GALMUDUG</div>
              <div className="absolute text-[9px] text-white/25 font-bold" style={{ top: '53%', left: '42%' }}>HIRSHABELLE</div>
              <div className="absolute text-[9px] text-white/25 font-bold" style={{ top: '65%', left: '35%' }}>SW STATE</div>
              <div className="absolute text-[9px] text-white/25 font-bold" style={{ top: '72%', left: '50%' }}>JUBALAND</div>

              {/* Office pins */}
              {branches.map((b, i) => (
                <div
                  key={i}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  style={{ top: b.coordinates.top, left: b.coordinates.left }}
                >
                  <div className={`w-3.5 h-3.5 rounded-full border-2 ${b.type === 'HQ' ? 'bg-gold border-gold/80 w-5 h-5' : b.type === 'Liaison' ? 'bg-purple-400 border-purple-300' : 'bg-blue-400 border-blue-300'} shadow-lg`} />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-10">
                    <div className="bg-[#0a1128] border border-white/20 rounded-lg px-2.5 py-1.5 whitespace-nowrap text-center">
                      <p className="text-white text-[10px] font-bold">{b.region[lang]}</p>
                      <p className="text-white/40 text-[9px]">{b.state[lang]}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Legend */}
              <div className="absolute bottom-3 right-3 bg-black/40 rounded-lg p-2 space-y-1">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-gold" /><span className="text-[9px] text-white/60">HQ</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-400" /><span className="text-[9px] text-white/60">{lang === 'en' ? 'Branch' : 'Laanta'}</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-purple-400" /><span className="text-[9px] text-white/60">{lang === 'en' ? 'Liaison' : 'Xiriir'}</span></div>
              </div>
            </div>
          </div>

          {/* Office List */}
          <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
            {branches.map((b, i) => (
              <div key={i} className="bg-white/3 border border-white/8 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-white font-bold text-sm">{b.region[lang]}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${stateColors[b.type]}`}>
                        {b.type}
                      </span>
                    </div>
                    <p className="text-white/35 text-xs">{b.state[lang]}</p>
                  </div>
                  <MapPin size={14} className="text-gold/50 flex-shrink-0 mt-0.5" />
                </div>
                <div className="space-y-1.5 text-xs text-white/45">
                  <div className="flex items-center gap-2">
                    <MapPin size={11} className="text-white/25 flex-shrink-0" />
                    <span>{b.address[lang]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={11} className="text-white/25 flex-shrink-0" />
                    <span>{b.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={11} className="text-white/25 flex-shrink-0" />
                    <span>{b.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={11} className="text-white/25 flex-shrink-0" />
                    <span>{b.hours[lang]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Open new branch CTA */}
        <div className="mt-10 text-center bg-gold/5 border border-gold/15 rounded-2xl p-8">
          <Building2 size={32} className="text-gold mx-auto mb-3" />
          <p className="text-white font-bold mb-1">
            {lang === 'en' ? 'Want to open a branch in your area?' : 'Ma rabtaa inaad ku furto laanta aagahaaga?'}
          </p>
          <p className="text-white/40 text-sm mb-4">
            {lang === 'en'
              ? 'XTS is expanding across Somalia. Contact us if you want to establish a local party office.'
              : 'XTS waxay fidisaa Soomaaliya oo dhan. Nala xiriir haddaad rabto inaad aasaasato xafiis xisbi oo maxalli ah.'}
          </p>
          <a href="/contact" className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold text-navy font-bold text-sm rounded-full hover:bg-gold/90 transition-colors">
            {lang === 'en' ? 'Get in Touch' : 'Nala Xiriir'}
          </a>
        </div>
      </div>
    </main>
  );
}
