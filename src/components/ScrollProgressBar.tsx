'use client';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0%' }}
      className="fixed top-0 left-0 right-0 h-[3px] z-[9999] pointer-events-none"
      // Animated gradient: gold → red → gold
    >
      <div className="w-full h-full"
        style={{ background: 'linear-gradient(90deg, #c9a227, #ef4444, #c9a227)' }} />
    </motion.div>
  );
}
