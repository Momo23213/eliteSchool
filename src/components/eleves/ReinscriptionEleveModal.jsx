import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import  classeService  from "../../services/classeService";
import  anneeService  from "../../services/anneeService";
import  eleveService  from "../../services/eleveService";
import { notifySuccess } from "../toastService";
import { RefreshCw, UserCheck, Calendar, Image, CheckCircle, XCircle } from "lucide-react";



const ReinscriptionEleveModal = ({ eleve, onSuccess, onClose }) => {
  const [classes, setClasses] = useState([]);
  const [annes, setAnnes] = useState([]);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

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
      formData.append("eleveId", eleve._id);
      formData.append("nouvelleClasseId", data.nouvelleClasseId);
      formData.append("nouvelleAnneeScolaireId", data.nouvelleAnneeScolaireId);
      formData.append("montantPaye", data.montantPaye);
      formData.append("typeInscription", "reinscrit");
      if (data.photo && data.photo.length > 0) {
        formData.append("photo", data.photo[0]);
      }
      await eleveService.reinscrire(formData);
      notifySuccess("✅ Réinscription réussie !");
      reset();
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-40 z-50">
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-0 max-w-xl w-full border border-blue-100 dark:border-gray-700">
        {/* Header visuel */}
        <div className="flex items-center gap-4 px-8 pt-8 pb-4 border-b border-gray-200 dark:border-gray-700">
          <RefreshCw className="w-10 h-10 text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded-full p-2" />
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-1">Réinscription</h2>
            <p className="text-gray-500 dark:text-gray-300 text-sm">{eleve.nom} {eleve.prenom} - <span className="font-semibold">{eleve.matricule}</span></p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"><UserCheck className="w-4 h-4" />Nouvelle classe</label>
              <select {...register("nouvelleClasseId", { required: true })} className="w-full p-3 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                <option value="">Sélectionner</option>
                {classes.map((classe) => (
                  <option key={classe._id} value={classe._id}>{classe.nom} ({classe.niveau})</option>
                ))}
              </select>
              {errors.nouvelleClasseId && <span className="text-red-500 text-xs mt-1 italic">Ce champ est requis</span>}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"><Calendar className="w-4 h-4" />Nouvelle année scolaire</label>
              <select {...register("nouvelleAnneeScolaireId", { required: true })} className="w-full p-3 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all">
                <option value="">Sélectionner</option>
                {annes.map((annee) => (
                  <option key={annee._id} value={annee._id}>{annee.libelle}</option>
                ))}
              </select>
              {errors.nouvelleAnneeScolaireId && <span className="text-red-500 text-xs mt-1 italic">Ce champ est requis</span>}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"><CheckCircle className="w-4 h-4" />Montant payé</label>
              <input type="number" {...register("montantPaye", { required: true, min: 0 })} className="w-full p-3 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" />
              {errors.montantPaye && <span className="text-red-500 text-xs mt-1 italic">Ce champ est requis</span>}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"><Image className="w-4 h-4" />Photo (optionnel)</label>
              <input type="file" accept="image/*" {...register("photo")} className="w-full p-3 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex items-center gap-2 px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"><XCircle className="w-4 h-4" />Annuler</button>
            <button type="submit" className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold shadow hover:from-blue-700 hover:to-purple-700 transition-all"><CheckCircle className="w-4 h-4" />Réinscrire</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReinscriptionEleveModal;
