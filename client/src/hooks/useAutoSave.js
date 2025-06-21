import { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';

const useAutoSave = (saveFunction, data, options = {}) => {
  const {
    delay = 2000, // 2 seconds delay
    enabled = true,
    showNotifications = false
  } = options;

  const { sendMagicalNotification } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveError, setSaveError] = useState(null);
  
  const timeoutRef = useRef(null);
  const previousDataRef = useRef(data);
  const isInitialRender = useRef(true);

  const performSave = useCallback(async () => {
    if (!enabled || !hasUnsavedChanges) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      await saveFunction(data);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      
      if (showNotifications) {
        sendMagicalNotification('Auto-Saved', {
          body: 'Your magical work has been automatically preserved! ✨',
          tag: 'auto-save'
        });
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
      setSaveError(error.message);
      
      // Store failed save data in localStorage as backup
      try {
        const backupKey = `magical_diary_backup_${Date.now()}`;
        localStorage.setItem(backupKey, JSON.stringify({
          data,
          timestamp: new Date().toISOString(),
          error: error.message
        }));
        
        if (showNotifications) {
          sendMagicalNotification('Save Failed - Backup Created', {
            body: 'Auto-save failed, but your work is safely backed up! 🛡️',
            tag: 'save-error'
          });
        }
      } catch (backupError) {
        console.error('Backup also failed:', backupError);
      }
    } finally {
      setIsSaving(false);
    }
  }, [data, saveFunction, enabled, hasUnsavedChanges, showNotifications, sendMagicalNotification]);

  const debouncedSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      performSave();
    }, delay);
  }, [performSave, delay]);

  const forceSave = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await performSave();
  }, [performSave]);

  const resetAutoSave = useCallback(() => {
    setHasUnsavedChanges(false);
    setLastSaved(new Date());
    setSaveError(null);
  }, []);

  // Track data changes
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      previousDataRef.current = data;
      return;
    }

    // Deep comparison to detect changes
    const hasChanged = JSON.stringify(data) !== JSON.stringify(previousDataRef.current);
    
    if (hasChanged) {
      setHasUnsavedChanges(true);
      previousDataRef.current = data;
      
      if (enabled) {
        debouncedSave();
      }
    }
  }, [data, enabled, debouncedSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Save before page unload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const getTimeAgo = (date) => {
    if (!date) return '';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const getSaveStatus = () => {
    if (isSaving) return { text: 'Saving...', color: '#FFD700' };
    if (saveError) return { text: 'Save failed', color: '#ff4444' };
    if (hasUnsavedChanges) return { text: 'Unsaved changes', color: '#ff9900' };
    if (lastSaved) return { text: `Saved ${getTimeAgo(lastSaved)}`, color: '#22C55E' };
    return { text: 'Ready', color: '#888' };
  };

  return {
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    saveError,
    forceSave,
    resetAutoSave,
    getSaveStatus,
    getTimeAgo: () => getTimeAgo(lastSaved)
  };
};

export default useAutoSave; 