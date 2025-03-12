import React, { useState, useCallback, useRef } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [transform, setTransform] = useState({ rotate: 0, scaleX: 1, opacity: 100 });
  const [selectedTool, setSelectedTool] = useState(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const history = useRef([]);
  const historyIndex = useRef(-1);

  // Handle file upload
  const handleImageUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = reader.result;
        setImage(newImage);
        setPreviewImage(newImage);
        addToHistory({ rotate: 0, scaleX: 1, opacity: 100 });
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleImageUpload(file);
  }, []);

  // Add current state to history
  const addToHistory = (newTransform) => {
    history.current = history.current.slice(0, historyIndex.current + 1);
    history.current.push(newTransform);
    historyIndex.current = history.current.length - 1;
  };

  // Handle transformations
  const applyTransformation = (newTransform) => {
    setIsTransforming(true);
    setTransform(newTransform);
    addToHistory(newTransform);
    setTimeout(() => setIsTransforming(false), 300);
  };

  const rotateLeft = () => {
    const newTransform = { ...transform, rotate: transform.rotate - 90 };
    applyTransformation(newTransform);
    setSelectedTool("rotate-left");
  };


  const rotateRight = () => {
    const newTransform = { ...transform, rotate: transform.rotate + 90 };
    applyTransformation(newTransform);
    setSelectedTool("rotate-right");
  };



  const flipImage = () => {
    const newTransform = { ...transform, scaleX: transform.scaleX === 1 ? -1 : 1 };
    applyTransformation(newTransform);
    setSelectedTool("flip");
  };

  const resetImage = () => {
    const newTransform = { rotate: 0, scaleX: 1, opacity: 100 };
    applyTransformation(newTransform);
    setSelectedTool("reset");
  };



  const handleOpacityChange = (e) => {
    const newTransform = { ...transform, opacity: e.target.value };
    setTransform(newTransform);
    addToHistory(newTransform);
  };

  // Download image
  const downloadImage = () => {
    if (previewImage) {
      const link = document.createElement("a");
      link.href = previewImage;
      link.download = "transformed-image.png";
      link.click();
    }
  };



  // Toggle between Up and Down
  const [isDown, setIsDown] = useState(true);
  const rotateDown = () => {
    const newTransform = { ...transform, rotate: transform.rotate + 180 };
    applyTransformation(newTransform);
    setIsDown((prev) => !prev);
    setSelectedTool("rotate-down");
  };




  return (
    <div className="flex flex-col md:flex-row h-screen p-4 bg-gray-100 overflow-hidden text-black">
      {/* Right Section */}
      <div className="w-full md:w-1/4 flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg overflow-y-auto">
        {/* Original Image Preview */}
        `{image ? (
          <div className="flex flex-col items-center">
            <img
              src={image}
              alt="Original"
              className="max-w-full max-h-48 object-contain"
            />
            <p className="text-sm text-gray-600 mt-2">Original Image</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 flex items-center justify-center bg-gray-200 text-gray-500">
              No Image Available
            </div>
            <p className="text-sm text-gray-600 mt-2">Placeholder Image</p>
          </div>
        )}`

        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 justify-center text-center">
          {[
            { id: "rotate-left", label: "Left", title: "Rotate Left", onClick: rotateLeft, disabled: isTransforming },
            { id: "rotate-right", label: "Right", title: "Rotate Right", onClick: rotateRight, disabled: isTransforming },
            { id: "rotate-down", label: isDown ? "Down" : "Up", title: isDown ? "Rotate Up" : "Rotate Down", onClick: rotateDown, disabled: isTransforming },
            { id: "flip", label: "Flip", title: "Flip", onClick: flipImage, disabled: isTransforming },
            { id: "reset", label: "Reset", title: "Reset", onClick: resetImage, disabled: isTransforming },
          ].map((tool) => (
            <button
              key={tool.id}
              className={`p-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors ${selectedTool === tool.id ? "ring-2 ring-blue-500" : ""
                }`}
              title={tool.title}
              onClick={tool.onClick}
              disabled={tool.disabled}
            >
              {tool.label}
            </button>
          ))}
        </div>

        {/* Opacity Slider */}
        <div className="flex-1">
          <label htmlFor="opacity" className="block text-sm font-medium text-gray-700">
            Opacity:
            <span
              className="px-2 ml-1 rounded border border-black" // Black border

            >
              {transform.opacity}%
            </span>
          </label>
          <input
            type="range"
            id="opacity"
            name="opacity"
            min="0"
            max="100"
            value={transform.opacity}
            className="w-full"
            onChange={handleOpacityChange}
          />
        </div>

        {/* Download Button */}
        <button
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={downloadImage}
        >
          Download
        </button>
      </div>
      {/* Left Section */}
      <div
        className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg my-2 sm:mx-2 bg-white transition-all duration-300 overflow-hidden"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {!image ? (
          <div className="text-center p-4">
            <p>Drag & Drop an image here or click to upload</p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="cursor-pointer text-blue-500 underline"
            >
              Click to upload
            </label>
          </div>
        ) : (
          <div className="max-w-full max-h-full p-4">
            <img
              src={image}
              alt="Preview"
              className="max-w-full max-h-full object-contain transition-transform duration-300 ease-in-out"
              style={{
                transform: `rotate(${transform.rotate}deg) scaleX(${transform.scaleX})`,
                opacity: `${transform.opacity}%`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}