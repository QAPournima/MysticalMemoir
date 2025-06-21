import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import AuthBackgroundMusic from '../UI/AuthBackgroundMusic';
import './SortingCeremony.css';

const SortingCeremony = ({ onSorted, userName, userData }) => {
  const { HOUSES } = useTheme();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('intro'); // intro, ceremony, legilimency, analysis, sorting, result
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [sortedHouse, setSortedHouse] = useState(null);
  const [isHatThinking, setIsHatThinking] = useState(false);
  const [personalInsights, setPersonalInsights] = useState([]);
  const [currentThought, setCurrentThought] = useState(0);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [showFinalResult, setShowFinalResult] = useState(false);

  // Birth-based Sorting Algorithm (using day and month like astrology)
  const getBirthBasedHouse = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    
    const date = new Date(dateOfBirth);
    const month = date.getMonth() + 1; // 1-12
    const day = date.getDate(); // 1-31
    
    // Algorithm based on birth patterns
    const birthNumber = (month * 31) + day;
    const houseIndex = birthNumber % 4;
    
    const houses = ['gryffindor', 'ravenclaw', 'hufflepuff', 'slytherin'];
    return houses[houseIndex];
  };

  // Generate personalized insights based on birth data and house
  const generatePersonalInsights = (house, birthData) => {
    const date = new Date(birthData.dateOfBirth);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    
    const birthMonth = monthNames[month - 1];
    
    const insights = {
      gryffindor: [
        `Born in ${birthMonth}, you possess the fiery determination characteristic of true Gryffindors.`,
        `Your birth on the ${day}${getDaySuffix(day)} reveals a natural inclination toward brave leadership.`,
        `The Sorting Hat senses in you the courage to stand against injustice, much like Harry Potter himself.`,
        `Your mind shows flashes of daring adventures and heroic deeds yet to come.`,
        `The hat detects a strong moral compass that will guide you through dark times.`
      ],
      ravenclaw: [
        `Your ${birthMonth} birth grants you the wisdom-seeking nature valued by Ravenclaw.`,
        `The ${day}${getDaySuffix(day)} day of your birth aligns with the scholarly pursuits of this noble house.`,
        `I see in your thoughts a thirst for knowledge that rivals even Hermione Granger's dedication.`,
        `Your mind palace already contains mysteries waiting to be unraveled.`,
        `The hat perceives your potential to solve puzzles that would confound others.`
      ],
      hufflepuff: [
        `Born in ${birthMonth}, you embody the loyal and steadfast nature of Hufflepuff house.`,
        `Your birth on the ${day}${getDaySuffix(day)} reveals a heart full of kindness and dedication.`,
        `The Sorting Hat recognizes in you the same unwavering loyalty as Cedric Diggory.`,
        `Your thoughts reveal someone who values friendship above personal glory.`,
        `I sense you will be the foundation upon which others build their courage.`
      ],
      slytherin: [
        `Your ${birthMonth} birth bestows upon you the ambitious drive that Slytherin values.`,
        `The ${day}${getDaySuffix(day)} day marks you as one destined for greatness through cunning and determination.`,
        `The hat sees in your mind the strategic thinking that could rival Severus Snape himself.`,
        `Your thoughts reveal hidden depths and the ability to achieve what others deem impossible.`,
        `I perceive in you the resourcefulness to turn any situation to your advantage.`
      ]
    };
    
    return insights[house] || [];
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

  // Legilimency thoughts during analysis
  const legilimencyThoughts = [
    "Interesting... let me see what lies within your mind...",
    "Ah yes, I can sense your deepest values and desires...",
    "Your memories reveal much about your character...",
    "I see courage... intelligence... loyalty... ambition...",
    "Difficult, very difficult to choose just one quality...",
    "Your heart speaks louder than your fears...",
    "The path you've walked has shaped who you are...",
    "I sense great potential within you..."
  ];

  // Final sorting magical announcements
  const sortingAnnouncements = [
    "The ancient magic flows through me... I have decided!",
    "The threads of destiny have been woven... Your path is clear!",
    "By the power of the founders... I proclaim your house!",
    "The mystical forces have spoken... Your true home awaits!"
  ];

  // Enhanced Legilimency process
  const startLegilimency = () => {
    setIsHatThinking(true);
    setCurrentThought(0);
    
    // Cycle through thoughts
    const thoughtInterval = setInterval(() => {
      setCurrentThought(prev => {
        if (prev >= legilimencyThoughts.length - 1) {
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
    setIsHatThinking(true);
    
    // Analyze birth data and generate insights
    setTimeout(() => {
      const house = getBirthBasedHouse(userData.dateOfBirth);
      const insights = generatePersonalInsights(house, userData);
      
      setSortedHouse(house);
      setPersonalInsights(insights);
      setIsHatThinking(false);
      setCurrentStep('sorting');
      
      // Start magical announcements
      setTimeout(() => startMagicalAnnouncements(), 1000);
    }, 4000);
  };

  const startMagicalAnnouncements = () => {
    setCurrentAnnouncement(0);
    
    // Cycle through magical announcements
    const announcementInterval = setInterval(() => {
      setCurrentAnnouncement(prev => {
        if (prev >= sortingAnnouncements.length - 1) {
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

  const enterHogwarts = () => {
    // Apply house theme and complete sorting
    onSorted(sortedHouse);
    
    // Navigate to home page after a short delay
    setTimeout(() => {
      navigate('/home');
    }, 500);
  };

  const skipToResult = () => {
    // Get the house based on birth data
    const house = getBirthBasedHouse(userData.dateOfBirth);
    const insights = generatePersonalInsights(house, userData);
    
    setSortedHouse(house);
    setPersonalInsights(insights);
    setCurrentStep('result');
    setTimeout(() => setShowFinalResult(true), 1000);
    
    // Call the parent callback to complete sorting
    setTimeout(() => {
      onSorted(house);
    }, 2000);
  };

  const sortingQuestions = [
    {
      question: "You're walking down a dark corridor at Hogwarts. What draws your attention?",
      answers: [
        { text: "The mysterious glowing door at the end", house: 'gryffindor', trait: 'courage' },
        { text: "The ancient book left on a nearby table", house: 'ravenclaw', trait: 'wisdom' },
        { text: "The hidden passage behind a tapestry", house: 'slytherin', trait: 'cunning' },
        { text: "The warm light coming from under a door", house: 'hufflepuff', trait: 'loyalty' }
      ]
    },
    {
      question: "What magical creature would you most like to study?",
      answers: [
        { text: "A fierce dragon breathing fire", house: 'gryffindor', trait: 'bravery' },
        { text: "A wise phoenix with healing tears", house: 'ravenclaw', trait: 'knowledge' },
        { text: "A cunning basilisk with deadly eyes", house: 'slytherin', trait: 'ambition' },
        { text: "A loyal hippogriff who remembers kindness", house: 'hufflepuff', trait: 'friendship' }
      ]
    },
    {
      question: "What would you see in the Mirror of Erised?",
      answers: [
        { text: "Yourself as a celebrated hero", house: 'gryffindor', trait: 'glory' },
        { text: "Yourself solving the world's mysteries", house: 'ravenclaw', trait: 'discovery' },
        { text: "Yourself as the most powerful wizard", house: 'slytherin', trait: 'power' },
        { text: "Yourself surrounded by loved ones", house: 'hufflepuff', trait: 'belonging' }
      ]
    },
    {
      question: "Which magical subject excites you most?",
      answers: [
        { text: "Defense Against the Dark Arts", house: 'gryffindor', trait: 'protection' },
        { text: "Ancient Runes and Arithmancy", house: 'ravenclaw', trait: 'learning' },
        { text: "Potions and their secrets", house: 'slytherin', trait: 'mastery' },
        { text: "Herbology and Care of Magical Creatures", house: 'hufflepuff', trait: 'nurturing' }
      ]
    },
    {
      question: "What quality do you value most in others?",
      answers: [
        { text: "Their willingness to stand up for what's right", house: 'gryffindor', trait: 'justice' },
        { text: "Their ability to think deeply and creatively", house: 'ravenclaw', trait: 'intelligence' },
        { text: "Their determination to achieve their goals", house: 'slytherin', trait: 'achievement' },
        { text: "Their kindness and reliability", house: 'hufflepuff', trait: 'goodness' }
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
      startLegilimency();
    }
  }, [currentStep]);

  const answerQuestion = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < sortingQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Start sorting process
      setCurrentStep('sorting');
      setIsHatThinking(true);
      
      // Calculate house based on answers
      setTimeout(() => {
        const houseScores = {
          gryffindor: 0,
          ravenclaw: 0,
          slytherin: 0,
          hufflepuff: 0
        };

        newAnswers.forEach(answer => {
          houseScores[answer.house]++;
        });

        // Find the house with highest score
        const sortedHouseKey = Object.keys(houseScores).reduce((a, b) => 
          houseScores[a] > houseScores[b] ? a : b
        );

        setSortedHouse(sortedHouseKey);
        setIsHatThinking(false);
        setCurrentStep('result');

        // Call parent callback after 3 seconds
        setTimeout(() => {
          onSorted(sortedHouseKey);
        }, 4000);
      }, 4000);
    }
  };

  return (
    <div className="sorting-ceremony">
      <AuthBackgroundMusic isPlaying={true} />
      <div className="magical-background">
        <div className="stars"></div>
        <div className="floating-particles">
          {['✨', '🪄', '⚡', '🦉', '📜', '🕯️', '⭐', '🏰'].map((symbol, index) => (
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
                <h1 className="ceremony-title">Hogwarts</h1>
                <p className="ceremony-subtitle">HOUSE SORTING CEREMONY</p>
              </div>

              <div className="sorting-hat-container">
                <img 
                  src="/image/SortingHat .gif" 
                  alt="Sorting Hat"
                  className="sorting-hat"
                />
                <div className="house-emblems">
                  {Object.entries(HOUSES).map(([key, house], index) => (
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
                      <div className="emblem-icon">{house.mascot}</div>
                      <div className="emblem-name">{house.name}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="intro-text">
                <h2>Discover your Hogwarts House</h2>
                <p>
                  Don the Sorting Hat to be placed into your rightful Hogwarts house.<br/>
                  The Sorting Hat's decision is final.
                </p>
                <motion.div
                  className="scroll-instruction"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ↓ Click the button to begin the ceremony ↓
                </motion.div>
              </div>

              <motion.button
                className="start-ceremony-btn"
                onClick={startCeremony}
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(138, 43, 226, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <img src="/image/SortingHat .gif" alt="Sorting Hat" className="btn-icon" />
                START THE SORTING CEREMONY
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
                  "{legilimencyThoughts[currentThought]}"
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
                    style={{ width: `${((currentQuestion + 1) / sortingQuestions.length) * 100}%` }}
                  ></div>
                </div>
                <p className="question-counter">
                  Question {currentQuestion + 1} of {sortingQuestions.length}
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
                  {sortingQuestions[currentQuestion].question}
                </h3>

                <div className="answers-grid">
                  {sortingQuestions[currentQuestion].answers.map((answer, index) => (
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

          {currentStep === 'sorting' && (
            <motion.div
              key="sorting"
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
                alt="Sorting Hat"
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
                  "{sortingAnnouncements[currentAnnouncement]}"
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

          {currentStep === 'result' && sortedHouse && (
            <motion.div
              key="result"
              className={`result-screen ${sortedHouse}`}
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
                  alt="Sorting Hat"
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
                    className={`proclaimed-house-name ${sortedHouse}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    {HOUSES[sortedHouse].name.toUpperCase()}!
                  </motion.h1>
                  
                  <motion.div
                    className="house-mascot-proclamation"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 150, delay: 1.8 }}
                  >
                    {HOUSES[sortedHouse].mascot}
                  </motion.div>
                </motion.div>

                <motion.p
                  className="final-announcement"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.2 }}
                >
                  Welcome to {HOUSES[sortedHouse].name} House!
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
                      <p>Your house values:</p>
                      <div className="traits-list">
                        {HOUSES[sortedHouse].traits.map((trait, index) => (
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
                      <h3>The Sorting Hat's Insights About You:</h3>
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
                      className={`enter-hogwarts-btn ${sortedHouse}`}
                      onClick={enterHogwarts}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 3 }}
                      whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 215, 0, 0.6)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="btn-house-icon">{HOUSES[sortedHouse].mascot}</span>
                      Enter {HOUSES[sortedHouse].name} House
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

export default SortingCeremony; 