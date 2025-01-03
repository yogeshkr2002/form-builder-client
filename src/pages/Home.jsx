import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaCheck,
  FaTimes,
  FaFolder,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import baseurl from "../utils/config";

const Home = () => {
  const navigate = useNavigate();
  const [typebots, setTypebots] = useState([]);
  const [folders, setFolders] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newTypebotName, setNewTypebotName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editName, setEditName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchFolders();
    fetchTypebots();
  }, []);

  const validateName = (name, type) => {
    if (type === "folder") {
      const folderExists = folders.some((folder) => folder.name === name);
      if (folderExists) {
        alert("A folder with this name already exists");
        return false;
      }
    } else {
      const typebotExists = typebots.some((typebot) => typebot.name === name);
      if (typebotExists) {
        alert("A form with this name already exists");
        return false;
      }
    }
    return true;
  };

  const fetchFolders = async () => {
    try {
      const response = await axios.get(`${baseurl}/api/folders`);
      setFolders(response.data);
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseurl}/api/folders`, {
        name: newFolderName,
      });
      setFolders([...folders, response.data]);
      setNewFolderName("");
      setShowCreateFolder(false);
    } catch (error) {
      if (error.response?.status === 400) {
        alert(error.response.data.message);
      } else {
        console.error("Error creating folder:", error);
      }
    }
  };

  const handleCreateTypebot = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseurl}/api/typebots`, {
        name: newTypebotName,
      });
      setTypebots([...typebots, response.data]);
      setNewTypebotName("");
      setShowCreateForm(false);
      showSuccessToast("Typebot created successfully!");
    } catch (error) {
      if (error.response?.status === 400) {
        showErrorToast(error.response.data.message);
      } else {
        console.error("Error creating typebot:", error);
        showErrorToast("Failed to create typebot");
      }
    }
  };

  const updateFolderName = async (id) => {
    if (!validateName(editName, "folder")) return;

    try {
      const response = await axios.put(`${baseurl}/api/folders/${id}`, {
        name: editName,
      });
      setFolders(
        folders.map((folder) =>
          folder._id === id ? { ...folder, name: editName } : folder
        )
      );
      setEditingFolderId(null);
      setEditName("");
    } catch (error) {
      console.error("Error updating folder name:", error);
    }
  };

  const deleteFolder = async (id) => {
    if (window.confirm("Are you sure you want to delete this folder?")) {
      try {
        await axios.delete(`${baseurl}/api/folders/${id}`);
        setFolders(folders.filter((folder) => folder._id !== id));
        if (selectedFolder === id) setSelectedFolder(null);
      } catch (error) {
        console.error("Error deleting folder:", error);
      }
    }
  };

  const fetchTypebots = async () => {
    try {
      const response = await axios.get(`${baseurl}/api/typebots`);
      setTypebots(response.data);
    } catch (error) {
      console.error("Error fetching typebots:", error);
    }
  };

  const startEditing = (typebot) => {
    setEditingId(typebot._id);
    setEditName(typebot.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
  };

  const updateTypebotName = async (id) => {
    try {
      const response = await axios.put(
        `${baseurl}/api/typebots/${id}`,
        {
          name: editName,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTypebots(
        typebots.map((typebot) =>
          typebot._id === id ? { ...typebot, name: editName } : typebot
        )
      );
      setEditingId(null);
    } catch (error) {
      console.error("Error updating typebot name:", error);
    }
  };

  const deleteTypebot = async (id) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      try {
        await axios.delete(`${baseurl}/api/typebots/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTypebots(typebots.filter((typebot) => typebot._id !== id));
      } catch (error) {
        console.error("Error deleting typebot:", error);
      }
    }
  };

  const openTypebot = (id) => {
    navigate(`/typebot/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      {/* Folder Header Section */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 overflow-x-auto">
              <button
                onClick={() => setShowCreateFolder(true)}
                className="min-w-[150px] h-[40px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center gap-2 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-500 transition-all"
              >
                <FaPlus size={14} />
                <span className="text-gray-600 dark:text-gray-300">
                  Create Folder
                </span>
              </button>

              {folders.map((folder) => (
                <div
                  key={folder._id}
                  className={`relative min-w-[250px] h-[50px] border-2 rounded-lg flex items-center px-4 gap-2 cursor-pointer transition-all ${
                    selectedFolder === folder._id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }`}
                  onClick={() => navigate(`/folder/${folder._id}`)}
                >
                  {editingFolderId === folder._id ? (
                    <div className="flex items-center gap-2 px-2 w-full">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full p-1 border rounded text-sm"
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateFolderName(folder._id);
                        }}
                        className="text-green-500 hover:text-green-700"
                      >
                        <FaCheck size={12} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingFolderId(null);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <FaFolder
                        className={
                          selectedFolder === folder._id
                            ? "text-blue-500"
                            : "text-gray-400"
                        }
                      />
                      <span>{folder.name}</span>
                      <div className="absolute top-1 right-1 flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingFolderId(folder._id);
                            setEditName(folder.name);
                          }}
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFolder(folder._id);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              My Forms
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Create Button Card */}
              <div
                onClick={() => setShowCreateForm(true)}
                className="w-[180px] h-[220px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <div className="text-gray-400 group-hover:text-blue-500">
                  <FaPlus size={24} />
                </div>
                <span className="text-gray-600 font-medium group-hover:text-blue-500">
                  Create Typebot
                </span>
              </div>

              {/* Existing Typebots */}
              {typebots.map((typebot) => (
                <div
                  key={typebot._id}
                  className="w-[180px] h-[220px] border-2 border-gray-200 rounded-lg relative group hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  {editingId === typebot._id ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full p-2 border rounded text-center mb-2"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateTypebotName(typebot._id)}
                          className="text-green-500 hover:text-green-700"
                        >
                          <FaCheck size={16} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <FaTimes size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
                        onClick={() => openTypebot(typebot._id)}
                      >
                        <span className="text-gray-600 font-medium group-hover:text-blue-500">
                          {typebot.name}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(typebot);
                          }}
                          className="text-gray-400 hover:text-blue-500"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTypebot(typebot._id);
                          }}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4">Create New Folder</h3>
            <form onSubmit={handleCreateFolder}>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                className="w-full p-2 border rounded mb-4"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateFolder(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Typebot Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4">Create New Form</h3>
            <form onSubmit={handleCreateTypebot}>
              <input
                type="text"
                value={newTypebotName}
                onChange={(e) => setNewTypebotName(e.target.value)}
                placeholder="Enter form name"
                className="w-full p-2 border rounded mb-4"
                required
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewTypebotName("");
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
