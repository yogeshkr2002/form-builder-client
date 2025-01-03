import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { IoSend } from "react-icons/io5";
import baseurl from "../utils/config";

const FormResponse = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [visibleSteps, setVisibleSteps] = useState([]);
  const [conversation, setConversation] = useState([]);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        console.log("Fetching form with ID:", id);
        const response = await axios.get(
          `${baseurl}/api/typebots/${id}/public`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Form data received:", response.data);

        if (
          !response.data ||
          !response.data.fields ||
          !response.data.fields.length
        ) {
          console.error("Invalid form data received:", response.data);
          return;
        }

        setForm(response.data);

        // Initialize with first field
        const firstField = response.data.fields[0];
        if (firstField) {
          if (firstField.category === "bubble") {
            setVisibleSteps([0, 1]); // Show first bubble and next input
            setCurrentStep(1); // Set current step to next input
            setConversation([
              {
                type: "bot",
                content: firstField.content,
                field: firstField,
              },
            ]);
          } else {
            setVisibleSteps([0]); // Show first input
            setCurrentStep(0);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching form:", error);
        if (error.response?.status === 401) {
          alert("Authorization required. Please log in.");
        } else if (error.response?.status === 404) {
          alert("Form not found. Please check the URL and try again.");
        } else {
          alert("Error loading form. Please try again later.");
        }
        setLoading(false);
      }
    };
    fetchForm();
  }, [id]);

  const handleNext = async (value = currentInput) => {
    // Don't validate empty input for button type
    if (
      !value.trim() &&
      form.fields[currentStep].category === "input" &&
      form.fields[currentStep].type !== "button"
    ) {
      return;
    }

    // Add user response to conversation if it's an input field
    if (
      form.fields[currentStep].category === "input" &&
      form.fields[currentStep].type !== "button"
    ) {
      setConversation((prev) => [
        ...prev,
        {
          type: "user",
          content: value,
          field: form.fields[currentStep],
        },
      ]);

      setResponses((prev) => ({
        ...prev,
        [form.fields[currentStep].id]: value,
      }));
    }

    // Move to next step
    const nextStep = currentStep + 1;
    setCurrentInput("");

    if (nextStep < form.fields.length) {
      setCurrentStep(nextStep);
      setVisibleSteps((prev) => [...prev, nextStep]);

      // If next field is a bubble and there's another field after it,
      // show that one too after a delay
      if (
        form.fields[nextStep].category === "bubble" &&
        nextStep + 1 < form.fields.length
      ) {
        setTimeout(() => {
          setVisibleSteps((prev) => [...prev, nextStep + 1]);
          setCurrentStep(nextStep + 1);
        }, 500);
      }

      // Add next bot message to conversation if it's a bubble
      if (form.fields[nextStep].category === "bubble") {
        setTimeout(() => {
          setConversation((prev) => [
            ...prev,
            {
              type: "bot",
              content: form.fields[nextStep].content,
              field: form.fields[nextStep],
            },
          ]);
        }, 500);
      }
    } else {
      // Submit form
      try {
        await axios.post(
          `${baseurl}/api/typebots/${id}/responses`,
          {
            responses,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSubmitted(true);
        // Show success message
        setConversation((prev) => [
          ...prev,
          {
            type: "bot",
            content: "Thank you for your response!",
            field: { type: "text", category: "bubble" },
          },
        ]);
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Error submitting form. Please try again.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleNext();
  };

  const renderMessage = (message, index) => {
    if (message.type === "bot") {
      return (
        <div key={index} className="flex items-start mb-4 animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0" />
          <div className="ml-2 bg-blue-500 text-white rounded-lg py-2 px-4 max-w-md">
            {message.content}
          </div>
        </div>
      );
    } else {
      return (
        <div
          key={index}
          className="flex items-start mb-4 justify-end animate-fade-in"
        >
          <div className="mr-2 bg-green-500 text-white rounded-lg py-2 px-4 max-w-md">
            {message.content}
          </div>
          <div className="w-8 h-8 rounded-full bg-green-500 flex-shrink-0" />
        </div>
      );
    }
  };

  const renderInput = (field) => {
    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder={field.hint || "Type your answer"}
            className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:border-blue-500"
            required={field.required}
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:border-blue-500"
            required={field.required}
          />
        );
      case "email":
        return (
          <input
            type="email"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:border-blue-500"
            required={field.required}
          />
        );
      case "button":
        return (
          <button
            type="button"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            onClick={() => handleNext("")}
          >
            {field.content || "Submit"}
          </button>
        );
      default:
        return null;
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!form?.fields?.length)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Form not found
      </div>
    );
  if (submitted)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <div className="mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-green-500 mb-2">Thank you!</h2>
          <p className="text-gray-600">
            Your response has been submitted successfully.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-xl font-bold text-center">{form.name}</h1>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full p-4 overflow-y-auto">
        <div className="space-y-4">
          {/* Show conversation messages */}
          {conversation.map((message, index) => renderMessage(message, index))}
        </div>
      </div>

      {/* Show input field if current step is an input */}
      {currentStep < form.fields.length &&
        form.fields[currentStep].category === "input" && (
          <div className="sticky bottom-0 bg-white border-t p-4">
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="flex gap-2">
                {renderInput(form.fields[currentStep])}
                {form.fields[currentStep].type !== "button" && (
                  <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                  >
                    <IoSend size={20} />
                  </button>
                )}
              </form>
            </div>
          </div>
        )}
    </div>
  );
};

export default FormResponse;
