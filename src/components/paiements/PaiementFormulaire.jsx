import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  User,
  Layers,
  Calendar,
  CreditCard
} from 'lucide-react';
import { Modal } from '../components/Modal'; // Assurez-vous d'avoir ce composant
import StudentSelector from './StudentSelector'; // Le composant de sélection d'élève


// Données fictives
const elevesFictifs = [
    { _id: "el1", nom: "Dupont", prenom: "Jean", matricule: "M12345", classeId: "classe1" },
    { _id: "el2", nom: "Martin", prenom: "Léa", matricule: "M12346", classeId: "classe1" },
    { _id: "el3", nom: "Dubois", prenom: "Marie", matricule: "M12347", classeId: "classe2" },
];
const classesFictives = [
    { id: "classe1", nom: "6ème A" },
    { id: "classe2", nom: "5ème B" },
];
const anneesScolaires = [
    { id: "annee1", nom: "2024-2025" },
    { id: "annee2", nom: "2025-2026" },
];
const methodesPaiement = ["Espèces", "Mobile Money", "Virement bancaire", "Chèque"];

const PaiementForm= () => {
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        watch
    } = useForm();

    // Surveille la classe sélectionnée pour la pré-remplir
    const watchedClasseId = watch("classeId");

    const handleSelectStudent = (eleve) => {
        setSelectedStudent(eleve);
        setValue('eleveId', eleve._id, { shouldValidate: true });
        setValue('classeId', eleve.classeId, { shouldValidate: true }); // Pré-remplit la classe
        setIsStudentModalOpen(false);
    };

    const onSubmit = (data) => {
        console.log("Données de paiement soumises :", data);
        reset();
        setSelectedStudent(null);
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
                Enregistrer un paiement
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* L'élève et la classe */}
                <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                        <label className={labelStyle}><User size={16} />Élève</label>
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
                        <label htmlFor="classeId" className={labelStyle}><Layers size={16} />Classe</label>
                        <select
                            id="classeId"
                            {...register("classeId", { required: "La classe est requise" })}
                            className={inputStyle}
                        >
                            <option value="">Sélectionner une classe</option>
                            {classesFictives.map(classe => (
                                <option key={classe.id} value={classe.id}>{classe.nom}</option>
                            ))}
                        </select>
                        {errors.classeId && <p className={errorStyle}>{errors.classeId.message}</p>}
                    </div>
                </div>

                {/* Montant et Année scolaire */}
                <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="montantPaye" className={labelStyle}>Montant payé (GNF)</label>
                        <input
                            id="montantPaye"
                            type="number"
                            step="0.01"
                            {...register("montantPaye", {
                                required: "Le montant est requis",
                                min: { value: 0, message: "Le montant doit être positif" },
                                valueAsNumber: true,
                            })}
                            className={inputStyle}
                        />
                        {errors.montantPaye && <p className={errorStyle}>{errors.montantPaye.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="anneeScolaireId" className={labelStyle}><Calendar size={16} />Année scolaire</label>
                        <select
                            id="anneeScolaireId"
                            {...register("anneeScolaireId", { required: "L'année scolaire est requise" })}
                            className={inputStyle}
                        >
                            <option value="">Sélectionner une année</option>
                            {anneesScolaires.map(annee => (
                                <option key={annee.id} value={annee.id}>{annee.nom}</option>
                            ))}
                        </select>
                        {errors.anneeScolaireId && <p className={errorStyle}>{errors.anneeScolaireId.message}</p>}
                    </div>
                </div>

                {/* Date et Méthode de paiement */}
                <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="datePaiement" className={labelStyle}><Calendar size={16} />Date du paiement</label>
                        <input
                            id="datePaiement"
                            type="date"
                            {...register("datePaiement", { required: "La date est requise" })}
                            className={inputStyle}
                        />
                        {errors.datePaiement && <p className={errorStyle}>{errors.datePaiement.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="methode" className={labelStyle}><CreditCard size={16} />Méthode de paiement</label>
                        <select
                            id="methode"
                            {...register("methode")}
                            className={inputStyle}
                        >
                            <option value="">Sélectionner une méthode</option>
                            {methodesPaiement.map(methode => (
                                <option key={methode} value={methode}>{methode}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                {/* Bouton de soumission */}
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                >
                    Enregistrer le paiement
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

export default PaiementForm;