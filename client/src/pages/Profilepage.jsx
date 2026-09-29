import React, { useState, useEffect } from "react";

export default function UserProfile({ initialUser = null, onSave }) {
  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    avatarType: "preset", // 'preset' | 'url' | 'file'
    presetAvatar: "avatar-1",
    avatarUrlInput: "",
    customAvatar: "",
  });

  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  // Load initial data
  useEffect(() => {
    if (initialUser) {
      setFormData({
        name: initialUser.name || "",
        email: initialUser.email || "",
        bio: initialUser.bio || "",
        avatarType: initialUser.avatarType || "preset",
        presetAvatar: initialUser.presetAvatar || "avatar-1",
        avatarUrlInput: initialUser.customAvatar || "",
        customAvatar: initialUser.customAvatar || "",
      });
      setTodos(initialUser.todos || []);
    }
  }, [initialUser]);

  // Clean up object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (formData.customAvatar && formData.customAvatar.startsWith("blob:")) {
        URL.revokeObjectURL(formData.customAvatar);
      }
    };
  }, [formData.customAvatar]);

  // --- FORM HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarTypeChange = (type) => {
    setFormData((prev) => ({ ...prev, avatarType: type }));
  };

  const handlePresetSelect = (presetId) => {
    setFormData((prev) => ({
      ...prev,
      avatarType: "preset",
      presetAvatar: presetId,
    }));
  };

  const handleUrlInputChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      avatarUrlInput: value,
      customAvatar: value,
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);

      // Clean up previous blob URL if exists
      if (formData.customAvatar && formData.customAvatar.startsWith("blob:")) {
        URL.revokeObjectURL(formData.customAvatar);
      }

      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        avatarType: "file",
        customAvatar: previewUrl,
        avatarUrlInput: "",
      }));
    }
  };

  // --- TODO HANDLERS ---
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    const newTodo = {
      id: Date.now().toString(),
      text: newTodoText.trim(),
      completed: false,
    };

    setTodos((prev) => [...prev, newTodo]);
    setNewTodoText("");
  };

  const handleToggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // FIXED: Filters out the target item instead of keeping ONLY the target item
  const handleDeleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // --- SUBMIT HANDLER ---
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      todos,
      avatarFile: formData.avatarType === "file" ? avatarFile : null,
    };

    if (onSave) {
      onSave(payload);
    }
  };

  // Helper to determine active avatar src
  const getAvatarSrc = () => {
    if (formData.avatarType === "preset") {
      return `/avatars/${formData.presetAvatar}.png`;
    }
    return formData.customAvatar || "/avatars/default.png";
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6">User Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Display & Picker */}
        <div className="flex flex-col items-center gap-4">
          <img
            src={getAvatarSrc()}
            alt="User Avatar"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />

          <div className="flex gap-2">
            <button
              type="button"
              className={`px-3 py-1 text-sm rounded ${
                formData.avatarType === "preset"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => handleAvatarTypeChange("preset")}
            >
              Preset
            </button>
            <button
              type="button"
              className={`px-3 py-1 text-sm rounded ${
                formData.avatarType === "url"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => handleAvatarTypeChange("url")}
            >
              Image URL
            </button>
            <button
              type="button"
              className={`px-3 py-1 text-sm rounded ${
                formData.avatarType === "file"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => handleAvatarTypeChange("file")}
            >
              Upload File
            </button>
          </div>

          {/* Avatar Options */}
          {formData.avatarType === "preset" && (
            <div className="flex gap-2 mt-2">
              {["avatar-1", "avatar-2", "avatar-3"].map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handlePresetSelect(id)}
                  className={`p-1 border rounded ${
                    formData.presetAvatar === id ? "border-blue-500" : ""
                  }`}
                >
                  <img
                    src={`/avatars/${id}.png`}
                    alt={id}
                    className="w-10 h-10 rounded-full"
                  />
                </button>
              ))}
            </div>
          )}

          {formData.avatarType === "url" && (
            <input
              type="url"
              placeholder="Enter image URL..."
              value={formData.avatarUrlInput}
              onChange={handleUrlInputChange}
              className="w-full p-2 border rounded"
            />
          )}

          {formData.avatarType === "file" && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full p-2 border rounded"
            />
          )}
        </div>

        {/* User Info Fields */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={3}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Todo List Section */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">Tasks / Todos</h3>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Add new task..."
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              type="button"
              onClick={handleAddTodo}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add
            </button>
          </div>

          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between p-2 border rounded bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id)}
                  />
                  <span
                    className={
                      todo.completed ? "line-through text-gray-400" : ""
                    }
                  >
                    {todo.text}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-semibold"
                >
                  Delete
                </button>
              </li>
            ))}
            {todos.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-2">
                No tasks added yet.
              </p>
            )}
          </ul>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}