import React from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, Book, Layers, Save } from 'lucide-react';
// Données fictives pour les menus déroulants
const matieresFictives = [
    { id: "mat1", nom: "Mathématiques" },
    { id: "mat2", nom: "Français" },
    { id: "mat3", nom: "Histoire-Géographie" },
    { id: "mat4", nom: "Physique-Chimie" },
    { id: "mat5", nom: "Informatique" },
];
const classesFictives = [
    { id: "classe1", nom: "6ème A" },
    { id: "classe2", nom: "5ème B" },
    { id: "classe3", nom: "4ème C" },
    { id: "classe4", nom: "Terminale D" },
];

const EnseignantForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const onSubmit= (data) => {
        console.log("Données de l'enseignant soumises :", data);
        // Envoyer les données à l'API pour créer ou mettre à jour l'enseignant
        reset();
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
                Ajouter un enseignant
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Nom et Prénom */}
                <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="nom" className={labelStyle}><User size={16} />Nom</label>
                        <input
                            id="nom"
                            type="text"
                            {...register("nom", { required: "Le nom est requis" })}
                            className={inputStyle}
                        />
                        {errors.nom && <p className={errorStyle}>{errors.nom.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="prenom" className={labelStyle}><User size={16} />Prénom</label>
                        <input
                            id="prenom"
                            type="text"
                            {...register("prenom", { required: "Le prénom est requis" })}
                            className={inputStyle}
                        />
                        {errors.prenom && <p className={errorStyle}>{errors.prenom.message}</p>}
                    </div>
                </div>

                {/* Email et Téléphone */}
                <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="email" className={labelStyle}><Mail size={16} />Email</label>
                        <input
                            id="email"
                            type="email"
                            {...register("email")}
                            className={inputStyle}
                        />
                    </div>
                    <div>
                        <label htmlFor="telephone" className={labelStyle}><Phone size={16} />Téléphone</label>
                        <input
                            id="telephone"
                            type="tel"
                            {...register("telephone")}
                            className={inputStyle}
                        />
                    </div>
                </div>

                {/* Matières et Classes */}
                <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="matieres" className={labelStyle}><Book size={16} />Matières enseignées</label>
                        <select
                            id="matieres"
                            multiple
                            {...register("matieres", { required: "Veuillez sélectionner au moins une matière" })}
                            className={`${inputStyle} h-32`}
                        >
                            {matieresFictives.map(matiere => (
                                <option key={matiere.id} value={matiere.id}>{matiere.nom}</option>
                            ))}
                        </select>
                        {errors.matieres && <p className={errorStyle}>{errors.matieres.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="classes" className={labelStyle}><Layers size={16} />Classes attribuées</label>
                        <select
                            id="classes"
                            multiple
                            {...register("classes", { required: "Veuillez sélectionner au moins une classe" })}
                            className={`${inputStyle} h-32`}
                        >
                            {classesFictives.map(classe => (
                                <option key={classe.id} value={classe.id}>{classe.nom}</option>
                            ))}
                        </select>
                        {errors.classes && <p className={errorStyle}>{errors.classes.message}</p>}
                    </div>
                </div>
                
                {/* Bouton de soumission */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                    <div className="flex items-center justify-center gap-2">
                        <Save size={20} />
                        Enregistrer l'enseignant
                    </div>
                </button>
            </form>
        </div>
    );
};

export default EnseignantForm;