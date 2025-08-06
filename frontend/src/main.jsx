import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./redux/store.js";
import { Provider } from "react-redux";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";

// Auth
import AdminRoute from "./pages/Admin/AdminRoute.jsx";
import GenreList from "./pages/Admin/GenreList.jsx";

// Restricted User

import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import Home from "./pages/Home.jsx";
import PrivateRoutes from "./pages/Auth/PrivateRoutes.jsx";
import Profile from "./pages/User/Profile.jsx";
import CreateMovie from "./pages/Admin/CreateMovie.jsx";
import AdminMoviesList from "./pages/Admin/AdminMoviesList.jsx";
import UpdateMovie from "./pages/Admin/UpdateMovie.jsx";
import AllMovies from "./pages/Movies/AllMovies.jsx";
import MovieDetail from "./pages/Movies/MovieDetail.jsx";
import AllComments from "./pages/Admin/AllComments.jsx";
import AdminDashboard from "./pages/Admin/DashBoard/AdminDashboard.jsx";
import MovieReview from "./pages/Admin/MovieReview.jsx";
import Cart from "./pages/User/Cart.jsx";
import CheckOut from "./pages/User/CheckOut.jsx";
import CartOpen from "./pages/User/CartOpen.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<Home />} />
      <Route path="/movies" element={<AllMovies />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/movies/:id" element={<MovieDetail />} />

      <Route path="" element={<PrivateRoutes />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<CartOpen/>}/>
        <Route path="/cart/checkout" element={<CheckOut/>}/>
      </Route>

      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/movies/genre" element={<GenreList />} />
        <Route path="/admin/movies/create" element={<CreateMovie />} />
        <Route path="/admin/movies-list" element={<AdminMoviesList />} />
        <Route path="/admin/movies/update/:id" element={<UpdateMovie />} />
        <Route path="/admin/movies/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/movies/comments" element={<AllComments />} />
        <Route path="/admin/movie/comment/:id" element={<MovieReview />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
