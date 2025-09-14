import React from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock } from 'lucide-react';

// Interface pour le formulaire de connexion
export interface LoginFormInputs {
    email: string;
    password?: string;
}

const LoginForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<LoginFormInputs>();

    const onSubmit = (data) => {
        console.log("Données de connexion soumises :", data);
        // Ici, tu peux envoyer les données à ton API pour authentification
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
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 max-w-md mx-auto my-10 border border-gray-200 dark:border-gray-800">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
                Connexion
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                    Se connecter
                </button>
            </form>
        </div>
    );
};

export default LoginForm;