import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  Cake,
  MapPin,
  CheckCircle,
  Image as ImageIcon,
  GraduationCap,
  UserPlus,
  Calendar,
  XCircle
} from "lucide-react";
import classeService from "../../services/classeService";
import anneeService from "../../services/anneeService";
import eleveService from "../../services/eleveService";
import { notifySuccess } from "../toastService";

const EleveForm = ({ onSuccess }) => {
  const [classes, setClasses] = useState([]);
  const [annes, setAnnes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const labelStyle = "flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2";
  const inputStyle = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all";
  const errorStyle = "text-red-500 text-sm mt-1";

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  const photoWatch = watch("photo");

  // Aperçu photo
  useEffect(() => {
    if (photoWatch && photoWatch.length > 0) {
      setPreviewPhoto(URL.createObjectURL(photoWatch[0]));
    }
  }, [photoWatch]);

  // Récupérer classes et années scolaires
  useEffect(() => {
    async function fetchData() {
      const classesData = await classeService.getAll();
      const anneeData = await anneeService.getAll();
      setClasses(classesData);
      setAnnes(anneeData);
    }
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("nom", data.nom);
      formData.append("prenom", data.prenom);
      formData.append("classeId", data.classeId);
      formData.append("anneeScolaireId", data.anneeScolaireId);
      formData.append("dateNaissance", data.dateNaissance || "");
      formData.append("lieuNaissance", data.lieuNaissance || "");
      formData.append("sexe", data.sexe);
      formData.append("montantPaye", data.montantPaye);
      if (data.photo && data.photo.length > 0) {
        formData.append("photo", data.photo[0]);
      }

      await eleveService.create(formData);

      notifySuccess("Élève inscrit avec succès");
      reset();
      setPreviewPhoto(null);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-0 max-w-3xl mx-auto my-10 border border-blue-100 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row items-center gap-4 px-8 pt-8 pb-4 border-b border-gray-200 dark:border-gray-700">
        <UserPlus className="w-12 h-12 text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded-full p-2" />
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-1">Inscription d'un élève</h2>
          <p className="text-gray-500 dark:text-gray-300 text-sm">Remplis soigneusement le formulaire ci-dessous</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}><User size={16} />Nom</label>
            <input {...register("nom", { required: "Le nom est requis" })} className={inputStyle} />
            {errors.nom && <p className={errorStyle}>{errors.nom.message}</p>}
          </div>
          <div>
            <label className={labelStyle}><User size={16} />Prénom</label>
            <input {...register("prenom", { required: "Le prénom est requis" })} className={inputStyle} />
            {errors.prenom && <p className={errorStyle}>{errors.prenom.message}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}><MapPin size={16} />Lieu de naissance</label>
            <input {...register("lieuNaissance")} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}><Cake size={16} />Date de naissance</label>
            <input type="date" {...register("dateNaissance")} className={inputStyle} />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div>
            <label className={labelStyle}><User size={16} />Sexe</label>
            <select {...register("sexe", { required: "Le sexe est requis" })} className={inputStyle}>
              <option value="">Sélectionner</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
            {errors.sexe && <p className={errorStyle}>{errors.sexe.message}</p>}
          </div>

          <div>
            <label className={labelStyle}><GraduationCap size={16} />Classe</label>
            <select {...register("classeId", { required: "La classe est requise" })} className={inputStyle}>
              <option value="">Sélectionner une classe</option>
              {classes.map(c => <option key={c._id} value={c._id}>{c.nom}</option>)}
            </select>
            {errors.classeId && <p className={errorStyle}>{errors.classeId.message}</p>}
          </div>

          <div>
            <label className={labelStyle}><Calendar size={16} />Année Scolaire</label>
            <select {...register("anneeScolaireId", { required: "L'année est requise" })} className={inputStyle}>
              <option value="">Sélectionner une année</option>
              {annes.map(a => <option key={a._id} value={a._id}>{a.libelle}</option>)}
            </select>
            {errors.anneeScolaireId && <p className={errorStyle}>{errors.anneeScolaireId.message}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}><CheckCircle size={16} />Montant payé</label>
            <input type="number" {...register("montantPaye", { required: "Le montant est requis" })} className={inputStyle} />
            {errors.montantPaye && <p className={errorStyle}>{errors.montantPaye.message}</p>}
          </div>
          <div>
            <label className={labelStyle}><ImageIcon size={16} />Photo</label>
            <input type="file" {...register("photo")} className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors" />
            {previewPhoto && <img src={previewPhoto} alt="preview" className="mt-2 w-32 h-32 object-cover rounded-md" />}
          </div>
        </div>


        <div className="flex justify-end gap-3 pt-4">
          <button type="reset" disabled={loading} className="flex items-center gap-2 px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all">
            <XCircle className="w-4 h-4" />Annuler
          </button>
          <button type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold shadow hover:from-blue-700 hover:to-purple-700 transition-all">
            {loading ? "Enregistrement..." : <><CheckCircle className="w-4 h-4" />Enregistrer l'élève</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EleveForm;
