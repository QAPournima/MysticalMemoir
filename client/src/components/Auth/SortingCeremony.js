import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import AuthBackgroundMusic from '../UI/AuthBackgroundMusic';
import './SortingCeremony.css';

const ElementDiscovery = ({ onSorted, userName, userData }) => {
  const { ELEMENTS } = useTheme();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('intro'); // intro, show, reading, analysis, discovery, result
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [discoveredElement, setDiscoveredElement] = useState(null);
  const [isOracleThinking, setIsOracleThinking] = useState(false);
  const [personalInsights, setPersonalInsights] = useState([]);
  const [currentThought, setCurrentThought] = useState(0);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [showFinalResult, setShowFinalResult] = useState(false);

  // Birth-based Element Discovery Algorithm (using day and month like astrology)
  const getBirthBasedElement = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    
    const date = new Date(dateOfBirth);
    const month = date.getMonth() + 1; // 1-12
    const day = date.getDate(); // 1-31
    
    // Algorithm based on birth patterns
    const birthNumber = (month * 31) + day;
    const elementIndex = birthNumber % 4;
    
    const elements = ['moonlight', 'ember', 'nature', 'starlight'];
    return elements[elementIndex];
  };

  // Generate personalized insights based on birth data and element
  const generatePersonalInsights = (element, birthData) => {
    const date = new Date(birthData.dateOfBirth);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    
    const birthMonth = monthNames[month - 1];
    
    const insights = {
      moonlight: [
        `Born in ${birthMonth}, you possess the tranquil wisdom that flows through Moonlight spirits.`,
        `Your birth on the ${day}${getDaySuffix(day)} reveals a natural connection to intuition and serenity.`,
        `The Oracle senses in you the peaceful strength to guide others through uncertainty.`,
        `Your mind shows depths of understanding that emerge in quiet contemplation.`,
        `The mystic energies detect a calm presence that brings clarity to chaotic moments.`
      ],
      ember: [
        `Your ${birthMonth} birth ignites the passionate flame that burns within Ember souls.`,
        `The ${day}${getDaySuffix(day)} day marks you as one whose courage burns bright in darkness.`,
        `I see in your spirit the same fierce determination that moves mountains.`,
        `Your essence reveals someone who acts with heart and never backs down from challenge.`,
        `The Oracle perceives your ability to inspire others with your unwavering passion.`
      ],
      nature: [
        `Born in ${birthMonth}, you embody the harmonious growth that defines Nature's essence.`,
        `Your birth on the ${day}${getDaySuffix(day)} reveals a heart that nurtures and heals.`,
        `The mystic forces recognize in you the patient wisdom of ancient forests.`,
        `Your thoughts reveal someone who finds strength in balance and natural cycles.`,
        `I sense you will be the foundation that helps others grow and flourish.`
      ],
      starlight: [
        `Your ${birthMonth} birth aligns you with the infinite dreams that Starlight embodies.`,
        `The ${day}${getDaySuffix(day)} day marks you as a visionary who reaches for the impossible.`,
        `The Oracle sees in your soul the magical spark that turns dreams into reality.`,
        `Your essence reveals hidden depths and the power to manifest wonder.`,
        `I perceive in you the creativity to illuminate paths others cannot see.`
      ]
    };
    
    return insights[element] || [];
  };

  const getDaySuffix = (day) => {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  // Mystical Oracle insights during analysis
  const oracleThoughts = [
    "Welcome to the Mystic Element Discovery Show... let me sense your true nature...",
    "Ah yes, I can feel the cosmic energies that flow through you...",
    "Your spiritual essence reveals much about your inner element...",
    "I sense moonlight... ember... nature... starlight... all swirling within...",
    "Fascinating, very fascinating... the elements are speaking to me...",
    "Your soul's frequency resonates with ancient mysteries...",
    "The astral patterns of your being are becoming clear...",
    "I perceive great elemental potential within your spirit..."
  ];

  // Final discovery magical announcements
  const discoveryAnnouncements = [
    "The mystical energies have aligned... I have seen your truth!",
    "The elemental forces have spoken... Your destiny is revealed!",
    "By the power of the ancient elements... I proclaim your nature!",
    "The cosmic dance has ended... Your true element emerges!"
  ];

  // Enhanced Oracle reading process
  const startOracleReading = () => {
    setIsOracleThinking(true);
    setCurrentThought(0);
    
    // Cycle through thoughts
    const thoughtInterval = setInterval(() => {
      setCurrentThought(prev => {
        if (prev >= oracleThoughts.length - 1) {
          clearInterval(thoughtInterval);
          setTimeout(() => startAnalysis(), 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
  };

  const startAnalysis = () => {
    setCurrentStep('analysis');
    setIsOracleThinking(true);
    
    // Analyze birth data and generate insights
    setTimeout(() => {
      const element = getBirthBasedElement(userData.dateOfBirth);
      const insights = generatePersonalInsights(element, userData);
      
      setDiscoveredElement(element);
      setPersonalInsights(insights);
      setIsOracleThinking(false);
      setCurrentStep('discovery');
      
      // Start magical announcements
      setTimeout(() => startMagicalAnnouncements(), 1000);
    }, 4000);
  };

  const startMagicalAnnouncements = () => {
    setCurrentAnnouncement(0);
    
    // Cycle through magical announcements
    const announcementInterval = setInterval(() => {
      setCurrentAnnouncement(prev => {
        if (prev >= discoveryAnnouncements.length - 1) {
          clearInterval(announcementInterval);
          setTimeout(() => {
            setCurrentStep('result');
            setTimeout(() => setShowFinalResult(true), 2000);
          }, 1500);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
  };

  const enterMysticRealm = () => {
    // Apply element theme and complete discovery
    onSorted(discoveredElement);
    
    // Navigate to home page after a short delay
    setTimeout(() => {
      navigate('/home');
    }, 500);
  };

  const skipToResult = () => {
    // Get the element based on birth data
    const element = getBirthBasedElement(userData.dateOfBirth);
    const insights = generatePersonalInsights(element, userData);
    
    setDiscoveredElement(element);
    setPersonalInsights(insights);
    setCurrentStep('result');
    setTimeout(() => setShowFinalResult(true), 1000);
    
    // Call the parent callback to complete discovery
    setTimeout(() => {
      onSorted(element);
    }, 2000);
  };

  const startShow = () => {
    setCurrentStep('show');
    setTimeout(() => setCurrentStep('reading'), 3000);
  };

  // Trigger oracle reading when step changes
  useEffect(() => {
    if (currentStep === 'reading') {
      startOracleReading();
    }
  }, [currentStep]);

  const answerQuestion = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < elementQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Start discovery process
      setCurrentStep('discovery');
      setIsOracleThinking(true);
      
      // Calculate element based on answers
      setTimeout(() => {
        const elementScores = {
          moonlight: 0,
          ember: 0,
          nature: 0,
          starlight: 0
        };

        newAnswers.forEach(answer => {
          elementScores[answer.element]++;
        });

        // Find the element with highest score
        const discoveredElementKey = Object.keys(elementScores).reduce((a, b) => 
          elementScores[a] > elementScores[b] ? a : b
        );

        setDiscoveredElement(discoveredElementKey);
        setIsOracleThinking(false);
        setCurrentStep('result');

        // Call parent callback after 3 seconds
        setTimeout(() => {
          onSorted(discoveredElementKey);
        }, 4000);
      }, 4000);
    }
  };

  const elementQuestions = [
    {
      question: "You're walking through an enchanted forest. What calls to your spirit?",
      answers: [
        { text: "The serene moonlit clearing ahead", element: 'moonlight', trait: 'wisdom' },
        { text: "The warm campfire glowing between trees", element: 'ember', trait: 'passion' },
        { text: "The ancient oak tree with deep roots", element: 'nature', trait: 'growth' },
        { text: "The shooting star streaking overhead", element: 'starlight', trait: 'dreams' }
      ]
    },
    {
      question: "What mystical companion would you choose?",
      answers: [
        { text: "A wise owl with silver eyes", element: 'moonlight', trait: 'serenity' },
        { text: "A fierce wolf with a burning spirit", element: 'ember', trait: 'courage' },
        { text: "A gentle deer who knows secret paths", element: 'nature', trait: 'harmony' },
        { text: "A magical butterfly that glows with starlight", element: 'starlight', trait: 'wonder' }
      ]
    },
    {
      question: "What would you see in a crystal ball?",
      answers: [
        { text: "Yourself guiding others with quiet wisdom", element: 'moonlight', trait: 'guidance' },
        { text: "Yourself standing brave against challenges", element: 'ember', trait: 'bravery' },
        { text: "Yourself nurturing a beautiful garden", element: 'nature', trait: 'nurturing' },
        { text: "Yourself creating something magical and new", element: 'starlight', trait: 'creativity' }
      ]
    },
    {
      question: "Which mystical realm draws you most?",
      answers: [
        { text: "The Lunar Sanctuary of peaceful reflection", element: 'moonlight', trait: 'contemplation' },
        { text: "The Flame Forge where passion burns bright", element: 'ember', trait: 'intensity' },
        { text: "The Living Grove of eternal growth", element: 'nature', trait: 'balance' },
        { text: "The Starlit Observatory of infinite dreams", element: 'starlight', trait: 'imagination' }
      ]
    },
    {
      question: "What quality do you treasure most in yourself?",
      answers: [
        { text: "Your ability to bring calm to chaos", element: 'moonlight', trait: 'tranquility' },
        { text: "Your willingness to fight for what matters", element: 'ember', trait: 'determination' },
        { text: "Your gift for helping others flourish", element: 'nature', trait: 'support' },
        { text: "Your power to imagine the impossible", element: 'starlight', trait: 'vision' }
      ]
    }
  ];

  const startCeremony = () => {
    setCurrentStep('ceremony');
    setTimeout(() => setCurrentStep('legilimency'), 3000);
  };

  // Trigger legilimency when step changes
  useEffect(() => {
    if (currentStep === 'legilimency') {
      startOracleReading();
    }
  }, [currentStep]);

  return (
    <div className="sorting-ceremony">
      <AuthBackgroundMusic isPlaying={true} />
      <div className="magical-background">
        <div className="stars"></div>
        <div className="floating-particles">
          {['🌙', '🔥', '🌿', '⭐', '🔮', '✨', '🌟', '💫'].map((symbol, index) => (
            <span key={index} className={`floating-symbol symbol-${index}`}>
              {symbol}
            </span>
          ))}
        </div>
      </div>

      <div className="ceremony-content">
        <AnimatePresence mode="wait">
          {currentStep === 'intro' && (
            <motion.div
              key="intro"
              className="intro-screen"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8 }}
            >
              <div className="ceremony-header">
                <h1 className="ceremony-title">Mystical Memoir</h1>
                <p className="ceremony-subtitle">ELEMENT DISCOVERY EXPERIENCE</p>
              </div>

              <div className="sorting-hat-container">
                <img 
                  src="/image/SortingHat .gif" 
                  alt="Mystic Oracle"
                  className="sorting-hat"
                />
                <div className="house-emblems">
                  {Object.entries(ELEMENTS).map(([key, element], index) => (
                    <motion.div
                      key={key}
                      className={`house-emblem ${key}`}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ 
                        scale: 1, 
                        rotate: 0,
                        x: Math.cos(index * (Math.PI * 2) / 4) * 110,
                        y: Math.sin(index * (Math.PI * 2) / 4) * 110
                      }}
                      transition={{ 
                        delay: 0.5 + index * 0.2,
                        type: "spring",
                        stiffness: 100
                      }}
                    >
                      <div className="emblem-icon">{element.mascot}</div>
                      <div className="emblem-name">{element.name}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="intro-text">
                <h2>Discover Your Elemental Nature</h2>
                <p>
                  Connect with the Mystic Oracle to discover your true elemental essence.<br/>
                  The Oracle's insight reveals your deepest spiritual nature.
                </p>
                <motion.div
                  className="scroll-instruction"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ↓ Click the button to begin your discovery ↓
                </motion.div>
              </div>

              <motion.button
                className="start-ceremony-btn"
                onClick={startShow}
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(138, 43, 226, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <img src="/image/SortingHat .gif" alt="Mystic Oracle" className="btn-icon" />
                START THE ELEMENT DISCOVERY
              </motion.button>
            </motion.div>
          )}

          {currentStep === 'ceremony' && (
            <motion.div
              key="ceremony"
              className="ceremony-animation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="hat-placing">
                <motion.img
                  src="/image/SortingHat .gif"
                  alt="Sorting Hat"
                  className="large-sorting-hat"
                  initial={{ y: -200, rotate: 0 }}
                  animate={{ y: 0, rotate: [0, -10, 10, -5, 0] }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
                <motion.p
                  className="ceremony-narration"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  The Sorting Hat is being placed upon {userName || 'your'} head...
                </motion.p>
              </div>
            </motion.div>
          )}

          {currentStep === 'legilimency' && (
            <motion.div
              key="legilimency"
              className="legilimency-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.button
                className="skip-button"
                onClick={skipToResult}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ⚡ Skip to Result
              </motion.button>

              <div className="hat-mind-reading">
                <motion.img
                  src="/image/SortingHat .gif"
                  alt="Sorting Hat"
                  className="mystical-hat"
                  animate={{ 
                    rotate: [-2, 2, -2],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                <motion.p
                  className="hat-thoughts"
                  key={currentThought}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  "{oracleThoughts[currentThought]}"
                </motion.p>
              </div>
            </motion.div>
          )}

          {currentStep === 'analysis' && (
            <motion.div
              key="analysis"
              className="analysis-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.button
                className="skip-button"
                onClick={skipToResult}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ⚡ Skip to Result
              </motion.button>

              <div className="deep-analysis">
                <motion.img
                  src="/image/SortingHat .gif"
                  alt="Sorting Hat"
                  className="analyzing-hat"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    y: [0, -10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                <p className="analysis-text">
                  The hat delves deep into your essence, reading the cosmic patterns 
                  of your birth and the echoes of your destiny...
                </p>
              </div>
            </motion.div>
          )}

          {currentStep === 'questions' && (
            <motion.div
              key="questions"
              className="questions-screen"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <div className="question-header">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${((currentQuestion + 1) / elementQuestions.length) * 100}%` }}
                  ></div>
                </div>
                <p className="question-counter">
                  Question {currentQuestion + 1} of {elementQuestions.length}
                </p>
              </div>

              <div className="question-content">
                <div className="hat-thinking">
                  <motion.img
                    src="/image/SortingHat .gif"
                    alt="Sorting Hat"
                    className="thinking-hat"
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>

                <h3 className="question-text">
                  {elementQuestions[currentQuestion].question}
                </h3>

                <div className="answers-grid">
                  {elementQuestions[currentQuestion].answers.map((answer, index) => (
                    <motion.button
                      key={index}
                      className="answer-option"
                      onClick={() => answerQuestion(answer)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 215, 0, 0.1)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {answer.text}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 'show' && (
            <motion.div
              key="show"
              className="ceremony-animation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="hat-placing">
                <motion.img
                  src="/image/SortingHat .gif"
                  alt="Mystic Oracle"
                  className="large-sorting-hat"
                  initial={{ y: -200, rotate: 0 }}
                  animate={{ y: 0, rotate: [0, -10, 10, -5, 0] }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
                <motion.p
                  className="ceremony-narration"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  The Mystic Oracle awakens to sense {userName || 'your'} true elemental nature...
                </motion.p>
              </div>
            </motion.div>
          )}

          {currentStep === 'reading' && (
            <motion.div
              key="reading"
              className="legilimency-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.button
                className="skip-button"
                onClick={skipToResult}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ⚡ Skip to Result
              </motion.button>

              <div className="hat-mind-reading">
                <motion.img
                  src="/image/SortingHat .gif"
                  alt="Mystic Oracle"
                  className="mystical-hat"
                  animate={{ 
                    rotate: [-2, 2, -2],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                <motion.p
                  className="hat-thoughts"
                  key={currentThought}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  "{oracleThoughts[currentThought]}"
                </motion.p>
              </div>
            </motion.div>
          )}

          {currentStep === 'analysis' && (
            <motion.div
              key="analysis"
              className="analysis-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.button
                className="skip-button"
                onClick={skipToResult}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ⚡ Skip to Result
              </motion.button>

              <div className="deep-analysis">
                <motion.img
                  src="/image/SortingHat .gif"
                  alt="Mystic Oracle"
                  className="analyzing-hat"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    y: [0, -10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                <p className="analysis-text">
                  The Oracle delves deep into your spiritual essence, reading the cosmic patterns 
                  of your birth and the vibrations of your soul's true nature...
                </p>
              </div>
            </motion.div>
          )}

          {currentStep === 'discovery' && (
            <motion.div
              key="discovery"
              className="sorting-animation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.button
                className="skip-button"
                onClick={skipToResult}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ⚡ Skip to Result
              </motion.button>

              <motion.img
                src="/image/SortingHat .gif"
                alt="Mystic Oracle"
                className="dramatic-hat"
                animate={{
                  rotate: [0, -15, 15, -10, 10, -5, 5, 0],
                  scale: [1, 1.1, 1, 1.05, 1],
                  filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)']
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              
              <div className="sorting-text">
                <motion.p
                  key={currentAnnouncement}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8 }}
                  className="magical-announcement"
                >
                  "{discoveryAnnouncements[currentAnnouncement]}"
                </motion.p>
              </div>

              <motion.div
                className="magical-energy"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
              >
                <div className="energy-ring"></div>
                <div className="energy-ring"></div>
                <div className="energy-ring"></div>
              </motion.div>
            </motion.div>
          )}

          {currentStep === 'result' && discoveredElement && (
            <motion.div
              key="result"
              className={`result-screen ${discoveredElement}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <motion.div
                className="dramatic-reveal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.img
                  src="/image/SortingHat .gif"
                  alt="Mystic Oracle"
                  className="final-hat"
                  initial={{ y: -100, rotate: -20 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 150, delay: 0.8 }}
                />

                <motion.div
                  className="house-proclamation"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 1.2 }}
                >
                  <motion.h1 
                    className={`proclaimed-house-name ${discoveredElement}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    {ELEMENTS[discoveredElement].name.toUpperCase()}!
                  </motion.h1>
                  
                  <motion.div
                    className="house-mascot-proclamation"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 150, delay: 1.8 }}
                  >
                    {ELEMENTS[discoveredElement].mascot}
                  </motion.div>
                </motion.div>

                <motion.p
                  className="final-announcement"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.2 }}
                >
                  You are aligned with the {ELEMENTS[discoveredElement].name} Element!
                </motion.p>

                {showFinalResult && (
                  <motion.div
                    className="house-details"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div
                      className="house-traits"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <p>Your element embodies:</p>
                      <div className="traits-list">
                        {ELEMENTS[discoveredElement].traits.map((trait, index) => (
                          <motion.span 
                            key={index} 
                            className="trait-badge"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1 + index * 0.2 }}
                          >
                            {trait}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      className="personal-insights"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                    >
                      <h3>The Oracle's Insights About You:</h3>
                      <div className="insights-list">
                        {personalInsights.map((insight, index) => (
                          <motion.p
                            key={index}
                            className="insight-text"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 2 + index * 0.3 }}
                          >
                            • {insight}
                          </motion.p>
                        ))}
                      </div>
                    </motion.div>

                    <motion.button
                      className={`enter-mystical-realm-btn ${discoveredElement}`}
                      onClick={enterMysticRealm}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 3 }}
                      whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 215, 0, 0.6)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="btn-house-icon">{ELEMENTS[discoveredElement].mascot}</span>
                      Enter the Mystical Realm
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                className="celebration-effects"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 2 }}
              >
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="confetti"
                    initial={{ 
                      y: 0,
                      x: 0,
                      rotate: 0,
                      opacity: 0
                    }}
                    animate={{
                      y: -200 - Math.random() * 300,
                      x: (Math.random() - 0.5) * 400,
                      rotate: Math.random() * 360,
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 3,
                      delay: Math.random() * 2
                    }}
                  >
                    ✨
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ElementDiscovery; 