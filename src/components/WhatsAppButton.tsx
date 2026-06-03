'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

// Replace with your real WhatsApp group invite link or phone number
const WHATSAPP_NUMBER = '252615000000'; // e.g. 252 61 500 0000 (Somalia)
const WHATSAPP_GROUP = 'https://chat.whatsapp.com/XTS_PLACEHOLDER'; // replace with real group link
const MESSAGE = encodeURIComponent('Salaan! Waxaan rabaa inaan ka ogaado xisbiga XTS. / Hello! I want to learn more about XTS Party.');

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            className="bg-[#1a2454] border border-white/15 rounded-2xl p-4 shadow-2xl w-64"
          >
            <p className="text-white font-bold text-sm mb-1">Connect on WhatsApp</p>
            <p className="text-white/50 text-xs mb-3">Join our campaign group or send us a message directly.</p>
            <div className="flex flex-col gap-2">
              <a
                href={WHATSAPP_GROUP}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-[#25D366] text-white rounded-lg text-xs font-bold hover:bg-[#20bd5b] transition-colors"
              >
                <MessageCircle size={14} />
                Join WhatsApp Group
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${MESSAGE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-white/10 text-white rounded-lg text-xs font-bold hover:bg-white/15 transition-colors border border-white/15"
              >
                <MessageCircle size={14} />
                Chat with Us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-colors"
        style={{ background: open ? '#1a2454' : '#25D366' }}
        aria-label={open ? 'Close WhatsApp' : 'Contact us on WhatsApp'}
      >
        {open
          ? <X size={22} className="text-white" />
          : <MessageCircle size={26} className="text-white" />
        }
      </motion.button>
    </div>
  );
}
