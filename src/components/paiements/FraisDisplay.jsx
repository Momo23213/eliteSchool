import React, { useState } from "react";
import { Filter, Search, ChevronDown, Plus, Edit, Trash2, GraduationCap, Calendar } from "lucide-react";
import { Modal } from "../../components/Modal";
import FraisScolariteForm from './FraiFormulaire'



const  FraiDisplay= ({ eleves, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const closeAddModal = () => setIsAddModalOpen(false);
  const [filters, setFilters] = useState({
    classeId: "",
    statut: "",
    sexe: "",
  });
     const handleAdd = () => {
    setIsAddModalOpen(true);
  };
  const uniqueClasses = Array.from(new Set(eleves.map(e => e.classeId.nom)));

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredEleves = eleves.filter(frai => {
    const matchesSearchTerm =
      frai.classeId.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      frai.anneeScolaireId.libelle.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilters =
      (filters.classeId === "" || frai.classeId.nom === filters.classeId) &&
      (filters.statut === "" || frai.anneeScolaireId.libelle === filters.statut)

    return matchesSearchTerm && matchesFilters;
  });

  

  return (
    <div>
      <div className="container mx-auto">

        {/* Barre de recherche et filtres */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par nom, prénom, matricule, classe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtres
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 transform hover:scale-105"
            onClick={handleAdd}
            >
              <Plus  className="w-4 h-4 mr-2" />
              Ajouter
            </button>
          </div>
          
          {/* Section des filtres (affichée/masquée) */}
          <div className={`mt-4 transition-all duration-300 ease-in-out overflow-hidden ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-600">
              <div>
                <label className="block text-sm font-medium mb-1">Classe</label>
                <select name="classeId" value={filters.classeId} onChange={handleFilterChange} className="w-full p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                  <option value="">Toutes les classes</option>
                  {uniqueClasses.map(classe => <option key={classe} value={classe}>{classe}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Statut</label>
                <select name="statut" value={filters.statut} onChange={handleFilterChange} className="w-full p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                  <option value="">Tous les statuts</option>
                  <option value="inscrit">Inscrit</option>
                  <option value="reinscrit">Réinscrit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sexe</label>
                <select name="sexe" value={filters.sexe} onChange={handleFilterChange} className="w-full p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                  <option value="">Tous les sexes</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tableau des élèves (Desktop) */}
        <div className="hidden md:block overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Année Scolaire</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Classes</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Inscription</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reinscription</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tranche 1</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tranche 2</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tranche 3</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Montant total</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEleves.map((eleve) => (
                <tr key={eleve._id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      {eleve.anneeScolaireId.libelle}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-purple-500" />
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-lg text-xs font-medium">
                        {eleve.classeId.nom}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">
                    {eleve.inscription?.toLocaleString('fr-FR') || '0'} GNF
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {eleve.reinscription?.toLocaleString('fr-FR') || '0'} GNF
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-orange-600 dark:text-orange-400">
                    {eleve.tranche1?.toLocaleString('fr-FR') || '0'} GNF
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-orange-600 dark:text-orange-400">
                    {eleve.tranche2?.toLocaleString('fr-FR') || '0'} GNF
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-orange-600 dark:text-orange-400">
                    {eleve.tranche3?.toLocaleString('fr-FR') || '0'} GNF
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {eleve.montantTotal?.toLocaleString('fr-FR') || '0'} GNF
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onEdit?.(eleve)} 
                        className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                        title="Modifier les frais"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDelete?.(eleve)} 
                        className="p-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                        title="Supprimer les frais"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEleves.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <GraduationCap className="w-12 h-12 text-gray-400 mb-3" />
                      <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-1">
                        Aucun frais trouvé
                      </p>
                      <p className="text-gray-400 dark:text-gray-500 text-sm">
                        Essayez de modifier vos critères de recherche
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Cartes des élèves (Mobile) */}
        <div className="md:hidden grid gap-4 grid-cols-1 sm:grid-cols-2 mt-6">
          {filteredEleves.map((eleve) => (
            <div
              key={eleve._id}
              className="backdrop-blur-md bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              {/* En-tête de la card */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200/30 dark:border-gray-600/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{eleve.classeId.nom}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {eleve.anneeScolaireId.libelle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Détails des frais */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Inscription</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {eleve.inscription?.toLocaleString('fr-FR') || '0'} GNF
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Réinscription</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {eleve.reinscription?.toLocaleString('fr-FR') || '0'} GNF
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Tranche 1</p>
                    <p className="font-semibold text-orange-600 dark:text-orange-400 text-sm">
                      {eleve.tranche1?.toLocaleString('fr-FR') || '0'}
                    </p>
                  </div>
                  <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Tranche 2</p>
                    <p className="font-semibold text-orange-600 dark:text-orange-400 text-sm">
                      {eleve.tranche2?.toLocaleString('fr-FR') || '0'}
                    </p>
                  </div>
                  <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Tranche 3</p>
                    <p className="font-semibold text-orange-600 dark:text-orange-400 text-sm">
                      {eleve.tranche3?.toLocaleString('fr-FR') || '0'}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700">
                  <span className="text-base font-bold text-gray-800 dark:text-gray-200">Total</span>
                  <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    {eleve.montantTotal?.toLocaleString('fr-FR') || '0'} GNF
                  </span>
                </div>
              </div>
              
              
              {/* Actions */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => onEdit?.(eleve)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-md"
                >
                  <Edit className="w-4 h-4" />
                  Modifier
                </button>
                <button
                  onClick={() => onDelete?.(eleve)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-md"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            </div>
          ))}
          {filteredEleves.length === 0 && (
            <div className="sm:col-span-2 flex flex-col items-center justify-center py-12 text-center">
              <GraduationCap className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
                Aucun frais trouvé
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          )}
        </div>
      </div>
     {/* Modal Ajouter un élève */}
            <Modal
              isOpen={isAddModalOpen}
              onClose={closeAddModal}
              title="Définir les frais de scolarité"
            >
              <FraisScolariteForm/>
            </Modal>
    </div>
  );
};

export default FraiDisplay;