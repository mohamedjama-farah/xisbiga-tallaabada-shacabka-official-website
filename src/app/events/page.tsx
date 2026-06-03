'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useLang } from '@/hooks/useLang';
import { Calendar, MapPin, Clock, ChevronRight, CalendarDays } from 'lucide-react';
import EventRSVP from '@/components/EventRSVP';

interface Event {
  id: string;
  titleEn: string;
  titleSo: string;
  descEn: string;
  descSo: string;
  location: string;
  date: string;
  time: string;
  type: string;
  online: boolean;
}

const TYPE_COLORS: Record<string, string> = {
  RALLY: '#ef4444',
  TOWN_HALL: '#3b82f6',
  FUNDRAISER: '#22c55e',
  MEETING: '#8b5cf6',
  TRAINING: '#f97316',
  OTHER: '#c9a227',
};

const TYPE_LABELS: Record<string, { en: string; so: string }> = {
  RALLY: { en: 'Rally', so: 'Xafladda' },
  TOWN_HALL: { en: 'Town Hall', so: 'Shir Bulshada' },
  FUNDRAISER: { en: 'Fundraiser', so: 'Ururinta Lacagta' },
  MEETING: { en: 'Meeting', so: 'Shir' },
  TRAINING: { en: 'Training', so: 'Tababar' },
  OTHER: { en: 'Event', so: 'Dhacdo' },
};

function EventCard({ event, lang }: { event: Event; lang: 'en' | 'so' }) {
  const color = TYPE_COLORS[event.type] ?? '#c9a227';
  const typeLabel = TYPE_LABELS[event.type]?.[lang] ?? event.type;
  const dateObj = new Date(event.date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('en', { month: 'short' });
  const year = dateObj.getFullYear();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className="bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-all group overflow-hidden"
    >
    <div className="p-5 flex gap-4">
      {/* Date block */}
      <div className="flex-shrink-0 flex flex-col items-center justify-center bg-white/5 rounded-xl px-4 py-3 min-w-[60px] text-center">
        <span className="text-2xl font-black text-white leading-none">{day}</span>
        <span className="text-gold text-xs font-bold uppercase">{month}</span>
        <span className="text-white/40 text-[10px]">{year}</span>
      </div>
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full" style={{ background: `${color}20`, color }}>
            {typeLabel}
          </span>
          {event.online && (
            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
              {lang === 'en' ? 'Online' : 'Online'}
            </span>
          )}
        </div>
        <h3 className="font-bold text-white text-sm mb-1 truncate">{lang === 'en' ? event.titleEn : event.titleSo}</h3>
        <p className="text-white/50 text-xs leading-relaxed line-clamp-2 mb-2">{lang === 'en' ? event.descEn : event.descSo}</p>
        <div className="flex flex-wrap gap-3 text-white/40 text-xs">
          {event.time && (
            <span className="flex items-center gap-1"><Clock size={11} /> {event.time}</span>
          )}
          {event.location && (
            <span className="flex items-center gap-1"><MapPin size={11} /> {event.location}</span>
          )}
        </div>
      </div>
    </div>
    <div className="px-5 pb-4 border-t border-white/5">
      <EventRSVP eventId={event.id} eventTitle={lang === 'en' ? event.titleEn : event.titleSo} rsvpCount={0} />
    </div>
    </motion.div>
  );
}

export default function EventsPage() {
  const { lang } = useLang();
  const heroRef = useRef(null);
  const inView = useInView(heroRef, { once: true });
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events').then(r => r.json()).then(d => { setEvents(d.events ?? []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const now = new Date();
  const upcoming = events.filter(e => new Date(e.date) >= now).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = events.filter(e => new Date(e.date) < now).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-navy pt-24 pb-20">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-16" ref={heroRef}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-widest mb-6">
            <Calendar size={13} />
            {lang === 'en' ? 'Events Calendar' : 'Kalandharka Dhacdooyinka'}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            {lang === 'en' ? 'XTS Events' : 'Dhacdooyinka XTS'}
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            {lang === 'en'
              ? 'Rallies, town halls, meetings, and training sessions — stay connected with what XTS is doing on the ground.'
              : 'Xafladaha, shirarka bulshada, kullanaha, iyo tababarada — la xidh waxa XTS dhulka ku qabanayso.'}
          </p>
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <CalendarDays size={48} className="text-white/20 mx-auto mb-4" />
            <p className="text-white/40 text-lg font-semibold">
              {lang === 'en' ? 'No events scheduled yet.' : 'Wali dhacdooyin lama qorshayn.'}
            </p>
            <p className="text-white/30 text-sm mt-2">
              {lang === 'en' ? 'Check back soon — events will appear here.' : 'Dib u soo eeg — dhacdooyinku halkan ayay soo muuqan doonaan.'}
            </p>
          </motion.div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <section className="mb-12">
                <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  {lang === 'en' ? 'Upcoming Events' : 'Dhacdooyinka Soo Socda'}
                </h2>
                <div className="space-y-4">
                  {upcoming.map(e => <EventCard key={e.id} event={e} lang={lang} />)}
                </div>
              </section>
            )}
            {past.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-white/50 mb-5">
                  {lang === 'en' ? 'Past Events' : 'Dhacdooyinkii Hore'}
                </h2>
                <div className="space-y-4 opacity-60">
                  {past.map(e => <EventCard key={e.id} event={e} lang={lang} />)}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
