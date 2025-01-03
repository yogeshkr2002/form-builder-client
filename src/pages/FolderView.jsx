import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../components/CustomToast";
import baseurl from "../utils/config";

const FolderView = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const [folder, setFolder] = useState(null);
  const [typebots, setTypebots] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTypebotName, setNewTypebotName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchFolder();
    fetchTypebots();
  }, [folderId]);

  const fetchFolder = async () => {
    try {
      const response = await axios.get(`${baseurl}/api/folders/${folderId}`);
      setFolder(response.data);
    } catch (error) {
      console.error("Error fetching folder:", error);
    }
  };

  const fetchTypebots = async () => {
    try {
      const response = await axios.get(
        `${baseurl}/api/folders/${folderId}/typebots`
      );
      setTypebots(response.data);
    } catch (error) {
      console.error("Error fetching typebots:", error);
    }
  };

  const startEditing = (typebot) => {
    setEditingId(typebot._id);
    setEditName(typebot.name);
  };

  const updateTypebotName = async (id) => {
    try {
      await axios.put(`${baseurl}/api/typebots/${id}`, {
        name: editName,
      });
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
        await axios.delete(`${baseurl}/api/typebots/${id}`);
        setTypebots(typebots.filter((typebot) => typebot._id !== id));
        showSuccessToast("Typebot deleted successfully!");
      } catch (error) {
        console.error("Error deleting typebot:", error);
        showErrorToast("Failed to delete typebot");
      }
    }
  };

  const openTypebot = (id) => {
    navigate(`/typebot/${id}`);
  };

  const handleCreateTypebot = async (e) => {
    e.preventDefault();
    try {
      if (!folderId) {
        showErrorToast("No folder selected");
        return;
      }

      const response = await axios.post(
        `${baseurl}/api/folders/${folderId}/typebots`,
        {
          name: newTypebotName,
        }
      );
      setTypebots([...typebots, response.data]);
      setNewTypebotName("");
      setShowCreateForm(false);
      showSuccessToast("Typebot created successfully!");
    } catch (error) {
      if (error.response?.status === 400) {
        showErrorToast(error.response.data.message);
      } else if (error.response?.status === 404) {
        showErrorToast("Folder not found");
      } else {
        console.error("Error creating typebot:", error);
        showErrorToast("Failed to create typebot");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => navigate("/home")}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Back to Home"
              >
                <FaArrowLeft className="text-gray-600 text-xl hover:text-gray-800" />
              </button>
              <h2 className="text-2xl font-bold">{folder?.name}</h2>
            </div>

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
      </div>

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

export default FolderView;
