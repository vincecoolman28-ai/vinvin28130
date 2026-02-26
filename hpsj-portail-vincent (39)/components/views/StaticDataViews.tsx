
import React, { useState } from 'react';
import { 
  guardsData, 
  consultationTeams, 
  usefulNumbers, 
  encadrementData, 
  servicesData, 
  chefsDeService, 
  cadresDeSante 
} from '../../data';

// --- Guards View ---
export const GuardsView: React.FC = () => {
  const [search, setSearch] = useState('');

  // Filtres rapides pour les gardes
  const quickFilters = [
    { label: 'Anesthésie', icon: 'fa-syringe' },
    { label: 'Cardiologie', icon: 'fa-heart-pulse' },
    { label: 'Chirurgie', icon: 'fa-scalpel' },
    { label: 'Réanimation', icon: 'fa-bed-pulse' },
    { label: 'Urgence', icon: 'fa-truck-medical' },
  ];

  const handleFilter = (term: string) => {
    if (search === term) setSearch('');
    else setSearch(term);
  };

  const filtered = guardsData.filter(g => 
    g.specialite.toLowerCase().includes(search.toLowerCase()) || 
    g.garde.includes(search)
  );

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-hpsj-blue mb-6 text-center"><i className="fa-solid fa-moon mr-2"></i> Gardes et Avis</h2>
      
      {/* Quick Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {quickFilters.map((f, idx) => (
            <button
                key={idx}
                onClick={() => handleFilter(f.label)}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-full border border-slate-600 text-sm font-bold transition-all
                    ${search === f.label ? 'bg-hpsj-blue text-white shadow-lg scale-105' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}
                `}
            >
                <i className={`fa-solid ${f.icon}`}></i> {f.label}
            </button>
        ))}
      </div>

      <input type="text" placeholder="Rechercher une spécialité..." className="w-full max-w-lg mx-auto block bg-slate-800 border border-slate-600 rounded px-4 py-2 text-white mb-6" value={search} onChange={e => setSearch(e.target.value)} />
      
      <div className="overflow-x-auto rounded border border-slate-700">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-slate-800 text-hpsj-cyan uppercase">
            <tr><th className="p-3">Spécialité</th><th className="p-3">Garde</th><th className="p-3">Avis</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-700 bg-slate-900/50">
            {filtered.map((g, i) => (
              <tr key={i} className="hover:bg-slate-800">
                <td className="p-3 font-semibold text-white">{g.specialite}</td>
                <td className="p-3 font-mono text-yellow-500">{g.garde}</td>
                <td className="p-3 font-mono">{g.avis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Consultation Teams View ---
export const ConsultationView: React.FC = () => {
  const [search, setSearch] = useState('');
  const filtered = consultationTeams.filter(t => 
    t.equipe.toLowerCase().includes(search.toLowerCase()) || 
    t.specialites.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-hpsj-blue mb-6 text-center"><i className="fa-solid fa-clipboard-user mr-2"></i> Équipe Consultations</h2>
      <input type="text" placeholder="Rechercher un nom, une fonction..." className="w-full max-w-lg mx-auto block bg-slate-800 border border-slate-600 rounded px-4 py-2 text-white mb-6" onChange={e => setSearch(e.target.value)} />
      <div className="overflow-x-auto rounded border border-slate-700">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-slate-800 text-hpsj-cyan uppercase">
            <tr><th className="p-3">Équipe</th><th className="p-3">Fonction</th><th className="p-3">Numéros</th><th className="p-3">Spécialités</th><th className="p-3">Loc.</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-700 bg-slate-900/50">
            {filtered.map((t, i) => (
              <tr key={i} className={`hover:bg-slate-800 ${t.type === 'service-orl' ? 'bg-blue-900/20' : t.type === 'service-chir-ext' ? 'bg-orange-900/20' : ''}`}>
                <td className="p-3 font-semibold text-white">{t.equipe}</td>
                <td className="p-3">{t.fonctions}</td>
                <td className="p-3 font-mono text-yellow-500">{t.numeros}</td>
                <td className="p-3">{t.specialites}</td>
                <td className="p-3">{t.localisation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Useful Numbers View ---
export const UsefulNumbersView: React.FC = () => {
  const [search, setSearch] = useState('');
  
  const filteredCategories = usefulNumbers.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.label.toLowerCase().includes(search.toLowerCase()) || 
      (item.contact && item.contact.toLowerCase().includes(search.toLowerCase()))
    )
  })).filter(cat => cat.items.length > 0);

  // Fonction utilitaire pour récupérer les classes de couleur
  const getColorClasses = (theme?: string) => {
    switch(theme) {
        case 'red': return {
            border: 'border-red-500', 
            icon: 'text-red-500',
            bg: 'bg-red-500/10', 
            headerText: 'text-red-400'
        };
        case 'orange': return {
            border: 'border-orange-500', 
            icon: 'text-orange-500',
            bg: 'bg-orange-500/10', 
            headerText: 'text-orange-400'
        };
        case 'purple': return {
            border: 'border-purple-500', 
            icon: 'text-purple-500',
            bg: 'bg-purple-500/10', 
            headerText: 'text-purple-400'
        };
        case 'teal': return {
            border: 'border-teal-500', 
            icon: 'text-teal-500',
            bg: 'bg-teal-500/10', 
            headerText: 'text-teal-400'
        };
        default: return {
            border: 'border-slate-600', 
            icon: 'text-blue-500',
            bg: 'bg-slate-800', 
            headerText: 'text-blue-400'
        };
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-hpsj-cyan mb-8 text-center"><i className="fa-solid fa-star-of-life mr-2"></i> Numéros Utiles</h2>
      
      {/* VITAL SHORTCUTS (Top Cards like DRH) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-red-600 text-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center text-center transform hover:scale-105 transition-all">
            <i className="fa-solid fa-fire text-3xl mb-2"></i>
            <span className="text-xs uppercase font-bold">Incendie</span>
            <span className="text-2xl font-extrabold mt-1">10</span>
        </div>
        <div className="bg-blue-600 text-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center text-center transform hover:scale-105 transition-all">
            <i className="fa-solid fa-bed-pulse text-3xl mb-2"></i>
            <span className="text-xs uppercase font-bold">Réa Garde</span>
            <span className="text-2xl font-extrabold mt-1">69 91</span>
        </div>
        <div className="bg-orange-500 text-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center text-center transform hover:scale-105 transition-all">
            <i className="fa-solid fa-user-shield text-3xl mb-2"></i>
            <span className="text-xs uppercase font-bold">Sécurité</span>
            <span className="text-2xl font-extrabold mt-1">14</span>
        </div>
        <div className="bg-green-600 text-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center text-center transform hover:scale-105 transition-all">
            <i className="fa-solid fa-bed-stretcher text-3xl mb-2"></i>
            <span className="text-xs uppercase font-bold">Brancardage</span>
            <span className="text-2xl font-extrabold mt-1">77 38</span>
        </div>
      </div>

      <input type="text" placeholder="Rechercher..." className="w-full max-w-lg mx-auto block bg-slate-800 border border-slate-600 rounded px-4 py-2 text-white mb-6" onChange={e => setSearch(e.target.value)} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCategories.map((cat, i) => {
          const colors = getColorClasses(cat.colorTheme);
          return (
            <div key={i} className={`bg-slate-900 border ${colors.border} rounded-lg overflow-hidden shadow-lg transition-transform hover:-translate-y-1`}>
               <div className={`p-4 border-b border-slate-700/50 ${colors.bg}`}>
                 <h3 className={`text-xl font-bold ${colors.headerText} flex items-center gap-3`}>
                   <div className={`w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-700 shadow-sm`}>
                      <i className={`fa-solid ${cat.icon} ${colors.icon}`}></i>
                   </div>
                   {cat.title}
                 </h3>
               </div>
               
               <div className="p-4">
                 <table className="w-full text-sm">
                   <tbody className="divide-y divide-slate-800">
                     {cat.items.map((item, idx) => (
                       <tr key={idx} className="hover:bg-slate-800/50 transition-colors group">
                         <td className="py-3 pl-2 text-gray-300 flex items-center gap-3">
                            <i className={`fa-solid ${item.itemIcon || 'fa-phone'} w-5 text-center text-gray-400 group-hover:text-white transition-colors`}></i>
                            {item.label}
                         </td>
                         {item.contact && <td className="py-3 text-gray-300 italic text-xs hidden sm:table-cell">{item.contact}</td>}
                         <td className="py-3 pr-2 text-right font-mono text-white font-bold tracking-wider">{item.num}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Encadrement View ---
export const EncadrementView: React.FC = () => {
  const [search, setSearch] = useState('');
  const filtered = encadrementData.filter(e => 
    e.nom.toLowerCase().includes(search.toLowerCase()) || 
    e.pole.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-hpsj-blue mb-6 text-center"><i className="fa-solid fa-users-gear mr-2"></i> Encadrement & Responsables</h2>
      <input type="text" placeholder="Rechercher..." className="w-full max-w-lg mx-auto block bg-slate-800 border border-slate-600 rounded px-4 py-2 text-white mb-6" onChange={e => setSearch(e.target.value)} />
      <div className="overflow-x-auto rounded border border-slate-700">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-slate-800 text-hpsj-cyan uppercase">
            <tr><th className="p-3">Pôle/Direction</th><th className="p-3">Nom</th><th className="p-3">Périmètre</th><th className="p-3">Tél</th><th className="p-3">Loc.</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-700 bg-slate-900/50">
            {filtered.map((e, i) => (
              <tr key={i} className={`hover:bg-slate-800 ${e.isLeader ? 'bg-blue-900/20' : ''}`}>
                <td className="p-3 text-gray-400">{e.pole}</td>
                <td className={`p-3 font-semibold ${e.isLeader ? 'text-hpsj-blue' : 'text-white'}`}>{e.nom}</td>
                <td className="p-3">{e.perimetre}</td>
                <td className="p-3 font-mono">{e.tel}</td>
                <td className="p-3 text-xs">{e.localisation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Chefs de Service View ---
export const ChefsView: React.FC = () => {
  const [search, setSearch] = useState('');
  const filtered = chefsDeService.filter(c => c.nom.toLowerCase().includes(search.toLowerCase()) || c.service.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-hpsj-blue mb-6 text-center"><i className="fa-solid fa-medal mr-2"></i> Chefs de Service</h2>
      <input type="text" placeholder="Rechercher..." className="w-full max-w-lg mx-auto block bg-slate-800 border border-slate-600 rounded px-4 py-2 text-white mb-6" onChange={e => setSearch(e.target.value)} />
      <div className="overflow-x-auto rounded border border-slate-700">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-slate-800 text-hpsj-cyan uppercase">
             <tr><th className="p-3">Pôle</th><th className="p-3">Service</th><th className="p-3">Titre</th><th className="p-3">Nom</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-700 bg-slate-900/50">
            {filtered.map((c, i) => (
              <tr key={i} className="hover:bg-slate-800">
                <td className="p-3 text-gray-400">{c.pole}</td>
                <td className="p-3 text-white">{c.service}</td>
                <td className="p-3 italic text-gray-400">{c.titre}</td>
                <td className="p-3 font-bold text-hpsj-blue">{c.nom}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Cadres de Santé View ---
export const CadresView: React.FC = () => {
  const [search, setSearch] = useState('');
  const filtered = cadresDeSante.filter(c => c.nom.toLowerCase().includes(search.toLowerCase()) || c.service.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-hpsj-blue mb-6 text-center"><i className="fa-solid fa-id-card-clip mr-2"></i> Cadres de Santé</h2>
      <input type="text" placeholder="Rechercher..." className="w-full max-w-lg mx-auto block bg-slate-800 border border-slate-600 rounded px-4 py-2 text-white mb-6" onChange={e => setSearch(e.target.value)} />
      <div className="overflow-x-auto rounded border border-slate-700">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-slate-800 text-hpsj-cyan uppercase">
             <tr><th className="p-3">Pôle</th><th className="p-3">Service</th><th className="p-3">Titre</th><th className="p-3">Nom</th><th className="p-3">Tél</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-700 bg-slate-900/50">
            {filtered.map((c, i) => (
              <tr key={i} className="hover:bg-slate-800">
                <td className="p-3 text-gray-400">{c.pole}</td>
                <td className="p-3 text-white">{c.service}</td>
                <td className="p-3 italic text-gray-400">{c.titre}</td>
                <td className="p-3 font-bold text-white">{c.nom}</td>
                <td className="p-3 font-mono">{c.tel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Services / Postes de Soins View ---
export const ServicesView: React.FC = () => {
  const [search, setSearch] = useState('');
  const filtered = servicesData.filter(s => 
    s.service.toLowerCase().includes(search.toLowerCase()) || 
    s.code.toLowerCase().includes(search.toLowerCase()) ||
    s.batiment.toLowerCase().includes(search.toLowerCase()) ||
    s.tel.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-hpsj-blue mb-6 text-center"><i className="fa-solid fa-hospital-user mr-2"></i> Services / Postes de soins</h2>
      <input type="text" placeholder="Rechercher un service, un code, un bâtiment..." className="w-full max-w-lg mx-auto block bg-slate-800 border border-slate-600 rounded px-4 py-2 text-white mb-6" onChange={e => setSearch(e.target.value)} />
      <div className="overflow-x-auto rounded border border-slate-700">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-slate-800 text-hpsj-cyan uppercase">
            <tr>
              <th className="p-3">Code</th>
              <th className="p-3">Service</th>
              <th className="p-3">Porte</th>
              <th className="p-3">Niveau</th>
              <th className="p-3">Bâtiment</th>
              <th className="p-3">N° Tél</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 bg-slate-900/50">
            {filtered.map((s, i) => (
              <tr key={i} className="hover:bg-slate-800">
                <td className="p-3 font-mono text-gray-400">{s.code}</td>
                <td className="p-3 font-semibold text-white">{s.service}</td>
                <td className="p-3">{s.porte}</td>
                <td className="p-3">{s.niveau}</td>
                <td className="p-3">{s.batiment}</td>
                <td className="p-3 font-mono text-yellow-500">{s.tel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Centre Losserand View ---
export const LosserandView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Données structurées pour le filtrage
  const services = [
    { id: 1, level: 0, title: "Biologie / Prélèvements", icon: "fa-microscope", hours: "Lun-Ven: 7h-18h | Sam: 7h30-12h30", access: "3", status: "OUVERT", type: "labo" },
    { id: 2, level: 0, title: "Dentaire & Implantologie", icon: "fa-tooth", hours: "8h - 18h30", access: "4", status: "OUVERT", type: "dentaire" },
    { id: 3, level: 0, title: "Consultations ORL & CMF", icon: "fa-ear-listen", hours: "8h - 18h", access: "5", status: "OUVERT", type: "consultation" },
    { id: 4, level: -1, title: "Mammographie", icon: "fa-ribbon", hours: "8h - 18h", access: "5", status: "Ouvert", type: "imagerie" },
    { id: 5, level: -1, title: "Imagerie (Scanner/IRM)", icon: "fa-x-ray", hours: "IRM: 8h-20h | Scan: 8h-18h", access: "5", status: "Opérationnel", type: "imagerie" },
    { id: 6, level: -1, title: "Gynéco & Centre Sein", icon: "fa-venus", hours: "8h - 18h", access: "5", status: "Opérationnel", type: "consultation" },
    { id: 7, level: -1, title: "Centre Endométriose", icon: "fa-staff-snake", hours: "8h - 18h", access: "5", status: "Opérationnel", type: "consultation" }
  ];

  const quickFilters = [
      { label: 'Consultation', icon: 'fa-user-doctor', style: 'border-blue-500 text-blue-500 hover:bg-blue-500' },
      { label: 'Imagerie', icon: 'fa-x-ray', style: 'border-indigo-500 text-indigo-500 hover:bg-indigo-500' },
      { label: 'Laboratoire', icon: 'fa-flask', style: 'border-teal-500 text-teal-500 hover:bg-teal-500' },
      { label: 'Dentaire', icon: 'fa-tooth', style: 'border-cyan-500 text-cyan-500 hover:bg-cyan-500' },
      { label: 'Gynéco & Sein', icon: 'fa-venus', style: 'border-pink-500 text-pink-500 hover:bg-pink-500' },
  ];

  const gates = [
    { num: '1', desc: 'Hôpital Sainte-Marie', icon: 'fa-hospital' },
    { num: '2', desc: 'Urgences & Cité Hosp.', icon: 'fa-truck-medical' },
    { num: '3', desc: 'Centre Prélèvements', icon: 'fa-vial' },
    { num: '4', desc: 'Institut Implantologie', icon: 'fa-tooth' },
    { num: '5', desc: 'Consultations (ORL, Gynéco...)', icon: 'fa-person-circle-check', highlight: true }
  ];

  const handleGateClick = (gateNum: string) => {
      // Toggle : si on reclique sur la même porte, on annule le filtre
      if (searchTerm === gateNum) {
          setSearchTerm('');
      } else {
          setSearchTerm(gateNum);
          setActiveFilter(null);
      }
  };

  const handleFilterClick = (label: string) => {
      if (activeFilter === label) {
          setActiveFilter(null);
      } else {
          setActiveFilter(label);
          setSearchTerm(''); // On priorise le filtre par type sur la recherche textuelle
      }
  };

  // Logique de filtrage
  const filteredServices = services.filter(service => {
      // 1. Filtre par Chip (Type)
      if (activeFilter) {
          // Filtre spécial Gynéco/Sein/Endométriose
          if (activeFilter === 'Gynéco & Sein') {
              const t = service.title.toLowerCase();
              return t.includes('gynéco') || t.includes('sein') || t.includes('endométriose') || t.includes('mammographie');
          }

          if (activeFilter === 'Consultation' && service.type !== 'consultation') return false;
          if (activeFilter === 'Imagerie' && service.type !== 'imagerie') return false;
          if (activeFilter === 'Laboratoire' && service.type !== 'labo') return false;
          if (activeFilter === 'Dentaire' && service.type !== 'dentaire') return false;
      }

      // 2. Filtre par Recherche (Texte ou Numéro de porte via click)
      if (searchTerm) {
          // Si c'est un numéro de porte (ex: "5")
          if (/^\d+$/.test(searchTerm)) {
              return service.access === searchTerm;
          }
          // Sinon recherche textuelle
          const term = searchTerm.toLowerCase();
          return service.title.toLowerCase().includes(term) || 
                 service.hours.toLowerCase().includes(term) ||
                 service.access.includes(term);
      }

      return true;
  });

  const level0Services = filteredServices.filter(s => s.level === 0);
  const levelMinus1Services = filteredServices.filter(s => s.level === -1);

  return (
    <div className="animate-fade-in max-w-6xl mx-auto space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-4 rounded-lg shadow-lg text-center font-bold border-b-4 border-green-700 transform hover:scale-[1.01] transition-transform">
        <i className="fa-solid fa-check-circle mr-2"></i> MISE À JOUR : L'ENSEMBLE DES SERVICES EST DÉSORMAIS INSTALLÉ ET OPÉRATIONNEL.
      </div>

      {/* Header */}
      <div className="text-center p-8 bg-gradient-to-br from-blue-900 to-slate-900 rounded-2xl shadow-2xl border border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-hpsj-cyan to-transparent"></div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-hpsj-blue to-cyan-400 mb-2">
          Centre Médical LOSSERAND
        </h1>
        <p className="text-gray-400 text-sm uppercase tracking-widest">Ouverture Complète Confirmée</p>
      </div>

      {/* SEARCH & FILTERS SECTION */}
      <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Rechercher un service, une spécialité..." 
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-6 py-4 text-white text-lg focus:outline-none focus:border-hpsj-cyan shadow-inner"
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setActiveFilter(null);
            }}
          />

          <div className="flex flex-wrap gap-3 justify-center">
             {quickFilters.map((f, idx) => (
                 <button
                    key={idx}
                    onClick={() => handleFilterClick(f.label)}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-200 font-bold uppercase text-sm
                        ${f.style}
                        ${activeFilter === f.label 
                            ? 'bg-current text-white shadow-lg scale-105' 
                            : 'bg-slate-900/50 hover:text-white'}
                    `}
                 >
                     <i className={`fa-solid ${f.icon} ${activeFilter === f.label ? 'text-white' : ''}`}></i> 
                     <span className={activeFilter === f.label ? 'text-white' : ''}>{f.label}</span>
                 </button>
             ))}
              {(activeFilter || searchTerm) && (
                  <button 
                    onClick={() => { setActiveFilter(null); setSearchTerm(''); }}
                    className="text-red-400 hover:text-red-300 text-sm underline px-2"
                  >
                      Effacer les filtres
                  </button>
              )}
          </div>
      </div>

      {/* Alert Note */}
      <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-6 rounded-r-lg flex items-start gap-4 shadow-md">
        <div className="text-yellow-500 text-3xl"><i className="fa-solid fa-triangle-exclamation"></i></div>
        <div>
          <h3 className="text-yellow-500 font-bold uppercase text-sm mb-1">Avertissement Signalétique</h3>
          <p className="text-gray-300">
            Pour éviter toute erreur, utilisez le terme <strong className="text-white">« ENTRÉE »</strong> (accès rue) pour orienter les patients, et non « PORTE ».
          </p>
        </div>
      </div>

      {/* Niveau 0 */}
      {level0Services.length > 0 && (
        <section className="animate-slide-up">
            <h2 className="text-2xl font-bold text-hpsj-blue mb-4 border-b border-slate-700 pb-2 flex items-center">
            <i className="fa-solid fa-building mr-3"></i> Rez-de-chaussée haut (Niveau 0)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {level0Services.map((service) => (
                <div key={service.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-cyan-500/10 transition-all hover:-translate-y-1">
                    <h3 className="text-xl font-bold text-hpsj-cyan mb-4 flex items-center gap-2"><i className={`fa-solid ${service.icon}`}></i> {service.title}</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-center gap-2"><i className="fa-solid fa-clock text-hpsj-blue w-5 text-center"></i> {service.hours}</li>
                    <li className="flex items-center gap-2"><i className="fa-solid fa-layer-group text-hpsj-blue w-5 text-center"></i> Niveau 0 (RDC Haut)</li>
                    <li className="flex items-center gap-2 text-white bg-slate-700 p-2 rounded border-l-4 border-orange-500 w-full"><i className="fa-solid fa-map-signs text-orange-500"></i> Accès : ENTRÉE {service.access}</li>
                    </ul>
                    <div className="mt-4 text-center">
                    <span className="inline-block bg-green-600/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-600/50">SERVICE {service.status}</span>
                    </div>
                </div>
            ))}
            </div>
        </section>
      )}

      {/* Niveau -1 */}
      {levelMinus1Services.length > 0 && (
        <section className="animate-slide-up">
            <h2 className="text-2xl font-bold text-hpsj-blue mb-4 border-b border-slate-700 pb-2 flex items-center">
            <i className="fa-solid fa-building-user mr-3"></i> Rez-de-jardin (Niveau -1)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {levelMinus1Services.map((service) => (
                <div key={service.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg flex flex-col justify-between hover:shadow-cyan-500/10 transition-all hover:-translate-y-1">
                    <div>
                    <h3 className="text-lg font-bold text-hpsj-cyan mb-3 flex items-center gap-2"><i className={`fa-solid ${service.icon}`}></i> {service.title}</h3>
                    <div className="text-sm text-gray-300 mb-2 flex items-center gap-2"><i className="fa-solid fa-clock text-hpsj-blue"></i> {service.hours}</div>
                    <div className="text-xs text-gray-400 mb-3 flex items-center gap-2"><i className="fa-solid fa-map-pin text-orange-500"></i> Accès : ENTRÉE {service.access}</div>
                    </div>
                    <div className="text-center pt-3 border-t border-slate-700">
                    <span className="text-xs font-bold text-green-400 uppercase"><i className="fa-solid fa-check mr-1"></i> {service.status}</span>
                    </div>
                </div>
            ))}
            </div>
        </section>
      )}

      {/* Access Points - Clickable Filters */}
      <section>
        <h2 className="text-2xl font-bold text-hpsj-blue mb-6 border-b border-slate-700 pb-2 flex items-center justify-between">
          <span><i className="fa-solid fa-map-location-dot mr-3"></i> Accès Visiteurs (Filtres)</span>
          <span className="text-xs text-gray-500 font-normal normal-case hidden sm:inline">Cliquez sur une entrée pour filtrer les services</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {gates.map((gate, idx) => (
            <div 
                key={idx} 
                onClick={() => handleGateClick(gate.num)}
                className={`
                    p-4 rounded-xl border flex flex-col items-center text-center gap-3 transition-all cursor-pointer group
                    ${searchTerm === gate.num 
                        ? 'bg-slate-700 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)] scale-105' 
                        : 'bg-slate-800 border-slate-700 hover:border-gray-500 hover:bg-slate-750'}
                    ${gate.highlight && searchTerm !== gate.num ? 'border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.1)]' : ''}
                `}
            >
               <div className={`
                   w-12 h-12 rounded-full text-white flex items-center justify-center text-xl font-bold shadow-lg border-2 border-slate-900 transition-colors
                   ${searchTerm === gate.num ? 'bg-orange-500' : 'bg-gradient-to-br from-slate-600 to-slate-700 group-hover:from-orange-500 group-hover:to-red-600'}
               `}>
                 {gate.num}
               </div>
               <div className={`font-bold text-sm uppercase tracking-wide ${searchTerm === gate.num ? 'text-orange-400' : 'text-white'}`}>
                   ENTRÉE {gate.num}
               </div>
               <div className="text-xs text-gray-400 group-hover:text-white transition-colors">
                   <i className={`fa-solid ${gate.icon} mb-1 block text-lg text-hpsj-blue`}></i>
                   {gate.desc}
               </div>
               {searchTerm === gate.num && <div className="text-xs text-orange-500 font-bold mt-1">Filtre Actif</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Terminology Note */}
      <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl flex flex-col md:flex-row gap-6">
         <div className="flex-1 bg-slate-800/50 p-4 rounded border border-green-900/50">
            <h4 className="text-green-400 font-bold mb-2 flex items-center gap-2"><i className="fa-solid fa-arrow-right-to-bracket"></i> FLUX EXTERNE = « ENTRÉE »</h4>
            <p className="text-sm text-gray-400">Pour toute communication patient et l'orientation sur la voirie (Rue Raymond Losserand), utiliser exclusivement le terme « ENTRÉE » suivi du numéro.</p>
         </div>
         <div className="flex-1 bg-slate-800/50 p-4 rounded border border-yellow-900/50">
            <h4 className="text-yellow-500 font-bold mb-2 flex items-center gap-2"><i className="fa-solid fa-door-closed"></i> FLUX INTERNE = « PORTE »</h4>
            <p className="text-sm text-gray-400">La dénomination « PORTE » (ex: Porte H, Porte 10) est strictement réservée aux services internes.</p>
         </div>
      </div>

      <div className="text-center text-xs text-gray-500 italic border-t border-slate-800 pt-4">
        Document de référence : Statut Opérationnel - 26 novembre 2025
      </div>
    </div>
  );
};
