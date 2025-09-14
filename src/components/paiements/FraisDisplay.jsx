import React, { useState } from "react";
import {  Filter, Search, ChevronDown, Plus } from "lucide-react";
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
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Année Scolaire</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Classes</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Inscription</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reinscription</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tranche 1</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tranche 2</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tranche 3</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Montant total</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEleves.map((eleve) => (
                <tr key={eleve._id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{eleve.anneeScolaireId.libelle}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{`${eleve.classeId.nom} `}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{ eleve.inscription}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{eleve.reinscription}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{eleve.tranche1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{eleve.tranche2}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{eleve.tranche3}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{eleve.montantTotal}</td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button onClick={() => onEdit?.(eleve)} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-500">
                      Modifier
                    </button>
                    <button onClick={() => onDelete?.(eleve)} className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-500">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
              {filteredEleves.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Aucun élève trouvé.
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
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300"
            >
              
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Classe :{eleve.classeId.nom}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Année Scolaire: {eleve.anneeScolaireId.libelle}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tranche 1 : {eleve.tranche1}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tranche 2 : {eleve.tranche2}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tranche 3 : {eleve.tranche3}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Montant total: {eleve.montantTotal}</p>
              
              
              <div className="flex space-x-2 mt-4 w-full justify-center">
                <button
                  onClick={() => onEdit?.(eleve)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition-colors"
                >
                  Modifier
                </button>
                <button
                  onClick={() => onDelete?.(eleve)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition-colors"
                >
                  Supprimer
                </button>
                
              </div>
            </div>
          ))}
          {filteredEleves.length === 0 && (
            <div className="sm:col-span-2 text-center text-gray-500 dark:text-gray-400 mt-4">
              Aucun élève trouvé.
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