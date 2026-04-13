import { useState, useRef, useEffect } from 'react'
import './App.css'


function App() {
  const [kisses, setKisses] = useState<{ id: number; top: string; left: string; rotation: number; width: string }[]>([]);
  const [isKissing, setIsKissing] = useState(false);
  const [isHugging, setIsHugging] = useState(false);
  const [showLove, setShowLove] = useState(false);
  const [celestials, setCelestials] = useState<{ id: number, left: string, size: string, src: string, duration: string, tx: string, rot: string }[]>([]);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number, left: string, size: string, color: string, duration: string, tx?: string }[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // A beautiful romantic melody
    audioRef.current = new Audio('https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3');
    audioRef.current.loop = true;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, []);

  useEffect(() => {
    if (!showLove) return;
    const interval = setInterval(() => {
      setCelestials(prev => {
        if (prev.length > 50) return prev;
        const images = ['/star1.png', '/star2.png', '/moon1.png', '/moon2.png', '/moon3.png'];
        const src = images[Math.floor(Math.random() * images.length)];
        const size = Math.random() * 50 + 40 + 'px';
        const left = (Math.random() * 160 - 30) + '%';
        const duration = Math.random() * 4 + 3 + 's';
        const tx = (Math.random() * 400 - 200) + 'px';
        const rot = (Math.random() * 360) + 'deg';
        const newCelest = { id: Date.now() + Math.random(), left, size, src, duration, tx, rot };
        return [...prev, newCelest];
      });
    }, 250);
    return () => clearInterval(interval);
  }, [showLove]);

  useEffect(() => {
    if (!isHugging) return;
    const interval = setInterval(() => {
      setFloatingHearts(prev => {
        const size = Math.random() * 40 + 20 + 'px';
        const colors = ['#ff4d6d', '#ff758f', '#ffb3c6', '#c9184a', '#a4133c', '#ff8fa3'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = (Math.random() * 80 + 10) + '%'; // Keep within center mostly
        const duration = Math.random() * 2 + 3 + 's';
        const tx = (Math.random() * 200 - 100) + 'px';
        const newHeart = { id: Date.now() + Math.random(), left, size, color, duration, tx };
        // Keep array small to prevent lag
        return prev.length > 40 ? [...prev.slice(1), newHeart] : [...prev, newHeart];
      });
    }, 200);
    return () => clearInterval(interval);
  }, [isHugging]);

  useEffect(() => {
    if (!isKissing) return;
    const interval = setInterval(() => {
      // Occasional kissing sound effect
      if (Math.random() > 0.4) {
        const sound = new Audio('/kiss-sound.ogg');
        sound.volume = 0.5;
        sound.play().catch(() => { });
      }

      setKisses(prev => {
        if (prev.length > 1600) return prev; // Max double the kisses
        // Spawn slowly
        const newKisses = Array.from({ length: 8 }).map(() => ({
          id: Date.now() + Math.random(),
          top: `${Math.random() * 100}vh`,
          left: `${Math.random() * 100}vw`,
          rotation: Math.random() * 360,
          width: `${Math.random() * 80 + 40}px`, // Variable sizes
        }));
        return [...prev, ...newKisses];
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isKissing]);

  const handleKiss = () => {
    setIsKissing(true);
  };

  const handleHug = () => {
    setIsHugging(prev => {
      const next = !prev;
      if (audioRef.current) {
        if (next) {
          audioRef.current.play().catch(console.error);
        } else {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }
      return next;
    });
  };

  const handleLove = () => {
    setShowLove(prev => {
      if (prev) setCelestials([]);
      return !prev;
    });
  }

  return (
    <div className="app-container">
      {kisses.map(kiss => (
        <img
          key={kiss.id}
          src="/kiss.png"
          className="kiss-mark"
          style={{ top: kiss.top, left: kiss.left, width: kiss.width, transform: `rotate(${kiss.rotation}deg)` }}
          alt="Kiss Mark"
        />
      ))}

      <div className="mouse-container">
        {floatingHearts.map(heart => (
          <div
            key={heart.id}
            className="floating-heart"
            style={{
              left: heart.left,
              fontSize: heart.size,
              color: heart.color,
              animationDuration: heart.duration,
              '--tx': heart.tx
            } as React.CSSProperties}
          >
            ❤
          </div>
        ))}
        {celestials.map(cel => (
          <img
            key={cel.id}
            src={cel.src}
            className="floating-celestial"
            style={{
              left: cel.left,
              width: cel.size,
              animationDuration: cel.duration,
              '--tx': cel.tx,
              '--rot': cel.rot
            } as React.CSSProperties}
            alt=""
          />
        ))}
        {showLove && (
          <div className="speech-bubble">
            Love you to the Moon and to Saturn ✨
          </div>
        )}
        <img
          src="/mouse.png"
          className={`mouse-image ${isHugging ? 'hugging' : ''}`}
          alt="Cute Mouse Hugging a Heart"
        />
      </div>

      <div className="button-group">
        <button className="action-button" onClick={handleKiss}>
          <span>Kiss</span>
        </button>
        <button className="action-button" onClick={handleHug}>
          <span>Hug</span>
        </button>
        <button className="action-button" onClick={handleLove}>
          <span>I LOVE YOU</span>
        </button>
      </div>

      <button className="reload-button" onClick={() => window.location.reload()} title="Restart App">
        ↻
      </button>
    </div>
  )
}

export default App
