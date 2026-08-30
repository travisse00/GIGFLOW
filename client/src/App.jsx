import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./Components/Navbar";
import ProtectedRoute from "./Components/ProtectedRoures";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Gigs from "./pages/Gigs";
import GigDetails from "./pages/GigDetails";
import Dashboard from "./pages/Dashboard";
import CreateGig from "./pages/CreateGig";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import EditGig from "./pages/EditGigs";
import OrderDetails from "./pages/OrderDetails";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* PUBLIC ROUTES */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/gigs"
          element={<Gigs />}
        />

        <Route
          path="/gigs/:id"
          element={<GigDetails />}
        />

        {/* PROTECTED ROUTES */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/create-gig"
            element={<CreateGig />}
          />

          <Route
  path="/users/:id"
  element={<Profile />}
/>

<Route
  path="/edit-profile"
  element={
      <EditProfile />
  }
/>

<Route
  path="/orders/:id"
  element={<OrderDetails />}
/>

<Route path="/edit-gig/:id" element={<EditGig />} />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;
