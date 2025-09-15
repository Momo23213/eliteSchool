// src/components/NotesSaisie.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider, useFieldArray, useFormContext } from "react-hook-form";
import axios from "axios";
import { useSchool } from "../../context/SchoolContext";
import { User, Book, GraduationCap, Layers, Award, CircleCheck, CircleAlert } from "lucide-react";

const API_URL = "https://schoolelite.onrender.com/api/notes/tableau";

const NoteFormTable = () => {
  const { eleves, fetchElevesByClasse, loading } = useSchool();
  const { control, register, watch, formState: { errors } } = useFormContext();
  const { fields, replace } = useFieldArray({ control, name: "notes" });
  const watchedClasseId = watch("classeId");

  useEffect(() => {
    if (!watchedClasseId) {
      replace([]);
      return;
    }
    fetchElevesByClasse(watchedClasseId);
  }, [watchedClasseId]);

  useEffect(() => {
    if (Array.isArray(eleves) && eleves.length > 0) {
      replace(
        eleves.map(eleve => ({
          eleveId: eleve._id,
          nomComplet: `${eleve.prenom} ${eleve.nom}`,
          matricule: eleve.matricule || "-",
          valeur: 0
        }))
      );
    } else {
      replace([]);
    }
  }, [eleves]);

  const watchedNotes = watch("notes");

  return (
    <div className="w-full">
      {/* Tableau desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nom Complet</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Matricule</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Note</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center gap-2 text-blue-600 dark:text-blue-300">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"/>
                    </svg>
                    Chargement des élèves...
                  </div>
                </td>
              </tr>
            ) : fields.length > 0 ? (
              fields.map((field, index) => (
                <tr key={field.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{field.nomComplet}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{field.matricule || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={field.valeur}
                      {...register(`notes.${index}.valeur`, { required: "Requis", min: { value:0, message:">= 0" }, max:{value:20,message:"<= 20"} })}
                      className="w-24 p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-center text-sm"
                    />
                    {errors.notes?.[index]?.valeur && <p className="mt-1 text-xs text-red-500">{errors.notes[index].valeur?.message}</p>}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Sélectionnez une classe pour afficher les élèves.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards mobile */}
      <div className="block md:hidden space-y-4">
        {loading ? (
          <div className="flex justify-center items-center gap-2 text-blue-600 dark:text-blue-300">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"/>
            </svg>
            Chargement des élèves...
          </div>
        ) : fields.length > 0 ? (
          fields.map((field, index) => (
            <div key={field.id} className="p-4 rounded-lg shadow bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{field.nomComplet}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Matricule : {field.matricule || "-"}</p>
              <div className="mt-2">
                <input
                  type="number"
                  step="0.01"
                  defaultValue={field.valeur}
                  {...register(`notes.${index}.valeur`, { required: "Requis", min: { value:0, message:">= 0" }, max:{value:20,message:"<= 20"} })}
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-center text-sm"
                />
                {errors.notes?.[index]?.valeur && <p className="mt-1 text-xs text-red-500">{errors.notes[index].valeur?.message}</p>}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">Sélectionnez une classe pour afficher les élèves.</p>
        )}
      </div>
    </div>
  );
};

const NotesSaisie = () => {
  const navigate = useNavigate();
  const { classes, matieres, annes, enseignants } = useSchool();
  const [message, setMessage] = useState(null);

  const methods = useForm({ defaultValues: { notes: [] } });
  const { handleSubmit, reset, register, watch, formState:{ errors } } = methods;

  const trimestres = ["1er trimestre","2ème trimestre","3ème trimestre"];
  const sequences = ["Séquence 1","Séquence 2","Séquence 3","Séquence 4","Séquence 5","Séquence 6"];

  const onSubmit = async (data) => {
    if (!data.classeId || !data.matiereId || !data.enseignantId || !data.trimestre || !data.sequence || !data.anneeScolaireId) {
      setMessage({ type:'error', text:"Veuillez remplir tous les champs obligatoires." });
      return;
    }

    const notesToSubmit = data.notes.map(note => ({
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
      setMessage({ type:'success', text: response.data.message || "Notes enregistrées avec succès !" });
      reset();
      setTimeout(()=>navigate('/notes'),1200);
    } catch (error) {
      setMessage({ type:'error', text: error.response?.data?.message || "Erreur lors de l'enregistrement." });
      console.error(error);
    }
  };

  const inputStyle = `w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`;
  const labelStyle = "flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="min-h-screen mt-10 w-full p-4 md:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-all duration-300">
      <h1 className="text-4xl mb-2.5 lg:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
        La saisie des notes
      </h1>
      <hr className="my-2.5"/>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Champs communs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <label className={labelStyle}><GraduationCap size={16}/>Classe</label>
              <select {...register("classeId",{ required:"La classe est requise" })} className={inputStyle}>
                <option value="">Sélectionner une classe</option>
                {classes.map(c=><option key={c._id} value={c._id}>{c.nom}</option>)}
              </select>
              {errors.classeId && <p className="text-red-500 text-xs mt-1 italic">{errors.classeId.message}</p>}
            </div>

            <div>
              <label className={labelStyle}><Book size={16}/>Matière</label>
              <select {...register("matiereId",{ required:"La matière est requise" })} className={inputStyle}>
                <option value="">Sélectionner une matière</option>
                {matieres.map(m=><option key={m._id} value={m._id}>{m.nom}</option>)}
              </select>
              {errors.matiereId && <p className="text-red-500 text-xs mt-1 italic">{errors.matiereId.message}</p>}
            </div>

            <div>
              <label className={labelStyle}><GraduationCap size={16}/>Enseignant</label>
              <select {...register("enseignantId",{ required:"L'enseignant est requis" })} className={inputStyle}>
                <option value="">Sélectionner un enseignant</option>
                {enseignants.map(e=><option key={e._id} value={e._id}>{e.nom} {e.prenom}</option>)}
              </select>
              {errors.enseignantId && <p className="text-red-500 text-xs mt-1 italic">{errors.enseignantId.message}</p>}
            </div>

            <div>
              <label className={labelStyle}><Layers size={16}/>Trimestre</label>
              <select {...register("trimestre",{ required:"Le trimestre est requis" })} className={inputStyle}>
                <option value="">Sélectionner un trimestre</option>
                {trimestres.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
              {errors.trimestre && <p className="text-red-500 text-xs mt-1 italic">{errors.trimestre.message}</p>}
            </div>

            <div>
              <label className={labelStyle}><Layers size={16}/>Séquence</label>
              <select {...register("sequence",{ required:"La séquence est requise" })} className={inputStyle}>
                <option value="">Sélectionner une séquence</option>
                {sequences.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
              {errors.sequence && <p className="text-red-500 text-xs mt-1 italic">{errors.sequence.message}</p>}
            </div>

            <div>
              <label className={labelStyle}><GraduationCap size={16}/>Année scolaire</label>
              <select {...register("anneeScolaireId",{ required:"L'année est requise" })} className={inputStyle}>
                <option value="">Sélectionner une année</option>
                {annes.map(a=><option key={a._id} value={a._id}>{a.libelle}</option>)}
              </select>
              {errors.anneeScolaireId && <p className="text-red-500 text-xs mt-1 italic">{errors.anneeScolaireId.message}</p>}
            </div>
          </div>

          {/* Tableau / cards */}
          <NoteFormTable />

          {/* Message */}
          {message && (
            <div className={`flex items-center gap-2 p-4 rounded-lg font-medium ${message.type==='success' ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300":"bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"}`}>
              {message.type==='success' ? <CircleCheck size={20}/> : <CircleAlert size={20}/>}
              {message.text}
            </div>
          )}

          {/* Bouton */}
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            Enregistrer toutes les notes
          </button>
        </form>
      </FormProvider>
    </div>
  );
};

export default NotesSaisie;
