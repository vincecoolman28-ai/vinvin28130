
import React, { useState } from 'react';
import { drhData, keyDrhContacts, drhOrientations } from '../../data';

const DrhView: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleLegendClick = (code: string) => {
    if (search === code) {
      setSearch('');
    } else {
      setSearch(code);
    }
  };

  const filteredSections = drhData.map(section => ({
    ...section,
    contacts: section.contacts.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.role && c.role.toLowerCase().includes(search.toLowerCase())) ||
      section.title.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(section => section.contacts.length > 0);

  const legendItems = [
    { code: 'SPE MED', label: 'Spécialités Médicales', color: 'bg-blue-600' },
    { code: 'SPE CHIR', label: 'Spécialités Chirurgicales', color: 'bg-green-600' },
    { code: 'MAGUP', label: 'Maternité - Gynéco - Uro - Plastique', color: 'bg-pink-600' },
    { code: 'CNVM', label: 'Cardio - Neuro - Vasc. - Métabolique', color: 'bg-red-600' },
    { code: 'D2P', label: 'Direction des Parcours Patients', color: 'bg-purple-600' },
    { code: 'MT', label: 'Médico-Technique', color: 'bg-indigo-600' },
    { code: 'QP', label: 'Qualité - Pharmacie', color: 'bg-yellow-600' },
    { code: 'FCT SUPP', label: 'Fonctions supports', color: 'bg-gray-500' },
    { code: 'CMT', label: 'Centre de santé Marie Thérèse', color: 'bg-cyan-600' },
    { code: 'IFSI', label: 'Institut de Formation en Soins Infirmiers', color: 'bg-teal-600' },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-12 px-4">
      <h2 className="text-3xl font-black text-red-500 mb-8 text-center uppercase tracking-tighter">
        <i className="fa-solid fa-folder-user mr-3"></i> Annuaire des Services DRH
      </h2>

      {/* Dispatching des Appels - Orientation Cards */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-hpsj-blue mb-6 text-center flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-hpsj-blue/30"></span>
            Dispatching des Appels - Standard
            <span className="h-px w-12 bg-hpsj-blue/30"></span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drhOrientations.map((item, idx) => (
                <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl hover:border-hpsj-cyan/50 transition-all group">
                    <div className="bg-hpsj-cyan/10 p-4 flex items-center gap-3 border-b border-slate-700">
                        <div className="w-10 h-10 rounded-lg bg-hpsj-cyan/20 flex items-center justify-center text-hpsj-cyan group-hover:scale-110 transition-transform">
                            <i className={`fa-solid ${item.icon} text-xl`}></i>
                        </div>
                        <h4 className="font-bold text-hpsj-cyan text-sm uppercase tracking-wide leading-tight">{item.title}</h4>
                    </div>
                    <div className="p-5">
                        <p className="text-gray-300 text-sm mb-4 leading-relaxed">{item.description}</p>
                        
                        {item.list && (
                            <ul className="space-y-1 mb-4">
                                {item.list.map((li, lIdx) => (
                                    <li key={lIdx} className="text-xs text-gray-400 flex items-center gap-2">
                                        <i className="fa-solid fa-circle text-[4px] text-hpsj-cyan"></i>
                                        {li}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {item.subCases && (
                            <div className="mt-3 pt-3 border-t border-slate-700/50">
                                {item.subCases.map((sc, sIdx) => (
                                    <p key={sIdx} className="text-xs text-gray-400 italic leading-relaxed">{sc}</p>
                                ))}
                            </div>
                        )}

                        {item.action && (
                            <div className="mt-4">
                                <a 
                                    href={item.action.link} 
                                    className="block w-full py-2 px-4 bg-slate-900 border border-slate-700 rounded-lg text-hpsj-blue hover:text-white hover:bg-hpsj-blue/20 text-center font-bold text-sm transition-all"
                                >
                                    {item.action.label}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Key Contacts Box */}
      <div className="bg-red-900/10 border-l-4 border-red-500 p-8 rounded-r-2xl mb-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <h3 className="text-red-500 font-black mb-6 uppercase text-sm tracking-widest flex items-center gap-3">
            <i className="fa-solid fa-address-card text-xl"></i> Contacts Principaux DRH
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {keyDrhContacts.map((contact, idx) => (
                <div key={idx} className="flex flex-col border-b border-red-500/10 pb-3 last:border-0 md:last:border-b">
                    <span className="text-gray-200 font-bold text-lg leading-tight">{contact.name}</span>
                    <span className="text-gray-400 text-xs mt-1 italic">{contact.role}</span>
                    <span className="font-mono text-hpsj-cyan font-black text-lg mt-2">{contact.phone}</span>
                </div>
            ))}
        </div>
      </div>

      {/* Legend Section */}
      <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
                <h3 className="text-white font-bold uppercase text-xs tracking-[0.2em] flex items-center gap-2">
                    <i className="fa-solid fa-tags text-hpsj-cyan"></i> Groupe de services
                </h3>
                <p className="text-[10px] text-gray-500 mt-1 uppercase font-medium">Cliquez pour filtrer les gestionnaires</p>
            </div>
            {search && (
                <button 
                    onClick={() => setSearch('')}
                    className="text-xs text-red-400 hover:text-red-300 font-bold uppercase tracking-wider flex items-center gap-2"
                >
                    <i className="fa-solid fa-xmark"></i> Effacer le filtre
                </button>
            )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {legendItems.map((item, idx) => {
                const isActive = search === item.code;
                return (
                    <button 
                        key={idx} 
                        onClick={() => handleLegendClick(item.code)}
                        className={`
                            flex flex-col gap-2 p-3 rounded-xl border text-left transition-all duration-200 group
                            ${isActive 
                                ? 'bg-slate-700 border-white ring-2 ring-white/20 shadow-xl scale-105' 
                                : 'bg-slate-900 border-slate-700/50 hover:bg-slate-700 hover:border-slate-500'}
                        `}
                    >
                        <span className={`${item.color} text-white text-[10px] font-black px-2 py-0.5 rounded-full w-fit shadow-sm`}>
                            {item.code}
                        </span>
                        <span className={`text-[10px] leading-tight font-bold uppercase tracking-tighter ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <i className="fa-solid fa-magnifying-glass text-gray-500"></i>
        </div>
        <input 
            type="text" 
            placeholder="Rechercher un service, un nom, un numéro..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-4 text-white text-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all shadow-2xl"
            value={search}
            onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Accordion Grouped by Category */}
      <div className="space-y-12">
        {['Médical', 'PNM', 'Support'].map((cat) => {
          const sectionsInCat = filteredSections.filter(s => s.category === cat);
          if (sectionsInCat.length === 0) return null;

          return (
            <div key={cat} className="space-y-6">
              <h3 className="text-2xl font-black text-white border-b-2 border-slate-700 pb-2 flex items-center gap-3">
                <div className={`w-3 h-8 rounded-full ${cat === 'Médical' ? 'bg-red-500' : cat === 'PNM' ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                Pôle {cat}
              </h3>
              <div className="space-y-4">
                {sectionsInCat.map((section, idx) => {
                  const globalIdx = filteredSections.indexOf(section);
                  return (
                    <div key={globalIdx} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 hover:border-red-500/30 shadow-lg">
                      <button 
                        className={`w-full px-8 py-5 flex justify-between items-center text-left font-black transition-all ${activeIndex === globalIdx ? 'bg-red-600 text-white shadow-lg' : 'text-gray-200 hover:bg-slate-700'}`}
                        onClick={() => toggleAccordion(globalIdx)}
                      >
                        <span className="uppercase tracking-widest text-sm">{section.title}</span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${activeIndex === globalIdx ? 'bg-white/20 rotate-180' : 'bg-slate-700'}`}>
                          <i className="fa-solid fa-chevron-down text-xs"></i>
                        </div>
                      </button>
                      
                      {(activeIndex === globalIdx || search.length > 0) && (
                        <div className="bg-slate-900/40 p-6 space-y-3 border-t border-slate-700">
                          {section.contacts.map((contact, cIdx) => (
                            <div key={cIdx} className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-slate-700/50 rounded-xl hover:bg-slate-800 transition-all group ${contact.highlight ? 'bg-red-500/5 border-l-4 border-l-red-500' : 'bg-slate-800/30'}`}>
                              <div className="flex-1">
                                <h5 className={`font-black text-base ${contact.highlight ? 'text-red-400' : 'text-white'} group-hover:text-red-400 transition-colors`}>{contact.name}</h5>
                                <p className="text-gray-400 text-xs mt-1 font-medium uppercase tracking-tighter">{contact.role}</p>
                              </div>
                              {contact.phone && (
                                  <div className="mt-3 sm:mt-0 flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-lg border border-slate-700 group-hover:border-hpsj-cyan transition-all">
                                      <i className="fa-solid fa-phone text-hpsj-cyan text-xs"></i>
                                      <span className="font-mono text-hpsj-cyan font-black text-base tracking-wider">{contact.phone}</span>
                                  </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        
        {filteredSections.length === 0 && (
            <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
                <i className="fa-solid fa-face-frown text-4xl text-gray-600 mb-4"></i>
                <p className="text-gray-500 font-bold">Aucun résultat trouvé pour "{search}".</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default DrhView;
