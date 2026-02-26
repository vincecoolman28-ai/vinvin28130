
import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../../services/supabaseClient';
import { Doctor } from '../../types';
import { chefsDeService, consultationTeams } from '../../data';

const DirectoryView: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null); // Nouveau state pour le filtre rapide
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Doctor | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState<Doctor>({
    nom: '', prenom: '', specialite: '', lieu: '', rdv: '', secretariat_cs: '', secretariat_hospi: '', dect: ''
  });

  // Liste des filtres rapides (Style DRH)
  const quickFilters = [
    { label: 'Anesthésie', icon: 'fa-syringe', color: 'border-blue-500 text-blue-500 hover:bg-blue-500' },
    { label: 'Cardio', icon: 'fa-heart-pulse', color: 'border-red-500 text-red-500 hover:bg-red-500' },
    { label: 'Chirurgie', icon: 'fa-scalpel', color: 'border-green-500 text-green-500 hover:bg-green-500' },
    { label: 'Gastro', icon: 'fa-stomach', color: 'border-yellow-500 text-yellow-500 hover:bg-yellow-500' },
    { label: 'Gynéco', icon: 'fa-baby', color: 'border-pink-500 text-pink-500 hover:bg-pink-500' },
    { label: 'Neuro', icon: 'fa-brain', color: 'border-purple-500 text-purple-500 hover:bg-purple-500' },
    { label: 'Ortho', icon: 'fa-bone', color: 'border-orange-500 text-orange-500 hover:bg-orange-500' },
    { label: 'Urgences', icon: 'fa-truck-medical', color: 'border-red-600 text-red-600 hover:bg-red-600' },
  ];

  // Fonction utilitaire pour parser les noms depuis les données statiques
  const parseStaticName = (fullName: string) => {
    // Nettoyage des titres
    const cleanName = fullName.replace(/^(Dr|Pr)\s+/g, '').trim();
    
    // Détection NOM (Majuscules) vs Prénom
    const parts = cleanName.split(' ');
    const nomParts = parts.filter(p => p.length > 1 && p === p.toUpperCase()); // Ex: CADOR
    const prenomParts = parts.filter(p => !(p.length > 1 && p === p.toUpperCase())); // Ex: Romain

    // Si on a détecté des majuscules, on les utilise comme Nom
    if (nomParts.length > 0) {
        return { nom: nomParts.join(' '), prenom: prenomParts.join(' ') };
    }
    
    // Sinon, heuristique simple : tout sauf le dernier mot est le prénom (pour "DE NEEF Christelle" c'est l'inverse souvent dans les listes : NOM Prenom)
    // Dans consultationTeams : "DE NEEF Christelle" (NOM Prenom)
    // On suppose que le ou les premiers mots en majuscules sont le nom
    return { nom: parts[0], prenom: parts.slice(1).join(' ') };
  };

  const fetchDoctors = async () => {
    setLoading(true);
    let loadedDoctors: Doctor[] = [];
    let useFallback = false;

    try {
      // Tentative de connexion Supabase
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('nom', { ascending: true });

      if (error) {
          console.warn("Supabase non accessible ou erreur:", error.message);
          useFallback = true;
      } else if (!data || data.length === 0) {
          console.log("Supabase connecté mais table vide. Passage en mode secours.");
          useFallback = true;
      } else {
          // APPLIQUER LA CORRECTION DES LIEUX SUR LES DONNÉES SUPABASE
          loadedDoctors = data.map((doc: Doctor) => {
              let newLieu = doc.lieu;
              const s = doc.specialite ? doc.specialite.toLowerCase() : '';

              // Force Entrée 5 pour Gynéco/Sein/Endo/ORL/CMF
              if (s.includes('gynéco') || s.includes('sein') || s.includes('endométriose') || s.includes('maternité')) {
                  newLieu = 'Entrée 5';
              } else if (s.includes('orl') || s.includes('maxillo') || s.includes('stomatologie')) {
                  newLieu = 'Entrée 5';
              }
              
              // Nettoyage général CMT -> Entrée 5
              if (newLieu && newLieu.includes('CMT')) {
                  newLieu = 'Entrée 5';
              }

              return { ...doc, lieu: newLieu };
          });
          setIsOfflineMode(false);
      }
    } catch (e) {
      console.error("Exception connexion Supabase:", e);
      useFallback = true;
    }

    // SI ECHEC SUPABASE : GÉNÉRATION DONNÉES DEPUIS DATA.TS
    if (useFallback) {
        setIsOfflineMode(true);
        const staticDocs: Doctor[] = [];
        let idCounter = 10000;

        // 1. Import Chefs de service
        chefsDeService.forEach(chef => {
            const { nom, prenom } = parseStaticName(chef.nom);
            
            // Logique de détermination automatique du lieu
            let location = 'HPSJ';
            const s = chef.service.toLowerCase();
            
            // Mise à jour Gynéco / Sein / Endométriose -> Entrée 5
            if (s.includes('gynéco') || s.includes('sein') || s.includes('endométriose') || s.includes('maternité')) {
                location = 'Entrée 5';
            } else if (s.includes('orl') || s.includes('maxillo') || s.includes('stomatologie')) {
                location = 'Entrée 5';
            } else if (s.includes('ophtalmo')) {
                location = 'Institut (168)';
            }

            staticDocs.push({
                id: idCounter++,
                nom: nom,
                prenom: prenom,
                specialite: chef.service,
                lieu: location,
                rdv: 'Voir Secrétariat',
                secretariat_cs: '',
                secretariat_hospi: '',
                dect: ''
            });
        });

        // 2. Import Équipes Consultations (filtrer pour ne garder que ceux qui ressemblent à des médecins/cadres)
        consultationTeams.forEach(team => {
             const { nom, prenom } = parseStaticName(team.equipe);
             
             let loc = team.localisation;
             // Remplacement CMT par Entrée 5 si présent
             if (loc.includes('CMT')) {
                 loc = 'Entrée 5';
             }

             staticDocs.push({
                id: idCounter++,
                nom: nom,
                prenom: prenom,
                specialite: team.specialites,
                lieu: loc,
                rdv: team.numeros,
                secretariat_cs: '',
                secretariat_hospi: '',
                dect: ''
             });
        });

        // Tri par nom
        loadedDoctors = staticDocs.sort((a, b) => a.nom.localeCompare(b.nom));
    }

    setDoctors(loadedDoctors);
    setLoading(false);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDelete = async (id: number) => {
    if (isOfflineMode) {
        alert("Impossible de supprimer en mode hors-ligne (données statiques).");
        return;
    }
    if (window.confirm("Supprimer ce médecin ?")) {
      try {
        const { error } = await supabase.from('doctors').delete().eq('id', id);
        if (error) throw error;
        fetchDoctors();
      } catch (e) {
        console.error("Erreur suppression:", e);
        alert("Erreur lors de la suppression.");
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isOfflineMode) {
        alert("L'enregistrement est désactivé car la base de données n'est pas connectée (Mode secours actif).");
        return;
    }

    setSaving(true);
    try {
      const payload = {
        nom: formData.nom.toUpperCase(),
        prenom: formData.prenom,
        specialite: formData.specialite,
        lieu: formData.lieu,
        rdv: formData.rdv,
        secretariat_cs: formData.secretariat_cs,
        secretariat_hospi: formData.secretariat_hospi,
        dect: formData.dect
      };
      
      let error;
      if (editingDoc?.id) {
        const response = await supabase.from('doctors').update(payload).eq('id', editingDoc.id);
        error = response.error;
      } else {
        const response = await supabase.from('doctors').insert([payload]);
        error = response.error;
      }

      if (error) throw error;

      setIsModalOpen(false);
      setEditingDoc(null);
      setFormData({ nom: '', prenom: '', specialite: '', lieu: '', rdv: '', secretariat_cs: '', secretariat_hospi: '', dect: '' });
      fetchDoctors();
    } catch (e) {
      console.error("Erreur sauvegarde:", e);
      alert("Erreur lors de l'enregistrement. Vérifiez votre connexion ou les droits d'accès.");
    } finally {
      setSaving(false);
    }
  };

  const openModal = (doc?: Doctor) => {
    if (doc) {
      setEditingDoc(doc);
      setFormData({
        nom: doc.nom || '',
        prenom: doc.prenom || '',
        specialite: doc.specialite || '',
        lieu: doc.lieu || '',
        rdv: doc.rdv || '',
        secretariat_cs: doc.secretariat_cs || '',
        secretariat_hospi: doc.secretariat_hospi || '',
        dect: doc.dect || '',
        id: doc.id
      });
    } else {
      setEditingDoc(null);
      setFormData({ nom: '', prenom: '', specialite: '', lieu: '', rdv: '', secretariat_cs: '', secretariat_hospi: '', dect: '' });
    }
    setIsModalOpen(true);
  };

  const scrollTable = (direction: 'left' | 'right') => {
    if (tableContainerRef.current) {
      const scrollAmount = 300;
      tableContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleFilterClick = (label: string) => {
      if (activeFilter === label) {
          setActiveFilter(null); // Deselect
          setSearchTerm('');
      } else {
          setActiveFilter(label);
          setSearchTerm(label);
      }
  };

  const filteredDoctors = doctors.filter(doc => 
    (doc.nom && doc.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (doc.specialite && doc.specialite.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white/90 dark:bg-slate-900/80 p-6 rounded-lg backdrop-blur-sm border border-gray-200 dark:border-slate-700 shadow-xl relative animate-fade-in">
      
      {/* Offline Alert */}
      {isOfflineMode && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded shadow-sm" role="alert">
              <p className="font-bold flex items-center">
                  <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                  Mode Lecture Seule
              </p>
              <p className="text-sm">La connexion à la base de données a échoué. Une liste de secours générée à partir des données statiques est affichée.</p>
          </div>
      )}

      {/* Titre */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-hpsj-blue flex items-center gap-2">
          <i className="fa-solid fa-user-doctor"></i> Annuaire Médical
        </h2>
      </div>

      {/* Raccourcis / Filtres Rapides (Style DRH) */}
      <div className="mb-6">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Accès Rapide (Filtres) :</p>
        <div className="flex flex-wrap gap-2">
            {quickFilters.map((filter, idx) => (
                <button
                    key={idx}
                    onClick={() => handleFilterClick(filter.label)}
                    className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200 text-xs font-bold uppercase
                        ${filter.color} 
                        ${activeFilter === filter.label ? 'bg-current text-white shadow-md scale-105' : 'bg-transparent hover:text-white'}
                    `}
                >
                    <i className={`fa-solid ${filter.icon} ${activeFilter === filter.label ? 'text-white' : ''}`}></i>
                    <span className={activeFilter === filter.label ? 'text-white' : ''}>{filter.label}</span>
                </button>
            ))}
        </div>
      </div>

      <div className="flex gap-2 mb-6">
          <input 
            type="text" 
            placeholder="Rechercher (Nom, Spécialité)..."
            className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-hpsj-blue transition-colors"
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setActiveFilter(null); // Clear active filter if typing manual search
            }}
          />
          <button 
            onClick={() => openModal()}
            className={`px-4 py-2 rounded-md font-semibold whitespace-nowrap shadow-md transition-colors cursor-pointer flex items-center ${isOfflineMode ? 'bg-gray-400 cursor-not-allowed opacity-50 text-gray-200' : 'bg-green-600 hover:bg-green-500 text-white'}`}
            disabled={isOfflineMode}
            title={isOfflineMode ? "Ajout désactivé en mode hors ligne" : "Ajouter un médecin"}
          >
            <i className="fa-solid fa-plus mr-2"></i> Nouveau
          </button>
      </div>

      {/* Horizontal Navigation Bar (RED) */}
      <div className="flex items-center justify-between bg-red-600 dark:bg-red-800 p-2 rounded-t-lg border-x border-t border-red-700 dark:border-red-900 shadow-md">
        <button 
          onClick={() => scrollTable('left')}
          className="bg-white text-red-600 hover:bg-red-50 hover:text-red-700 px-4 py-2 rounded shadow transition-all flex items-center gap-2 font-bold text-sm cursor-pointer"
        >
          <i className="fa-solid fa-arrow-left"></i> Gauche
        </button>
        <span className="text-xs text-white font-bold uppercase tracking-wider hidden sm:block drop-shadow-sm">
          <i className="fa-solid fa-arrows-left-right mr-2"></i>Navigation Tableau
        </span>
        <button 
          onClick={() => scrollTable('right')}
          className="bg-white text-red-600 hover:bg-red-50 hover:text-red-700 px-4 py-2 rounded shadow transition-all flex items-center gap-2 font-bold text-sm cursor-pointer"
        >
          Droite <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>

      <div 
        ref={tableContainerRef}
        className="overflow-x-auto border-x border-b border-gray-300 dark:border-slate-700 rounded-b-lg shadow-inner scroll-smooth"
      >
        <table className="w-full text-left text-sm text-gray-700 dark:text-gray-300 min-w-[1000px]">
          <thead className="bg-gray-100 dark:bg-slate-800 text-blue-600 dark:text-hpsj-cyan uppercase font-semibold sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="p-4 border-b border-gray-300 dark:border-slate-600">Nom</th>
              <th className="p-4 border-b border-gray-300 dark:border-slate-600">Prénom</th>
              <th className="p-4 border-b border-gray-300 dark:border-slate-600">Spécialité</th>
              <th className="p-4 border-b border-gray-300 dark:border-slate-600">Lieu</th>
              <th className="p-4 border-b border-gray-300 dark:border-slate-600">RDV</th>
              <th className="p-4 border-b border-gray-300 dark:border-slate-600">Sec. CS</th>
              <th className="p-4 border-b border-gray-300 dark:border-slate-600">DECT</th>
              <th className="p-4 border-b border-gray-300 dark:border-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700 bg-white dark:bg-slate-900/50">
            {loading ? (
              <tr><td colSpan={8} className="p-8 text-center"><i className="fa-solid fa-spinner fa-spin text-2xl text-hpsj-blue"></i> Chargement...</td></tr>
            ) : filteredDoctors.length === 0 ? (
              <tr><td colSpan={8} className="p-8 text-center text-gray-500">Aucun médecin trouvé.</td></tr>
            ) : (
              filteredDoctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-blue-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-bold text-gray-900 dark:text-white">{doc.nom}</td>
                  <td className="p-4">{doc.prenom}</td>
                  <td className="p-4 text-blue-600 dark:text-hpsj-blue font-medium">{doc.specialite}</td>
                  <td className="p-4">{doc.lieu}</td>
                  <td className="p-4">{doc.rdv}</td>
                  <td className="p-4">{doc.secretariat_cs}</td>
                  <td className="p-4 font-mono text-orange-600 dark:text-yellow-500 font-bold">{doc.dect}</td>
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    <button 
                        onClick={() => openModal(doc)} 
                        disabled={isOfflineMode}
                        className={`p-2 rounded transition-colors cursor-pointer ${isOfflineMode ? 'text-gray-400 cursor-not-allowed' : 'text-orange-500 hover:text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900/20'}`}
                    >
                        <i className="fa-solid fa-pen"></i>
                    </button>
                    <button 
                        onClick={() => handleDelete(doc.id!)} 
                        disabled={isOfflineMode}
                        className={`p-2 rounded transition-colors cursor-pointer ${isOfflineMode ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20'}`}
                    >
                        <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal - Use Portal to render outside the parent container to avoid stacking context issues */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl border border-gray-300 dark:border-slate-600 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50 rounded-t-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{editingDoc ? 'Modifier' : 'Ajouter'} Médecin</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-white transition-colors cursor-pointer"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <form onSubmit={handleSave} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold text-blue-600 dark:text-hpsj-blue mb-1">Nom *</label><input required className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded p-2 text-gray-900 dark:text-white focus:border-blue-500 outline-none" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} /></div>
              <div><label className="block text-xs font-bold text-blue-600 dark:text-hpsj-blue mb-1">Prénom</label><input className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded p-2 text-gray-900 dark:text-white focus:border-blue-500 outline-none" value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} /></div>
              <div className="md:col-span-2"><label className="block text-xs font-bold text-blue-600 dark:text-hpsj-blue mb-1">Spécialité</label><input className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded p-2 text-gray-900 dark:text-white focus:border-blue-500 outline-none" value={formData.specialite} onChange={e => setFormData({...formData, specialite: e.target.value})} /></div>
              <div><label className="block text-xs font-bold text-blue-600 dark:text-hpsj-blue mb-1">Lieu</label><input className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded p-2 text-gray-900 dark:text-white focus:border-blue-500 outline-none" value={formData.lieu} onChange={e => setFormData({...formData, lieu: e.target.value})} /></div>
              <div><label className="block text-xs font-bold text-blue-600 dark:text-hpsj-blue mb-1">RDV</label><input className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded p-2 text-gray-900 dark:text-white focus:border-blue-500 outline-none" value={formData.rdv} onChange={e => setFormData({...formData, rdv: e.target.value})} /></div>
              <div><label className="block text-xs font-bold text-blue-600 dark:text-hpsj-blue mb-1">Sec. CS</label><input className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded p-2 text-gray-900 dark:text-white focus:border-blue-500 outline-none" value={formData.secretariat_cs} onChange={e => setFormData({...formData, secretariat_cs: e.target.value})} /></div>
              <div><label className="block text-xs font-bold text-blue-600 dark:text-hpsj-blue mb-1">DECT</label><input className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded p-2 text-gray-900 dark:text-white focus:border-blue-500 outline-none" value={formData.dect} onChange={e => setFormData({...formData, dect: e.target.value})} /></div>
              <div><label className="block text-xs font-bold text-blue-600 dark:text-hpsj-blue mb-1">Sec. Hospi</label><input className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded p-2 text-gray-900 dark:text-white focus:border-blue-500 outline-none" value={formData.secretariat_hospi} onChange={e => setFormData({...formData, secretariat_hospi: e.target.value})} /></div>
              
              <div className="md:col-span-2 flex justify-end gap-2 mt-4 border-t border-gray-200 dark:border-slate-700 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">Annuler</button>
                <button 
                  type="submit" 
                  disabled={saving || isOfflineMode}
                  className={`px-4 py-2 rounded text-white font-bold transition-colors shadow-lg cursor-pointer flex items-center gap-2 ${saving ? 'bg-blue-400 dark:bg-blue-800' : 'bg-blue-600 dark:bg-hpsj-blue hover:bg-blue-700 dark:hover:bg-blue-600'}`}
                >
                  {saving && <i className="fa-solid fa-spinner fa-spin"></i>}
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default DirectoryView;
