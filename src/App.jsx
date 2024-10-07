import React, { useState, useRef, useEffect } from "react";
import {
  Book,
  Download,
  Eraser,
  PenTool,
  Trash2,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import Birb from "./images/Birds.png";
import Cat from "./images/cat.png";
import Flower from "./images/flower.png";

import "./App.css";

function App() {
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);
  const [isErasing, setIsErasing] = useState(false);
  const [canvasImage, setCanvasImage] = useState(null);
  const [brushType, setBrushType] = useState("round");
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const placeholderImages = [Birb, Cat, Flower, Cat, Flower, Cat, Flower];

  const predefinedColors = [
    "#000000",
    "#FFFFFF",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#008000",
    "#FFC0CB",
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      const context = canvas.getContext("2d");
      context.lineCap = brushType;
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      contextRef.current = context;
      if (history.length > 0) {
        loadFromHistory(historyIndex);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [color, lineWidth, brushType, history, historyIndex]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
    saveToHistory();
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  const setBackground = (src) => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      saveToHistory();
    };
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");
    setCanvasImage(image);
  };

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(canvas.toDataURL());
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      loadFromHistory(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      loadFromHistory(historyIndex + 1);
    }
  };

  const loadFromHistory = (index) => {
    const image = new Image();
    image.src = history[index];
    image.onload = () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
  };

  useEffect(() => {
    contextRef.current.strokeStyle = isErasing ? "#FFFFFF" : color;
    contextRef.current.lineCap = brushType;
  }, [color, isErasing, brushType]);

  return (
    <div className="sketchbook">
      <h1>My Sketchbook</h1>
      <div className="sketchbook-container">
        <div className="toolbox">
          <div className="tool-item">
            <label>
              <PenTool size={16} />
              Color
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <div className="tool-item">
            <label>
              <PenTool size={16} />
              Size
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={lineWidth}
              onChange={(e) => setLineWidth(parseInt(e.target.value))}
            />
          </div>
          <div className="tool-item">
            <label>Brush Type</label>
            <select
              value={brushType}
              onChange={(e) => setBrushType(e.target.value)}
            >
              <option value="round">Round</option>
              <option value="square">Square</option>
              <option value="butt">Flat</option>
            </select>
          </div>
          <button
            className={`btn eraser-btn ${isErasing ? "active" : ""}`}
            onClick={() => setIsErasing(!isErasing)}
          >
            <Eraser size={16} />
            {isErasing ? "Draw" : "Erase"}
          </button>
          <button className="btn" onClick={clearCanvas}>
            <Trash2 size={16} />
            Clear Canvas
          </button>
          <div className="undo-redo-container">
            <button className="btn" onClick={undo} disabled={historyIndex <= 0}>
              <RotateCcw size={16} />
              Undo
            </button>
            <button
              className="btn"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
            >
              <RotateCw size={16} />
              Redo
            </button>
          </div>
          <button onClick={saveCanvas} className="btn">
            <Book size={16} />
            Save Page
          </button>
          <div className="color-palette">
            {predefinedColors.map((presetColor, index) => (
              <button
                key={index}
                className="color-btn"
                style={{ backgroundColor: presetColor }}
                onClick={() => setColor(presetColor)}
              />
            ))}
          </div>
        </div>

        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
          />
        </div>

        <div className="sidebar">
          <h2>Choose a Background</h2>
          <div className="image-selection">
            {placeholderImages.map((src, index) => (
              <div
                className="image-box"
                key={index}
                onClick={() => setBackground(src)}
              >
                <img src={src} alt={`Placeholder ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
