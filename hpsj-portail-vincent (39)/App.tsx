
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import Navigation from './components/Navigation';
import AssistantIA from './components/AssistantIA';
import DirectoryView from './components/views/DirectoryView';
import MapView from './components/views/MapView';
import DrhView from './components/views/DrhView';
import { SecretariatsView } from './components/views/SecretariatsView';
import GlobalSearch from './components/GlobalSearch';
import DashboardView from './components/views/DashboardView';
import IndoorGPSView from './components/views/IndoorGPSView'; 
import GlobalDirectoryView from './components/views/GlobalDirectoryView';
import BackToTop from './components/BackToTop';
import ContactView from './components/views/ContactView';
import PlanHospitalierView from './components/views/PlanHospitalierView';
import { QuiFaitQuoiView } from './components/views/QuiFaitQuoiView';
import { 
  GuardsView, 
  ConsultationView, 
  UsefulNumbersView, 
  EncadrementView, 
  ChefsView, 
  CadresView,
  LosserandView,
  ServicesView
} from './components/views/StaticDataViews';

const AppContent: React.FC = () => {
  useEffect(() => {
    const warningTitleCSS = 'color: red; font-size: 40px; font-weight: bold; text-shadow: 2px 2px black;';
    const warningBodyCSS = 'font-size: 16px; color: white; background-color: red; padding: 5px; border-radius: 5px;';
    
    console.clear();
    console.log('%cARRÊT !', warningTitleCSS);
    console.log("%cIl est interdit d'accéder au code source ou aux données de cette application.", warningBodyCSS);
    console.log('%cToute tentative d\'extraction de données est monitorée.', 'font-size: 14px; font-style: italic;');
  }, []);

  return (
    <div className="min-h-screen text-gray-100 flex flex-col font-sans relative">
      <Header />
      <Navigation />
      
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<DashboardView />} />
          <Route path="/annuaire-global" element={<GlobalDirectoryView />} />
          <Route path="/gps" element={<IndoorGPSView />} />
          <Route path="/qui-fait-quoi" element={<QuiFaitQuoiView />} />
          <Route path="/annuaire" element={<DirectoryView />} />
          <Route path="/plan" element={<MapView />} />
          <Route path="/drh" element={<DrhView />} />
          <Route path="/gardes" element={<GuardsView />} />
          <Route path="/consultations" element={<ConsultationView />} />
          <Route path="/utiles" element={<UsefulNumbersView />} />
          <Route path="/secretariats" element={<SecretariatsView />} />
          <Route path="/encadrement" element={<EncadrementView />} />
          <Route path="/chefs" element={<ChefsView />} />
          <Route path="/cadres" element={<CadresView />} />
          <Route path="/services" element={<ServicesView />} />
          <Route path="/losserand" element={<LosserandView />} />
          <Route path="/contact" element={<ContactView />} />
          <Route path="/plan-hospitalier" element={<PlanHospitalierView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <BackToTop />
      <GlobalSearch />
      <AssistantIA />

      <footer className="bg-slate-900/90 border-t border-slate-700 p-4 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} HPSJ Portail vincent
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
