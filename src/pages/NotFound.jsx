import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, AlertTriangle, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const getHomeRoute = () => {
    if (!user) return '/';
    
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'enseignant':
        return '/enseignant/dashboard';
      case 'eleve':
        return '/eleve/dashboard';
      default:
        return '/';
    }
  };

  return (
    <div className="min-h-screen mt-15 md:mt-11 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animation container */}
        <div className="relative mb-8">
          {/* Floating elements */}
          <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute -top-8 -right-8 w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-pink-200 dark:bg-pink-800 rounded-full opacity-25 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          
          {/* Main icon */}
          <div className="relative z-10 flex justify-center mb-6">
            <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl animate-pulse">
              <AlertTriangle className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>

        {/* Error code */}
        <div className="mb-6">
          <h1 className="text-8xl md:text-9xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
            404
          </h1>
        </div>

        {/* Error message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Page Introuvable
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
            Oups ! La page que vous recherchez semble avoir disparu dans les méandres d'EliteSchool.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Il se peut que l'URL soit incorrecte ou que la page ait été déplacée.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link
            to={getHomeRoute()}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </Link>
          
          <button
            onClick={handleGoBack}
            className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Page précédente
          </button>
        </div>

        {/* Search suggestion */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Search className="w-6 h-6 text-blue-500" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Suggestions
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <Link
              to="/eleves"
              className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
              Gestion des élèves
            </Link>
            
            <Link
              to="/classes"
              className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
              Gestion des classes
            </Link>
            
            <Link
              to="/paiements"
              className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <Search className="w-4 h-4" />
              Paiements
            </Link>
            
            <Link
              to="/notes"
              className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
            >
              <Search className="w-4 h-4" />
              Notes et résultats
            </Link>
          </div>
        </div>

        {/* Footer message */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Besoin d'aide ? Contactez l'administrateur système.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;