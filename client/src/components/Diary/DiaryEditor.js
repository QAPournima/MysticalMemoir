import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EmojiPicker from 'emoji-picker-react';
import { useDiary } from '../../context/DiaryContext';
import { useTheme } from '../../context/ThemeContext';
import { WhatsappShareButton, WhatsappIcon } from 'react-share';
import html2canvas from 'html2canvas';
import useAutoSave from '../../hooks/useAutoSave';
import MagicalTimestamp from '../UI/MagicalTimestamp';
import './DiaryEditor.css';

// Magical diary responses inspired by interactive diary concept
const MAGICAL_RESPONSES = [
  {
    triggers: ['sad', 'upset', 'crying', 'hurt', 'pain', 'sadness', 'depressed', 'down'],
    responses: [
      "I sense your sorrow... Tell me more about what troubles you.",
      "The ink flows darker when pain is near. What burdens your heart?",
      "Sadness leaves its mark on these pages. Perhaps writing will ease your mind.",
      "I feel the weight of your sadness. Share your troubles with me."
    ]
  },
  {
    triggers: ['happy', 'joy', 'excited', 'wonderful', 'amazing', 'great', 'good', 'fantastic'],
    responses: [
      "Your happiness brightens these pages! What brings you such joy?",
      "I feel the warmth of your contentment. Share more of this brightness.",
      "Joy is powerful magic indeed. What made this day special?",
      "Your cheerful spirit lights up these words. Tell me more!"
    ]
  },
  {
    triggers: ['afraid', 'scared', 'fear', 'worried', 'anxious', 'nervous', 'terrified'],
    responses: [
      "Fear clouds the mind, but courage can be found in the darkest places. What frightens you?",
      "Even the bravest souls know fear. Tell me what shadows trouble you.",
      "Writing about our fears often diminishes their power. Speak freely here.",
      "I sense your unease. What dark thoughts consume you?"
    ]
  },
  {
    triggers: ['friend', 'friends', 'friendship', 'mate', 'buddy', 'pal'],
    responses: [
      "Friendship is one of the most powerful magics. Tell me about those dear to you.",
      "The bonds we form with others echo through these pages. Who matters most to you?",
      "True friends are treasures beyond measure. What makes yours special?",
      "I see the importance of companionship in your words. Share more about your friends."
    ]
  },
  {
    triggers: ['magic', 'magical', 'spell', 'potion', 'wizard', 'witch', 'wand'],
    responses: [
      "Magic flows through all things, even through simple words on a page. What magic do you seek?",
      "The greatest magic often lies in ordinary moments. What feels magical to you?",
      "Every word written here carries its own enchantment. Continue your magical tale.",
      "I sense the mystical energy in your writing. Tell me of the magic you've witnessed."
    ]
  },
  {
    triggers: ['dream', 'dreams', 'nightmare', 'sleep', 'dreaming'],
    responses: [
      "Dreams reveal truths we often hide from ourselves. What did your dreams show you?",
      "The realm of sleep holds many mysteries. Tell me of your nocturnal visions.",
      "Sometimes our dreams know things our waking minds do not. What message did yours carry?",
      "I feel the echo of your dreams in these words. Share what your sleep revealed."
    ]
  },
  {
    triggers: ['love', 'crush', 'romantic', 'heart', 'feelings', 'romance'],
    responses: [
      "Love is perhaps the most powerful magic of all. Tell me about this feeling in your heart.",
      "The heart's desires often find their way onto paper. What moves your heart?",
      "Love leaves its own kind of magic on these pages. Share your heart's story.",
      "I sense deep emotions stirring within you. Tell me of matters of the heart."
    ]
  },
  {
    triggers: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'good day'],
    responses: [
      "Ah, you've awakened me from my slumber. I am ready to listen to your thoughts.",
      "Hello there... I've been waiting for someone to write in my pages again.",
      "Greetings, young one. What secrets shall we share today?",
      "Welcome back to these magical pages. I sense you have much to tell me.",
      "Hello... I feel the warmth of your presence through your words.",
      "You have my attention. What weighs upon your mind today?",
      "Ah, a new voice speaks to me. Tell me, what brings you to write today?"
    ]
  }
];

const WRITING_PROMPTS = [
  "What secrets do you carry that you've never spoken aloud?",
  "If you could change one thing about today, what would it be?",
  "What would you say to someone who needs to hear it most?",
  "Describe a moment when you felt truly understood.",
  "What are you most grateful for in this very moment?",
  "If these pages could grant one wish, what would you ask for?",
  "What lesson did today teach you about yourself?",
  "Who from your past would you most like to speak with again?",
  "What dream feels too big to say out loud?",
  "When did you last feel completely at peace?"
];

const DiaryEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const { 
    createDiaryEntry, 
    updateDiaryEntry, 
    diaryEntries, 
    uploadImage,
    fetchDiaryEntries 
  } = useDiary();
  
  const { 
    currentHouse, 
    MAGICAL_STICKERS, 
    MOOD_OPTIONS, 
    WEATHER_OPTIONS,
    getHouseInfo,
    sendMagicalNotification 
  } = useTheme();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    mood: '',
    weather: '',
    house: currentHouse,
    tags: [],
    images: [],
    drawings: [],
    stickers: [],
    bookmarked: false
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedStickers, setSelectedStickers] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  
  // Magical diary interaction states
  const [magicalMode, setMagicalMode] = useState(false);
  const [showMagicalResponse, setShowMagicalResponse] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [showWritingPrompt, setShowWritingPrompt] = useState(false);
  const [responseTimer, setResponseTimer] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimer, setTypingTimer] = useState(null);
  const [lastResponseTime, setLastResponseTime] = useState(0);
  const [triggeredWords, setTriggeredWords] = useState(new Set());
  
  // Draft saving states
  const [showModeConfirmation, setShowModeConfirmation] = useState(false);
  const [draftContent, setDraftContent] = useState('');
  const [draftTitle, setDraftTitle] = useState('');

  // Auto-save functionality
  const autoSaveFunction = async (data) => {
    if (isEditing && data.title.trim()) {
      await updateDiaryEntry(id, data);
    }
  };

  const {
    isSaving: isAutoSaving,
    hasUnsavedChanges,
    getSaveStatus,
    forceSave
  } = useAutoSave(autoSaveFunction, formData, {
    delay: 3000, // 3 seconds delay
    enabled: isEditing && !magicalMode,
    showNotifications: true
  });
  const [pendingModeChange, setPendingModeChange] = useState(false);
  
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);
  const houseInfo = getHouseInfo(currentHouse);
  const houseColors = houseInfo.colors;

  useEffect(() => {
    if (isEditing) {
      loadEntry();
    }
  }, [id, isEditing]);

  // Update CSS custom properties when house changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--house-primary', houseColors.primary);
    root.style.setProperty('--house-secondary', houseColors.secondary);
    root.style.setProperty('--house-accent', houseColors.accent);
    root.style.setProperty('--house-light', houseColors.light);
  }, [currentHouse, houseColors]);

  // Clear triggered words when magical mode changes
  useEffect(() => {
    if (magicalMode) {
      console.log('🎪 Magical mode enabled - clearing previous triggers');
      clearTriggeredWords();
    }
  }, [magicalMode]);

  // Magical diary interaction effect
  useEffect(() => {
    if (magicalMode && formData.content.length > 5) {
      console.log('Checking for magical response. Content:', formData.content);
      console.log('Magical mode active:', magicalMode);
      
      // Clear any existing timer
      if (responseTimer) {
        clearTimeout(responseTimer);
      }

      // Set a timer to check for magical responses
      const timer = setTimeout(() => {
        console.log('Timer triggered, checking content for emotional words...');
        checkForMagicalResponse(formData.content);
      }, 1000);

      setResponseTimer(timer);
    }

    return () => {
      if (responseTimer) {
        clearTimeout(responseTimer);
      }
    };
  }, [formData.content, magicalMode]);

  // Removed old auto-save useEffect - now handled by useAutoSave hook

  const checkForMagicalResponse = (content) => {
    if (!magicalMode) {
      console.log('🚫 Magical mode is OFF, skipping response check');
      return;
    }
    
    // Check cooldown - prevent responses more frequent than every 5 seconds
    const now = Date.now();
    const timeSinceLastResponse = now - lastResponseTime;
    if (timeSinceLastResponse < 5000) {
      console.log(`⏰ Cooldown active: ${5000 - timeSinceLastResponse}ms remaining`);
      return;
    }
    
    const lowerContent = content.toLowerCase();
    const words = lowerContent.split(/\s+/);
    
    console.log('=== MAGICAL RESPONSE CHECK ===');
    console.log('Full content:', lowerContent);
    console.log('Content length:', lowerContent.length);
    console.log('Words in content:', words);
    console.log('Magical mode active:', magicalMode);
    console.log('Already triggered words:', Array.from(triggeredWords));
    
    for (const responseSet of MAGICAL_RESPONSES) {
      console.log('Checking triggers:', responseSet.triggers);
      for (const trigger of responseSet.triggers) {
        // Skip if this word was already triggered recently
        if (triggeredWords.has(trigger)) {
          console.log(`⏭️ Skipping already triggered word: ${trigger}`);
          continue;
        }
        
        // Check both word boundaries and substring matching
        const hasWordMatch = words.some(word => word.includes(trigger));
        const hasSubstringMatch = lowerContent.includes(trigger);
        
        if (hasWordMatch || hasSubstringMatch) {
          console.log('🎉 FOUND NEW TRIGGER WORD:', trigger);
          console.log('Match type:', hasWordMatch ? 'word match' : 'substring match');
          const randomResponse = responseSet.responses[Math.floor(Math.random() * responseSet.responses.length)];
          console.log('Selected response:', randomResponse);
          
          // Track this word as triggered
          setTriggeredWords(prev => new Set([...prev, trigger]));
          setLastResponseTime(now);
          
          // Insert response directly into the editor
          insertMagicalResponseInEditor(randomResponse);
          return;
        }
      }
    }
    console.log('❌ No new trigger words found in content');
    console.log('Available triggers:', MAGICAL_RESPONSES.flatMap(r => r.triggers));
  };

  const insertMagicalResponseInEditor = (response) => {
    if (isTyping) return; // Prevent multiple responses while one is typing
    
    console.log('🎭 Starting typewriter animation for response:', response);
    setIsTyping(true);
    
    // Add the magical response after user's text (don't store currentContent for clearing)
    setFormData(prev => ({
      ...prev,
      content: prev.content + '\n🖋️ *|*\n\n'
    }));
    
    // Start the typewriter animation
    let charIndex = 0;
    const typeSpeed = 80; // milliseconds per character
    
    const typeWriter = () => {
      if (charIndex < response.length) {
        // Get current partial text with cursor
        const currentText = response.substring(0, charIndex + 1);
        
        setFormData(prev => {
          console.log('📝 Typewriter char:', charIndex + 1, 'of', response.length, '- char:', response[charIndex]);
          // Replace the last occurrence of the magical response pattern
          const contentLines = prev.content.split('\n');
          let foundIndex = -1;
          
          // Find the line with 🖋️ from the end
          for (let i = contentLines.length - 1; i >= 0; i--) {
            if (contentLines[i].includes('🖋️ *') && contentLines[i].includes('*')) {
              foundIndex = i;
              break;
            }
          }
          
          if (foundIndex !== -1) {
            contentLines[foundIndex] = `🖋️ *${currentText}|*`;
            const newContent = contentLines.join('\n');
            
            return {
              ...prev,
              content: newContent
            };
          }
          
          return prev; // Fallback if pattern not found
        });
        
        charIndex++;
        setTimeout(typeWriter, typeSpeed);
      } else {
        // Typing complete - remove cursor
        setFormData(prev => {
          console.log('✨ Typewriter animation completed');
          const contentLines = prev.content.split('\n');
          let foundIndex = -1;
          
          // Find the line with 🖋️ from the end
          for (let i = contentLines.length - 1; i >= 0; i--) {
            if (contentLines[i].includes('🖋️ *') && contentLines[i].includes('|*')) {
              foundIndex = i;
              break;
            }
          }
          
          if (foundIndex !== -1) {
            contentLines[foundIndex] = `🖋️ *${response}*`;
            const newContent = contentLines.join('\n');
            
            return {
              ...prev,
              content: newContent
            };
          }
          
          return prev;
        });
        
        setIsTyping(false);
        
        // Remove ONLY the magical response after reading time (preserve user's text)
        setTimeout(() => {
          setFormData(prev => {
            console.log('🗑️ Removing only the magical response, preserving user text');
            const contentLines = prev.content.split('\n');
            let responseIndex = -1;
            
            // Find and remove the magical response line
            for (let i = contentLines.length - 1; i >= 0; i--) {
              if (contentLines[i].includes('🖋️ *') && !contentLines[i].includes('|*')) {
                responseIndex = i;
                break;
              }
            }
            
            if (responseIndex !== -1) {
              // Remove the response line and surrounding empty lines
              contentLines.splice(responseIndex, 1);
              
              // Clean up extra empty lines around the removed response
              if (responseIndex < contentLines.length && contentLines[responseIndex] === '') {
                contentLines.splice(responseIndex, 1);
              }
              if (responseIndex > 0 && contentLines[responseIndex - 1] === '') {
                contentLines.splice(responseIndex - 1, 1);
              }
              
              const updatedContent = contentLines.join('\n');
              console.log('🔄 Content after removing response:', updatedContent.slice(-200));
              return {
                ...prev,
                content: updatedContent
              };
            }
            
            return prev;
          });
        }, 10000); // 10 seconds to read the completed response
      }
    };
    
    // Start typing after a brief pause
    setTimeout(typeWriter, 500);
  };

  const clearTriggeredWords = () => {
    console.log('🔄 Clearing triggered words for fresh responses');
    setTriggeredWords(new Set());
    setLastResponseTime(0);
  };

  // Draft Management Functions
  const saveDraftContent = () => {
    console.log('💾 Saving current content as draft');
    setDraftTitle(formData.title);
    setDraftContent(formData.content);
  };

  const restoreDraftContent = () => {
    console.log('📝 Restoring draft content');
    setFormData(prev => ({
      ...prev,
      title: draftTitle,
      content: draftContent
    }));
    // Clear draft after restoration
    setDraftTitle('');
    setDraftContent('');
  };

  const handleModeToggleClick = () => {
    console.log('🔄 Mode toggle clicked! Current mode:', magicalMode);
    
    if (!magicalMode) {
      // Enabling Interactive Mode - show confirmation if there's content
      if (formData.title.trim() || formData.content.trim()) {
        setShowModeConfirmation(true);
        setPendingModeChange(true);
      } else {
        // No content to save, just enable
        setMagicalMode(true);
      }
    } else {
      // Disabling Interactive Mode - restore draft if exists
      if (draftTitle || draftContent) {
        restoreDraftContent();
        sendMagicalNotification('Draft Restored', {
          body: `Your original writing has been restored! Continue where you left off. 📝`,
          tag: 'draft-restore'
        });
      }
      setMagicalMode(false);
    }
  };

  const confirmModeChange = () => {
    console.log('✅ User confirmed mode change');
    saveDraftContent();
    setMagicalMode(true);
    setShowModeConfirmation(false);
    setPendingModeChange(false);
    
    // Send notification about mode change
    sendMagicalNotification('Interactive Mode Enabled', {
      body: `Your writing has been saved as a draft. The diary will now respond to your emotions! ✨`,
      tag: 'interactive-mode'
    });
  };

  const cancelModeChange = () => {
    console.log('❌ User cancelled mode change');
    setShowModeConfirmation(false);
    setPendingModeChange(false);
  };

  const typewriterEffect = (text, responseId) => {
    let index = 0;
    const speed = 80; // milliseconds per character
    
    const typeChar = () => {
      if (index < text.length) {
        setFormData(prev => {
          const updatedContent = prev.content.replace(
            new RegExp(`(<div class="magical-response-inline typing" id="${responseId}">🖋️ <em><span class="diary-text">)[^<]*`, 'g'),
            `$1${text.substring(0, index + 1)}`
          );
          return {
            ...prev,
            content: updatedContent
          };
        });
        
        index++;
        setTypingTimer(setTimeout(typeChar, speed));
      } else {
        // Typing complete - remove cursor and add completion class
        setFormData(prev => {
          const updatedContent = prev.content.replace(
            new RegExp(`<div class="magical-response-inline typing" id="${responseId}">🖋️ <em><span class="diary-text">[^<]*</span><span class="typing-cursor">\\|</span></em></div>`, 'g'),
            `<div class="magical-response-inline complete" id="${responseId}">🖋️ <em><span class="diary-text">${text}</span></em></div>`
          );
          return {
            ...prev,
            content: updatedContent
          };
        });
        
        setIsTyping(false);
        
        // Remove the response after 10 seconds
        setTimeout(() => {
          setFormData(prev => {
            const updatedContent = prev.content.replace(
              new RegExp(`\\n\\n<div class="magical-response-inline complete" id="${responseId}">🖋️ <em><span class="diary-text">${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</span></em></div>\\n\\n`, 'g'),
              '\n\n'
            );
            return {
              ...prev,
              content: updatedContent
            };
          });
        }, 10000);
      }
    };
    
    typeChar();
  };

  const insertMagicalResponse = () => {
    const responseText = `\n\n<div class="magical-response"><em>"${currentResponse}"</em></div>\n\n`;
    setFormData(prev => ({
      ...prev,
      content: prev.content + responseText
    }));
    setShowMagicalResponse(false);
  };

  const showRandomPrompt = () => {
    if (isTyping) return; // Prevent prompts while typing
    
    const randomPrompt = WRITING_PROMPTS[Math.floor(Math.random() * WRITING_PROMPTS.length)];
    console.log('🪄 Starting typewriter animation for prompt:', randomPrompt);
    
    setIsTyping(true);
    
    // Start with just the wand and cursor
    setFormData(prev => ({
      ...prev,
      content: prev.content + '\n🪄 **|**\n\n'
    }));
    
    // Start the typewriter animation
    let charIndex = 0;
    const typeSpeed = 70; // Slightly faster for prompts
    
    const typeWriter = () => {
      if (charIndex < randomPrompt.length) {
        // Get current partial text with cursor
        const currentText = randomPrompt.substring(0, charIndex + 1);
        
        setFormData(prev => {
          console.log('📝 Prompt typewriter char:', charIndex + 1, 'of', randomPrompt.length, '- char:', randomPrompt[charIndex]);
          // Replace the last occurrence of the prompt pattern
          const contentLines = prev.content.split('\n');
          let foundIndex = -1;
          
          // Find the line with 🪄 from the end
          for (let i = contentLines.length - 1; i >= 0; i--) {
            if (contentLines[i].includes('🪄 **') && contentLines[i].includes('**')) {
              foundIndex = i;
              break;
            }
          }
          
          if (foundIndex !== -1) {
            contentLines[foundIndex] = `🪄 **${currentText}|**`;
            const newContent = contentLines.join('\n');
            
            return {
              ...prev,
              content: newContent
            };
          }
          
          return prev; // Fallback if pattern not found
        });
        
        charIndex++;
        setTimeout(typeWriter, typeSpeed);
      } else {
        // Typing complete - remove cursor and add user response line
        setFormData(prev => {
          console.log('✨ Prompt typewriter animation completed');
          const contentLines = prev.content.split('\n');
          let foundIndex = -1;
          
          // Find the line with 🪄 from the end
          for (let i = contentLines.length - 1; i >= 0; i--) {
            if (contentLines[i].includes('🪄 **') && contentLines[i].includes('|**')) {
              foundIndex = i;
              break;
            }
          }
          
          if (foundIndex !== -1) {
            contentLines[foundIndex] = `🪄 **${randomPrompt}**`;
            // Add empty lines and cursor for user response
            contentLines.splice(foundIndex + 1, 0, '', '✍️ Your thoughts: ');
            const newContent = contentLines.join('\n');
            
            return {
              ...prev,
              content: newContent
            };
          }
          
          return prev;
        });
        
        setIsTyping(false);
        
        // Remove the prompt after reading time (but preserve user's answer if they started typing)
        setTimeout(() => {
          setFormData(prev => {
            const contentLines = prev.content.split('\n');
            let promptIndex = -1;
            
            // Find the prompt line
            for (let i = 0; i < contentLines.length; i++) {
              if (contentLines[i].includes('🪄 **')) {
                promptIndex = i;
                break;
              }
            }
            
            if (promptIndex !== -1) {
              // Check if user has started typing an answer
              let userStartedTyping = false;
              const answerLineIndex = promptIndex + 2; // Should be "✍️ Your thoughts: " line
              
              if (answerLineIndex < contentLines.length) {
                const answerLine = contentLines[answerLineIndex];
                // If user added content beyond "✍️ Your thoughts: "
                if (answerLine && answerLine.trim() !== '✍️ Your thoughts:' && answerLine.trim().length > '✍️ Your thoughts:'.length) {
                  userStartedTyping = true;
                }
              }
              
              if (!userStartedTyping) {
                // Remove prompt, empty line, and "✍️ Your thoughts:" line
                contentLines.splice(promptIndex, 3);
                
                // Clean up extra empty lines
                while (promptIndex < contentLines.length && contentLines[promptIndex] === '') {
                  contentLines.splice(promptIndex, 1);
                }
                if (promptIndex > 0 && contentLines[promptIndex - 1] === '') {
                  contentLines.splice(promptIndex - 1, 1);
                }
              } else {
                // Only remove the prompt line but keep user's answer
                contentLines.splice(promptIndex, 1);
                console.log('🎯 User started answering - keeping their response');
              }
              
              const updatedContent = contentLines.join('\n');
              console.log('🗑️ Removing prompt, new content:', updatedContent.slice(-200));
              
              return {
                ...prev,
                content: updatedContent
              };
            }
            
            return prev;
          });
        }, 12000);
      }
    };
    
    // Start typing after a brief pause
    setTimeout(typeWriter, 500);
  };

  const typewriterPromptEffect = (text, promptId) => {
    let index = 0;
    const speed = 70; // Slightly faster for prompts
    
    const typeChar = () => {
      if (index < text.length) {
        setFormData(prev => {
          const updatedContent = prev.content.replace(
            new RegExp(`(<div class="writing-prompt-inline typing" id="${promptId}">🪄 <strong><span class="prompt-text">)[^<]*`, 'g'),
            `$1${text.substring(0, index + 1)}`
          );
          return {
            ...prev,
            content: updatedContent
          };
        });
        
        index++;
        setTypingTimer(setTimeout(typeChar, speed));
      } else {
        // Typing complete
        setFormData(prev => {
          const updatedContent = prev.content.replace(
            new RegExp(`<div class="writing-prompt-inline typing" id="${promptId}">🪄 <strong><span class="prompt-text">[^<]*</span><span class="typing-cursor">\\|</span></strong></div>`, 'g'),
            `<div class="writing-prompt-inline complete" id="${promptId}">🪄 <strong><span class="prompt-text">${text}</span></strong></div>`
          );
          return {
            ...prev,
            content: updatedContent
          };
        });
        
        setIsTyping(false);
        
        // Remove the prompt after 10 seconds
        setTimeout(() => {
          setFormData(prev => {
            const updatedContent = prev.content.replace(
              new RegExp(`\\n\\n<div class="writing-prompt-inline complete" id="${promptId}">🪄 <strong><span class="prompt-text">${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</span></strong></div>\\n\\n`, 'g'),
              '\n\n'
            );
            return {
              ...prev,
              content: updatedContent
            };
          });
        }, 15000);
      }
    };
    
    typeChar();
  };

  const loadEntry = async () => {
    try {
      if (diaryEntries.length === 0) {
        await fetchDiaryEntries();
      }
      
      const entry = diaryEntries.find(e => e.id === id);
      if (entry) {
        setCurrentEntry(entry);
        setFormData({
          title: entry.title,
          content: entry.content,
          date: entry.date,
          mood: entry.mood || '',
          weather: entry.weather || '',
          house: entry.house || currentHouse,
          tags: entry.tags ? JSON.parse(entry.tags) : [],
          images: entry.images ? JSON.parse(entry.images) : [],
          drawings: entry.drawings ? JSON.parse(entry.drawings) : [],
          stickers: entry.stickers ? JSON.parse(entry.stickers) : [],
          bookmarked: entry.bookmarked === 1
        });
        setSelectedStickers(entry.stickers ? JSON.parse(entry.stickers) : []);
      }
    } catch (error) {
      console.error('Error loading entry:', error);
    }
  };

  // handleAutoSave function removed - now handled by useAutoSave hook

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a title for your diary entry');
      return;
    }

    setSaving(true);
    try {
      const entryData = {
        ...formData,
        tags: formData.tags,
        images: formData.images,
        drawings: formData.drawings,
        stickers: selectedStickers
      };

      if (isEditing) {
        await updateDiaryEntry(id, entryData);
        sendMagicalNotification('Diary Entry Updated', {
          body: `Your entry "${entryData.title}" has been magically preserved! ✨`,
          tag: 'diary-update'
        });
      } else {
        await createDiaryEntry(entryData);
        sendMagicalNotification('New Diary Entry Created', {
          body: `Your magical thoughts about "${entryData.title}" have been recorded! 📖`,
          tag: 'diary-create'
        });
      }
      
      navigate('/diary');
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save entry. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const uploadedImage = await uploadImage(file);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, uploadedImage]
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (imageIndex) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== imageIndex)
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagIndex) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== tagIndex)
    }));
  };

  const handleStickerSelect = (sticker) => {
    // Insert sticker directly into the text editor content
    setFormData(prev => ({
      ...prev,
      content: prev.content + sticker.emoji + ' '
    }));
    
    // Also add to stickers collection for tracking
    const newStickers = [...selectedStickers, sticker];
    setSelectedStickers(newStickers);
    setFormData(prev => ({
      ...prev,
      stickers: newStickers
    }));
    
    // Close the sticker picker after selection
    setShowStickerPicker(false);
  };

  const handleRemoveSticker = (stickerIndex) => {
    const newStickers = selectedStickers.filter((_, index) => index !== stickerIndex);
    setSelectedStickers(newStickers);
    setFormData(prev => ({
      ...prev,
      stickers: newStickers
    }));
  };

  const handleEmojiSelect = (emojiObject) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content + emojiObject.emoji + ' '
    }));
    setShowEmojiPicker(false);
  };

  const handleShare = async () => {
    try {
      // Create a shareable image of the diary entry
      const element = editorRef.current;
      const canvas = await html2canvas(element);
      const image = canvas.toDataURL('image/png');
      
      const shareText = `Check out my magical diary entry: "${formData.title}"`;
      const shareUrl = `${window.location.origin}/diary/${id}`;
      
      if (navigator.share) {
        await navigator.share({
          title: formData.title,
          text: shareText,
          url: shareUrl
        });
      } else {
        // Fallback to WhatsApp sharing
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        window.open(whatsappUrl, '_blank');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ]
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (typingTimer) {
        clearTimeout(typingTimer);
      }
      if (responseTimer) {
        clearTimeout(responseTimer);
      }
    };
  }, []);

  return (
    <div className={`diary-editor ${currentHouse}-theme`} key={`diary-${currentHouse}`}>
      <div className="editor-container" ref={editorRef}>
        <div className="editor-header magical-card">
          <div className="header-content">
            <h1 className="editor-title">
              <span className="house-mascot-circle">{houseInfo.mascot}</span>
              {isEditing ? '✏️ Edit Entry' : '✨ New Magical Entry'}
            </h1>
            
            <div className="editor-actions">
              {isEditing && (
                <button
                  onClick={handleShare}
                  className="share-btn magical-button"
                  title="Share this entry"
                >
                  📤 Share
                </button>
              )}
              
              <button
                onClick={() => navigate('/diary')}
                className="cancel-btn magical-button"
              >
                Cancel
              </button>
              
              <button
                onClick={handleSave}
                disabled={saving || !formData.title.trim()}
                className="save-btn magical-button"
              >
                {saving ? '💾 Saving...' : '💾 Save'}
              </button>
            </div>

            {/* Auto-save status and timestamps */}
            <div className="editor-status">
              {isEditing && (
                <div className="auto-save-status">
                  <span 
                    className="save-indicator"
                    style={{ color: getSaveStatus().color }}
                  >
                    {getSaveStatus().text}
                  </span>
                  {hasUnsavedChanges && (
                    <button
                      onClick={forceSave}
                      className="force-save-btn"
                      title="Force save now"
                    >
                      💾
                    </button>
                  )}
                </div>
              )}
              
              {currentEntry && (
                <MagicalTimestamp
                  createdAt={currentEntry.created_at}
                  updatedAt={currentEntry.updated_at}
                  showCalendar={false}
                  size="small"
                  className="editor-timestamp"
                />
              )}
            </div>
          </div>
          
          {/* Auto-save indicator now handled by useAutoSave hook */}
          
          {magicalMode && (
            <div className="magical-mode-indicator magical-active">
              ✨ <strong>Interactive Diary Mode Active</strong> ✨
              <br />
              <span className="mode-instruction">Write words like "hello", "happy", "sad", "scared", "love", "dream", "magic", or "friend" and watch the diary respond below your text!</span>
              <br />
              <span className="button-hints">🧪 <strong>Test Response</strong> | 🔄 <strong>Reset Triggers</strong> | 🪄 <strong>Get Writing Prompt</strong></span>
            </div>
          )}
        </div>

        <div className="editor-content">
          {/* Basic Information */}
          <div className="basic-info magical-card">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="What's on your mind today?"
                  className="magical-input title-input"
                  maxLength={100}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="magical-input"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="mood">Mood</label>
                <select
                  id="mood"
                  value={formData.mood}
                  onChange={(e) => setFormData(prev => ({ ...prev, mood: e.target.value }))}
                  className="magical-input"
                >
                  <option value="">Select your mood</option>
                  {MOOD_OPTIONS.map(mood => (
                    <option key={mood.id} value={mood.id}>
                      {mood.emoji} {mood.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="weather">Weather</label>
                <select
                  id="weather"
                  value={formData.weather}
                  onChange={(e) => setFormData(prev => ({ ...prev, weather: e.target.value }))}
                  className="magical-input"
                >
                  <option value="">Select weather</option>
                  {WEATHER_OPTIONS.map(weather => (
                    <option key={weather.id} value={weather.id}>
                      {weather.emoji} {weather.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Content Editor */}
          <div className="content-editor magical-card">
            <div className="editor-toolbar">
              <button
                onClick={handleModeToggleClick}
                className={`magical-mode-btn ${magicalMode ? 'active' : ''}`}
                title={magicalMode ? 'Exit interactive mode and restore your draft' : 'Enter interactive diary mode'}
                style={{
                  backgroundColor: magicalMode ? houseColors.accent : houseColors.primary,
                  color: 'white',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: '600',
                  border: `2px solid ${houseColors.secondary}`,
                  borderRadius: '20px',
                  minWidth: '120px',
                  whiteSpace: 'nowrap',
                  boxShadow: magicalMode ? `0 0 15px ${houseColors.accent}40` : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                🖋️{magicalMode ? 'INTERACTIVE' : 'NORMAL'}
              </button>
              
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="toolbar-btn"
                title="Add emoji"
              >
                😊
              </button>
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="toolbar-btn"
                title="Add image"
                disabled={uploadingImage}
              >
                {uploadingImage ? '⏳' : '📷'}
              </button>
              
              <button
                type="button"
                onClick={() => setShowStickerPicker(!showStickerPicker)}
                className="toolbar-btn"
                title="Add sticker"
              >
                ✨
              </button>
              
              {magicalMode && (
                <button
                  type="button"
                  onClick={showRandomPrompt}
                  className="toolbar-btn magical-prompt-btn"
                  title="Get writing inspiration"
                >
                  🪄
                </button>
              )}
              
              {magicalMode && (
                <button
                  type="button"
                  onClick={() => {
                    console.log('Test button clicked!');
                    insertMagicalResponseInEditor("Your happiness brightens these pages! What brings you such joy?");
                  }}
                  className="toolbar-btn"
                  title="Test magical response"
                  style={{ 
                    backgroundColor: houseColors.secondary, 
                    color: 'white',
                    border: `2px solid ${houseColors.accent}`
                  }}
                >
                  🧪
                </button>
              )}
              
              {magicalMode && (
                <button
                  type="button"
                  onClick={clearTriggeredWords}
                  className="toolbar-btn"
                  title="Reset magical responses - allows words to trigger again"
                  style={{ 
                    backgroundColor: houseColors.primary, 
                    color: 'white',
                    border: `2px solid ${houseColors.accent}`
                  }}
                >
                  🔄
                </button>
              )}
              
              {magicalMode && (
                <button
                  type="button"
                  onClick={clearTriggeredWords}
                  className="toolbar-btn"
                  title="Reset magical responses - allows words to trigger again"
                  style={{ 
                    backgroundColor: houseColors.primary, 
                    color: 'white',
                    border: `2px solid ${houseColors.accent}`
                  }}
                >
                  🔄
                </button>
              )}
            </div>
            
            <ReactQuill
              value={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
              modules={quillModules}
              placeholder={magicalMode ? "The diary awaits your deepest thoughts..." : "Write your magical thoughts here..."}
              className={`content-quill ${magicalMode ? 'magical-mode-active' : ''}`}
            />
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <motion.div
              className="picker-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="picker-container">
                <EmojiPicker
                  onEmojiClick={handleEmojiSelect}
                  width={300}
                  height={400}
                />
                <button
                  onClick={() => setShowEmojiPicker(false)}
                  className="close-picker-btn"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}

          {/* Sticker Picker */}
          {showStickerPicker && (
            <motion.div
              className="picker-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="sticker-picker magical-card">
                <h3>✨ Choose Magical Stickers</h3>
                <p className="sticker-instruction">Click a sticker to add it to your diary entry</p>
                <div className="sticker-categories">
                  <div className="category-section">
                    <h4>🪄 Magical</h4>
                    <div className="sticker-grid">
                      {MAGICAL_STICKERS.filter(s => s.category === 'magical').map(sticker => (
                        <button
                          key={sticker.id}
                          onClick={() => handleStickerSelect(sticker)}
                          className="sticker-btn"
                          title={`Add ${sticker.name} to your entry`}
                        >
                          {sticker.emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="category-section">
                    <h4>🐾 Creatures</h4>
                    <div className="sticker-grid">
                      {MAGICAL_STICKERS.filter(s => s.category === 'creatures').map(sticker => (
                        <button
                          key={sticker.id}
                          onClick={() => handleStickerSelect(sticker)}
                          className="sticker-btn"
                          title={`Add ${sticker.name} to your entry`}
                        >
                          {sticker.emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="category-section">
                    <h4>🏰 Places & Items</h4>
                    <div className="sticker-grid">
                      {MAGICAL_STICKERS.filter(s => ['places', 'items', 'people', 'elements'].includes(s.category)).map(sticker => (
                        <button
                          key={sticker.id}
                          onClick={() => handleStickerSelect(sticker)}
                          className="sticker-btn"
                          title={`Add ${sticker.name} to your entry`}
                        >
                          {sticker.emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowStickerPicker(false)}
                  className="close-picker-btn magical-button"
                >
                  ✕ Close
                </button>
              </div>
            </motion.div>
          )}

          {/* Selected Stickers */}
          {selectedStickers.length > 0 && (
            <div className="selected-stickers magical-card">
              <h4>Selected Stickers</h4>
              <div className="sticker-list">
                {selectedStickers.map((sticker, index) => (
                  <div key={index} className="selected-sticker">
                    <span className="sticker-emoji">{sticker.emoji}</span>
                    <button
                      onClick={() => handleRemoveSticker(index)}
                      className="remove-sticker-btn"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Images */}
          {formData.images.length > 0 && (
            <div className="attached-images magical-card">
              <h4>Attached Images</h4>
              <div className="images-grid">
                {formData.images.map((image, index) => (
                  <div key={index} className="image-container">
                    <img
                      src={image.url}
                      alt={image.originalName}
                      className="attached-image"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="remove-image-btn"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="tags-section magical-card">
            <h4>Tags</h4>
            <div className="tag-input-container">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add a tag..."
                className="magical-input tag-input"
              />
              <button
                onClick={handleAddTag}
                className="add-tag-btn magical-button"
              >
                Add
              </button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="tags-list">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(index)}
                      className="remove-tag-btn"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Bookmark Toggle */}
          <div className="bookmark-section magical-card">
            <label className="bookmark-toggle">
              <input
                type="checkbox"
                checked={formData.bookmarked}
                onChange={(e) => setFormData(prev => ({ ...prev, bookmarked: e.target.checked }))}
              />
              <span className="bookmark-text">
                🔖 Bookmark this entry
              </span>
            </label>
          </div>
        </div>

        {/* Interactive Mode Confirmation Modal */}
        {showModeConfirmation && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="confirmation-modal magical-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="modal-header">
                <h3>🖋️ Switch to Interactive Diary Mode?</h3>
              </div>
              
              <div className="modal-content">
                <p>
                  <strong>Your current writing will be saved as a draft.</strong>
                </p>
                <p>
                  In Interactive Mode, the diary will respond to emotional words like "happy", "sad", "scared", "love", etc. When you exit Interactive Mode, your original draft will be automatically restored.
                </p>
                
                {(formData.title.trim() || formData.content.trim()) && (
                  <div className="draft-preview">
                    <h4>📝 Content to be saved as draft:</h4>
                    {formData.title.trim() && (
                      <div className="draft-title">
                        <strong>Title:</strong> {formData.title.substring(0, 50)}
                        {formData.title.length > 50 && '...'}
                      </div>
                    )}
                    {formData.content.trim() && (
                      <div className="draft-content">
                        <strong>Content:</strong> {formData.content.substring(0, 100)}
                        {formData.content.length > 100 && '...'}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="modal-actions">
                <button
                  onClick={cancelModeChange}
                  className="cancel-btn magical-button"
                >
                  ❌ Cancel
                </button>
                <button
                  onClick={confirmModeChange}
                  className="confirm-btn magical-button"
                >
                  ✨ Enable Interactive Mode
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DiaryEditor; 