import React, { useState, useMemo } from 'react';
import * as Data from '../../data';

interface DirectoryEntry {
  category: 'SERVICE' | 'CONSULT' | 'MANAGEMENT' | 'DRH' | 'URG';
  label: string;
  subLabel?: string;
  phone: string;
  location?: string;
  extra?: string;
}

const GlobalDirectoryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'URG' | 'SERVICE' | 'MANAGEMENT'>('ALL');

  // Agrégation de toutes les données disponibles
  const masterData = useMemo(() => {
    const entries: DirectoryEntry[] = [];

    // 1. Urgences (Useful numbers)
    Data.usefulNumbers.find(c => c.title === 'Urgences')?.items.forEach(item => {
      entries.push({ category: 'URG', label: item.label, subLabel: item.contact, phone: item.num });
    });

    // 3. Équipes consultations
    Data.consultationTeams.forEach(t => {
      entries.push({ 
        category: 'CONSULT', 
        label: t.equipe, 
        subLabel: t.specialites, 
        phone: t.numeros, 
        location: t.localisation,
        extra: t.fonctions
      });
    });

    // 4. Encadrement (Cadres et Chefs)
    Data.encadrementData.forEach(e => {
      entries.push({ 
        category: 'MANAGEMENT', 
        label: e.nom, 
        subLabel: e.perimetre, 
        phone: e.tel, 
        location: e.localisation,
        extra: e.pole
      });
    });

    // 5. DRH
    Data.keyDrhContacts.forEach(c => {
      entries.push({ category: 'DRH', label: c.name, subLabel: c.role, phone: c.phone || '' });
    });

    return entries;
  }, []);

  const filteredEntries = masterData.filter(entry => {
    const matchesSearch = 
      entry.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.subLabel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.phone.includes(searchTerm) ||
      entry.extra?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'ALL' || 
      (filter === 'URG' && entry.category === 'URG') ||
      (filter === 'SERVICE' && entry.category === 'CONSULT') ||
      (filter === 'MANAGEMENT' && entry.category === 'MANAGEMENT');

    return matchesSearch && matchesFilter;
  });

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'URG': return 'bg-red-600 text-white';
      case 'SERVICE': return 'bg-blue-600 text-white';
      case 'CONSULT': return 'bg-cyan-600 text-white';
      case 'MANAGEMENT': return 'bg-indigo-600 text-white';
      case 'DRH': return 'bg-pink-600 text-white';
      default: return 'bg-slate-600 text-white';
    }
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-20 px-2">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black text-hpsj-blue mb-2 flex items-center justify-center gap-4">
          <i className="fa-solid fa-phone-flip animate-bounce"></i> 
          ANNUAIRE GLOBAL
        </h2>
        <p className="text-gray-400 text-sm tracking-widest uppercase">Centralisation des Bips, Postes et Services HPSJ</p>
      </div>

      {/* Barre de recherche massive */}
      <div className="bg-slate-800 p-6 rounded-2xl border-2 border-slate-700 shadow-2xl mb-8">
        <div className="relative mb-6">
          <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-hpsj-cyan text-xl"></i>
          <input 
            type="text" 
            placeholder="Tapez un nom, un service, un numéro ou une fonction..." 
            className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white text-lg focus:border-hpsj-cyan outline-none shadow-inner transition-all"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { id: 'ALL', label: 'Tout voir', icon: 'fa-list' },
            { id: 'URG', label: 'Urgences', icon: 'fa-triangle-exclamation' },
            { id: 'SERVICE', label: 'Services & Consultations', icon: 'fa-hospital' },
            { id: 'MANAGEMENT', label: 'Cadres & Chefs', icon: 'fa-user-tie' },
          ].map(f => (
            <button 
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all border-2 ${filter === f.id ? 'bg-hpsj-cyan text-slate-900 border-white shadow-lg scale-105' : 'bg-slate-700 text-gray-400 border-transparent hover:bg-slate-600'}`}
            >
              <i className={`fa-solid ${f.icon}`}></i> {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Résultats sous forme de cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry, idx) => (
            <div key={idx} className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl overflow-hidden hover:border-hpsj-blue transition-all group shadow-lg hover:-translate-y-1">
              <div className="flex justify-between items-start p-4">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-sm ${getCategoryColor(entry.category)}`}>
                  {entry.category}
                </span>
                {entry.extra && <span className="text-[10px] text-gray-500 font-mono">{entry.extra}</span>}
              </div>
              
              <div className="px-4 pb-2">
                <h4 className="text-white font-bold text-lg leading-tight group-hover:text-hpsj-cyan transition-colors">{entry.label}</h4>
                <p className="text-xs text-gray-400 mt-1 italic">{entry.subLabel}</p>
                {entry.location && (
                  <div className="mt-2 text-[10px] text-hpsj-cyan flex items-center gap-1">
                    <i className="fa-solid fa-location-dot"></i> {entry.location}
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-900/50 mt-2 flex items-center justify-between border-t border-slate-700">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Poste / Bip</span>
                  <span className="text-2xl font-black text-yellow-500 font-mono tracking-tighter">{entry.phone}</span>
                </div>
                <a 
                  href={`tel:${entry.phone}`}
                  className="w-12 h-12 bg-hpsj-blue rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-90 transition-transform"
                >
                  <i className="fa-solid fa-phone"></i>
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <i className="fa-solid fa-magnifying-glass text-6xl text-slate-700 mb-4 opacity-20"></i>
            <p className="text-gray-500 font-bold uppercase tracking-widest">Aucun contact ne correspond à votre recherche</p>
          </div>
        )}
      </div>

      {/* Footer informatif */}
      <div className="mt-12 p-6 bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-2xl text-center">
        <p className="text-xs text-gray-500 italic">
          Cette base de données regroupe {masterData.length} contacts officiels. <br/>
          Pour toute mise à jour, merci de contacter le secrétariat de direction.
        </p>
      </div>
    </div>
  );
};

export default GlobalDirectoryView;