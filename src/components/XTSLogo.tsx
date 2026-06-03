'use client';
import Image from 'next/image';

export default function XTSLogo({ size = 44, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      className={`relative rounded-full overflow-hidden border-2 border-gold/50 bg-[#1a2454] shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo.png"
        alt="XTS Logo"
        fill
        className="object-contain p-1"
        priority
      />
    </div>
  );
}
