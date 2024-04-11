import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css/bundle";
import { useNavigate } from "react-router-dom";


export default function Slider() {
  const [listings, setListings] = useState(null); // State for storing listings data
  const [loading, setLoading] = useState(true); // State for loading state
  SwiperCore.use([Autoplay, Navigation, Pagination]); // Initialize Swiper core modules
  const navigate = useNavigate(); // Initialize useNavigate hook for navigation

  useEffect(() => {
    async function fetchListings() {
      const listingsRef = collection(db, "listings"); // Reference to the "listings" collection
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5)); // Query to get latest 5 listings
      const querySnap = await getDocs(q); // Get the documents from Firestore
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings); // Set the listings state with the retrieved data
      setLoading(false); // Set loading state to false after data retrieval
    }
    fetchListings(); // Call the fetchListings function on component mount
  }, []); // Empty dependency array to ensure useEffect runs only once on mount

  // Render Spinner component if data is still loading
  if (loading) {
    return <Spinner />;
  }

  // If there are no listings, return an empty fragment
  if (listings.length === 0) {
    return <></>;
  }

  // Render the Swiper component with slides for each listing
  return (
    listings && (
      <>
        <Swiper
          slidesPerView={1}
          navigation
          pagination={{ type: "progressbar" }}
          effect="fade"
          modules={[EffectFade]}
          autoplay={{ delay: 3000 }}
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div
                style={{
                  background: `url(${data.imgUrls[0]}) center, no-repeat`,
                  backgroundSize: "cover",
                }}
                className="relative w-full h-[300px] overflow-hidden"
              ></div>
              <p className="text-[#f1faee] absolute left-1 top-3 font-medium max-w-[90%] bg-[#457b9d] shadow-lg opacity-90 p-2 rounded-br-3xl">
                {data.name}
              </p>
              <p className="text-[#f1faee] absolute left-1 bottom-1 font-semibold max-w-[90%] bg-[#e63946] shadow-lg opacity-90 p-2 rounded-tr-3xl">
                Rs {" "}{data.discountedPrice ?? data.regularPrice}
                {data.type === "rent" && " / month"}
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
}