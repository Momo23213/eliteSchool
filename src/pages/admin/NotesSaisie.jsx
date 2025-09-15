// src/components/NotesSaisie.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider, useFieldArray, useFormContext } from "react-hook-form";
import axios from "axios";
import { useSchool } from "../../context/SchoolContext";
import { User, Book, GraduationCap, Layers, Award, CircleCheck, CircleAlert } from "lucide-react";
import "../../styles/animations.css";

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
          matricule: eleve.matricule || eleve.numeroMatricule || "-",
          photo: eleve.photo || eleve.image || null,
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
      <div className="hidden md:block overflow-x-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 animate-fade-in-delay-1">
        <table className="min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50">
          <thead className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Nom Complet</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Matricule</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Note</th>
            </tr>
          </thead>
          <tbody className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm divide-y divide-gray-200/30 dark:divide-gray-700/30">
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
                <tr key={field.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all duration-300 animate-card-delay" style={{animationDelay: `${index * 0.05}s`}}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {field.photo ? (
                          <img className="h-10 w-10 rounded-full object-cover border-2 border-blue-200 dark:border-blue-800" src={field.photo} alt={field.nomComplet} />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{field.nomComplet}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{field.matricule}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={field.valeur}
                      {...register(`notes.${index}.valeur`, { required: "Requis", min: { value:0, message:">= 0" }, max:{value:20,message:"<= 20"} })}
                      className="w-24 p-3 rounded-xl border border-gray-300/50 dark:border-gray-600/50 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-center text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:shadow-lg"
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
      <div className="block md:hidden space-y-6">
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
            <div key={field.id} className="p-6 rounded-2xl shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-card-delay hover-lift" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 mr-3 animate-scale-in">
                  {field.photo ? (
                    <img className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 dark:border-blue-800 shadow-md" src={field.photo} alt={field.nomComplet} />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{field.nomComplet}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Matricule : {field.matricule}</p>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Note (/20)</label>
                <input
                  type="number"
                  step="0.01"
                  defaultValue={field.valeur}
                  {...register(`notes.${index}.valeur`, { required: "Requis", min: { value:0, message:">= 0" }, max:{value:20,message:"<= 20"} })}
                  className="w-full p-3 rounded-xl border border-gray-300/50 dark:border-gray-600/50 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm text-center text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:shadow-lg"
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

  const inputStyle = `w-full p-3 rounded-xl border border-gray-300/50 dark:border-gray-600/50 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:shadow-lg`;
  const labelStyle = "flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2";

  return (
    <div className="min-h-screen mt-10 w-full p-4 md:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-all duration-300">
      <header className="mb-8 animate-slide-down">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl mr-4 shadow-lg animate-float">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Saisie des Notes
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
              Enregistrez les notes de vos élèves par classe et matière.
            </p>
          </div>
        </div>
      </header>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Champs communs */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 animate-fade-in-delay-1">
            <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
              <Layers className="w-5 h-5 mr-2 text-blue-600" />
              Informations de la saisie
            </h2>
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
          </div>

          {/* Tableau / cards */}
          <div className="animate-fade-in-delay-2">
            <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
              <User className="w-5 h-5 mr-2 text-purple-600" />
              Liste des élèves
            </h2>
            <NoteFormTable />
          </div>

          {/* Message */}
          {message && (
            <div className={`flex items-center gap-3 p-6 rounded-2xl font-medium shadow-lg animate-scale-in ${message.type==='success' ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900 dark:to-emerald-900 dark:text-green-300 border border-green-200 dark:border-green-800":"bg-gradient-to-r from-red-100 to-pink-100 text-red-700 dark:from-red-900 dark:to-pink-900 dark:text-red-300 border border-red-200 dark:border-red-800"}`}>
              {message.type==='success' ? <CircleCheck size={24}/> : <CircleAlert size={24}/>}
              <span className="text-lg">{message.text}</span>
            </div>
          )}

          {/* Bouton */}
          <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover-lift animate-pulse-soft">
            <div className="flex items-center justify-center gap-3">
              <Award className="w-6 h-6" />
              <span className="text-lg">Enregistrer toutes les notes</span>
            </div>
          </button>
        </form>
      </FormProvider>
    </div>
  );
};

export default NotesSaisie;
