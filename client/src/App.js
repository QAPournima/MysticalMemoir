import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Components  
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import DiaryList from './components/Diary/DiaryList';
import DiaryEditor from './components/Diary/DiaryEditor';
import TodoList from './components/Todo/TodoList';
import DrawingCanvas from './components/Drawing/DrawingCanvas';
import Gallery from './components/Gallery/Gallery';
import Settings from './components/Settings/Settings';
import LoadingSpinner from './components/UI/LoadingSpinner';
import MusicPlayer from './components/UI/MusicPlayer';
import InAppNotification from './components/UI/InAppNotification';
import ThemeAnimations from './components/UI/ThemeAnimations';

import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';

// Context
import { DiaryProvider } from './context/DiaryContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';


// Inner App component that can access theme context
function AppContent() {
  const { getCurrentUITheme, currentHouse, changeHouse } = useTheme();
  const currentTheme = getCurrentUITheme();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem('user_authenticated') === 'true';
    setIsAuthenticated(authStatus);

    // Show loading for 2.2 seconds on initial load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleSignUp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.removeItem('user_authenticated');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_name');
      setIsAuthenticated(false);
      setIsLoading(false);
    }, 1200);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  };

  // Show loading spinner on initial load or page refresh
  if (isLoading) {
    const loadingMessages = [
      "Loading magical content...",
      "Summoning Hogwarts houses...",
      "Preparing magical diary...",
      "Casting loading spells...",
      "Accessing magical archives...",
      "Weaving house magic..."
    ];
    const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    return <LoadingSpinner message={randomMessage} />;
  }

  // Show auth pages if not authenticated
  if (!isAuthenticated) {
    return (
      <Router>
        <div className="app">
          <Routes>
            <Route 
              path="/login" 
              element={
                <motion.div
                  key="login"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Login onLogin={handleLogin} />
                </motion.div>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <motion.div
                  key="signup"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <SignUp onSignUp={handleSignUp} />
                </motion.div>
              } 
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    );
  }

  return (
    <DiaryProvider>
      <Router>
        <div className={`app ${currentHouse}-theme`}>
          <div className="magical-background">
            <div className="stars"></div>
            <div className="floating-particles">
              {['✨', '🪄', '⚡', '🔮', '🦉', '📜', '🕯️', '⭐', '🌟', '💫', '🏰', '📖', '🎨', '✨', '🪄'].map((symbol, index) => (
                <span key={`${symbol}-${index}`} className={`floating-symbol symbol-${index}`}>
                  {symbol}
                </span>
              ))}
            </div>
          </div>
          
          <ThemeAnimations />
          
          <Navbar currentHouse={currentHouse} setCurrentHouse={changeHouse} onLogout={handleLogout} />
          <MusicPlayer />
          <InAppNotification />
          
          <main className="main-content">
            <AnimatePresence mode="wait">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <motion.div
                      key="home"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Home />
                    </motion.div>
                  } 
                />
                
                <Route 
                  path="/home" 
                  element={
                    <motion.div
                      key="home-page"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Home />
                    </motion.div>
                  } 
                />
                
                <Route 
                  path="/diary" 
                  element={
                    <motion.div
                      key="diary-list"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <DiaryList />
                    </motion.div>
                  } 
                />
                
                <Route 
                  path="/diary/new" 
                  element={
                    <motion.div
                      key="diary-new"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <DiaryEditor />
                    </motion.div>
                  } 
                />
                
                <Route 
                  path="/diary/:id" 
                  element={
                    <motion.div
                      key="diary-edit"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <DiaryEditor />
                    </motion.div>
                  } 
                />
                
                <Route 
                  path="/todos" 
                  element={
                    <motion.div
                      key="todos"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <TodoList />
                    </motion.div>
                  } 
                />
                
                <Route 
                  path="/drawing" 
                  element={
                    <motion.div
                      key="drawing"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <DrawingCanvas />
                    </motion.div>
                  } 
                />
                
                <Route 
                  path="/gallery" 
                  element={
                    <motion.div
                      key="gallery"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Gallery />
                    </motion.div>
                  } 
                />
                
                <Route 
                  path="/settings" 
                  element={
                    <motion.div
                      key="settings"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Settings currentHouse={currentHouse} setCurrentHouse={changeHouse} />
                    </motion.div>
                  } 
                />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </Router>
    </DiaryProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App; 