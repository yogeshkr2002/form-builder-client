import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaLock } from "react-icons/fa";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center gap-3 mb-4">
          <FaExclamationTriangle className="text-yellow-500 text-4xl" />
          <FaLock className="text-gray-500 text-3xl" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Access Required
        </h1>
        <h2 className="text-xl text-gray-700 mb-4">Authentication Needed</h2>
        <p className="text-gray-600 mb-8">
          This form requires authentication to access. Please log in with your
          account or contact the form owner for access.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors w-full"
          >
            Log in to access
          </button>
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-800 px-6 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors w-full"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
