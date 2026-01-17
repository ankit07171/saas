import { Type, Sparkles } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AddTextOverlay = () => {
  const [input, setInput] = useState(null);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(30);
  const [fontFamily, setFontFamily] = useState("Montserrat");
  const [color, setColor] = useState("#ffffff");
  const [gravity, setGravity] = useState("center");
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input || !text) return toast.error("Image and text are required");
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", input);
      formData.append("text", text);
      formData.append("fontSize", fontSize);
      formData.append("fontFamily", fontFamily);
      formData.append("color", color);
      formData.append("gravity", gravity);
      formData.append("x", x);
      formData.append("y", y);

      const { data } = await axios.post("/api/ai/text-overlay", formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-pink-500" />
          <h1 className="text-xl font-semibold text-pink-600">Add Text Overlay</h1>
        </div>

        {/* Image Upload */}
        <p className="mt-6 text-sm font-medium">Upload Image</p>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept="image/*"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          required
        />

        {/* Text Input */}
        <p className="mt-6 text-sm font-medium">Text to Add</p>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          required
        />

        {/* Font Size */}
        <p className="mt-4 text-sm font-medium">Font Size</p>
        <input
          type="number"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          min={10}
          max={100}
        />

        {/* Font Family */}
        <p className="mt-4 text-sm font-medium">Font Family</p>
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
        >
          <option value="Arial">Arial</option>
          <option value="Montserrat">Montserrat</option>
          <option value="Roboto">Roboto</option>
          <option value="Times">Times</option>
          <option value="Courier">Courier</option>
        </select>

        {/* Color */}
        <p className="mt-4 text-sm font-medium">Text Color</p>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-16 h-10 mt-2 p-0 border-none"
        />

        {/* Gravity / Position */}
        <p className="mt-4 text-sm font-medium">Position (Gravity)</p>
        <select
          value={gravity}
          onChange={(e) => setGravity(e.target.value)}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
        >
          <option value="north">Top</option>
          <option value="south">Bottom</option>
          <option value="east">Right</option>
          <option value="west">Left</option>
          <option value="center">Center</option>
          <option value="north_west">Top-Left</option>
          <option value="north_east">Top-Right</option>
          <option value="south_west">Bottom-Left</option>
          <option value="south_east">Bottom-Right</option>
        </select>

        {/* X/Y Offsets */}
        <div className="flex gap-4 mt-4">
          <div className="flex-1">
            <p className="text-sm font-medium">X Offset</p>
            <input
              type="number"
              value={x}
              onChange={(e) => setX(Number(e.target.value))}
              className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Y Offset</p>
            <input
              type="number"
              value={y}
              onChange={(e) => setY(Number(e.target.value))}
              className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2
          bg-gradient-to-r from-pink-500 to-pink-700 text-white px-4 py-2 mt-6
          text-sm rounded-lg cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Type className="w-5" />
          )}
          Add Text
        </button>
      </form>

      {/* Result Display */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center gap-3">
          <Type className="w-5 h-5 text-pink-500" />
          <h1 className="text-x1 font-semibold text-pink-600">Processed Image</h1>
        </div>
        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Type className="w-9 h-9" />
              <p>Upload an image and click "Add Text" to get started</p>
            </div>
          </div>
        ) : (
          <img src={content} alt="image" className="mt-3 w-full h-full object-contain" />
        )}
      </div>
    </div>
  );
};

export default AddTextOverlay;
