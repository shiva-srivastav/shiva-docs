// src/App.js (with NotFound route)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PageContent from './components/PageContent';
import HomePage from './components/HomePage';
// import AdminPage from './components/AdminPage';
import AdminPage from './components/AdminPanel';
import NotFound from './components/NotFound';
import Footer from './components/Footer';
import { ContentProvider } from './context/ContentContext';
import './styles/App.css';

function App() {
  return (
    <ContentProvider>
      <Router>
        <div className="app">
          <Sidebar />
          <div className="main-content">
            <Header />
            <div className="content-container">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/:category/:page" element={<PageContent />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </div>
      </Router>
    </ContentProvider>
  );
}

export default App;