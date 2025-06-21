import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useDiary } from '../../context/DiaryContext';
import './DrawingCanvas.css';

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('brush');
  const [brushSize, setBrushSize] = useState(5);
  const [currentColor, setCurrentColor] = useState('#FFD700');
  const [savedDrawings, setSavedDrawings] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [lassoPoints, setLassoPoints] = useState([]);
  const [isLassoing, setIsLassoing] = useState(false);
  const [canvasHistory, setCanvasHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [isMaximized, setIsMaximized] = useState(false);
  const [strokeOpacity, setStrokeOpacity] = useState(1);
  const [fillColor, setFillColor] = useState('#FFFFFF');
  const [fillOpacity, setFillOpacity] = useState(0);
  const [isShapeStarted, setIsShapeStarted] = useState(false);
  const [shapeStart, setShapeStart] = useState(null);
  const [shapeEnd, setShapeEnd] = useState(null);
  const [isTextMode, setIsTextMode] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState(null);
  const [fontSize, setFontSize] = useState(16);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState(null);
  const [showGrid, setShowGrid] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [gridSize, setGridSize] = useState(20);
  const [toolsExpanded, setToolsExpanded] = useState(false);
  const [showFloatingGallery, setShowFloatingGallery] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [gallerySlideDirection, setGallerySlideDirection] = useState('');
  const [showGalleryNavigation, setShowGalleryNavigation] = useState(false);
  
  const { currentHouse, getHouseInfo, sendMagicalNotification } = useTheme();
  const { saveDrawing: saveDrawingToDatabase } = useDiary();
  const houseInfo = getHouseInfo(currentHouse);

  // Extended house-themed color palettes
  const colorPalettes = {
    gryffindor: [
      '#740001', '#8B0000', '#DC143C', '#FF0000', '#FF4500', '#FF6347',
      '#D3A625', '#FFD700', '#FFCC00', '#FFA500', '#FF8C00', '#DAA520',
      '#800000', '#A0522D', '#CD853F', '#DEB887', '#F4E6B0', '#FFF8DC',
      '#FFFFFF', '#F5F5F5', '#D3D3D3', '#808080', '#696969', '#000000'
    ],
    slytherin: [
      '#1A472A', '#006400', '#228B22', '#32CD32', '#00FF00', '#7CFC00',
      '#2A623D', '#556B2F', '#6B8E23', '#9ACD32', '#ADFF2F', '#C0FF8C',
      '#C0C0C0', '#A9A9A9', '#808080', '#696969', '#2F4F4F', '#708090',
      '#000000', '#191970', '#483D8B', '#4B0082', '#8A2BE2', '#9400D3'
    ],
    ravenclaw: [
      '#0E1A40', '#000080', '#4169E1', '#0000FF', '#1E90FF', '#87CEEB',
      '#4682B4', '#5F9EA0', '#B0C4DE', '#ADD8E6', '#E0F6FF', '#F0F8FF',
      '#946B2D', '#8B4513', '#CD853F', '#DEB887', '#F5DEB3', '#FFEBCD',
      '#FFE4B5', '#FFEFD5', '#FFF8DC', '#FFFFF0', '#FFFFFF', '#000000'
    ],
    hufflepuff: [
      '#FFD800', '#FFFF00', '#FFE135', '#FFDC00', '#FFC000', '#FFB000',
      '#000000', '#2F2F2F', '#404040', '#696969', '#808080', '#A9A9A9',
      '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#DEB887', '#F4A460',
      '#DDD', '#F5F5DC', '#FFF8DC', '#FFFACD', '#FFFFE0', '#FFFFFF'
    ]
  };

  const magicalBrushes = [
    { name: 'Phoenix Feather', size: 2, opacity: 0.8, effect: 'glow', icon: '🪶' },
    { name: 'Dragon Scale', size: 8, opacity: 1, effect: 'solid', icon: '🐉' },
    { name: 'Unicorn Hair', size: 15, opacity: 0.3, effect: 'soft', icon: '🦄' },
    { name: 'Hippogriff Quill', size: 3, opacity: 0.9, effect: 'precise', icon: '🪶' },
    { name: 'Thunderbird Wing', size: 12, opacity: 0.7, effect: 'electric', icon: '⚡' },
    { name: 'Basilisk Fang', size: 6, opacity: 0.9, effect: 'poison', icon: '🐍' }
  ];

    const drawingTools = [
    { name: 'brush', icon: '🖌️', label: 'Brush', category: 'drawing' },
    { name: 'pencil', icon: '✏️', label: 'Pencil', category: 'drawing' },
    { name: 'eraser', icon: '🧽', label: 'Eraser', category: 'drawing' },
    { name: 'line', icon: '📏', label: 'Line', category: 'shapes' },
    { name: 'rectangle', icon: '⬜', label: 'Rectangle', category: 'shapes' },
    { name: 'circle', icon: '⭕', label: 'Circle', category: 'shapes' },
    { name: 'ellipse', icon: '🥚', label: 'Ellipse', category: 'shapes' },
    { name: 'triangle', icon: '🔺', label: 'Triangle', category: 'shapes' },
    { name: 'polygon', icon: '🔶', label: 'Polygon', category: 'shapes' },
    { name: 'text', icon: '🔤', label: 'Text', category: 'drawing' },
    { name: 'selection', icon: '🔲', label: 'Select', category: 'editing' },
    { name: 'lasso', icon: '🪢', label: 'Lasso', category: 'editing' },
    { name: 'move', icon: '🤏', label: 'Move', category: 'editing' },
    { name: 'fill', icon: '🪣', label: 'Fill', category: 'drawing' },
    { name: 'pan', icon: '✋', label: 'Pan', category: 'navigation' }
  ];

  const handleToolChange = (newTool) => {
    // Reset all tool states when switching tools
    setTool(newTool);
    setIsDrawing(false);
    setIsSelecting(false);
    setIsLassoing(false);
    setIsShapeStarted(false);
    setIsTextMode(false);
    setIsPanning(false);
    setSelectedArea(null);
    setLassoPoints([]);
    setSelectionStart(null);
    setSelectionEnd(null);
    setShapeStart(null);
    setShapeEnd(null);
    setTextPosition(null);
    setPanStart(null);
  };

  // Helper function for snapping to grid
  const snapToGridCoord = (coord) => {
    if (!snapToGrid) return coord;
    return Math.round(coord / gridSize) * gridSize;
  };

  // Draw grid on canvas
  const drawGrid = (ctx) => {
    if (!showGrid) return;
    
    ctx.save();
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    
    // Vertical lines
    for (let x = 0; x <= ctx.canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ctx.canvas.height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= ctx.canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
      ctx.stroke();
    }
    
    ctx.restore();
  };

  // Shape drawing functions
  const drawShape = (ctx, shape, start, end, strokeColor, fillColor, strokeWidth, strokeOpacity, fillOpacity) => {
    ctx.save();
    
    const x1 = start.x;
    const y1 = start.y;
    const x2 = end.x;
    const y2 = end.y;
    const width = x2 - x1;
    const height = y2 - y1;
    
    // Set fill style
    if (fillOpacity > 0) {
      ctx.fillStyle = fillColor;
      ctx.globalAlpha = fillOpacity;
    }
    
    // Set stroke style
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.globalAlpha = strokeOpacity;
    
    switch (shape) {
      case 'line':
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        break;
        
      case 'rectangle':
        if (fillOpacity > 0) {
          ctx.globalAlpha = fillOpacity;
          ctx.fillRect(x1, y1, width, height);
        }
        ctx.globalAlpha = strokeOpacity;
        ctx.strokeRect(x1, y1, width, height);
        break;
        
      case 'circle':
        const radius = Math.sqrt(width * width + height * height) / 2;
        const centerX = x1 + width / 2;
        const centerY = y1 + height / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        if (fillOpacity > 0) {
          ctx.globalAlpha = fillOpacity;
          ctx.fill();
        }
        ctx.globalAlpha = strokeOpacity;
        ctx.stroke();
        break;
        
      case 'ellipse':
        const radiusX = Math.abs(width) / 2;
        const radiusY = Math.abs(height) / 2;
        const centerXE = x1 + width / 2;
        const centerYE = y1 + height / 2;
        ctx.beginPath();
        ctx.ellipse(centerXE, centerYE, radiusX, radiusY, 0, 0, 2 * Math.PI);
        if (fillOpacity > 0) {
          ctx.globalAlpha = fillOpacity;
          ctx.fill();
        }
        ctx.globalAlpha = strokeOpacity;
        ctx.stroke();
        break;
        
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(x1 + width / 2, y1); // Top point
        ctx.lineTo(x1, y2); // Bottom left
        ctx.lineTo(x2, y2); // Bottom right
        ctx.closePath();
        if (fillOpacity > 0) {
          ctx.globalAlpha = fillOpacity;
          ctx.fill();
        }
        ctx.globalAlpha = strokeOpacity;
        ctx.stroke();
        break;
    }
    
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;
    
    // Set white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save initial state to history
    setTimeout(() => saveCanvasState(), 100);
    
    // Load saved drawings from localStorage
    const loadDrawings = () => {
      const saved = JSON.parse(localStorage.getItem('magical_drawings') || '[]');
      setSavedDrawings(saved);
    };

    loadDrawings();

    // Listen for deletions from gallery
    const handleDrawingDeleted = () => {
      loadDrawings();
    };

    window.addEventListener('drawingDeleted', handleDrawingDeleted);

    return () => {
      window.removeEventListener('drawingDeleted', handleDrawingDeleted);
    };
  }, []);

  // Keyboard shortcuts effect
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't handle shortcuts when typing in text input
      if (isTextMode) return;
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      } else if (e.key === 'F11' || ((e.ctrlKey || e.metaKey) && e.key === 'm')) {
        e.preventDefault();
        toggleMaximize();
      } else if (e.key === 'b' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleToolChange('brush');
      } else if (e.key === 'p' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleToolChange('pencil');
      } else if (e.key === 'e' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleToolChange('eraser');
      } else if (e.key === 'l' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleToolChange('line');
      } else if (e.key === 'r' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleToolChange('rectangle');
      } else if (e.key === 'c' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleToolChange('circle');
      } else if (e.key === 't' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleToolChange('text');
      } else if (e.key === 's' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleToolChange('selection');
      } else if (e.key === 'f' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleToolChange('fill');
      } else if (e.key === 'g' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowGrid(!showGrid);
      } else if (e.key === 'h' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setSnapToGrid(!snapToGrid);
      } else if (e.key === ' ' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleToolChange('pan');
      } else if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        handleZoom(0.1);
      } else if (e.key === '-') {
        e.preventDefault();
        handleZoom(-0.1);
      } else if (e.key === '0' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setZoomLevel(1);
        setPanOffset({ x: 0, y: 0 });
        applyCanvasTransform();
      } else if (e.key === 'ArrowLeft' && showGalleryNavigation && savedDrawings.length > 0) {
        e.preventDefault();
        goToPrevGalleryItem();
      } else if (e.key === 'ArrowRight' && showGalleryNavigation && savedDrawings.length > 0) {
        e.preventDefault();
        goToNextGalleryItem();
      } else if (e.key === 'Enter' && showGalleryNavigation && savedDrawings.length > 0) {
        e.preventDefault();
        loadCurrentGalleryItem();
      } else if (e.key === 'Escape' && showGalleryNavigation) {
        e.preventDefault();
        setShowGalleryNavigation(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [historyStep, canvasHistory, isMaximized, showGrid, snapToGrid, isTextMode, showGalleryNavigation, savedDrawings.length, currentGalleryIndex]);

  // Canvas history management
  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    
    setCanvasHistory(prev => {
      const newHistory = prev.slice(0, historyStep + 1);
      newHistory.push(dataURL);
      
      // Limit history to 20 states to prevent memory issues
      if (newHistory.length > 20) {
        newHistory.shift();
        return newHistory;
      }
      
      return newHistory;
    });
    
    setHistoryStep(prev => {
      const newStep = prev + 1;
      return newStep >= 20 ? 19 : newStep;
    });
  };

  const undo = () => {
    if (historyStep > 0) {
      setHistoryStep(prev => prev - 1);
      restoreCanvasState(canvasHistory[historyStep - 1]);
      sendMagicalNotification('Undo Applied!', {
        body: 'Your last action has been undone. ↶',
        tag: 'undo-action'
      });
    }
  };

  const redo = () => {
    if (historyStep < canvasHistory.length - 1) {
      setHistoryStep(prev => prev + 1);
      restoreCanvasState(canvasHistory[historyStep + 1]);
      sendMagicalNotification('Redo Applied!', {
        body: 'Your action has been restored. ↷',
        tag: 'redo-action'
      });
    }
  };

  const restoreCanvasState = (dataURL) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    
    img.src = dataURL;
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    
    if (e.touches) {
      // Touch event
      const touch = e.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Get mouse position relative to canvas
    let x = clientX - rect.left;
    let y = clientY - rect.top;
    
    // Account for canvas transforms (zoom and pan)
    // First, adjust for the transform origin (center)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Translate to origin
    x -= centerX;
    y -= centerY;
    
    // Account for zoom level
    x = x / zoomLevel;
    y = y / zoomLevel;
    
    // Account for pan offset
    x -= panOffset.x / zoomLevel;
    y -= panOffset.y / zoomLevel;
    
    // Translate back from origin
    x += centerX / zoomLevel;
    y += centerY / zoomLevel;
    
    // Ensure coordinates are within canvas bounds
    const actualCanvasWidth = canvas.width;
    const actualCanvasHeight = canvas.height;
    
    // Scale coordinates to actual canvas size (not displayed size)
    x = (x / rect.width) * actualCanvasWidth;
    y = (y / rect.height) * actualCanvasHeight;
    
    return { x, y };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const snappedX = snapToGridCoord(x);
    const snappedY = snapToGridCoord(y);
    const coords = { x: snappedX, y: snappedY };
    const ctx = canvasRef.current.getContext('2d');
    
    if (tool === 'pan') {
      setIsPanning(true);
      setPanStart({ x, y });
    } else if (tool === 'text') {
      setTextPosition(coords);
      setIsTextMode(true);
      // Focus on text input when text tool is used
      setTimeout(() => {
        const textInputEl = document.getElementById('canvas-text-input');
        if (textInputEl) textInputEl.focus();
      }, 100);
    } else if (tool === 'selection') {
      setIsSelecting(true);
      setSelectionStart(coords);
      setSelectionEnd(coords);
    } else if (tool === 'lasso') {
      setIsLassoing(true);
      setLassoPoints([coords]);
    } else if (tool === 'fill') {
      floodFill(x, y, currentColor);
    } else if (['line', 'rectangle', 'circle', 'ellipse', 'triangle', 'polygon'].includes(tool)) {
      setIsShapeStarted(true);
      setShapeStart(coords);
      setShapeEnd(coords);
    } else if (tool === 'brush' || tool === 'pencil' || tool === 'eraser') {
      setIsDrawing(true);
      ctx.save();
      ctx.globalAlpha = strokeOpacity;
      if (tool === 'brush' || tool === 'pencil') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = tool === 'pencil' ? Math.max(1, brushSize / 2) : brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      } else if (tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = brushSize * 2;
        ctx.lineCap = 'round';
      }
      ctx.beginPath();
      ctx.moveTo(snappedX, snappedY);
      ctx.restore();
    }
  };

  const draw = (e) => {
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const snappedX = snapToGridCoord(x);
    const snappedY = snapToGridCoord(y);
    const coords = { x: snappedX, y: snappedY };
    const ctx = canvasRef.current.getContext('2d');
    
    if (isPanning && tool === 'pan') {
      if (panStart) {
        const deltaX = x - panStart.x;
        const deltaY = y - panStart.y;
        setPanOffset(prev => ({
          x: prev.x + deltaX,
          y: prev.y + deltaY
        }));
        setPanStart({ x, y });
        redrawCanvasWithTransform();
      }
    } else if (isSelecting && tool === 'selection') {
      setSelectionEnd(coords);
      redrawCanvasWithTransform();
      drawSelectionBox();
    } else if (isLassoing && tool === 'lasso') {
      setLassoPoints(prev => [...prev, coords]);
      redrawCanvasWithTransform();
      drawLassoPath();
    } else if (isShapeStarted && ['line', 'rectangle', 'circle', 'ellipse', 'triangle', 'polygon'].includes(tool)) {
      setShapeEnd(coords);
      redrawCanvasWithTransform();
      if (shapeStart) {
        drawShape(ctx, tool, shapeStart, coords, currentColor, fillColor, brushSize, strokeOpacity, fillOpacity);
      }
    } else if (isDrawing && (tool === 'brush' || tool === 'pencil' || tool === 'eraser')) {
      ctx.save();
      ctx.globalAlpha = strokeOpacity;
      if (tool === 'brush' || tool === 'pencil') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = tool === 'pencil' ? Math.max(1, brushSize / 2) : brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      } else if (tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = brushSize * 2;
        ctx.lineCap = 'round';
      }
      
      ctx.lineTo(snappedX, snappedY);
      ctx.stroke();
      ctx.restore();
    }
  };

  const stopDrawing = () => {
    if (isPanning) {
      setIsPanning(false);
      setPanStart(null);
    } else if (isSelecting) {
      setIsSelecting(false);
      if (selectionStart && selectionEnd) {
        const selection = {
          x: Math.min(selectionStart.x, selectionEnd.x),
          y: Math.min(selectionStart.y, selectionEnd.y),
          width: Math.abs(selectionEnd.x - selectionStart.x),
          height: Math.abs(selectionEnd.y - selectionStart.y)
        };
        setSelectedArea(selection);
      }
    } else if (isLassoing) {
      setIsLassoing(false);
      if (lassoPoints.length > 2) {
        // Close the lasso path
        setLassoPoints(prev => [...prev, prev[0]]);
      }
    } else if (isShapeStarted) {
      setIsShapeStarted(false);
      if (shapeStart && shapeEnd) {
        const ctx = canvasRef.current.getContext('2d');
        drawShape(ctx, tool, shapeStart, shapeEnd, currentColor, fillColor, brushSize, strokeOpacity, fillOpacity);
        saveCanvasState();
      }
      setShapeStart(null);
      setShapeEnd(null);
    } else if (isDrawing) {
      setIsDrawing(false);
      const ctx = canvasRef.current.getContext('2d');
      ctx.beginPath();
      // Save canvas state after drawing
      saveCanvasState();
    }
  };

  // Helper functions for new tools
  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // This would ideally restore the original canvas state
    // For now, we'll just clear and redraw
  };

  const redrawCanvasWithTransform = () => {
    if (canvasHistory[historyStep]) {
      restoreCanvasState(canvasHistory[historyStep]);
      // Redraw grid on top of restored content
      setTimeout(() => {
        const ctx = canvasRef.current.getContext('2d');
        drawGrid(ctx);
      }, 10);
    }
  };

  // Apply grid drawing effect
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      drawGrid(ctx);
    }
  }, [showGrid, gridSize]);

  // Text handling functions
  const handleTextInput = (e) => {
    if (e.key === 'Enter' && textPosition && textInput.trim()) {
      addTextToCanvas();
    } else if (e.key === 'Escape') {
      cancelTextInput();
    }
  };

  const addTextToCanvas = () => {
    if (!textPosition || !textInput.trim()) return;
    
    const ctx = canvasRef.current.getContext('2d');
    ctx.save();
    ctx.fillStyle = currentColor;
    ctx.font = `${fontSize}px Arial`;
    ctx.globalAlpha = strokeOpacity;
    ctx.fillText(textInput, textPosition.x, textPosition.y);
    ctx.restore();
    
    setTextInput('');
    setTextPosition(null);
    setIsTextMode(false);
    saveCanvasState();
    
    sendMagicalNotification('Text Added!', {
      body: 'Your text has been added to the canvas! ✍️',
      tag: 'text-added'
    });
  };

  const cancelTextInput = () => {
    setTextInput('');
    setTextPosition(null);
    setIsTextMode(false);
  };

  // Zoom and pan functions
  const handleZoom = (delta) => {
    const newZoom = Math.max(0.1, Math.min(5, zoomLevel + delta));
    setZoomLevel(newZoom);
    applyCanvasTransform();
  };

  const applyCanvasTransform = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.transform = `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`;
      canvas.style.transformOrigin = 'center center';
    }
  };

  // Apply transforms when zoom or pan changes
  useEffect(() => {
    applyCanvasTransform();
  }, [zoomLevel, panOffset]);

  const drawSelectionBox = () => {
    if (!selectionStart || !selectionEnd) return;
    
    const ctx = canvasRef.current.getContext('2d');
    const x = Math.min(selectionStart.x, selectionEnd.x);
    const y = Math.min(selectionStart.y, selectionEnd.y);
    const width = Math.abs(selectionEnd.x - selectionStart.x);
    const height = Math.abs(selectionEnd.y - selectionStart.y);
    
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
    ctx.restore();
  };

  const drawLassoPath = () => {
    if (lassoPoints.length < 2) return;
    
    const ctx = canvasRef.current.getContext('2d');
    ctx.save();
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lassoPoints[0].x, lassoPoints[0].y);
    
    for (let i = 1; i < lassoPoints.length; i++) {
      ctx.lineTo(lassoPoints[i].x, lassoPoints[i].y);
    }
    
    ctx.stroke();
    ctx.restore();
  };

  const floodFill = (startX, startY, fillColor) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Round coordinates to integers
    startX = Math.floor(startX);
    startY = Math.floor(startY);
    
    // Check bounds
    if (startX < 0 || startY < 0 || startX >= canvas.width || startY >= canvas.height) {
      return;
    }
    
    const startPos = (startY * canvas.width + startX) * 4;
    const startR = data[startPos];
    const startG = data[startPos + 1];
    const startB = data[startPos + 2];
    const startA = data[startPos + 3];
    
    // Allow filling, but we'll check area size during filling to prevent huge fills
    
    // Convert fill color to RGB
    const fillColorRgb = hexToRgb(fillColor);
    if (!fillColorRgb) return;
    
    const fillR = fillColorRgb.r;
    const fillG = fillColorRgb.g;
    const fillB = fillColorRgb.b;
    
    // If the starting color is the same as fill color, no need to fill
    if (startR === fillR && startG === fillG && startB === fillB) return;
    
    // Use a more efficient scanline flood fill algorithm
    const pixelStack = [{x: startX, y: startY}];
    const maxIterations = 100000; // Prevent infinite loops
    let iterations = 0;
    let pixelsFilled = 0;
    const maxPixelsPerFill = 80000; // Maximum pixels to fill in one operation
    
    // Helper function to check if pixel matches target color
    const matchesTargetColor = (x, y) => {
      if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return false;
      const pos = (y * canvas.width + x) * 4;
      return data[pos] === startR && data[pos + 1] === startG && 
             data[pos + 2] === startB && data[pos + 3] === startA;
    };
    
    // Helper function to set pixel color
    const setPixelColor = (x, y) => {
      const pos = (y * canvas.width + x) * 4;
      data[pos] = fillR;
      data[pos + 1] = fillG;
      data[pos + 2] = fillB;
      data[pos + 3] = 255;
      pixelsFilled++;
    };
    
    while (pixelStack.length > 0 && iterations < maxIterations) {
      iterations++;
      const {x, y} = pixelStack.pop();
      
      if (!matchesTargetColor(x, y)) continue;
      
      // Fill current pixel
      setPixelColor(x, y);
      
      // Add neighboring pixels to stack (4-directional)
      if (matchesTargetColor(x + 1, y)) pixelStack.push({x: x + 1, y});
      if (matchesTargetColor(x - 1, y)) pixelStack.push({x: x - 1, y});
      if (matchesTargetColor(x, y + 1)) pixelStack.push({x, y: y + 1});
      if (matchesTargetColor(x, y - 1)) pixelStack.push({x, y: y - 1});
      
      // Check if we've exceeded our maximum fill size
      if (pixelsFilled > maxPixelsPerFill) {
        sendMagicalNotification('Fill Complete!', {
          body: `Filled ${pixelsFilled.toLocaleString()} pixels! Large areas may take a moment to process. ✨`,
          tag: 'fill-large-area'
        });
        break; // Stop here but apply what we've filled so far
      }
      
      // Prevent stack from getting too large
      if (pixelStack.length > 8000) {
        break;
      }
    }
    
    if (iterations >= maxIterations) {
      console.warn('Flood fill stopped - max iterations reached');
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Save canvas state after filling
    saveCanvasState();
    
    if (pixelsFilled > 0) {
      sendMagicalNotification('Fill Complete!', {
        body: `Successfully filled ${pixelsFilled.toLocaleString()} pixels! 🪣✨`,
        tag: 'fill-success'
      });
    }
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };



  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setSelectedArea(null);
    setLassoPoints([]);
    // Save canvas state after clearing
    saveCanvasState();
    sendMagicalNotification('Canvas Cleared!', {
      body: 'Your canvas has been cleared and ready for new artwork! 🎨',
      tag: 'canvas-cleared'
    });
  };

  const saveDrawing = async () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    const drawingName = prompt('Name your magical artwork:') || `Artwork ${Date.now()}`;
    
    const drawing = {
      id: Date.now(),
      name: drawingName,
      dataURL,
      house: currentHouse,
      createdAt: new Date().toISOString()
    };

    try {
      // Save to localStorage
      const updatedDrawings = [...savedDrawings, drawing];
      setSavedDrawings(updatedDrawings);
      localStorage.setItem('magical_drawings', JSON.stringify(updatedDrawings));
      
      // Save to diary context if available (format for server API)
      if (saveDrawingToDatabase) {
        await saveDrawingToDatabase({
          title: drawingName,
          canvas_data: dataURL
        });
      }
      
      sendMagicalNotification('Artwork Saved!', {
        body: `Your magical creation "${drawingName}" has been saved to your gallery! ✨`,
        tag: 'drawing-saved'
      });

      // Dispatch custom event to notify gallery
      window.dispatchEvent(new Event('drawingSaved'));
    } catch (error) {
      console.error('Error saving drawing:', error);
    }
  };

  const loadDrawing = (drawing) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      // Save as new state in history
      saveCanvasState();
    };
    
    img.src = drawing.dataURL;
    
    sendMagicalNotification('Artwork Loaded!', {
      body: `"${drawing.name}" has been loaded to the canvas! 🎨`,
      tag: 'drawing-loaded'
    });
  };

  const deleteDrawing = (drawingId) => {
    if (window.confirm('Are you sure you want to delete this artwork? This cannot be undone.')) {
      const updatedDrawings = savedDrawings.filter(drawing => drawing.id !== drawingId);
      setSavedDrawings(updatedDrawings);
      localStorage.setItem('magical_drawings', JSON.stringify(updatedDrawings));
      
      sendMagicalNotification('Artwork Deleted!', {
        body: 'The selected artwork has been removed from your gallery. 🗑️',
        tag: 'drawing-deleted'
      });
    }
  };

  const clearAllDrawings = () => {
    setSavedDrawings([]);
    localStorage.removeItem('magical_drawings');
    
    sendMagicalNotification('Gallery Cleared!', {
      body: 'All artwork has been removed from your gallery. 🧹',
      tag: 'gallery-cleared'
    });
  };

  const exportAllDrawings = () => {
    if (savedDrawings.length === 0) {
      sendMagicalNotification('No Artwork to Export!', {
        body: 'Save some drawings first to export them. 📦',
        tag: 'export-empty'
      });
      return;
    }

    // Create and trigger download for each drawing
    savedDrawings.forEach((drawing, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.download = `${drawing.name}.png`;
        link.href = drawing.dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 100); // Stagger downloads to avoid browser blocking
    });

    sendMagicalNotification('Export Started!', {
      body: `Downloading ${savedDrawings.length} artwork files! 📦✨`,
      tag: 'export-started'
    });
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
    
    // Resize canvas after state change
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (isMaximized) {
        // Restore original size
        canvas.width = 800;
        canvas.height = 600;
      } else {
        // Maximize size - use most of viewport (accounting for tools panel)
        const maxWidth = window.innerWidth - 380; // Account for tools panel width + gap
        const maxHeight = window.innerHeight - 200;
        canvas.width = Math.min(maxWidth, 1000);
        canvas.height = Math.min(maxHeight, 800);
      }
      
      // Redraw canvas content if there's history
      if (canvasHistory[historyStep]) {
        restoreCanvasState(canvasHistory[historyStep]);
      }
    }, 100);

    sendMagicalNotification(
      isMaximized ? 'Canvas Minimized!' : 'Canvas Maximized!', 
      {
        body: isMaximized 
          ? 'Canvas returned to normal view 📐' 
          : 'Canvas expanded for better drawing experience! 🖼️',
        tag: 'canvas-resize'
      }
    );
  };

  // Gallery navigation functions
  const goToNextGalleryItem = () => {
    if (savedDrawings.length === 0) return;
    
    setGallerySlideDirection('next');
    setCurrentGalleryIndex(prev => {
      const nextIndex = (prev + 1) % savedDrawings.length;
      return nextIndex;
    });
    
    setTimeout(() => setGallerySlideDirection(''), 300);
    
    sendMagicalNotification('Next Artwork', {
      body: `Viewing "${savedDrawings[(currentGalleryIndex + 1) % savedDrawings.length]?.name}" 🖼️`,
      tag: 'gallery-navigation'
    });
  };

  const goToPrevGalleryItem = () => {
    if (savedDrawings.length === 0) return;
    
    setGallerySlideDirection('prev');
    setCurrentGalleryIndex(prev => {
      const prevIndex = prev === 0 ? savedDrawings.length - 1 : prev - 1;
      return prevIndex;
    });
    
    setTimeout(() => setGallerySlideDirection(''), 300);
    
    sendMagicalNotification('Previous Artwork', {
      body: `Viewing "${savedDrawings[currentGalleryIndex === 0 ? savedDrawings.length - 1 : currentGalleryIndex - 1]?.name}" 🖼️`,
      tag: 'gallery-navigation'
    });
  };

  const toggleGalleryNavigation = () => {
    setShowGalleryNavigation(!showGalleryNavigation);
    if (!showGalleryNavigation && savedDrawings.length > 0) {
      sendMagicalNotification('Gallery Navigation Enabled', {
        body: 'Use arrow buttons to browse your artwork! ◀️ ▶️',
        tag: 'gallery-toggle'
      });
    }
  };

  const loadCurrentGalleryItem = () => {
    if (savedDrawings.length > 0 && savedDrawings[currentGalleryIndex]) {
      loadDrawing(savedDrawings[currentGalleryIndex]);
      setShowGalleryNavigation(false);
    }
  };

  // Reset gallery index when drawings change
  useEffect(() => {
    if (currentGalleryIndex >= savedDrawings.length && savedDrawings.length > 0) {
      setCurrentGalleryIndex(0);
    }
  }, [savedDrawings.length, currentGalleryIndex]);

  return (
    <div className="drawing-canvas">
      <div className="drawing-header">
        <h1 className="magical-title">🎨 Magical Drawing Canvas</h1>
        <p className="drawing-subtitle">
          Create magical artwork with {houseInfo.name} colors and enchanted brushes
        </p>
        
        {/* History Actions - Moved to top */}
        <motion.div 
          className="canvas-history-controls magical-card"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="history-controls-inline">
            <button 
              className={`history-btn undo-btn ${historyStep <= 0 ? 'disabled' : ''}`}
              onClick={undo}
              disabled={historyStep <= 0}
              title="Undo (Ctrl+Z)"
            >
              <span className="history-icon">↶</span>
              <span className="history-label">Undo</span>
            </button>
            <button 
              className={`history-btn redo-btn ${historyStep >= canvasHistory.length - 1 ? 'disabled' : ''}`}
              onClick={redo}
              disabled={historyStep >= canvasHistory.length - 1}
              title="Redo (Ctrl+Y)"
            >
              <span className="history-icon">↷</span>
              <span className="history-label">Redo</span>
            </button>
            <div className="history-info">
              <small>Step {historyStep + 1} of {canvasHistory.length}</small>
            </div>
          </div>
        </motion.div>
      </div>

      <div className={`drawing-workspace ${isMaximized ? 'maximized' : ''}`}>
        {/* Tools Panel */}
        <motion.div 
          className={`tools-panel magical-card ${isMaximized ? 'minimized-tools' : ''}`}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
        >
            <h3>🪄 Magical Tools</h3>
          
            {/* Drawing Tools - Collapsible */}
            <div className="tool-section">
              <div className="tool-section-header">
                <label>Drawing Tools:</label>
                <button 
                  className="expand-toggle-btn"
                  onClick={() => setToolsExpanded(!toolsExpanded)}
                  title={toolsExpanded ? 'Collapse Tools' : 'Expand All Tools'}
                >
                  {toolsExpanded ? '▲' : '▼'}
                </button>
              </div>
              <div className="tool-buttons-grid">
                {(toolsExpanded ? drawingTools : drawingTools.slice(0, 3)).map((drawTool) => (
                  <button 
                    key={drawTool.name}
                    className={`tool-btn ${tool === drawTool.name ? 'active' : ''}`}
                    onClick={() => handleToolChange(drawTool.name)}
                    title={drawTool.label}
                  >
                    <span className="tool-icon">{drawTool.icon}</span>
                    <span className="tool-label">{drawTool.label}</span>
                  </button>
                ))}
              </div>
              {!toolsExpanded && (
                <div className="tools-counter">
                  <small>Showing 3 of {drawingTools.length} tools</small>
                </div>
              )}
            </div>

            {/* Brush Size */}
            {(tool === 'brush' || tool === 'pencil' || tool === 'eraser' || ['line', 'rectangle', 'circle', 'ellipse', 'triangle', 'polygon'].includes(tool)) && (
              <div className="tool-section">
                <label>{tool === 'eraser' ? 'Eraser' : 'Line/Brush'} Size: {brushSize}px</label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={brushSize}
                  onChange={(e) => setBrushSize(e.target.value)}
                  className="size-slider"
                />
              </div>
            )}

            {/* Text Size */}
            {tool === 'text' && (
              <div className="tool-section">
                <label>Text Size: {fontSize}px</label>
                <input
                  type="range"
                  min="8"
                  max="72"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="size-slider"
                />
              </div>
            )}

            {/* Opacity Controls */}
            <div className="tool-section">
              <label>Stroke Opacity: {Math.round(strokeOpacity * 100)}%</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={strokeOpacity}
                onChange={(e) => setStrokeOpacity(e.target.value)}
                className="opacity-slider"
              />
            </div>

            {/* Fill Controls for Shapes */}
            {['rectangle', 'circle', 'ellipse', 'triangle', 'polygon'].includes(tool) && (
              <div className="tool-section">
                <label>Fill Opacity: {Math.round(fillOpacity * 100)}%</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={fillOpacity}
                  onChange={(e) => setFillOpacity(e.target.value)}
                  className="opacity-slider"
                />
                <div className="color-input-group">
                  <label>Fill Color:</label>
                  <input
                    type="color"
                    value={fillColor}
                    onChange={(e) => setFillColor(e.target.value)}
                    className="color-picker"
                  />
                </div>
              </div>
            )}



            {/* Grid Controls */}
            <div className="tool-section">
              <label>Grid & Snap:</label>
              <div className="grid-controls">
                <button 
                  className={`grid-toggle-btn ${showGrid ? 'active' : ''}`}
                  onClick={() => setShowGrid(!showGrid)}
                  title="Toggle Grid"
                >
                  📐 {showGrid ? 'Hide' : 'Show'} Grid
                </button>
                <button 
                  className={`snap-toggle-btn ${snapToGrid ? 'active' : ''}`}
                  onClick={() => setSnapToGrid(!snapToGrid)}
                  title="Toggle Snap to Grid"
                >
                  🧲 {snapToGrid ? 'Snap Off' : 'Snap On'}
                </button>
              </div>
              {showGrid && (
                <div className="grid-size-control">
                  <label>Grid Size: {gridSize}px</label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={gridSize}
                    onChange={(e) => setGridSize(e.target.value)}
                    className="grid-size-slider"
                  />
                </div>
              )}
            </div>

            {/* Current Tool Info */}
            <div className="tool-section">
              <label>Current Tool:</label>
              <div className="current-tool-info">
                <span className="current-tool-icon">
                  {drawingTools.find(t => t.name === tool)?.icon}
                </span>
                <span className="current-tool-name">
                  {drawingTools.find(t => t.name === tool)?.label}
                </span>
              </div>
            </div>



            {/* House Colors */}
            <div className="tool-section">
              <label>{houseInfo.name} Colors:</label>
              <div className="color-palette-extended">
                {colorPalettes[currentHouse].map((color, index) => (
                  <button
                    key={index}
                    className={`color-btn ${currentColor === color ? 'active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setCurrentColor(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Magical Brushes */}
            <div className="tool-section">
              <label>✨ Magical Brushes:</label>
              <div className="brush-buttons">
                {magicalBrushes.map((brush, index) => (
                  <button
                    key={index}
                    className="brush-btn"
                    onClick={() => setBrushSize(brush.size)}
                    title={`${brush.name} - Size: ${brush.size}px`}
                  >
                    <span className="brush-icon">{brush.icon}</span>
                    <span className="brush-name">{brush.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas Actions */}
            <div className="tool-section">
              <label>Canvas Actions:</label>
              <div className="action-buttons">
                <button onClick={clearCanvas} className="action-btn clear">
                  🗑️ Clear
                </button>
                <button onClick={saveDrawing} className="action-btn save">
                  💾 Save
                </button>
                {(selectedArea || lassoPoints.length > 0) && (
                  <button 
                    onClick={() => {
                      setSelectedArea(null);
                      setLassoPoints([]);
                    }} 
                    className="action-btn selection-clear"
                  >
                    ✂️ Clear Selection
                  </button>
                )}
              </div>
            </div>
          </motion.div>

        {/* Canvas Area - Contains canvas and navigation */}
        <div className="canvas-area">
          {/* Main Canvas */}
          <motion.div 
            className={`canvas-container magical-card ${isMaximized ? 'maximized-canvas' : ''}`}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
          {/* Maximize/Minimize Button */}
          <button 
            className="maximize-btn"
            onClick={toggleMaximize}
            title={isMaximized ? 'Minimize Canvas (F11 or Ctrl+M)' : 'Maximize Canvas (F11 or Ctrl+M)'}
          >
            {isMaximized ? '📐' : '🖼️'}
          </button>
          
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={(e) => {
              // Track cursor position for visual feedback
              const coords = getCoordinates(e);
              setCursorPosition(coords);
              
              // Continue with normal drawing
              draw(e);
            }}
            onMouseEnter={() => setShowCursor(true)}
            onMouseLeave={(e) => {
              setShowCursor(false);
              stopDrawing();
            }}
            onMouseUp={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={(e) => {
              const coords = getCoordinates(e);
              setCursorPosition(coords);
              draw(e);
            }}
            onTouchEnd={stopDrawing}
            onWheel={(e) => {
              if (e.ctrlKey) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                handleZoom(delta);
              }
            }}
            className="drawing-canvas-element"
            data-tool={tool}
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
              transformOrigin: 'center center'
            }}
          />

          {/* Custom Cursor Indicator */}
          {showCursor && tool !== 'pan' && tool !== 'text' && canvasRef.current && (
            <div 
              className="custom-cursor"
              style={{
                position: 'absolute',
                left: `${Math.max(0, Math.min(100, (cursorPosition.x / canvasRef.current.width) * 100))}%`,
                top: `${Math.max(0, Math.min(100, (cursorPosition.y / canvasRef.current.height) * 100))}%`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 10,
                width: `${tool === 'eraser' ? brushSize * 2 : brushSize}px`,
                height: `${tool === 'eraser' ? brushSize * 2 : brushSize}px`,
                border: `2px solid ${tool === 'eraser' ? '#ff6b6b' : currentColor}`,
                borderRadius: '50%',
                opacity: 0.7,
                transition: 'all 0.1s ease',
                mixBlendMode: 'difference'
              }}
            />
          )}

          {/* Text Input Overlay */}
          {isTextMode && textPosition && (
            <div 
              className="text-input-overlay"
              style={{
                position: 'absolute',
                left: textPosition.x,
                top: textPosition.y,
                zIndex: 1000
              }}
            >
              <input
                id="canvas-text-input"
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={handleTextInput}
                onBlur={cancelTextInput}
                className="canvas-text-input"
                placeholder="Enter text..."
                style={{
                  fontSize: `${fontSize}px`,
                  color: currentColor,
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '2px solid #FFD700',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  outline: 'none',
                  fontFamily: 'Arial, sans-serif'
                }}
                autoFocus
              />
              <div className="text-input-help">
                <small>Press Enter to add text, Escape to cancel</small>
              </div>
            </div>
          )}

          {/* Canvas Gallery Overlay - Sliding Gallery on Canvas */}
          {savedDrawings.length > 0 && (
            <motion.div 
              className="canvas-gallery-toggle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button 
                className={`canvas-gallery-btn ${showGalleryNavigation ? 'active' : ''}`}
                onClick={toggleGalleryNavigation}
                title="Toggle Canvas Gallery"
              >
                🖼️ Gallery
              </button>
            </motion.div>
          )}

          {/* Canvas Gallery Overlay */}
          {showGalleryNavigation && savedDrawings.length > 0 && (
            <motion.div 
              className="canvas-gallery-overlay"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <div className="canvas-gallery-content magical-card">
                <div className="canvas-gallery-header">
                  <h4>🎭 Canvas Gallery</h4>
                  <div className="canvas-gallery-controls">
                    <span className="canvas-slide-counter">
                      {currentGalleryIndex + 1} of {savedDrawings.length}
                    </span>
                    <button 
                      className="close-canvas-gallery"
                      onClick={() => setShowGalleryNavigation(false)}
                      title="Close Gallery"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                
                <div className="canvas-gallery-navigation">
                  <button 
                    className="canvas-nav-arrow canvas-prev-btn"
                    onClick={goToPrevGalleryItem}
                    disabled={savedDrawings.length <= 1}
                    title="Previous Artwork"
                  >
                    ◀️
                  </button>
                  
                  <div className="canvas-gallery-slide">
                    {savedDrawings[currentGalleryIndex] && (
                      <motion.div 
                        className="canvas-current-slide"
                        key={currentGalleryIndex}
                        initial={{ 
                          x: gallerySlideDirection === 'next' ? 200 : -200,
                          opacity: 0,
                          scale: 0.8
                        }}
                        animate={{ 
                          x: 0, 
                          opacity: 1,
                          scale: 1
                        }}
                        transition={{ 
                          duration: 0.4,
                          ease: "easeInOut"
                        }}
                      >
                        <div className="canvas-slide-artwork">
                          <img 
                            src={savedDrawings[currentGalleryIndex].dataURL} 
                            alt={savedDrawings[currentGalleryIndex].name}
                            className="canvas-slide-image"
                          />
                          <div className="canvas-slide-overlay">
                            <button 
                              className="canvas-slide-load-btn"
                              onClick={loadCurrentGalleryItem}
                              title="Load to Canvas"
                            >
                              📂 Load
                            </button>
                            <button 
                              className="canvas-slide-delete-btn"
                              onClick={() => deleteDrawing(savedDrawings[currentGalleryIndex].id)}
                              title="Delete Artwork"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                        <div className="canvas-slide-info">
                          <h5 className="canvas-slide-title">{savedDrawings[currentGalleryIndex].name}</h5>
                          {savedDrawings[currentGalleryIndex].house && (
                            <span className={`house-badge house-${savedDrawings[currentGalleryIndex].house.toLowerCase()}`}>
                              {savedDrawings[currentGalleryIndex].house}
                            </span>
                          )}
                          {savedDrawings[currentGalleryIndex].createdAt && (
                            <small className="canvas-slide-date">
                              {new Date(savedDrawings[currentGalleryIndex].createdAt).toLocaleDateString()}
                            </small>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                  
                  <button 
                    className="canvas-nav-arrow canvas-next-btn"
                    onClick={goToNextGalleryItem}
                    disabled={savedDrawings.length <= 1}
                    title="Next Artwork"
                  >
                    ▶️
                  </button>
                </div>
                
                {/* Canvas Gallery Dots */}
                <div className="canvas-gallery-dots">
                  {savedDrawings.map((_, index) => (
                    <button
                      key={index}
                      className={`canvas-gallery-dot ${currentGalleryIndex === index ? 'active' : ''}`}
                      onClick={() => setCurrentGalleryIndex(index)}
                      title={`View ${savedDrawings[index].name}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
                  </motion.div>

          {/* Navigation Controls - Below Canvas */}
        <motion.div 
          className="navigation-controls magical-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="nav-controls-grid">
            {/* Zoom Controls */}
            <div className="nav-section">
              <label>Zoom: {Math.round(zoomLevel * 100)}%</label>
              <div className="zoom-controls-compact">
                <button 
                  className="nav-btn zoom-out" 
                  onClick={() => handleZoom(-0.1)}
                  title="Zoom Out (-)"
                >
                  🔍-
                </button>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={zoomLevel}
                  onChange={(e) => setZoomLevel(e.target.value)}
                  className="zoom-slider-compact"
                />
                <button 
                  className="nav-btn zoom-in"
                  onClick={() => handleZoom(0.1)}
                  title="Zoom In (+)"
                >
                  🔍+
                </button>
              </div>
            </div>
            
            {/* Pan & Reset Controls */}
            <div className="nav-section">
              <label>Navigation:</label>
              <div className="nav-buttons">
                <button 
                  className={`nav-btn pan-btn ${tool === 'pan' ? 'active' : ''}`}
                  onClick={() => handleToolChange('pan')}
                  title="Pan Tool (Space)"
                >
                  ✋ Pan
                </button>
                <button 
                  className="nav-btn reset-btn"
                  onClick={() => {
                    setZoomLevel(1);
                    setPanOffset({ x: 0, y: 0 });
                    applyCanvasTransform();
                  }}
                  title="Reset View (0)"
                >
                  🎯 Reset
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        </div>

        {/* Magical Gallery Panel with Sliding Navigation */}
        {!isMaximized && (
          <motion.div 
            className="gallery-panel magical-card"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
          >
            <div className="gallery-header">
              <h3>🖼️ Magical Gallery</h3>
              <div className="gallery-stats">
                <small>{savedDrawings.length} Artwork{savedDrawings.length !== 1 ? 's' : ''}</small>
              </div>
            </div>
            
            <div className="saved-drawings">
              {savedDrawings.length === 0 ? (
                <div className="no-drawings">
                  <div className="empty-gallery-icon">🎨</div>
                  <p>No magical artwork yet!</p>
                  <small>Create and save your first masterpiece to see it here</small>
                </div>
              ) : (
                <>
                  {/* Gallery Navigation Toggle */}
                  <div className="gallery-mode-toggle">
                    <button 
                      className={`mode-toggle-btn ${showGalleryNavigation ? 'active' : ''}`}
                      onClick={toggleGalleryNavigation}
                      title={showGalleryNavigation ? 'Show All Artwork' : 'Enable Sliding Gallery'}
                    >
                      {showGalleryNavigation ? '📱 Gallery View' : '🎯 Slide View'}
                    </button>
                  </div>

                  {/* Sliding Gallery Navigation */}
                  {showGalleryNavigation ? (
                    <div className="sliding-gallery">
                      <div className="gallery-slide-header">
                        <h4>🎭 Artwork Slideshow</h4>
                        <div className="slide-counter">
                          {currentGalleryIndex + 1} of {savedDrawings.length}
                        </div>
                      </div>
                      
                      <div className="gallery-slide-container">
                        <div className="gallery-navigation-controls">
                          <button 
                            className="nav-arrow prev-btn"
                            onClick={goToPrevGalleryItem}
                            disabled={savedDrawings.length <= 1}
                            title="Previous Artwork"
                          >
                            ◀️
                          </button>
                          
                          <div className={`gallery-slide-content ${gallerySlideDirection}`}>
                            {savedDrawings[currentGalleryIndex] && (
                              <motion.div 
                                className="current-slide"
                                key={currentGalleryIndex}
                                initial={{ 
                                  x: gallerySlideDirection === 'next' ? 100 : -100,
                                  opacity: 0 
                                }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ 
                                  x: gallerySlideDirection === 'next' ? -100 : 100,
                                  opacity: 0 
                                }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="slide-artwork">
                                  <img 
                                    src={savedDrawings[currentGalleryIndex].dataURL} 
                                    alt={savedDrawings[currentGalleryIndex].name}
                                    className="slide-image"
                                  />
                                  <div className="slide-overlay">
                                    <button 
                                      className="slide-load-btn"
                                      onClick={loadCurrentGalleryItem}
                                      title="Load to Canvas"
                                    >
                                      📂 Load
                                    </button>
                                    <button 
                                      className="slide-delete-btn"
                                      onClick={() => deleteDrawing(savedDrawings[currentGalleryIndex].id)}
                                      title="Delete Artwork"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </div>
                                <div className="slide-info">
                                  <h5 className="slide-title">{savedDrawings[currentGalleryIndex].name}</h5>
                                  {savedDrawings[currentGalleryIndex].house && (
                                    <span className={`house-badge house-${savedDrawings[currentGalleryIndex].house.toLowerCase()}`}>
                                      {savedDrawings[currentGalleryIndex].house}
                                    </span>
                                  )}
                                  {savedDrawings[currentGalleryIndex].createdAt && (
                                    <small className="slide-date">
                                      {new Date(savedDrawings[currentGalleryIndex].createdAt).toLocaleDateString()}
                                    </small>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </div>
                          
                          <button 
                            className="nav-arrow next-btn"
                            onClick={goToNextGalleryItem}
                            disabled={savedDrawings.length <= 1}
                            title="Next Artwork"
                          >
                            ▶️
                          </button>
                        </div>
                        
                        {/* Gallery Dots Indicator */}
                        <div className="gallery-dots">
                          {savedDrawings.map((_, index) => (
                            <button
                              key={index}
                              className={`gallery-dot ${currentGalleryIndex === index ? 'active' : ''}`}
                              onClick={() => setCurrentGalleryIndex(index)}
                              title={`View ${savedDrawings[index].name}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="drawings-grid">
                      {savedDrawings.map((drawing) => (
                        <div key={drawing.id} className="drawing-card">
                          <div className="drawing-thumbnail">
                            <img 
                              src={drawing.dataURL} 
                              alt={drawing.name}
                              onClick={() => loadDrawing(drawing)}
                              title={`Load ${drawing.name}`}
                            />
                            <div className="drawing-overlay">
                              <button 
                                className="load-btn"
                                onClick={() => loadDrawing(drawing)}
                                title="Load Drawing"
                              >
                                📂 Load
                              </button>
                              <button 
                                className="delete-btn"
                                onClick={() => deleteDrawing(drawing.id)}
                                title="Delete Drawing"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                          <div className="drawing-info">
                            <span className="drawing-name" title={drawing.name}>
                              {drawing.name.length > 12 ? drawing.name.substring(0, 12) + '...' : drawing.name}
                            </span>
                            {drawing.house && (
                              <span className={`house-badge house-${drawing.house.toLowerCase()}`}>
                                {drawing.house}
                              </span>
                            )}
                            {drawing.createdAt && (
                              <small className="creation-date">
                                {new Date(drawing.createdAt).toLocaleDateString()}
                              </small>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            
            {savedDrawings.length > 0 && (
              <div className="gallery-actions">
                <button 
                  className="gallery-action-btn clear-all"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete all artwork? This cannot be undone.')) {
                      clearAllDrawings();
                    }
                  }}
                  title="Clear All Artwork"
                >
                  🗑️ Clear All
                </button>
                <button 
                  className="gallery-action-btn export-all"
                  onClick={exportAllDrawings}
                  title="Export All as ZIP"
                >
                  📦 Export
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Floating Gallery Button for Maximized Mode */}
        {isMaximized && savedDrawings.length > 0 && (
          <motion.div 
            className="floating-gallery-btn"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            title={`${savedDrawings.length} saved artwork${savedDrawings.length !== 1 ? 's' : ''}`}
            onClick={() => setShowFloatingGallery(!showFloatingGallery)}
          >
            <span className="gallery-icon">🖼️</span>
            <span className="gallery-count">{savedDrawings.length}</span>
          </motion.div>
        )}

        {/* Floating Gallery Overlay */}
        {isMaximized && showFloatingGallery && (
          <motion.div 
            className="floating-gallery-overlay"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="floating-gallery-content magical-card">
              <div className="floating-gallery-header">
                <h4>🖼️ Quick Gallery</h4>
                <button 
                  className="close-floating-gallery"
                  onClick={() => setShowFloatingGallery(false)}
                >
                  ✕
                </button>
              </div>
              <div className="floating-drawings-grid">
                {savedDrawings.slice(0, 6).map((drawing) => (
                  <div key={drawing.id} className="floating-drawing-item">
                    <img 
                      src={drawing.dataURL} 
                      alt={drawing.name}
                      onClick={() => {
                        loadDrawing(drawing);
                        setShowFloatingGallery(false);
                      }}
                      title={`Load ${drawing.name}`}
                    />
                    <span className="floating-drawing-name">{drawing.name}</span>
                  </div>
                ))}
              </div>
              {savedDrawings.length > 6 && (
                <div className="more-drawings">
                  <small>+{savedDrawings.length - 6} more drawings</small>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DrawingCanvas; 