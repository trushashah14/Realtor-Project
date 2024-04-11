import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Custom hook to track authentication status
export function useAuthStatus() {
  const [loggedIn, setLoggedIn] = useState(false); // State to track if user is logged in
  const [checkingStatus, setCheckingStatus] = useState(true); // State to track if authentication status is being checked

  useEffect(() => { // Effect hook to run when component mounts
    const auth = getAuth(); // Get authentication object from Firebase
    console.log(auth); // Log authentication object for debugging purposes

    // Listen for changes in authentication state
    onAuthStateChanged(auth, (user) => {
      if (user) { // If user is logged in
        setLoggedIn(true); // Set loggedIn state to true
      }
      setCheckingStatus(false); // Set checkingStatus state to false once authentication status is checked
    });
  }, []); // Empty dependency array ensures effect runs only once when component mounts

  return { loggedIn, checkingStatus }; // Return loggedIn and checkingStatus states
}