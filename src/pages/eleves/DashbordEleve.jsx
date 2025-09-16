import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Award, 
  TrendingUp, 
  Users, 
  MessageCircle,
  Bell,
  FileText,
  Target,
  CheckCircle,
  AlertCircle,
  Star,
  BarChart3,
  GraduationCap,
  ChevronRight,
  Activity,
  Zap,
  Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import eleveService from '../../services/eleveService';
import classeService from '../../services/classeService';

const DashbordEleve = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    notes: [],
    moyenneGenerale: 0,
    absences: 0,
    devoirs: [],
    prochainsCours: [],
    notifications: []
  });
  const [classe, setClasse] = useState(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les informations de l'élève
      const eleveData = await eleveService.getById(user.id || user._id);
      
      // Récupérer les informations de la classe
      if (eleveData.classeId) {
        const classeData = await classeService.getById(eleveData.classeId);
        setClasse(classeData);
      }

      // Simuler des données pour la démonstration
      const mockStats = {
        notes: [
          { matiere: 'Mathématiques', note: 15.5, coefficient: 4, date: '2024-01-15' },
          { matiere: 'Français', note: 13.2, coefficient: 4, date: '2024-01-12' },
          { matiere: 'Histoire-Géo', note: 16.8, coefficient: 3, date: '2024-01-10' },
          { matiere: 'Anglais', note: 14.5, coefficient: 3, date: '2024-01-08' },
          { matiere: 'Sciences', note: 17.2, coefficient: 4, date: '2024-01-05' }
        ],
        moyenneGenerale: 15.2,
        absences: 2,
        devoirs: [
          { matiere: 'Mathématiques', titre: 'Contrôle Algèbre', date: '2024-01-20', type: 'Contrôle' },
          { matiere: 'Français', titre: 'Dissertation', date: '2024-01-22', type: 'Devoir' },
          { matiere: 'Anglais', titre: 'Oral présentation', date: '2024-01-25', type: 'Oral' }
        ],
        prochainsCours: [
          { matiere: 'Mathématiques', heure: '08:00', salle: 'A101', professeur: 'M. Dupont' },
          { matiere: 'Français', heure: '10:00', salle: 'B205', professeur: 'Mme Martin' },
          { matiere: 'Histoire-Géo', heure: '14:00', salle: 'C301', professeur: 'M. Bernard' }
        ],
        notifications: [
          { type: 'info', message: 'Nouvelle note en Mathématiques', date: '2024-01-16' },
          { type: 'warning', message: 'Devoir à rendre demain', date: '2024-01-15' },
          { type: 'success', message: 'Félicitations pour votre progression', date: '2024-01-14' }
        ]
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (note) => {
    if (note >= 16) return 'text-green-600';
    if (note >= 14) return 'text-blue-600';
    if (note >= 12) return 'text-yellow-600';
    if (note >= 10) return 'text-orange-600';
    return 'text-red-600';
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête avec animation */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tableau de bord
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1 text-lg">
                Bonjour {user?.prenom || user?.nom} ! 👋 Voici un aperçu de votre scolarité.
              </p>
            </div>
          </div>
        </div>

        {/* Cartes de statistiques avec animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Moyenne générale */}
          <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-blue-100 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-600 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-blue-200 transition-shadow duration-300">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Moyenne générale
                </p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    {stats.moyenneGenerale}
                  </p>
                  <span className="text-lg text-gray-500">/20</span>
                </div>
                <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500" 
                    style={{width: `${(stats.moyenneGenerale / 20) * 100}%`}}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Absences */}
          <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-red-100 dark:border-red-800 hover:border-red-300 dark:hover:border-red-600 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg group-hover:shadow-red-200 transition-shadow duration-300">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Absences
                </p>
                <div className="flex items-center space-x-2">
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {stats.absences}
                  </p>
                  {stats.absences === 0 && <Heart className="w-5 h-5 text-green-500 animate-pulse" />}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.absences === 0 ? 'Parfait ! 🎉' : 'À surveiller'}
                </p>
              </div>
            </div>
          </div>

          {/* Devoirs à venir */}
          <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-yellow-100 dark:border-yellow-800 hover:border-yellow-300 dark:hover:border-yellow-600 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl shadow-lg group-hover:shadow-yellow-200 transition-shadow duration-300">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Devoirs à venir
                </p>
                <div className="flex items-center space-x-2">
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {stats.devoirs.length}
                  </p>
                  {stats.devoirs.length > 0 && <Zap className="w-5 h-5 text-yellow-500 animate-bounce" />}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.devoirs.length === 0 ? 'Rien de prévu ! 😌' : 'Préparez-vous ! 📚'}
                </p>
              </div>
            </div>
          </div>

          {/* Classe */}
          <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-green-100 dark:border-green-800 hover:border-green-300 dark:hover:border-green-600 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg group-hover:shadow-green-200 transition-shadow duration-300">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Ma Classe
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {classe?.nom || 'Non assigné'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {classe ? '🎓 Ensemble vers la réussite' : 'En attente d\'affectation'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Dernières notes */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Award className="w-6 h-6 mr-3" />
                  Dernières notes
                </h2>
                <p className="text-blue-100 mt-1">Vos performances récentes</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {stats.notes.map((note, index) => (
                    <div key={index} className="group relative p-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white dark:bg-gray-600 rounded-lg shadow-sm">
                              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                                {note.matiere}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(note.date).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <div className="text-right">
                              <p className={`text-2xl font-bold ${getGradeColor(note.note)}`}>
                                {note.note}
                              </p>
                              <p className="text-sm text-gray-500">/20</p>
                            </div>
                            <div className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                              Coef. {note.coefficient}
                            </div>
                          </div>
                          {note.note >= 16 && <Star className="w-4 h-4 text-yellow-400 mt-1 animate-pulse" />}
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-50 dark:to-blue-900 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Devoirs à venir */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-yellow-500 to-orange-500">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Target className="w-6 h-6 mr-3" />
                  Devoirs à venir
                </h2>
                <p className="text-yellow-100 mt-1">Préparez-vous pour vos évaluations</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {stats.devoirs.map((devoir, index) => {
                    const daysUntil = Math.ceil((new Date(devoir.date) - new Date()) / (1000 * 60 * 60 * 24));
                    const isUrgent = daysUntil <= 2;
                    return (
                      <div key={index} className={`group relative p-5 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                        isUrgent 
                          ? 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900 dark:to-orange-900 border-red-200 dark:border-red-700 hover:shadow-red-200' 
                          : 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 border-yellow-200 dark:border-yellow-700 hover:shadow-yellow-200'
                      } hover:shadow-lg`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg shadow-sm ${
                                devoir.type === 'Contrôle' ? 'bg-red-100 dark:bg-red-800' :
                                devoir.type === 'Oral' ? 'bg-purple-100 dark:bg-purple-800' :
                                'bg-blue-100 dark:bg-blue-800'
                              }`}>
                                {devoir.type === 'Contrôle' ? <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" /> :
                                 devoir.type === 'Oral' ? <MessageCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" /> :
                                 <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                                  {devoir.titre}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {devoir.matiere} • {devoir.type}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                              {new Date(devoir.date).toLocaleDateString('fr-FR')}
                            </p>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                isUrgent 
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 animate-pulse' 
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              }`}>
                                {isUrgent ? `🚨 Dans ${daysUntil} jour${daysUntil > 1 ? 's' : ''}` : `📅 Dans ${daysUntil} jours`}
                              </span>
                            </div>
                          </div>
                        </div>
                        {isUrgent && (
                          <div className="absolute top-2 right-2">
                            <Zap className="w-5 h-5 text-red-500 animate-bounce" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-8">
            {/* Prochains cours */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-600">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Calendar className="w-6 h-6 mr-3" />
                  Prochains cours
                </h2>
                <p className="text-green-100 mt-1">Votre planning d'aujourd'hui</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {stats.prochainsCours.map((cours, index) => (
                    <div key={index} className="group relative p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 rounded-xl border border-green-200 dark:border-green-700 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                            {cours.heure}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-lg flex items-center">
                            {cours.matiere}
                            <ChevronRight className="w-4 h-4 ml-2 text-gray-400 group-hover:text-green-500 transition-colors" />
                          </h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                              <Activity className="w-3 h-3 mr-1" />
                              Salle {cours.salle}
                            </p>
                            <p className="text-sm text-gray-500">
                              👨‍🏫 {cours.professeur}
                            </p>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-600">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Bell className="w-6 h-6 mr-3" />
                  Notifications
                </h2>
                <p className="text-purple-100 mt-1">Restez informé de l'actualité</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {stats.notifications.map((notification, index) => (
                    <div key={index} className={`group p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                      notification.type === 'success' ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 border-green-200 dark:border-green-700 hover:shadow-green-200' :
                      notification.type === 'warning' ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 border-yellow-200 dark:border-yellow-700 hover:shadow-yellow-200' :
                      'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 border-blue-200 dark:border-blue-700 hover:shadow-blue-200'
                    } hover:shadow-lg`}>
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          notification.type === 'success' ? 'bg-green-100 dark:bg-green-800' :
                          notification.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-800' :
                          'bg-blue-100 dark:bg-blue-800'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(notification.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600">
                <h2 className="text-xl font-bold text-white">
                  Actions rapides
                </h2>
                <p className="text-indigo-100 mt-1">Accès direct à vos outils</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <button className="group w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex items-center">
                      <BookOpen className="w-5 h-5 mr-3" />
                      <span className="font-semibold">Voir mes cours</span>
                    </div>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="group w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex items-center">
                      <MessageCircle className="w-5 h-5 mr-3" />
                      <span className="font-semibold">Messagerie</span>
                    </div>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="group w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-3" />
                      <span className="font-semibold">Ma classe</span>
                    </div>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashbordEleve;