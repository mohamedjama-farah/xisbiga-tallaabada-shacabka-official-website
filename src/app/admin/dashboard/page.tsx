'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import XTSLogo from '@/components/XTSLogo';
import XTSLogoBolt from '@/components/XTSLogoBolt';
import ImageUpload from '@/components/admin/ImageUpload';
import {
  Users, MessageSquare, Newspaper, LogOut, CheckCircle2, XCircle,
  Clock, Mail, TrendingUp, Shield, Eye, Trash2, Menu, X, ChevronRight,
  Heart, UserCog, Edit2, Plus, BarChart2, DollarSign, AlertCircle, MapPin, Calendar,
  Image as ImageIcon, FileText, Send, Download, Upload, PenLine,
  HelpCircle, Building2, Video, Settings,
} from 'lucide-react';
import NotificationBell from '@/components/admin/NotificationBell';
import { CONTENT_SCHEMA } from '@/lib/contentSchema';

type Tab = 'overview' | 'members' | 'messages' | 'news' | 'donations' | 'admins' | 'candidates' | 'events' | 'volunteers' | 'gallery' | 'documents' | 'complaints' | 'polls' | 'petitions' | 'rsvps' | 'newsletter' | 'content' | 'faq' | 'branches' | 'videos' | 'settings';

interface Member {
  id: string; firstName: string; lastName: string;
  email: string; phone: string | null; city: string | null;
  status: string; createdAt: string; message: string | null;
}
interface Message {
  id: string; name: string; email: string; subject: string;
  message: string; read: boolean; createdAt: string;
}
interface Stats {
  members: { total: number; pending: number; approved: number; rejected: number };
  messages: { total: number; unread: number };
  news: { total: number; published: number };
  donations: { total: number; confirmed: number; totalUSD: number };
  adminUsers: number;
  volunteers?: number;
  complaints?: { total: number; open: number };
  events?: number;
}
interface Complaint {
  id: string; fullName: string; phone: string | null; email: string | null;
  city: string; category: string; subject: string; body: string;
  status: string; read: boolean; createdAt: string;
}
interface Poll {
  id: string; questionEn: string; questionSo: string; active: boolean;
  endsAt: string | null; createdAt: string;
  options: { id: string; labelEn: string; labelSo: string; _count: { votes: number } }[];
}
interface NewsPost {
  id: string; titleEn: string; titleSo: string; excerpt: string | null;
  imageUrl: string | null; published: boolean; createdAt: string;
}
interface Donation {
  id: string; fullName: string; phone: string; email: string | null;
  amount: number; currency: string; method: string; status: string;
  message: string | null; createdAt: string; transactionId: string | null;
}
interface AdminUser {
  id: string; name: string; email: string; role: string; createdAt: string;
}
interface Volunteer {
  id: string; firstName: string; lastName: string; email: string | null;
  phone: string; city: string; region: string | null; skills: string[];
  availability: string; message: string | null; type: string;
  district: string | null; area: string | null; status: string; createdAt: string;
}
interface MediaItem {
  id: string; titleEn: string; titleSo: string; caption: string | null;
  imageUrl: string; eventName: string | null; published: boolean; createdAt: string;
}
interface Document {
  id: string; titleEn: string; titleSo: string; descEn: string | null;
  fileUrl: string; category: string; published: boolean; createdAt: string;
}
interface Event {
  id: string; titleEn: string; titleSo: string; descEn: string; descSo: string;
  location: string; date: string; time: string | null; type: string;
  online: boolean; published: boolean; createdAt: string;
}

interface Candidate {
  id: string; firstName: string; lastName: string; email: string | null;
  phone: string | null; level: string; state: string | null;
  region: string | null; district: string | null; subdistrict: string | null;
  constituency: string | null; notes: string | null; status: string; createdAt: string;
}

const SOMALIA_STATES = [
  { key: 'northeast',    en: 'North East State — Sool, Sanaag, Cayn', capital: 'Las Anod (Laascaanood)' },
  { key: 'galmudug',     en: 'Galmudug State',                  capital: 'Dhusamareb' },
  { key: 'hirshabelle',  en: 'Hirshabelle State',               capital: 'Jowhar' },
  { key: 'benadir',      en: 'Benadir (Mogadishu)',              capital: 'Mogadishu' },
  { key: 'southwest',    en: 'South West State',                 capital: 'Baidoa' },
  { key: 'jubaland',     en: 'Jubaland State',                   capital: 'Kismayo' },
  { key: 'somaliland',   en: 'Somaliland',                       capital: 'Hargeisa' },
];

const STATE_DISTRICTS: Record<string, string[]> = {
  northeast:   ['Las Anod (Laascaanood)', 'Taleh (Taleex)', 'Hudun (Xuddur)', "Bo'ame (Boocame)", 'Erigavo (Ceerigaabo)', 'Badhan', 'Las Khorey (Laasqoray)', 'Dhahar', 'Hingalol', 'Buuhoodle', 'Widhwidh'],
  galmudug:    ['Dhusamareb', 'Adado', 'Galkayo South', 'Abudwak', 'Balad Hawo', 'Cabudwaaq'],
  hirshabelle: ['Jowhar', 'Beledweyne', 'Mahadaay', 'Buloburde', 'Balcad', 'Bulo Burto'],
  benadir:     ['Hodan', 'Wadajir', 'Dharkenley', 'Waberi', 'Heliwa', 'Abdiaziz', 'Bondhere', 'Hamar Jajab', 'Hamar Weyne', 'Shangani', 'Karan', 'Kaxda', 'Daynile', 'Shibis', 'Yaqshid', 'Warta Nabadda', 'Deynile'],
  southwest:   ['Baidoa', 'Baraawe', 'Buur Hakaba', 'Huddur', 'Wajid', 'Marka', 'Kurtunwarey', 'Qoryooley'],
  jubaland:    ['Kismayo', 'Garbaharey', 'Bulo Hawa', 'Afmadow', 'Saakow', "Bu'aale", 'Doolow'],
  somaliland:  ['Hargeisa', 'Berbera', 'Borama', 'Burao', 'Erigavo', 'Ainabo'],
};

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  SUPER_ADMIN: { label: 'Super Admin', color: 'text-gold bg-gold/15 border-gold/30' },
  MEDIA_ADMIN: { label: 'Media Admin', color: 'text-blue-400 bg-blue-400/15 border-blue-400/30' },
  MEMBERS_ADMIN: { label: 'Members Admin', color: 'text-purple-400 bg-purple-400/15 border-purple-400/30' },
  EDITOR: { label: 'Editor', color: 'text-green-400 bg-green-400/15 border-green-400/30' },
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/admin/login');
  }, [status, router]);

  const userRole = (session?.user as { role?: string })?.role ?? '';
  const isSuperAdmin = userRole === 'SUPER_ADMIN';

  const [stats, setStats] = useState<Stats | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [pollFormOpen, setPollFormOpen] = useState(false);
  const [pollForm, setPollForm] = useState({ questionEn: '', questionSo: '', options: [{ labelEn: '', labelSo: '' }, { labelEn: '', labelSo: '' }] });
  const [pollSubmitting, setPollSubmitting] = useState(false);
  const [tab, setTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Gallery state
  const [galleryForm, setGalleryForm] = useState({ titleEn: '', titleSo: '', caption: '', imageUrl: '', eventName: '', eventDate: '', published: true });
  const [galleryFormOpen, setGalleryFormOpen] = useState(false);
  const [gallerySubmitting, setGallerySubmitting] = useState(false);

  // Document state
  const [docForm, setDocForm] = useState({ titleEn: '', titleSo: '', descEn: '', descSo: '', fileUrl: '', category: 'GENERAL', published: true });
  const [docFormOpen, setDocFormOpen] = useState(false);
  const [docSubmitting, setDocSubmitting] = useState(false);

  // Email blast state
  const [emailForm, setEmailForm] = useState({ subject: '', body: '', filter: 'all' });
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailResult, setEmailResult] = useState<{ sent?: number; failed?: number; total?: number; demoMode?: boolean; message?: string; wouldSendTo?: string[] } | null>(null);
  const [emailSending, setEmailSending] = useState(false);

  // Events state
  const [eventForm, setEventForm] = useState({ titleEn: '', titleSo: '', descEn: '', descSo: '', location: '', date: '', time: '', type: 'OTHER', online: false, published: true });
  const [eventFormOpen, setEventFormOpen] = useState(false);
  const [eventSubmitting, setEventSubmitting] = useState(false);

  // News state
  const [newsForm, setNewsForm] = useState({ titleEn: '', titleSo: '', contentEn: '', contentSo: '', excerpt: '', imageUrl: '', published: false });
  const [newsFormOpen, setNewsFormOpen] = useState(false);
  const [newsSubmitting, setNewsSubmitting] = useState(false);
  const [editingPost, setEditingPost] = useState<NewsPost | null>(null);
  const [editForm, setEditForm] = useState({ titleEn: '', titleSo: '', contentEn: '', contentSo: '', excerpt: '', imageUrl: '', published: false });

  // Candidate state
  const [candForm, setCandForm] = useState({ firstName: '', lastName: '', email: '', phone: '', level: 'STATE', state: '', region: '', district: '', subdistrict: '', constituency: '', notes: '', status: 'ACTIVE' });
  const [candFormOpen, setCandFormOpen] = useState(false);
  const [candSubmitting, setCandSubmitting] = useState(false);

  // Admin user create state
  const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '', role: 'EDITOR' });
  const [adminFormOpen, setAdminFormOpen] = useState(false);
  const [adminSubmitting, setAdminSubmitting] = useState(false);

  // Confirm delete state
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string; label: string } | null>(null);

  // Petitions
  const [petitions, setPetitions] = useState<{ id: string; titleEn: string; titleSo: string; goal: number; active: boolean; createdAt: string; _count: { signatures: number } }[]>([]);
  const [petitionForm, setPetitionForm] = useState({ titleEn: '', titleSo: '', descEn: '', descSo: '', goal: 1000, active: true });
  const [petitionFormOpen, setPetitionFormOpen] = useState(false);
  const [petitionSubmitting, setPetitionSubmitting] = useState(false);

  // RSVPs
  const [rsvps, setRsvps] = useState<{ id: string; name: string; phone: string; email: string | null; createdAt: string; event: { titleEn: string } }[]>([]);

  // Newsletter
  const [newsletterSubs, setNewsletterSubs] = useState<{ id: string; email: string; name: string | null; city: string | null; createdAt: string }[]>([]);

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(setStats).catch(() => {});
    fetch('/api/admin/members').then(r => r.json()).then(d => setMembers(d.members ?? [])).catch(() => {});
    fetch('/api/admin/messages').then(r => r.json()).then(d => setMessages(d.messages ?? [])).catch(() => {});
    fetch('/api/admin/news').then(r => r.json()).then(d => setNewsPosts(d.posts ?? [])).catch(() => {});
    fetch('/api/admin/donations').then(r => r.json()).then(d => setDonations(d.donations ?? [])).catch(() => {});
    fetch('/api/admin/candidates').then(r => r.json()).then(d => setCandidates(d.candidates ?? [])).catch(() => {});
    fetch('/api/admin/events').then(r => r.json()).then(d => setEvents(d.events ?? [])).catch(() => {});
    fetch('/api/admin/volunteers').then(r => r.json()).then(d => setVolunteers(d.volunteers ?? [])).catch(() => {});
    fetch('/api/admin/gallery').then(r => r.json()).then(d => setMediaItems(d.items ?? [])).catch(() => {});
    fetch('/api/admin/documents').then(r => r.json()).then(d => setDocuments(d.documents ?? [])).catch(() => {});
    fetch('/api/admin/complaints').then(r => r.json()).then(d => setComplaints(d.complaints ?? [])).catch(() => {});
    fetch('/api/admin/polls').then(r => r.json()).then(d => setPolls(d.polls ?? [])).catch(() => {});
    fetch('/api/admin/petition').then(r => r.json()).then(d => setPetitions(d.petitions ?? [])).catch(() => {});
    fetch('/api/admin/rsvps').then(r => r.json()).then(d => setRsvps(d.rsvps ?? [])).catch(() => {});
    fetch('/api/admin/newsletter').then(r => r.json()).then(d => setNewsletterSubs(d.subscribers ?? [])).catch(() => {});
    if (isSuperAdmin) {
      fetch('/api/admin/users').then(r => r.json()).then(d => setAdminUsers(d.users ?? [])).catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuperAdmin]);

  // Members
  const updateMemberStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/members/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    setMembers(m => m.map(x => x.id === id ? { ...x, status } : x));
    if (selectedMember?.id === id) setSelectedMember(sm => sm ? { ...sm, status } : null);
  };

  const deleteMember = async (id: string) => {
    await fetch(`/api/admin/members/${id}`, { method: 'DELETE' });
    setMembers(m => m.filter(x => x.id !== id));
    if (selectedMember?.id === id) setSelectedMember(null);
    setDeleteConfirm(null);
    setStats(s => s ? { ...s, members: { ...s.members, total: Math.max(0, s.members.total - 1) } } : s);
  };

  // Messages
  const markMessageRead = async (id: string) => {
    await fetch(`/api/admin/messages/${id}`, { method: 'PATCH' });
    setMessages(m => m.map(x => x.id === id ? { ...x, read: true } : x));
    setStats(s => s ? { ...s, messages: { ...s.messages, unread: Math.max(0, s.messages.unread - 1) } } : s);
  };

  const deleteMessage = async (id: string) => {
    await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
    setMessages(m => m.filter(x => x.id !== id));
    setDeleteConfirm(null);
    setStats(s => s ? { ...s, messages: { total: Math.max(0, s.messages.total - 1), unread: s.messages.unread } } : s);
  };

  // News
  const togglePublish = async (id: string, published: boolean) => {
    await fetch(`/api/admin/news/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ published }) });
    setNewsPosts(p => p.map(x => x.id === id ? { ...x, published } : x));
  };

  const deletePost = async (id: string) => {
    await fetch(`/api/admin/news/${id}`, { method: 'DELETE' });
    setNewsPosts(p => p.filter(x => x.id !== id));
    setDeleteConfirm(null);
  };

  const submitNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsSubmitting(true);
    const res = await fetch('/api/admin/news', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newsForm) });
    if (res.ok) {
      const { post } = await res.json();
      setNewsPosts(p => [post, ...p]);
      setNewsForm({ titleEn: '', titleSo: '', contentEn: '', contentSo: '', excerpt: '', imageUrl: '', published: false });
      setNewsFormOpen(false);
    }
    setNewsSubmitting(false);
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    const res = await fetch(`/api/admin/news/${editingPost.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editForm) });
    if (res.ok) {
      const { post } = await res.json();
      setNewsPosts(p => p.map(x => x.id === post.id ? post : x));
      setEditingPost(null);
    }
  };

  const openEdit = (post: NewsPost) => {
    setEditingPost(post);
    setEditForm({ titleEn: post.titleEn, titleSo: post.titleSo, contentEn: '', contentSo: '', excerpt: post.excerpt ?? '', imageUrl: post.imageUrl ?? '', published: post.published });
  };

  // Admin users
  const submitAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminSubmitting(true);
    const res = await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(adminForm) });
    if (res.ok) {
      const { user } = await res.json();
      setAdminUsers(u => [...u, user]);
      setAdminForm({ name: '', email: '', password: '', role: 'EDITOR' });
      setAdminFormOpen(false);
    }
    setAdminSubmitting(false);
  };

  const deleteAdminUser = async (id: string) => {
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    setAdminUsers(u => u.filter(x => x.id !== id));
    setDeleteConfirm(null);
  };

  // Candidates
  const submitCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCandSubmitting(true);
    const res = await fetch('/api/admin/candidates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(candForm) });
    if (res.ok) {
      const { candidate } = await res.json();
      setCandidates(c => [candidate, ...c]);
      setCandForm({ firstName: '', lastName: '', email: '', phone: '', level: 'STATE', state: '', region: '', district: '', subdistrict: '', constituency: '', notes: '', status: 'ACTIVE' });
      setCandFormOpen(false);
    }
    setCandSubmitting(false);
  };

  const deleteCandidate = async (id: string) => {
    await fetch(`/api/admin/candidates/${id}`, { method: 'DELETE' });
    setCandidates(c => c.filter(x => x.id !== id));
    setDeleteConfirm(null);
  };

  // Events
  const submitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setEventSubmitting(true);
    const res = await fetch('/api/admin/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(eventForm) });
    if (res.ok) {
      const { event } = await res.json();
      setEvents(ev => [event, ...ev]);
      setEventForm({ titleEn: '', titleSo: '', descEn: '', descSo: '', location: '', date: '', time: '', type: 'OTHER', online: false, published: true });
      setEventFormOpen(false);
    }
    setEventSubmitting(false);
  };

  const deleteEvent = async (id: string) => {
    await fetch(`/api/admin/events/${id}`, { method: 'DELETE' });
    setEvents(ev => ev.filter(x => x.id !== id));
    setDeleteConfirm(null);
  };

  // Gallery actions
  const [galleryError, setGalleryError] = useState('');
  const submitGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.imageUrl) { setGalleryError('Please upload a photo first.'); return; }
    setGallerySubmitting(true);
    setGalleryError('');
    try {
      const res = await fetch('/api/admin/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(galleryForm) });
      const data = await res.json();
      if (res.ok && data.item) {
        setMediaItems(m => [data.item, ...m]);
        setGalleryForm({ titleEn: '', titleSo: '', caption: '', imageUrl: '', eventName: '', eventDate: '', published: true });
        setGalleryFormOpen(false);
      } else {
        setGalleryError(data.error ?? 'Failed to save. Please try again.');
      }
    } catch {
      setGalleryError('Network error. Please try again.');
    }
    setGallerySubmitting(false);
  };

  const deleteGalleryItem = async (id: string) => {
    await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
    setMediaItems(m => m.filter(x => x.id !== id));
    setDeleteConfirm(null);
  };

  // Document actions
  const submitDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.fileUrl) { alert('Please upload a file first.'); return; }
    setDocSubmitting(true);
    const res = await fetch('/api/admin/documents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(docForm) });
    if (res.ok) {
      const { document: doc } = await res.json();
      setDocuments(d => [doc, ...d]);
      setDocForm({ titleEn: '', titleSo: '', descEn: '', descSo: '', fileUrl: '', category: 'GENERAL', published: true });
      setDocFormOpen(false);
    }
    setDocSubmitting(false);
  };

  const deleteDoc = async (id: string) => {
    await fetch(`/api/admin/documents/${id}`, { method: 'DELETE' });
    setDocuments(d => d.filter(x => x.id !== id));
    setDeleteConfirm(null);
  };

  // Volunteer actions
  const deleteVolunteer = async (id: string) => {
    await fetch(`/api/admin/volunteers/${id}`, { method: 'DELETE' });
    setVolunteers(v => v.filter(x => x.id !== id));
    setDeleteConfirm(null);
  };

  // Email blast
  const sendEmailBlast = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSending(true);
    setEmailResult(null);
    const res = await fetch('/api/admin/email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(emailForm) });
    const data = await res.json();
    setEmailResult(data);
    setEmailSending(false);
  };

  const navItems: { id: Tab; label: string; icon: React.ElementType; superOnly?: boolean }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'donations', label: 'Donations', icon: Heart },
    { id: 'candidates', label: 'Candidates', icon: MapPin },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'volunteers', label: 'Volunteers', icon: Heart },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'complaints', label: 'Complaints', icon: AlertCircle },
    { id: 'polls', label: 'Polls', icon: BarChart2 },
    { id: 'petitions', label: 'Petitions', icon: FileText },
    { id: 'rsvps', label: 'RSVPs', icon: Calendar },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
    { id: 'content', label: 'Page Content', icon: PenLine },
    { id: 'faq', label: 'FAQ Manager', icon: HelpCircle },
    { id: 'branches', label: 'Branch Offices', icon: Building2 },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'settings', label: 'Site Settings', icon: Settings },
    { id: 'admins', label: 'Admin Users', icon: UserCog, superOnly: true },
  ];

  return (
    <div className="min-h-screen bg-[#060c1e] flex overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed lg:relative z-40 top-0 left-0 h-screen w-64 bg-[#0a1128] border-r border-white/8 flex flex-col shrink-0"
          >
            {/* Brand */}
            <div className="p-5 border-b border-white/8 flex flex-col gap-2">
              <XTSLogoBolt size="xs" animate={false} darkBg={true} />
              <div className="text-white/30 text-[10px] uppercase tracking-widest pl-0.5">Admin Control Panel</div>
            </div>

            {/* Session badge */}
            <div className="mx-4 mt-4 px-3 py-2 rounded-xl bg-green-500/8 border border-green-500/20 flex items-center gap-2">
              <Shield size={13} className="text-green-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-green-400 text-[11px] font-semibold">Session Active</div>
                <div className="text-white/30 text-[10px] truncate">{session?.user?.name}</div>
              </div>
              <span className={`ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded border ${ROLE_LABELS[userRole]?.color ?? 'text-white/30 bg-white/5 border-white/10'}`}>
                {ROLE_LABELS[userRole]?.label ?? userRole}
              </span>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1 mt-2 overflow-y-auto">
              {navItems.filter(n => !n.superOnly || isSuperAdmin).map(({ id, label, icon: Icon }) => {
                const active = tab === id;
                const badge = id === 'messages' && (stats?.messages.unread ?? 0) > 0 ? stats!.messages.unread : null;
                const membBadge = id === 'members' && (stats?.members.pending ?? 0) > 0 ? stats!.members.pending : null;
                return (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      active ? 'bg-gold text-navy' : 'text-white/50 hover:text-white hover:bg-white/6'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={17} />
                      {label}
                    </span>
                    <span className="flex items-center gap-1">
                      {(badge ?? membBadge) ? (
                        <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${active ? 'bg-navy text-gold' : 'bg-red-500 text-white'}`}>
                          {badge ?? membBadge}
                        </span>
                      ) : active ? <ChevronRight size={13} /> : null}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Sign out + utilities */}
            <div className="p-4 border-t border-white/8 space-y-1">
              {/* CSV Export */}
              <div className="flex gap-1 mb-1">
                {[
                  { label: 'Members CSV', type: 'members' },
                  { label: 'Volunteers', type: 'volunteers' },
                  { label: 'Donations', type: 'donations' },
                ].map(({ label, type }) => (
                  <a key={type} href={`/api/admin/export?type=${type}`} download
                    className="flex-1 text-center text-[10px] font-bold px-1 py-1.5 rounded-lg bg-white/5 hover:bg-gold/15 text-white/40 hover:text-gold border border-white/8 hover:border-gold/30 transition-all">
                    ↓ {label}
                  </a>
                ))}
              </div>
              {/* Change Password */}
              <button onClick={() => {
                const current = prompt('Current password:');
                if (!current) return;
                const next = prompt('New password (min 8 chars):');
                if (!next || next.length < 8) { alert('Password too short.'); return; }
                const confirm = prompt('Confirm new password:');
                if (next !== confirm) { alert('Passwords do not match.'); return; }
                fetch('/api/admin/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: current, newPassword: next }) })
                  .then(r => r.json())
                  .then(d => alert(d.ok ? '✅ Password changed successfully.' : `❌ ${d.error}`));
              }} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-white/40 hover:bg-white/6 hover:text-white/70 transition-colors">
                🔑 Change My Password
              </button>
              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <LogOut size={17} /> Sign Out Securely
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-[#0a1128]/80 backdrop-blur border-b border-white/8 flex items-center px-5 gap-4 shrink-0 z-30">
          <button onClick={() => setSidebarOpen(o => !o)} className="text-white/50 hover:text-white transition-colors p-1">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-bold text-sm capitalize">{navItems.find(n => n.id === tab)?.label}</h1>
            <p className="text-white/25 text-[11px]">Xisbiga Tallaabada Shacabka</p>
          </div>
          <div className="text-white/25 text-[11px] hidden sm:block shrink-0">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <NotificationBell />
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 lg:p-7">
          <AnimatePresence mode="wait">

            {/* ─── OVERVIEW ─── */}
            {tab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
                  {[
                    { label: 'Total Members', value: stats?.members.total, icon: Users, color: 'text-gold', bg: 'bg-gold/10', border: 'border-gold/20' },
                    { label: 'Pending Review', value: stats?.members.pending, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
                    { label: 'Approved Members', value: stats?.members.approved, icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
                    { label: 'Unread Messages', value: stats?.messages.unread, icon: Mail, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
                    { label: 'Volunteers', value: stats?.volunteers, icon: Heart, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
                    { label: 'Open Complaints', value: stats?.complaints?.open, icon: AlertCircle, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
                    { label: 'Total Donations', value: stats?.donations.total, icon: DollarSign, color: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-400/20' },
                    { label: 'Confirmed (USD)', value: stats ? `$${stats.donations.totalUSD.toLocaleString()}` : undefined, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
                  ].map((card, i) => {
                    const Icon = card.icon;
                    return (
                      <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className={`p-5 rounded-2xl bg-white/3 border ${card.border} flex items-start gap-3`}>
                        <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center shrink-0`}>
                          <Icon size={19} className={card.color} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xl font-black text-white">{card.value ?? '—'}</div>
                          <div className="text-white/35 text-[11px] mt-0.5 leading-tight">{card.label}</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Charts row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-7">
                  {/* Member status chart */}
                  <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
                    <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                      <Users size={15} className="text-gold" /> Member Status Breakdown
                    </h3>
                    {stats && (
                      <div className="space-y-3">
                        {[
                          { label: 'Approved', count: stats.members.approved, color: 'bg-green-500', total: stats.members.total },
                          { label: 'Pending', count: stats.members.pending, color: 'bg-yellow-400', total: stats.members.total },
                          { label: 'Rejected', count: stats.members.rejected, color: 'bg-red-500', total: stats.members.total },
                        ].map(row => (
                          <div key={row.label}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-white/50">{row.label}</span>
                              <span className="text-white font-semibold">{row.count}</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/8 overflow-hidden">
                              <div className={`h-full ${row.color} rounded-full transition-all duration-700`}
                                style={{ width: row.total > 0 ? `${(row.count / row.total) * 100}%` : '0%' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* News & donations summary */}
                  <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
                    <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                      <TrendingUp size={15} className="text-gold" /> Content & Donations
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/4">
                        <div className="text-white/50 text-xs">News Posts</div>
                        <div className="text-right">
                          <div className="text-white font-bold">{stats?.news.total ?? 0}</div>
                          <div className="text-white/30 text-[10px]">{stats?.news.published ?? 0} published</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/4">
                        <div className="text-white/50 text-xs">Donations Received</div>
                        <div className="text-right">
                          <div className="text-white font-bold">{stats?.donations.total ?? 0}</div>
                          <div className="text-white/30 text-[10px]">{stats?.donations.confirmed ?? 0} confirmed</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
                        <div className="text-emerald-400 text-xs font-semibold">Confirmed Total</div>
                        <div className="text-emerald-400 font-black">${(stats?.donations.totalUSD ?? 0).toLocaleString()} USD</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent members */}
                <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
                  <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                    <Clock size={15} className="text-yellow-400" /> Recent Applications
                  </h3>
                  <div className="space-y-2">
                    {members.slice(0, 6).map(m => (
                      <div key={m.id} onClick={() => { setTab('members'); setSelectedMember(m); }}
                        className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-white/4 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold font-bold text-xs shrink-0">
                            {m.firstName[0]}{m.lastName[0]}
                          </div>
                          <div>
                            <span className="text-white text-sm font-medium">{m.firstName} {m.lastName}</span>
                            <span className="text-white/35 ml-2 text-xs">{m.city ?? m.email}</span>
                          </div>
                        </div>
                        <StatusBadge status={m.status} />
                      </div>
                    ))}
                    {members.length === 0 && <p className="text-white/25 text-sm text-center py-4">No applications yet.</p>}
                  </div>
                </div>

                {/* Donation Goal Setting */}
                <DonationGoalEditor />
              </motion.div>
            )}

            {/* ─── MEMBERS ─── */}
            {tab === 'members' && (
              <motion.div key="members" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex flex-col xl:flex-row gap-5">
                  {/* Table */}
                  <div className="flex-1 bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
                    <div className="p-5 border-b border-white/8 flex items-center justify-between gap-4 flex-wrap">
                      <h3 className="text-white font-bold">All Members ({members.length})</h3>
                      <div className="flex gap-2 flex-wrap">
                        {['PENDING', 'APPROVED', 'REJECTED'].map(s => (
                          <span key={s} className={`px-2 py-1 rounded-full text-[11px] font-bold border ${
                            s === 'APPROVED' ? 'bg-green-400/10 text-green-400 border-green-400/25' :
                            s === 'REJECTED' ? 'bg-red-400/10 text-red-400 border-red-400/25' :
                            'bg-yellow-400/10 text-yellow-400 border-yellow-400/25'
                          }`}>
                            {members.filter(m => m.status === s).length} {s.toLowerCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/5">
                            {['Name', 'Email', 'City', 'Status', 'Date', ''].map(h => (
                              <th key={h} className="text-left px-4 py-3 text-white/30 font-semibold text-[11px] uppercase tracking-wider">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {members.map(m => (
                            <tr key={m.id} onClick={() => setSelectedMember(m)}
                              className="border-b border-white/4 cursor-pointer hover:bg-white/3 transition-colors">
                              <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{m.firstName} {m.lastName}</td>
                              <td className="px-4 py-3 text-white/45 text-xs">{m.email}</td>
                              <td className="px-4 py-3 text-white/35 text-xs">{m.city ?? '—'}</td>
                              <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                              <td className="px-4 py-3 text-white/25 text-xs whitespace-nowrap">{new Date(m.createdAt).toLocaleDateString()}</td>
                              <td className="px-4 py-3">
                                <button onClick={e => { e.stopPropagation(); setDeleteConfirm({ type: 'member', id: m.id, label: `${m.firstName} ${m.lastName}` }); }}
                                  className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                                  <Trash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {members.length === 0 && <div className="text-center py-16 text-white/20 text-sm">No members yet.</div>}
                    </div>
                  </div>

                  {/* Detail panel */}
                  <AnimatePresence>
                    {selectedMember && (
                      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
                        className="w-full xl:w-72 bg-white/3 border border-white/8 rounded-2xl p-5 h-fit shrink-0">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-white font-bold text-sm">Member Detail</h3>
                          <button onClick={() => setSelectedMember(null)} className="text-white/25 hover:text-white p-1"><X size={16} /></button>
                        </div>
                        <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-black text-lg mb-3 mx-auto">
                          {selectedMember.firstName[0]}{selectedMember.lastName[0]}
                        </div>
                        <div className="text-center mb-4">
                          <div className="text-white font-bold">{selectedMember.firstName} {selectedMember.lastName}</div>
                          <div className="text-white/35 text-xs mt-0.5">{selectedMember.email}</div>
                          {selectedMember.phone && <div className="text-white/30 text-xs">{selectedMember.phone}</div>}
                          <div className="mt-2 flex justify-center"><StatusBadge status={selectedMember.status} /></div>
                        </div>
                        {selectedMember.city && <div className="text-white/35 text-xs mb-2">📍 {selectedMember.city}</div>}
                        {selectedMember.message && (
                          <div className="bg-white/4 rounded-xl p-3 mb-4">
                            <div className="text-gold/50 text-[10px] mb-1 font-semibold uppercase">Why joining</div>
                            <p className="text-white/50 text-xs leading-relaxed">{selectedMember.message}</p>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <button onClick={() => updateMemberStatus(selectedMember.id, 'APPROVED')}
                            className="flex items-center justify-center gap-1.5 py-2.5 bg-green-400/10 text-green-400 border border-green-400/20 rounded-xl text-xs font-bold hover:bg-green-400/20 transition-colors">
                            <CheckCircle2 size={13} /> Approve
                          </button>
                          <button onClick={() => updateMemberStatus(selectedMember.id, 'REJECTED')}
                            className="flex items-center justify-center gap-1.5 py-2.5 bg-red-400/10 text-red-400 border border-red-400/20 rounded-xl text-xs font-bold hover:bg-red-400/20 transition-colors">
                            <XCircle size={13} /> Reject
                          </button>
                        </div>
                        <button onClick={() => setDeleteConfirm({ type: 'member', id: selectedMember.id, label: `${selectedMember.firstName} ${selectedMember.lastName}` })}
                          className="w-full py-2.5 bg-red-400/8 text-red-400/70 border border-red-400/15 rounded-xl text-xs font-semibold hover:bg-red-400/15 transition-colors flex items-center justify-center gap-2">
                          <Trash2 size={12} /> Delete Member
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* ─── EMAIL BLAST (floating panel in members tab) ─── */}
            {tab === 'members' && (
              <div className="mt-6">
                <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-bold text-sm flex items-center gap-2"><Send size={15} className="text-gold" /> Email Blast to Members</h3>
                      <p className="text-white/30 text-xs mt-0.5">Send a message to all or selected members who have email addresses</p>
                    </div>
                    <button onClick={() => setEmailOpen(o => !o)} className="flex items-center gap-2 px-4 py-2 bg-white/8 border border-white/10 text-white/60 font-bold rounded-xl text-xs hover:border-gold/30 hover:text-gold transition-colors">
                      {emailOpen ? 'Hide' : 'Compose'}
                    </button>
                  </div>
                  <AnimatePresence>
                    {emailOpen && (
                      <motion.form onSubmit={sendEmailBlast} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <Field label="Send To">
                            <select value={emailForm.filter} onChange={e => setEmailForm(f => ({ ...f, filter: e.target.value }))} className="admin-input">
                              <option value="all">All members with email</option>
                              <option value="approved">Approved members only</option>
                              <option value="pending">Pending members only</option>
                            </select>
                          </Field>
                          <div className="sm:col-span-2">
                            <Field label="Subject *">
                              <input required value={emailForm.subject} onChange={e => setEmailForm(f => ({ ...f, subject: e.target.value }))} className="admin-input" placeholder="Email subject..." />
                            </Field>
                          </div>
                        </div>
                        <Field label="Message Body *">
                          <textarea required rows={4} value={emailForm.body} onChange={e => setEmailForm(f => ({ ...f, body: e.target.value }))} className="admin-input resize-y" placeholder="Type your message here. Each blank line creates a new paragraph..." />
                        </Field>
                        {emailResult && (
                          <div className={`rounded-xl p-4 text-sm ${emailResult.demoMode ? 'bg-amber-500/10 border border-amber-500/30 text-amber-200' : 'bg-green-500/10 border border-green-500/30 text-green-200'}`}>
                            {emailResult.demoMode
                              ? `⚠️ Demo mode — ${emailResult.message} Would send to ${emailResult.total} members.`
                              : `✅ Sent to ${emailResult.sent} members. ${emailResult.failed ? `${emailResult.failed} failed.` : ''}`}
                          </div>
                        )}
                        <div className="flex justify-end">
                          <button type="submit" disabled={emailSending}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gold text-navy font-bold rounded-xl text-sm hover:bg-gold/90 disabled:opacity-50 transition-colors">
                            <Send size={14} /> {emailSending ? 'Sending…' : 'Send Email Blast'}
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* ─── MESSAGES ─── */}
            {tab === 'messages' && (
              <motion.div key="messages" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="space-y-3">
                  {messages.map((msg, i) => (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      className={`p-5 rounded-2xl border transition-colors ${msg.read ? 'bg-white/2 border-white/6' : 'bg-white/5 border-gold/20'}`}>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center text-gold font-bold text-sm shrink-0">
                            {msg.name[0]}
                          </div>
                          <div>
                            <div className="text-white font-bold text-sm">{msg.name}</div>
                            <div className="text-white/35 text-xs">{msg.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {!msg.read && <span className="px-2 py-0.5 bg-gold/20 text-gold text-[10px] rounded-full font-bold">NEW</span>}
                          <span className="text-white/25 text-xs">{new Date(msg.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-gold/70 text-xs font-semibold mb-1.5">{msg.subject}</div>
                      <p className="text-white/45 text-sm leading-relaxed">{msg.message}</p>
                      <div className="mt-3 flex gap-2">
                        {!msg.read && (
                          <button onClick={() => markMessageRead(msg.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gold/10 text-gold text-xs rounded-lg font-semibold hover:bg-gold/20 transition-colors">
                            <Eye size={12} /> Mark Read
                          </button>
                        )}
                        <button onClick={() => setDeleteConfirm({ type: 'message', id: msg.id, label: `message from ${msg.name}` })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-400/10 text-red-400 text-xs rounded-lg font-semibold hover:bg-red-400/20 transition-colors">
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  {messages.length === 0 && (
                    <div className="text-center py-20 text-white/20">
                      <MessageSquare size={36} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No messages yet.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ─── NEWS ─── */}
            {tab === 'news' && (
              <motion.div key="news" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-white font-bold">News Posts ({newsPosts.length})</h2>
                    <p className="text-white/30 text-xs mt-0.5">{newsPosts.filter(p => p.published).length} published · {newsPosts.filter(p => !p.published).length} drafts</p>
                  </div>
                  <button onClick={() => setNewsFormOpen(o => !o)}
                    className="flex items-center gap-2 px-4 py-2 bg-gold text-navy font-bold rounded-xl text-sm hover:bg-gold/90 transition-colors">
                    <Plus size={15} /> {newsFormOpen ? 'Cancel' : 'New Post'}
                  </button>
                </div>

                {/* Create form */}
                <AnimatePresence>
                  {newsFormOpen && (
                    <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      onSubmit={submitNews} className="overflow-hidden mb-5">
                      <div className="bg-white/3 border border-gold/20 rounded-2xl p-5 space-y-4">
                        <div className="text-gold font-bold text-sm">New Article</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Field label="Title (English) *">
                            <input required value={newsForm.titleEn} onChange={e => setNewsForm(f => ({ ...f, titleEn: e.target.value }))}
                              className="admin-input" placeholder="Article title in English" />
                          </Field>
                          <Field label="Title (Somali) *">
                            <input required value={newsForm.titleSo} onChange={e => setNewsForm(f => ({ ...f, titleSo: e.target.value }))}
                              className="admin-input" placeholder="Cinwaanka Soomaaliga" />
                          </Field>
                        </div>
                        <Field label="Short Excerpt">
                          <input value={newsForm.excerpt} onChange={e => setNewsForm(f => ({ ...f, excerpt: e.target.value }))}
                            className="admin-input" placeholder="Brief summary shown on listing…" />
                        </Field>
                        <ImageUpload
                          label="Image"
                          value={newsForm.imageUrl}
                          onChange={url => setNewsForm(f => ({ ...f, imageUrl: url }))}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Field label="Content (English) *">
                            <textarea required rows={5} value={newsForm.contentEn} onChange={e => setNewsForm(f => ({ ...f, contentEn: e.target.value }))}
                              className="admin-input resize-y" placeholder="Full article body in English…" />
                          </Field>
                          <Field label="Content (Somali) *">
                            <textarea required rows={5} value={newsForm.contentSo} onChange={e => setNewsForm(f => ({ ...f, contentSo: e.target.value }))}
                              className="admin-input resize-y" placeholder="Qoraalka buuxa Soomaaliga…" />
                          </Field>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <Toggle checked={newsForm.published} onChange={v => setNewsForm(f => ({ ...f, published: v }))}
                            label={newsForm.published ? 'Publish immediately' : 'Save as draft'} />
                          <button type="submit" disabled={newsSubmitting}
                            className="flex items-center gap-2 px-5 py-2 bg-gold text-navy font-bold rounded-xl text-sm hover:bg-gold/90 disabled:opacity-50 transition-colors">
                            {newsSubmitting ? <Spinner /> : null}
                            {newsSubmitting ? 'Saving…' : 'Save Post'}
                          </button>
                        </div>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Posts list */}
                <div className="space-y-3">
                  {newsPosts.map((post, i) => (
                    <motion.div key={post.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-white/3 border border-white/8 hover:border-white/14 transition-colors">
                      {post.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={post.imageUrl} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0 opacity-80" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div className="min-w-0">
                            <div className="text-white font-bold text-sm truncate">{post.titleEn}</div>
                            <div className="text-white/35 text-xs mt-0.5 truncate">{post.titleSo}</div>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${post.published ? 'bg-green-400/15 text-green-400 border-green-400/30' : 'bg-yellow-400/15 text-yellow-400 border-yellow-400/30'}`}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        {post.excerpt && <p className="text-white/30 text-xs mt-1.5 line-clamp-1">{post.excerpt}</p>}
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          <span className="text-white/20 text-[10px]">{new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <button onClick={() => openEdit(post)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-400/10 text-blue-400 hover:bg-blue-400/20 transition-colors">
                            <Edit2 size={10} /> Edit
                          </button>
                          <button onClick={() => togglePublish(post.id, !post.published)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${post.published ? 'bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20' : 'bg-green-400/10 text-green-400 hover:bg-green-400/20'}`}>
                            {post.published ? 'Unpublish' : 'Publish'}
                          </button>
                          <button onClick={() => setDeleteConfirm({ type: 'post', id: post.id, label: post.titleEn })}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-colors">
                            <Trash2 size={10} /> Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {newsPosts.length === 0 && !newsFormOpen && (
                    <div className="text-center py-16 text-white/20">
                      <Newspaper size={36} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No news posts yet.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ─── DONATIONS ─── */}
            {tab === 'donations' && (
              <motion.div key="donations" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total Donations', value: stats?.donations.total, color: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-400/20' },
                    { label: 'Confirmed', value: stats?.donations.confirmed, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
                    { label: 'Total Raised (USD)', value: `$${(stats?.donations.totalUSD ?? 0).toLocaleString()}`, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
                    { label: 'Pending', value: (stats?.donations.total ?? 0) - (stats?.donations.confirmed ?? 0), color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
                  ].map(card => (
                    <div key={card.label} className={`p-4 rounded-2xl bg-white/3 border ${card.border}`}>
                      <div className={`text-2xl font-black ${card.color}`}>{card.value ?? '—'}</div>
                      <div className="text-white/35 text-xs mt-1">{card.label}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
                  <div className="p-4 border-b border-white/8">
                    <h3 className="text-white font-bold text-sm">Donation Records</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5">
                          {['Donor', 'Amount', 'Method', 'Status', 'Date', 'Actions'].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-white/30 font-semibold text-[11px] uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {donations.map(d => (
                          <tr key={d.id} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                            <td className="px-4 py-3">
                              <div className="text-white font-medium text-sm">{d.fullName}</div>
                              {d.email && <div className="text-white/30 text-xs">{d.email}</div>}
                              <div className="text-white/25 text-xs">{d.phone}</div>
                            </td>
                            <td className="px-4 py-3 text-gold font-bold">{d.currency} {d.amount.toLocaleString()}</td>
                            <td className="px-4 py-3 text-white/40 text-xs">{d.method}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                d.status === 'CONFIRMED' ? 'bg-green-400/15 text-green-400 border-green-400/30' :
                                d.status === 'REJECTED' ? 'bg-red-400/15 text-red-400 border-red-400/30' :
                                'bg-yellow-400/15 text-yellow-400 border-yellow-400/30'
                              }`}>{d.status}</span>
                            </td>
                            <td className="px-4 py-3 text-white/25 text-xs">{new Date(d.createdAt).toLocaleDateString()}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5">
                                {d.status !== 'CONFIRMED' && (
                                  <button onClick={async () => {
                                    await fetch(`/api/admin/donations/${d.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'CONFIRMED' }) });
                                    setDonations(ds => ds.map(x => x.id === d.id ? { ...x, status: 'CONFIRMED' } : x));
                                  }} className="px-2 py-1 bg-green-500/15 border border-green-500/30 text-green-400 text-[10px] font-bold rounded-lg hover:bg-green-500/25 transition-colors">
                                    ✓ Confirm
                                  </button>
                                )}
                                {d.status !== 'REJECTED' && (
                                  <button onClick={async () => {
                                    await fetch(`/api/admin/donations/${d.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'REJECTED' }) });
                                    setDonations(ds => ds.map(x => x.id === d.id ? { ...x, status: 'REJECTED' } : x));
                                  }} className="px-2 py-1 bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-bold rounded-lg hover:bg-red-500/25 transition-colors">
                                    ✗ Reject
                                  </button>
                                )}
                                <button onClick={async () => {
                                  if (!confirm('Delete this donation record?')) return;
                                  await fetch(`/api/admin/donations/${d.id}`, { method: 'DELETE' });
                                  setDonations(ds => ds.filter(x => x.id !== d.id));
                                }} className="p-1 text-white/20 hover:text-red-400 transition-colors">
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {donations.length === 0 && (
                      <div className="text-center py-16 text-white/20">
                        <Heart size={36} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No donations recorded yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── CANDIDATES / REPRESENTATIVES ─── */}
            {tab === 'candidates' && (
              <motion.div key="candidates" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-white font-bold">Political Candidates ({candidates.length})</h2>
                    <p className="text-white/30 text-xs mt-0.5">Register XTS candidates for federal and state positions</p>
                  </div>
                  <button onClick={() => setCandFormOpen(o => !o)}
                    className="flex items-center gap-2 px-4 py-2 bg-gold text-navy font-bold rounded-xl text-sm hover:bg-gold/90 transition-colors">
                    <Plus size={15} /> {candFormOpen ? 'Cancel' : 'Add Candidate'}
                  </button>
                </div>

                {/* Registration form */}
                <AnimatePresence>
                  {candFormOpen && (
                    <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      onSubmit={submitCandidate} className="overflow-hidden mb-6">
                      <div className="bg-white/3 border border-gold/20 rounded-2xl p-6 space-y-5">
                        <div className="text-gold font-bold text-sm">Register New Candidate</div>

                        {/* Personal details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Field label="First Name *">
                            <input required value={candForm.firstName} onChange={e => setCandForm(f => ({ ...f, firstName: e.target.value }))} className="admin-input" placeholder="First name" />
                          </Field>
                          <Field label="Last Name *">
                            <input required value={candForm.lastName} onChange={e => setCandForm(f => ({ ...f, lastName: e.target.value }))} className="admin-input" placeholder="Last name" />
                          </Field>
                          <Field label="Email">
                            <input type="email" value={candForm.email} onChange={e => setCandForm(f => ({ ...f, email: e.target.value }))} className="admin-input" placeholder="candidate@example.com" />
                          </Field>
                          <Field label="Phone">
                            <input value={candForm.phone} onChange={e => setCandForm(f => ({ ...f, phone: e.target.value }))} className="admin-input" placeholder="+252..." />
                          </Field>
                        </div>

                        {/* Political level */}
                        <div className="border-t border-white/8 pt-4">
                          <div className="text-white/50 text-xs font-semibold uppercase tracking-wide mb-3">Political Level & Position</div>
                          <Field label="Election Level *">
                            <select required value={candForm.level} onChange={e => setCandForm(f => ({ ...f, level: e.target.value, state: '', district: '' }))} className="admin-input">
                              <option value="FEDERAL_UPPER">Federal — Upper House (Senate / Golaha Guurtida)</option>
                              <option value="FEDERAL_LOWER">Federal — Lower House (House of the People / Golaha Shacabka)</option>
                              <option value="STATE">State Assembly (Golaha Shacabka Gobolka)</option>
                            </select>
                          </Field>
                        </div>

                        {/* State selection — shown for STATE and FEDERAL levels */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Field label={candForm.level === 'STATE' ? 'State *' : 'Representing State'}>
                            <select value={candForm.state} onChange={e => setCandForm(f => ({ ...f, state: e.target.value, district: '' }))} className="admin-input">
                              <option value="">— Select state —</option>
                              {SOMALIA_STATES.map(s => (
                                <option key={s.key} value={s.key}>{s.en} (Capital: {s.capital})</option>
                              ))}
                            </select>
                          </Field>

                          {/* District — shown when state is selected and level is STATE */}
                          {candForm.level === 'STATE' && candForm.state && (
                            <Field label="District / Constituency *">
                              <select required value={candForm.district} onChange={e => setCandForm(f => ({ ...f, district: e.target.value }))} className="admin-input">
                                <option value="">— Select district —</option>
                                {(STATE_DISTRICTS[candForm.state] ?? []).map(d => (
                                  <option key={d} value={d}>{d}</option>
                                ))}
                              </select>
                            </Field>
                          )}

                          {/* Constituency for Federal Lower */}
                          {candForm.level === 'FEDERAL_LOWER' && (
                            <Field label="Constituency / Region">
                              <input value={candForm.constituency} onChange={e => setCandForm(f => ({ ...f, constituency: e.target.value }))} className="admin-input" placeholder="e.g. Bosaso, Mogadishu — Hodan" />
                            </Field>
                          )}
                        </div>

                        {/* Geographic details */}
                        <div className="border-t border-white/8 pt-4">
                          <div className="text-white/50 text-xs font-semibold uppercase tracking-wide mb-3">Geographic Details</div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <Field label="Region (Gobol)">
                              <input value={candForm.region} onChange={e => setCandForm(f => ({ ...f, region: e.target.value }))} className="admin-input" placeholder="e.g. Bari, Galgadud" />
                            </Field>
                            <Field label="Sub-district">
                              <input value={candForm.subdistrict} onChange={e => setCandForm(f => ({ ...f, subdistrict: e.target.value }))} className="admin-input" placeholder="Sub-district name" />
                            </Field>
                            <Field label="Status">
                              <select value={candForm.status} onChange={e => setCandForm(f => ({ ...f, status: e.target.value }))} className="admin-input">
                                <option value="ACTIVE">Active</option>
                                <option value="PENDING">Pending Review</option>
                                <option value="INACTIVE">Inactive</option>
                              </select>
                            </Field>
                          </div>
                        </div>

                        <Field label="Notes">
                          <textarea rows={2} value={candForm.notes} onChange={e => setCandForm(f => ({ ...f, notes: e.target.value }))} className="admin-input resize-y" placeholder="Any additional notes about this candidate…" />
                        </Field>

                        <div className="flex justify-end">
                          <button type="submit" disabled={candSubmitting}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gold text-navy font-bold rounded-xl text-sm hover:bg-gold/90 disabled:opacity-50 transition-colors">
                            {candSubmitting ? <Spinner /> : null}
                            {candSubmitting ? 'Registering…' : 'Register Candidate'}
                          </button>
                        </div>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Candidates list */}
                <div className="space-y-3">
                  {candidates.map((c, i) => (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      className="p-4 rounded-2xl bg-white/3 border border-white/8 hover:border-white/14 transition-colors">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold font-black text-sm shrink-0">
                            {c.firstName[0]}{c.lastName[0]}
                          </div>
                          <div>
                            <div className="text-white font-bold">{c.firstName} {c.lastName}</div>
                            <div className="text-white/35 text-xs mt-0.5 flex flex-wrap gap-2">
                              {c.email && <span>{c.email}</span>}
                              {c.phone && <span>{c.phone}</span>}
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                c.level === 'FEDERAL_UPPER' ? 'bg-blue-400/15 text-blue-400 border-blue-400/30' :
                                c.level === 'FEDERAL_LOWER' ? 'bg-gold/15 text-gold border-gold/30' :
                                'bg-purple-400/15 text-purple-400 border-purple-400/30'
                              }`}>
                                {c.level === 'FEDERAL_UPPER' ? 'Federal Upper House' : c.level === 'FEDERAL_LOWER' ? 'Federal Lower House' : 'State Assembly'}
                              </span>
                              {c.state && <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/8 text-white/50 border border-white/10">{SOMALIA_STATES.find(s => s.key === c.state)?.en ?? c.state}</span>}
                              {c.district && <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-white/40 border border-white/8 flex items-center gap-1"><MapPin size={8} /> {c.district}</span>}
                              {c.region && <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-white/35 border border-white/8">{c.region} region</span>}
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                c.status === 'ACTIVE' ? 'bg-green-400/15 text-green-400 border-green-400/30' :
                                c.status === 'PENDING' ? 'bg-yellow-400/15 text-yellow-400 border-yellow-400/30' :
                                'bg-white/8 text-white/30 border-white/12'
                              }`}>{c.status}</span>
                            </div>
                            {c.notes && <p className="text-white/30 text-xs mt-1.5 italic">{c.notes}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-white/20 text-xs">{new Date(c.createdAt).toLocaleDateString()}</span>
                          <button onClick={() => setDeleteConfirm({ type: 'candidate', id: c.id, label: `${c.firstName} ${c.lastName}` })}
                            className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {candidates.length === 0 && !candFormOpen && (
                    <div className="text-center py-16 text-white/20">
                      <MapPin size={36} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No candidates registered yet. Click &quot;Add Candidate&quot; to start.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ─── EVENTS ─── */}
            {tab === 'events' && (
              <motion.div key="events" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-white font-bold">Events ({events.length})</h2>
                    <p className="text-white/30 text-xs mt-0.5">Manage party events, rallies and meetings</p>
                  </div>
                  <button onClick={() => setEventFormOpen(o => !o)}
                    className="flex items-center gap-2 px-4 py-2 bg-gold text-navy font-bold rounded-xl text-sm hover:bg-gold/90 transition-colors">
                    <Plus size={15} /> {eventFormOpen ? 'Cancel' : 'Add Event'}
                  </button>
                </div>

                <AnimatePresence>
                  {eventFormOpen && (
                    <motion.form onSubmit={submitEvent} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="bg-white/3 border border-white/8 rounded-2xl p-5 mb-5 space-y-4">
                      <h3 className="text-gold font-bold text-sm">New Event</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Title (English) *">
                          <input required value={eventForm.titleEn} onChange={e => setEventForm(f => ({ ...f, titleEn: e.target.value }))} className="admin-input" placeholder="Event title in English" />
                        </Field>
                        <Field label="Title (Somali) *">
                          <input required value={eventForm.titleSo} onChange={e => setEventForm(f => ({ ...f, titleSo: e.target.value }))} className="admin-input" placeholder="Cinwaanka Dhacadda" />
                        </Field>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Description (English) *">
                          <textarea required rows={2} value={eventForm.descEn} onChange={e => setEventForm(f => ({ ...f, descEn: e.target.value }))} className="admin-input resize-y" placeholder="Short description..." />
                        </Field>
                        <Field label="Description (Somali) *">
                          <textarea required rows={2} value={eventForm.descSo} onChange={e => setEventForm(f => ({ ...f, descSo: e.target.value }))} className="admin-input resize-y" placeholder="Sharaxaad gaaban..." />
                        </Field>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <Field label="Date *">
                          <input required type="date" value={eventForm.date} onChange={e => setEventForm(f => ({ ...f, date: e.target.value }))} className="admin-input" />
                        </Field>
                        <Field label="Time">
                          <input type="time" value={eventForm.time} onChange={e => setEventForm(f => ({ ...f, time: e.target.value }))} className="admin-input" />
                        </Field>
                        <Field label="Type">
                          <select value={eventForm.type} onChange={e => setEventForm(f => ({ ...f, type: e.target.value }))} className="admin-input">
                            <option value="RALLY">Rally</option>
                            <option value="TOWN_HALL">Town Hall</option>
                            <option value="FUNDRAISER">Fundraiser</option>
                            <option value="MEETING">Meeting</option>
                            <option value="TRAINING">Training</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </Field>
                        <Field label="Location *">
                          <input required value={eventForm.location} onChange={e => setEventForm(f => ({ ...f, location: e.target.value }))} className="admin-input" placeholder="City, Venue" />
                        </Field>
                      </div>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={eventForm.online} onChange={e => setEventForm(f => ({ ...f, online: e.target.checked }))} className="rounded" />
                          <span className="text-white/60 text-sm">Online event</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={eventForm.published} onChange={e => setEventForm(f => ({ ...f, published: e.target.checked }))} className="rounded" />
                          <span className="text-white/60 text-sm">Published (visible on site)</span>
                        </label>
                      </div>
                      <div className="flex justify-end">
                        <button type="submit" disabled={eventSubmitting}
                          className="flex items-center gap-2 px-5 py-2.5 bg-gold text-navy font-bold rounded-xl text-sm hover:bg-gold/90 disabled:opacity-50 transition-colors">
                          {eventSubmitting ? 'Saving…' : 'Save Event'}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="space-y-3">
                  {events.map((ev, i) => (
                    <motion.div key={ev.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      className="p-4 rounded-2xl bg-white/3 border border-white/8 hover:border-white/14 transition-colors flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex flex-col items-center justify-center shrink-0">
                          <span className="text-lg font-black text-white leading-none">{new Date(ev.date).getDate()}</span>
                          <span className="text-gold text-[10px] font-bold uppercase">{new Date(ev.date).toLocaleString('en', { month: 'short' })}</span>
                        </div>
                        <div>
                          <div className="text-white font-bold text-sm">{ev.titleEn}</div>
                          <div className="text-white/40 text-xs mt-0.5">{ev.titleSo}</div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-gold/10 text-gold border border-gold/20 font-bold">{ev.type}</span>
                            {ev.online && <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-400/10 text-blue-400 border border-blue-400/20">Online</span>}
                            {ev.published ? <span className="px-2 py-0.5 rounded-full text-[10px] bg-green-400/10 text-green-400 border border-green-400/20">Published</span>
                              : <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/8 text-white/30 border border-white/10">Draft</span>}
                            {ev.location && <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-white/40 border border-white/8">{ev.location}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => setDeleteConfirm({ type: 'event', id: ev.id, label: ev.titleEn })}
                          className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  {events.length === 0 && !eventFormOpen && (
                    <div className="text-center py-16 text-white/20">
                      <Calendar size={36} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No events yet. Click &quot;Add Event&quot; to schedule one.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ─── VOLUNTEERS & CANVASSERS ─── */}
            {tab === 'volunteers' && (
              <motion.div key="volunteers" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="mb-5">
                  <h2 className="text-white font-bold">Volunteers & Canvassers ({volunteers.length})</h2>
                  <p className="text-white/30 text-xs mt-0.5">People who signed up to help XTS — general volunteers and door-to-door canvassers</p>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 mb-5">
                  {['All', 'Volunteers', 'Canvassers'].map(f => (
                    <button key={f} className="px-3 py-1.5 rounded-full text-xs border border-white/10 text-white/50 hover:border-gold/30 hover:text-gold transition-colors">
                      {f} {f === 'All' ? `(${volunteers.length})` : f === 'Volunteers' ? `(${volunteers.filter(v => v.type === 'GENERAL').length})` : `(${volunteers.filter(v => v.type === 'CANVASSER').length})`}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {volunteers.map((v, i) => (
                    <motion.div key={v.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      className="p-4 rounded-2xl bg-white/3 border border-white/8 hover:border-white/14 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
                            style={{ background: v.type === 'CANVASSER' ? '#f9731620' : '#c9a22720', color: v.type === 'CANVASSER' ? '#f97316' : '#c9a227' }}>
                            {v.type === 'CANVASSER' ? <MapPin size={15} /> : <Heart size={15} />}
                          </div>
                          <div>
                            <div className="text-white font-bold text-sm">{v.firstName} {v.lastName}</div>
                            <div className="text-white/40 text-xs mt-0.5 flex flex-wrap gap-2">
                              <span>{v.phone}</span>
                              {v.email && <span>{v.email}</span>}
                              <span>📍 {v.city}{v.district ? ', ' + v.district : ''}</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${v.type === 'CANVASSER' ? 'bg-orange-400/15 text-orange-400 border-orange-400/30' : 'bg-gold/15 text-gold border-gold/30'}`}>
                                {v.type === 'CANVASSER' ? 'Canvasser' : 'Volunteer'}
                              </span>
                              {v.availability && <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/8 text-white/40 border border-white/10">{v.availability}</span>}
                              {v.skills.slice(0, 3).map(s => (
                                <span key={s} className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-white/35 border border-white/8">{s.replace(/_/g, ' ')}</span>
                              ))}
                            </div>
                            {v.message && <p className="text-white/30 text-xs mt-1.5 italic">{v.message}</p>}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            v.status === 'APPROVED' ? 'text-green-400 bg-green-400/10 border-green-400/30' :
                            v.status === 'REJECTED' ? 'text-red-400 bg-red-400/10 border-red-400/30' :
                            'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
                          }`}>{v.status}</span>
                          <div className="flex items-center gap-1.5">
                            {v.status !== 'APPROVED' && (
                              <button onClick={async () => {
                                await fetch(`/api/admin/volunteers/${v.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'APPROVED' }) });
                                setVolunteers(vs => vs.map(x => x.id === v.id ? { ...x, status: 'APPROVED' } : x));
                              }} className="px-2 py-1 bg-green-500/15 border border-green-500/30 text-green-400 text-[10px] font-bold rounded-lg hover:bg-green-500/25 transition-colors">
                                Approve
                              </button>
                            )}
                            {v.status !== 'REJECTED' && (
                              <button onClick={async () => {
                                await fetch(`/api/admin/volunteers/${v.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'REJECTED' }) });
                                setVolunteers(vs => vs.map(x => x.id === v.id ? { ...x, status: 'REJECTED' } : x));
                              }} className="px-2 py-1 bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-bold rounded-lg hover:bg-red-500/25 transition-colors">
                                Reject
                              </button>
                            )}
                            <button onClick={() => setDeleteConfirm({ type: 'volunteer', id: v.id, label: `${v.firstName} ${v.lastName}` })}
                              className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <span className="text-white/20 text-[10px]">{new Date(v.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {volunteers.length === 0 && (
                    <div className="text-center py-16 text-white/20">
                      <Heart size={36} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No volunteers yet. Share the volunteer page with supporters.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ─── GALLERY ─── */}
            {tab === 'gallery' && (
              <motion.div key="gallery" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-white font-bold">Media Gallery ({mediaItems.length})</h2>
                    <p className="text-white/30 text-xs mt-0.5">Photos from events, rallies, and community activities</p>
                  </div>
                  <button onClick={() => setGalleryFormOpen(o => !o)}
                    className="flex items-center gap-2 px-4 py-2 bg-gold text-navy font-bold rounded-xl text-sm hover:bg-gold/90 transition-colors">
                    <Plus size={15} /> {galleryFormOpen ? 'Cancel' : 'Add Photo'}
                  </button>
                </div>

                <AnimatePresence>
                  {galleryFormOpen && (
                    <motion.form onSubmit={submitGallery} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="bg-white/3 border border-white/8 rounded-2xl p-5 mb-5 space-y-4">
                      <h3 className="text-gold font-bold text-sm">Add Photo</h3>
                      <p className="text-white/40 text-xs">Upload the photo first, then add an optional title. The photo will appear in the public gallery immediately.</p>
                      <ImageUpload label="Photo *" value={galleryForm.imageUrl} onChange={url => setGalleryForm(f => ({ ...f, imageUrl: url }))} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Title (English)">
                          <input value={galleryForm.titleEn} onChange={e => setGalleryForm(f => ({ ...f, titleEn: e.target.value }))} className="admin-input" placeholder="Photo title (optional)" />
                        </Field>
                        <Field label="Title (Somali)">
                          <input value={galleryForm.titleSo} onChange={e => setGalleryForm(f => ({ ...f, titleSo: e.target.value }))} className="admin-input" placeholder="Cinwaanka (ikhtiyaari)" />
                        </Field>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Event Name (optional)">
                          <input value={galleryForm.eventName} onChange={e => setGalleryForm(f => ({ ...f, eventName: e.target.value }))} className="admin-input" placeholder="e.g. Rally in Mogadishu" />
                        </Field>
                        <Field label="Event Date (optional)">
                          <input type="date" value={galleryForm.eventDate} onChange={e => setGalleryForm(f => ({ ...f, eventDate: e.target.value }))} className="admin-input" />
                        </Field>
                      </div>
                      <Field label="Caption (optional)">
                        <input value={galleryForm.caption} onChange={e => setGalleryForm(f => ({ ...f, caption: e.target.value }))} className="admin-input" placeholder="Short caption..." />
                      </Field>
                      {galleryError && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 rounded-lg px-3 py-2">
                          <AlertCircle size={13} className="text-red-400 flex-shrink-0" />
                          <p className="text-red-400 text-xs">{galleryError}</p>
                        </div>
                      )}
                      <div className="flex justify-end">
                        <button type="submit" disabled={gallerySubmitting || !galleryForm.imageUrl}
                          className="px-5 py-2.5 bg-gold text-navy font-bold rounded-xl text-sm hover:bg-gold/90 disabled:opacity-50 transition-colors">
                          {gallerySubmitting ? 'Saving…' : 'Add to Gallery'}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {mediaItems.map((item, i) => (
                    <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                      className="relative rounded-xl overflow-hidden group border border-white/10 hover:border-gold/30 transition-colors">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.imageUrl} alt={item.titleEn} className="w-full h-32 object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button onClick={() => setDeleteConfirm({ type: 'gallery', id: item.id, label: item.titleEn })}
                          className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="p-2 bg-white/5">
                        <p className="text-white text-[10px] font-semibold truncate">{item.titleEn}</p>
                      </div>
                    </motion.div>
                  ))}
                  {mediaItems.length === 0 && !galleryFormOpen && (
                    <div className="col-span-full text-center py-16 text-white/20">
                      <ImageIcon size={36} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No photos yet. Click &quot;Add Photo&quot; to upload.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ─── DOCUMENTS ─── */}
            {tab === 'documents' && (
              <motion.div key="documents" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-white font-bold">Document Library ({documents.length})</h2>
                    <p className="text-white/30 text-xs mt-0.5">Policy papers, press releases, legal documents, party materials</p>
                  </div>
                  <button onClick={() => setDocFormOpen(o => !o)}
                    className="flex items-center gap-2 px-4 py-2 bg-gold text-navy font-bold rounded-xl text-sm hover:bg-gold/90 transition-colors">
                    <Plus size={15} /> {docFormOpen ? 'Cancel' : 'Add Document'}
                  </button>
                </div>

                <AnimatePresence>
                  {docFormOpen && (
                    <motion.form onSubmit={submitDoc} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="bg-white/3 border border-white/8 rounded-2xl p-5 mb-5 space-y-4">
                      <h3 className="text-gold font-bold text-sm">Add Document</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Title (English) *">
                          <input required value={docForm.titleEn} onChange={e => setDocForm(f => ({ ...f, titleEn: e.target.value }))} className="admin-input" placeholder="Document title" />
                        </Field>
                        <Field label="Title (Somali) *">
                          <input required value={docForm.titleSo} onChange={e => setDocForm(f => ({ ...f, titleSo: e.target.value }))} className="admin-input" placeholder="Cinwaanka dukumiintiga" />
                        </Field>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Category">
                          <select value={docForm.category} onChange={e => setDocForm(f => ({ ...f, category: e.target.value }))} className="admin-input">
                            <option value="GENERAL">General</option>
                            <option value="POLICY">Policy</option>
                            <option value="PRESS">Press Release</option>
                            <option value="LEGAL">Legal</option>
                            <option value="CONSTITUTION">Constitution</option>
                          </select>
                        </Field>
                        <Field label="Upload File (PDF / Word / Image) *">
                          <div className="space-y-2">
                            <label className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-white/15 hover:border-gold/40 cursor-pointer transition-colors bg-white/3 text-white/50 text-xs">
                              <Upload size={14} />
                              {docForm.fileUrl ? '✓ File uploaded — choose another' : 'Click to upload PDF / Word / Image (max 20MB)'}
                              <input type="file" accept=".pdf,.doc,.docx,image/*" className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  setDocSubmitting(true);
                                  const fd = new FormData();
                                  fd.append('file', file);
                                  const res = await fetch('/api/admin/upload-file', { method: 'POST', body: fd });
                                  const data = await res.json();
                                  setDocSubmitting(false);
                                  if (res.ok) setDocForm(f => ({ ...f, fileUrl: data.url }));
                                  else alert(data.error || 'Upload failed');
                                }}
                              />
                            </label>
                            {docForm.fileUrl && (
                              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-400/10 border border-green-400/20">
                                <FileText size={12} className="text-green-400 flex-shrink-0" />
                                <span className="text-green-400 text-xs truncate flex-1">{docForm.fileUrl}</span>
                                <button type="button" onClick={() => setDocForm(f => ({ ...f, fileUrl: '' }))} className="text-white/30 hover:text-white/60 text-xs">✕</button>
                              </div>
                            )}
                          </div>
                        </Field>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Description (English)">
                          <textarea rows={2} value={docForm.descEn} onChange={e => setDocForm(f => ({ ...f, descEn: e.target.value }))} className="admin-input resize-none" placeholder="Brief description..." />
                        </Field>
                        <Field label="Description (Somali)">
                          <textarea rows={2} value={docForm.descSo} onChange={e => setDocForm(f => ({ ...f, descSo: e.target.value }))} className="admin-input resize-none" placeholder="Sharaxaad gaaban..." />
                        </Field>
                      </div>
                      <div className="flex justify-end">
                        <button type="submit" disabled={docSubmitting}
                          className="px-5 py-2.5 bg-gold text-navy font-bold rounded-xl text-sm hover:bg-gold/90 disabled:opacity-50 transition-colors">
                          {docSubmitting ? 'Saving…' : 'Add Document'}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="space-y-3">
                  {documents.map((doc, i) => (
                    <motion.div key={doc.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/3 border border-white/8 hover:border-white/14 transition-colors group">
                      <div className="p-3 rounded-xl bg-gold/10 border border-gold/20 flex-shrink-0">
                        <FileText size={18} className="text-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white text-sm truncate">{doc.titleEn}</div>
                        <div className="text-white/40 text-xs mt-0.5 truncate">{doc.titleSo}</div>
                        <div className="flex gap-2 mt-1.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-gold/10 text-gold border border-gold/20">{doc.category}</span>
                          {doc.published ? <span className="px-2 py-0.5 rounded-full text-[10px] bg-green-400/10 text-green-400 border border-green-400/20">Published</span>
                            : <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/8 text-white/30 border border-white/10">Draft</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer"
                          className="p-1.5 text-white/20 hover:text-gold hover:bg-gold/10 rounded-lg transition-colors">
                          <Download size={13} />
                        </a>
                        <button onClick={() => setDeleteConfirm({ type: 'document', id: doc.id, label: doc.titleEn })}
                          className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  {documents.length === 0 && !docFormOpen && (
                    <div className="text-center py-16 text-white/20">
                      <FileText size={36} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No documents yet. Click &quot;Add Document&quot; to publish one.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ─── COMPLAINTS ─── */}
            {tab === 'complaints' && (
              <motion.div key="complaints" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="mb-5">
                  <h2 className="text-white font-bold">Citizen Complaints ({complaints.length})</h2>
                  <p className="text-white/30 text-xs mt-0.5">Reports submitted by the public — review and respond within 7 days</p>
                </div>
                <div className="space-y-3">
                  {complaints.map(c => {
                    const statusColors: Record<string, string> = {
                      OPEN: 'text-red-400 bg-red-400/10 border-red-400/25',
                      IN_PROGRESS: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/25',
                      RESOLVED: 'text-green-400 bg-green-400/10 border-green-400/25',
                      CLOSED: 'text-white/30 bg-white/5 border-white/10',
                    };
                    return (
                      <div key={c.id} className={`bg-white/3 border rounded-xl p-4 ${!c.read ? 'border-gold/20' : 'border-white/8'}`}>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-white font-semibold text-sm">{c.fullName}</span>
                            <span className="text-white/40 text-xs">· {c.city}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors[c.status] ?? statusColors.OPEN}`}>{c.status}</span>
                            <span className="text-[10px] bg-white/8 border border-white/15 rounded px-1.5 py-0.5 text-white/40">{c.category}</span>
                          </div>
                          <div className="flex gap-1.5 flex-shrink-0">
                            {(['OPEN','IN_PROGRESS','RESOLVED','CLOSED'] as const).map(s => (
                              <button key={s} onClick={async () => {
                                await fetch(`/api/admin/complaints/${c.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: s, read: true }) });
                                setComplaints(cs => cs.map(x => x.id === c.id ? { ...x, status: s, read: true } : x));
                              }}
                                className={`text-[9px] px-1.5 py-1 rounded border font-bold transition-all ${c.status === s ? statusColors[s] : 'text-white/25 border-white/10 hover:border-white/25'}`}>
                                {s.replace('_', ' ')}
                              </button>
                            ))}
                            <button onClick={async () => {
                              if (!confirm('Delete this complaint?')) return;
                              await fetch(`/api/admin/complaints/${c.id}`, { method: 'DELETE' });
                              setComplaints(cs => cs.filter(x => x.id !== c.id));
                            }} className="p-1.5 text-red-400/50 hover:text-red-400 border border-white/10 rounded transition-colors">
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                        <p className="text-gold/80 text-xs font-semibold mb-1">{c.subject}</p>
                        <p className="text-white/50 text-xs leading-relaxed">{c.body}</p>
                        <div className="flex gap-3 mt-2 text-white/25 text-[10px]">
                          {c.phone && <span>📞 {c.phone}</span>}
                          {c.email && <span>✉️ {c.email}</span>}
                          <span>🕐 {new Date(c.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                  {complaints.length === 0 && (
                    <div className="text-center py-16 text-white/20">
                      <AlertCircle size={36} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No complaints yet.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ─── POLLS ─── */}
            {tab === 'polls' && (
              <motion.div key="polls" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-white font-bold">Member Polls ({polls.length})</h2>
                    <p className="text-white/30 text-xs mt-0.5">Create polls for the public to vote on</p>
                  </div>
                  <button onClick={() => setPollFormOpen(o => !o)} className="flex items-center gap-2 px-4 py-2 bg-gold text-navy font-bold rounded-xl text-sm hover:bg-gold/90 transition-colors">
                    <Plus size={15} /> {pollFormOpen ? 'Cancel' : 'Create Poll'}
                  </button>
                </div>

                {/* Poll creation form */}
                <AnimatePresence>
                  {pollFormOpen && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="bg-white/3 border border-white/8 rounded-2xl p-5 mb-5 space-y-4">
                      <h3 className="text-gold font-bold text-sm">New Poll</h3>
                      <Field label="Question (English) *">
                        <input value={pollForm.questionEn} onChange={e => setPollForm(f => ({ ...f, questionEn: e.target.value }))}
                          className="admin-input" placeholder="e.g. What is the most important issue for Somalia?" />
                      </Field>
                      <Field label="Question (Somali) *">
                        <input value={pollForm.questionSo} onChange={e => setPollForm(f => ({ ...f, questionSo: e.target.value }))}
                          className="admin-input" placeholder="Su'aasha Soomaali ahaan..." />
                      </Field>
                      <div>
                        <label className="block text-white/40 text-[11px] font-semibold uppercase tracking-wide mb-2">Answer Options (minimum 2)</label>
                        <div className="space-y-2">
                          {pollForm.options.map((opt, oi) => (
                            <div key={oi} className="flex gap-2 items-center">
                              <span className="text-white/30 text-xs w-4 flex-shrink-0">{oi + 1}.</span>
                              <input value={opt.labelEn} onChange={e => setPollForm(f => ({ ...f, options: f.options.map((o, i) => i === oi ? { ...o, labelEn: e.target.value } : o) }))}
                                className="admin-input flex-1" placeholder={`Option ${oi + 1} in English`} />
                              <input value={opt.labelSo} onChange={e => setPollForm(f => ({ ...f, options: f.options.map((o, i) => i === oi ? { ...o, labelSo: e.target.value } : o) }))}
                                className="admin-input flex-1" placeholder={`Option ${oi + 1} in Somali`} />
                              {oi >= 2 && (
                                <button type="button" onClick={() => setPollForm(f => ({ ...f, options: f.options.filter((_, i) => i !== oi) }))}
                                  className="p-1.5 text-red-400/50 hover:text-red-400 border border-white/10 rounded">
                                  <X size={12} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        {pollForm.options.length < 4 && (
                          <button type="button" onClick={() => setPollForm(f => ({ ...f, options: [...f.options, { labelEn: '', labelSo: '' }] }))}
                            className="mt-2 text-gold/70 hover:text-gold text-xs flex items-center gap-1 transition-colors">
                            <Plus size={11} /> Add another option
                          </button>
                        )}
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={async () => {
                            if (!pollForm.questionEn || !pollForm.questionSo) return;
                            const validOpts = pollForm.options.filter(o => o.labelEn && o.labelSo);
                            if (validOpts.length < 2) return;
                            setPollSubmitting(true);
                            const res = await fetch('/api/admin/polls', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ questionEn: pollForm.questionEn, questionSo: pollForm.questionSo, options: validOpts }) });
                            const data = await res.json();
                            if (data.poll) {
                              setPolls(ps => [data.poll, ...ps]);
                              setPollForm({ questionEn: '', questionSo: '', options: [{ labelEn: '', labelSo: '' }, { labelEn: '', labelSo: '' }] });
                              setPollFormOpen(false);
                            }
                            setPollSubmitting(false);
                          }}
                          disabled={pollSubmitting || !pollForm.questionEn || !pollForm.questionSo || pollForm.options.filter(o => o.labelEn).length < 2}
                          className="px-5 py-2.5 bg-gold text-navy font-bold rounded-xl text-sm hover:bg-gold/90 disabled:opacity-50 transition-colors"
                        >
                          {pollSubmitting ? 'Creating…' : 'Create Poll'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-4">
                  {polls.map(poll => {
                    const total = poll.options.reduce((s, o) => s + o._count.votes, 0);
                    return (
                      <div key={poll.id} className="bg-white/3 border border-white/8 rounded-xl p-5">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="text-white font-semibold text-sm">{poll.questionEn}</p>
                            <p className="text-white/40 text-xs mt-0.5">{poll.questionSo}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={async () => {
                              await fetch(`/api/admin/polls/${poll.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !poll.active }) });
                              setPolls(ps => ps.map(p => p.id === poll.id ? { ...p, active: !p.active } : p));
                            }} className={`text-[10px] px-2 py-1 rounded-full border font-bold ${poll.active ? 'text-green-400 border-green-400/30 bg-green-400/10' : 'text-white/30 border-white/15 bg-white/5'}`}>
                              {poll.active ? 'Active' : 'Closed'}
                            </button>
                            <button onClick={async () => {
                              if (!confirm('Delete poll?')) return;
                              await fetch(`/api/admin/polls/${poll.id}`, { method: 'DELETE' });
                              setPolls(ps => ps.filter(p => p.id !== poll.id));
                            }} className="p-1.5 text-red-400/50 hover:text-red-400 border border-white/10 rounded transition-colors">
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          {poll.options.map(opt => {
                            const pct = total === 0 ? 0 : Math.round((opt._count.votes / total) * 100);
                            return (
                              <div key={opt.id} className="flex items-center gap-3">
                                <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                                  <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${pct}%` }} />
                                </div>
                                <span className="text-white/50 text-xs w-8 text-right">{pct}%</span>
                                <span className="text-white/60 text-xs flex-1 min-w-0 truncate">{opt.labelEn}</span>
                                <span className="text-white/30 text-xs">{opt._count.votes} votes</span>
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-white/25 text-xs mt-3">Total: {total} votes · Created {new Date(poll.createdAt).toLocaleDateString()}</p>
                      </div>
                    );
                  })}
                  {polls.length === 0 && (
                    <div className="text-center py-16 text-white/20">
                      <BarChart2 size={36} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No polls yet. Click &quot;Create Poll&quot; to add one.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ─── PETITIONS ─── */}
            {tab === 'petitions' && (
              <motion.div key="petitions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-white font-bold">Petitions ({petitions.length})</h2>
                    <p className="text-white/30 text-xs mt-0.5">Create and manage public petitions</p>
                  </div>
                  <button onClick={() => setPetitionFormOpen(o => !o)}
                    className="flex items-center gap-2 px-4 py-2 bg-gold text-navy font-bold rounded-xl text-sm hover:bg-gold/90 transition-colors">
                    <Plus size={15} /> {petitionFormOpen ? 'Cancel' : 'New Petition'}
                  </button>
                </div>

                <AnimatePresence>
                  {petitionFormOpen && (
                    <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setPetitionSubmitting(true);
                        const res = await fetch('/api/admin/petition', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(petitionForm) });
                        if (res.ok) {
                          const data = await res.json();
                          setPetitions(p => [data.petition, ...p]);
                          setPetitionForm({ titleEn: '', titleSo: '', descEn: '', descSo: '', goal: 1000, active: true });
                          setPetitionFormOpen(false);
                        }
                        setPetitionSubmitting(false);
                      }}
                      className="overflow-hidden mb-5">
                      <div className="bg-white/3 border border-gold/20 rounded-2xl p-5 space-y-4">
                        <div className="text-gold font-bold text-sm">Create New Petition</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-white/40 text-xs mb-1">Title (English) *</label>
                            <input required value={petitionForm.titleEn} onChange={e => setPetitionForm(f => ({ ...f, titleEn: e.target.value }))} className="admin-input" placeholder="Petition title in English" />
                          </div>
                          <div>
                            <label className="block text-white/40 text-xs mb-1">Title (Somali) *</label>
                            <input required value={petitionForm.titleSo} onChange={e => setPetitionForm(f => ({ ...f, titleSo: e.target.value }))} className="admin-input" placeholder="Cinwaanka Soomaali" />
                          </div>
                          <div>
                            <label className="block text-white/40 text-xs mb-1">Description (English) *</label>
                            <textarea required rows={3} value={petitionForm.descEn} onChange={e => setPetitionForm(f => ({ ...f, descEn: e.target.value }))} className="admin-input" placeholder="Why this petition matters..." />
                          </div>
                          <div>
                            <label className="block text-white/40 text-xs mb-1">Description (Somali) *</label>
                            <textarea required rows={3} value={petitionForm.descSo} onChange={e => setPetitionForm(f => ({ ...f, descSo: e.target.value }))} className="admin-input" placeholder="Sababta arintan muhiim u ah..." />
                          </div>
                          <div>
                            <label className="block text-white/40 text-xs mb-1">Signature Goal</label>
                            <input type="number" min={10} value={petitionForm.goal} onChange={e => setPetitionForm(f => ({ ...f, goal: Number(e.target.value) }))} className="admin-input" />
                          </div>
                          <div className="flex items-center gap-3 pt-5">
                            <input type="checkbox" id="petActive" checked={petitionForm.active} onChange={e => setPetitionForm(f => ({ ...f, active: e.target.checked }))} className="accent-gold" />
                            <label htmlFor="petActive" className="text-white/60 text-sm">Active (visible to public)</label>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button type="submit" disabled={petitionSubmitting}
                            className="flex items-center gap-2 px-5 py-2 bg-gold text-navy font-bold rounded-xl text-sm hover:bg-gold/90 disabled:opacity-50 transition-colors">
                            {petitionSubmitting ? 'Creating…' : 'Create Petition'}
                          </button>
                        </div>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="space-y-3">
                  {petitions.map(p => (
                    <div key={p.id} className="p-4 rounded-2xl bg-white/3 border border-white/8 flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-bold text-sm truncate">{p.titleEn}</div>
                        <div className="text-white/40 text-xs mt-0.5">{p.titleSo}</div>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-gold text-xs font-bold">{p._count?.signatures ?? 0} / {p.goal} signatures</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${p.active ? 'text-green-400 bg-green-400/10 border-green-400/30' : 'text-white/30 bg-white/5 border-white/10'}`}>
                            {p.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={async () => {
                          await fetch(`/api/admin/petition/${p.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !p.active }) });
                          setPetitions(ps => ps.map(x => x.id === p.id ? { ...x, active: !p.active } : x));
                        }} className="px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white/50 hover:text-white transition-colors">
                          {p.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => setDeleteConfirm({ type: 'petition', id: p.id, label: p.titleEn })}
                          className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {petitions.length === 0 && (
                    <div className="text-center py-16 text-white/20">
                      <FileText size={36} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No petitions yet. Create the first one.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ─── RSVPs ─── */}
            {tab === 'rsvps' && (
              <motion.div key="rsvps" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="mb-5">
                  <h2 className="text-white font-bold">Event RSVPs ({rsvps.length})</h2>
                  <p className="text-white/30 text-xs mt-0.5">People who registered for events</p>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-white/8">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/8 bg-white/3">
                        <th className="text-left px-4 py-3 text-white/40 text-xs font-semibold">Name</th>
                        <th className="text-left px-4 py-3 text-white/40 text-xs font-semibold">Phone</th>
                        <th className="text-left px-4 py-3 text-white/40 text-xs font-semibold">Email</th>
                        <th className="text-left px-4 py-3 text-white/40 text-xs font-semibold">Event</th>
                        <th className="text-left px-4 py-3 text-white/40 text-xs font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {rsvps.map(r => (
                        <tr key={r.id} className="hover:bg-white/2 transition-colors">
                          <td className="px-4 py-3 text-white text-xs font-semibold">{r.name}</td>
                          <td className="px-4 py-3 text-white/50 text-xs">{r.phone}</td>
                          <td className="px-4 py-3 text-white/50 text-xs">{r.email ?? '—'}</td>
                          <td className="px-4 py-3 text-white/50 text-xs max-w-[200px] truncate">{r.event?.titleEn ?? '—'}</td>
                          <td className="px-4 py-3 text-white/30 text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {rsvps.length === 0 && (
                    <div className="text-center py-16 text-white/20">
                      <Calendar size={36} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No RSVPs yet.</p>
                    </div>
                  )}
                </div>
                {rsvps.length > 0 && (
                  <div className="mt-4 flex justify-end">
                    <a href="/api/admin/export?type=rsvps" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/50 text-xs hover:text-white transition-colors">
                      <Download size={13} /> Export CSV
                    </a>
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── NEWSLETTER ─── */}
            {tab === 'newsletter' && (
              <motion.div key="newsletter" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-white font-bold">Newsletter Subscribers ({newsletterSubs.length})</h2>
                    <p className="text-white/30 text-xs mt-0.5">People subscribed to XTS updates</p>
                  </div>
                  {newsletterSubs.length > 0 && (
                    <a href="/api/admin/export?type=newsletter" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/50 text-xs hover:text-white transition-colors">
                      <Download size={13} /> Export CSV
                    </a>
                  )}
                </div>
                <div className="overflow-x-auto rounded-2xl border border-white/8">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/8 bg-white/3">
                        <th className="text-left px-4 py-3 text-white/40 text-xs font-semibold">Email</th>
                        <th className="text-left px-4 py-3 text-white/40 text-xs font-semibold">Name</th>
                        <th className="text-left px-4 py-3 text-white/40 text-xs font-semibold">City</th>
                        <th className="text-left px-4 py-3 text-white/40 text-xs font-semibold">Subscribed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {newsletterSubs.map(s => (
                        <tr key={s.id} className="hover:bg-white/2 transition-colors">
                          <td className="px-4 py-3 text-white text-xs font-semibold">{s.email}</td>
                          <td className="px-4 py-3 text-white/50 text-xs">{s.name ?? '—'}</td>
                          <td className="px-4 py-3 text-white/50 text-xs">{s.city ?? '—'}</td>
                          <td className="px-4 py-3 text-white/30 text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {newsletterSubs.length === 0 && (
                    <div className="text-center py-16 text-white/20">
                      <Mail size={36} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No newsletter subscribers yet.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ─── PAGE CONTENT EDITOR ─── */}
            {tab === 'content' && <ContentEditorTab />}

            {/* ─── FAQ MANAGER ─── */}
            {tab === 'faq' && <FAQManagerTab />}

            {/* ─── BRANCH OFFICES ─── */}
            {tab === 'branches' && <BranchManagerTab />}

            {/* ─── VIDEOS MANAGER ─── */}
            {tab === 'videos' && <VideosManagerTab />}

            {/* ─── SITE SETTINGS ─── */}
            {tab === 'settings' && <SiteSettingsTab />}

            {/* ─── ADMIN USERS ─── */}
            {tab === 'admins' && isSuperAdmin && (
              <motion.div key="admins" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-white font-bold">Admin Users ({adminUsers.length})</h2>
                    <p className="text-white/30 text-xs mt-0.5">Manage who has access to this control panel</p>
                  </div>
                  <button onClick={() => setAdminFormOpen(o => !o)}
                    className="flex items-center gap-2 px-4 py-2 bg-gold text-navy font-bold rounded-xl text-sm hover:bg-gold/90 transition-colors">
                    <Plus size={15} /> {adminFormOpen ? 'Cancel' : 'Add Admin'}
                  </button>
                </div>

                <AnimatePresence>
                  {adminFormOpen && (
                    <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      onSubmit={submitAdminUser} className="overflow-hidden mb-5">
                      <div className="bg-white/3 border border-gold/20 rounded-2xl p-5 space-y-4">
                        <div className="text-gold font-bold text-sm">Create New Admin</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Field label="Full Name *">
                            <input required value={adminForm.name} onChange={e => setAdminForm(f => ({ ...f, name: e.target.value }))}
                              className="admin-input" placeholder="Full name" />
                          </Field>
                          <Field label="Email *">
                            <input required type="email" value={adminForm.email} onChange={e => setAdminForm(f => ({ ...f, email: e.target.value }))}
                              className="admin-input" placeholder="admin@xts.so" />
                          </Field>
                          <Field label="Password (min 8 chars) *">
                            <input required type="password" minLength={8} value={adminForm.password} onChange={e => setAdminForm(f => ({ ...f, password: e.target.value }))}
                              className="admin-input" placeholder="Strong password" />
                          </Field>
                          <Field label="Role *">
                            <select value={adminForm.role} onChange={e => setAdminForm(f => ({ ...f, role: e.target.value }))}
                              className="admin-input">
                              <option value="EDITOR">Editor — can view only</option>
                              <option value="MEDIA_ADMIN">Media Admin — manage news</option>
                              <option value="MEMBERS_ADMIN">Members Admin — manage members</option>
                              <option value="SUPER_ADMIN">Super Admin — full access</option>
                            </select>
                          </Field>
                        </div>
                        <div className="flex justify-end">
                          <button type="submit" disabled={adminSubmitting}
                            className="flex items-center gap-2 px-5 py-2 bg-gold text-navy font-bold rounded-xl text-sm hover:bg-gold/90 disabled:opacity-50 transition-colors">
                            {adminSubmitting ? <Spinner /> : null}
                            {adminSubmitting ? 'Creating…' : 'Create Admin'}
                          </button>
                        </div>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="space-y-3">
                  {adminUsers.map(u => (
                    <div key={u.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/3 border border-white/8 gap-4 flex-wrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold font-black text-sm shrink-0">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-white font-bold text-sm">{u.name}</div>
                          <div className="text-white/35 text-xs">{u.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-auto">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${ROLE_LABELS[u.role]?.color ?? ''}`}>
                          {ROLE_LABELS[u.role]?.label ?? u.role}
                        </span>
                        <span className="text-white/20 text-xs hidden sm:block">{new Date(u.createdAt).toLocaleDateString()}</span>
                        <button onClick={() => setDeleteConfirm({ type: 'admin', id: u.id, label: u.name })}
                          className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Edit news modal */}
      <AnimatePresence>
        {editingPost && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setEditingPost(null); }}>
            <motion.form initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onSubmit={saveEdit}
              className="w-full max-w-2xl bg-[#0a1128] border border-gold/20 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center">
                <h3 className="text-gold font-bold">Edit Article</h3>
                <button type="button" onClick={() => setEditingPost(null)} className="text-white/30 hover:text-white"><X size={18} /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Title (English) *">
                  <input required value={editForm.titleEn} onChange={e => setEditForm(f => ({ ...f, titleEn: e.target.value }))} className="admin-input" />
                </Field>
                <Field label="Title (Somali) *">
                  <input required value={editForm.titleSo} onChange={e => setEditForm(f => ({ ...f, titleSo: e.target.value }))} className="admin-input" />
                </Field>
              </div>
              <Field label="Excerpt">
                <input value={editForm.excerpt} onChange={e => setEditForm(f => ({ ...f, excerpt: e.target.value }))} className="admin-input" />
              </Field>
              <ImageUpload
                label="Image"
                value={editForm.imageUrl}
                onChange={url => setEditForm(f => ({ ...f, imageUrl: url }))}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Content (English)">
                  <textarea rows={5} value={editForm.contentEn} onChange={e => setEditForm(f => ({ ...f, contentEn: e.target.value }))} className="admin-input resize-y" placeholder="Leave blank to keep existing" />
                </Field>
                <Field label="Content (Somali)">
                  <textarea rows={5} value={editForm.contentSo} onChange={e => setEditForm(f => ({ ...f, contentSo: e.target.value }))} className="admin-input resize-y" placeholder="Fadlan ka tag meel banaan" />
                </Field>
              </div>
              <div className="flex items-center justify-between pt-1">
                <Toggle checked={editForm.published} onChange={v => setEditForm(f => ({ ...f, published: v }))} label={editForm.published ? 'Published' : 'Draft'} />
                <button type="submit" className="px-5 py-2 bg-gold text-navy font-bold rounded-xl text-sm hover:bg-gold/90 transition-colors">Save Changes</button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-[#0a1128] border border-red-500/20 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={22} className="text-red-400" />
              </div>
              <h3 className="text-white font-bold mb-2">Confirm Delete</h3>
              <p className="text-white/40 text-sm mb-5">
                Are you sure you want to delete <span className="text-white font-semibold">{deleteConfirm.label}</span>? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 bg-white/5 border border-white/10 text-white/60 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors">
                  Cancel
                </button>
                <button onClick={() => {
                  if (deleteConfirm.type === 'member') deleteMember(deleteConfirm.id);
                  else if (deleteConfirm.type === 'message') deleteMessage(deleteConfirm.id);
                  else if (deleteConfirm.type === 'post') deletePost(deleteConfirm.id);
                  else if (deleteConfirm.type === 'admin') deleteAdminUser(deleteConfirm.id);
                  else if (deleteConfirm.type === 'candidate') deleteCandidate(deleteConfirm.id);
                  else if (deleteConfirm.type === 'event') deleteEvent(deleteConfirm.id);
                  else if (deleteConfirm.type === 'volunteer') deleteVolunteer(deleteConfirm.id);
                  else if (deleteConfirm.type === 'gallery') deleteGalleryItem(deleteConfirm.id);
                  else if (deleteConfirm.type === 'document') deleteDoc(deleteConfirm.id);
                  else if (deleteConfirm.type === 'petition') {
                    fetch(`/api/admin/petition/${deleteConfirm.id}`, { method: 'DELETE' }).then(() => {
                      setPetitions(p => p.filter(x => x.id !== deleteConfirm.id));
                      setDeleteConfirm(null);
                    });
                  }
                }}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DonationGoalEditor() {
  const [goal, setGoal] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(d => {
      if (d.settings?.donation_goal) setGoal(d.settings.donation_goal);
    }).catch(() => {});
  }, []);

  const save = async () => {
    const val = parseInt(goal, 10);
    if (!val || val < 100) return;
    setLoading(true);
    await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'donation_goal', value: String(val) }),
    });
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="mt-5 bg-white/3 border border-white/8 rounded-2xl p-5">
      <h3 className="text-white font-bold text-sm mb-1 flex items-center gap-2">
        <DollarSign size={15} className="text-gold" /> Donation Campaign Goal
      </h3>
      <p className="text-white/30 text-xs mb-4">Set the target amount shown on the public donation progress bar.</p>
      <div className="flex items-center gap-3 max-w-xs">
        <div className="flex items-center flex-1 bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <span className="pl-3 text-white/40 text-sm font-semibold">$</span>
          <input
            type="number" min={100} step={100}
            value={goal}
            onChange={e => setGoal(e.target.value)}
            placeholder="10000"
            className="flex-1 bg-transparent px-2 py-2.5 text-white text-sm outline-none"
          />
          <span className="pr-3 text-white/30 text-xs">USD</span>
        </div>
        <button onClick={save} disabled={loading}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${saved ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gold text-navy hover:bg-gold/90'}`}>
          {saved ? '✓ Saved' : loading ? '…' : 'Save'}
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    APPROVED: 'bg-green-400/15 text-green-400 border-green-400/30',
    REJECTED: 'bg-red-400/15 text-red-400 border-red-400/30',
    PENDING: 'bg-yellow-400/15 text-yellow-400 border-yellow-400/30',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${map[status] ?? ''}`}>
      {status}
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-white/35 text-[11px] font-semibold mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer">
      <div onClick={() => onChange(!checked)}
        className={`w-9 h-5 rounded-full border transition-colors relative shrink-0 ${checked ? 'bg-green-500 border-green-500' : 'bg-white/10 border-white/20'}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </div>
      <span className="text-white/50 text-sm">{label}</span>
    </label>
  );
}

function Spinner() {
  return <div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />;
}

// ─── CONTENT EDITOR TAB ─────────────────────────────────────────────────────

interface ContentField {
  key: string; label: string; multiline: boolean;
  en: string; so: string; defaultEn: string; defaultSo: string; isCustom: boolean;
}
interface ContentPage { page: string; label: string; fields: ContentField[] }

function ContentEditorTab() {
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [pageData, setPageData] = useState<ContentPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [edits, setEdits] = useState<Record<string, { en: string; so: string }>>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPage(selectedPage);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPage]);

  async function loadPage(page: string) {
    setLoading(true);
    setEdits({});
    setSaved({});
    try {
      const r = await fetch(`/api/admin/content?page=${page}`);
      const data = await r.json();
      setPageData(data);
    } catch { /* ignore */ }
    setLoading(false);
  }

  function editField(key: string, lang: 'en' | 'so', value: string) {
    setEdits(prev => ({
      ...prev,
      [key]: { ...(prev[key] ?? { en: pageData?.fields.find(f => f.key === key)?.en ?? '', so: pageData?.fields.find(f => f.key === key)?.so ?? '' }), [lang]: value },
    }));
  }

  async function saveField(key: string) {
    const field = pageData?.fields.find(f => f.key === key);
    const en = edits[key]?.en ?? field?.en ?? '';
    const so = edits[key]?.so ?? field?.so ?? '';
    setSaving(prev => ({ ...prev, [key]: true }));
    try {
      await Promise.all([
        fetch('/api/admin/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ page: selectedPage, section: key, lang: 'en', content: en }) }),
        fetch('/api/admin/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ page: selectedPage, section: key, lang: 'so', content: so }) }),
      ]);
      setSaved(prev => ({ ...prev, [key]: true }));
      setTimeout(() => setSaved(prev => ({ ...prev, [key]: false })), 2500);
      await loadPage(selectedPage);
    } catch { /* ignore */ }
    setSaving(prev => ({ ...prev, [key]: false }));
  }

  async function resetField(key: string) {
    if (!confirm('Reset this field to the default text?')) return;
    await fetch('/api/admin/content', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ page: selectedPage, section: key }) });
    setEdits(prev => { const n = { ...prev }; delete n[key]; return n; });
    await loadPage(selectedPage);
  }

  const filteredFields = pageData?.fields.filter(f =>
    !searchTerm || f.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.en.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? [];

  return (
    <motion.div key="content" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="mb-6">
        <h2 className="text-white font-bold text-lg">Page Content Editor</h2>
        <p className="text-white/30 text-xs mt-0.5">Edit any text on the website in English and Somali — changes go live instantly</p>
      </div>

      <div className="flex gap-4 flex-col lg:flex-row">
        {/* Page selector sidebar */}
        <div className="lg:w-56 shrink-0">
          <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
            <div className="px-3 py-2.5 border-b border-white/8">
              <p className="text-white/40 text-[11px] font-semibold uppercase tracking-wider">Select Page</p>
            </div>
            <div className="py-1 max-h-[70vh] overflow-y-auto">
              {CONTENT_SCHEMA.map(s => (
                <button key={s.page} onClick={() => setSelectedPage(s.page)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors ${selectedPage === s.page ? 'bg-gold/10 text-gold' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
                  <span className="text-base">{s.icon}</span>
                  <span className="font-medium truncate">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content fields */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-white/30 text-sm gap-3">
              <div className="w-5 h-5 border-2 border-white/20 border-t-gold rounded-full animate-spin" />
              Loading content...
            </div>
          ) : pageData ? (
            <div className="space-y-4">
              {/* Search */}
              <input
                type="text"
                placeholder="Search fields..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-gold/40"
              />

              <div className="text-white/25 text-xs">{filteredFields.length} field{filteredFields.length !== 1 ? 's' : ''} — changes save instantly to the database</div>

              {filteredFields.map(field => {
                const currentEn = edits[field.key]?.en ?? field.en;
                const currentSo = edits[field.key]?.so ?? field.so;
                const isDirty = edits[field.key] !== undefined;
                const isSavingThis = saving[field.key];
                const isSavedThis = saved[field.key];

                return (
                  <div key={field.key} className={`bg-white/3 border rounded-2xl p-4 transition-colors ${field.isCustom ? 'border-gold/25' : 'border-white/8'}`}>
                    <div className="flex items-center justify-between mb-3 gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-white/70 text-sm font-semibold truncate">{field.label}</span>
                        {field.isCustom && <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-gold/15 text-gold border border-gold/25 font-bold">CUSTOM</span>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {field.isCustom && (
                          <button onClick={() => resetField(field.key)}
                            className="text-[11px] text-white/30 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-400/10">
                            Reset to default
                          </button>
                        )}
                        <button
                          onClick={() => saveField(field.key)}
                          disabled={isSavingThis || (!isDirty && !field.isCustom)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${isSavedThis ? 'bg-green-500/20 text-green-400 border border-green-500/30' : isDirty ? 'bg-gold text-navy hover:bg-gold/90' : 'bg-white/5 text-white/25 cursor-not-allowed'}`}>
                          {isSavingThis ? <div className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin" /> : isSavedThis ? '✓ Saved' : 'Save'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* English */}
                      <div>
                        <label className="block text-[10px] text-white/30 font-semibold uppercase tracking-wider mb-1.5">🇬🇧 English</label>
                        {field.multiline ? (
                          <textarea
                            rows={4}
                            value={currentEn}
                            onChange={e => editField(field.key, 'en', e.target.value)}
                            className="w-full bg-[#0a1128] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/40 resize-none leading-relaxed"
                          />
                        ) : (
                          <input
                            value={currentEn}
                            onChange={e => editField(field.key, 'en', e.target.value)}
                            className="w-full bg-[#0a1128] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold/40"
                          />
                        )}
                      </div>

                      {/* Somali */}
                      <div>
                        <label className="block text-[10px] text-white/30 font-semibold uppercase tracking-wider mb-1.5">🇸🇴 Somali</label>
                        {field.multiline ? (
                          <textarea
                            rows={4}
                            value={currentSo}
                            onChange={e => editField(field.key, 'so', e.target.value)}
                            className="w-full bg-[#0a1128] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/40 resize-none leading-relaxed"
                          />
                        ) : (
                          <input
                            value={currentSo}
                            onChange={e => editField(field.key, 'so', e.target.value)}
                            className="w-full bg-[#0a1128] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold/40"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// FAQ MANAGER TAB
// ─────────────────────────────────────────────────────────────
interface FAQItem { id: string; questionEn: string; questionSo: string; answerEn: string; answerSo: string; category: string; sortOrder: number; active: boolean; }

function FAQManagerTab() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<FAQItem | null>(null);
  const [form, setForm] = useState({ questionEn: '', questionSo: '', answerEn: '', answerSo: '', category: 'General', sortOrder: 0, active: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/faq').then(r => r.json()).then(d => { setFaqs(d.faqs ?? d ?? []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const openNew = () => { setEditItem(null); setForm({ questionEn: '', questionSo: '', answerEn: '', answerSo: '', category: 'General', sortOrder: 0, active: true }); setFormOpen(true); };
  const openEdit = (f: FAQItem) => { setEditItem(f); setForm({ questionEn: f.questionEn, questionSo: f.questionSo, answerEn: f.answerEn, answerSo: f.answerSo, category: f.category, sortOrder: f.sortOrder, active: f.active }); setFormOpen(true); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    if (editItem) {
      const res = await fetch(`/api/admin/faq/${editItem.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { const updated = await res.json(); setFaqs(f => f.map(x => x.id === updated.id ? updated : x)); }
    } else {
      const res = await fetch('/api/admin/faq', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { const created = await res.json(); setFaqs(f => [created, ...f]); }
    }
    setSaving(false); setFormOpen(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    await fetch(`/api/admin/faq/${id}`, { method: 'DELETE' });
    setFaqs(f => f.filter(x => x.id !== id));
  };

  const toggle = async (item: FAQItem) => {
    const res = await fetch(`/api/admin/faq/${item.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !item.active }) });
    if (res.ok) { const updated = await res.json(); setFaqs(f => f.map(x => x.id === updated.id ? updated : x)); }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <motion.div key="faq" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-white font-bold">FAQ Manager ({faqs.length})</h2>
          <p className="text-white/30 text-xs mt-0.5">Add, edit, or hide FAQ entries shown on the public FAQ page</p>
        </div>
        <button onClick={formOpen ? () => setFormOpen(false) : openNew} className="flex items-center gap-2 px-4 py-2 bg-gold text-navy font-bold rounded-xl text-sm hover:bg-gold/90 transition-colors">
          <Plus size={15} /> {formOpen ? 'Cancel' : 'Add FAQ'}
        </button>
      </div>

      <AnimatePresence>
        {formOpen && (
          <motion.form onSubmit={save} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-white/3 border border-white/10 rounded-2xl p-5 mb-5 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="text-white/50 text-xs mb-1 block">Question (English)</label><input value={form.questionEn} onChange={e => setForm(f => ({ ...f, questionEn: e.target.value }))} required className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/40" /></div>
              <div><label className="text-white/50 text-xs mb-1 block">Question (Somali)</label><input value={form.questionSo} onChange={e => setForm(f => ({ ...f, questionSo: e.target.value }))} required className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/40" /></div>
              <div><label className="text-white/50 text-xs mb-1 block">Answer (English)</label><textarea value={form.answerEn} onChange={e => setForm(f => ({ ...f, answerEn: e.target.value }))} required rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/40 resize-none" /></div>
              <div><label className="text-white/50 text-xs mb-1 block">Answer (Somali)</label><textarea value={form.answerSo} onChange={e => setForm(f => ({ ...f, answerSo: e.target.value }))} required rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/40 resize-none" /></div>
              <div><label className="text-white/50 text-xs mb-1 block">Category</label><input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/40" /></div>
              <div><label className="text-white/50 text-xs mb-1 block">Sort Order</label><input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: +e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/40" /></div>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="w-4 h-4 accent-gold" />
                <span className="text-white/60 text-sm">Active (visible on site)</span>
              </label>
              <button type="submit" disabled={saving} className="ml-auto px-5 py-2 bg-gold text-navy font-bold rounded-xl text-sm hover:bg-gold/90 transition-colors disabled:opacity-50">
                {saving ? 'Saving…' : editItem ? 'Save Changes' : 'Create FAQ'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {faqs.map(item => (
          <div key={item.id} className="bg-white/3 border border-white/8 rounded-xl px-4 py-3 flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20">{item.category}</span>
                {!item.active && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Hidden</span>}
              </div>
              <p className="text-white text-sm font-semibold truncate">{item.questionEn}</p>
              <p className="text-white/35 text-xs truncate">{item.questionSo}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => toggle(item)} className={`text-xs px-2 py-1 rounded-lg border transition-colors ${item.active ? 'border-green-500/30 text-green-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30' : 'border-white/10 text-white/30 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/30'}`}>
                {item.active ? 'Hide' : 'Show'}
              </button>
              <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-white/40 hover:text-gold hover:bg-gold/10 transition-colors"><Edit2 size={14} /></button>
              <button onClick={() => remove(item.id)} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {faqs.length === 0 && <div className="text-center py-12 text-white/30 text-sm">No FAQs yet. Click "Add FAQ" to create the first one.</div>}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// BRANCH MANAGER TAB
// ─────────────────────────────────────────────────────────────
interface BranchItem { id: string; nameEn: string; nameSo: string; stateEn: string; stateSo: string; addressEn: string; addressSo: string; phone: string | null; email: string | null; hours: string | null; type: string; published: boolean; }

function BranchManagerTab() {
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<BranchItem | null>(null);
  const emptyForm = { nameEn: '', nameSo: '', stateEn: '', stateSo: '', addressEn: '', addressSo: '', phone: '', email: '', hours: '', type: 'Branch', published: true };
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/branches').then(r => r.json()).then(d => { setBranches(d.branches ?? d ?? []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const openNew = () => { setEditItem(null); setForm(emptyForm); setFormOpen(true); };
  const openEdit = (b: BranchItem) => { setEditItem(b); setForm({ nameEn: b.nameEn, nameSo: b.nameSo, stateEn: b.stateEn, stateSo: b.stateSo, addressEn: b.addressEn, addressSo: b.addressSo, phone: b.phone ?? '', email: b.email ?? '', hours: b.hours ?? '', type: b.type, published: b.published }); setFormOpen(true); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const payload = { ...form, phone: form.phone || null, email: form.email || null, hours: form.hours || null };
    if (editItem) {
      const res = await fetch(`/api/admin/branches/${editItem.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) { const updated = await res.json(); setBranches(b => b.map(x => x.id === updated.id ? updated : x)); }
    } else {
      const res = await fetch('/api/admin/branches', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) { const created = await res.json(); setBranches(b => [...b, created]); }
    }
    setSaving(false); setFormOpen(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this branch?')) return;
    await fetch(`/api/admin/branches/${id}`, { method: 'DELETE' });
    setBranches(b => b.filter(x => x.id !== id));
  };

  const toggle = async (item: BranchItem) => {
    const res = await fetch(`/api/admin/branches/${item.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ published: !item.published }) });
    if (res.ok) { const updated = await res.json(); setBranches(b => b.map(x => x.id === updated.id ? updated : x)); }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <motion.div key="branches" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-white font-bold">Branch Offices ({branches.length})</h2>
          <p className="text-white/30 text-xs mt-0.5">Manage XTS offices shown on the Branches page</p>
        </div>
        <button onClick={formOpen ? () => setFormOpen(false) : openNew} className="flex items-center gap-2 px-4 py-2 bg-gold text-navy font-bold rounded-xl text-sm hover:bg-gold/90 transition-colors">
          <Plus size={15} /> {formOpen ? 'Cancel' : 'Add Branch'}
        </button>
      </div>

      <AnimatePresence>
        {formOpen && (
          <motion.form onSubmit={save} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-white/3 border border-white/10 rounded-2xl p-5 mb-5 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="text-white/50 text-xs mb-1 block">Office Name (English)</label><input value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))} required className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/40" /></div>
              <div><label className="text-white/50 text-xs mb-1 block">Office Name (Somali)</label><input value={form.nameSo} onChange={e => setForm(f => ({ ...f, nameSo: e.target.value }))} required className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/40" /></div>
              <div><label className="text-white/50 text-xs mb-1 block">State (English)</label><input value={form.stateEn} onChange={e => setForm(f => ({ ...f, stateEn: e.target.value }))} required className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/40" /></div>
              <div><label className="text-white/50 text-xs mb-1 block">State (Somali)</label><input value={form.stateSo} onChange={e => setForm(f => ({ ...f, stateSo: e.target.value }))} required className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/40" /></div>
              <div><label className="text-white/50 text-xs mb-1 block">Address (English)</label><input value={form.addressEn} onChange={e => setForm(f => ({ ...f, addressEn: e.target.value }))} required className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/40" /></div>
              <div><label className="text-white/50 text-xs mb-1 block">Address (Somali)</label><input value={form.addressSo} onChange={e => setForm(f => ({ ...f, addressSo: e.target.value }))} required className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/40" /></div>
              <div><label className="text-white/50 text-xs mb-1 block">Phone (optional)</label><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/40" /></div>
              <div><label className="text-white/50 text-xs mb-1 block">Email (optional)</label><input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/40" /></div>
              <div><label className="text-white/50 text-xs mb-1 block">Hours (optional)</label><input value={form.hours} onChange={e => setForm(f => ({ ...f, hours: e.target.value }))} placeholder="e.g. Mon–Fri 8am–5pm" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/40" /></div>
              <div><label className="text-white/50 text-xs mb-1 block">Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/40">
                  <option value="HQ">HQ</option><option value="Branch">Branch</option><option value="Liaison">Liaison</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="w-4 h-4 accent-gold" />
                <span className="text-white/60 text-sm">Published (visible on site)</span>
              </label>
              <button type="submit" disabled={saving} className="ml-auto px-5 py-2 bg-gold text-navy font-bold rounded-xl text-sm hover:bg-gold/90 transition-colors disabled:opacity-50">
                {saving ? 'Saving…' : editItem ? 'Save Changes' : 'Create Branch'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {branches.map(item => (
          <div key={item.id} className="bg-white/3 border border-white/8 rounded-xl px-4 py-3 flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20">{item.type}</span>
                {!item.published && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Hidden</span>}
              </div>
              <p className="text-white text-sm font-semibold">{item.nameEn}</p>
              <p className="text-white/35 text-xs">{item.stateEn} · {item.email ?? item.phone ?? ''}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => toggle(item)} className={`text-xs px-2 py-1 rounded-lg border transition-colors ${item.published ? 'border-green-500/30 text-green-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30' : 'border-white/10 text-white/30 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/30'}`}>
                {item.published ? 'Hide' : 'Show'}
              </button>
              <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-white/40 hover:text-gold hover:bg-gold/10 transition-colors"><Edit2 size={14} /></button>
              <button onClick={() => remove(item.id)} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {branches.length === 0 && <div className="text-center py-12 text-white/30 text-sm">No branches yet. Click "Add Branch" to create the first one.</div>}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// VIDEOS MANAGER TAB
// ─────────────────────────────────────────────────────────────
interface VideoItem { id: string; titleEn: string; titleSo: string; descEn: string | null; descSo: string | null; videoId: string; videoUrl: string | null; featured: boolean; date: string | null; sortOrder: number; published: boolean; }

// Extract YouTube video ID from any YouTube URL format or bare ID
function parseYouTubeId(input: string): string {
  const s = input.trim();
  // Full URL: youtube.com/watch?v=ID or youtu.be/ID or youtube.com/embed/ID
  const match = s.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (match) return match[1];
  // Bare 11-char ID
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  return s; // return as-is, API will validate
}

function VideosManagerTab() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<VideoItem | null>(null);
  // videoType: 'youtube' | 'local'
  const [videoType, setVideoType] = useState<'youtube' | 'local'>('youtube');
  const emptyForm = { titleEn: '', titleSo: '', descEn: '', descSo: '', videoId: '', date: '', sortOrder: 0, published: true, featured: false };
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [previewId, setPreviewId] = useState('');
  // Local file upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState('');

  useEffect(() => {
    fetch('/api/admin/videos')
      .then(r => r.json())
      .then(d => { setVideos(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, []);

  const openNew = () => {
    setEditItem(null); setForm(emptyForm); setSaveError(''); setPreviewId('');
    setVideoType('youtube'); setUploadFile(null); setUploadProgress(0); setUploadedUrl('');
    setFormOpen(true);
  };
  const openEdit = (v: VideoItem) => {
    setEditItem(v);
    setForm({ titleEn: v.titleEn, titleSo: v.titleSo, descEn: v.descEn ?? '', descSo: v.descSo ?? '', videoId: v.videoId, date: v.date ?? '', sortOrder: v.sortOrder, published: v.published, featured: v.featured });
    setPreviewId(v.videoId);
    setSaveError('');
    setVideoType(v.videoUrl ? 'local' : 'youtube');
    setUploadedUrl(v.videoUrl ?? '');
    setUploadFile(null);
    setFormOpen(true);
  };

  const handleVideoIdChange = (raw: string) => {
    const id = parseYouTubeId(raw);
    setForm(f => ({ ...f, videoId: id }));
    if (/^[A-Za-z0-9_-]{11}$/.test(id)) setPreviewId(id);
    else setPreviewId('');
  };

  const handleFileChange = async (file: File | null) => {
    if (!file) return;
    setUploadFile(file);
    setUploadProgress(10);
    setSaveError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      setUploadProgress(30);
      const res = await fetch('/api/admin/upload-video', { method: 'POST', body: fd });
      setUploadProgress(80);
      const json = await res.json();
      if (!res.ok) { setSaveError(json.error ?? 'Upload failed'); setUploadProgress(0); return; }
      setUploadedUrl(json.url);
      setUploadProgress(100);
    } catch {
      setSaveError('Upload failed — check server is running.');
      setUploadProgress(0);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    if (!form.titleEn.trim()) { setSaveError('English title is required.'); return; }
    if (!form.titleSo.trim()) { setSaveError('Somali title is required.'); return; }
    if (videoType === 'youtube' && !form.videoId.trim()) { setSaveError('YouTube Video ID or URL is required.'); return; }
    if (videoType === 'local' && !uploadedUrl && !editItem?.videoUrl) { setSaveError('Please upload a video file first.'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        descEn: form.descEn || null,
        descSo: form.descSo || null,
        date: form.date || null,
        videoId: videoType === 'local' ? '' : form.videoId,
        videoUrl: videoType === 'local' ? (uploadedUrl || editItem?.videoUrl || null) : null,
      };
      const url    = editItem ? `/api/admin/videos/${editItem.id}` : '/api/admin/videos';
      const method = editItem ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) { setSaveError(json.error ?? 'Something went wrong. Please try again.'); setSaving(false); return; }
      if (editItem) setVideos(v => v.map(x => x.id === json.id ? json : x));
      else          setVideos(v => [json, ...v]);
      setFormOpen(false);
    } catch {
      setSaveError('Network error — make sure the server is running.');
    }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this video?')) return;
    const res = await fetch(`/api/admin/videos/${id}`, { method: 'DELETE' });
    if (res.ok) setVideos(v => v.filter(x => x.id !== id));
    else alert('Delete failed — please try again.');
  };

  const toggle = async (item: VideoItem) => {
    const res = await fetch(`/api/admin/videos/${item.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ published: !item.published }) });
    if (res.ok) { const updated = await res.json(); setVideos(v => v.map(x => x.id === updated.id ? updated : x)); }
  };

  const toggleFeatured = async (item: VideoItem) => {
    // Un-feature all others first (only one featured at a time)
    const wasFeatured = item.featured;
    const res = await fetch(`/api/admin/videos/${item.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ featured: !wasFeatured }) });
    if (res.ok) {
      const updated = await res.json();
      setVideos(v => v.map(x => x.id === updated.id ? updated : { ...x, featured: false }));
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <motion.div key="videos" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-white font-bold">Videos ({videos.length})</h2>
          <p className="text-white/30 text-xs mt-0.5">Upload local videos or add YouTube links — mark one as ★ Featured to show on the homepage</p>
        </div>
        <button onClick={formOpen ? () => setFormOpen(false) : openNew}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-navy font-bold rounded-xl text-sm hover:bg-gold/90 transition-colors">
          <Plus size={15} /> {formOpen ? 'Cancel' : 'Add Video'}
        </button>
      </div>

      <AnimatePresence>
        {formOpen && (
          <motion.form onSubmit={save} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-white/3 border border-white/10 rounded-2xl p-5 mb-5 space-y-4 overflow-hidden">

            {/* Error banner */}
            {saveError && (
              <div className="bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm flex items-center gap-2">
                <XCircle size={15} className="shrink-0" /> {saveError}
              </div>
            )}

            {/* Video type toggle */}
            <div>
              <label className="text-white/50 text-xs mb-2 block">Video Source</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setVideoType('local')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${videoType === 'local' ? 'bg-gold text-navy border-gold' : 'border-white/10 text-white/40 hover:border-gold/30'}`}>
                  📁 Upload from Device
                </button>
                <button type="button" onClick={() => setVideoType('youtube')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${videoType === 'youtube' ? 'bg-red-600 text-white border-red-600' : 'border-white/10 text-white/40 hover:border-red-600/30'}`}>
                  ▶ YouTube Link
                </button>
              </div>
            </div>

            {/* Local file upload */}
            {videoType === 'local' && (
              <div>
                <label className="text-white/50 text-xs mb-1 block">Video File (MP4, WebM, MOV — max 500MB)</label>
                <div
                  className="border-2 border-dashed border-white/15 rounded-xl p-6 text-center hover:border-gold/30 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('video-file-input')?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileChange(f); }}
                >
                  <input id="video-file-input" type="file" accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo" className="hidden"
                    onChange={e => handleFileChange(e.target.files?.[0] ?? null)} />
                  {uploadedUrl ? (
                    <div className="space-y-2">
                      <div className="text-green-400 font-bold text-sm">✓ Video uploaded successfully</div>
                      <video src={uploadedUrl} controls className="w-full rounded-lg max-h-48 bg-black" />
                      <button type="button" onClick={e => { e.stopPropagation(); setUploadedUrl(''); setUploadFile(null); setUploadProgress(0); }}
                        className="text-xs text-white/30 hover:text-red-400 transition-colors">Remove & re-upload</button>
                    </div>
                  ) : uploadFile && uploadProgress > 0 && uploadProgress < 100 ? (
                    <div className="space-y-3">
                      <div className="text-white/50 text-sm">Uploading {uploadFile.name}…</div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-4xl">🎬</div>
                      <div className="text-white/50 text-sm">Click or drag &amp; drop your video here</div>
                      <div className="text-white/25 text-xs">Supports MP4, MOV, WebM · Max 500MB</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* YouTube URL */}
            {videoType === 'youtube' && (
              <div>
                <label className="text-white/50 text-xs mb-1 block">YouTube Video URL or ID <span className="text-gold">*</span></label>
                <input
                  value={form.videoId}
                  onChange={e => handleVideoIdChange(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or paste just the ID"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-gold/40"
                />
                {previewId && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-white/10" style={{ aspectRatio: '16/9' }}>
                    <iframe src={`https://www.youtube.com/embed/${previewId}`} className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Preview" />
                  </div>
                )}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-white/50 text-xs mb-1 block">Title (English) <span className="text-gold">*</span></label>
                <input value={form.titleEn} onChange={e => setForm(f => ({ ...f, titleEn: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/40" />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1 block">Title (Somali) <span className="text-gold">*</span></label>
                <input value={form.titleSo} onChange={e => setForm(f => ({ ...f, titleSo: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/40" />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1 block">Description (English)</label>
                <textarea value={form.descEn} onChange={e => setForm(f => ({ ...f, descEn: e.target.value }))} rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/40 resize-none" />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1 block">Description (Somali)</label>
                <textarea value={form.descSo} onChange={e => setForm(f => ({ ...f, descSo: e.target.value }))} rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/40 resize-none" />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1 block">Date (optional)</label>
                <input value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} placeholder="e.g. 2025"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/40" />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1 block">Sort Order</label>
                <input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: +e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/40" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="w-4 h-4 accent-gold" />
                <span className="text-white/60 text-sm">Published</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 accent-gold" />
                <span className="text-white/60 text-sm">⭐ Featured on Homepage</span>
              </label>
              <button type="submit" disabled={saving}
                className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-gold text-navy font-bold rounded-xl text-sm hover:bg-gold/90 transition-colors disabled:opacity-50">
                {saving ? <><Spinner /><span>Saving…</span></> : editItem ? 'Save Changes' : '+ Add Video'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid sm:grid-cols-2 gap-3">
        {videos.map(item => (
          <div key={item.id} className={`bg-white/3 border rounded-xl overflow-hidden transition-all ${item.featured ? 'border-gold/40' : 'border-white/8'}`}>
            <div className="aspect-video bg-black/40 flex items-center justify-center relative">
              {item.videoUrl ? (
                <video src={item.videoUrl} className="w-full h-full object-cover" preload="none" />
              ) : (
                <img src={`https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`} alt={item.titleEn}
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              )}
              <div className="absolute top-2 left-2 flex gap-1.5">
                {item.featured && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold/90 text-navy">★ Featured</span>}
                {item.videoUrl && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/80 text-white">Local</span>}
              </div>
              {!item.published && (
                <div className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/80 text-white">Hidden</div>
              )}
            </div>
            <div className="p-3">
              <p className="text-white text-sm font-semibold truncate">{item.titleEn}</p>
              <p className="text-white/35 text-xs truncate">{item.titleSo}</p>
              {item.videoUrl
                ? <p className="text-white/20 text-[10px] mt-1 font-mono truncate">{item.videoUrl}</p>
                : <p className="text-white/20 text-[10px] mt-1 font-mono truncate">YT: {item.videoId}</p>
              }
              <div className="flex items-center gap-2 mt-3">
                <button onClick={() => toggleFeatured(item)} title="Toggle featured on homepage"
                  className={`text-xs px-2 py-1 rounded-lg border transition-colors ${item.featured ? 'border-gold/40 text-gold hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30' : 'border-white/10 text-white/30 hover:bg-gold/10 hover:text-gold hover:border-gold/30'}`}>
                  {item.featured ? '★ Unfeature' : '☆ Feature'}
                </button>
                <button onClick={() => toggle(item)}
                  className={`text-xs px-2 py-1 rounded-lg border transition-colors ${item.published ? 'border-green-500/30 text-green-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30' : 'border-white/10 text-white/30 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/30'}`}>
                  {item.published ? 'Hide' : 'Show'}
                </button>
                <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-white/40 hover:text-gold hover:bg-gold/10 transition-colors"><Edit2 size={13} /></button>
                <button onClick={() => remove(item.id)} className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
        {videos.length === 0 && (
          <div className="col-span-2 text-center py-16 text-white/30 text-sm">
            <Video size={36} className="mx-auto mb-3 opacity-20" />
            <p>No videos yet. Click <strong className="text-white/50">Add Video</strong> to add the first one.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// SITE SETTINGS TAB
// ─────────────────────────────────────────────────────────────
const SITE_SETTING_FIELDS = [
  { key: 'phone', label: 'Phone Number', placeholder: '+252 61 xxx xxxx', group: 'Contact' },
  { key: 'email', label: 'Email Address', placeholder: 'info@xts.so', group: 'Contact' },
  { key: 'whatsapp', label: 'WhatsApp Number', placeholder: '+252 61 xxx xxxx', group: 'Contact' },
  { key: 'address', label: 'Main Office Address', placeholder: 'Hodan District, Mogadishu', group: 'Contact' },
  { key: 'youtube', label: 'YouTube Channel URL', placeholder: 'https://www.youtube.com/@XTSParty', group: 'Social Media' },
  { key: 'facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/XTSParty', group: 'Social Media' },
  { key: 'twitter', label: 'Twitter/X URL', placeholder: 'https://twitter.com/XTSParty', group: 'Social Media' },
  { key: 'telegram', label: 'Telegram URL', placeholder: 'https://t.me/XTSParty', group: 'Social Media' },
  { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/XTSParty', group: 'Social Media' },
  { key: 'donation_goal', label: 'Donation Campaign Goal (USD)', placeholder: '10000', group: 'Branding' },
  { key: 'site_name_en', label: 'Site Name (English)', placeholder: "People's Progress Party", group: 'Branding' },
  { key: 'site_name_so', label: 'Site Name (Somali)', placeholder: 'Xisbiga Tallaabada Shacabka', group: 'Branding' },
  { key: 'tagline_en', label: 'Tagline (English)', placeholder: 'Justice. Unity. Prosperity.', group: 'Branding' },
  { key: 'tagline_so', label: 'Tagline (Somali)', placeholder: 'Xaq. Midnimo. Barwaaqo.', group: 'Branding' },
];

function SiteSettingsTab() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(d => { setValues(d.settings ?? d ?? {}); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const save = async (key: string) => {
    setSaving(key);
    await fetch('/api/admin/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: values[key] ?? '' }) });
    setSaving(null); setSaved(key);
    setTimeout(() => setSaved(null), 2000);
  };

  const groups = Array.from(new Set(SITE_SETTING_FIELDS.map(f => f.group)));

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <motion.div key="settings" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="mb-5">
        <h2 className="text-white font-bold">Site Settings</h2>
        <p className="text-white/30 text-xs mt-0.5">Configure contact details, social links, and site branding</p>
      </div>
      <div className="space-y-6">
        {groups.map(group => (
          <div key={group}>
            <h3 className="text-gold text-xs font-black uppercase tracking-widest mb-3">{group}</h3>
            <div className="space-y-3">
              {SITE_SETTING_FIELDS.filter(f => f.group === group).map(field => (
                <div key={field.key} className="bg-white/3 border border-white/8 rounded-xl p-4">
                  <label className="text-white/50 text-xs mb-2 block">{field.label}</label>
                  <div className="flex gap-3">
                    <input
                      value={values[field.key] ?? ''}
                      onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/40 placeholder-white/20"
                    />
                    <button onClick={() => save(field.key)} disabled={saving === field.key}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors shrink-0 ${saved === field.key ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gold text-navy hover:bg-gold/90'} disabled:opacity-50`}>
                      {saved === field.key ? '✓ Saved' : saving === field.key ? '…' : 'Save'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
