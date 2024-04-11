import React, { useState } from "react"; // Import React and useState hook
import { IoMdEye, IoMdEyeOff } from "react-icons/io"; // Import eye icons from react-icons
import { Link, useNavigate } from "react-router-dom"; // Import Link component and useNavigate hook
import OAuth from "../components/OAuth"; // Import OAuth component
import { signInWithEmailAndPassword, getAuth } from "firebase/auth"; // Import functions for Firebase authentication
import { toast } from "react-toastify"; // Import toast notifications

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [formData, setFormData] = useState({ // State for form data
    email: "",
    password: "",
  });
  const { email, password } = formData; // Destructure form data
  const navigate = useNavigate(); // Get navigation function from react-router-dom

  function onChange(e) { // Function to handle form input change
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  }

  async function onSubmit(e) { // Function to handle form submission
    e.preventDefault();
    try {
      const auth = getAuth(); // Get authentication object from Firebase
      const userCredential = await signInWithEmailAndPassword( // Sign in user with email and password
        auth,
        email,
        password
      );
      if (userCredential.user) { // If user is signed in successfully
        navigate("/"); // Redirect to home page
      }
    } catch (error) {
      toast.error("Bad User Credentials"); // Display error toast
    }
  }

  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold">Sign In</h1>
      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img
            src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?q=80&w=1546&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="key"
            className="w-full rounded-2xl"
          />
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form onSubmit={onSubmit}>
            <div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={onChange}
                placeholder="Email Address"
                className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
              />
            </div>
            <div className="relative mb-6">
              <input
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={onChange}
                placeholder="Password"
              />
              {/* Toggle showPassword state */}
              {showPassword ? (
                <IoMdEyeOff
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              ) : (
                <IoMdEye
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              )}
            </div>
            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
              <p className="mb-6">
                Don't have a account?
                <Link
                  to="/sign-up"
                  className="text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1"
                >
                  Register
                </Link>
              </p>
              <p>
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out"
                >
                  Forgot Password ?
                </Link>
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800"
            >
              Sign In
            </button>
            <div className="flex my-4 items-center before:border-t before:flex-1  before:border-gray-300 after:border-t after:flex-1  after:border-gray-300">
              <p className="text-center font-semibold mx-4">OR</p>
            </div>
            <OAuth /> {/* OAuth login buttons */}
          </form>
        </div>
      </div>
    </section>
  );
}
