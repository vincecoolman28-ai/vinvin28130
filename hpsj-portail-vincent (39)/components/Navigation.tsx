
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/', icon: 'fa-house', label: 'Accueil', style: 'default' },
    { path: '/annuaire-global', icon: 'fa-phone-flip', label: 'Annuaire Global', style: 'blue' },
    { path: '/gps', icon: 'fa-location-arrow', label: 'GPS Intérieur', style: 'blue' },
    { path: '/plan-hospitalier', icon: 'fa-building-shield', label: <span>Plan Hospitalier <span className="text-red-600 dark:text-red-400">n°98D</span></span>, style: 'blue' },
    { path: '/annuaire', icon: 'fa-address-book', label: 'Annuaire Méd.' },
    { path: '/qui-fait-quoi', icon: 'fa-circle-question', label: 'Qui fait quoi ?', style: 'default' },
    { path: '/losserand', icon: 'fa-building', label: 'C. Losserand' },
    { path: '/gardes', icon: 'fa-phone-volume', label: 'Gardes' },
    { path: '/consultations', icon: 'fa-user-group', label: 'Consult.' },
    { path: '/drh', icon: 'fa-sitemap', label: 'DRH' },
    { path: '/secretariats', icon: 'fa-person-booth', label: 'Secrétariats' },
    { path: '/services', icon: 'fa-hospital-user', label: 'Postes de soins' },
    { path: '/encadrement', icon: 'fa-user-tie', label: 'Encadrement' },
    { path: '/utiles', icon: 'fa-star-of-life', label: 'N° Utiles' },
    { path: '/plan', icon: 'fa-map-location-dot', label: 'Plan 2D' },
    { path: '/contact', icon: 'fa-paper-plane', label: 'Contact', style: 'red' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-slate-200/95 dark:bg-[#111827]/95 backdrop-blur border-b-2 border-slate-400 dark:border-slate-700 shadow-xl overflow-x-auto custom-scrollbar">
      <div className="flex p-3 gap-2 min-w-max justify-center">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          
          let baseClasses = "flex items-center gap-2 px-4 py-2 rounded font-bold text-xs md:text-sm transition-all duration-150 transform active:scale-95 border-t border-b-2 border-x shadow-md cursor-pointer whitespace-nowrap";
          let colorClasses = "";

          if (item.style === 'red') {
             colorClasses = isActive 
                ? "bg-gradient-to-b from-red-600 to-red-800 border-t-red-500 border-x-red-700 border-b-red-900 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)] translate-y-[1px] border-b"
                : "bg-gradient-to-b from-slate-100 to-slate-300 dark:from-slate-700 dark:to-slate-800 text-red-600 dark:text-red-400 border-t-white/20 border-x-black/10 border-b-black/30 hover:bg-red-50 dark:hover:bg-slate-700";
          } else if (item.style === 'green') {
             colorClasses = isActive
                ? "bg-gradient-to-b from-green-600 to-green-800 border-t-green-500 border-x-green-700 border-b-green-900 text-white shadow-[0_0_10px_rgba(22,163,74,0.5)] translate-y-[1px] border-b"
                : "bg-gradient-to-b from-slate-100 to-slate-300 dark:from-slate-700 dark:to-slate-800 text-green-600 dark:text-green-400 border-t-white/20 border-x-black/10 border-b-black/30 hover:bg-green-50 dark:hover:bg-slate-700";
          } else if (item.style === 'blue') {
             colorClasses = isActive
                ? "bg-gradient-to-b from-cyan-600 to-cyan-800 border-t-cyan-500 border-x-cyan-700 border-b-cyan-900 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)] translate-y-[1px] border-b"
                : "bg-gradient-to-b from-slate-100 to-slate-300 dark:from-slate-700 dark:to-slate-800 text-cyan-600 dark:text-cyan-400 border-t-white/20 border-x-black/10 border-b-black/30 hover:bg-cyan-50 dark:hover:bg-slate-700";
          } else {
             colorClasses = isActive
                ? "bg-gradient-to-b from-blue-600 to-blue-800 border-t-blue-500 border-x-blue-700 border-b-blue-900 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] translate-y-[1px] border-b"
                : "bg-gradient-to-b from-slate-100 to-slate-300 dark:from-slate-700 dark:to-slate-800 text-slate-700 dark:text-slate-300 border-t-white/20 border-x-black/10 border-b-black/30 hover:brightness-110";
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`${baseClasses} ${colorClasses}`}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
