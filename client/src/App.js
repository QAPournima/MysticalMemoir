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
  const { getCurrentUITheme } = useTheme();
  const currentTheme = getCurrentUITheme();

  const [currentHouse, setCurrentHouse] = useState('gryffindor');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Load user preferences
    const savedHouse = localStorage.getItem('selected_house') || 'gryffindor';
    setCurrentHouse(savedHouse);
    
    // Check authentication status
    const authStatus = localStorage.getItem('user_authenticated') === 'true';
    setIsAuthenticated(authStatus);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleSignUp = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user_authenticated');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    setIsAuthenticated(false);
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
          
          <Navbar currentHouse={currentHouse} setCurrentHouse={setCurrentHouse} onLogout={handleLogout} />
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
                      <Settings currentHouse={currentHouse} setCurrentHouse={setCurrentHouse} />
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App; 