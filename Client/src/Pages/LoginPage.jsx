import { useState } from "react";
import { logInfo } from "../API/authCalls.js";
import { SignUp } from "../API/authCalls.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../app.css";
import LoadScreen from "../Components/LoadScreen.jsx";
import AlertCard from "../Components/AlertCard.jsx";
import { verifySize } from "../utilities/verifyImageSize.js";

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState("Log In");
  const [name, setName] = useState("");
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [about, setAbout] = useState("");
  const [toWait, setToWait] = useState(false);
  const [pic, setPic] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [message, setMessage] = useState({ display: false, msg: "", type: "" });

  const handleSubmit = async (e) => {
    {
      e.preventDefault();
      setToWait(true); 
      try {
        if (activeTab === "Sign In") {
          const resultData = await SignUp(name, email, password, about, pic);
          setPic(null);
          if (resultData.error) {
            setMessage({ display: true, msg: resultData.error, type: "error" });
          }
          if (resultData === 200) {
            setActiveTab("Log In");
            setName("");
            setPassword("");
            setemail("");
            setAbout("");
            setMessage({display:false, type:"", msg: ""});
          }
        } else {
          const result = await logInfo(email, password, dispatch, navigate);
          setPassword("");
          setemail("");
          setMessage({ display: false, msg: "", type: "" });
          if (result?.error) {
            setMessage({ display: true, msg: result.error, type: "error" });
          }
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setToWait(false); 
      } 
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const verifyingSize = verifySize(file, 5);
    if(!verifyingSize){
      setPic(null);
      return alert("File must not exceed the 5MB")
    }
    setPic(file);
  }

  return (
    <>
      {toWait && <LoadScreen />}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-gray-700 rounded-md shadow-lg flex flex-col">
          {/* Header */}
          <div className="text-3xl font-bold text-center bg-gray-700 text-gray-300 p-4 rounded-t-md">
            SCHROME CHAT
          </div>

          {/* Tabs */}
          <div className="bg-gray-700 p-3 flex justify-center">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setActiveTab("Log In");
                  setMessage({ display: false, msg: "", type: "" });
                  setPassword("");
                  setemail("");
                }}
                className={`px-4 py-2 text-gray-300 rounded-md transition-colors ${
                  activeTab === "Log In"
                    ? "bg-purple-500 text-white"
                    : "hover:bg-gray-700"
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setActiveTab("Sign In");
                  setMessage({ display: false, msg: "", type: "" });
                  setPassword("");
                  setemail("");
                }}
                className={`px-4 py-2 text-gray-300 rounded-md transition-colors ${
                  activeTab === "Sign In"
                    ? "bg-purple-500 text-white"
                    : "hover:bg-gray-700"
                }`}
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Form Container */}
          <div className="p-4 flex-1 overflow-y-auto">
            <form className="space-y-4">
              {activeTab === "Sign In" && (
                <>
                  {/* Name Field */}
                  <div className="space-y-2">
                    {message.display && (
                      <AlertCard message={message.msg} type={message.type} />
                    )}
                    <label
                      htmlFor="name"
                      className="block text-gray-300 font-medium"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 text-gray-300 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your name"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-gray-300 font-medium"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setemail(e.target.value)}
                      className="w-full p-3 text-gray-300 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your email"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-gray-300 font-medium"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 text-gray-300 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your password"
                    />
                  </div>

                  {/* About Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="about"
                      className="block text-gray-300 font-medium"
                    >
                      About
                    </label>
                    <textarea
                      id="about"
                      maxLength={1000}
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      className="w-full p-3 text-gray-300 bg-gray-800 border border-gray-600 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Tell us about yourself"
                    />
                  </div>

                  {/* Profile Picture */}
                  <div className="space-y-2">
                    <label
                      htmlFor="pic"
                      className="block text-gray-300 font-medium"
                    >
                      Profile Picture
                    </label>
                    <input
                      id="pic"
                      type="file"
                      onChange={(e) => handleFileChange(e)}
                      className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600"
                    />
                  </div>
                </>
              )}

              {activeTab === "Log In" && (
                <>
                  {/* Email Field */}
                  <div className="space-y-2">
                    {message.msg?.length > 1 && (
                      <AlertCard message={message.msg} type={message.type} />
                    )}
                    <label
                      htmlFor="email"
                      className="block text-gray-300 font-medium"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setemail(e.target.value)}
                      className="w-full p-3 text-gray-300 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your email"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-gray-300 font-medium"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 text-gray-300 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your password"
                    />
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={(e) => handleSubmit(e)}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200"
              >
                {activeTab === "Sign In" ? "Sign Up" : "Log In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
