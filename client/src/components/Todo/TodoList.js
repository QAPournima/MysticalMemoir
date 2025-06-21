import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDiary } from '../../context/DiaryContext';
import { useTheme } from '../../context/ThemeContext';
import './TodoList.css';

// Helper function to safely parse JSON
const safeJSONParse = (jsonString, fallback = []) => {
  try {
    if (!jsonString || jsonString.trim() === '') {
      return fallback;
    }
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    console.warn('Invalid JSON data, using fallback:', error);
    return fallback;
  }
};

const TodoList = () => {
  const { todos, createTodo, updateTodo, deleteTodo, fetchTodos } = useDiary();
  const { currentHouse, getHouseInfo, sendMagicalNotification } = useTheme();
  
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoItem, setNewTodoItem] = useState('');
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const houseInfo = getHouseInfo(currentHouse);

  useEffect(() => {
    // Clean up any corrupted localStorage data
    try {
      const storedTodos = localStorage.getItem('magical_quests');
      if (storedTodos) {
        const parsed = JSON.parse(storedTodos);
        if (Array.isArray(parsed)) {
          // Clean up any todos with invalid items data
          const cleanedTodos = parsed.map(todo => ({
            ...todo,
            items: typeof todo.items === 'string' ? todo.items : '[]'
          }));
          localStorage.setItem('magical_quests', JSON.stringify(cleanedTodos));
        }
      }
    } catch (error) {
      console.warn('Clearing corrupted localStorage data:', error);
      localStorage.removeItem('magical_quests');
    }
    
    fetchTodos();
  }, []);

  const handleCreateTodo = async () => {
    if (!newTodoTitle.trim()) return;
    
    try {
      await createTodo({
        title: newTodoTitle,
        items: [],
        house: currentHouse,
        priority: 'medium'
      });
      setNewTodoTitle('');
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleAddItem = async (todoId, item) => {
    if (!item.trim()) return;
    
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;
    
    const items = safeJSONParse(todo.items);
    const newItems = [...items, { id: Date.now(), text: item, completed: false }];
    
    try {
      await updateTodo(todoId, { ...todo, items: JSON.stringify(newItems) });
      setNewTodoItem('');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleToggleItem = async (todoId, itemId) => {
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;
    
    const items = safeJSONParse(todo.items);
    const item = items.find(i => i.id === itemId);
    const updatedItems = items.map(i =>
      i.id === itemId ? { ...i, completed: !i.completed } : i
    );
    
    try {
      await updateTodo(todoId, { ...todo, items: JSON.stringify(updatedItems) });
      
      // Send notification when item is completed
      if (item && !item.completed) {
        sendMagicalNotification('Quest Task Completed!', {
          body: `You've completed: "${item.text}" ⚡`,
          tag: 'todo-complete'
        });
      }
    } catch (error) {
      console.error('Error toggling item:', error);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      await deleteTodo(todoId);
      setSelectedTodo(null);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="todo-list">
      <div className="todo-header">
        <h1 className="magical-title">📝 Magical Tasks</h1>
        <p className="todo-subtitle">
          Organize your quests and magical duties for {houseInfo.name}
        </p>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="new-todo-btn magical-button"
        >
          ✨ Create New Quest
        </button>
      </div>

      {showCreateForm && (
        <motion.div
          className="create-form magical-card"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>Create New Quest</h3>
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="Enter quest title..."
            className="magical-input"
            onKeyPress={(e) => e.key === 'Enter' && handleCreateTodo()}
          />
          <div className="form-actions">
            <button onClick={() => setShowCreateForm(false)} className="magical-button">
              Cancel
            </button>
            <button onClick={handleCreateTodo} className="magical-button">
              Create Quest
            </button>
          </div>
        </motion.div>
      )}

      <div className="todos-container">
        {todos.length === 0 ? (
          <div className="empty-state magical-card">
            <div className="empty-icon">📋</div>
            <h3>No quests yet</h3>
            <p>Create your first magical quest to get started!</p>
          </div>
        ) : (
          <div className="todos-grid">
            {todos.map((todo) => {
              const items = safeJSONParse(todo.items);
              const completedItems = items.filter(item => item.completed).length;
              const progress = items.length > 0 ? (completedItems / items.length) * 100 : 0;
              
              return (
                <motion.div
                  key={todo.id}
                  className="todo-card magical-card"
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedTodo(todo)}
                >
                  <div className="todo-header-card">
                    <h3 className="todo-title">{todo.title}</h3>
                    <span className="house-indicator">
                      {todo.house === 'gryffindor' && '🦁'}
                      {todo.house === 'slytherin' && '🐍'}
                      {todo.house === 'ravenclaw' && '🦅'}
                      {todo.house === 'hufflepuff' && '🦡'}
                    </span>
                  </div>
                  
                  <div className="progress-section">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {completedItems}/{items.length} completed
                    </span>
                  </div>
                  
                  <div className="todo-preview">
                    {items.slice(0, 3).map((item, index) => (
                      <div key={index} className={`item-preview ${item.completed ? 'completed' : ''}`}>
                        {item.completed ? '✅' : '⭕'} {item.text}
                      </div>
                    ))}
                    {items.length > 3 && (
                      <div className="more-items">+{items.length - 3} more items</div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Todo Detail Modal */}
      {selectedTodo && (
        <div className="modal-overlay">
          <motion.div
            className="todo-modal magical-card"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="modal-header">
              <h2>{selectedTodo.title}</h2>
              <button
                onClick={() => setSelectedTodo(null)}
                className="close-btn"
              >
                ✕
              </button>
            </div>
            
            <div className="modal-content">
              <div className="add-item-section">
                <input
                  type="text"
                  value={newTodoItem}
                  onChange={(e) => setNewTodoItem(e.target.value)}
                  placeholder="Add new task..."
                  className="magical-input"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddItem(selectedTodo.id, newTodoItem);
                    }
                  }}
                />
                <button
                  onClick={() => handleAddItem(selectedTodo.id, newTodoItem)}
                  className="magical-button"
                >
                  Add Task
                </button>
              </div>
              
              <div className="items-list">
                <AnimatePresence>
                  {safeJSONParse(selectedTodo.items).map((item) => (
                    <motion.div
                      key={item.id}
                      className={`todo-item ${item.completed ? 'completed' : ''}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <button
                        onClick={() => handleToggleItem(selectedTodo.id, item.id)}
                        className="item-toggle"
                      >
                        {item.completed ? '✅' : '⭕'}
                      </button>
                      <span className="item-text">{item.text}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="modal-actions">
              <button
                onClick={() => handleDeleteTodo(selectedTodo.id)}
                className="delete-todo-btn magical-button"
              >
                🗑️ Delete Quest
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TodoList; 