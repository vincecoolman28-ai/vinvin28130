import React, { useEffect, useState } from 'react';

export const Header: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Check local storage or system preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }

    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <>
      <header className="bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 border-b-2 border-slate-400 dark:border-slate-700 p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl z-50 relative">
        {/* Visual Rivets */}
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 shadow-[inset_1px_1px_1px_rgba(0,0,0,0.5)]"></div>
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 shadow-[inset_1px_1px_1px_rgba(0,0,0,0.5)]"></div>

        <div className="flex items-center gap-4 pl-2">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-700 dark:to-slate-900 rounded-lg flex items-center justify-center overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_6px_rgba(0,0,0,0.3)] border border-slate-400 dark:border-slate-600">
             <i className="fa-solid fa-hospital text-2xl text-blue-600 dark:text-hpsj-blue drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"></i>
          </div>
          <div>
             <h1 className="text-2xl font-black text-slate-800 dark:text-slate-200 tracking-wider uppercase flex items-baseline gap-1" style={{ textShadow: '1px 1px 0 rgba(255,255,255,0.1), -1px -1px 0 rgba(0,0,0,0.5)' }}>
              <span>HPSJ <span className="text-blue-600 dark:text-hpsj-blue">PORTAIL</span></span>
              <span className="text-[10px] text-red-600 lowercase font-bold italic tracking-normal translate-y-[-2px]">vincent</span>
            </h1>
            <div className="h-0.5 w-full bg-gradient-to-r from-blue-500 to-transparent mt-1"></div>
          </div>
        </div>

        <div className="flex items-center gap-6 pr-2">
          {/* Theme Toggle Button - Metallic Switch */}
          <button 
            onClick={toggleTheme}
            className="w-12 h-8 rounded-full bg-slate-300 dark:bg-slate-950 flex items-center px-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] border border-slate-400 dark:border-slate-700 transition-colors cursor-pointer"
            title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
          >
            <div className={`w-6 h-6 rounded-full bg-gradient-to-b from-white to-gray-300 shadow-md transform transition-transform duration-300 flex items-center justify-center text-xs ${isDark ? 'translate-x-4 text-slate-800' : 'translate-x-0 text-yellow-600'}`}>
              {isDark ? <i className="fa-solid fa-moon"></i> : <i className="fa-solid fa-sun"></i>}
            </div>
          </button>

          <div className="flex flex-col items-end bg-slate-900/10 dark:bg-black/20 px-3 py-1 rounded border border-slate-400/30 dark:border-slate-700">
            <div className="text-2xl font-bold text-slate-700 dark:text-hpsj-blue font-mono tracking-widest" style={{ textShadow: '0 0 5px rgba(59, 130, 246, 0.3)' }}>
              {time.toLocaleTimeString()}
            </div>
            <div className="text-[10px] text-slate-600 dark:text-slate-400 uppercase tracking-widest font-bold">
              {time.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short' }).replace('.', '')}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};