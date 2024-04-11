import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Offers from "./pages/Offers";
import Profile from "./pages/Profile";
import SignIn from "./pages/Signin";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import Listing from "./pages/Listing";
import Category from "./pages/Category";

function App() {
  return (
    <>
      {/* Router component for handling navigation */}
      <Router>
        {/* Header component to display at the top of each page */}
        <Header />
        {/* Routes component to define the routing configuration */}
        <Routes>
          {/* Route for the Home page */}
          <Route path="/" element={<Home />} />
          {/* Route for the Offers page */}
          <Route path="/offers" element={<Offers />} />
          {/* Route for the Profile page, accessible only when authenticated */}
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          {/* Route for the Sign In page */}
          <Route path="/sign-in" element={<SignIn />} />
          {/* Route for the Sign Up page */}
          <Route path="/sign-up" element={<SignUp />} />
          {/* Route for displaying a specific listing */}
          <Route path="/category/:categoryName/:listingId" element={<Listing />} />
          {/* Route for the Forgot Password page */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* Route for displaying listings of a specific category */}
          <Route path="/category/:categoryName" element={<Category />} />
          {/* Route for creating a new listing, accessible only when authenticated */}
          <Route path="/create-listing" element={<PrivateRoute />}>
            <Route path="/create-listing" element={<CreateListing />} />
          </Route>
          {/* Route for editing an existing listing, accessible only when authenticated */}
          <Route path="/edit-listing" element={<PrivateRoute />}>
            <Route path="/edit-listing/:listingId" element={<EditListing />} />
          </Route>
        </Routes>
      </Router>
      {/* ToastContainer component for displaying toast messages */}
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
