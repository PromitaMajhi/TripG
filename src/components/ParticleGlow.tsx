'use client';

import { motion } from 'framer-motion';

export default function ParticleGlow() {
  const particles = [
    { x: '10%', y: '15%', size: 140, duration: 9, delay: 0 },
    { x: '80%', y: '25%', size: 180, duration: 12, delay: 1 },
    { x: '25%', y: '65%', size: 160, duration: 11, delay: 2 },
    { x: '75%', y: '80%', size: 130, duration: 10, delay: 0.5 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Ambient glowing radial orbs */}
      {particles.map((p, idx) => (
        <motion.div
          key={idx}
          className="absolute rounded-full filter blur-3xl opacity-20"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background: idx % 2 === 0
              ? 'radial-gradient(circle, #ff2e93 0%, #a855f7 100%)'
              : 'radial-gradient(circle, #d946ef 0%, #ff437e 100%)',
          }}
          animate={{
            y: ['0px', '-30px', '0px'],
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.28, 0.15],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
