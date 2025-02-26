// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import PageContent from './components/PageContent';
import AdminPanel from './components/AdminPanel';
import NotFound from './components/NotFound';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { ContentProvider } from './context/ContentContext';
import { AuthProvider } from './context/AuthContext';
import './styles/App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ContentProvider>
          <div className="app">
            <Sidebar />
            <div className="main-content">
              <Header />
              <div className="content-container">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<Login />} />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute>
                        <AdminPanel />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/:category/:page" element={<PageContent />} />
                  <Route path="/:category" element={<PageContent />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </div>
        </ContentProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;