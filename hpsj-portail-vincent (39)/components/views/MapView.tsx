import React, { useState } from 'react';
import { mapPoints } from '../../data';
import { MapPoint } from '../../types';

const MapView: React.FC = () => {
  const [activePoint, setActivePoint] = useState<MapPoint | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPlanModal, setShowPlanModal] = useState<'consultations' | 'hospitalisations' | 'general' | null>(null);

  const filteredPoints = mapPoints.filter(p => 
    p.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.infoHtml.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const MAP_IMAGES = {
    GENERAL: "https://drive.google.com/thumbnail?id=1iKi-JsRwrgmzbZ9dFGWuTTu303HIZECQ&sz=w3000", 
    CONSULTATIONS: "https://drive.google.com/thumbnail?id=1Gq-2yk6fV_c-D28_5QOobQH0tf0qyaGk&sz=w3000",
    HOSPITALISATIONS: "https://drive.google.com/thumbnail?id=1FPiccY0yOwmG-6rohwjL5A1fqBRk_enE&sz=w3000"
  };

  const handleGPS = (label: string) => {
    let address = "185 Rue Raymond Losserand, 75014 Paris";
    if (label.includes("5")) address = "193 Rue Raymond Losserand, 75014 Paris";
    if (label.includes("Urgence")) address = "189 Rue Raymond Losserand, 75014 Paris";
    
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}&travelmode=walking`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col h-full animate-fade-in gap-4 pb-4 font-mono">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-black text-hpsj-cyan uppercase tracking-widest flex items-center justify-center gap-3">
          <i className="fa-solid fa-map-location-dot"></i>
          Annuaire des Secrétariats & Plans
        </h2>
      </div>

      {/* Sélecteurs de vue de plan */}
      <div className="flex flex-wrap justify-center gap-8 bg-slate-200 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-400 dark:border-slate-700 shadow-inner backdrop-blur-sm">
        <div onClick={() => setShowPlanModal('consultations')} className="group cursor-pointer flex flex-col items-center gap-1 text-center">
          <div className="w-48 h-32 bg-[#0f172a] rounded-xl border-2 border-slate-500 overflow-hidden relative shadow-lg group-hover:border-hpsj-blue group-hover:scale-105 transition-all duration-300">
             <img src={MAP_IMAGES.CONSULTATIONS} className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                <span className="text-[10px] text-white font-bold">AGRANDIR LE PLAN</span>
             </div>
          </div>
          <span className="text-slate-800 dark:text-white font-black text-sm uppercase mt-2">Plan des Consultations</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Vue Globale (Porte par Porte)</span>
          <span className="text-[10px] text-red-600 dark:text-red-500 font-black flex items-center gap-1.5 mt-1 animate-pulse">
            <i className="fa-solid fa-hand-pointer"></i> CLIQUE POUR AFFICHER LES INFOS
          </span>
        </div>

        <div onClick={() => setShowPlanModal('hospitalisations')} className="group cursor-pointer flex flex-col items-center gap-1 text-center">
          <div className="w-48 h-32 bg-[#0f172a] rounded-xl border-2 border-slate-500 overflow-hidden relative shadow-lg group-hover:border-hpsj-blue group-hover:scale-105 transition-all duration-300">
             <img src={MAP_IMAGES.HOSPITALISATIONS} className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                <span className="text-[10px] text-white font-bold">AGRANDIR LE PLAN</span>
             </div>
          </div>
          <span className="text-slate-800 dark:text-white font-black text-sm uppercase mt-2">Plan des Hospitalisations</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Vue Globale (Tous les services)</span>
          <span className="text-[10px] text-red-600 dark:text-red-500 font-black flex items-center gap-1.5 mt-1 animate-pulse">
            <i className="fa-solid fa-hand-pointer"></i> CLIQUE POUR AFFICHER LES INFOS
          </span>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 flex-grow">
        <div className="xl:w-1/2 bg-slate-800 rounded-lg border-2 border-slate-600 p-1 relative flex flex-col h-[600px] xl:h-auto overflow-hidden">
          <div className="flex justify-between items-center bg-slate-700 p-2 border-b border-slate-600 mb-1">
             <h2 className="text-sm font-bold text-hpsj-blue uppercase tracking-wider flex items-center">
                <i className="fa-solid fa-map mr-2"></i>Vue Schématique
             </h2>
          </div>
          <div className="flex-grow flex items-center justify-center bg-[#0f172a]">
            <img src={MAP_IMAGES.GENERAL} className="max-w-full max-h-full object-contain p-4" alt="Plan Général HPSJ" />
          </div>
        </div>

        <div className="xl:w-1/2 flex flex-col gap-4">
          <div className="bg-slate-800 border-2 border-slate-600 p-4 rounded shadow-lg">
            <input 
              type="text" 
              placeholder="RECHERCHER PORTE / SERVICE / NIVEAU..."
              className="w-full bg-slate-900 border border-slate-500 rounded p-3 text-white font-mono text-sm focus:border-hpsj-blue outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {filteredPoints.map(point => (
                <button key={point.id} onClick={() => setActivePoint(point)} className={`p-2 rounded text-[10px] font-bold border transition-colors ${activePoint?.id === point.id ? 'bg-hpsj-blue text-white border-white shadow-lg' : 'bg-slate-700 text-gray-300 border-slate-600 hover:bg-slate-600'}`}>
                  {point.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-grow bg-[#111827] border-2 border-slate-600 rounded p-6 relative overflow-y-auto min-h-[300px] shadow-inner">
            {activePoint ? (
              <div className="animate-fade-in h-full flex flex-col">
                <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-2">
                    <h3 className="font-bold text-hpsj-cyan uppercase tracking-widest text-xl">{activePoint.label}</h3>
                    <button 
                      onClick={() => handleGPS(activePoint.label)}
                      className="bg-hpsj-blue hover:bg-blue-500 text-white px-4 py-2 rounded-full text-xs font-black shadow-lg flex items-center gap-2 transform active:scale-95 transition-all"
                    >
                      <i className="fa-solid fa-location-arrow"></i> ALLER ICI (GPS)
                    </button>
                </div>
                <div className="dynamic-content text-base text-gray-300 space-y-4 flex-grow" dangerouslySetInnerHTML={{ __html: activePoint.infoHtml }} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50 italic">
                <i className="fa-solid fa-crosshairs text-4xl mb-2"></i>
                <p className="text-xs uppercase tracking-widest">Sélectionnez une zone pour plus de détails</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPlanModal && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowPlanModal(null)}>
          <div className="relative w-full max-w-5xl bg-slate-900 border-2 border-slate-700 rounded-xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="bg-slate-800 p-3 border-b border-slate-700 flex justify-between items-center">
                <h3 className="text-sm font-bold text-hpsj-cyan uppercase tracking-wider">
                  <i className="fa-solid fa-expand mr-2"></i> 
                  {showPlanModal === 'consultations' ? 'Plan Détaillé Consultations' : 'Plan Détaillé Hospitalisations'}
                </h3>
                <button onClick={() => setShowPlanModal(null)} className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="overflow-auto max-h-[80vh] bg-white">
                <img 
                  src={showPlanModal === 'consultations' ? MAP_IMAGES.CONSULTATIONS : showPlanModal === 'hospitalisations' ? MAP_IMAGES.HOSPITALISATIONS : MAP_IMAGES.GENERAL} 
                  className="max-w-none w-[1500px]" 
                  alt="Plan Détaillé"
                />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;