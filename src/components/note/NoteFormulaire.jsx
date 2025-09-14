import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Book,
  User,
  GraduationCap,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { Modal } from '../components/Modal'; // Assurez-vous d'avoir le composant Modal
import StudentSelector from './StudentSelector'; // Le nouveau composant



// Données fictives pour les menus déroulants
const elevesFictifs = [
  { _id: "el1", nom: "Dupont", prenom: "Jean", matricule: "M12345", classeId: "6ème A" },
  { _id: "el2", nom: "Martin", prenom: "Léa", matricule: "M12346", classeId: "5ème B" },
  { _id: "el3", nom: "Dubois", prenom: "Marie", matricule: "M12347", classeId: "4ème C" },
  // ... ajouter plus d'élèves pour tester la recherche
];
const matieresFictives = [
  { id: "mat1", nom: "Mathématiques" },
  { id: "mat2", nom: "Français" },
  { id: "mat3", nom: "Histoire-Géographie" },
];
const enseignantsFictifs = [
  { id: "ens1", nom: "M. Albert" },
  { id: "ens2", nom: "Mme Claire" },
];
const anneesScolaires = [
  { id: "annee1", nom: "2024-2025" },
  { id: "annee2", nom: "2025-2026" },
];
const trimestres = ["1er trimestre", "2ème trimestre", "3ème trimestre"];
const sequences = ["Séquence 1", "Séquence 2", "Séquence 3", "Séquence 4", "Séquence 5", "Séquence 6"];

const NoteForm = () => {
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const onSubmit= (data) => {
    console.log("Données du formulaire de note :", data);
    reset();
    setSelectedStudent(null);
  };

  const handleSelectStudent = (eleve) => {
    setSelectedStudent(eleve);
    setValue('eleveId', eleve._id, { shouldValidate: true });
    setIsStudentModalOpen(false);
  };

  const inputStyle = `
    w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white
    border border-gray-300 dark:border-gray-700
    focus:outline-none focus:ring-2 focus:ring-blue-500
    transition-all duration-200
  `;

  const labelStyle = "flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1";
  const errorStyle = "text-red-500 text-xs mt-1 italic";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 max-w-2xl mx-auto my-10 border border-gray-200 dark:border-gray-800">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
        Attribuer une note
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* L'élève (sélection par modale) et l'enseignant */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="eleveId" className={labelStyle}><User size={16} />Élève</label>
            <input
              type="hidden"
              {...register('eleveId', { required: "L'élève est requis" })}
            />
            <button
              type="button"
              onClick={() => setIsStudentModalOpen(true)}
              className={`${inputStyle} text-left truncate`}
            >
              {selectedStudent ? `${selectedStudent.prenom} ${selectedStudent.nom}` : "Sélectionner un élève"}
            </button>
            {errors.eleveId && <p className={errorStyle}>{errors.eleveId.message}</p>}
          </div>

          <div>
            <label htmlFor="enseignantId" className={labelStyle}><GraduationCap size={16} />Enseignant</label>
            <select
              id="enseignantId"
              {...register("enseignantId", { required: "L'enseignant est requis" })}
              className={inputStyle}
            >
              <option value="">Sélectionner un enseignant</option>
              {enseignantsFictifs.map(enseignant => (
                <option key={enseignant.id} value={enseignant.id}>{enseignant.nom}</option>
              ))}
            </select>
            {errors.enseignantId && <p className={errorStyle}>{errors.enseignantId.message}</p>}
          </div>
        </div>

        {/* Matière et Valeur de la note */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="matiereId" className={labelStyle}><Book size={16} />Matière</label>
            <select
              id="matiereId"
              {...register("matiereId", { required: "La matière est requise" })}
              className={inputStyle}
            >
              <option value="">Sélectionner une matière</option>
              {matieresFictives.map(matiere => (
                <option key={matiere.id} value={matiere.id}>{matiere.nom}</option>
              ))}
            </select>
            {errors.matiereId && <p className={errorStyle}>{errors.matiereId.message}</p>}
          </div>

          <div>
            <label htmlFor="valeur" className={labelStyle}><Award size={16} />Valeur de la note</label>
            <input
              id="valeur"
              type="number"
              step="0.01"
              {...register("valeur", {
                required: "La valeur est requise",
                min: { value: 0, message: "La note ne peut pas être inférieure à 0" },
                max: { value: 20, message: "La note ne peut pas être supérieure à 20" },
              })}
              className={inputStyle}
            />
            {errors.valeur && <p className={errorStyle}>{errors.valeur.message}</p>}
          </div>
        </div>

        {/* Trimestre et Séquence */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="trimestre" className={labelStyle}><Layers size={16} />Trimestre</label>
            <select
              id="trimestre"
              {...register("trimestre")}
              className={inputStyle}
            >
              <option value="">Sélectionner un trimestre</option>
              {trimestres.map(trimestre => (
                <option key={trimestre} value={trimestre}>{trimestre}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sequence" className={labelStyle}><Book size={16} />Séquence</label>
            <select
              id="sequence"
              {...register("sequence")}
              className={inputStyle}
            >
              <option value="">Sélectionner une séquence</option>
              {sequences.map(sequence => (
                <option key={sequence} value={sequence}>{sequence}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Année scolaire */}
        <div>
          <label htmlFor="anneeScolaireId" className={labelStyle}><Calendar size={16} />Année scolaire</label>
          <select
            id="anneeScolaireId"
            {...register("anneeScolaireId", { required: "L'année scolaire est requise" })}
            className={inputStyle}
          >
            <option value="">Sélectionner une année</option>
            {anneesScolaires.map((annee) => (
              <option key={annee.id} value={annee.id}>{annee.nom}</option>
            ))}
          </select>
          {errors.anneeScolaireId && <p className={errorStyle}>{errors.anneeScolaireId.message}</p>}
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Enregistrer la note
        </button>
      </form>

      {/* Modale de sélection des élèves */}
      <Modal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        title="Sélectionner un élève"
        size="md"
      >
        <StudentSelector eleves={elevesFictifs} onSelect={handleSelectStudent} />
      </Modal>
    </div>
  );
};

export default NoteForm;