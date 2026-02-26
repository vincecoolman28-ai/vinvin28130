import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { secretariatsData, mapPoints } from '../../data';

interface SecretariatsViewProps {
  initialActiveId?: string | null;
}

export const SecretariatsView: React.FC<SecretariatsViewProps> = ({ initialActiveId }) => {
  const [activeSecId, setActiveSecId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'individual' | 'global_consult' | 'global_hospi'>('individual');
  const navigate = useNavigate();
  const location = useLocation();

  // Handle external navigation (e.g. from "Qui fait quoi") via Router State OR Props
  useEffect(() => {
    // Priority to router state (navigation from another page)
    const state = location.state as { activeId?: string } | undefined;
    if (state && state.activeId) {
      setActiveSecId(state.activeId);
      setViewMode('individual');
      scrollToContent();
    } 
    // Fallback to prop
    else if (initialActiveId) {
      setActiveSecId(initialActiveId);
      setViewMode('individual');
      scrollToContent();
    }
  }, [initialActiveId, location]);

  const scrollToContent = () => {
    setTimeout(() => {
        const contentElement = document.getElementById('secretariat-content-display');
        if (contentElement) {
            contentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);
  };

  // URLs des images en ligne (Plans d'illustration)
  const MAP_IMAGES = {
    // Plan Consultations (Thumbnail API)
    CONSULTATIONS: "https://drive.google.com/thumbnail?id=1Gq-2yk6fV_c-D28_5QOobQH0tf0qyaGk&sz=w3000",
    // Plan Hospitalisations (Thumbnail API)
    HOSPITALISATIONS: "https://drive.google.com/thumbnail?id=1FPiccY0yOwmG-6rohwjL5A1fqBRk_enE&sz=w3000"
  };

  // Helper to aggregate data for the global plans
  // This extracts HTML content from all map points based on keywords
  const getGlobalPlanContent = (type: 'consultations' | 'hospitalisations') => {
    let content = '';
    const hospiKeywords = /HOSPITALISATIONS|HOSPI|CHIR ORTHOPÉDIQUE|GASTRO-ENTÉROLOGIE|UCA|CHIR DIGESTIVE|CHIR ORL|PROCTOLOGIE|CHIR MAXILLO-FACIALE|SUITE DE NAISSANCES|GROSSESSES À RISQUES|CHIR GYNÉCOLOGIQUE|NÉONATALOGIE|CHIR UROLOGIQUE|RÉANIMATION-USC|NEURO-VASCULAIRE|SOINS INTENSIFS|CHIR VASCULAIRE|ONCOLOGIE-THORACIQUE|MED INTERNE|PNEUMOLOGIE|RHUMATologie|BRANCARDAGE|CHAMBRE MORTUAIRE|SALLE DE NAISSANCE/i;
    const consultKeywords = /CONSULTATIONS|SECRÉTARIATS|SECRETAIRE|ACCUEIL|MAILS|PROGRAMMATION|RDV|EXAMEN|AGENT ACCUEIL/i;

    let pointsFound = 0;

    mapPoints.forEach(point => {
        let shouldInclude = false;

        if (type === 'consultations') {
             // Include if it explicitly mentions consultation keywords OR if it lacks specific hospitalization keywords
             // This ensures mixed points (Porte 2, Porte 10) show up in consultations too
             if (consultKeywords.test(point.infoHtml) || !hospiKeywords.test(point.infoHtml)) {
                 shouldInclude = true;
             }
        } else {
             // Include if it explicitly mentions hospitalization keywords
             if (hospiKeywords.test(point.infoHtml)) {
                 shouldInclude = true;
             }
        }

        if (shouldInclude) {
            pointsFound++;
            // Wrap in a card for readability
            content += `
              <div class="mb-8 bg-slate-800/50 p-6 rounded-lg border border-slate-700 shadow-md break-inside-avoid">
                <h3 class="text-xl font-bold text-hpsj-cyan mb-4 border-b border-slate-600 pb-2">${point.label}</h3>
                <div class="dynamic-content">
                  ${point.infoHtml}
                </div>
              </div>
            `;
        }
    });

    if (pointsFound === 0) {
        return `<div class="text-center p-8 text-gray-400">Aucune donnée trouvée pour ce plan.</div>`;
    }

    return content;
  };

  const handleGlobalClick = (mode: 'global_consult' | 'global_hospi') => {
      setViewMode(mode);
      setActiveSecId(null);
  }

  const handleIndividualClick = (id: string) => {
      setViewMode('individual');
      setActiveSecId(id);
  }

  const activeContentHtml = () => {
      if (viewMode === 'global_consult') return getGlobalPlanContent('consultations');
      if (viewMode === 'global_hospi') return getGlobalPlanContent('hospitalisations');
      // For individual, wrap it nicely too
      const secData = secretariatsData.find(s => s.id === activeSecId);
      if (secData) {
          return `
            <div class="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                ${secData.contentHtml}
            </div>
          `;
      }
      return '';
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, type: string) => {
    const target = e.target as HTMLImageElement;
    if (target.src.includes('placehold.co')) return;
    target.src = `https://placehold.co/600x400/1e293b/00aaff?text=${encodeURIComponent(type)}`;
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-hpsj-blue mb-10 text-center drop-shadow-[0_0_10px_rgba(0,170,255,0.3)]">
        <i className="fa-solid fa-headset mr-2"></i> Annuaire des Secrétariats & Plans
      </h2>
      
      {/* GLOBAL PLANS BUTTONS - HIGH VISIBILITY WITH THUMBNAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 px-4 md:px-20">
        <button 
          onClick={() => handleGlobalClick('global_consult')}
          className={`
            relative overflow-hidden group rounded-xl border-2 transition-all duration-300 p-0 flex flex-col items-center gap-0 h-64
            ${viewMode === 'global_consult' 
                ? 'bg-slate-800 border-hpsj-cyan shadow-[0_0_30px_rgba(0,229,255,0.4)] scale-[1.02]' 
                : 'bg-slate-900/80 border-slate-600 hover:border-hpsj-cyan hover:bg-slate-800'}
          `}
        >
             <div className="w-full h-48 overflow-hidden relative bg-white">
                <img 
                  src={MAP_IMAGES.CONSULTATIONS}
                  onError={(e) => handleImageError(e, "Plan Consultations")}
                  alt="Plan Consultations" 
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-50"></div>
             </div>
             
             <div className="flex-grow w-full p-4 flex flex-col items-center justify-center z-10 bg-slate-900">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-hpsj-cyan text-hpsj-cyan flex items-center justify-center shadow-lg">
                        <i className="fa-solid fa-clipboard-list text-lg"></i>
                    </div>
                    <div className="text-left">
                        <span className="text-lg font-bold text-white uppercase tracking-wider block leading-tight">Plan des Consultations</span>
                        <span className="text-xs text-gray-400">Vue Globale (Porte par Porte)</span>
                    </div>
                </div>
             </div>
             
             {viewMode === 'global_consult' && (
               <div className="absolute top-2 right-2 text-hpsj-cyan animate-pulse bg-black/50 rounded-full p-1">
                 <i className="fa-solid fa-circle-check text-2xl"></i>
               </div>
             )}
        </button>

        <button 
          onClick={() => handleGlobalClick('global_hospi')}
           className={`
            relative overflow-hidden group rounded-xl border-2 transition-all duration-300 p-0 flex flex-col items-center gap-0 h-64
            ${viewMode === 'global_hospi' 
                ? 'bg-slate-800 border-hpsj-blue shadow-[0_0_30px_rgba(0,170,255,0.4)] scale-[1.02]' 
                : 'bg-slate-900/80 border-slate-600 hover:border-hpsj-blue hover:bg-slate-800'}
          `}
        >
             <div className="w-full h-48 overflow-hidden relative bg-white">
                <img 
                  src={MAP_IMAGES.HOSPITALISATIONS}
                  onError={(e) => handleImageError(e, "Plan Hospitalisations")}
                  alt="Plan Hospitalisations" 
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-50"></div>
             </div>

             <div className="flex-grow w-full p-4 flex flex-col items-center justify-center z-10 bg-slate-900">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-hpsj-blue text-hpsj-blue flex items-center justify-center shadow-lg">
                        <i className="fa-solid fa-bed-pulse text-lg"></i>
                    </div>
                    <div className="text-left">
                        <span className="text-lg font-bold text-white uppercase tracking-wider block leading-tight">Plan des Hospitalisations</span>
                        <span className="text-xs text-gray-400">Vue Globale (Tous les services)</span>
                    </div>
                </div>
             </div>

             {viewMode === 'global_hospi' && (
               <div className="absolute top-2 right-2 text-hpsj-blue animate-pulse bg-black/50 rounded-full p-1">
                 <i className="fa-solid fa-circle-check text-2xl"></i>
               </div>
             )}
        </button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="h-px bg-slate-700 flex-grow"></div>
        <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">OU Accès Rapide par Porte</span>
        <div className="h-px bg-slate-700 flex-grow"></div>
      </div>

      {/* INDIVIDUAL BUTTONS */}
      <div className="flex flex-wrap gap-3 justify-center mb-10">
        {secretariatsData.map(sec => (
          <button
            key={sec.id}
            onClick={() => handleIndividualClick(sec.id)}
            className={`
              px-5 py-2.5 rounded-lg font-semibold text-sm transition-all border
              ${activeSecId === sec.id && viewMode === 'individual'
                ? 'bg-gradient-to-r from-hpsj-blue to-cyan-600 text-white border-transparent shadow-[0_0_15px_rgba(0,170,255,0.5)] transform -translate-y-1' 
                : 'bg-slate-800 text-gray-300 border-slate-700 hover:bg-slate-700 hover:border-gray-500'}
            `}
          >
            {sec.name}
          </button>
        ))}
      </div>

      {/* CONTENT DISPLAY */}
      <div 
        id="secretariat-content-display"
        className={`
        bg-[#1e293b] border border-slate-600 rounded-xl p-8 min-h-[500px] shadow-2xl transition-all duration-500
        ${(activeSecId || viewMode !== 'individual') ? 'opacity-100 translate-y-0' : 'opacity-95 translate-y-1'}
      `}>
        {(activeSecId || viewMode !== 'individual') ? (
          <div className="animate-fade-in">
             <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
               <h3 className="text-2xl font-bold text-white">
                 {viewMode === 'global_consult' && 'Vue Globale : Consultations'}
                 {viewMode === 'global_hospi' && 'Vue Globale : Hospitalisations'}
                 {viewMode === 'individual' && secretariatsData.find(s => s.id === activeSecId)?.name}
               </h3>
               {viewMode === 'individual' && (
                 <span className="text-xs bg-hpsj-blue text-white px-2 py-1 rounded">Vue Détail</span>
               )}
               {viewMode !== 'individual' && (
                 <span className="text-xs bg-hpsj-cyan text-slate-900 font-bold px-2 py-1 rounded">Vue Globale</span>
               )}
             </div>
             
             <div 
               className="prose prose-invert prose-lg max-w-none text-white marker:text-hpsj-cyan"
               dangerouslySetInnerHTML={{ __html: activeContentHtml() }} 
             />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 italic p-10 min-h-[400px]">
            <i className="fa-solid fa-layer-group text-6xl mb-6 opacity-30 text-hpsj-cyan"></i>
            <p className="text-xl font-medium">Veuillez sélectionner une vue ci-dessus.</p>
            <p className="text-sm mt-2">Cliquez sur "Plan des Consultations" ou "Plan des Hospitalisations" pour tout voir.</p>
          </div>
        )}
      </div>
    </div>
  );
};