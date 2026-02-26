
import React, { useState } from 'react';

const ContactView: React.FC = () => {
  const [subject, setSubject] = useState('Demande information');
  const [message, setMessage] = useState('');
  const [service, setService] = useState('Informatique');
  const [name, setName] = useState('');

  // Liste des contacts directs (emails simulés ou réels)
  const directContacts = [
    { label: 'Support Informatique', email: 'support-info@ghpsj.fr', icon: 'fa-laptop-code', color: 'bg-blue-600' },
    { label: 'Ressources Humaines', email: 'info-rh@ghpsj.fr', icon: 'fa-users', color: 'bg-pink-600' },
    { label: 'Direction', email: 'direction@ghpsj.fr', icon: 'fa-building', color: 'bg-slate-600' },
    { label: 'Service Technique', email: 'technique@ghpsj.fr', icon: 'fa-screwdriver-wrench', color: 'bg-orange-600' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construction du lien mailto
    const emailTo = service === 'Informatique' ? 'support-info@ghpsj.fr' : 
                    service === 'RH' ? 'info-rh@ghpsj.fr' : 'contact@ghpsj.fr';
                    
    const emailSubject = encodeURIComponent(`[Portail HPSJ] ${subject}`);
    const emailBody = encodeURIComponent(`
Nom: ${name}
Service concerné: ${service}

Message:
${message}

--------------------------------------------------
Envoyé depuis le Portail Hôpital Paris Saint-Joseph
    `);

    // Ouverture du client mail par défaut
    window.location.href = `mailto:${emailTo}?subject=${emailSubject}&body=${emailBody}`;
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-hpsj-cyan mb-2 drop-shadow-md">
          <i className="fa-solid fa-paper-plane mr-3"></i>Contactez-nous
        </h2>
        <p className="text-gray-400">Une question, un problème technique ou une suggestion ?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Formulaire */}
        <div className="md:col-span-2 bg-slate-800 border border-slate-600 rounded-xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <i className="fa-regular fa-envelope"></i> Envoyer un message
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Votre Nom</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-hpsj-blue outline-none"
                  placeholder="Jean Dupont"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Service destinataire</label>
                <select 
                  className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-hpsj-blue outline-none"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                >
                  <option value="Informatique">Support Informatique</option>
                  <option value="RH">Ressources Humaines</option>
                  <option value="Direction">Direction</option>
                  <option value="Autre">Autre demande</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Objet</label>
              <input 
                type="text" 
                required
                className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-hpsj-blue outline-none"
                placeholder="Ex: Problème d'accès au planning"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Message</label>
              <textarea 
                required
                className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-hpsj-blue outline-none min-h-[150px]"
                placeholder="Décrivez votre demande ici..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-hpsj-blue to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-3 rounded-lg shadow-lg transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-paper-plane"></i> Ouvrir ma messagerie (Gmail/Outlook)
            </button>
            <p className="text-xs text-center text-gray-500 mt-2">
              Cela ouvrira votre logiciel de messagerie par défaut avec le message pré-rempli.
            </p>
          </form>
        </div>

        {/* Contacts Directs */}
        <div className="space-y-4">
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4 uppercase text-sm tracking-wider">Contacts Directs</h3>
            <div className="space-y-3">
              {directContacts.map((contact, idx) => (
                <a 
                  key={idx}
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors border border-transparent hover:border-slate-500 group"
                >
                  <div className={`w-10 h-10 rounded-full ${contact.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <i className={`fa-solid ${contact.icon}`}></i>
                  </div>
                  <div>
                    <div className="font-bold text-gray-200 text-sm">{contact.label}</div>
                    <div className="text-xs text-hpsj-blue">{contact.email}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-500/30 rounded-xl p-6 shadow-lg text-center">
            <i className="fa-brands fa-google text-4xl text-white mb-3"></i>
            <h4 className="text-white font-bold mb-2">Vous utilisez Gmail ?</h4>
            <p className="text-xs text-indigo-200 mb-4">
              Assurez-vous que votre navigateur est configuré pour ouvrir les liens emails avec Gmail.
            </p>
            <a 
               href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@ghpsj.fr" 
               target="_blank"
               rel="noreferrer"
               className="inline-block bg-white text-indigo-900 px-4 py-2 rounded font-bold text-sm hover:bg-indigo-50 transition-colors"
            >
              <i className="fa-solid fa-arrow-up-right-from-square mr-2"></i>Ouvrir Gmail Web
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactView;
