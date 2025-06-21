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
  const [newSubtask, setNewSubtask] = useState('');
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState({});
  
  const houseInfo = getHouseInfo(currentHouse);

  // Handle escape key to close full-page view
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedTodo) {
        setSelectedTodo(null);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [selectedTodo]);

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
      setSelectedTodo(null); // Ensure no todo is selected after creation
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleAddItem = async (todoId, item) => {
    if (!item.trim()) return;
    
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;
    
    const items = safeJSONParse(todo.items);
    const newItems = [...items, { 
      id: Date.now(), 
      text: item, 
      completed: false,
      subtasks: []
    }];
    
    try {
      const updatedTodo = { ...todo, items: JSON.stringify(newItems) };
      await updateTodo(todoId, updatedTodo);
      
      // Update selectedTodo state to reflect the new task
      setSelectedTodo(updatedTodo);
      setNewTodoItem('');
      
      sendMagicalNotification('Task Added!', {
        body: `Added "${item}" to your quest! ⚡`,
        tag: 'task-added'
      });
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleAddSubtask = async (todoId, taskId, subtask) => {
    if (!subtask.trim()) return;
    
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;
    
    const items = safeJSONParse(todo.items);
    const updatedItems = items.map(item => {
      if (item.id === taskId) {
        const subtasks = item.subtasks || [];
        return {
          ...item,
          subtasks: [...subtasks, {
            id: Date.now(),
            text: subtask,
            completed: false
          }]
        };
      }
      return item;
    });
    
    try {
      const updatedTodo = { ...todo, items: JSON.stringify(updatedItems) };
      await updateTodo(todoId, updatedTodo);
      
      // Update selectedTodo state to reflect the new subtask
      setSelectedTodo(updatedTodo);
      setNewSubtask('');
      
      sendMagicalNotification('Subtask Added!', {
        body: `Added subtask: "${subtask}" ⭐`,
        tag: 'subtask-added'
      });
    } catch (error) {
      console.error('Error adding subtask:', error);
    }
  };

  const handleToggleSubtask = async (todoId, taskId, subtaskId) => {
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;
    
    const items = safeJSONParse(todo.items);
    const updatedItems = items.map(item => {
      if (item.id === taskId) {
        const subtasks = item.subtasks || [];
        const updatedSubtasks = subtasks.map(subtask =>
          subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
        );
        return { ...item, subtasks: updatedSubtasks };
      }
      return item;
    });
    
    try {
      const updatedTodo = { ...todo, items: JSON.stringify(updatedItems) };
      await updateTodo(todoId, updatedTodo);
      
      // Update selectedTodo state to reflect the subtask change
      setSelectedTodo(updatedTodo);
    } catch (error) {
      console.error('Error toggling subtask:', error);
    }
  };

  const toggleTaskExpansion = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
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
      const updatedTodo = { ...todo, items: JSON.stringify(updatedItems) };
      await updateTodo(todoId, updatedTodo);
      
      // Update selectedTodo state to reflect the change
      setSelectedTodo(updatedTodo);
      
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
      {/* Main Todo List View */}
      {!selectedTodo && (
        <>
          <div className="todo-header">
            <h1 className="magical-title">🧙‍♂️ Magical Tasks</h1>
            <p className="todo-subtitle">
              Organize your quests and magical duties for {houseInfo.name}
            </p>
            
            <button
              onClick={() => {
                setSelectedTodo(null); // Close any open todo modal
                setShowCreateForm(true);
              }}
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
                <button onClick={() => {
                  setShowCreateForm(false);
                  setSelectedTodo(null); // Clear selected todo when canceling
                }} className="magical-button">
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
                      onClick={() => {
                        setShowCreateForm(false); // Close create form when opening todo
                        setSelectedTodo(todo);
                      }}
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
        </>
      )}

      {/* Full Page Quest Detail View */}
      {selectedTodo && (() => {
        // Get the most up-to-date todo from the todos array
        const currentTodo = todos.find(todo => todo.id === selectedTodo.id) || selectedTodo;
        const currentItems = safeJSONParse(currentTodo.items);
        
        return (
          <motion.div
            className="quest-detail-page"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            {/* Page Header */}
            <div className="quest-page-header">
              <div className="quest-info">
                <h1 className="quest-page-title">{currentTodo.title}</h1>
                <span className="quest-house">
                  {currentTodo.house === 'gryffindor' && '🦁 Gryffindor'}
                  {currentTodo.house === 'slytherin' && '🐍 Slytherin'}
                  {currentTodo.house === 'ravenclaw' && '🦅 Ravenclaw'}
                  {currentTodo.house === 'hufflepuff' && '🦡 Hufflepuff'}
                </span>
              </div>
              <button
                onClick={() => setSelectedTodo(null)}
                className="close-btn"
                title="Back to Quest List"
              >
                ←
              </button>
            </div>
            
            <div className="quest-page-content">
              {/* Quick Stats Bar */}
              <div className="quick-stats">
                <div className="stat-card completed">
                  <span className="stat-number">{currentItems.filter(item => item.completed).length}</span>
                  <span className="stat-label">✅ Done</span>
                </div>
                <div className="stat-card pending">
                  <span className="stat-number">{currentItems.filter(item => !item.completed).length}</span>
                  <span className="stat-label">⏳ Pending</span>
                </div>
                <div className="stat-card total">
                  <span className="stat-number">{currentItems.length}</span>
                  <span className="stat-label">📝 Total</span>
                </div>
              </div>

              {/* Add New Task Section */}
              <div className="add-task-section">
                <h3 className="section-title">✨ Add New Task</h3>
                <div className="task-input-group">
                  <input
                    type="text"
                    value={newTodoItem}
                    onChange={(e) => setNewTodoItem(e.target.value)}
                    placeholder="What magical task needs to be done?"
                    className="task-input"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddItem(currentTodo.id, newTodoItem);
                      }
                    }}
                  />
                  <button
                    onClick={() => handleAddItem(currentTodo.id, newTodoItem)}
                    className="add-btn"
                    disabled={!newTodoItem.trim()}
                    title="Add Task"
                  >
                    ➕ Add
                  </button>
                </div>
              </div>
              
              {/* Tasks List */}
              <div className="tasks-section">
                <h3 className="section-title">📋 Quest Tasks</h3>
                <div className="tasks-container">
                  {currentItems.length === 0 ? (
                    <div className="empty-tasks">
                      <div className="empty-icon">📝</div>
                      <p>No tasks yet! Add your first task above to begin your quest.</p>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {currentItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          className={`task-item ${item.completed ? 'completed' : ''}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="task-main">
                            <button
                              onClick={() => handleToggleItem(currentTodo.id, item.id)}
                              className="task-toggle"
                              title={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
                            >
                              {item.completed ? '✅' : '⭕'}
                            </button>
                            <span className="task-text">{item.text}</span>
                            <div className="task-actions">
                              <button
                                onClick={() => toggleTaskExpansion(item.id)}
                                className="expand-btn"
                                title="Add Subtasks"
                              >
                                {expandedTasks[item.id] ? '📘' : '📗'}
                              </button>
                              {item.completed && (
                                <span className="done-badge">Done!</span>
                              )}
                            </div>
                          </div>

                          {/* Subtasks Section */}
                          <AnimatePresence>
                            {expandedTasks[item.id] && (
                              <motion.div
                                className="subtasks-section"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="subtask-input">
                                  <input
                                    type="text"
                                    value={newSubtask}
                                    onChange={(e) => setNewSubtask(e.target.value)}
                                    placeholder="Add a subtask..."
                                    className="subtask-input-field"
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        handleAddSubtask(currentTodo.id, item.id, newSubtask);
                                      }
                                    }}
                                  />
                                  <button
                                    onClick={() => handleAddSubtask(currentTodo.id, item.id, newSubtask)}
                                    className="subtask-add-btn"
                                    disabled={!newSubtask.trim()}
                                    title="Add Subtask"
                                  >
                                    ⭐
                                  </button>
                                </div>

                                {item.subtasks && item.subtasks.length > 0 && (
                                  <div className="subtasks-list">
                                    {item.subtasks.map((subtask) => (
                                      <motion.div
                                        key={subtask.id}
                                        className={`subtask-item ${subtask.completed ? 'completed' : ''}`}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                      >
                                        <button
                                          onClick={() => handleToggleSubtask(currentTodo.id, item.id, subtask.id)}
                                          className="subtask-toggle"
                                          title={subtask.completed ? 'Mark as incomplete' : 'Mark as complete'}
                                        >
                                          {subtask.completed ? '⭐' : '🌟'}
                                        </button>
                                        <span className="subtask-text">{subtask.text}</span>
                                      </motion.div>
                                    ))}
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </div>
              
              {/* Delete Quest Section */}
              <div className="delete-quest-section">
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this quest? This action cannot be undone.')) {
                      handleDeleteTodo(currentTodo.id);
                    }
                  }}
                  className="delete-quest-btn"
                  title="Delete Quest"
                >
                  🗑️ Delete Quest
                </button>
              </div>
            </div>
          </motion.div>
        );
      })()}
    </div>
  );
};

export default TodoList; 