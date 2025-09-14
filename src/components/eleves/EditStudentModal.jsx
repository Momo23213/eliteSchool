import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  Cake,
  MapPin,
  CheckCircle,
  Image as ImageIcon,
  GraduationCap,
  UserCog,
  Calendar,
  XCircle
} from "lucide-react";
import  classeService  from "../../services/classeService";
import  anneeService  from "../../services/anneeService";
import  eleveService  from "../../services/eleveService";
import { notifySuccess } from "../toastService";



const EditStudentForm = ({ eleve, onSuccess }) => {
  const [classes, setClasses] = useState([]);
  const [annes, setAnnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewPhoto, setPreviewPhoto] = useState(eleve.photo);

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    defaultValues: {
      nom: eleve.nom,
      prenom: eleve.prenom,
      sexe: eleve.sexe,
      dateNaissance: eleve.dateNaissance?.split("T")[0],
      lieuNaissance: eleve.lieuNaissance,
      classeId: eleve.classeId?._id || "",
      anneeScolaireId: eleve.anneeScolaireId || "",
      statut: eleve.statut
    }
  });

  const photoWatch = watch("photo");

  useEffect(() => {
    if (photoWatch && photoWatch.length > 0) {
      const file = photoWatch[0];
      setPreviewPhoto(URL.createObjectURL(file));
    }
  }, [photoWatch]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const classesData = await classeService.getAll();
      const anneeData = await anneeService.getAll();
      setClasses(classesData);
      setAnnes(anneeData);
      setLoading(false);
    }
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "photo" && value) {
          if ((value ).length > 0) {
            formData.append(key, (value )[0]);
          }
        } else if (value !== undefined) {
          formData.append(key, value );
        }
      });

      await eleveService.update(eleve._id, formData);
      notifySuccess("✅ Modification réussie !");
      onSuccess?.();
    } catch (error) {
      console.error(error);
    }
  };

  const inputStyle = `w-full p-3 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white
    border border-gray-300 dark:border-gray-700
    focus:outline-none focus:ring-2 focus:ring-blue-500
    transition-all duration-200`;

  const labelStyle = "flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1";
  const errorStyle = "text-red-500 text-xs mt-1 italic";

  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-0 max-w-2xl mx-auto my-10 border border-green-100 dark:border-gray-700">
      {/* Header visuel */}
      <div className="flex items-center gap-4 px-8 pt-8 pb-4 border-b border-gray-200 dark:border-gray-700">
        <UserCog className="w-10 h-10 text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 rounded-full p-2" />
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-1">Modifier l'élève</h2>
          <p className="text-gray-500 dark:text-gray-300 text-sm">Ajuste les informations puis valide la modification</p>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nom" className={labelStyle}><User size={16} />Nom</label>
            <input id="nom" {...register("nom", { required: "Le nom est requis" })} className={inputStyle} />
            {errors.nom && <p className={errorStyle}>{errors.nom.message}</p>}
          </div>
          <div>
            <label htmlFor="prenom" className={labelStyle}><User size={16} />Prénom</label>
            <input id="prenom" {...register("prenom", { required: "Le prénom est requis" })} className={inputStyle} />
            {errors.prenom && <p className={errorStyle}>{errors.prenom.message}</p>}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="lieuNaissance" className={labelStyle}><MapPin size={16} />Lieu de naissance</label>
            <input id="lieuNaissance" {...register("lieuNaissance")} className={inputStyle} />
          </div>
          <div>
            <label htmlFor="dateNaissance" className={labelStyle}><Cake size={16} />Date de naissance</label>
            <input id="dateNaissance" type="date" {...register("dateNaissance")} className={inputStyle} />
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          <div>
            <label htmlFor="sexe" className={labelStyle}><User size={16} />Sexe</label>
            <select id="sexe" {...register("sexe", { required: "Le sexe est requis" })} className={inputStyle}>
              <option value="">Sélectionner</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
            {errors.sexe && <p className={errorStyle}>{errors.sexe.message}</p>}
          </div>
          <div>
            <label htmlFor="classeId" className={labelStyle}><GraduationCap size={16} />Classe</label>
            <select id="classeId" {...register("classeId", { required: "La classe est requise" })} className={inputStyle}>
              <option value="">Sélectionner une classe</option>
              {classes.map(c => <option key={c._id} value={c._id}>{c.nom}</option>)}
            </select>
            {errors.classeId && <p className={errorStyle}>{errors.classeId.message}</p>}
          </div>
          <div>
            <label htmlFor="anneeScolaireId" className={labelStyle}><Calendar size={16} />Année Scolaire</label>
            <select id="anneeScolaireId" {...register("anneeScolaireId", { required: "L'année est requise" })} className={inputStyle}>
              <option value="">Sélectionner une année</option>
              {annes.map(a => <option key={a._id} value={a._id}>{a.libelle}</option>)}
            </select>
            {errors.anneeScolaireId && <p className={errorStyle}>{errors.anneeScolaireId.message}</p>}
          </div>
        </div>
        <div>
          <label className={labelStyle}><CheckCircle size={16} />Statut</label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center">
              <input type="radio" value="inscrit" {...register("statut", { required: "Le statut est requis" })} className="form-radio text-blue-600" />
              <span className="ml-2">Inscrit</span>
            </label>
            <label className="flex items-center">
              <input type="radio" value="reinscrit" {...register("statut")} className="form-radio text-blue-600" />
              <span className="ml-2">Réinscrit</span>
            </label>
          </div>
          {errors.statut && <p className={errorStyle}>{errors.statut.message}</p>}
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="photo" className={labelStyle}><ImageIcon size={16} />Photo</label>
            <input type="file" {...register("photo")} className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-colors" />
            {previewPhoto && <img src={previewPhoto} alt="preview" className="mt-2 w-32 h-32 object-cover rounded-md" />}
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button type="reset" className="flex items-center gap-2 px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"><XCircle className="w-4 h-4" />Annuler</button>
          <button type="submit" className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-bold shadow hover:from-green-700 hover:to-blue-700 transition-all"><CheckCircle className="w-4 h-4" />Modifier l'élève</button>
        </div>
      </form>
    </div>
  );
};

export default EditStudentForm;
