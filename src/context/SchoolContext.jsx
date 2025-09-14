import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { classeService } from "../services/classeService";
import { matiereService } from "../services/matiereService";
import { anneeService } from "../services/anneeService";
import { enseignantService } from "../services/enseignantService";

const SchoolContext = createContext(undefined);

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) throw new Error("useSchool must be used within a SchoolProvider");
  return context;
};


export const SchoolProvider= ({ children }) => {
  const [classes, setClasses] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [annes, setAnnes] = useState([]);
  const [annesActive, setAnnesActive] = useState([]);
  const [loading, setLoading] = useState(false);

  const [enseignants, setEnseignants] = useState<any[]>([]);

  useEffect(() => {
    async function fetchInitialData() {
      setLoading(true);
      const [classesData, anneeData, matieresData, enseignantsData,annesActive] = await Promise.all([
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
      setAnnesActive(annesActive);
      setLoading(false);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <SchoolContext.Provider value={{ classes, eleves, matieres, annes, enseignants, loading, fetchElevesByClasse }}>
      {children}
    </SchoolContext.Provider>
  );
};