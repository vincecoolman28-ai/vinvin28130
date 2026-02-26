import React from 'react';
import { useNavigate } from 'react-router-dom';

export const QuiFaitQuoiView: React.FC = () => {
  const navigate = useNavigate();

  // Navigation locale avec React Router
  const handleNavigateToProgrammation = () => {
    // On passe un état (state) pour dire à la vue Secrétariats d'ouvrir l'onglet "progra"
    navigate('/secretariats', { state: { activeId: 'progra' } });
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto space-y-10 pb-10">
      
      {/* Intro Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-extrabold text-white mb-2 drop-shadow-md">
          <span className="text-hpsj-blue">Se repérer à l'hôpital :</span> Qui fait quoi ?
        </h2>
        <p className="text-lg text-gray-300 max-w-4xl mx-auto">
          Dans le parcours de soins, il est parfois difficile de savoir à qui s’adresser. 
          Bien que les secrétaires travaillent souvent en étroite collaboration, leurs rôles sont distincts 
          et correspondent à des étapes différentes de votre prise en charge.
        </p>
      </div>

      {/* 3 Main Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Card 1: Consultation (Blue) */}
        <div className="bg-slate-900 border border-blue-500 rounded-xl overflow-hidden shadow-lg shadow-blue-500/10 hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1">
          <div className="bg-blue-600 p-4 text-white">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <i className="fa-solid fa-user-doctor text-2xl"></i>
              1. Secrétariat de Consultation
            </h3>
            <p className="text-blue-100 text-sm italic mt-1">La porte d'entrée</p>
          </div>
          <div className="p-6">
            <p className="text-gray-300 mb-4 text-sm">
              C’est généralement votre premier point de contact. Ce secrétariat gère l'agenda des médecins pour les visites externes.
            </p>
            <div className="bg-blue-900/30 p-3 rounded-lg mb-4 border-l-4 border-blue-500">
              <strong className="text-blue-400 text-sm block mb-1">Quand les contacter ?</strong>
              <span className="text-gray-300 text-xs">Au début du parcours ou pour le suivi.</span>
            </div>
            <h4 className="text-white font-bold mb-2 border-b border-gray-700 pb-1">Missions principales :</h4>
            <ul className="list-disc pl-5 text-gray-400 text-sm space-y-2 marker:text-blue-500">
              <li>Donner un rendez-vous avec un spécialiste.</li>
              <li>Gérer votre dossier médical (courriers, résultats).</li>
              <li>Accueillir les patients en salle d'attente.</li>
              <li>Rédiger et envoyer les comptes-rendus.</li>
            </ul>
          </div>
        </div>

        {/* Card 2: Programmation (Orange) */}
        <div 
          onClick={handleNavigateToProgrammation}
          className="bg-slate-900 border border-orange-500 rounded-xl overflow-hidden shadow-lg shadow-orange-500/10 hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
          title="Cliquez pour voir les numéros de programmation"
        >
          <div className="bg-orange-600 p-4 text-white flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <i className="fa-solid fa-calendar-check text-2xl"></i>
                2. Secrétariat de Programmation
              </h3>
              <p className="text-orange-100 text-sm italic mt-1">L'organisation de l'intervention</p>
            </div>
            <i className="fa-solid fa-arrow-right text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all text-xl"></i>
          </div>
          <div className="p-6 relative">
            <div className="absolute top-2 right-2 text-xs bg-orange-600 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Voir les contacts</div>
            <p className="text-gray-300 mb-4 text-sm">
              Intervient une fois la décision d'opérer prise. C’est le "chef d’orchestre" logistique de votre intervention.
            </p>
            <div className="bg-orange-900/30 p-3 rounded-lg mb-4 border-l-4 border-orange-500">
              <strong className="text-orange-400 text-sm block mb-1">Quand les contacter ?</strong>
              <span className="text-gray-300 text-xs">Une fois l'opération validée par le médecin.</span>
            </div>
            <h4 className="text-white font-bold mb-2 border-b border-gray-700 pb-1">Missions principales :</h4>
            <ul className="list-disc pl-5 text-gray-400 text-sm space-y-2 marker:text-orange-500">
              <li>Fixer la date de l'opération avec le bloc.</li>
              <li>Organiser les RDV pré-opératoires (anesthésie...).</li>
              <li>Communiquer les consignes pré-opératoires.</li>
              <li>Gérer la disponibilité du matériel spécifique.</li>
            </ul>
          </div>
        </div>

        {/* Card 3: Hospitalisation (Green) */}
        <div className="bg-slate-900 border border-green-500 rounded-xl overflow-hidden shadow-lg shadow-green-500/10 hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-1">
          <div className="bg-green-600 p-4 text-white">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <i className="fa-solid fa-bed-pulse text-2xl"></i>
              3. Secrétariat d'Hospitalisation
            </h3>
            <p className="text-green-100 text-sm italic mt-1">La gestion du séjour</p>
          </div>
          <div className="p-6">
            <p className="text-gray-300 mb-4 text-sm">
              Situé au cœur du service d'étage. Il gère la vie quotidienne administrative pendant que le patient est hospitalisé.
            </p>
            <div className="bg-green-900/30 p-3 rounded-lg mb-4 border-l-4 border-green-500">
              <strong className="text-green-400 text-sm block mb-1">Quand les contacter ?</strong>
              <span className="text-gray-300 text-xs">Pendant le séjour ou juste après la sortie.</span>
            </div>
            <h4 className="text-white font-bold mb-2 border-b border-gray-700 pb-1">Missions principales :</h4>
            <ul className="list-disc pl-5 text-gray-400 text-sm space-y-2 marker:text-green-500">
              <li>Gérer les entrées et sorties administratives.</li>
              <li>Lien avec la famille (visites, nouvelles).</li>
              <li>Documents de sortie (arrêts, ordonnances).</li>
              <li>Bulletins de situation pour employeur/mutuelle.</li>
            </ul>
          </div>
        </div>

      </div>

      {/* Summary Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-600 overflow-hidden shadow-xl mt-12">
        <div className="bg-slate-700 p-4 border-b border-slate-600">
          <h3 className="text-xl font-bold text-center text-white uppercase tracking-wider">
            <i className="fa-solid fa-list-check mr-2"></i> En résumé : Qui appeler ?
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-gray-400 text-sm uppercase">
                <th className="p-4 border-b border-slate-600 w-2/3">Si vous voulez...</th>
                <th className="p-4 border-b border-slate-600 w-1/3">Appelez le...</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 text-gray-200">
              <tr className="hover:bg-slate-700/50 transition-colors">
                <td className="p-4">Prendre ou déplacer un rendez-vous avec le docteur.</td>
                <td className="p-4 font-bold text-blue-400">Secrétariat de Consultation</td>
              </tr>
              <tr className="hover:bg-slate-700/50 transition-colors">
                <td className="p-4">Changer la date de votre opération ou poser une question sur votre convocation au bloc.</td>
                <td className="p-4 font-bold text-orange-400">Secrétariat de Programmation</td>
              </tr>
              <tr className="hover:bg-slate-700/50 transition-colors">
                <td className="p-4">Obtenir un bulletin de présence, un arrêt de travail ou votre dossier de sortie après une opération.</td>
                <td className="p-4 font-bold text-green-400">Secrétariat d'Hospitalisation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};