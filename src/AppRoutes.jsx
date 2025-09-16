import { Route, Routes, useLocation, matchPath } from "react-router-dom";
import Login from "./components/Login";
import Navbar from "./layouts/Nav";
import PrivateRoute from "./components/ProtegeRoute";
import Dashboard from "./pages/admin/Dashboard";
import NotesPages from "./pages/admin/NotesPages";
import ElevesPages from "./pages/admin/ElevesPages";
import EnseignantsPage from "./pages/admin/EnseignantsPage";
import MatieresPage from "./pages/admin/MatieresPage";
import ClassesPage from "./pages/admin/ClassesPage";
import NotesResultat from "./pages/admin/NotesResultat";
import NotesSaisie from "./pages/admin/NotesSaisie";
import Setting from "./pages/admin/Setting";
import PaiementControles from "./pages/admin/PaiementControles";
import PaiementFrais from "./pages/admin/PaiementFrais";
import Paiements from "./pages/admin/Paiements";
import DetailEleve from "./components/eleves/DetailEleve";
import NotFound from "./pages/NotFound";
import Emploidutemps from "./pages/Emploidutemps";
import Messagerie from "./pages/Messagerie";
import DashbordEleve from "./pages/eleves/DashbordEleve";
function Layout() {
  const location = useLocation();
  
  // Liste des routes définies dans l'application
  const definedRoutes = [
    "/",
    "/emploi-du-temps",
    "/messageries",
    "/admin/dashboard",
    "/notes",
    "/eleves",
    "/eleves/detail/:id",
    "/enseignants",
    "/matieres",
    "/classes",
    "/notes_saisie",
    "/notes_resultats",
    "/setting",
    "/controleScolaire",
    "/fraiScolaire",
    "/paiements",
    "/eleve/dashboard"
  ];
  
  // Vérifier si la route actuelle correspond à une route définie
  const isDefinedRoute = definedRoutes.some(route => {
    if (route.includes(':')) {
      // Pour les routes avec paramètres, utiliser matchPath
      return matchPath({ path: route, exact: true }, location.pathname);
    }
    return location.pathname === route;
  });
  
  // Cacher la navbar sur la page de login et les pages 404
  const hideNavbar = location.pathname === "/" || !isDefinedRoute;
  
  return (
    <div>
      {!hideNavbar && <Navbar/>}
      <div>
      <Routes>
  {/* Public */}
       <Route path="/" element={<Login />} />
       <Route path="/emploi-du-temps" element={<Emploidutemps />} />
       <Route path="/messageries" element={
         <PrivateRoute roles={["admin", "enseignant", "eleve"]}><Messagerie /></PrivateRoute>
        }/>

  {/* Admin */}
         <Route path="/admin/dashboard" element={
           <PrivateRoute roles={["admin"]}><Dashboard /></PrivateRoute>
          }/>
         <Route path="/notes" element={
           <PrivateRoute roles={["admin"]}><NotesPages /></PrivateRoute>
          }/>
         <Route path="/eleves" element={
           <PrivateRoute roles={["admin"]}><ElevesPages /></PrivateRoute>
          }/>
         <Route path="/eleves/detail/:id" element={
           <PrivateRoute roles={["admin"]}><DetailEleve /></PrivateRoute>
          }/>
         <Route path="/enseignants" element={
           <PrivateRoute roles={["admin"]}><EnseignantsPage /></PrivateRoute>
          }/>
         <Route path="/matieres" element={
           <PrivateRoute roles={["admin"]}><MatieresPage /></PrivateRoute>
          }/>
         <Route path="/classes" element={
           <PrivateRoute roles={["admin"]}><ClassesPage /></PrivateRoute>
          }/>
         <Route path="/notes_saisie" element={
           <PrivateRoute roles={["admin"]}><NotesSaisie /></PrivateRoute>
          }/>
         <Route path="/notes_resultats" element={
           <PrivateRoute roles={["admin"]}><NotesResultat /></PrivateRoute>
          }/>
         <Route path="/setting" element={
           <PrivateRoute roles={["admin"]}><Setting /></PrivateRoute>
          }/>
         <Route path="/controleScolaire" element={
           <PrivateRoute roles={["admin"]}><PaiementControles /></PrivateRoute>
          }/>
         <Route path="/fraiScolaire" element={
           <PrivateRoute roles={["admin"]}><PaiementFrais /></PrivateRoute>
          }/>
         <Route path="/paiements" element={
           <PrivateRoute roles={["admin"]}><Paiements /></PrivateRoute>
          }/>

         <Route path="/eleve/dashboard" element={
           <PrivateRoute roles={["eleve"]}><DashbordEleve /></PrivateRoute>
          }/>

          {/* Catch all - 404 Page */}
          <Route path="*" element={<NotFound />} />
</Routes>
      </div>
    </div>
  );
}

export default Layout;