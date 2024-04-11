import React, { useEffect } from "react"; // Import React and useEffect hook
import { getAuth, updateProfile } from "firebase/auth"; // Import functions for Firebase authentication
import { useState } from "react"; // Import useState hook
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore"; // Import Firestore functions
import { Link, useNavigate } from "react-router-dom"; // Import Link component and useNavigate hook
import { toast } from "react-toastify"; // Import toast notifications
import { db } from "../firebase"; // Import Firebase database instance
import { FcHome } from "react-icons/fc"; // Import Home icon from react-icons
import ListingItem from "../components/ListingItem"; // Import ListingItem component

export default function Profile() {
  const auth = getAuth(); // Get authentication object from Firebase
  const navigate = useNavigate(); // Get navigation function from react-router-dom
  const [changeDetail, setChangeDetail] = useState(false); // State for toggling profile details editing
  const [listings, setListings] = useState(null); // State for storing user's listings
  const [loading, setLoading] = useState(true); // State for loading indicator

  const [formData, setFormData] = useState({ // State for form data
    name: auth.currentUser.displayName, // Initial name value from Firebase auth
    email: auth.currentUser.email, // Initial email value from Firebase auth
  });
  const { name, email } = formData; // Destructure form data
  function onLogout() { // Function to handle user logout
    auth.signOut(); // Sign out the user
    navigate("/"); // Redirect to home page
  }

  function onChange(e) { // Function to handle form input change
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }
  async function onSubmit() { // Function to handle form submission
    try {
      if (auth.currentUser.displayName !== name) { // Check if name has been changed
        await updateProfile(auth.currentUser, { // Update display name in Firebase auth
          displayName: name,
        });

        const docRef = doc(db, "users", auth.currentUser.uid); // Reference to user document in Firestore
        await updateDoc(docRef, { // Update name in Firestore
          name,
        });
      }
      toast.success("Profile details updated"); // Display success toast
    } catch (error) {
      toast.error("Could not update the profile details"); // Display error toast
    }
  }
  useEffect(() => { // Fetch user's listings when component mounts
    async function fetchUserListings() {
      const listingRef = collection(db, "listings"); // Reference to "listings" collection in Firestore
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid), // Filter listings by user ID
        orderBy("timestamp", "desc") // Order listings by timestamp in descending order
      );
      const querySnap = await getDocs(q); // Get a snapshot of query results
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings); // Set listings state with fetched data
      setLoading(false); // Set loading state to false
    }
    fetchUserListings(); // Call fetchUserListings function
  }, [auth.currentUser.uid]); // Dependency array with user ID

  async function onDelete(listingID) { // Function to handle listing deletion
    if (window.confirm("Are you sure you want to delete?")) { // Confirm deletion with user
      await deleteDoc(doc(db, "listings", listingID)); // Delete listing document from Firestore
      const updatedListings = listings.filter( // Filter out deleted listing from state
        (listing) => listing.id !== listingID
      );
      setListings(updatedListings); // Set updated listings state
      toast.success("Successfully deleted the listing"); // Display success toast
    }
  }
  function onEdit(listingID) { // Function to handle listing editing
    navigate(`/edit-listing/${listingID}`); // Navigate to edit listing page
  }

  return (
    <>
      <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
        <div className="w-full md:w-[50%] mt-6 px-3">
          <form>
            {/* Name Input */}
            <input
              type="text"
              id="name"
              value={name}
              disabled={!changeDetail} // Disable input if not in edit mode
              onChange={onChange}
              className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${
                changeDetail ? "bg-red-200 focus:bg-red-200" : "bg-white"
              }`}
            />

            {/* Email Input */}
            <input
              type="email"
              id="email"
              value={email}
              disabled // Disable email input
              className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"
            />

            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
              <p className="flex items-center ">
                Do you want to change your name?
                <span
                  onClick={() => {
                    changeDetail && onSubmit(); // Submit form if in edit mode
                    setChangeDetail((prevState) => !prevState); // Toggle edit mode
                  }}
                  className="text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer"
                >
                  {changeDetail ? "Apply change" : "Edit"}
                </span>
              </p>
              <p
                onClick={onLogout} // Logout user when clicked
                className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer"
              >
                Sign out
              </p>
            </div>
          </form>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800"
          >
            <Link
              to="/create-listing" // Link to create listing page
              className="flex justify-center items-center"
            >
              <FcHome className="mr-2 text-3xl bg-red-200 rounded-full p-1 border-2" />
              Sell or rent your home
            </Link>
          </button>
        </div>
      </section>
      <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading && listings.length > 0 && ( // Render listings if available
          <>
            <h2 className="text-2xl text-center font-semibold">My Listings</h2>
            <ul className="sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => onDelete(listing.id)} // Pass onDelete function as prop
                  onEdit={() => onEdit(listing.id)} // Pass onEdit function as prop
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
