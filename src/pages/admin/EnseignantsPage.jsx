import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap, 
  faPlus, 
  faEdit, 
  faTrash, 
  faSearch,
  faUser,
  faEnvelope,
  faPhone,
  faCalendar,
  faBook
} from '@fortawesome/free-solid-svg-icons';
import "../../styles/animations.css";

const API_BASE = 'https://schoolelite.onrender.com/api/enseignants';

function EnseignantsPage() {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [newTeacher, setNewTeacher] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    matieres: [],
    classe: [],
  });

  // fetch teachers
  const fetchTeachers = async () => {
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Erreur réseau');
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data?.enseignants ?? []);
      setTeachers(list);
    } catch (e) {
      setTeachers([]);
      console.error('Fetch enseignants failed', e);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // create
  const handleAddTeacher = async () => {
    if (!newTeacher.nom || !newTeacher.prenom) {
      alert('Nom et prénom obligatoires');
      return;
    }
    try {
      const payload = {
        nom: newTeacher.nom,
        prenom: newTeacher.prenom,
        telephone: newTeacher.telephone || '',
        email: newTeacher.email || '',
        classe: newTeacher.classe || [],
        matieres: newTeacher.matieres || []
      };
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Erreur création');
      const created = await res.json();
      // si API renvoie objet créé ou wrapper
      const teacherObj = Array.isArray(created) ? created[0] : (created?.enseignant ?? created);
      setTeachers(prev => [teacherObj, ...prev]);
      setNewTeacher({ nom: '', prenom: '', email: '', telephone: '', matieres: [], classe: [] });
      setShowAddModal(false);
    } catch (e) {
      console.error('Ajout enseignant failed', e);
      alert("Impossible d'ajouter l'enseignant.");
    }
  };

  // update
  const handleEditTeacher = async () => {
    if (!editingTeacher) return;
    if (!editingTeacher.nom || !editingTeacher.prenom) {
      alert('Nom et prénom obligatoires');
      return;
    }
    try {
      const payload = {
        nom: editingTeacher.nom,
        prenom: editingTeacher.prenom,
        telephone: editingTeacher.telephone || '',
        email: editingTeacher.email || '',
        classe: editingTeacher.classe || [],
        matieres: editingTeacher.matieres || []
      };
      const res = await fetch(`${API_BASE}/${editingTeacher._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Erreur modification');
      const updated = await res.json();
      const teacherObj = updated?.enseignant ?? updated;
      setTeachers(prev => prev.map(t => t._id === teacherObj._id ? teacherObj : t));
      setEditingTeacher(null);
      setShowEditModal(false);
    } catch (e) {
      console.error('Modification enseignant failed', e);
      alert("Impossible de modifier l'enseignant.");
    }
  };

  // delete
  const handleDeleteTeacher = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur suppression');
      setTeachers(prev => prev.filter(t => t._id !== id));
    } catch (e) {
      console.error('Suppression enseignant failed', e);
      alert("Impossible de supprimer l'enseignant.");
    }
  };

  const filteredTeachers = teachers.filter(teacher =>
    (teacher.nom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (teacher.prenom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (teacher.matieres || []).join(' ').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (statut) => {
    return statut === 'actif' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };

  const getClasseName = (c) => {
    if (!c) return '';
    if (typeof c === 'string') return c;
    if (typeof c === 'object') return c.nom || c.libelle || (c._id ? c._id : '');
    return String(c);
  };

  return (
    <div className="mt-15 md:mt-11 w-full min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-all duration-300">
      <div className="container mx-auto">
        {/* En-tête */}
         <header className="mb-8 animate-slide-down">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mr-4 shadow-lg animate-float">
                    <FontAwesomeIcon icon={faGraduationCap} className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                       Gestion des Enseignants
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                    Gérez les informations de vos enseignants et leurs affectations.
                  </p>
                </div>
              </div>
            </div>
           <button
            onClick={() => { setShowAddModal(true); setNewTeacher({ nom: '', prenom: '', email: '', telephone: '', matieres: [], classe: [] }); }}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl animate-pulse-soft hover-lift"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Ajouter un enseignant
          </button>
          </div>
        </header>


        {/* Barre de recherche */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8 animate-fade-in-delay-1 hover-lift">
          <div className="relative">
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Rechercher un enseignant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 hover:shadow-lg"
            />
          </div>
        </div>

        {/* Liste des enseignants */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTeachers.map((teacher, index) => (
            <div
              key={teacher._id}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-card-delay hover-lift"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center mr-3 animate-scale-in">
                    <FontAwesomeIcon icon={faUser} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {teacher.prenom} {teacher.nom}
                    </h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium shadow-sm animate-pulse-soft ${getStatusColor(teacher.statut)}`}>
                      {teacher.statut || 'actif'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => { setEditingTeacher(teacher); setShowEditModal(true); }}
                    className="p-2 text-blue-600 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900 dark:hover:to-purple-900 rounded-xl transition-all duration-300 transform hover:scale-110 hover-lift"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => handleDeleteTeacher(teacher._id)}
                    className="p-2 text-red-600 hover:bg-gradient-to-r hover:from-red-100 hover:to-pink-100 dark:hover:from-red-900 dark:hover:to-pink-900 rounded-xl transition-all duration-300 transform hover:scale-110 hover-lift"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2 w-4" />
                  {teacher.email || '—'}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <FontAwesomeIcon icon={faPhone} className="mr-2 w-4" />
                  {teacher.telephone || '—'}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <FontAwesomeIcon icon={faBook} className="mr-2 w-4" />
                  {(teacher.matieres && teacher.matieres.length > 0) ? teacher.matieres.join(', ') : 'Aucune matière'}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <FontAwesomeIcon icon={faCalendar} className="mr-2 w-4" />
                  {teacher.dateEmbauche ? `Embauché le ${new Date(teacher.dateEmbauche).toLocaleDateString('fr-FR')}` : 'Date d\'embauche inconnue'}
                </div>
                {(teacher.classe && teacher.classe.length > 0) && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Classes :</p>
                    <div className="flex flex-wrap gap-2">
                      {teacher.classe.map((c, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-xs shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in"
                          style={{animationDelay: `${index * 0.05}s`}}
                        >
                          {getClasseName(c)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal d'ajout */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-scale-in">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Ajouter un enseignant</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
                  <input
                    type="text"
                    value={newTeacher.nom}
                    onChange={(e) => setNewTeacher({...newTeacher, nom: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 hover:shadow-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prénom</label>
                  <input
                    type="text"
                    value={newTeacher.prenom}
                    onChange={(e) => setNewTeacher({...newTeacher, prenom: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 hover:shadow-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={newTeacher.email}
                    onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 hover:shadow-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={newTeacher.telephone}
                    onChange={(e) => setNewTeacher({...newTeacher, telephone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 hover:shadow-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 rounded-xl transition-all duration-300 transform hover:scale-105 hover-lift"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddTeacher}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover-lift"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal d'édition */}
        {showEditModal && editingTeacher && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-scale-in">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Modifier un enseignant</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
                  <input
                    type="text"
                    value={editingTeacher.nom}
                    onChange={(e) => setEditingTeacher({...editingTeacher, nom: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 hover:shadow-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prénom</label>
                  <input
                    type="text"
                    value={editingTeacher.prenom}
                    onChange={(e) => setEditingTeacher({...editingTeacher, prenom: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 hover:shadow-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingTeacher.email || ''}
                    onChange={(e) => setEditingTeacher({...editingTeacher, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 hover:shadow-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={editingTeacher.telephone || ''}
                    onChange={(e) => setEditingTeacher({...editingTeacher, telephone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 hover:shadow-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => { setShowEditModal(false); setEditingTeacher(null); }}
                  className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 rounded-xl transition-all duration-300 transform hover:scale-105 hover-lift"
                >
                  Annuler
                </button>
                <button
                  onClick={handleEditTeacher}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover-lift"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default EnseignantsPage;