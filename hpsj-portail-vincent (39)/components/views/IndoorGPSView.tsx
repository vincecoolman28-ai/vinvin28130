import React, { useState } from 'react';

const MAP_IMAGES = {
  GENERAL: "https://drive.google.com/thumbnail?id=1iKi-JsRwrgmzbZ9dFGWuTTu303HIZECQ&sz=w3000", 
  CONSULTATIONS: "https://drive.google.com/thumbnail?id=1Gq-2yk6fV_c-D28_5QOobQH0tf0qyaGk&sz=w3000",
  HOSPITALISATIONS: "https://drive.google.com/thumbnail?id=1FPiccY0yOwmG-6rohwjL5A1fqBRk_enE&sz=w3000"
};

const EXTERNAL_ADDRESSES = [
  { id: 'hpsj_main', label: 'Accueil Principal (185 rue Losserand)', address: '185 Rue Raymond Losserand, 75014 Paris', color: 'bg-blue-600', icon: 'fa-hospital' },
  { id: 'hpsj_5', label: 'Entrée 5 / Centre Losserand (193 rue Losserand)', address: '193 Rue Raymond Losserand, 75014 Paris', color: 'bg-cyan-600', icon: 'fa-person-walking-arrow-right' },
  { id: 'hpsj_urg', label: 'Urgences / Maternité (189 rue Losserand)', address: '189 Rue Raymond Losserand, 75014 Paris', color: 'bg-red-600', icon: 'fa-truck-medical' },
  { id: 'hpsj_oph', label: 'Ophtalmologie (168 rue Losserand)', address: '168 Rue Raymond Losserand, 75014 Paris', color: 'bg-indigo-600', icon: 'fa-eye' },
];

const hospitalGraph = {
  nodes: {
    'hall': { id: 'hall', label: 'Hall Principal (Accueil)', floor: '0', building: 'Principal', mapType: 'GENERAL', address: "185 rue Raymond Losserand, 75014 Paris" },
    'ext_185': { id: 'ext_185', label: 'Extérieur (185 rue Losserand)', floor: '0', building: 'Extérieur', mapType: 'GENERAL', address: "185 rue Raymond Losserand, 75014 Paris" },
    'couloir_principal': { id: 'couloir_principal', label: 'Couloir Central (RDC)', floor: '0', building: 'Principal', mapType: 'CONSULTATIONS' },
    'p1': { id: 'p1', label: 'Porte 1 (Anesthésie/Ortho)', floor: '1-3', building: 'Ste Geneviève', mapType: 'CONSULTATIONS' },
    'asc_p1': { id: 'asc_p1', label: 'Ascenseur Porte 1', floor: '0', building: 'Ste Geneviève', mapType: 'CONSULTATIONS' },
    'p10': { id: 'p10', label: 'Porte 10 (Maternité)', floor: '0-6', building: 'Notre Dame', mapType: 'HOSPITALISATIONS' },
    'asc_p10': { id: 'asc_p10', label: 'Ascenseur Porte 10', floor: '0', building: 'Notre Dame', mapType: 'CONSULTATIONS' },
    'urgences': { id: 'urgences', label: 'Urgences Adultes (189)', floor: '0', building: 'St Vincent', mapType: 'GENERAL', address: "189 rue Raymond Losserand, 75014 Paris" },
    'rue': { id: 'rue', label: 'Rue Raymond Losserand (Trottoir)', floor: '0', building: 'Ville', mapType: 'GENERAL' },
    'entree_5': { id: 'entree_5', label: 'Entrée 5 (Centre Losserand)', floor: '0', building: 'Losserand', mapType: 'GENERAL', address: "193 rue Raymond Losserand, 75014 Paris" },
    'accueil_5': { id: 'accueil_5', label: 'Accueil Entrée 5', floor: '0', building: 'Losserand', mapType: 'GENERAL' },
  },
  edges: {
    'ext_185': [{ to: 'hall', instruction: 'Entrez dans le hall principal.', distance: 10, icon: 'fa-door-open' }, { to: 'rue', instruction: 'Sortez sur la rue.', distance: 10, icon: 'fa-person-walking' }],
    'hall': [
        { to: 'ext_185', instruction: 'Sortez du bâtiment principal.', distance: 10, icon: 'fa-door-open' },
        { to: 'couloir_principal', instruction: 'Avancez tout droit. Empruntez l\'escalier central ou continuez dans le couloir.', distance: 20, icon: 'fa-arrow-up' }
    ],
    'couloir_principal': [
        { to: 'hall', instruction: 'Retournez vers l\'accueil/sortie.', distance: 20, icon: 'fa-arrow-down' },
        { to: 'asc_p1', instruction: 'Tournez à GAUCHE pour la Porte 1.', distance: 15, icon: 'fa-arrow-left' },
        { to: 'asc_p10', instruction: 'Continuez tout droit vers le bâtiment Notre-Dame (Porte 10).', distance: 60, icon: 'fa-arrow-up' }
    ],
    'rue': [
        { to: 'ext_185', instruction: 'Allez au 185 rue Losserand.', distance: 50, icon: 'fa-person-walking' },
        { to: 'entree_5', instruction: 'Allez au 193 rue Raymond Losserand (Entrée 5).', distance: 150, icon: 'fa-arrow-left' }
    ],
    'entree_5': [{ to: 'accueil_5', instruction: 'Entrez dans le bâtiment.', distance: 10 }, { to: 'rue', instruction: 'Sortez sur la rue.', distance: 10 }]
  }
};

