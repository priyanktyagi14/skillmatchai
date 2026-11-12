import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import { JobMatcherPage } from './pages/JobMatcher/JobMatcherPage';
import { SkillGapPage } from './pages/SkillGap/SkillGapPage';
import { RoadmapPage } from './pages/Roadmap/RoadmapPage';
import { ResumeBuilderPage } from './pages/Resume/ResumeBuilderPage';
import { SavedJobsPage } from './pages/SavedJobs/SavedJobsPage';
import { RegistrationPage } from './pages/Registration/RegistrationPage';
import { LandingPage } from './pages/Landing/LandingPage';

function AppRoutes() {
  const { isRegistered } = useApp();

  if (!isRegistered) {
    return (
      <Routes>
        {/* Professional Landing & Onboarding Showcase is default for visitors */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        
        {/* Guided Registration & Profile Setup */}
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/onboarding" element={<RegistrationPage />} />
        
        {/* Protected routes redirect to Onboarding if accessed directly */}
        <Route path="/profile" element={<Navigate to="/register" replace />} />
        <Route path="/job-matcher" element={<Navigate to="/register" replace />} />
        <Route path="/skill-gap" element={<Navigate to="/register" replace />} />
        <Route path="/roadmap" element={<Navigate to="/register" replace />} />
        <Route path="/resume" element={<Navigate to="/register" replace />} />
        <Route path="/saved-jobs" element={<Navigate to="/register" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/register" element={<Navigate to="/" replace />} />
      <Route path="/onboarding" element={<Navigate to="/" replace />} />
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="job-matcher" element={<JobMatcherPage />} />
        <Route path="skill-gap" element={<SkillGapPage />} />
        <Route path="roadmap" element={<RoadmapPage />} />
        <Route path="resume" element={<ResumeBuilderPage />} />
        <Route path="saved-jobs" element={<SavedJobsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
