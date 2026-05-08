import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';

export default function App() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getPhrase = () => {
    const phrases = [
      "No",
      "Are you sure?",
      "Really sure?",
      "Think again!",
      "Last chance!",
      "Surely not?",
      "You might regret this!",
      "Give it another thought!",
      "Are you absolutely certain?",
      "This could be a mistake!",
      "Have a heart!",
      "Don't be so cold!",
      "Change of heart?",
      "Wouldn't you reconsider?",
      "Is that your final answer?",
      "You're breaking my heart ;(",
      "Pls?",
      "I'll buy you food!",
      "I'm begging you!"
    ];
    return phrases[Math.min(noCount, phrases.length - 1)];
  };

  const getImgSrc = () => {
    if (yesPressed) {
      return "https://media.tenor.com/gUiu1zyxfzYAAAAi/bear-kiss-bear-kisses.gif";
    }
    if (noCount === 0) {
      return "/my-pic.jpg"; // User's picture asking!
    }
    if (noCount < 3) {
      return "https://media.tenor.com/_Z8R917d2vQAAAAi/bubu-dudu.gif"; // Begging
    }
    if (noCount < 6) {
      return "https://media.tenor.com/cUBR7-Zih0cAAAAi/bubu-dudu.gif"; // Sad crying
    }
    if (noCount < 10) {
      return "https://media.tenor.com/yFng5Btt3aUAAAAi/bubu-dudu.gif"; // Throwing a fit
    }
    return "https://media.tenor.com/h9D5A0H5-yMAAAAi/bubu-dudu-bubu.gif"; // Distorted / Ultimate sad
  };

  const moveNoButton = () => {
    if (!isClient) return;
    // Calculate safe boundaries so the button stays within the viewport easily
    const maxX = window.innerWidth / 2 - 100;
    const maxY = window.innerHeight / 2 - 80;
    const minX = -maxX;
    const minY = -maxY;

    const x = Math.random() * (maxX - minX) + minX;
    const y = Math.random() * (maxY - minY) + minY;
    
    setNoPosition({ x, y });
  };

  const handleNoClick = () => {
    setNoCount(noCount + 1);
    moveNoButton();
  };

  const handleYesClick = () => {
    setYesPressed(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffb6c1', '#ff69b4', '#ff1493', '#db7093', '#c71585']
    });
  };

  const yesButtonSize = Math.min(noCount * 20 + 16, 80);

  // Before client mounts, don't render positional stuff to avoid hydration jumps
  if (!isClient) return <div className="min-h-screen bg-brand-bg" />;

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-brand-bg p-4 overflow-hidden relative">
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 w-full max-w-5xl md:h-[704px] z-10">
        
        {/* Main Card */}
        <div className="bento-card md:col-span-2 md:row-span-2 bg-brand-yellow relative !overflow-visible">
          <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs rounded-full uppercase z-20 font-bold border-2 border-black shadow-[2px_2px_0px_#000]"> URGENT REQUEST </div>
          
          {yesPressed ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center z-10 p-4">
              <img 
                src="/my-pic.jpg" 
                alt="Happy yes"
                onError={(e) => { 
                  e.currentTarget.src = "https://media.tenor.com/gUiu1zyxfzYAAAAi/bear-kiss-bear-kisses.gif"; 
                }}
                className="w-48 h-48 sm:w-64 sm:h-64 object-cover object-top rounded-xl shadow-[6px_6px_0px_#000] border-4 border-black mb-6" 
              />
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black text-center mb-2 leading-tight">YAYYY! I KNEW YOU'D SAY YES! ❤️</h1>
              <p className="text-xl font-bold bg-black text-white px-4 py-2 mt-2 -rotate-2 border-2 border-white shadow-[4px_4px_0px_#000]">Get ready for the best night ever!</p>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center w-full z-10">
              <img 
                src={noCount === 0 ? "/my-pic.jpg" : getImgSrc()} 
                alt="Prom request" 
                onError={(e) => { 
                  e.currentTarget.src = noCount === 0 
                    ? "https://media.tenor.com/JukK9k5_OEQAAAAi/bubu-dudu.gif" 
                    : getImgSrc() 
                }}
                className="w-40 h-40 md:w-56 md:h-56 object-cover object-top rounded-xl shadow-[4px_4px_0px_#000] border-4 border-black mt-6 mb-2"
              />
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black m-0 mb-4 mt-2 leading-none">PROM?</h1>
              <p className="text-lg md:text-xl font-bold mb-6">I promise not to step on your toes (mostly).</p>
              
              <div className="flex sm:flex-row items-center justify-center gap-6 w-full h-[120px] relative">
                <button
                  className="brutalist-btn bg-brand-green-success text-black px-8 py-4 transition-all z-20 whitespace-nowrap"
                  style={{ fontSize: `${yesButtonSize}px` }}
                  onClick={handleYesClick}
                >
                  YES!
                </button>
                <motion.button
                  className="brutalist-btn bg-brand-red-fail text-white px-6 py-3 absolute z-30 whitespace-nowrap"
                  animate={{ x: noPosition.x, y: noPosition.y, rotate: yesPressed ? 0 : 15 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={handleNoClick}
                  onMouseEnter={() => { if(noCount > 0) moveNoButton() }}
                >
                  {getPhrase()}
                </motion.button>
              </div>
              <div className="absolute bottom-4 left-4 bg-brand-yellow border-2 border-black px-2 py-1 text-xs font-bold -rotate-6"> Warning: Button moves! </div>
            </div>
          )}
        </div>

        {/* Side Cards */}
        <div className="bento-card bg-brand-green-light relative overflow-hidden">
          <img 
            src="/my-pic.jpg" 
            alt="Me waiting"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            className="absolute inset-0 w-full h-full object-cover object-top opacity-40 grayscale mix-blend-multiply"
          />
          <div className="meme-face relative z-10">💀</div>
          <p className="text-xl font-bold m-0 relative z-10 bg-white/90 border-2 border-black px-3 py-1 shadow-[2px_2px_0px_#000] -rotate-2">
            Me waiting for your reply
          </p>
        </div>

        <div className="bento-card bg-brand-pink">
          <div className="meme-face">🐱</div>
          <p className="text-xl font-bold m-0">Puss in Boots eyes active</p>
        </div>

        <div className="bento-card bg-brand-blue flex-col justify-center">
          <p className="text-xl font-bold m-0 uppercase flex-shrink-0">RIZZ LEVEL</p>
          <div className="text-4xl font-black leading-tight flex-shrink-0 mt-2">OVER {9000 + noCount * 100}</div>
          <div className="loading-bar w-full mt-4 flex-shrink-0">
            <div className="loading-fill" style={{ width: `${Math.min(85 + noCount * 2, 100)}%` }}></div>
          </div>
        </div>

        <div className="bento-card bg-brand-purple-light">
          <div className="meme-face">📈</div>
          <p className="text-xl font-bold m-0">Stonks go up if you say yes</p>
        </div>

        <div className="bento-card md:col-span-2 bg-brand-red">
          <h2 className="text-3xl font-black uppercase m-0 leading-none mb-2">PLEASE PLEASE PLEASE</h2>
          <div className="flex gap-3 my-4 justify-center flex-wrap">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-12 h-12 bg-black rounded-full shadow-[2px_2px_0px_rgba(255,255,255,0.5)]"></div>
            ))}
          </div>
          <p className="text-sm font-bold mt-2">*Terms and conditions apply: You have to dance at least once.</p>
        </div>

        <div className="bento-card bg-brand-orange relative overflow-hidden">
          <img 
            src="/my-pic.jpg" 
            alt="Me alone"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            className="absolute inset-0 w-full h-full object-cover object-top opacity-30 mix-blend-color-burn"
          />
          <div className="meme-face relative z-10">🤡</div>
          <p className="text-xl font-bold m-0 relative z-10 bg-white/90 border-2 border-black px-3 py-1 shadow-[2px_2px_0px_#000] rotate-2">
            Me if I have to go alone
          </p>
        </div>

        <div className="bento-card bg-brand-purple-dark">
          <div className="meme-face">👑</div>
          <p className="text-xl font-bold m-0">Prom Queen Energy</p>
        </div>
      </div>
    </div>
  );
}
