import { useEffect, useState } from "react"; // Importing necessary hooks from React
import { toast } from "react-toastify"; // Importing toast notifications
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore"; // Importing Firestore functions
import { db } from "../firebase"; // Importing Firestore database instance
import Spinner from "../components/Spinner"; // Importing Spinner component
import ListingItem from "../components/ListingItem"; // Importing ListingItem component

export default function Offers() {
  const [listings, setListings] = useState(null); // State for storing listings data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [lastFetchedListing, setLastFetchListing] = useState(null); // State for tracking the last fetched listing

  // Function to fetch initial listings
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, "listings"); // Reference to the "listings" collection
        const q = query(
          listingRef,
          where("offer", "==", true), // Filter listings where "offer" is true
          orderBy("timestamp", "desc"), // Order listings by timestamp in descending order
          limit(4) // Limit the number of listings to fetch
        );
        const querySnap = await getDocs(q); // Get a snapshot of the query results
        const lastVisible = querySnap.docs[querySnap.docs.length - 1]; // Get the last visible listing
        setLastFetchListing(lastVisible); // Set the last fetched listing
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listings); // Set the listings state with fetched data
        setLoading(false); // Set loading state to false
      } catch (error) {
        toast.error("Could not fetch listing"); // Display error toast if fetching fails
      }
    }

    fetchListings(); // Call the fetchListings function when component mounts
  }, []);

  // Function to fetch more listings when "Load more" button is clicked
  async function onFetchMoreListings() {
    try {
      const listingRef = collection(db, "listings"); // Reference to the "listings" collection
      const q = query(
        listingRef,
        where("offer", "==", true), // Filter listings where "offer" is true
        orderBy("timestamp", "desc"), // Order listings by timestamp in descending order
        startAfter(lastFetchedListing), // Start query after the last fetched listing
        limit(4) // Limit the number of listings to fetch
      );
      const querySnap = await getDocs(q); // Get a snapshot of the query results
      const lastVisible = querySnap.docs[querySnap.docs.length - 1]; // Get the last visible listing
      setLastFetchListing(lastVisible); // Set the last fetched listing
      const listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings((prevState)=>[...prevState, ...listings]); // Append new listings to the existing listings state
      setLoading(false); // Set loading state to false
    } catch (error) {
      toast.error("Could not fetch listing"); // Display error toast if fetching fails
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-3xl text-center mt-6 font-bold mb-6">Offers</h1>
      {loading ? ( // Display spinner while loading
        <Spinner />
      ) : listings && listings.length > 0 ? ( // Display listings if available
        <>
          <main>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
            </ul>
          </main>
          {lastFetchedListing && ( // Display "Load more" button if there are more listings to fetch
            <div className="flex justify-center items-center">
              <button
                onClick={onFetchMoreListings}
                className="bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6 hover:border-slate-600 rounded transition duration-150 ease-in-out"
              >
                Load more
              </button>
            </div>
          )}
        </>
      ) : (
        <p>There are no current offers</p> // Display message if no listings are available
      )}
    </div>
  );
}
