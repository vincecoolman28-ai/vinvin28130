
import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Building2, MapPin, Bed, Activity, Filter } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { planHospitalierData } from '../../data_plan';

const PlanHospitalierView: React.FC = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPole, setSelectedPole] = useState<string>('Tous');

  const poles = useMemo(() => {
    const uniquePoles = Array.from(new Set(planHospitalierData.map(item => item.pole)));
    return ['Tous', ...uniquePoles];
  }, []);

  const getPorte = (ul: string) => {
    // 1. Try to find explicit building number patterns
    // Matches "JEAN 6", "GENV 1", "DIDOT 2", "WATT 1", etc.
    const buildingMatch = ul.match(/(?:JEAN|GENV|DIDOT|WATT|BC)\s+(\d+)/i);
    if (buildingMatch) return buildingMatch[1];

    // 2. Specific keyword mappings
    if (ul.includes('NDBS') || ul.includes('ND RDC')) return '10';
    if (ul.includes('StMICHEL') || ul.includes('St MICHEL')) {
        if (ul.includes('6790')) return '16'; // Exception for Onco
        return '14';
    }
    if (ul.includes('VINCENT')) return '189';
    if (ul.includes('STE MARIE')) return '11';
    if (ul.includes('LOSSERAND')) return '5';
    if (ul.includes('HALL N 0')) return '2'; // Hall is near Porte 2

    // 3. Fallback to refined code mapping based on data_plan.ts analysis
    const code = ul.split('-')[0];
    const mapping: Record<string, string> = {
      '6089': '1', '6048': '1', '6049': '1', '6046': '1',
      '6019': '189', '6020': '189', '6021': '189', '6033': '2', '6036': '2', '6034': '2', '6039': '2', '6053': '2', '6794': '2', '6054': '2', '6067': '2', '6096': '2',
      '6057': '4', '6037': '4',
      '6047': '5', '6338': '5', '6339': '5', '6332': '5', '6333': '5', '6088': '5', '6351': '5', '6352': '5', '6353': '5', '6354': '5', '6323': '5', '6335': '5',
      '6008': '6', '6038': '6', '6055': '6', '6345': '6', '6059': '6', '6793': '6',
      '6058': '8',
      '6401': '10', '6402': '10', '6405': '10', '6406': '10', '6407': '10', '6408': '10', '6409': '10', '6410': '10', '6411': '10', '6412': '10', '6415': '10', '6404': '10', '6016': '10',
      '6720': '14', '6722': '14', '6730': '14', '6740': '14', '6741': '14', '6745': '14', '6750': '14', '6755': '14', '6760': '14', '6770': '14', '6791': '14', '6735': '14', '6710': '14',
      '6790': '16',
      '6792': '11',
      '6071': '189', '6017': '189',
    };
    return mapping[code];
  };

  const filteredData = useMemo(() => {
    return planHospitalierData.filter(item => {
      const porte = getPorte(item.ul);
      const porteSearch = porte ? `porte ${porte}` : '';
      
      const matchesSearch = 
        item.libelleUg.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ua.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.posteDeSoins && item.posteDeSoins.includes(searchTerm)) ||
        porteSearch.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPole = selectedPole === 'Tous' || item.pole === selectedPole;
      
      return matchesSearch && matchesPole;
    });
  }, [searchTerm, selectedPole]);

  const isHML = (item: any) => {
    return item.pole.includes('HML') || item.pole === 'POLE ADULTE' || item.pole === 'POLE CONGENITAL' || item.ul.startsWith('69');
  };

  const renderLocalisation = (ul: string) => {
    const parts = ul.split('-');
    const code = parts[0];
    const details = parts.slice(1).join('-');
    
    // Improved regex: 
    // Group 1: Level (digit or G)
    // Group 2: Secteur (digit after dash or space)
    // Group 3: Unité (after U)
    const levelMatch = details.match(/(?:\s|^)N\s*([0-9G])(?:[\s\-/]+(\d+))?(?:\s*U(\d+))?/i);
    
    let levelExplanation = "";
    if (levelMatch) {
      const l1Raw = levelMatch[1];
      const s = levelMatch[2];
      const u = levelMatch[3];
      
      const formatLevel = (l: string) => l.toUpperCase() === 'G' ? "G (Rez-de-chaussée)" : l;
      const l1 = formatLevel(l1Raw);
      
      levelExplanation = `Situé au Niveau ${l1}`;
      
      if (s) {
        // If the second number is small (1-3) and the first is also small, it MIGHT be a range, 
        // but in HPSJ JEAN building, it's almost always Secteur.
        // We'll treat it as Secteur for clarity as requested.
        levelExplanation += `, Secteur ${s}`;
      }
      
      if (u) {
        levelExplanation += ` (Unité ${u})`;
      }
    }

    // Extract building and porte for clearer display
    const buildingMatch = details.match(/([A-Z\s]+)\s+(\d+)/i);
    let buildingInfo = "";
    if (buildingMatch) {
        buildingInfo = `${buildingMatch[1].trim()} - Porte ${buildingMatch[2]}`;
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 tracking-tighter">REF: {code}</span>
          {buildingInfo && <span className="text-[10px] font-bold text-hpsj-cyan bg-hpsj-cyan/5 px-2 py-0.5 rounded border border-hpsj-cyan/10 uppercase">{buildingInfo}</span>}
        </div>
        <p className="text-sm text-slate-200 font-medium">{details}</p>
        {levelExplanation && (
          <div className="flex items-center gap-2 py-1.5 px-3 bg-slate-950 rounded-lg border border-slate-800 group-hover:border-hpsj-cyan/30 transition-colors">
            <Activity className="w-3.5 h-3.5 text-hpsj-cyan" />
            <p className="text-xs font-black text-hpsj-cyan uppercase tracking-wide">
              {levelExplanation}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <Building2 className="text-hpsj-cyan w-8 h-8" />
            Plan Hospitalier
          </h2>
          <p className="text-slate-400 mt-1">Cartographie détaillée des services, unités et lits</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-hpsj-cyan transition-colors w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un service, une unité..."
              className="pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hpsj-cyan/50 focus:border-hpsj-cyan transition-all w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative group">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-hpsj-cyan transition-colors w-4 h-4" />
            <select
              className="pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hpsj-cyan/50 focus:border-hpsj-cyan transition-all appearance-none w-full sm:w-48 text-slate-300"
              value={selectedPole}
              onChange={(e) => setSelectedPole(e.target.value)}
            >
              {poles.map(pole => (
                <option key={pole} value={pole}>{pole}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredData.map((item, index) => {
          const hml = isHML(item);
          const porte = getPorte(item.ul);
          
          return (
            <motion.div
              key={`${item.ug}-${index}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              className={`bg-slate-900/40 border ${hml ? 'border-purple-500/30 bg-purple-900/5' : 'border-slate-800'} rounded-2xl p-5 hover:border-hpsj-cyan/30 hover:bg-slate-800/40 transition-all group shadow-lg`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${hml ? 'text-purple-400 bg-purple-500/10' : 'text-hpsj-cyan bg-hpsj-cyan/10'} px-2 py-0.5 rounded-full inline-block`}>
                      {item.pole}
                    </span>
                    {hml && (
                      <span className="text-[10px] font-black uppercase tracking-widest text-white bg-purple-600 px-2 py-0.5 rounded-full">
                        HML
                      </span>
                    )}
                  </div>
                  <h3 className={`text-xl font-bold ${hml ? 'text-purple-100' : 'text-white'} group-hover:text-hpsj-cyan transition-colors`}>
                    {item.libelleUg}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-1">UG: {item.ug}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {item.lits && (
                    <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg border border-emerald-500/20 shadow-sm">
                      <Bed className="w-4 h-4" />
                      <span className="text-xs font-bold">{item.lits}</span>
                    </div>
                  )}
                  {porte && (
                    <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-400 px-3 py-1 rounded-lg border border-orange-500/20 shadow-sm">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs font-black uppercase">Porte {porte}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                  <MapPin className={`w-4 h-4 ${hml ? 'text-purple-400' : 'text-slate-400'} mt-0.5 shrink-0`} />
                  <div className="flex-1">
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Localisation (UL)</p>
                    {renderLocalisation(item.ul)}
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                  <Activity className={`w-4 h-4 ${hml ? 'text-purple-400' : 'text-slate-400'} mt-0.5 shrink-0`} />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Unités d'Activité (UA)</p>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {item.ua || "Aucune UA spécifiée"}
                    </p>
                  </div>
                </div>

                {item.posteDeSoins && (
                  <div className="flex items-center gap-3 bg-orange-500/5 p-3 rounded-xl border border-orange-500/20">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                      <i className="fa-solid fa-phone-volume text-sm"></i>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-orange-500/70 tracking-wider">Poste de Soins</p>
                      <p className="text-lg font-black text-orange-500 font-mono tracking-widest">{item.posteDeSoins}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
          <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">Aucun résultat trouvé pour votre recherche.</p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedPole('Tous'); }}
            className="mt-4 text-hpsj-cyan hover:underline font-medium"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default PlanHospitalierView;
