import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const DiaryContext = createContext();

const initialState = {
  diaryEntries: [],
  todos: [],
  images: [],
  drawings: [],
  loading: false,
  error: null
};

const diaryReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_DIARY_ENTRIES':
      return { ...state, diaryEntries: action.payload, loading: false };
    
    case 'ADD_DIARY_ENTRY':
      return { 
        ...state, 
        diaryEntries: [action.payload, ...state.diaryEntries],
        loading: false 
      };
    
    case 'UPDATE_DIARY_ENTRY':
      return {
        ...state,
        diaryEntries: state.diaryEntries.map(entry =>
          entry.id === action.payload.id ? action.payload : entry
        ),
        loading: false
      };
    
    case 'DELETE_DIARY_ENTRY':
      return {
        ...state,
        diaryEntries: state.diaryEntries.filter(entry => entry.id !== action.payload),
        loading: false
      };
    
    case 'SET_TODOS':
      return { ...state, todos: action.payload, loading: false };
    
    case 'ADD_TODO':
      return { 
        ...state, 
        todos: [action.payload, ...state.todos],
        loading: false 
      };
    
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? action.payload : todo
        ),
        loading: false
      };
    
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
        loading: false
      };
    
    case 'SET_IMAGES':
      return { ...state, images: action.payload, loading: false };
    
    case 'ADD_IMAGE':
      return { 
        ...state, 
        images: [action.payload, ...state.images],
        loading: false 
      };
    
    case 'DELETE_IMAGE':
      return {
        ...state,
        images: state.images.filter(image => image.id !== action.payload),
        loading: false
      };
    
    case 'SET_DRAWINGS':
      return { ...state, drawings: action.payload, loading: false };
    
    case 'ADD_DRAWING':
      return { 
        ...state, 
        drawings: [action.payload, ...state.drawings],
        loading: false 
      };
    
    case 'DELETE_DRAWING':
      return {
        ...state,
        drawings: state.drawings.filter(drawing => drawing.id !== action.payload),
        loading: false
      };
    
    default:
      return state;
  }
};

export const DiaryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(diaryReducer, initialState);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

  // Diary Entries Actions
  const fetchDiaryEntries = async (filters = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_URL}/diary?${params}`);
      dispatch({ type: 'SET_DIARY_ENTRIES', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const createDiaryEntry = async (entryData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.post(`${API_URL}/diary`, entryData);
      const newEntry = { ...entryData, id: response.data.id };
      dispatch({ type: 'ADD_DIARY_ENTRY', payload: newEntry });
      return response.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const updateDiaryEntry = async (id, entryData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await axios.put(`${API_URL}/diary/${id}`, entryData);
      const updatedEntry = { ...entryData, id };
      dispatch({ type: 'UPDATE_DIARY_ENTRY', payload: updatedEntry });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const deleteDiaryEntry = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await axios.delete(`${API_URL}/diary/${id}`);
      dispatch({ type: 'DELETE_DIARY_ENTRY', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const toggleBookmark = async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/diary/${id}/bookmark`);
      const entry = state.diaryEntries.find(e => e.id === id);
      if (entry) {
        const updatedEntry = { ...entry, bookmarked: response.data.bookmarked ? 1 : 0 };
        dispatch({ type: 'UPDATE_DIARY_ENTRY', payload: updatedEntry });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  // Todo Actions
  const fetchTodos = async (filters = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_URL}/todo?${params}`);
      dispatch({ type: 'SET_TODOS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const createTodo = async (todoData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.post(`${API_URL}/todo`, todoData);
      const newTodo = { ...todoData, id: response.data.id };
      dispatch({ type: 'ADD_TODO', payload: newTodo });
      return response.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const updateTodo = async (id, todoData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await axios.put(`${API_URL}/todo/${id}`, todoData);
      const updatedTodo = { ...todoData, id };
      dispatch({ type: 'UPDATE_TODO', payload: updatedTodo });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const deleteTodo = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await axios.delete(`${API_URL}/todo/${id}`);
      dispatch({ type: 'DELETE_TODO', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Image Actions
  const uploadImage = async (file) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const formData = new FormData();
      formData.append('image', file);
      const response = await axios.post(`${API_URL}/images/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      dispatch({ type: 'ADD_IMAGE', payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const fetchImages = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.get(`${API_URL}/images`);
      dispatch({ type: 'SET_IMAGES', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  // Drawing Actions
  const saveDrawing = async (drawingData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.post(`${API_URL}/drawings`, drawingData);
      const newDrawing = { ...drawingData, id: response.data.id };
      dispatch({ type: 'ADD_DRAWING', payload: newDrawing });
      return response.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const fetchDrawings = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.get(`${API_URL}/drawings`);
      dispatch({ type: 'SET_DRAWINGS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const value = {
    ...state,
    // Diary actions
    fetchDiaryEntries,
    createDiaryEntry,
    updateDiaryEntry,
    deleteDiaryEntry,
    toggleBookmark,
    // Todo actions
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    // Image actions
    uploadImage,
    fetchImages,
    // Drawing actions
    saveDrawing,
    fetchDrawings,
    // Utility
    clearError
  };

  return (
    <DiaryContext.Provider value={value}>
      {children}
    </DiaryContext.Provider>
  );
};

export const useDiary = () => {
  const context = useContext(DiaryContext);
  if (!context) {
    throw new Error('useDiary must be used within a DiaryProvider');
  }
  return context;
}; 