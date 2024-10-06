import React, { useState, useRef, useEffect } from "react";
import { Book, Download, Eraser, PenTool, Trash2 } from "lucide-react";
import Birb from "./images/Birds.png";
import Cat from "./images/cat.png";
import flower from "./images/flower.png";
import "./App.css";

function App() {
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);
  const [isErasing, setIsErasing] = useState(false);
  const [canvasImage, setCanvasImage] = useState(null);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const placeholderImages = [Birb, Cat, flower];

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 600;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    contextRef.current = context;
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
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
  };

  const setBackground = (src) => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");
    setCanvasImage(image);
  };

  useEffect(() => {
    contextRef.current.strokeStyle = isErasing ? "#FFFFFF" : color;
  }, [color, isErasing]);

  return (
    <div className="sketchbook">
      <h1>My Sketchbook</h1>
      <div className="sketchbook-container">
        <div className="toolbox">
          <div className="tool-item">
            <label>
              <PenTool size={20} />
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
              <PenTool size={20} />
              Size
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={lineWidth}
              onChange={(e) => setLineWidth(e.target.value)}
            />
          </div>
          <div className="tool-item">
            <button
              className={`eraser-btn ${isErasing ? "active" : ""}`}
              onClick={() => setIsErasing(!isErasing)}
            >
              <Eraser size={20} />
              {isErasing ? "Draw" : "Erase"}
            </button>
          </div>
          <div className="tool-item">
            <button className="btn" onClick={clearCanvas}>
              <Trash2 size={20} />
              Clear Canvas
            </button>
          </div>
          <div className="actions">
            {canvasImage ? (
              <a href={canvasImage} download="sketch.png" className="btn">
                <Download size={20} />
                Download
              </a>
            ) : (
              <button onClick={saveCanvas} className="btn">
                <Book size={20} />
                Save Page
              </button>
            )}
          </div>
        </div>

        <div className="canvas-container">
          <div className="page-effect">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseUp={finishDrawing}
              onMouseMove={draw}
            />
          </div>
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
