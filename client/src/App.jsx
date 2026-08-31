import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./Components/Navbar";
import ProtectedRoute from "./Components/ProtectedRoures";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Gigs from "./Pages/Gigs";
import GigDetails from "./Pages/GigDetails";
import Dashboard from "./Pages/Dashboard";
import CreateGig from "./Pages/CreateGig";
import Profile from "./Pages/Profile";
import EditProfile from "./Pages/EditProfile";
import EditGig from "./Pages/EditGigs";
import OrderDetails from "./Pages/OrderDetails";

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
