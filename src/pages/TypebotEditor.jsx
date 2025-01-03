import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  FaPlus,
  FaTrash,
  FaFont,
  FaImage,
  FaVideo,
  FaRegCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaStar,
  FaRegKeyboard,
  FaHashtag,
  FaShare,
  FaChartBar,
} from "react-icons/fa";
import { SiGiphy } from "react-icons/si";
import "./TypebotEditor.css";
import baseurl from "../utils/config";

const TypebotEditor = () => {
  const { id } = useParams();
  const [typebot, setTypebot] = useState(null);
  const [formElements, setFormElements] = useState([]);

  useEffect(() => {
    fetchTypebot();
  }, [id]);

  const fetchTypebot = async () => {
    try {
      const response = await axios.get(`${baseurl}/api/typebots/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTypebot(response.data);
      setFormElements(response.data.fields || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addElement = (type, category) => {
    if (type === "button") {
      // Check if a submit button already exists
      const hasSubmitButton = formElements.some((el) => el.type === "button");
      if (hasSubmitButton) {
        alert(
          "A submit button already exists. Only one submit button is allowed."
        );
        return;
      }

      // Add submit button at the end
      const submitButton = {
        id: Date.now().toString(),
        type: "button",
        category: "input",
        content: "Submit",
        required: false,
        options: [],
      };
      setFormElements([...formElements, submitButton]);
    } else {
      const newElement = {
        id: Date.now().toString(),
        type,
        category,
        content: category === "bubble" ? "" : undefined,
        hint: category === "input" ? "" : undefined,
        required: false,
        options: [],
      };
      setFormElements([...formElements, newElement]);
    }
  };

  const updateElement = (index, updates) => {
    const newElements = [...formElements];
    newElements[index] = {
      ...newElements[index],
      ...updates,
    };
    setFormElements(newElements);
  };

  const deleteElement = async (index) => {
    try {
      const updatedElements = formElements.filter((_, i) => i !== index);
      setFormElements(updatedElements);

      await axios.put(
        `${baseurl}/api/typebots/${id}/fields`,
        {
          fields: updatedElements,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Error deleting element:", error);
      alert("Failed to delete element. Please try again.");
    }
  };

  const saveForm = async () => {
    // Check if form has a submit button
    const hasSubmitButton = formElements.some((el) => el.type === "button");
    if (!hasSubmitButton) {
      alert(
        "Please add a submit button before saving the form. You can find it in the Answer Fields section."
      );
      return false;
    }

    try {
      const validatedElements = formElements.map((element) => ({
        ...element,
        content: element.content || "",
        required: Boolean(element.required),
        options: Array.isArray(element.options) ? element.options : [],
        hint: element.hint || "",
        url: element.url || "",
      }));

      const response = await axios.put(
        `${baseurl}/api/typebots/${id}/fields`,
        {
          fields: validatedElements,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        alert("Form saved successfully!");
        return true;
      }
    } catch (error) {
      console.error("Error saving form:", error);
      const errorMessage = error.response?.data?.message || "Error saving form";
      alert(errorMessage);
      return false;
    }
  };

  const shareForm = async () => {
    if (!formElements.length) {
      alert("Please add some questions to your form before sharing.");
      return;
    }

    // Check if form has a submit button
    const hasSubmitButton = formElements.some((el) => el.type === "button");
    if (!hasSubmitButton) {
      alert(
        "Please add a submit button and save the form before sharing. You can find the submit button in the Answer Fields section."
      );
      return;
    }

    // Save form before sharing
    const saveSuccessful = await saveForm();
    if (!saveSuccessful) {
      return;
    }

    // Create shareable URL
    const formUrl = `${window.location.origin}/form/${id}`;

    // Create a temporary input element
    const tempInput = document.createElement("input");
    tempInput.value = formUrl;
    document.body.appendChild(tempInput);

    try {
      // Select the text
      tempInput.select();
      tempInput.setSelectionRange(0, 99999); // For mobile devices

      // Try to copy using document.execCommand first
      if (document.execCommand("copy")) {
        alert(
          `Form link copied to clipboard!\n\nURL: ${formUrl}\n\nMake sure to save the form before sharing.`
        );
      } else {
        // If execCommand fails, try navigator.clipboard as fallback
        await navigator.clipboard.writeText(formUrl);
        alert(
          `Form link copied to clipboard!\n\nURL: ${formUrl}\n\nMake sure to save the form before sharing.`
        );
      }
    } catch (error) {
      console.error("Failed to copy:", error);
      // If all copying methods fail, just show the URL
      alert(
        `Unable to copy automatically. Please copy this URL manually:\n\n${formUrl}`
      );
    } finally {
      // Clean up
      document.body.removeChild(tempInput);
    }
  };

  const viewStats = () => {
    window.open(`/form/${id}/stats`, "_blank");
  };

  const Sidebar = () => (
    <div className="sidebar">
      <div className="sidebar-section">
        <h2 className="section-title">Bubbles</h2>
        <div className="button-grid">
          <button
            onClick={() => addElement("text", "bubble")}
            className="tool-button"
          >
            <FaFont /> Text
          </button>
          <button
            onClick={() => addElement("image", "bubble")}
            className="tool-button"
          >
            <FaImage /> Image
          </button>
          <button
            onClick={() => addElement("video", "bubble")}
            className="tool-button"
          >
            <FaVideo /> Video
          </button>
          <button
            onClick={() => addElement("gif", "bubble")}
            className="tool-button"
          >
            <SiGiphy /> GIF
          </button>
        </div>
      </div>

      <div className="sidebar-section">
        <h2 className="section-title">Inputs</h2>
        <div className="button-grid">
          <button
            onClick={() => addElement("text", "input")}
            className="tool-button"
          >
            <FaRegKeyboard /> Text Input
          </button>
          <button
            onClick={() => addElement("number", "input")}
            className="tool-button"
          >
            <FaHashtag /> Number
          </button>
          <button
            onClick={() => addElement("email", "input")}
            className="tool-button"
          >
            <FaEnvelope /> Email
          </button>
          <button
            onClick={() => addElement("phone", "input")}
            className="tool-button"
          >
            <FaPhone /> Phone
          </button>
          <button
            onClick={() => addElement("date", "input")}
            className="tool-button"
          >
            <FaRegCalendarAlt /> Date
          </button>
          <button
            onClick={() => addElement("rating", "input")}
            className="tool-button"
          >
            <FaStar /> Rating
          </button>
          <button
            onClick={() => addElement("button", "input")}
            className="tool-button"
          >
            <FaPlus /> Button
          </button>
        </div>
      </div>

      <div className="help-section">
        <p className="help-title">How to use:</p>
        <ul className="help-list">
          <li>Add a bubble for your question</li>
          <li>Add an input field for the answer</li>
          <li>Set hint text for input fields</li>
          <li>Add a submit button at the end</li>
        </ul>
      </div>
    </div>
  );

  const FormContent = () => (
    <div className="editor-content">
      <div className="editor-header">
        <h1 className="editor-title">{typebot?.name || "Loading..."}</h1>
        <div className="editor-actions">
          <button onClick={shareForm} className="action-button">
            <FaShare /> Share
          </button>
          <button onClick={viewStats} className="action-button">
            <FaChartBar /> Stats
          </button>
          <button onClick={saveForm} className="save-button">
            Save Form
          </button>
        </div>
      </div>

      <div className="form-elements">
        <div className="start-node">
          <div className="start-label">Start</div>
        </div>

        {formElements.map((element, index) => (
          <div
            key={element.id}
            className={`element-card ${
              element.category === "input" ? "input-element" : ""
            } ${element.type === "button" ? "button-element" : ""}`}
          >
            <div className="element-content">
              {element.category === "bubble" ? (
                <div className="flex-between">
                  <input
                    type="text"
                    defaultValue={element.content}
                    onBlur={(e) =>
                      updateElement(index, { content: e.target.value })
                    }
                    className="element-input"
                    placeholder="Enter your message here"
                  />
                  <button
                    onClick={() => deleteElement(index)}
                    className="delete-button"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex-between">
                    {element.type === "button" ? (
                      <input
                        type="text"
                        defaultValue={element.content}
                        onBlur={(e) =>
                          updateElement(index, { content: e.target.value })
                        }
                        className="element-input"
                        placeholder="Enter button text"
                      />
                    ) : (
                      <input
                        type="text"
                        defaultValue={element.hint}
                        onBlur={(e) =>
                          updateElement(index, { hint: e.target.value })
                        }
                        className="element-input"
                        placeholder="Enter hint text (e.g., Type your answer...)"
                      />
                    )}
                    <button
                      onClick={() => deleteElement(index)}
                      className="delete-button"
                    >
                      <FaTrash size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
            {element.type === "image" && (
              <div className="element-content">
                <input
                  type="text"
                  placeholder="Enter image URL"
                  className="url-input"
                  value={element.url || ""}
                  onChange={(e) =>
                    updateElement(index, { url: e.target.value })
                  }
                />
              </div>
            )}
            {element.type === "video" && (
              <div className="element-content">
                <input
                  type="text"
                  placeholder="Enter video URL"
                  className="url-input"
                  value={element.url || ""}
                  onChange={(e) =>
                    updateElement(index, { url: e.target.value })
                  }
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="editor-container">
      <Navbar />
      <div className="editor-layout">
        <Sidebar />
        <FormContent />
      </div>
    </div>
  );
};

export default TypebotEditor;
