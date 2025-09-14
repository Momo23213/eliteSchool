import React, { createContext, useContext, useEffect, useState } from "react";
import classeService from "../services/classeService";
import matiereService from "../services/matiereService";
import anneeService from "../services/anneeService";
import enseignantService from "../services/enseignantService";

// 👉 Valeur par défaut vide pour éviter le "never"
const SchoolContext = createContext({});

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) throw new Error("useSchool must be used within a SchoolProvider");
  return context;
};

export const SchoolProvider = ({ children }) => {
  const [classes, setClasses] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [annes, setAnnes] = useState([]);
  const [annesActive, setAnnesActive] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchInitialData() {
      setLoading(true);
      try {
        const [classesData, anneeData, matieresData, enseignantsData, annesActiveData] = await Promise.all([
          classeService.getAll(),
          anneeService.getAll(),
          matiereService.getAll(),
          enseignantService.getAll(),
          anneeService.getAll(),
        ]);

        setClasses(classesData);
        setAnnes(anneeData);
        setMatieres(matieresData);
        setEnseignants(enseignantsData);
        setAnnesActive(annesActiveData);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();
  }, []);

  const fetchElevesByClasse = async (classeId) => {
    if (!classeId) {
      setEleves([]);
      return;
    }
    setLoading(true);
    try {
      const elevesData = await classeService.getAllEleve(classeId);
      setEleves(elevesData);
    } catch (error) {
      console.error("Erreur lors du chargement des élèves :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SchoolContext.Provider
      value={{
        classes,
        eleves,
        matieres,
        annes,
        enseignants,
        annesActive,
        loading,
        fetchElevesByClasse,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