const IndoorGPSView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'external' | 'internal'>('external');
  const [startNode, setStartNode] = useState('hall');
  const [endNode, setEndNode] = useState('entree_5');
  const [route, setRoute] = useState<any[] | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeMapImage, setActiveMapImage] = useState<string | null>(null);

  const findPath = (start: string, end: string) => {
    setIsCalculating(true);
    setTimeout(() => {
        const queue: any[] = [{ id: start, path: [] }];
        const visited = new Set([start]);
        while (queue.length > 0) {
            const { id, path } = queue.shift();
            if (id === end) {
                setRoute(path);
                setIsCalculating(false);
                return;
            }
            const neighbors = hospitalGraph.edges[id] || [];
            for (const edge of neighbors) {
                if (!visited.has(edge.to)) {
                    visited.add(edge.to);
                    queue.push({ id: edge.to, path: [...path, { instruction: edge.instruction, distance: edge.distance, icon: edge.icon, nodeId: edge.to, mapType: hospitalGraph.nodes[edge.to].mapType }] });
                }
            }
        }
        setIsCalculating(false);
        setRoute([]);
    }, 500);
  };

  /**
   * Génère un lien direct vers l'itinéraire Google Maps
   * Utilise l'API de calcul de trajet (dir) plutôt que la recherche
   */
  const getDirectionsUrl = (address: string) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}&travelmode=walking`;
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-12 px-2">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-hpsj-blue mb-2"><i className="fa-solid fa-location-arrow mr-3"></i>GPS & Accès</h2>
        <p className="text-gray-400 text-sm italic">Navigation directe vers les entrées</p>
      </div>

      <div className="flex gap-2 mb-6 bg-slate-800 p-1 rounded-xl border border-slate-700 shadow-lg">
        <button 
          onClick={() => setActiveTab('external')}
          className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'external' ? 'bg-hpsj-blue text-white shadow-md' : 'text-gray-400 hover:bg-slate-700'}`}
        >
          <i className="fa-solid fa-road"></i> Itinéraire Extérieur (Maps)
        </button>
        <button 
          onClick={() => setActiveTab('internal')}
          className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'internal' ? 'bg-hpsj-blue text-white shadow-md' : 'text-gray-400 hover:bg-slate-700'}`}
        >
          <i className="fa-solid fa-stairs"></i> Trajet Intérieur HPSJ
        </button>
      </div>

      {activeTab === 'external' && (
        <div className="space-y-6 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EXTERNAL_ADDRESSES.map(addr => (
              <div key={addr.id} className="bg-slate-800 border-2 border-slate-700 p-5 rounded-2xl flex flex-col justify-between hover:border-hpsj-cyan transition-all group shadow-xl">
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`w-12 h-12 rounded-xl ${addr.color} shadow-lg flex items-center justify-center text-white text-xl`}>
                      <i className={`fa-solid ${addr.icon}`}></i>
                    </div>
                    <div>
                        <h4 className="text-white font-black text-sm uppercase tracking-tight leading-tight">{addr.label}</h4>
                        <p className="text-[10px] text-gray-400 font-mono mt-1">{addr.address}</p>
                    </div>
                  </div>
                </div>
                
                {/* BOUTON D'ITINÉRAIRE DIRECT */}
                <a 
                  href={getDirectionsUrl(addr.address)} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-95 transition-all shadow-[0_4px_15px_rgba(37,99,235,0.4)]"
                >
                  <i className="fa-solid fa-diamond-turn-right text-lg"></i> LANCER L'ITINÉRAIRE GOOGLE MAPS
                </a>
              </div>
            ))}
          </div>

          <div className="bg-slate-800 border-2 border-slate-600 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-slate-700 p-4 border-b border-slate-600 flex justify-between items-center">
              <h3 className="text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <i className="fa-solid fa-map-location-dot text-hpsj-cyan"></i> 
                Vue du Quartier Losserand
              </h3>
            </div>
            <div className="h-[350px] bg-slate-900">
               <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                style={{ border: 0 }}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2626.685376174783!2d2.308722476566838!3d48.82607997132717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e6710439167733%3A0xb304918e9514e867!2s193%20Rue%20Raymond%20Losserand%2C%2075014%20Paris!5e0!3m2!1sfr!2sfr!4v1710000000000!5m2!1sfr!2sfr"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'internal' && (
        <div className="animate-slide-up space-y-6">
          <div className="bg-slate-800 border-2 border-slate-600 rounded-xl p-6 shadow-2xl space-y-4">
            <div>
                <label className="block text-[10px] font-bold text-hpsj-cyan uppercase mb-1">Point de Départ (Interne)</label>
                <select value={startNode} onChange={e => {setStartNode(e.target.value); setRoute(null);}} className="w-full bg-slate-900 border border-slate-600 text-white rounded p-3 text-sm focus:border-hpsj-blue outline-none">
                    {Object.values(hospitalGraph.nodes).sort((a,b) => a.label.localeCompare(b.label)).map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                </select>
            </div>

            <div className="flex justify-center">
                <button onClick={() => { const tmp = startNode; setStartNode(endNode); setEndNode(tmp); setRoute(null); }} className="w-10 h-10 rounded-full bg-slate-700 hover:bg-hpsj-blue text-white border border-slate-500 transition-all shadow-lg active:scale-90"><i className="fa-solid fa-arrow-right-arrow-left rotate-90"></i></button>
            </div>

            <div>
                <label className="block text-[10px] font-bold text-red-400 uppercase mb-1">Service de Destination</label>
                <select value={endNode} onChange={e => {setEndNode(e.target.value); setRoute(null);}} className="w-full bg-slate-900 border border-slate-600 text-white rounded p-3 text-sm focus:border-red-500 outline-none">
                    {Object.values(hospitalGraph.nodes).sort((a,b) => a.label.localeCompare(b.label)).map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                </select>
            </div>

            <button onClick={() => findPath(startNode, endNode)} disabled={isCalculating || startNode === endNode} className="w-full py-4 bg-gradient-to-r from-hpsj-blue to-cyan-600 text-white rounded-lg font-bold shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 active:scale-95">
                {isCalculating ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <><i className="fa-solid fa-route mr-2"></i>Calculer l'itinéraire intérieur</>}
            </button>
          </div>

          {route && (
            <div className="animate-slide-up bg-white dark:bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
                    <div>
                        <span className="text-[10px] text-gray-500 uppercase font-bold">Estimation</span>
                        <div className="text-2xl font-black dark:text-white">~ 3 min</div>
                    </div>
                </div>

                <div className="p-6 space-y-6 relative">
                    <div className="absolute left-9 top-8 bottom-8 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                    <div className="flex gap-4 relative z-10">
                        <div className="w-6 h-6 rounded-full bg-hpsj-blue border-4 border-white dark:border-slate-900 shadow-sm flex-shrink-0"></div>
                        <p className="font-bold text-sm text-slate-800 dark:text-white">Départ : {hospitalGraph.nodes[startNode].label}</p>
                    </div>
                    
                    {route.map((s, i) => (
                        <div key={i} className="flex gap-4 relative z-10">
                            <div className="w-6 h-6 rounded-full bg-slate-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] text-white shadow-sm flex-shrink-0">
                                <i className={`fa-solid ${s.icon || 'fa-arrow-down'}`}></i>
                            </div>
                            <div className="pb-2">
                                <p className="text-sm font-medium leading-tight text-slate-700 dark:text-gray-200">{s.instruction}</p>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="text-[10px] text-gray-500 uppercase">Vers : <span className="text-hpsj-cyan font-bold">{hospitalGraph.nodes[s.nodeId].label}</span></span>
                                    {s.mapType && (
                                      <button onClick={() => setActiveMapImage(MAP_IMAGES[s.mapType])} className="text-[9px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white px-2 py-0.5 rounded-full hover:bg-hpsj-blue hover:text-white transition-colors">
                                        <i className="fa-solid fa-map"></i> Plan Détail
                                      </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <div className="flex gap-4 relative z-10">
                        <div className="w-6 h-6 rounded-full bg-red-600 border-4 border-white dark:border-slate-900 shadow-lg animate-pulse flex-shrink-0"></div>
                        <div>
                            <p className="font-bold text-red-600 text-lg leading-none">Arrivée !</p>
                        </div>
                    </div>
                </div>
            </div>
          )}
        </div>
      )}

      {activeMapImage && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={() => setActiveMapImage(null)}>
            <div className="relative max-w-4xl w-full bg-slate-900 border-2 border-slate-600 rounded-xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="p-3 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                   <span className="text-xs font-bold text-white uppercase tracking-widest"><i className="fa-solid fa-map mr-2"></i> Plan intérieur</span>
                   <button onClick={() => setActiveMapImage(null)} className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors"><i className="fa-solid fa-xmark"></i></button>
                </div>
                <div className="bg-[#0f172a] p-2 flex items-center justify-center">
                    <img src={activeMapImage} className="max-h-[80vh] object-contain cursor-zoom-in" alt="Plan" />
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default IndoorGPSView;