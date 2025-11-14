'use client';

import Image from 'next/image';
import { useCallback, useMemo, useRef, useState } from 'react';

type FallingPetal = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  rotation: number;
  scale: number;
  variant: 'heart' | 'rose';
};

const coupleImage =
  'https://images.unsplash.com/photo-1520854221050-0f4caff449fb?auto=format&fit=crop&w=1200&q=80';

export default function InvitationPage() {
  const [petals, setPetals] = useState<FallingPetal[]>([]);
  const idRef = useRef(0);
  const inviteRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const addPetals = useCallback(() => {
    const batchSize = 18;
    const freshPetals: FallingPetal[] = Array.from({ length: batchSize }, () => {
      const id = idRef.current++;
      const petal: FallingPetal = {
        id,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 5 + Math.random() * 3,
        rotation: Math.random() * 360,
        scale: 0.7 + Math.random() * 0.9,
        variant: Math.random() > 0.45 ? 'heart' : 'rose',
      };

      setTimeout(() => {
        setPetals((prev) => prev.filter((item) => item.id !== id));
      }, (petal.duration + petal.delay) * 1000);

      return petal;
    });

    setPetals((prev) => [...prev, ...freshPetals]);
  }, []);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const element = inviteRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateX = ((y - rect.height / 2) / rect.height) * -12;
    const rotateY = ((x - rect.width / 2) / rect.width) * 12;

    setTilt({ x: rotateX, y: rotateY });
  }, []);

  const handlePointerLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  const floralBands = useMemo(
    () =>
      Array.from({ length: 4 }, (_, index) => (
        <span key={index} className={`floral-band floral-band-${index + 1}`} aria-hidden="true" />
      )),
    []
  );

  return (
    <main className="page" onClick={addPetals}>
      {petals.map((petal) => (
        <span
          key={petal.id}
          className={`petal petal-${petal.variant}`}
          style={{
            left: `${petal.left}%`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
            transform: `scale(${petal.scale}) rotate(${petal.rotation}deg)`
          }}
          aria-hidden="true"
        />
      ))}

      <div className="aurora" aria-hidden="true">
        <div className="glow glow-one" />
        <div className="glow glow-two" />
        <div className="glow glow-three" />
      </div>

      <div
        className="invitation"
        ref={inviteRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        {floralBands}
        <div className="header">
          <p className="tag">Together with their families</p>
          <h1 className="names">
            <span className="name">Harini</span>
            <span className="ampersand">&amp;</span>
            <span className="name">Vishnu</span>
          </h1>
          <p className="surname">B &amp; Sithan</p>
        </div>

        <div className="photo-wrapper">
          <div className="photo-frame">
            <Image
              src={coupleImage}
              alt="Harini and Vishnu embracing in celebration"
              fill
              sizes="(max-width: 768px) 80vw, 420px"
              priority
            />
          </div>
        </div>

        <section className="details">
          <div className="event-card reception">
            <h2>Reception</h2>
            <p className="date">22 · 11 · 2025</p>
            <p className="time">From 6:00 PM onwards</p>
          </div>

          <div className="event-card wedding">
            <h2>Wedding</h2>
            <p className="date">23 · 11 · 2025</p>
            <p className="time">Muhurtham 8:00 AM – 9:30 AM</p>
          </div>
        </section>

        <section className="location">
          <h3>Venue</h3>
          <p className="hall">Vidyhya Bharathi Kalyana Mandapam</p>
          <p>No.55, Bheema Sena Garden Street</p>
          <p>Mylapore, Chennai – 600005</p>
        </section>

        <p className="footer">With love, the families of Harini &amp; Vishnu</p>
      </div>

      <style jsx>{`
        .page {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 1.5rem;
          perspective: 1600px;
          cursor: pointer;
          overflow: hidden;
        }

        .aurora {
          position: absolute;
          inset: 0;
          overflow: hidden;
          filter: blur(70px);
          opacity: 0.6;
          mix-blend-mode: screen;
        }

        .glow {
          position: absolute;
          width: 60vmax;
          height: 60vmax;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.85), rgba(255, 134, 183, 0));
          animation: float 18s infinite ease-in-out;
        }

        .glow-one {
          top: -20vmax;
          left: -10vmax;
        }

        .glow-two {
          bottom: -30vmax;
          right: -20vmax;
          animation-delay: -6s;
        }

        .glow-three {
          top: 10vmax;
          right: -25vmax;
          animation-delay: -12s;
        }

        @keyframes float {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(5%, -5%, 0) scale(1.1);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        .invitation {
          position: relative;
          width: min(960px, 90vw);
          padding: clamp(2.5rem, 4vw, 4rem);
          border-radius: 36px;
          backdrop-filter: blur(26px);
          background: linear-gradient(145deg, rgba(255, 247, 251, 0.95), rgba(255, 228, 241, 0.75));
          box-shadow:
            0 35px 80px rgba(139, 30, 63, 0.18),
            0 15px 35px rgba(255, 141, 194, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(255, 134, 183, 0.3);
          transform-style: preserve-3d;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .invitation::before,
        .invitation::after {
          content: '';
          position: absolute;
          inset: 1.5rem;
          border-radius: 24px;
          border: 2px dashed rgba(216, 65, 110, 0.2);
          pointer-events: none;
        }

        .invitation::after {
          inset: 0.5rem;
          border-radius: 30px;
          border: 1px solid rgba(255, 255, 255, 0.45);
        }

        .floral-band {
          position: absolute;
          width: 120px;
          height: 120px;
          background: radial-gradient(circle at center, rgba(255, 92, 138, 0.7), rgba(255, 92, 138, 0));
          filter: blur(6px);
          opacity: 0.55;
          pointer-events: none;
        }

        .floral-band-1 {
          top: -30px;
          left: 8%;
        }

        .floral-band-2 {
          top: 12%;
          right: -40px;
        }

        .floral-band-3 {
          bottom: 10%;
          left: -50px;
        }

        .floral-band-4 {
          bottom: -40px;
          right: 20%;
        }

        .header {
          text-align: center;
          margin-bottom: clamp(2rem, 5vw, 3.5rem);
          color: var(--deep-red);
        }

        .tag {
          font-family: 'Poppins', sans-serif;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          font-size: 0.82rem;
          margin-bottom: 1rem;
          color: rgba(139, 30, 63, 0.7);
        }

        .names {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(1.4rem, 3vw, 2.4rem);
          font-family: 'Great Vibes', cursive;
          font-size: clamp(2.8rem, 8vw, 4.8rem);
          color: var(--deep-red);
          font-weight: 400;
          text-shadow: 0 10px 20px rgba(255, 92, 138, 0.3);
        }

        .name {
          display: inline-block;
        }

        .ampersand {
          font-size: 0.8em;
          color: var(--rose);
        }

        .surname {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(139, 30, 63, 0.65);
        }

        .photo-wrapper {
          position: relative;
          margin: 0 auto clamp(2rem, 5vw, 3rem);
          max-width: 420px;
          perspective: 1000px;
        }

        .photo-frame {
          position: relative;
          width: 100%;
          padding-bottom: 115%;
          border-radius: 32px;
          overflow: hidden;
          box-shadow:
            0 25px 55px rgba(139, 30, 63, 0.24),
            inset 0 0 0 8px rgba(255, 255, 255, 0.55);
          transform: rotateX(10deg) rotateY(-5deg);
          border: 1px solid rgba(216, 65, 110, 0.35);
        }

        .photo-frame :global(img) {
          object-fit: cover;
          filter: saturate(1.05) contrast(1.05);
        }

        .details {
          display: grid;
          gap: 1.5rem;
          margin: 0 auto clamp(2.5rem, 6vw, 3.5rem);
          max-width: 640px;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        }

        .event-card {
          padding: 1.75rem;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(216, 65, 110, 0.25);
          box-shadow: 0 18px 35px rgba(255, 92, 138, 0.12);
          text-align: center;
        }

        .event-card h2 {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--deep-red);
          margin-bottom: 0.85rem;
        }

        .event-card .date {
          font-size: 1.2rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: var(--rose-dark);
        }

        .event-card .time {
          margin-top: 0.6rem;
          font-size: 1rem;
          color: rgba(74, 14, 37, 0.75);
        }

        .location {
          margin: 0 auto clamp(1.5rem, 4vw, 2.5rem);
          text-align: center;
          max-width: 540px;
          padding: 1.8rem;
          border-radius: 20px;
          background: linear-gradient(120deg, rgba(255, 204, 225, 0.4), rgba(255, 255, 255, 0.7));
          border: 1px solid rgba(216, 65, 110, 0.2);
          box-shadow: 0 15px 40px rgba(255, 92, 138, 0.15);
        }

        .location h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          text-transform: uppercase;
          letter-spacing: 0.24em;
          color: var(--deep-red);
          margin-bottom: 1rem;
        }

        .location .hall {
          font-family: 'Great Vibes', cursive;
          font-size: 2rem;
          margin-bottom: 0.7rem;
          color: var(--rose-dark);
        }

        .location p {
          font-size: 1.05rem;
          color: rgba(74, 14, 37, 0.75);
        }

        .footer {
          margin-top: clamp(2rem, 4vw, 3rem);
          text-align: center;
          font-size: 0.95rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(139, 30, 63, 0.55);
        }

        .petal {
          position: absolute;
          top: -60px;
          width: 42px;
          height: 42px;
          pointer-events: none;
          opacity: 0;
          background-size: cover;
          animation-name: fall, flutter;
          animation-timing-function: ease-in, ease-in-out;
          animation-iteration-count: 1, infinite;
          animation-fill-mode: forwards;
        }

        .petal-heart {
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 29"><path fill="%23ff5c8a" d="M23.6 0c-2.6 0-5 1.2-6.6 3.1C15.4 1.2 13 .1 10.4.1 5 0 0 4.4 0 10.4c0 5.6 4.4 9 8.5 12.4 3 2.4 5.7 4.6 7.1 6.8 1.4-2.2 4.1-4.4 7.1-6.8 4.1-3.4 8.5-6.8 8.5-12.4C31.2 4.4 26.2 0 20.8 0z"/></svg>');
        }

        .petal-rose {
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="%23d8416e" d="M32 2C20 2 8 10 8 24c0 20 24 38 24 38s24-18 24-38C56 10 44 2 32 2zm0 52C24 46 12 34 12 24c0-10 10-18 20-18s20 8 20 18c0 10-12 22-20 30z"/><path fill="%23ff85b5" d="M32 10c-8 0-14 6-14 14 0 10 8 18 14 24 6-6 14-14 14-24 0-8-6-14-14-14z"/></svg>');
        }

        @keyframes fall {
          0% {
            transform: translate3d(0, -80px, 0) scale(0.8);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translate3d(0, 110vh, 0) scale(1.1);
            opacity: 0;
          }
        }

        @keyframes flutter {
          0%, 100% {
            transform: translateX(0) rotate(0deg);
          }
          50% {
            transform: translateX(25px) rotate(12deg);
          }
        }

        @media (max-width: 768px) {
          .invitation {
            padding: 2.2rem clamp(1.25rem, 5vw, 2rem);
            border-radius: 26px;
          }

          .photo-frame {
            transform: none;
          }

          .tag {
            letter-spacing: 0.25em;
          }

          .footer {
            letter-spacing: 0.18em;
            font-size: 0.82rem;
          }
        }
      `}</style>
    </main>
  );
}
