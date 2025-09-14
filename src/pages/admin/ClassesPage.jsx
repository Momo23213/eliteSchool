import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useSchool } from '../../context/SchoolContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBookOpen, 
  faPlus, 
  faEdit, 
  faTrash, 
  faSearch,
  faChartBar,
  faSort
} from '@fortawesome/free-solid-svg-icons';
import { 
  CheckCircle, 
  XCircle, 
  BookOpen, 
  BarChart3, 
  Filter, 
  SortAsc, 
  Users, 
  Trophy,
  GraduationCap,
  Building,
  Award,
  Calendar,
  MapPin,
  Users2,
  BookOpen as BookIcon
} from 'lucide-react';
import '../../styles/animations.css';

function ClassesPage() {
   const [classes, setClasses] = useState([]);
    const { annes } = useSchool();
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingClasse, setEditingClasse] = useState(null);
    const [editClasseData, setEditClasseData] = useState(null);
    const [sortBy, setSortBy] = useState('nom');
    const [sortOrder, setSortOrder] = useState('asc');
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    // Ouvre la modale d'édition avec les données pré-remplies
    const openEditModal = (classe) => {
      setEditingClasse(classe);
      setEditClasseData({
        nom: classe.nom,
        cycle: classe.cycle,
        salle: classe.salle,
        niveau: classe.niveau,
        effMax: classe.effMax,
        anneeScolaireId: typeof classe.anneeScolaireId === 'string' ? undefined : classe.anneeScolaireId,
      });
    };
  
    // Gère la modification d'une classe
    const handleEditClasse = async () => {
      if (!editingClasse || !editClasseData?.nom || !editClasseData.niveau || !editClasseData.anneeScolaireId || !editClasseData.effMax) {
        toast.error('Veuillez remplir tous les champs obligatoires.');
        return;
      }
      try {
        const response = await fetch(`https://schoolelite.onrender.com/api/classe/${editingClasse._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nom: editClasseData.nom,
            niveau: editClasseData.niveau,
            effMax: editClasseData.effMax,
            anneeScolaireId: typeof editClasseData.anneeScolaireId === 'string' ? editClasseData.anneeScolaireId : editClasseData.anneeScolaireId._id,
            salle: editClasseData.salle,
            cycle: editClasseData.cycle
          })
        });
        if (response.ok) {
          const res = await fetch('https://schoolelite.onrender.com/api/classe');
          const data = await res.json();
          setClasses(data);
          setEditingClasse(null);
          setEditClasseData(null);
          toast.success('Classe modifiée avec succès');
        } else {
          const data = await response.json();
          toast.error(data.message || "Erreur lors de la modification de la classe.");
        }
      } catch {
        toast.error("Erreur lors de la modification de la classe.");
      }
    };
    const [filterNiveau, setFilterNiveau] = useState('tous');
    const [newClasse, setNewClasse] = useState({
      nom: '',
      niveau: '',
      effMax: 30,
      enseignants: [],
      eleves: [],
      matieres: [],
      anneeScolaireId: undefined,
      salle: '',
      cycle: '',
    });
    const cycles = ['Maternelle', 'Primaire', 'Collège', 'Lycée'];
    const niveaux = ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale'];
  
    // Récupération des données du serveur
    useEffect(() => {
      fetch('https://schoolelite.onrender.com/api/classe')
        .then(res => res.json())
        .then((data) => {
          setClasses(data);
        })
        .catch(() => {
          setClasses([]);
        });
    }, []);
  
    // Fonction de tri et filtrage avancée
    const sortedAndFilteredClasses = classes
      .filter(classe => {
        const matchesSearch = classe.nom.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesNiveau = filterNiveau === 'tous' || classe.niveau === filterNiveau;
        return matchesSearch && matchesNiveau;
      })
      .sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'nom':
            comparison = a.nom.localeCompare(b.nom);
            break;
          case 'niveau':
            comparison = a.niveau.localeCompare(b.niveau);
            break;
          case 'effectif':
            const effectifA = a.eleves?.length || 0;
            const effectifB = b.eleves?.length || 0;
            comparison = effectifA - effectifB;
            break;
          case 'tauxOccupation':
            const tauxA = a.effMax > 0 ? ((a.eleves?.length || 0) / a.effMax) * 100 : 0;
            const tauxB = b.effMax > 0 ? ((b.eleves?.length || 0) / b.effMax) * 100 : 0;
            comparison = tauxA - tauxB;
            break;
        }
        
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  
    // Statistiques avancées
    const stats = {
      totalClasses: classes.length,
      totalEleves: classes.reduce((sum, c) => sum + (c.eleves?.length || 0), 0),
      totalCapacite: classes.reduce((sum, c) => sum + (c.effMax || 0), 0),
      tauxOccupationGlobal: classes.reduce((sum, c) => sum + (c.effMax || 0), 0) > 0 
        ? Math.round((classes.reduce((sum, c) => sum + (c.eleves?.length || 0), 0) / classes.reduce((sum, c) => sum + (c.effMax || 0), 0)) * 100) 
        : 0,
      classesCompletes: classes.filter(c => (c.eleves?.length || 0) >= (c.effMax || 0)).length,
      classesVides: classes.filter(c => (c.eleves?.length || 0) === 0).length,
      moyenneEffectif: classes.length > 0 
        ? Math.round(classes.reduce((sum, c) => sum + (c.eleves?.length || 0), 0) / classes.length) 
        : 0,
      niveauLePlusRepresente: classes.length > 0 
        ? classes.reduce((acc, curr) => {
            const count = classes.filter(c => c.niveau === curr.niveau).length;
            return count > acc.count ? { niveau: curr.niveau, count } : acc;
          }, { niveau: '', count: 0 }).niveau
        : 'N/A'
    };
  
    const handleAddClasse = async () => {
      if (newClasse.nom && newClasse.niveau && newClasse.anneeScolaireId && newClasse.effMax && newClasse.salle && newClasse.cycle) {
        try {
          const response = await fetch('https://schoolelite.onrender.com/api/classe/creer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              nom: newClasse.nom,
              niveau: newClasse.niveau,
              anneeScolaireId: typeof newClasse.anneeScolaireId === 'string' ? newClasse.anneeScolaireId : newClasse.anneeScolaireId._id,
              effMax: newClasse.effMax,
              salle: newClasse.salle,
              cycle: newClasse.cycle
            })
          });
          if (response.ok) {
            // Rafraîchir la liste
            const res = await fetch('https://schoolelite.onrender.com/api/classe');
            const data = await res.json();
            setClasses(data);
            setShowAddModal(false);
            setNewClasse({
              nom: '',
              niveau: '',
              effMax: 30,
              enseignants: [],
              eleves: [],
              matieres: [],
              anneeScolaireId: undefined,
              salle: '',
              cycle: '',
            });
          } else {
            alert("Erreur lors de l'ajout de la classe.");
          }
        } catch {
          alert("Erreur lors de l'ajout de la classe.");
        }
      } else {
        alert('Veuillez remplir tous les champs obligatoires.');
      }
    };
    // Ajout des champs dans la modale d'ajout
  
    const handleDeleteClasse = async (id) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) {
        try {
          const response = await fetch(`https://schoolelite.onrender.com/api/classe/${id}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            setClasses(classes.filter(classe => classe._id !== id));
            toast.success('Classe supprimée avec succès');
          } else {
            const data = await response.json();
            toast.error(data.message || "Erreur lors de la suppression de la classe.");
          }
        } catch {
          toast.error("Erreur lors de la suppression de la classe.");
        }
      }
    };
  
  return (
    <div className="min-h-screen mt-10 w-full p-4 md:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-all duration-300">
      <div className="container mx-auto max-w-7xl">
              {/* En-tête avec animation */}
              <header className="mb-8 animate-fade-in">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mr-4 shadow-lg">
                        <GraduationCap className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                          Gestion des Classes
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                          Organisez et gérez les classes de votre école
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                  >
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faPlus} className="mr-3 group-hover:rotate-90 transition-transform duration-300" />
                      Créer une classe
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
                  </button>
                </div>
              </header>
      
              {/* Section des statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up-delay-1">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Classes</p>
                      <p className="text-3xl font-black">{stats.totalClasses}</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl">
                      <BookOpen className="w-6 h-6" />
                    </div>
                  </div>
                </div>
      
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Total Élèves</p>
                      <p className="text-3xl font-black">{stats.totalEleves}</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>
                </div>
      
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Taux Occupation</p>
                      <p className="text-3xl font-black">{stats.tauxOccupationGlobal}%</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                  </div>
                </div>
      
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Classes Complètes</p>
                      <p className="text-3xl font-black">{stats.classesCompletes}</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl">
                      <Trophy className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>
      
              {/* Statistiques supplémentaires */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up-delay-2">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Classes Vides</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.classesVides}</p>
                    </div>
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                      <Building className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </div>
                  </div>
                </div>
      
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Moyenne Effectif</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.moyenneEffectif}</p>
                    </div>
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                      <Users className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </div>
                  </div>
                </div>
      
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Niveau Principal</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white truncate">{stats.niveauLePlusRepresente}</p>
                    </div>
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                      <Award className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
      
              {/* Barre de recherche et contrôles */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8 animate-slide-up-delay-2">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Barre de recherche */}
                  <div className="flex-1 relative">
                    <FontAwesomeIcon 
                      icon={faSearch} 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Rechercher une classe..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg transition-all duration-300"
                    />
                  </div>
      
                  {/* Contrôles */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center px-4 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                    >
                      <Filter className="w-5 h-5 mr-2" />
                      Filtres
                    </button>
                    
                    <select
                      value={filterNiveau}
                      onChange={(e) => setFilterNiveau(e.target.value)}
                      className="px-4 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    >
                      <option value="tous">Tous les niveaux</option>
                      {niveaux.map(niveau => (
                        <option key={niveau} value={niveau}>{niveau}</option>
                      ))}
                    </select>
      
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    >
                      <option value="nom">Trier par nom</option>
                      <option value="niveau">Trier par niveau</option>
                      <option value="effectif">Trier par effectif</option>
                      <option value="tauxOccupation">Trier par occupation</option>
                    </select>
      
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="flex items-center px-4 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                    >
                      <SortAsc className={`w-5 h-5 ${sortOrder === 'desc' ? 'rotate-180' : ''} transition-transform duration-300`} />
                    </button>
      
                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-3 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-md' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                      >
                        <FontAwesomeIcon icon={faChartBar} />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-3 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-md' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                      >
                        <FontAwesomeIcon icon={faSort} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
      
              {/* Liste des classes */}
              <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}`}>
                {sortedAndFilteredClasses.map((classe, index) => {
                  const tauxOccupation = classe.effMax > 0 ? Math.round(((classe.eleves?.length || 0) / classe.effMax) * 100) : 0;
                  const colors = [
                    'from-blue-500 to-blue-600',
                    'from-green-500 to-green-600', 
                    'from-purple-500 to-purple-600',
                    'from-pink-500 to-pink-600',
                    'from-orange-500 to-orange-600',
                    'from-indigo-500 to-indigo-600',
                    'from-teal-500 to-teal-600',
                    'from-red-500 to-red-600'
                  ];
                  
                  const colorIndex = index % colors.length;
                  
                  return (
                    <div
                      key={classe._id}
                      className={`group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-card-delay hover-lift ${
                        viewMode === 'list' ? 'p-6 flex items-center justify-between' : 'p-6'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {viewMode === 'grid' ? (
                        <>
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center">
                              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <GraduationCap className="text-white text-2xl" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                  {classe.nom}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                  {classe.niveau} • {classe.eleves?.length || 0} élève{(classe.eleves?.length || 0) > 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openEditModal(classe)}
                                className="p-3 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-xl transition-all duration-300 hover:scale-110"
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button
                                onClick={() => handleDeleteClasse(classe._id)}
                                className="p-3 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-xl transition-all duration-300 hover:scale-110"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </div>
      
                          <div className="space-y-4">
                            {/* Barre de progression de l'effectif */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400 font-medium">Effectif</span>
                                <span className={`font-bold text-lg ${
                                  (classe.eleves?.length || 0) >= classe.effMax
                                    ? 'text-red-600 dark:text-red-400'
                                    : (classe.eleves?.length || 0) >= Math.floor(0.8 * classe.effMax)
                                    ? 'text-yellow-600 dark:text-yellow-400'
                                    : 'text-green-600 dark:text-green-400'
                                }`}>
                                  {classe.eleves?.length || 0}/{classe.effMax}
                                </span>
                              </div>
                              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-3 rounded-full transition-all duration-500 ${
                                    (classe.eleves?.length || 0) >= classe.effMax
                                      ? 'bg-gradient-to-r from-red-500 to-red-600'
                                      : (classe.eleves?.length || 0) >= Math.floor(0.8 * classe.effMax)
                                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                                      : 'bg-gradient-to-r from-green-400 to-green-600'
                                  }`}
                                  style={{
                                    width: `${Math.min(100, Math.round(((classe.eleves?.length || 0) / classe.effMax) * 100))}%`
                                  }}
                                />
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>Taux d'occupation</span>
                                <span className="font-semibold">{tauxOccupation}%</span>
                              </div>
                            </div>
      
                            {/* Informations de la classe */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                <span className="text-gray-600 dark:text-gray-400 font-medium flex items-center">
                                  <MapPin className="w-4 h-4 mr-2" />
                                  Salle
                                </span>
                                <span className="font-bold text-gray-900 dark:text-white">
                                  {classe.salle || 'N/A'}
                                </span>
                              </div>
      
                              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                <span className="text-gray-600 dark:text-gray-400 font-medium flex items-center">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  Année
                                </span>
                                <span className="font-bold text-gray-900 dark:text-white">
                                  {classe.anneeScolaireId?.libelle || 'N/A'}
                                </span>
                              </div>
      
                              {classe.enseignants && classe.enseignants.length > 0 && (
                                <div>
                                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                    <Users2 className="w-4 h-4 mr-2" />
                                    Enseignants
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {classe.enseignants.slice(0, 2).map((enseignant, idx) => (
                                      <span key={idx} className="px-2 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                                        {enseignant.prenom} {enseignant.nom}
                                      </span>
                                    ))}
                                    {classe.enseignants.length > 2 && (
                                      <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-semibold">
                                        +{classe.enseignants.length - 2}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
      
                              {classe.matieres && classe.matieres.length > 0 && (
                                <div>
                                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                    <BookIcon className="w-4 h-4 mr-2" />
                                    Matières
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {classe.matieres.slice(0, 3).map((matiere, idx) => (
                                      <span key={idx} className="px-2 py-1 rounded-full bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900 dark:to-teal-900 text-green-700 dark:text-green-300 text-xs font-semibold">
                                        {matiere}
                                      </span>
                                    ))}
                                    {classe.matieres.length > 3 && (
                                      <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-semibold">
                                        +{classe.matieres.length - 3}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center mr-4`}>
                              <GraduationCap className="text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{classe.nom}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {classe.niveau} • {classe.eleves?.length || 0}/{classe.effMax} • {tauxOccupation}%
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openEditModal(classe)}
                              className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              onClick={() => handleDeleteClasse(classe._id)}
                              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
      
              {/* Modal d'ajout ultra-moderne */}
              {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-0 w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden border border-gray-200/50 dark:border-gray-700/50 animate-scale-in">
                    {/* En-tête de la modal */}
                    <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="relative flex items-center gap-4">
                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                          <GraduationCap className="w-8 h-8" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-black mb-2">Nouvelle Classe</h2>
                          <p className="text-blue-100 text-lg">Créez une nouvelle classe pour votre école</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowAddModal(false)}
                        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300"
                      >
                        <XCircle className="w-6 h-6" />
                      </button>
                    </div>
      
                    {/* Formulaire */}
                    <form onSubmit={e => { e.preventDefault(); handleAddClasse(); }} className="p-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                            Nom de la classe *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={newClasse.nom}
                              onChange={(e) => setNewClasse({ ...newClasse, nom: e.target.value })}
                              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-lg"
                              placeholder="Ex: 6ème A, Terminale S..."
                              required
                            />
                            <FontAwesomeIcon icon={faBookOpen} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          </div>
                        </div>
      
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                            Niveau *
                          </label>
                          <div className="relative">
                            <select
                              value={newClasse.niveau}
                              onChange={(e) => setNewClasse({ ...newClasse, niveau: e.target.value })}
                              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 text-lg"
                              required
                            >
                              <option value="">Sélectionner un niveau</option>
                              {niveaux.map(niveau => (
                                <option key={niveau} value={niveau}>{niveau}</option>
                              ))}
                            </select>
                            <GraduationCap className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          </div>
                        </div>
                      </div>
      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                            Effectif maximum *
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min="1"
                              max="500"
                              value={newClasse.effMax || ''}
                              onChange={(e) => setNewClasse({ ...newClasse, effMax: parseInt(e.target.value) || 30 })}
                              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 text-lg"
                              placeholder="30"
                              required
                            />
                            <Users className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          </div>
                        </div>
      
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                            Année scolaire *
                          </label>
                          <div className="relative">
                            <select
                              value={typeof newClasse.anneeScolaireId === 'string' ? newClasse.anneeScolaireId : newClasse.anneeScolaireId?._id || ''}
                              onChange={e => {
                                const selected = annes.find(a => a._id === e.target.value);
                                setNewClasse({ ...newClasse, anneeScolaireId: selected });
                              }}
                              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 text-lg"
                              required
                            >
                              <option value="">Sélectionner une année scolaire</option>
                              {annes && annes.map(annee => (
                                <option key={annee._id} value={annee._id}>{annee.libelle}</option>
                              ))}
                            </select>
                            <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          </div>
                        </div>
                      </div>
      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                            Salle *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={newClasse.salle}
                              onChange={e => setNewClasse({ ...newClasse, salle: e.target.value })}
                              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all duration-300 text-lg"
                              placeholder="Ex: A101, B205..."
                              required
                            />
                            <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          </div>
                        </div>
      
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                            Cycle *
                          </label>
                          <div className="relative">
                            <select
                              value={newClasse.cycle}
                              onChange={e => setNewClasse({ ...newClasse, cycle: e.target.value })}
                              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 text-lg"
                              required
                            >
                              <option value="">Sélectionner un cycle</option>
                              {cycles.map(cycle => (
                                <option key={cycle} value={cycle}>{cycle}</option>
                              ))}
                            </select>
                            <Building className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          </div>
                        </div>
                      </div>
      
                      {/* Boutons d'action */}
                      <div className="flex gap-4 pt-6">
                        <button 
                          type="button" 
                          onClick={() => setShowAddModal(false)} 
                          className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
                        >
                          <XCircle className="w-5 h-5" />
                          Annuler
                        </button>
                        <button 
                          type="submit" 
                          className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Créer la classe
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
      
              {/* Modal d'édition ultra-moderne */}
              {editingClasse && editClasseData && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-0 w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden border border-gray-200/50 dark:border-gray-700/50 animate-scale-in">
                    {/* En-tête de la modal */}
                    <div className="relative bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 p-8 text-white">
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="relative flex items-center gap-4">
                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                          <FontAwesomeIcon icon={faEdit} className="w-8 h-8" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-black mb-2">Modifier la classe</h2>
                          <p className="text-green-100 text-lg">Modifiez les informations de la classe</p>
                        </div>
                      </div>
                      <button
                        onClick={() => { setEditingClasse(null); setEditClasseData(null); }}
                        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300"
                      >
                        <XCircle className="w-6 h-6" />
                      </button>
                    </div>
      
                    {/* Formulaire d'édition */}
                    <form onSubmit={e => { e.preventDefault(); handleEditClasse(); }} className="p-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                            Nom de la classe *
                          </label>
                          <input
                            type="text"
                            value={editClasseData.nom}
                            onChange={e => setEditClasseData({ ...editClasseData, nom: e.target.value })}
                            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-lg"
                            required
                          />
                        </div>
      
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                            Niveau *
                          </label>
                          <select
                            value={editClasseData.niveau}
                            onChange={e => setEditClasseData({ ...editClasseData, niveau: e.target.value })}
                            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 text-lg"
                            required
                          >
                            <option value="">Sélectionner un niveau</option>
                            {niveaux.map(niveau => (
                              <option key={niveau} value={niveau}>{niveau}</option>
                            ))}
                          </select>
                        </div>
                      </div>
      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                            Effectif maximum *
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="500"
                            value={editClasseData.effMax || ''}
                            onChange={e => setEditClasseData({ ...editClasseData, effMax: parseInt(e.target.value) || 30 })}
                            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 text-lg"
                            required
                          />
                        </div>
      
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                            Année scolaire *
                          </label>
                          <select
                            value={typeof editClasseData.anneeScolaireId === 'string' ? editClasseData.anneeScolaireId : editClasseData.anneeScolaireId?._id || ''}
                            onChange={e => {
                              const selected = annes.find(a => a._id === e.target.value);
                              setEditClasseData({ ...editClasseData, anneeScolaireId: selected });
                            }}
                            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 text-lg"
                            required
                          >
                            <option value="">Sélectionner une année scolaire</option>
                            {annes && annes.map(annee => (
                              <option key={annee._id} value={annee._id}>{annee.libelle}</option>
                            ))}
                          </select>
                        </div>
                      </div>
      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                            Salle *
                          </label>
                          <input
                            type="text"
                            value={editClasseData.salle || ''}
                            onChange={e => setEditClasseData({ ...editClasseData, salle: e.target.value })}
                            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all duration-300 text-lg"
                            required
                          />
                        </div>
      
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                            Cycle *
                          </label>
                          <select
                            value={editClasseData.cycle || ''}
                            onChange={e => setEditClasseData({ ...editClasseData, cycle: e.target.value })}
                            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 text-lg"
                            required
                          >
                            <option value="">Sélectionner un cycle</option>
                            {cycles.map(cycle => (
                              <option key={cycle} value={cycle}>{cycle}</option>
                            ))}
                          </select>
                        </div>
                      </div>
      
                      {/* Boutons d'action */}
                      <div className="flex gap-4 pt-6">
                        <button 
                          type="button" 
                          onClick={() => { setEditingClasse(null); setEditClasseData(null); }} 
                          className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
                        >
                          <XCircle className="w-5 h-5" />
                          Annuler
                        </button>
                        <button 
                          type="submit" 
                          className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Enregistrer
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
      </div>
  )
}

export default ClassesPage