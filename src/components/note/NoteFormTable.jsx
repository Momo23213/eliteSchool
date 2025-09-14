// src/components/NoteFormTable.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { useSchool } from "../../context/SchoolContext";
import { User, Book, GraduationCap, Layers, Award, CircleCheck, CircleAlert } from "lucide-react";

const API_URL = "https://schoolelite.onrender.com/api/notes/tableau";

const NoteFormTable = () => {
  const navigate = useNavigate();
  const { classes, eleves, matieres, annes, enseignants, fetchElevesByClasse, loading } = useSchool();
  const { register, handleSubmit, watch, control, reset, formState: { errors } } = useForm({
    defaultValues: { notes: [] }
  });

  const { fields, replace } = useFieldArray({ control, name: "notes" });
  const watchedNotes = watch("notes");

  const watchedClasseId = watch("classeId");
  const [message, setMessage] = useState(null);
  const trimestres = ["1er trimestre", "2ème trimestre", "3ème trimestre"];
  const sequences = ["Séquence 1", "Séquence 2", "Séquence 3", "Séquence 4", "Séquence 5", "Séquence 6"];

  // Quand la classe change, fetch des élèves et initialisation des notes
  useEffect(() => {
    async function fetchAndPrepare() {
      if (!watchedClasseId) {
        replace([]);
        return;
      }
      await fetchElevesByClasse(watchedClasseId);
      // On attend que le fetch soit terminé, puis on initialise les notes
      setTimeout(() => {
        replace(
          (Array.isArray(eleves) ? eleves : []).map(eleve => ({
            eleveId: eleve._id,
            nomComplet: `${eleve.prenom} ${eleve.nom}`,
            matricule: eleve.matricule || '-',
            valeur: 0
          }))
        );
      }, 0);
    }
    fetchAndPrepare();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedClasseId]);

  const onSubmit = async (data) => {
    if (!data.classeId || !data.matiereId || !data.enseignantId || !data.trimestre || !data.sequence || !data.anneeScolaireId) {
      setMessage({ type: 'error', text: "Veuillez remplir tous les champs obligatoires." });
      return;
    }

    const notesToSubmit= data.notes.map(note => ({
      eleveId: note.eleveId,
      matiereId: data.matiereId,
      enseignantId: data.enseignantId,
      valeur: note.valeur,
      trimestre: data.trimestre,
      sequence: data.sequence,
      anneeScolaireId: data.anneeScolaireId
    }));

    try {
      const response = await axios.post(API_URL, notesToSubmit);
      setMessage({ type: 'success', text: response.data.message || "Notes enregistrées avec succès !" });
      reset();
      setTimeout(() => {
        navigate('/notes');
      }, 1200);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || "Erreur lors de l'enregistrement." });
      console.error(error);
    }
  };

  const inputStyle = `w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`;
  const labelStyle = "flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1";
  const errorStyle = "text-red-500 text-xs mt-1 italic";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 sm:p-6 md:p-8 max-w-5xl mx-auto my-10 border border-gray-200 dark:border-gray-800">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Sélection des champs communs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <label className={labelStyle}><GraduationCap size={16} />Classe</label>
            <select {...register("classeId", { required: "La classe est requise" })} className={inputStyle}>
              <option value="">Sélectionner une classe</option>
                {classes.map(c => (
                  <option key={c._id || c.nom} value={c._id}>{c.nom}</option>
                ))}
            </select>
            {errors.classeId && <p className={errorStyle}>{errors.classeId.message}</p>}
          </div>

          <div>
            <label className={labelStyle}><Book size={16} />Matière</label>
            <select {...register("matiereId", { required: "La matière est requise" })} className={inputStyle}>
              <option value="">Sélectionner une matière</option>
              {matieres.map(m => <option key={m._id} value={m._id}>{m.nom}</option>)}
            </select>
            {errors.matiereId && <p className={errorStyle}>{errors.matiereId.message}</p>}
          </div>

          <div>
            <label className={labelStyle}><GraduationCap size={16} />Enseignant</label>
            <select {...register("enseignantId", { required: "L'enseignant est requis" })} className={inputStyle}>
              <option value="">Sélectionner un enseignant</option>
              {enseignants.map(e => (
                <option key={e._id || e.id || e.nom} value={e._id || e.id}>
                  {e.nom} {e.prenom ? e.prenom : ''}
                </option>
              ))}
            </select>
            {errors.enseignantId && <p className={errorStyle}>{errors.enseignantId.message}</p>}
          </div>

          <div>
            <label className={labelStyle}><Layers size={16} />Trimestre</label>
            <select {...register("trimestre", { required: "Le trimestre est requis" })} className={inputStyle}>
              <option value="">Sélectionner un trimestre</option>
              {trimestres.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.trimestre && <p className={errorStyle}>{errors.trimestre.message}</p>}
          </div>

          <div>
            <label className={labelStyle}><Layers size={16} />Séquence</label>
            <select {...register("sequence", { required: "La séquence est requise" })} className={inputStyle}>
              <option value="">Sélectionner une séquence</option>
              {sequences.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.sequence && <p className={errorStyle}>{errors.sequence.message}</p>}
          </div>

          <div>
            <label className={labelStyle}><GraduationCap size={16} />Année scolaire</label>
            <select {...register("anneeScolaireId", { required: "L'année est requise" })} className={inputStyle}>
              <option value="">Sélectionner une année</option>
              {annes.map(a => <option key={a._id} value={a._id}>{a.libelle}</option>)}
            </select>
            {errors.anneeScolaireId && <p className={errorStyle}>{errors.anneeScolaireId.message}</p>}
          </div>
        </div>

        {/* Tableau de saisie des notes */}
        <div className="overflow-x-auto mt-8">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <span className="flex items-center gap-2"><User size={14} /> Élève</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Matricule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <span className="flex items-center gap-2"><Award size={14} /> Note (sur 20)</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {fields.length > 0 ? fields.map((field, index) => (
                <tr key={field.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{field.nomComplet}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{field.matricule || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      step="0.01"
                      {...register(`notes.${index}.valeur`, {
                        required: "Requis",
                        min: { value: 0, message: ">= 0" },
                        max: { value: 20, message: "<= 20" },
                      })}
                      className="w-24 p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-center"
                      value={watchedNotes?.[index]?.valeur ?? ''}
                    />
                    {errors.notes?.[index]?.valeur && (
                      <p className={errorStyle}>{errors.notes[index].valeur?.message}</p>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Sélectionnez une classe pour afficher les élèves.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Messages de succès ou d'erreur */}
        {message && (
          <div className={`flex items-center gap-2 p-4 rounded-lg font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
          }`}>
            {message.type === "success" ? <CircleCheck size={20} /> : <CircleAlert size={20} />}
            {message.text}
          </div>
        )}

        {/* Bouton de soumission */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          { "Enregistrer toutes les notes"}
        </button>
      </form>
    </div>
  );
};

export default NoteFormTable;
