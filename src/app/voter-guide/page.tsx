'use client';
import { Printer } from 'lucide-react';

export default function VoterGuidePrint() {
  return (
    <main className="min-h-screen bg-white">
      {/* Print button - hidden when printing */}
      <div className="print:hidden bg-navy py-4 px-6 flex items-center justify-between">
        <p className="text-white text-sm font-semibold">XTS Voter Registration Guide — Ready to print</p>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2 bg-gold text-navy font-bold text-sm rounded-lg hover:bg-gold/90 transition-colors"
        >
          <Printer size={15} /> Save as PDF / Print
        </button>
      </div>

      {/* Printable Content */}
      <div className="max-w-2xl mx-auto px-8 py-10 font-sans text-gray-900">
        {/* Header */}
        <div className="text-center border-b-4 border-[#1a2454] pb-6 mb-8">
          <div className="flex items-center justify-center gap-4 mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <svg viewBox="0 0 100 100" width="64" height="64"><defs><linearGradient id="vg-r" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1e2e80"/><stop offset="100%" stopColor="#111836"/></linearGradient><linearGradient id="vg-b" x1="0.6" y1="0" x2="0.2" y2="1"><stop offset="0%" stopColor="#fff"/><stop offset="40%" stopColor="#ffe57a"/><stop offset="100%" stopColor="#c9a227"/></linearGradient></defs><circle cx="50" cy="50" r="47" fill="none" stroke="#c9a227" strokeWidth="0.8" strokeOpacity="0.5"/><circle cx="50" cy="50" r="40" fill="none" stroke="url(#vg-r)" strokeWidth="15"/><circle cx="50" cy="50" r="33" fill="none" stroke="#c9a227" strokeWidth="0.6" strokeOpacity="0.35"/><path d="M 62,2 L 40,52 L 55,52 L 32,98 L 54,48 L 39,48 Z" fill="url(#vg-b)"/><path d="M 62,2 L 40,52 L 44,52 L 66,2 Z" fill="white" fillOpacity="0.5"/></svg>
            <div className="text-left">
              <div className="text-[#1a2454] font-black text-xl leading-tight">Xisbiga Tallaabada Shacabka</div>
              <div className="text-[#c9a227] font-bold text-sm">The People&apos;s Progress Party — XTS</div>
            </div>
          </div>
          <h1 className="text-2xl font-black text-[#1a2454] mt-4">HOW TO VOTE IN SOMALIA</h1>
          <p className="text-gray-500 text-sm mt-1">Citizen Voter Registration &amp; Voting Guide • xts.so/vote</p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {[
            {
              step: 1,
              en: 'Check Your Eligibility',
              so: 'Hubi Xaq-u-yeelashadaada',
              content: 'You must be a Somali citizen, 18 years or older. You need a valid ID (national ID, passport, or clan elder letter).',
              contentSo: 'Waa inaad tahay muwaadin Soomaali ah, 18 sano ama ka weyn. Waxaad u baahan tahay aqoonsiga saxda ah (aqoonsiga qaran, baasaboor, ama warqadda odayaasha beelaha).',
            },
            {
              step: 2,
              en: 'Find Your Registration Centre',
              so: 'Hel Xaruntaada Diiwaangelinta',
              content: 'Contact your local district office or the National Independent Electoral Commission (NIEC) at +252 1 80 0300. In your region, contact your local XTS branch for assistance.',
              contentSo: 'La xiriir xafiiska degmadaada ee maxalliga ah ama Guddiga Doorashooyinka Qaranka (NIEC) +252 1 80 0300. Gobolkaaga, la xiriir laanta XTS ee maxalliga ah si aad u hesho caawimaad.',
            },
            {
              step: 3,
              en: 'Register as a Voter',
              so: 'Isdiiwaangeli Codeeyaha Ahaan',
              content: 'Bring your ID to the registration centre. Complete the registration form with your full name, address, and date of birth. Collect your voter registration card.',
              contentSo: 'Aqoonsigaaga u keen xarunta diiwaangelinta. Buuxi foomka diiwaangelinta magacaaga buuxa, cinwaankaaga, iyo taariikhda dhalashada. Qaado kaarka diiwaangelinta codeeyahaaga.',
            },
            {
              step: 4,
              en: 'Find Your Polling Station',
              so: 'Hel Rugta Codeyntaada',
              content: 'Your registration card will show your polling station. You can also check online at niec.so or call the hotline. Go to the right polling station — voting at the wrong station may disqualify your vote.',
              contentSo: 'Kaarka diiwaangelintaadu wuxuu tusi doonaa rugta codeyntaada. Waad ka hubin kartaa online niec.so ama wac khadka kulul. Aad rugta codeynta saxda ah — codeynta rugta khaldan waxay baabi\'in kartaa coddaada.',
            },
            {
              step: 5,
              en: 'Vote on Election Day',
              so: 'Ku Codee Maalinta Doorashadda',
              content: 'Bring your voter registration card and ID. Follow the instructions of polling officials. Mark your ballot clearly. Place it in the ballot box. Your vote is secret — no one can see how you voted.',
              contentSo: 'Keen kaarka diiwaangelinta codeeyahaaga iyo aqoonsiga. Raac tilmaamaha masuuliyiinta rugta codeynta. Si cad u calaamee warqadda codeyntaada. Ku rid sanduuqa codeynta. Codeyntaadu waa sir — qof xuma ma arki karo sida aad u codeysay.',
            },
          ].map(item => (
            <div key={item.step} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#1a2454] text-white font-black text-lg flex items-center justify-center flex-shrink-0 mt-1">
                {item.step}
              </div>
              <div className="flex-1">
                <h2 className="font-black text-[#1a2454] text-base">{item.en}</h2>
                <h3 className="font-bold text-[#c9a227] text-sm mb-1">{item.so}</h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-1">{item.content}</p>
                <p className="text-gray-400 text-xs leading-relaxed italic">{item.contentSo}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-10 bg-[#f0f4ff] border border-[#1a2454]/20 rounded-lg p-5">
          <h3 className="font-black text-[#1a2454] mb-2">Need Help? / Caawimaad u baahan?</h3>
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
            <div><strong>XTS Website:</strong> xts.so</div>
            <div><strong>NIEC Hotline:</strong> +252 1 80 0300</div>
            <div><strong>Email:</strong> info@xts.so</div>
            <div><strong>Volunteer:</strong> xts.so/volunteer</div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center">
          <p className="text-gray-400 text-xs">© {new Date().getFullYear()} Xisbiga Tallaabada Shacabka (XTS) · xts.so · Printed from xts.so/voter-guide</p>
          <p className="text-gray-300 text-[10px] mt-1">This guide is for informational purposes. For official registration details, contact NIEC.</p>
        </div>
      </div>

      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { margin: 0; }
        }
        @page { margin: 1.5cm; size: A4; }
      `}</style>
    </main>
  );
}
