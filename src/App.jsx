import React, { useEffect, useState, useRef } from 'react';
import './index.css';
import LoveQuiz from './components/LoveQuiz';
import TicTacToeLove from './components/TicTacToeLove';
import RockPaperScissors from './components/RockPaperScissors';
// Assets are in the public folder for easy management

const PetalBackground = () => {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const petal = {
        id: Math.random(),
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 12,
        size: 15 + Math.random() * 25,
      };
      setPetals((prev) => [...prev.slice(-15), petal]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="petal-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
      {petals.map((p) => (
        <div
          key={p.id}
          className="petal"
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: '-50px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: 'rgba(212, 175, 55, 0.2)',
            borderRadius: '50% 0 50% 0',
            filter: 'blur(1px)',
            animation: `fall ${p.duration}s linear forwards`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

const FloatingHearts = () => {
  const [hearts, setHearts] = useState([]);

  const addHeart = (e) => {
    const heart = {
      id: Math.random(),
      x: e.clientX,
      y: e.clientY,
    };
    setHearts(prev => [...prev, heart]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== heart.id));
    }, 2000);
  };

  useEffect(() => {
    window.addEventListener('click', addHeart);
    return () => window.removeEventListener('click', addHeart);
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 999 }}>
      {hearts.map(h => (
        <div key={h.id} className="floating-heart" style={{ left: h.x, top: h.y }}>❤️</div>
      ))}
      <style>{`
        .floating-heart {
          position: absolute;
          font-size: 24px;
          animation: floatUp 2s ease-out forwards;
          color: #ff4d6d;
        }
        @keyframes floatUp {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
          100% { transform: translate(-50%, -200px) scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

function App() {
  const [showLetter, setShowLetter] = useState(false);
  const [duration, setDuration] = useState({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const startDate = new Date('2025-11-01T00:00:00');

    const updateCounter = () => {
      const now = new Date();
      let diff = now.getTime() - startDate.getTime();

      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
      diff -= years * (1000 * 60 * 60 * 24 * 365.25);

      const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
      diff -= months * (1000 * 60 * 60 * 24 * 30.44);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff -= days * (1000 * 60 * 60 * 24);

      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff -= hours * (1000 * 60 * 60);

      const minutes = Math.floor(diff / (1000 * 60));
      diff -= minutes * (1000 * 60);

      const seconds = Math.floor(diff / 1000);

      setDuration({ years, months, days, hours, minutes, seconds });
    };

    const timer = setInterval(updateCounter, 1000);
    updateCounter(); // Initial call

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app">
      <PetalBackground />
      <FloatingHearts />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="image-wrapper float">
            <img src="/hero.png" alt="Ege & Buse" className="hero-image" />
            <div className="image-overlay"></div>
          </div>
          <div className="text-wrapper fade-in">
            <div className="badge">Buse & Ege Koca</div>
            <h1 className="main-title">Biricik Aşkıma</h1>
            <p className="subtitle">Kalbimdeki Tek İsim, Ruhumdaki Tek Parça</p>
            <div className="hero-buttons">
              <button className="cta-button primary" onClick={() => setShowLetter(true)}>Mektubunu Oku</button>
              <button className="cta-button secondary" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>Hikayemizi Gör</button>
            </div>
          </div>
        </div>
      </section>

      {/* Counter Section */}
      <section className="counter-section">
        <div className="container">
          <div className="glass-panel counter-card fade-in">
            <span className="counter-label">Aşkımız Tam</span>
            <div className="counter-display">
              <div className="counter-item">
                <span className="count">{duration.years}</span>
                <span className="label">YIL</span>
              </div>
              <div className="counter-item">
                <span className="count">{duration.months}</span>
                <span className="label">AY</span>
              </div>
              <div className="counter-item">
                <span className="count">{duration.days}</span>
                <span className="label">GÜN</span>
              </div>
              <div className="counter-item">
                <span className="count">{duration.hours}</span>
                <span className="label">SAAT</span>
              </div>
              <div className="counter-item">
                <span className="count">{duration.minutes}</span>
                <span className="label">DK</span>
              </div>
              <div className="counter-item">
                <span className="count">{duration.seconds}</span>
                <span className="label">SN</span>
              </div>
            </div>
            <span className="counter-label">Dür Devam Ediyor</span>
          </div>
        </div>
      </section>

      {/* Mini Games Section */}
      <section className="games-section">
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="section-title">Aşk Oyunları</h2>
          <p className="section-subtitle">Canım sıkıldı gel az oyun oynayalım şapşal ❤️</p>
          <div className="games-grid" style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            <LoveQuiz />
            <TicTacToeLove />
            <RockPaperScissors />
          </div>
        </div>
      </section>

      {/* Interactive Memories Section */}
      <section className="memories-section">
        <div className="container">
          <h2 className="section-title">Mal Ege</h2> <br />
          <div className="memory-grid">
            <div className="memory-item float">
              <div className="video-wrapper">
                <video className="memory-video" autoPlay loop muted playsInline>
                  <source src="/memory1.mp4" type="video/mp4" />
                </video>
                <div className="heart-overlay">❤️</div>
              </div>
              <div className="glass-panel memory-caption">
                <h4>İlk opucuk vidyom</h4>
                <p>biricik malosun</p>
              </div>
            </div>
            <div className="memory-item float" style={{ animationDelay: '0.5s' }}>
              <div className="video-wrapper">
                <video className="memory-video" autoPlay loop muted playsInline>
                  <source src="/memory2.mp4" type="video/mp4" />
                </video>
                <div className="heart-overlay">❤️</div>
              </div>
              <div className="glass-panel memory-caption">
                <h4>burdada mal cikmisim</h4>
                <p>seviyom seni</p>
              </div>
            </div>
          </div>
          <div className="glass-panel quote">
            "SANA AŞIĞIM YAVRUCAĞIM."
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <h2 className="section-title">Benim için Neden Özelsin?</h2> <br />
          <div className="grid">
            <div className="glass-panel stat-card float" style={{ animationDelay: '0s' }}>
              <div className="icon">✨</div>
              <h3>Güzelliğin</h3>
              <div className="progress-bar"><div className="progress" style={{ width: '100%', background: 'var(--accent)' }}></div></div>
              <p>yani gördüğüm en güzel şeysin amk başka açıklamasımı var yarrammmmm mwahh</p>
            </div>
            <div className="glass-panel stat-card float" style={{ animationDelay: '0.5s' }}>
              <div className="icon">❤️</div>
              <h3>Sana karşı olan itaatkarliğim</h3>
              <div className="progress-bar"><div className="progress" style={{ width: '100%', background: 'var(--primary-light)' }}></div></div>
              <p>gordugun en itaatkar insanim askimtm?</p>
            </div>
            <div className="glass-panel stat-card float" style={{ animationDelay: '1s' }}>
              <div className="icon">🔥</div>
              <h3>Aşkımız</h3>
              <div className="progress-bar"><div className="progress" style={{ width: '100%', background: '#ff4d6d' }}></div></div>
              <p>bugune kadarki en iyi ciftizzz</p>
            </div>
          </div>
        </div>
      </section>

      {/* Letter Modal */}
      {showLetter && (
        <div className="letter-overlay" onClick={() => setShowLetter(false)}>
          <div className="letter-modal" onClick={e => e.stopPropagation()}>
            <div className="letter-header">
              <div className="seal">❤️</div>
              <h2>Canım Sevgilime</h2>
              <button className="close-x" onClick={() => setShowLetter(false)}>&times;</button>
            </div>
            <div className="letter-content">
              <p>Merhaba Canım Sevgilim,</p>
              <p>Şu an bu satırları okurken umarım yüzünde küçük de olsa bir gülümseme vardır. Çünkü o gülüşün için dünyayı yakarım.</p>
              <p>Zor bir dönemden geçtiğini biliyorum ama şunu asla unutma: <strong>Yanında Her Zaman Egen, Biricik Kocan, Sevgilin, Maymusun, Koca Bebişin olacak.</strong></p>
              <p>En büyük hayalimi zaten biliyorsun sevgilim, ama yinede anlatmak istiyorum; ben seninle bir ömür geçirmek istiyorum.</p>
              <p>Her zaman yanında olacağıma söz veriyorum.</p>
              <div className="letter-footer">
                <p>Seni Seviyorum,</p>
                <h3 className="signature">Ege Koca</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="footer-content">
          <p>Tüm Hakları Aşkımızda Saklıdır © 2026</p>
          <div className="footer-line"></div>
          <h3>Buse & Ege Koca</h3>
        </div>
      </footer>

      <style>{`
        .app {
          background: #050505;
          overflow: hidden;
        }

        .badge {
          background: rgba(212, 175, 55, 0.1);
          color: var(--accent);
          padding: 0.5rem 1.5rem;
          border-radius: 50px;
          display: inline-block;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 3px;
          margin-bottom: 2rem;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
        }

        .hero-content {
          max-width: 1000px;
          display: flex;
          align-items: center;
          gap: 5rem;
          text-align: left;
        }

        .image-wrapper {
          position: relative;
          min-width: 400px;
          height: 400px;
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          border: 2px solid var(--accent);
          overflow: hidden;
          box-shadow: 0 0 50px rgba(107, 15, 26, 0.5);
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .main-title {
          font-size: 5rem;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #fff 0%, var(--accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          font-size: 1.2rem;
          color: var(--text-muted);
          margin-bottom: 3rem;
          letter-spacing: 1px;
        }

        .hero-buttons {
          display: flex;
          gap: 1.5rem;
        }

        .cta-button {
          padding: 1.2rem 2.5rem;
          border-radius: 4px;
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .cta-button.primary {
          background: var(--accent);
          border: none;
          color: #000;
        }

        .cta-button.secondary {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
        }

        .cta-button:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 10px 20px rgba(0,0,0,0.5);
        }

        .counter-section {
          padding: 6rem 0;
          text-align: center;
        }

        .counter-card {
           padding: 4rem;
           display: inline-block;
        }

        .counter-display {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin: 2rem 0;
          flex-wrap: wrap;
        }

        .counter-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .count {
          font-size: 4rem;
          font-family: 'Playfair Display', serif;
          color: var(--accent);
          line-height: 1;
          text-shadow: 0 0 30px rgba(212, 175, 55, 0.3);
          font-variant-numeric: tabular-nums;
          min-width: 1.2em;
          text-align: center;
          display: inline-block;
        }

        .label {
          font-size: 0.9rem;
          color: var(--text-muted);
          letter-spacing: 2px;
          margin-top: 0.5rem;
        }

        .games-section {
          padding: 6rem 0;
          text-align: center;
          background: linear-gradient(to bottom, #050505, #110202, #050505);
        }
        
        .section-subtitle {
          color: var(--text-muted);
          margin-bottom: 3rem;
        }

        .games-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 3rem;
          align-items: start;
        }

        .memories-section {
          padding: 8rem 0;
          background: linear-gradient(to bottom, transparent, #110202, transparent);
        }

        .memory-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 4rem;
          margin-bottom: 4rem;
        }

        .memory-item {
          position: relative;
        }

        .video-wrapper {
          position: relative;
          width: 100%;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 0 50px rgba(107, 15, 26, 0.4);
          border: 2px solid var(--glass-border);
        }

        .memory-video {
          width: 100%;
          display: block;
          border-radius: 20px;
          filter: sepia(20%) brightness(90%);
        }

        .heart-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 8rem;
          opacity: 0.4;
          filter: drop-shadow(0 0 20px rgba(255, 77, 109, 0.8));
          pointer-events: none;
          animation: heartbeat 1.5s ease-in-out infinite;
        }

        @keyframes heartbeat {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
          15% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.6; }
          30% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
          45% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
        }

        .section-title.left { text-align: left; }

        .quote {
          margin-top: 3rem;
          font-style: italic;
          font-size: 1.4rem;
          color: var(--accent);
          text-align: center;
        }

        .stat-card .icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
        }

        /* Modal Styles */
        .letter-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: rgba(0,0,0,0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(10px);
        }

        .letter-modal {
          background: #fdfaf6;
          color: #2c1810;
          max-width: 700px;
          width: 90%;
          max-height: 85vh;
          overflow-y: auto;
          padding: 5rem 4rem;
          position: relative;
          box-shadow: 0 25px 50px rgba(0,0,0,0.5);
          border-radius: 2px;
        }

        .letter-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .seal {
          width: 60px;
          height: 60px;
          background: var(--primary);
          color: var(--accent);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-family: 'Playfair Display', serif;
          margin: 0 auto 1.5rem;
          box-shadow: 0 0 0 5px #fdfaf6, 0 0 0 7px var(--primary);
        }

        .letter-content p {
          font-size: 1.2rem;
          line-height: 1.8;
          margin-bottom: 2rem;
          font-family: serif;
        }

        .letter-footer {
          margin-top: 4rem;
          text-align: right;
        }

        .signature {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          color: var(--primary);
        }

        .close-x {
          position: absolute;
          top: 1rem;
          right: 1.5rem;
          background: none;
          border: none;
          font-size: 2.5rem;
          cursor: pointer;
          color: #ccc;
        }

        .footer-line {
          width: 100px;
          height: 2px;
          background: var(--accent);
          margin: 1.5rem auto;
        }

        @media (max-width: 968px) {
          .hero-content { 
            flex-direction: column; 
            text-align: center; 
            gap: 2rem;
            padding-top: 2rem;
          }
          .image-wrapper { 
            min-width: 280px; 
            width: 280px;
            height: 280px; 
          }
          .main-title { font-size: 2.8rem; }
          .hero-buttons { 
            flex-direction: column;
            width: 100%;
            gap: 1rem;
          }
          .cta-button { width: 100%; }
          
          .counter-display { gap: 1rem; }
          .count { font-size: 3rem; }
          
          .memory-grid { gap: 2rem; }
          .memory-caption { 
            position: relative; 
            bottom: 0; 
            right: 0; 
            margin-top: 1rem; 
            padding: 1rem;
          }
          
          .letter-modal {
            padding: 3rem 1.5rem;
            width: 95%;
          }
          .letter-content p { font-size: 1rem; }
          .seal { width: 50px; height: 50px; font-size: 1.5rem; }
        }

        @media (max-width: 480px) {
          .main-title { font-size: 2.2rem; }
          .subtitle { font-size: 1rem; }
          .count { font-size: 2.5rem; }
          .label { font-size: 0.7rem; }
        }
      `}</style>
    </div>
  );
}

export default App;
