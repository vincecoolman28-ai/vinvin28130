
import React, { useState, useEffect } from 'react';

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    // Seuil très bas pour garantir l'apparition dès le début du scroll
    if (window.scrollY > 10) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    // Z-index très élevé (1000) pour passer au-dessus de tout
    // right-24 pour être collé à gauche de la loupe (qui est à right-6 avec width-16 => 6+16+2(gap) = 24)
    <div className={`fixed bottom-6 right-24 z-[1000] transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
      <button
        onClick={scrollToTop}
        className="w-12 h-12 bg-slate-800 border-2 border-hpsj-cyan text-hpsj-cyan rounded-full shadow-[0_0_15px_rgba(0,229,255,0.6)] flex items-center justify-center hover:bg-hpsj-cyan hover:text-slate-900 transition-all transform hover:scale-110 group"
        title="Retour en haut de page"
      >
        <i className="fa-solid fa-arrow-up text-lg group-hover:-translate-y-1 transition-transform"></i>
      </button>
    </div>
  );
};

export default BackToTop;
