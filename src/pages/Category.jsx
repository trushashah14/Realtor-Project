import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore"; // Importing Firestore functions
import { db } from "../firebase"; // Importing the Firebase instance
import Spinner from "../components/Spinner"; // Importing a spinner component
import ListingItem from "../components/ListingItem"; // Importing a component to display a listing item
import { useParams } from "react-router"; // Importing useParams hook to access URL parameters

export default function Category() {
  const [listings, setListings] = useState(null); // State to store fetched listings
  const [loading, setLoading] = useState(true); // State to track loading status
  const [lastFetchedListing, setLastFetchListing] = useState(null); // State to store the last fetched listing
  const params = useParams(); // Accessing URL parameters using useParams hook

  useEffect(() => {
    async function fetchListings() {
      try {
        // Creating a Firestore query to fetch listings based on category name
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("type", "==", params.categoryName), // Filter by category name
          orderBy("timestamp", "desc"), // Order by timestamp in descending order
          limit(4) // Limit to 4 listings per query
        );
        const querySnap = await getDocs(q); // Executing the query
        const lastVisible = querySnap.docs[querySnap.docs.length - 1]; // Getting the last fetched listing
        setLastFetchListing(lastVisible); // Updating the last fetched listing state
        const listings = [];
        querySnap.forEach((doc) => {
          // Mapping the query snapshot to an array of listings
          listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listings); // Setting the listings state with fetched data
        setLoading(false); // Updating loading status
      } catch (error) {
        toast.error("Could not fetch listing"); // Displaying an error toast if fetching fails
      }
    }

    fetchListings(); // Fetch listings on component mount or when category name changes
  }, [params.categoryName]); // Dependency array to re-run effect when category name changes

  async function onFetchMoreListings() {
    try {
      // Creating a Firestore query to fetch more listings based on category name and last fetched listing
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("type", "==", params.categoryName), // Filter by category name
        orderBy("timestamp", "desc"), // Order by timestamp in descending order
        startAfter(lastFetchedListing), // Start query after the last fetched listing
        limit(4) // Limit to 4 listings per query
      );
      const querySnap = await getDocs(q); // Executing the query
      const lastVisible = querySnap.docs[querySnap.docs.length - 1]; // Getting the last fetched listing
      setLastFetchListing(lastVisible); // Updating the last fetched listing state
      const listings = [];
      querySnap.forEach((doc) => {
        // Mapping the query snapshot to an array of listings
        listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings((prevState) => [...prevState, ...listings]); // Concatenating new listings with existing ones
      setLoading(false); // Updating loading status
    } catch (error) {
      toast.error("Could not fetch listing"); // Displaying an error toast if fetching fails
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-3">
      {/* Conditional rendering based on loading and listing data */}
      <h1 className="text-3xl text-center mt-6 font-bold mb-6">
        {params.categoryName === "rent" ? "Places for Rent" : "Places for Sale"}
      </h1>
      {loading ? (
        <Spinner /> // Displaying a spinner while loading
      ) : listings && listings.length > 0 ? ( // Checking if listings exist
        <>
          <main>
            {/* Rendering listing items */}
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
          {lastFetchedListing && ( // Conditionally rendering 'Load more' button
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
        // Displaying a message when no listings are available
        <p>There are no current {params.categoryName === "rent" ? "places for Rent" : "places for Sale"}</p>
      )}
    </div>
  );
}
