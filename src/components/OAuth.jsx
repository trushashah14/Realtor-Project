import React from "react";
import { FcGoogle } from "react-icons/fc";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const navigate = useNavigate(); // Initialize useNavigate hook for navigation

  async function onGoogleClick() {
    try {
      const auth = getAuth(); // Get authentication instance
      const provider = new GoogleAuthProvider(); // Create GoogleAuthProvider instance
      const result = await signInWithPopup(auth, provider); // Sign in with Google popup
      const user = result.user; // Get user from authentication result

      // Check if the user exists in Firestore
      const docRef = doc(db, "users", user.uid); // Reference to the user document in Firestore
      const docSnap = await getDoc(docRef); // Get the document snapshot

      // If user does not exist in Firestore, create a new document
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(), // Add user's display name, email, and timestamp to Firestore
        });
      }

      navigate("/"); // Navigate to the home page after successful authentication
    } catch (error) {
      toast.error("Could not authorize with Google"); // Display error toast if authentication fails
    }
  }
  
  return (
    <button
      type="button"
      onClick={()=>onGoogleClick()}
      className="flex items-center justify-center w-full bg-red-700 text-white px-7 py-3 uppercase text-sm font-medium hover:bg-red-800 active:bg-red-900 shadow-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out rounded"
    >
      <FcGoogle className="text-2xl bg-white rounded-full mr-2" />
      Continue with Google
    </button>
  );
}
