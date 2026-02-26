import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Data from '../data';
import { planHospitalierData } from '../data_plan';
import { supabase } from '../services/supabaseClient';

interface SearchResult {
  category: string;
  label: string;
  description: string;
  path: string;
  id?: string;
}

const GlobalSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const [doctorsCache, setDoctorsCache] = useState<any[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
        try {
            const { data } = await supabase.from('doctors').select('*');
            if (data) setDoctorsCache(data);
        } catch (e) { console.error("Search fetch error", e); }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (isOpen) {
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const keywords = searchTerm.toLowerCase().split(/\s+/).filter(k => k.length > 0);

    if (keywords.length === 0) {
      setResults([]);
      return;
    }

    const newResults: SearchResult[] = [];

    const match = (textToSearch: string) => {
        const lowerText = textToSearch.toLowerCase();
        return keywords.every(kw => lowerText.includes(kw));
    };

    const add = (category: string, label: string, description: string, path: string, id?: string) => {
        newResults.push({ category, label, description, path, id });
    };

    // 0. ANNUAIRE MÉDICAL (Supabase)
    doctorsCache.forEach(doc => {
        const searchable = `${doc.nom} ${doc.prenom} ${doc.specialite} ${doc.lieu} ${doc.dect} medecin docteur`;
        if (match(searchable)) {
            add('Médecin', `${doc.nom} ${doc.prenom}`, `${doc.specialite} - ${doc.lieu} - Poste: ${doc.dect || 'N/A'}`, '/annuaire');
        }
    });

    // 1. CONTACTS PRINCIPAUX DRH (Nouveau focus)
    Data.keyDrhContacts.forEach(c => {
        const searchable = `${c.name} ${c.role} ${c.phone} drh principal direction rh responsable`;
        if (match(searchable)) {
            add('DRH (Principal)', c.name, `${c.role} - Tél: ${c.phone}`, '/drh');
        }
    });

    // 2. DRH - TOUTES LES SECTIONS
    Data.drhData.forEach(section => {
        section.contacts.forEach(c => {
            const searchable = `${c.name} ${c.role} ${c.phone} drh gestionnaire paie recrutement formation prevenant rh ${section.title}`;
            if (match(searchable)) {
                add('DRH', c.name, `${c.role} (${section.title}) - Tél: ${c.phone}`, '/drh');
            }
        });
    });

    // 3. GARDES & AVIS
    Data.guardsData.forEach(g => {
        const searchable = `${g.specialite} ${g.garde} ${g.avis} garde astreinte avis`;
        if (match(searchable)) {
            add('Gardes', g.specialite, `Garde: ${g.garde || 'N/A'} | Avis: ${g.avis || 'N/A'}`, '/gardes');
        }
    });

    // 4. CONSULTATIONS (Équipes)
    Data.consultationTeams.forEach(t => {
        const searchable = `${t.equipe} ${t.specialites} ${t.fonctions} ${t.numeros} consultation infirmiere aide soignante`;
        if (match(searchable)) {
            add('Consultations', t.equipe, `${t.fonctions} - ${t.specialites} (Tél: ${t.numeros})`, '/consultations');
        }
    });

    // 5. EXAMENS
    Data.examsData.forEach(e => {
        const searchable = `${e.nom} ${e.categorie} ${e.lieu} ${e.details} examen test imagerie radio labo`;
        if (match(searchable)) {
             add('Examens', e.nom, `${e.categorie} - ${e.lieu} (Tél: ${e.contact})`, '/examens');
        }
    });

    // 7. ENCADREMENT (Pôles)
    Data.encadrementData.forEach(e => {
        const searchable = `${e.nom} ${e.pole} ${e.perimetre} ${e.tel} cadre responsable pole coordonnateur manager`;
        if (match(searchable)) {
            add('Encadrement', e.nom, `${e.perimetre} - ${e.pole} (Tél: ${e.tel})`, '/encadrement');
        }
    });

    // 8. CHEFS DE SERVICE
    Data.chefsDeService.forEach(c => {
        const searchable = `${c.nom} ${c.service} ${c.pole} chef de service patron medecin chef`;
        if (match(searchable)) {
            add('Chefs de Service', c.nom, `Chef de : ${c.service}`, '/chefs');
        }
    });

    // 9. CADRES DE SANTÉ
    Data.cadresDeSante.forEach(c => {
        const searchable = `${c.nom} ${c.service} ${c.tel} cadre de sante ide infirmier surveillant`;
        if (match(searchable)) {
            add('Cadres de Santé', c.nom, `Cadre : ${c.service} (Tél: ${c.tel})`, '/cadres');
        }
    });

    // 10. NUMÉROS UTILES
    Data.usefulNumbers.forEach(cat => {
        cat.items.forEach(item => {
            const searchable = `${item.label} ${item.contact} ${item.num} urgence vital incendie securite informatique ce parking bulle`;
            if (match(searchable)) {
                add('N° Utiles', item.label, `${item.contact || ''} - Tél: ${item.num}`, '/utiles');
            }
        });
    });

    // 11. GPS / PORTES / SECRÉTARIATS
    Data.mapPoints.forEach(p => {
        const searchable = `${p.label} ${p.infoHtml} porte entree secretariat rdv plan`;
        if (match(searchable)) {
            add('Plan / Porte', p.label, `Infos accès et secrétariats détaillés`, '/plan', p.id);
        }
    });

    // 12. CENTRE LOSSERAND
    if (match("losserand entrée 5 orl gynéco sein dentaire biologie imagerie")) {
        add('Info Pratique', 'Centre Médical Losserand', 'Toutes les infos sur l\'Entrée 5 (Ex-Porte K)', '/losserand');
    }

    // 13. PLAN HOSPITALIER DÉTAILLÉ
    planHospitalierData.forEach(item => {
        const searchable = `${item.libelleUg} ${item.ua} ${item.ul} ${item.ug} ${item.pole} plan hospitalier unite service`;
        if (match(searchable)) {
            add('Plan Hospitalier', item.libelleUg, `${item.pole} - UL: ${item.ul} - UA: ${item.ua.substring(0, 50)}...`, '/plan-hospitalier');
        }
    });

    setResults(newResults.slice(0, 25)); // Augmenté pour plus de visibilité

  }, [searchTerm, doctorsCache]);

  const handleSelect = (result: SearchResult) => {
      if (result.path === '/plan' && result.id) {
          navigate(result.path);
      } else if (result.path === '/secretariats' && result.id) {
          navigate(result.path, { state: { activeId: result.id } });
      } else {
          navigate(result.path);
      }
      setIsOpen(false);
      setSearchTerm('');
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-hpsj-blue to-hpsj-cyan rounded-full shadow-[0_0_20px_rgba(0,229,255,0.6)] flex items-center justify-center text-slate-900 z-[101] hover:scale-110 transition-transform group border-2 border-white/20"
        title="Recherche Globale"
      >
        <i className="fa-solid fa-magnifying-glass text-3xl text-white group-hover:rotate-12 transition-transform drop-shadow-md"></i>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[200] flex items-start justify-center pt-20 p-4 animate-fade-in" onClick={() => setIsOpen(false)}>
            <div className="bg-slate-900 border border-hpsj-cyan/30 w-full max-w-2xl rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[85vh] animate-slide-up overflow-hidden" onClick={e => e.stopPropagation()}>
                
                {/* Header Recherche */}
                <div className="p-5 border-b border-slate-700 flex gap-4 items-center bg-slate-800">
                    <div className="w-10 h-10 rounded-full bg-hpsj-blue/20 flex items-center justify-center">
                        <i className="fa-solid fa-search text-hpsj-cyan text-xl"></i>
                    </div>
                    <input 
                        ref={inputRef}
                        type="text" 
                        placeholder="Rechercher (Ex: 'Alves', 'Paie', 'DRH', 'Stéphane')..." 
                        className="flex-grow bg-transparent border-none outline-none text-white text-xl placeholder-slate-500 font-bold"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <button onClick={() => setIsOpen(false)} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-white hover:bg-slate-700 rounded-full transition-all">
                        <i className="fa-solid fa-xmark text-2xl"></i>
                    </button>
                </div>
                
                {/* Liste des Résultats */}
                <div className="overflow-y-auto p-3 custom-scrollbar flex-grow bg-slate-950/40">
                    {results.length === 0 ? (
                        <div className="text-center py-20 text-slate-600 flex flex-col items-center">
                            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 opacity-20">
                                <i className="fa-solid fa-magnifying-glass text-5xl"></i>
                            </div>
                            <p className="text-lg font-bold uppercase tracking-widest">{searchTerm.length > 0 ? "Aucun résultat trouvé" : "Tapez pour explorer le Portail"}</p>
                            <p className="text-sm mt-2 font-medium opacity-50 italic">Index complet : DRH, Bips, Médecins, Gardes...</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {results.map((r, idx) => (
                                <div 
                                    key={idx}
                                    onClick={() => handleSelect(r)}
                                    className="p-4 bg-slate-800/50 hover:bg-slate-800 rounded-xl cursor-pointer group transition-all border border-slate-700/50 hover:border-hpsj-cyan/50 flex flex-col gap-1"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm group-hover:bg-opacity-80 transition-colors ${r.category.includes('DRH (Principal)') ? 'bg-red-600 text-white' : 'bg-slate-700 text-hpsj-cyan'}`}>
                                            {r.category}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-bold group-hover:text-slate-300 transition-colors uppercase tracking-tighter">
                                            Voir la page <i className="fa-solid fa-arrow-right ml-1"></i>
                                        </span>
                                    </div>
                                    <div className="font-black text-white text-lg leading-tight mt-1">{r.label}</div>
                                    <div className="text-sm text-gray-400 font-medium">{r.description}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Pied de recherche */}
                <div className="p-3 bg-slate-800 border-t border-slate-700 text-center flex justify-between items-center px-6">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                        {results.length} Résultat(s) pertinent(s)
                    </span>
                    <div className="flex gap-2">
                        <i className="fa-solid fa-shield-halved text-slate-600 text-xs"></i>
                    </div>
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default GlobalSearch;