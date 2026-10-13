import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import DiagnosticQuizPage from './pages/DiagnosticQuizPage';
import GapAnalysisPage from './pages/GapAnalysisPage';
import PersonalizedLearningPage from './pages/PersonalizedLearningPage';
import RetestPage from './pages/RetestPage';
import TeacherInsightsPage from './pages/TeacherInsightsPage';
import AboutDocsPage from './pages/AboutDocsPage';

// Storage services
import { 
  loadDiagnosticResult, 
  loadRetestResult, 
  getActivityHistory, 
  getPracticedTopics,
  hasUserAssessment,
  seedSampleDemoData 
} from './services/storageService';

export default function App() {
  const [activePage, setActivePage] = useState('landing');
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [retestResult, setRetestResult] = useState(null);
  const [activityHistory, setActivityHistory] = useState([]);
  const [practicedTopics, setPracticedTopics] = useState([]);
  const [studyTopicId, setStudyTopicId] = useState('functions');

  // Load or seed initial data on component mount
  const refreshStorageData = () => {
    let diag = loadDiagnosticResult();

    // If first launch ever with no data, seed realistic demo data
    if (!diag && !hasUserAssessment()) {
      diag = seedSampleDemoData();
    }

    setDiagnosticResult(diag);
    setRetestResult(loadRetestResult());
    setActivityHistory(getActivityHistory());
    setPracticedTopics(getPracticedTopics());
  };

  useEffect(() => {
    refreshStorageData();
  }, []);

  const handleNavigate = (pageId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectStudyTopic = (topicId) => {
    setStudyTopicId(topicId);
    setActivePage('learning');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDiagnosticCompleted = (newResult) => {
    setDiagnosticResult(newResult);
    refreshStorageData();
    // Prompt to review or gap analysis
  };

  const handleRetestCompleted = (newRetest) => {
    setRetestResult(newRetest);
    refreshStorageData();
  };

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar 
        activePage={activePage} 
        setActivePage={handleNavigate} 
        onDataReset={refreshStorageData}
      />

      {/* Main Page Content */}
      <main className="flex-1 w-full">
        {activePage === 'landing' && (
          <LandingPage onNavigate={handleNavigate} />
        )}

        {activePage === 'dashboard' && (
          <DashboardPage
            diagnosticResult={diagnosticResult}
            retestResult={retestResult}
            activityHistory={activityHistory}
            practicedTopics={practicedTopics}
            onNavigate={handleNavigate}
            onResetData={refreshStorageData}
          />
        )}

        {activePage === 'diagnostic' && (
          <DiagnosticQuizPage
            onCompleted={handleDiagnosticCompleted}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'analysis' && (
          <GapAnalysisPage
            diagnosticResult={diagnosticResult}
            onNavigate={handleNavigate}
            onSelectStudyTopic={handleSelectStudyTopic}
          />
        )}

        {activePage === 'learning' && (
          <PersonalizedLearningPage
            diagnosticResult={diagnosticResult}
            initialSelectedTopicId={studyTopicId}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'retest' && (
          <RetestPage
            diagnosticResult={diagnosticResult}
            retestResult={retestResult}
            onRetestCompleted={handleRetestCompleted}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'teacher' && (
          <TeacherInsightsPage />
        )}

        {activePage === 'about' && (
          <AboutDocsPage />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
