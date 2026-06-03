'use client';
import { useState, useEffect, useRef } from 'react';
import { Bell, X, CheckCheck, Users, Heart, MessageSquare, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  member_join: Users,
  donation: Heart,
  message: MessageSquare,
  volunteer: Users,
  canvasser: MapPin,
  contact: MessageSquare,
  complaint: MessageSquare,
};

const TYPE_COLORS: Record<string, string> = {
  member_join: 'text-blue-400',
  donation: 'text-green-400',
  message: 'text-purple-400',
  volunteer: 'text-gold',
  canvasser: 'text-orange-400',
  contact: 'text-purple-400',
  complaint: 'text-red-400',
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifications = () => {
    fetch('/api/admin/notifications')
      .then(r => r.json())
      .then(d => { setNotifications(d.notifications ?? []); setUnread(d.unread ?? 0); })
      .catch(() => {});
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = async () => {
    await fetch('/api/admin/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ all: true }) });
    setNotifications(n => n.map(x => ({ ...x, read: true })));
    setUnread(0);
  };

  const markRead = async (id: string) => {
    await fetch('/api/admin/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: [id] }) });
    setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x));
    setUnread(u => Math.max(0, u - 1));
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
      >
        <Bell size={16} className="text-white/60" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 bg-[#0a1128] border border-white/10 rounded-2xl shadow-2xl shadow-black/40 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
              <h3 className="font-bold text-white text-sm">Notifications</h3>
              <div className="flex items-center gap-2">
                {unread > 0 && (
                  <button onClick={markAllRead} className="flex items-center gap-1 text-[10px] text-white/40 hover:text-gold transition-colors">
                    <CheckCheck size={12} /> Mark all read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white transition-colors">
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-white/25 text-sm">
                  <Bell size={24} className="mx-auto mb-2 opacity-30" />
                  No notifications yet
                </div>
              ) : (
                notifications.map(n => {
                  const Icon = TYPE_ICONS[n.type] ?? Bell;
                  const color = TYPE_COLORS[n.type] ?? 'text-white/40';
                  return (
                    <div
                      key={n.id}
                      onClick={() => !n.read && markRead(n.id)}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 cursor-pointer hover:bg-white/3 transition-colors ${!n.read ? 'bg-gold/4' : ''}`}
                    >
                      <div className={`mt-0.5 flex-shrink-0 ${color}`}>
                        <Icon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold leading-tight ${n.read ? 'text-white/50' : 'text-white'}`}>{n.title}</p>
                        <p className="text-white/35 text-[10px] mt-0.5 leading-snug truncate">{n.body}</p>
                        <p className="text-white/20 text-[10px] mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                      </div>
                      {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0 mt-1.5" />}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
