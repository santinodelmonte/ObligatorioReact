import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { useSelector } from "react-redux";
import store from "./redux/store";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import UserProfile from "./components/UserProfile";
import NaturalAreaList from './components/NaturalAreaList';
import CreateNaturalArea from "./components/CreateNaturalArea";
import NaturalAreaDetail from './components/NaturalAreaDetail';
import NaturalAreaForm from './components/NaturalAreaForm';
import NaturalAreaDelete from "./components/NaturalAreaDelete";
import NaturalAreaUpdate from "./components/NaturalAreaUpdate";
import SpeciesList from "./components/SpeciesList";
import CreateSpecies from "./components/CreateSpecies";
import SpeciesDetail from "./components/SpeciesDetail";
import SpeciesUpdate from "./components/SpeciesUpdate";
import SpeciesDelete from "./components/SpeciesDelete";
import ConservationActivityList from "./components/ConservationActivityList";
import CreateConservationActivity from "./components/CreateConservationActivity";
import ConservationActivityUpdate from "./components/ConservationActivityUpdate";
import ConservationActivityDelete from "./components/ConservationActivityDelete";
import CreateComment from "./components/CreateComment";
import CommentDelete from "./components/CommentDelete";
import CommentUpdate from "./components/CommentUpdate";
import UserDetails from "./components/UserDetails";
import NaturalAreaXUser from "./components/NaturalAreaXUser";
import SpeciesbyUser from "./components/SpeciesbyUser";
import ConservationActivitiesByUser from "./components/ConservationActivitiesByUser";



function App() {
  const user = useSelector((state) => state.auth.user);
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<NaturalAreaList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/natural-areas" element={<NaturalAreaList />} />
            <Route path="/crear-area" element={<CreateNaturalArea />} />
            <Route path="/natural-areas/form" element={<NaturalAreaForm />} />
            <Route path="/natural-areas/:id" element={<NaturalAreaDetail />} />
            <Route path="/areas/:id/delete" element={<NaturalAreaDelete />} />
            <Route path="/areas/:id/update" element={<NaturalAreaUpdate />} />

            <Route path="/species" element={<SpeciesList />} />
            <Route path="/species/crear-especie" element={<CreateSpecies />} />
            <Route path="/species/:id" element={<SpeciesDetail />} />
            <Route path="/species/:id/update" element={<SpeciesUpdate />} />
            <Route path="/species/:id/delete" element={<SpeciesDelete />} />


            <Route path="/conservation-activity" element={<ConservationActivityList />} />
            <Route path="/conservation-activity/crear-actividad" element={<CreateConservationActivity />} />
            <Route path="/conservation-activity/:id/update" element={<ConservationActivityUpdate />} />
            <Route path="/conservation-activity/:id/delete" element={<ConservationActivityDelete />} />

            <Route path="/comment" element={<CreateComment />} />
            <Route path="/areas/:id/comment" element={<CreateComment entityType="naturalArea" />}/>
            <Route path="/species/:id/comment" element={<CreateComment entityType="species" />}/>
            <Route path="/comment/:id/delete" element={<CommentDelete />}/>
            <Route path="/areas/:entityId/updateComment/:commentId" element={<CommentUpdate entityType="naturalArea" />} />
            <Route path="/species/:entityId/updateComment/:commentId" element={<CommentUpdate entityType="species" />} />



            <Route path="/users" element={user ? <UserProfile /> : <Navigate to="/login" />} />
            <Route path="/user/:id" element={<UserDetails />} />
            <Route path="/usuarios/:id/areas" element={<NaturalAreaXUser />} />
            <Route path="/usuarios/:id/especies" element={<SpeciesbyUser />} />
            <Route path="/usuarios/:id/actividades" element={<ConservationActivitiesByUser />} />


          </Routes>

        </div>
      </Router>
    </Provider>
  );
}

export default App;
