import React from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User as UserIcon, Briefcase, ChevronDown } from 'lucide-react';


const RegisterForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const onSubmit = (data) => {
        console.log("Données d'inscription soumises :", data);
        // Ici, tu peux envoyer les données à ton API pour créer l'utilisateur
        reset();
    };

    const inputStyle = `
        w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white
        border border-gray-300 dark:border-gray-700
        focus:outline-none focus:ring-2 focus:ring-purple-500
        transition-all duration-200
    `;
    const labelStyle = "flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1";
    const errorStyle = "text-red-500 text-xs mt-1 italic";

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 max-w-md mx-auto my-10 border border-gray-200 dark:border-gray-800">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
                Inscription
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label htmlFor="nom" className={labelStyle}><UserIcon size={16} />Nom</label>
                    <input
                        id="nom"
                        type="text"
                        {...register("nom", { required: "Le nom est requis" })}
                        className={inputStyle}
                    />
                    {errors.nom && <p className={errorStyle}>{errors.nom.message}</p>}
                </div>
                <div>
                    <label htmlFor="prenom" className={labelStyle}><UserIcon size={16} />Prénom</label>
                    <input
                        id="prenom"
                        type="text"
                        {...register("prenom", { required: "Le prénom est requis" })}
                        className={inputStyle}
                    />
                    {errors.prenom && <p className={errorStyle}>{errors.prenom.message}</p>}
                </div>
                <div>
                    <label htmlFor="email" className={labelStyle}><Mail size={16} />Email</label>
                    <input
                        id="email"
                        type="email"
                        {...register("email", { required: "L'email est requis" })}
                        className={inputStyle}
                    />
                    {errors.email && <p className={errorStyle}>{errors.email.message}</p>}
                </div>
                <div>
                    <label htmlFor="role" className={labelStyle}><Briefcase size={16} />Rôle</label>
                    <div className="relative">
                        <select
                            id="role"
                            {...register("role", { required: "Le rôle est requis" })}
                            className={`${inputStyle} appearance-none`}
                        >
                            <option value="">Sélectionner un rôle</option>
                            <option value="admin">Admin</option>
                            <option value="professeur">Professeur</option>
                            <option value="eleve">Élève</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                    {errors.role && <p className={errorStyle}>{errors.role.message}</p>}
                </div>
                <div>
                    <label htmlFor="password" className={labelStyle}><Lock size={16} />Mot de passe</label>
                    <input
                        id="password"
                        type="password"
                        {...register("password", { required: "Le mot de passe est requis" })}
                        className={inputStyle}
                    />
                    {errors.password && <p className={errorStyle}>{errors.password.message}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200"
                >
                    S'inscrire
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;