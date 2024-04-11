import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase";

export default function Contact({ userRef, listing }) {
  const [landlord, setLandlord] = useState(null); // State to store landlord data
  const [message, setMessage] = useState(""); // State to store message content

  // Effect hook to fetch landlord data when userRef changes
  useEffect(() => {
    async function getLandlord() {
      const docRef = doc(db, "users", userRef); // Firestore document reference for landlord
      const docSnap = await getDoc(docRef); // Fetch landlord document
      if (docSnap.exists()) { // If landlord document exists
        setLandlord(docSnap.data()); // Set landlord state with fetched data
      } else {
        toast.error("Could not get landlord data"); // Display error message if landlord data cannot be fetched
      }
    }
    getLandlord(); // Invoke function to fetch landlord data
  }, [userRef]); // Run effect when userRef changes

  // Function to handle message input change
  function onChange(e) {
    setMessage(e.target.value); // Update message state with new value
  }
  return (
    <>
      {landlord !== null && (
        <div className="flex flex-col w-full">
          <p>
            Contact <strong>{landlord.name} </strong>for {listing.name.toLowerCase()}
          </p>
          <div className="mt-3 mb-6">
            <textarea
              name="message"
              id="message"
              rows="2"
              value={message}
              onChange={onChange}
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
            ></textarea>
          </div>
          <a
            href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}
          >
            <button className="px-7 py-3 bg-blue-600 text-white rounded text-sm uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full text-center mb-6" type="button">
              Send Message
            </button>
          </a>
        </div>
      )}
    </>
  );
}