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
  Heart,
  UserCheck,
  ClipboardList,
  PieChart,
  BookMarked,
  Calendar as CalendarIcon,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import classeService from '../../services/classeService';

const DashbordEnseignant = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    classes: [],
    totalEleves: 0,
    moyenneClasses: 0,
    prochainsCours: [],
    devoirs: [],
    notifications: [],
    absencesAujourdhui: 0
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les classes de l'enseignant
      const allClasses = await classeService.getAll();
      const mesClasses = allClasses.filter(classe => 
        classe.enseignants?.some(ens => ens._id === (user.id || user._id))
      );

      // Calculer les statistiques
      const totalEleves = mesClasses.reduce((total, classe) => total + (classe.eleves?.length || 0), 0);

      // Simuler des données pour la démonstration
      const mockStats = {
        classes: mesClasses,
        totalEleves,
        moyenneClasses: 14.8,
        absencesAujourdhui: 5,
        prochainsCours: [
          { matiere: 'Mathématiques', heure: '08:00', classe: '3ème A', salle: 'A101' },
          { matiere: 'Mathématiques', heure: '10:00', classe: '4ème B', salle: 'A102' },
          { matiere: 'Mathématiques', heure: '14:00', classe: '3ème C', salle: 'A101' }
        ],
        devoirs: [
          { classe: '3ème A', matiere: 'Mathématiques', titre: 'Contrôle Algèbre', date: '2024-01-20', type: 'Contrôle' },
          { classe: '4ème B', matiere: 'Mathématiques', titre: 'Exercices Géométrie', date: '2024-01-22', type: 'Devoir' },
          { classe: '3ème C', matiere: 'Mathématiques', titre: 'Évaluation Fonctions', date: '2024-01-25', type: 'Évaluation' }
        ],
        notifications: [
          { type: 'info', message: 'Réunion pédagogique demain à 16h', date: '2024-01-16' },
          { type: 'warning', message: '5 élèves absents aujourd\'hui', date: '2024-01-15' },
          { type: 'success', message: 'Excellents résultats en 3ème A', date: '2024-01-14' }
        ]
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-900 dark:to-teal-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête avec animation */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Espace Enseignant
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1 text-lg">
                Bonjour {user?.prenom || user?.nom} ! 👨‍🏫 Gérez vos classes et suivez vos élèves.
              </p>
            </div>
          </div>
        </div>

        {/* Cartes de statistiques avec animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Mes Classes */}
          <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-emerald-100 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-600 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-lg group-hover:shadow-emerald-200 transition-shadow duration-300">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Mes Classes
                </p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                    {stats.classes.length}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.classes.length > 0 ? '🎓 Classes actives' : 'Aucune classe assignée'}
                </p>
              </div>
            </div>
          </div>

          {/* Total Élèves */}
          <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-blue-100 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-600 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-blue-200 transition-shadow duration-300">
                <UserCheck className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Total Élèves
                </p>
                <div className="flex items-center space-x-2">
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.totalEleves}
                  </p>
                  {stats.totalEleves > 0 && <Heart className="w-5 h-5 text-red-500 animate-pulse" />}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.totalEleves > 0 ? '👥 Élèves sous votre responsabilité' : 'Aucun élève'}
                </p>
              </div>
            </div>
          </div>

          {/* Moyenne Classes */}
          <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-purple-100 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-600 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-purple-200 transition-shadow duration-300">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Moyenne Classes
                </p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.moyenneClasses}
                  </p>
                  <span className="text-lg text-gray-500">/20</span>
                </div>
                <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500" 
                    style={{width: `${(stats.moyenneClasses / 20) * 100}%`}}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Absences Aujourd'hui */}
          <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-orange-100 dark:border-orange-800 hover:border-orange-300 dark:hover:border-orange-600 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg group-hover:shadow-orange-200 transition-shadow duration-300">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Absences Aujourd'hui
                </p>
                <div className="flex items-center space-x-2">
                  <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {stats.absencesAujourdhui}
                  </p>
                  {stats.absencesAujourdhui > 0 && <Zap className="w-5 h-5 text-orange-500 animate-bounce" />}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.absencesAujourdhui === 0 ? 'Tous présents ! 🎉' : 'À surveiller 👀'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mes Classes */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Users className="w-6 h-6 mr-3" />
                  Mes Classes
                </h2>
                <p className="text-emerald-100 mt-1">Gérez vos classes et élèves</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {stats.classes.length > 0 ? stats.classes.map((classe, index) => (
                    <div key={index} className="group relative p-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white dark:bg-gray-600 rounded-lg shadow-sm">
                              <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                                Classe {classe.nom}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                {classe.eleves?.length || 0} élèves
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-emerald-50 dark:to-emerald-900 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl"></div>
                    </div>
                  )) : (
                    <div className="text-center py-8">
                      <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Aucune classe assignée</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Devoirs et Évaluations */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-purple-500 to-indigo-600">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <ClipboardList className="w-6 h-6 mr-3" />
                  Devoirs et Évaluations
                </h2>
                <p className="text-purple-100 mt-1">Planifiez et suivez les évaluations</p>
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
                          : 'bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900 dark:to-indigo-900 border-purple-200 dark:border-purple-700 hover:shadow-purple-200'
                      } hover:shadow-lg`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg shadow-sm ${
                                devoir.type === 'Contrôle' ? 'bg-red-100 dark:bg-red-800' :
                                devoir.type === 'Évaluation' ? 'bg-purple-100 dark:bg-purple-800' :
                                'bg-blue-100 dark:bg-blue-800'
                              }`}>
                                {devoir.type === 'Contrôle' ? <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" /> :
                                 devoir.type === 'Évaluation' ? <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" /> :
                                 <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                                  {devoir.titre}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {devoir.classe} • {devoir.matiere}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                              {new Date(devoir.date).toLocaleDateString('fr-FR')}
                            </p>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              isUrgent 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 animate-pulse' 
                                : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            }`}>
                              {isUrgent ? `🚨 Dans ${daysUntil} jour${daysUntil > 1 ? 's' : ''}` : `📅 Dans ${daysUntil} jours`}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-8">
            {/* Planning du jour */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-500 to-cyan-600">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <CalendarIcon className="w-6 h-6 mr-3" />
                  Planning du jour
                </h2>
                <p className="text-blue-100 mt-1">Vos cours d'aujourd'hui</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {stats.prochainsCours.map((cours, index) => (
                    <div key={index} className="group relative p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900 rounded-xl border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                            {cours.heure}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-lg flex items-center">
                            {cours.matiere}
                            <ChevronRight className="w-4 h-4 ml-2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                          </h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {cours.classe}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Activity className="w-3 h-3 mr-1" />
                              {cours.salle}
                            </p>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-pink-500 to-rose-600">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Bell className="w-6 h-6 mr-3" />
                  Notifications
                </h2>
                <p className="text-pink-100 mt-1">Informations importantes</p>
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
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-pink-500 transition-colors" />
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
                <p className="text-indigo-100 mt-1">Outils pédagogiques</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <button className="group w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex items-center">
                      <ClipboardList className="w-5 h-5 mr-3" />
                      <span className="font-semibold">Saisir notes</span>
                    </div>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="group w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex items-center">
                      <MessageCircle className="w-5 h-5 mr-3" />
                      <span className="font-semibold">Messagerie</span>
                    </div>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="group w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex items-center">
                      <BookMarked className="w-5 h-5 mr-3" />
                      <span className="font-semibold">Emploi du temps</span>
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

export default DashbordEnseignant;