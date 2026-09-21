import  { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Profilepage.css";
import { useTheme } from "../context/ThemeContext";

export default function Profilepage({ onLogout }) {
  // Theme state: dark (default) or light
  const { theme,toggleTheme } = useTheme();

  // User auth state checking localStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("aafps_user_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Edit / Setup Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(!user);
  const [isEditing, setIsEditing] = useState(false);

  // Form input state
  const [formData, setFormData] = useState({
    name: user?.name || "",
    handle: user?.handle || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
    targetGoal: user?.targetGoal || "Dynamic Programming & Graphs",
  });

  // To-Do list state stored in localStorage
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("aafps_user_todos");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      { id: "td-1", text: "Solve Problem 21: Merge Two Sorted Lists", done: true },
      { id: "td-2", text: "Master Monotonic Stack with Daily Temperatures", done: false },
      { id: "td-3", text: "Review Dijkstra vs Bellman-Ford algorithms", done: false },
    ];
  });

  const [newTodoText, setNewTodoText] = useState("");

  // Persist theme changes
  useEffect(() => {
    localStorage.setItem("aafps_theme", theme);
  }, [theme]);

  // Persist user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("aafps_user_profile", JSON.stringify(user));
    }
  }, [user]);

  // Persist todo items
  useEffect(() => {
    localStorage.setItem("aafps_user_todos", JSON.stringify(todos));
  }, [todos]);

  // Toggle Day/Night theme
  
  // Image file handler converts to base64 Data URL
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Login / Registration / Profile Edit
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const updatedUser = {
      id: user?.id || `user_${Date.now()}`,
      name: formData.name.trim(),
      handle: formData.handle.trim().replace(/^@/, "") || formData.name.toLowerCase().replace(/\s+/g, "_"),
      bio: formData.bio.trim() || "Algorithm problem solver mastering concepts visually.",
      avatar: formData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(formData.name)}`,
      targetGoal: formData.targetGoal,
      joinedDate: user?.joinedDate || new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      streakDays: user?.streakDays || 1,
    };

    setUser(updatedUser);
    setIsAuthModalOpen(false);
    setIsEditing(false);
  };

  // Logout / clear session
  const handleLogout = () => {
    localStorage.removeItem("aafps_user_profile");
    setUser(null);
    setFormData({ name: "", handle: "", bio: "", avatar: "", targetGoal: "Dynamic Programming & Graphs" });
    setIsAuthModalOpen(true);
    if (onLogout) onLogout();
  };

  // Open Edit Mode
  const startEditProfile = () => {
    setFormData({
      name: user?.name || "",
      handle: user?.handle || "",
      bio: user?.bio || "",
      avatar: user?.avatar || "",
      targetGoal: user?.targetGoal || "Dynamic Programming & Graphs",
    });
    setIsEditing(true);
  };

  // To-Do list actions
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    const item = {
      id: `td_${Date.now()}`,
      text: newTodoText.trim(),
      done: false,
    };
    setTodos([item, ...todos]);
    setNewTodoText("");
  };

  const handleToggleTodo = (id) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <div id="aafps-prof-root" data-theme={theme}>
      {/* Top Floating Controls */}
      <div id="aafps-prof-nav-bar">
        <button id="aafps-prof-btn-theme" onClick={toggleTheme} title="Toggle Day / Night">
          {theme === "dark" ? "☀️ Day Mode" : "🌙 Night Mode"}
        </button>
        {user && (
          <button id="aafps-prof-btn-logout" onClick={handleLogout} title="Switch User / Logout">
            🚪 Logout
          </button>
        )}
      </div>

      {/* Main Profile View (Visible once user is logged in) */}
      {user && (
        <div id="aafps-prof-container">
          {/* Hero Banner Card */}
          <div id="aafps-prof-hero-card">
            <div id="aafps-prof-hero-banner" />
            <div id="aafps-prof-hero-body">
              <div id="aafps-prof-identity">
                <div id="aafps-prof-avatar-wrap">
                  {user.avatar ? (
                    <img id="aafps-prof-avatar-img" src={user.avatar} alt={user.name} />
                  ) : (
                    <div id="aafps-prof-avatar-placeholder">{user.name[0]?.toUpperCase() || "U"}</div>
                  )}
                  <span id="aafps-prof-online-badge" />
                </div>

                <div id="aafps-prof-titles">
                  <div id="aafps-prof-name-row">
                    <h1 id="aafps-prof-fullname">{user.name}</h1>
                    <span id="aafps-prof-goal-tag">{user.targetGoal}</span>
                  </div>
                  <div id="aafps-prof-handle-row">
                    <span id="aafps-prof-handle">@{user.handle}</span>
                    <span>•</span>
                    <span>Active Since {user.joinedDate}</span>
                  </div>
                  <p id="aafps-prof-bio">{user.bio}</p>
                </div>
              </div>

              <button id="aafps-prof-btn-edit" onClick={startEditProfile}>
                ✏️ Edit Profile
              </button>
            </div>
          </div>

          {/* User Key Metrics Row */}
          <div id="aafps-prof-kpi-grid">
            <div id="aafps-prof-kpi-card-streak">
              <div id="aafps-prof-kpi-icon-streak">🔥</div>
              <div id="aafps-prof-kpi-content-streak">
                <span id="aafps-prof-kpi-title-streak">Daily Streak</span>
                <span id="aafps-prof-kpi-value-streak">{user.streakDays || 1} Days Active</span>
              </div>
            </div>

            <div id="aafps-prof-kpi-card-tasks">
              <div id="aafps-prof-kpi-icon-tasks">📋</div>
              <div id="aafps-prof-kpi-content-tasks">
                <span id="aafps-prof-kpi-title-tasks">Completed Tasks</span>
                <span id="aafps-prof-kpi-value-tasks">
                  {todos.filter((t) => t.done).length} / {todos.length}
                </span>
              </div>
            </div>

            <div id="aafps-prof-kpi-card-target">
              <div id="aafps-prof-kpi-icon-target">🎯</div>
              <div id="aafps-prof-kpi-content-target">
                <span id="aafps-prof-kpi-title-target">Learning Focus</span>
                <span id="aafps-prof-kpi-value-target">{user.targetGoal}</span>
              </div>
            </div>
          </div>

          {/* User Personal To-Do List Workspace */}
          <div id="aafps-prof-todo-card">
            <div id="aafps-prof-todo-header">
              <div>
                <h2 id="aafps-prof-todo-title">Personal Problem-Solving To-Do List</h2>
                <span id="aafps-prof-todo-sub">Track algorithms and tasks saved exclusively to your device</span>
              </div>
              <span id="aafps-prof-todo-count-badge">
                {todos.filter((t) => !t.done).length} Pending
              </span>
            </div>

            {/* Todo Input Form */}
            <form id="aafps-prof-todo-input-bar" onSubmit={handleAddTodo}>
              <input
                id="aafps-prof-todo-text-input"
                type="text"
                placeholder="Add a problem or revision goal (e.g. Master Binary Search on LeetCode 875)..."
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
              />
              <button id="aafps-prof-todo-add-btn" type="submit">
                + Add Task
              </button>
            </form>

            {/* Todo Item List */}
            <div id="aafps-prof-todo-list">
              <AnimatePresence mode="popLayout">
                {todos.length === 0 ? (
                  <div id="aafps-prof-todo-empty">No tasks added yet. Add your first problem to solve!</div>
                ) : (
                  todos.map((todo) => (
                    <motion.div
                      key={todo.id}
                      id={`aafps-prof-todo-item-${todo.id}`}
                      data-is-done={todo.done ? "true" : "false"}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label id={`aafps-prof-todo-label-${todo.id}`}>
                        <input
                          id={`aafps-prof-todo-checkbox-${todo.id}`}
                          type="checkbox"
                          checked={todo.done}
                          onChange={() => handleToggleTodo(todo.id)}
                        />
                        <span id={`aafps-prof-todo-text-${todo.id}`}>{todo.text}</span>
                      </label>

                      <button
                        id={`aafps-prof-todo-del-${todo.id}`}
                        onClick={() => handleDeleteTodo(todo.id)}
                        title="Delete task"
                      >
                        ✕
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {/* Authentication & Profile Edit Modal */}
      <AnimatePresence>
        {(isAuthModalOpen || isEditing) && (
          <motion.div
            id="aafps-prof-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              id="aafps-prof-modal-card"
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
            >
              <h2 id="aafps-prof-modal-title">
                {user ? "Edit Your Profile" : "Login / Create Local Account"}
              </h2>
              <p id="aafps-prof-modal-sub">
                {user
                  ? "Update your avatar, handle, or problem focus"
                  : "All credentials and problem-solving todos are stored securely in your browser's localStorage."}
              </p>

              <form id="aafps-prof-form" onSubmit={handleSaveProfile}>
                {/* Image Edit & Preview */}
                <div id="aafps-prof-avatar-edit-box">
                  <div id="aafps-prof-preview-img-wrap">
                    {formData.avatar ? (
                      <img id="aafps-prof-avatar-preview" src={formData.avatar} alt="Preview" />
                    ) : (
                      <div id="aafps-prof-avatar-preview-fallback">👤</div>
                    )}
                  </div>
                  <div id="aafps-prof-avatar-inputs">
                    <label id="aafps-prof-upload-btn-label">
                      📁 Upload Image File
                      <input
                        id="aafps-prof-file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                    <input
                      id="aafps-prof-avatar-url-input"
                      type="url"
                      placeholder="Or enter Avatar Image URL..."
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    />
                  </div>
                </div>

                <div id="aafps-prof-form-group-name">
                  <label id="aafps-prof-form-label-name">Full Name *</label>
                  <input
                    id="aafps-prof-form-input-name"
                    type="text"
                    required
                    placeholder="e.g. Alex Thorne"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div id="aafps-prof-form-group-handle">
                  <label id="aafps-prof-form-label-handle">Username / Handle</label>
                  <input
                    id="aafps-prof-form-input-handle"
                    type="text"
                    placeholder="e.g. alex_coder"
                    value={formData.handle}
                    onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                  />
                </div>

                <div id="aafps-prof-form-group-bio">
                  <label id="aafps-prof-form-label-bio">Bio</label>
                  <input
                    id="aafps-prof-form-input-bio"
                    type="text"
                    placeholder="e.g. Practicing Two Pointers & Graph algorithms"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>

                <div id="aafps-prof-form-group-target">
                  <label id="aafps-prof-form-label-target">Target Topic Focus</label>
                  <select
                    id="aafps-prof-form-select-target"
                    value={formData.targetGoal}
                    onChange={(e) => setFormData({ ...formData, targetGoal: e.target.value })}
                  >
                    <option value="Dynamic Programming & Graphs">Dynamic Programming & Graphs</option>
                    <option value="Monotonic Stack & Heaps">Monotonic Stack & Heaps</option>
                    <option value="Binary Search & Matrix">Binary Search & Matrix</option>
                    <option value="Two Pointers & Linked Lists">Two Pointers & Linked Lists</option>
                  </select>
                </div>

                <div id="aafps-prof-modal-actions">
                  {user && (
                    <button
                      id="aafps-prof-btn-cancel"
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setIsAuthModalOpen(false);
                      }}
                    >
                      Cancel
                    </button>
                  )}
                  <button id="aafps-prof-btn-submit" type="submit">
                    {user ? "Save Changes" : "Create & Enter"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}