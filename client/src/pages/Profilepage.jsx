import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Profilepage.css";
import { useTheme } from "../context/ThemeContext";
import { logoutuser, updateUserProfile } from "../utility/FetchHelper";
import useUserdetail, { notifyAuthChange } from "../components/Userdetail";

export default function Profilepage() {
  const { theme, toggleTheme } = useTheme();
  const { userdata, refetchUser } = useUserdetail();

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

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Raw file object for Multer upload
  const [avatarFile, setAvatarFile] = useState(null);

  const displayName = userdata?.name || user?.name || "Anonymous User";
  const userEmail = userdata?.email || user?.email || "";

  // Helper: auto-generate DiceBear Bottts avatar from handle seed
  const getAvatarForHandle = (handleStr) => {
    const seed = (handleStr || displayName).toLowerCase().replace(/\s+/g, "_");
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed)}`;
  };

  const currentHandle =
    userdata?.handle || user?.handle || displayName.toLowerCase().replace(/\s+/g, "_");

  const savedCustomAvatar = userdata?.customAvatar || user?.customAvatar || "";

  // Form input state
  const [formData, setFormData] = useState({
    name: displayName,
    email: userEmail,
    handle: currentHandle,
    customAvatar: savedCustomAvatar,
    avatarUrlInput: savedCustomAvatar.startsWith("http") ? savedCustomAvatar : "",
    bio: userdata?.bio || user?.bio || "",
    targetGoal: userdata?.targetGoal || user?.targetGoal || "Dynamic Programming & Graphs",
  });

  // Keep state synced when server data loads/updates
  useEffect(() => {
    if (userdata) {
      setUser(userdata);
      localStorage.setItem("aafps_user_profile", JSON.stringify(userdata));

      setFormData((prev) => ({
        ...prev,
        name: userdata.name || prev.name,
        email: userdata.email || prev.email,
        handle: userdata.handle || prev.handle,
        customAvatar:
          userdata.customAvatar !== undefined ? userdata.customAvatar : prev.customAvatar,
        avatarUrlInput: userdata.customAvatar?.startsWith("http")
          ? userdata.customAvatar
          : prev.avatarUrlInput,
        bio: userdata.bio || prev.bio,
        targetGoal: userdata.targetGoal || prev.targetGoal,
      }));
    }
  }, [userdata]);

  // Todo list
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

  useEffect(() => {
    localStorage.setItem("aafps_user_todos", JSON.stringify(todos));
  }, [todos]);

  // Handle local device image selection
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file); // Raw file for Multer
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        customAvatar: previewUrl,
        avatarUrlInput: "",
      }));
    }
  };

  // Handle URL link input
  const handleUrlChange = (e) => {
    const urlVal = e.target.value;
    setAvatarFile(null);
    setFormData((prev) => ({
      ...prev,
      avatarUrlInput: urlVal,
      customAvatar: urlVal.trim() !== "" ? urlVal.trim() : "",
    }));
  };

  // Reset to auto-generated Bot
  const handleResetToHandleAvatar = () => {
    setAvatarFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFormData((prev) => ({
      ...prev,
      customAvatar: "",
      avatarUrlInput: "",
    }));
  };

  // Save profile with Multer-ready FormData
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const resolvedName = formData.name.trim() || displayName;
    const resolvedHandle =
      formData.handle.trim().replace(/^@/, "") ||
      resolvedName.toLowerCase().replace(/\s+/g, "_");

    const formPayload = new FormData();
    formPayload.append("email", userEmail);
    formPayload.append("name", resolvedName);
    formPayload.append("handle", resolvedHandle);
    formPayload.append(
      "bio",
      formData.bio.trim() || "Algorithm problem solver mastering concepts visually."
    );
    formPayload.append("targetGoal", formData.targetGoal);

    // If an image file was selected, send it under field "avatarFile"
    if (avatarFile) {
      formPayload.append("avatarFile", avatarFile);
    } else {
      // Send string URL or empty string (to clear or rely on handle bot)
      formPayload.append(
        "customAvatar",
        formData.avatarUrlInput.trim() ||
          (formData.customAvatar.startsWith("blob:") ? "" : formData.customAvatar.trim())
      );
    }

    try {
      const res = await updateUserProfile(formPayload);
      const updatedData = res.user || res;

      // Update both React state and localStorage with MongoDB data
      setUser(updatedData);
      localStorage.setItem("aafps_user_profile", JSON.stringify(updatedData));
      localStorage.setItem("userdetail", JSON.stringify(updatedData));

      if (typeof refetchUser === "function") {
        await refetchUser();
      }
      notifyAuthChange();

      setAvatarFile(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Profile save error:", error);
      alert(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    const email = userdata?.email;
    localStorage.removeItem("userdetail");
    localStorage.removeItem("aafps_user_profile");
    notifyAuthChange();

    try {
      await logoutuser({ email });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      if (typeof refetchUser === "function") {
        refetchUser();
      }
    }
  };

  const startEditProfile = () => {
    const currentCustom = userdata?.customAvatar || user?.customAvatar || "";
    setAvatarFile(null);
    setFormData({
      name: displayName,
      email: userEmail,
      handle: currentHandle,
      customAvatar: currentCustom,
      avatarUrlInput: currentCustom.startsWith("http") ? currentCustom : "",
      bio: userdata?.bio || user?.bio || "Algorithm problem solver mastering concepts visually.",
      targetGoal: userdata?.targetGoal || user?.targetGoal || "Dynamic Programming & Graphs",
    });
    setIsEditing(true);
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    setTodos([{ id: `td_${Date.now()}`, text: newTodoText.trim(), done: false }, ...todos]);
    setNewTodoText("");
  };

  const handleToggleTodo = (id) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const activeAvatar =
    userdata?.customAvatar || user?.customAvatar || getAvatarForHandle(currentHandle);

  const previewAvatar =
    formData.customAvatar || getAvatarForHandle(formData.handle);

  return (
    <div id="aafps-prof-root" data-theme={theme}>
      {/* Top Floating Controls */}
      <div id="aafps-prof-nav-bar">
        <button id="aafps-prof-btn-theme" onClick={toggleTheme} title="Toggle Day / Night">
          {theme === "dark" ? "☀️ Day Mode" : "🌙 Night Mode"}
        </button>
        <button id="aafps-prof-btn-logout" onClick={handleLogout} title="Logout">
          🚪 Logout
        </button>
      </div>

      {/* Main Profile View */}
      <div id="aafps-prof-container">
        {/* Hero Banner Card */}
        <div id="aafps-prof-hero-card">
          <div id="aafps-prof-hero-banner" />
          <div id="aafps-prof-hero-body">
            <div id="aafps-prof-identity">
              {/* Click avatar directly to open Edit dialog */}
              <div
                id="aafps-prof-avatar-wrap"
                onClick={startEditProfile}
                title="Click to change avatar"
                style={{ cursor: "pointer" }}
              >
                <img
                  id="aafps-prof-avatar-img"
                  src={activeAvatar}
                  alt={displayName}
                  onError={(e) => {
                    e.target.src = getAvatarForHandle(currentHandle);
                  }}
                />
                <span id="aafps-prof-online-badge" />
              </div>

              <div id="aafps-prof-titles">
                <div id="aafps-prof-name-row">
                  <h1 id="aafps-prof-fullname">{displayName}</h1>
                  <span id="aafps-prof-goal-tag">
                    {userdata?.targetGoal || user?.targetGoal || "Dynamic Programming & Graphs"}
                  </span>
                </div>

                <div id="aafps-prof-handle-row">
                  <span id="aafps-prof-handle">@{currentHandle}</span>
                  {userEmail && (
                    <>
                      <span>•</span>
                      <span id="aafps-prof-email">📧 {userEmail}</span>
                    </>
                  )}
                  <span>•</span>
                  <span>Active Since {user?.joinedDate || "Sep 2026"}</span>
                </div>

                <p id="aafps-prof-bio">
                  {userdata?.bio || user?.bio || "Algorithm problem solver mastering concepts visually."}
                </p>
              </div>
            </div>

            <button id="aafps-prof-btn-edit" onClick={startEditProfile}>
              ✏️ Edit Profile
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        <div id="aafps-prof-kpi-grid">
          <div id="aafps-prof-kpi-card-streak">
            <div id="aafps-prof-kpi-icon-streak">🔥</div>
            <div id="aafps-prof-kpi-content-streak">
              <span id="aafps-prof-kpi-title-streak">Daily Streak</span>
              <span id="aafps-prof-kpi-value-streak">
                {user?.streakDays || 1} Days Active
              </span>
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
              <span id="aafps-prof-kpi-value-target">
                {userdata?.targetGoal || user?.targetGoal || "Dynamic Programming & Graphs"}
              </span>
            </div>
          </div>
        </div>

        {/* To-Do List Workspace */}
        <div id="aafps-prof-todo-card">
          <div id="aafps-prof-todo-header">
            <div>
              <h2 id="aafps-prof-todo-title">Personal Problem-Solving To-Do List</h2>
              <span id="aafps-prof-todo-sub">
                Track algorithms and tasks saved exclusively to your device
              </span>
            </div>
            <span id="aafps-prof-todo-count-badge">
              {todos.filter((t) => !t.done).length} Pending
            </span>
          </div>

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

          <div id="aafps-prof-todo-list">
            <AnimatePresence mode="popLayout">
              {todos.length === 0 ? (
                <div id="aafps-prof-todo-empty">
                  No tasks added yet. Add your first problem to solve!
                </div>
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

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
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
              <h2 id="aafps-prof-modal-title">Edit Your Profile</h2>
              <p id="aafps-prof-modal-sub">
                Click your photo to pick a new file, paste an image link, or use the handle bot.
              </p>

              <form id="aafps-prof-form" onSubmit={handleSaveProfile}>
                {/* Avatar Preview & Direct Click Upload */}
                <div id="aafps-prof-avatar-edit-box">
                  <div
                    id="aafps-prof-preview-img-wrap"
                    onClick={() => fileInputRef.current?.click()}
                    title="Click to choose a photo"
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      id="aafps-prof-avatar-preview"
                      src={previewAvatar}
                      alt="Preview"
                      onError={(e) => {
                        e.target.src = getAvatarForHandle(formData.handle);
                      }}
                    />
                  </div>

                  <div id="aafps-prof-avatar-inputs">
                    <div id="aafps-prof-avatar-btn-row">
                      <label id="aafps-prof-upload-btn-label">
                        📁 Choose Image
                        <input
                          ref={fileInputRef}
                          id="aafps-prof-file-input"
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                        />
                      </label>

                      {(formData.customAvatar || formData.avatarUrlInput) && (
                        <button
                          type="button"
                          id="aafps-prof-btn-reset-avatar"
                          onClick={handleResetToHandleAvatar}
                        >
                          🔄 Use Handle Bot
                        </button>
                      )}
                    </div>

                    <input
                      id="aafps-prof-avatar-url-input"
                      type="url"
                      placeholder="Or paste image URL (https://...)"
                      value={formData.avatarUrlInput}
                      onChange={handleUrlChange}
                    />
                  </div>
                </div>

                {/* Name */}
                <div id="aafps-prof-form-group-name">
                  <label id="aafps-prof-form-label-name">Full Name</label>
                  <input
                    id="aafps-prof-form-input-name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Unchangeable Email */}
                <div id="aafps-prof-form-group-email">
                  <label id="aafps-prof-form-label-email">
                    Email Address <span style={{ opacity: 0.6 }}>(Read-Only)</span>
                  </label>
                  <input
                    id="aafps-prof-form-input-email"
                    type="email"
                    disabled
                    readOnly
                    value={userEmail}
                    title="Email cannot be changed"
                  />
                </div>

                {/* Handle */}
                <div id="aafps-prof-form-group-handle">
                  <label id="aafps-prof-form-label-handle">
                    Username / Handle {!formData.customAvatar && "(Updates Bot Avatar)"}
                  </label>
                  <input
                    id="aafps-prof-form-input-handle"
                    type="text"
                    placeholder="e.g. alex_coder"
                    value={formData.handle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        handle: e.target.value.replace(/^@/, ""),
                      })
                    }
                  />
                </div>

                {/* Bio */}
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

                {/* Focus */}
                <div id="aafps-prof-form-group-target">
                  <label id="aafps-prof-form-label-target">Target Topic Focus</label>
                  <select
                    id="aafps-prof-select-target"
                    value={formData.targetGoal}
                    onChange={(e) => setFormData({ ...formData, targetGoal: e.target.value })}
                  >
                    <option value="Dynamic Programming & Graphs">Dynamic Programming & Graphs</option>
                    <option value="Monotonic Stack & Heaps">Monotonic Stack & Heaps</option>
                    <option value="Binary Search & Matrix">Binary Search & Matrix</option>
                    <option value="Two Pointers & Linked Lists">Two Pointers & Linked Lists</option>
                  </select>
                </div>

                {/* Modal Buttons */}
                <div id="aafps-prof-modal-actions">
                  <button
                    id="aafps-prof-btn-cancel"
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button id="aafps-prof-btn-submit" type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
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