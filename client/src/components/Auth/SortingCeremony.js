import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import './SortingCeremony.css';

const SortingCeremony = ({ onSorted, userName }) => {
  const { HOUSES } = useTheme();
  const [currentStep, setCurrentStep] = useState('intro'); // intro, ceremony, questions, sorting, result
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [sortedHouse, setSortedHouse] = useState(null);
  const [isHatThinking, setIsHatThinking] = useState(false);

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
    setTimeout(() => setCurrentStep('questions'), 3000);
  };

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
                <h1 className="ceremony-title">Harry Potter</h1>
                <p className="ceremony-subtitle">SORTING CEREMONY</p>
              </div>

              <div className="sorting-hat-container">
                <div className="sorting-hat">🎩</div>
                <div className="house-emblems">
                  {Object.entries(HOUSES).map(([key, house], index) => (
                    <motion.div
                      key={key}
                      className={`house-emblem ${key}`}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ 
                        scale: 1, 
                        rotate: 0,
                        x: Math.cos(index * (Math.PI * 2) / 4) * 150,
                        y: Math.sin(index * (Math.PI * 2) / 4) * 150
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
              </div>

              <motion.button
                className="start-ceremony-btn"
                onClick={startCeremony}
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(138, 43, 226, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="btn-icon">🎩</span>
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
                <motion.div
                  className="large-sorting-hat"
                  initial={{ y: -200, rotate: 0 }}
                  animate={{ y: 0, rotate: [0, -10, 10, -5, 0] }}
                  transition={{ duration: 2, ease: "easeOut" }}
                >
                  🎩
                </motion.div>
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
                  <motion.div
                    className="thinking-hat"
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🎩
                  </motion.div>
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
              <motion.div
                className="dramatic-hat"
                animate={isHatThinking ? {
                  rotate: [0, -15, 15, -10, 10, -5, 5, 0],
                  scale: [1, 1.1, 1, 1.05, 1]
                } : {}}
                transition={{ duration: 1, repeat: isHatThinking ? Infinity : 0 }}
              >
                🎩
              </motion.div>
              
              <div className="sorting-text">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hat-thinking-text"
                >
                  Hmm... let me see... {isHatThinking ? "Difficult, very difficult..." : "I have decided!"}
                </motion.p>
              </div>
            </motion.div>
          )}

          {currentStep === 'result' && sortedHouse && (
            <motion.div
              key="result"
              className="result-screen"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <motion.div
                className="house-announcement"
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className={`sorted-house-emblem ${sortedHouse}`}>
                  <div className="house-mascot-large">{HOUSES[sortedHouse].mascot}</div>
                  <h2 className="house-name-large">{HOUSES[sortedHouse].name}!</h2>
                </div>
                
                <motion.p
                  className="sorting-announcement"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  The Sorting Hat has spoken! You belong in {HOUSES[sortedHouse].name}!
                </motion.p>

                <motion.div
                  className="house-traits"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  <p>Your house values:</p>
                  <div className="traits-list">
                    {HOUSES[sortedHouse].traits.map((trait, index) => (
                      <span key={index} className="trait-badge">{trait}</span>
                    ))}
                  </div>
                </motion.div>
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