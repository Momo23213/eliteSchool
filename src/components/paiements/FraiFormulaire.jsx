import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {  GraduationCap } from 'lucide-react';
import  anneeService  from '../../services/anneeService';
import  fraiService  from '../../services/fraisScolaire';
import { notifySuccess } from '../toastService';
import  classeService  from '../../services/classeService';


const FraisScolariteForm = () => {
      const [classes, setClasses] = useState([]);
      const [annes, setAnnes] = useState([]);
      const [loading, setLoading] = useState(true);
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


    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        reset
    } = useForm({
        defaultValues: {
            montantTotal: 0
        }
    });

    // Surveiller les valeurs des tranches pour calculer le total
    const [tranche1, tranche2, tranche3] = watch(["tranche1", "tranche2", "tranche3"]);

    useEffect(() => {
        const total = Number(tranche1) + Number(tranche2) + Number(tranche3);
        setValue('montantTotal', total);
    }, [tranche1, tranche2, tranche3, setValue]);

    const onSubmit =async (data) => {
        try {
            await fraiService.ajouter(data)
             notifySuccess("✅ Une nouvelle ajouter avec succès !");
             console.log("Données de frais de scolarité soumises :", data);
             reset();
        } catch (error) {
            console.log(error);
            
        }
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Section de sélection */}
                <div className="grid sm:grid-cols-2 gap-6">
                    {/* Section de sélection */}
                    <div>
                        <label htmlFor="classeId" className={labelStyle}><GraduationCap size={16} />Classe</label>
                            <select id="classeId" {...register("classeId", { required: "La classe est requise" })} className={inputStyle}>
                                  <option value="">Sélectionner une classe</option>
                                  {classes.map(c => <option key={c._id} value={c._id}>{c.nom}</option>)}
                            </select>
                                {errors.classeId && <p className={errorStyle}>{errors.classeId.message}</p>}
                    </div>
                    <div>
                                <label htmlFor="anneeScolaireId" className={labelStyle}><GraduationCap size={16} />Année Scolaire</label>
                                <select id="anneeScolaireId" {...register("anneeScolaireId", { required: "L'année est requise" })} className={inputStyle}>
                                  <option value="">Sélectionner une année</option>
                                  {annes.map(a => <option key={a._id} value={a._id}>{a.libelle}</option>)}
                                </select>
                                {errors.anneeScolaireId && <p className={errorStyle}>{errors.anneeScolaireId.message}</p>}
                              </div>

                    
                </div>

                {/* Section des montants */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="inscription" className={labelStyle}>Frais d'inscription (GNF)</label>
                        <input
                            id="inscription"
                            type="number"
                            step="0.01"
                            {...register("inscription", { 
                                required: "Requis",
                                min: { value: 0, message: "Le montant doit être positif" },
                                valueAsNumber: true // Convertit la chaîne en nombre
                            })}
                            className={inputStyle}
                        />
                        {errors.inscription && <p className={errorStyle}>{errors.inscription.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="reinscription" className={labelStyle}>Frais de réinscription (GNF)</label>
                        <input
                            id="reinscription"
                            type="number"
                            step="0.01"
                            {...register("reinscription", {
                                required: "Requis",
                                min: { value: 0, message: "Le montant doit être positif" },
                                valueAsNumber: true // Convertit la chaîne en nombre
                            })}
                            className={inputStyle}
                        />
                        {errors.reinscription && <p className={errorStyle}>{errors.reinscription.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="tranche1" className={labelStyle}>Tranche 1 (GNF)</label>
                        <input
                            id="tranche1"
                            type="number"
                            step="0.01"
                            {...register("tranche1", { 
                                required: "Requis",
                                min: { value: 0, message: "Le montant doit être positif" },
                                valueAsNumber: true // Convertit la chaîne en nombre
                            })}
                            className={inputStyle}
                        />
                        {errors.tranche1 && <p className={errorStyle}>{errors.tranche1.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="tranche2" className={labelStyle}>Tranche 2 (GNF)</label>
                        <input
                            id="tranche2"
                            type="number"
                            step="0.01"
                            {...register("tranche2", { 
                                required: "Requis",
                                min: { value: 0, message: "Le montant doit être positif" },
                                valueAsNumber: true // Convertit la chaîne en nombre
                            })}
                            className={inputStyle}
                        />
                        {errors.tranche2 && <p className={errorStyle}>{errors.tranche2.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="tranche3" className={labelStyle}>Tranche 3 (GNF)</label>
                        <input
                            id="tranche3"
                            type="number"
                            step="0.01"
                            {...register("tranche3", { 
                                required: "Requis",
                                min: { value: 0, message: "Le montant doit être positif" },
                                valueAsNumber: true // Convertit la chaîne en nombre
                            })}
                            className={inputStyle}
                        />
                        {errors.tranche3 && <p className={errorStyle}>{errors.tranche3.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="montantTotal" className={labelStyle}>Montant total (GNF)</label>
                        <input
                            id="montantTotal"
                            type="number"
                            readOnly
                            {...register("montantTotal")}
                            className={`${inputStyle} font-bold bg-gray-200 dark:bg-gray-700 cursor-not-allowed`}
                        />
                    </div>
                </div>

                {/* Bouton de soumission */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                    Enregistrer les frais
                </button>
            </form>
        </div>
    );
};

export default FraisScolariteForm;