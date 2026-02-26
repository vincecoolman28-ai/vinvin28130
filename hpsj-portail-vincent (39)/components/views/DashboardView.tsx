import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usefulNumbers, guardsData } from '../../data';
import { GoogleGenAI } from "@google/genai";

const DashboardView: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'briefing' | 'apps' | 'urgences'>('briefing');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    generateDailyBriefing();
    return () => clearInterval(timer);
  }, []);

  const generateDailyBriefing = async () => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `En tant que Vincent l'assistant hospitalier, fais un résumé TRES COURT (3 phrases max) pour aujourd'hui (${new Date().toLocaleDateString()}) basé sur ces données : 
      Gardes : ${JSON.stringify(guardsData.slice(0, 5))}...
      Note importante : Le centre Losserand (ORL/Gynéco) est à l'Entrée 5.
      Donne un conseil ou un fait marquant.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      setAiSummary(response.text);
    } catch (e) {
      setAiSummary("Prêt pour une nouvelle journée à l'Hôpital Saint-Joseph. Consultez vos gardes et plannings.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const vitalNumbers = usefulNumbers.find(cat => cat.title === "Urgences")?.items || [];
  
  const triggerSearch = () => {
    const searchBtn = document.querySelector<HTMLButtonElement>('button[title="Recherche Globale"]');
    if (searchBtn) searchBtn.click();
  };

  return (
    <div className="animate-fade-in pb-12 max-w-7xl mx-auto">
      
      <div className="flex flex-col md:flex-row justify-between items-end mb-6 px-2">
        <div>
            <h2 className="text-3xl font-bold text-white mb-1">
                Bonjour, <span className="text-hpsj-cyan">Vincent</span>.
            </h2>
            <p className="text-gray-400 text-sm">
                {time.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
        </div>
        <div className="text-right hidden md:block">
            <p className="text-4xl font-black text-slate-700 dark:text-slate-600/50 tracking-tighter">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
        </div>
      </div>

      <div className="mb-8 px-2">
        <div className="bg-slate-800 border border-hpsj-blue/30 rounded-2xl p-5 shadow-xl relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-hpsj-blue/10 rounded-full blur-3xl group-hover:bg-hpsj-blue/20 transition-all"></div>
            <div className="flex items-start gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-hpsj-blue to-cyan-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] animate-pulse">
                    <i className="fa-solid fa-robot text-xl"></i>
                </div>
                <div className="flex-1">
                    <h4 className="text-[10px] font-black text-hpsj-cyan uppercase tracking-[0.2em] mb-1">Résumé IA en temps réel</h4>
                    {isAiLoading ? (
                        <div className="flex gap-1 mt-2">
                            <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                            <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                        </div>
                    ) : (
                        <p className="text-gray-200 text-sm leading-relaxed italic">"{aiSummary}"</p>
                    )}
                </div>
            </div>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-700 mb-8 overflow-x-auto no-scrollbar">
        <button 
            onClick={() => setActiveTab('briefing')}
            className={`pb-3 px-4 font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap
                ${activeTab === 'briefing' ? 'text-hpsj-cyan border-b-4 border-hpsj-cyan' : 'text-gray-500 hover:text-gray-300 border-b-4 border-transparent'}
            `}
        >
            <i className="fa-solid fa-mug-hot"></i> Briefing Jour
        </button>
        <button 
            onClick={() => setActiveTab('apps')}
            className={`pb-3 px-4 font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap
                ${activeTab === 'apps' ? 'text-hpsj-blue border-b-4 border-hpsj-blue' : 'text-gray-500 hover:text-gray-300 border-b-4 border-transparent'}
            `}
        >
            <i className="fa-solid fa-grip"></i> Applications
        </button>
        <button 
            onClick={() => setActiveTab('urgences')}
            className={`pb-3 px-4 font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap
                ${activeTab === 'urgences' ? 'text-red-500 border-b-4 border-red-500' : 'text-gray-500 hover:text-gray-300 border-b-4 border-transparent'}
            `}
        >
            <i className="fa-solid fa-truck-medical"></i> Urgences & Gardes
        </button>
      </div>

      {activeTab === 'briefing' && (
        <div className="animate-slide-up space-y-6">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 shadow-xl text-center">
                <h3 className="text-2xl text-white font-bold mb-6">Recherche Express</h3>
                <button 
                    onClick={triggerSearch}
                    className="w-full max-w-xl mx-auto bg-slate-700 hover:bg-slate-600 text-left px-6 py-4 rounded-full flex items-center gap-4 text-gray-300 transition-all border border-slate-500 group"
                >
                    <i className="fa-solid fa-magnifying-glass text-hpsj-cyan group-hover:scale-110 transition-transform"></i>
                    <span>Bip, Service, Médecin...</span>
                    <span className="ml-auto bg-slate-800 px-2 py-1 rounded text-xs border border-slate-600">LANCER</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800 border-l-4 border-green-500 rounded-r-xl p-6 shadow-lg">
                    <h4 className="text-green-400 font-bold uppercase tracking-wider flex items-center gap-2 mb-2">
                        <i className="fa-solid fa-bullhorn"></i> Alerte Service
                    </h4>
                    <h3 className="text-white text-xl font-bold mb-2">Entrée 5 Opérationnelle</h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        Rappel : L'ORL et le Centre du Sein sont au 193 rue Raymond Losserand.
                    </p>
                    <button onClick={() => navigate('/losserand')} className="text-green-400 text-sm font-bold hover:underline">
                        Détails d'accès <i className="fa-solid fa-arrow-right ml-1"></i>
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                    <h4 className="text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-4 text-sm">Accès Fréquents</h4>
                    <div className="space-y-3">
                        <button onClick={() => navigate('/annuaire-global')} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-600 group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center"><i className="fa-solid fa-phone-flip"></i></div>
                                <span className="font-bold text-slate-700 dark:text-gray-200">Annuaire de tous les Bips</span>
                            </div>
                            <i className="fa-solid fa-chevron-right text-gray-400 group-hover:text-hpsj-blue"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'apps' && (
        <div className="animate-slide-up">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[
                    { label: 'Annuaire Global', icon: 'fa-phone-flip', path: '/annuaire-global', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'GPS HPSJ', icon: 'fa-location-arrow', path: '/gps', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
                    { label: 'Postes de soins', icon: 'fa-hospital-user', path: '/services', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: <span>Plan Hospitalier <span className="text-red-500">n°98D</span></span>, icon: 'fa-building-shield', path: '/plan-hospitalier', color: 'text-hpsj-cyan', bg: 'bg-hpsj-cyan/10' },
                    { label: 'Plans 2D', icon: 'fa-map-location-dot', path: '/plan', color: 'text-purple-500', bg: 'bg-purple-500/10' },
                ].map((app, idx) => (
                    <button key={idx} onClick={() => navigate(app.path)} className="flex flex-col items-center justify-center p-6 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-all shadow-md group aspect-square">
                        <div className={`w-14 h-14 rounded-2xl ${app.bg} ${app.color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
                            <i className={`fa-solid ${app.icon}`}></i>
                        </div>
                        <span className="font-bold text-gray-200 text-sm">{app.label}</span>
                    </button>
                ))}
            </div>
        </div>
      )}

      {activeTab === 'urgences' && (
        <div className="animate-slide-up space-y-6">
            <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-5">
                <h3 className="text-red-500 font-bold uppercase tracking-wider mb-4 flex items-center gap-2">Urgences Vitales</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {vitalNumbers.map((item, idx) => (
                        <div key={idx} className="bg-red-600 text-white p-3 rounded text-center shadow">
                            <div className="text-[10px] uppercase font-bold opacity-80">{item.label}</div>
                            <div className="text-xl font-black">{item.num}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                <h3 className="text-hpsj-blue font-bold uppercase tracking-wider mb-4">Dernières Gardes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {guardsData.slice(0, 4).map((g, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-900 p-3 rounded border border-slate-700">
                            <span className="font-bold text-gray-300">{g.specialite}</span>
                            <span className="font-mono text-yellow-400 font-bold text-lg">{g.garde}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default DashboardView;