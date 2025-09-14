
import React, { useEffect, useState } from 'react';
import { Eye, Search, Filter, ChevronDown, Plus } from 'lucide-react';
import  noteService  from '../../services/noteService';

function NotesSaisie() {
   const [loader, setLoader] = useState(true);
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
      // const closeAddModal = () => setIsAddModalOpen(false);
    const [showFilters, setShowFilters] = useState(false);
    //  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [filters, setFilters] = useState({
      classeId: '',
      statut: '',
      sexe: '',
    });
  
  useEffect(() => {
      async function not() {
        try {
          setLoader(true);
          const data = await noteService.getAll();
          // Adapter les données reçues du backend au format attendu par le tableau
          const mappedData = data.map((n) => ({
            _id: n._id,
            eleveId: {
              _id: n.eleveId?._id || '',
              matricule: n.eleveId?.matricule || '',
              nom: n.eleveId?.nom || '',
              prenom: n.eleveId?.prenom || '',
              photo: n.eleveId?.photo || '',
              sexe: n.eleveId?.sexe || '',
              classeId: n.eleveId?.classeId || {},
              statut: n.eleveId?.statut || '',
            },
            matiereId: {
              _id: n.matiereId?._id || '',
              nom: n.matiereId?.nom || '',
            },
            enseignantId: {
              nom: n.enseignantId?.[0]?.nom || '',
              prenom: n.enseignantId?.[0]?.prenom || '',
            },
            valeur: n.valeur ?? 0,
            trimestre: n.trimestre || '',
            sequence: n.sequence || '',
            anneeScolaireId: {
              _id: n.anneeScolaireId?._id || '',
              libelle: n.anneeScolaireId?.libelle || '',
            },
          }));
          setData(mappedData);
        } catch (error) {
          console.log(error.message); // ✅ corrigé
        } finally {
          setLoader(false);
        }
      }
      not();
    }, []);
  
    // const handleAdd = () => {
    //   setIsAddModalOpen(true);
    // };
  
  
    const uniqueClasses = Array.from(new Set(data.map(item => item.eleveId.classeId.nom)));
  
    const handleFilterChange = (e) => {
      const { name, value } = e.target;
      setFilters(prev => ({ ...prev, [name]: value }));
    };
  
    const filteredData = data.filter(item => {
      // Filtrage par terme de recherche
      const matchesSearchTerm =
        item.eleveId.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.eleveId.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.eleveId.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.matiereId.nom.toLowerCase().includes(searchTerm.toLowerCase());
  
      // Filtrage par les options des filtres
      const matchesFilters =
        (filters.classeId === '' || item.eleveId.classeId.nom === filters.classeId) &&
        (filters.statut === '' || item.eleveId.statut === filters.statut) &&
        (filters.sexe === '' || item.eleveId.sexe === filters.sexe);
  
      return matchesSearchTerm && matchesFilters;
    });
  return (
    <div className="min-h-screen mt-10 w-full p-4 md:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-all duration-300">
       <div className="container mx-auto p-4 md:p-8">
      
              {/* Bloc de recherche et de filtres */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1 relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Rechercher par nom, prénom, matricule..."
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
                  <button
                    className="flex items-center w-full md:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 transform hover:scale-105"
                    // onClick={handleAdd}
                  >
                    <Plus className="w-4 h-4 mr-2" />
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
      
              {/* Section Tableau (visible sur les écrans moyens et plus grands) */}
              {loader ? <h1>Chargement de la liste de notes</h1> : 
              <div className="dark:text-white overflow-x-auto shadow-xl rounded-lg hidden md:block">
                <table className="w-full text-sm text-left rtl:text-right">
                  <thead className={"text-xs uppercase dark:bg-gray-700 dark:text-white bg-gray-50 text-gray-700"}>
                    <tr>
                      <th scope="col" className="px-6 py-3">Classe</th>
                      <th scope="col" className="px-6 py-3">Image</th>
                      <th scope="col" className="px-6 py-3">Matricule</th>
                      <th scope="col" className="px-6 py-3">Nom de l'élève</th>
                      <th scope="col" className="px-6 py-3">Matière</th>
                      <th scope="col" className="px-6 py-3">Trimestre</th>
                      <th scope="col" className="px-6 py-3">Séquence</th>
                      <th scope="col" className="px-6 py-3">Note</th>
                      <th scope="col" className="px-6 py-3">Enseignant</th>
                      <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <tr
                          key={item._id}
                          className={`border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-700 bg-white border-gray-200 hover:bg-gray-50`}
                        >
                            <td className="px-6 py-4">{item.eleveId.classeId.nom}</td>
                          <td className="px-6 py-4">
                            <img
                             src={`https://schoolelite.onrender.com${item.eleveId.photo}`}
                              alt={`${item.eleveId.prenom} ${item.eleveId.nom}`}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          </td>
                          <td className="px-6 py-4">{item.eleveId.matricule}</td>
                          <td className="px-6 py-4 font-medium whitespace-nowrap">{item.eleveId.prenom} {item.eleveId.nom}</td>
                          <td className="px-6 py-4">{item.matiereId.nom}</td>
                          <td className="px-6 py-4">{item.trimestre}</td>
                          <td className="px-6 py-4">{item.sequence}</td>
                          <td className="px-6 py-4">{item.valeur}</td>
                          <td className="px-6 py-4">{item.enseignantId.prenom} {item.enseignantId.nom}</td>
                          <td className="px-6 py-4">
                            <button className="text-blue-600 dark:text-blue-500 hover:underline">
                              <Eye className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="text-center px-6 py-4 text-lg">
                          Aucune donnée trouvée.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>}
      
              {/* Section Cartes (visible sur les petits écrans) */}
              {loader ? <h1>Chargement de la liste de notes</h1> : 
              <div className="md:hidden grid grid-cols-1 gap-4">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <div
                      key={item._id}
                      className={"p-4 rounded-lg shadow-md dark:bg-gray-800 dark:text-white border dark:border-gray-700 bg-white border border-gray-200"}
                    >
                      <div className="flex items-center mb-3">
                        <img
                          src={`https://schoolelite.onrender.com${item.eleveId.photo}`}
                          alt={`${item.eleveId.prenom} ${item.eleveId.nom}`}
                          className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                        <div>
                          <h3 className="font-semibold text-lg">{item.eleveId.prenom} {item.eleveId.nom}</h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Matricule: {item.eleveId.matricule}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <p><strong>Classe:</strong> {item.eleveId.classeId.nom}</p>
                        <p><strong>Statut:</strong> {item.eleveId.statut}</p>
                        <p><strong>Sexe:</strong> {item.eleveId.sexe}</p>
                        <p><strong>Matière:</strong> {item.matiereId.nom}</p>
                        <p><strong>Note:</strong> {item.valeur}</p>
                        <p><strong>Trimestre:</strong> {item.trimestre}</p>
                        <p><strong>Séquence:</strong> {item.sequence}</p>
                        <p><strong>Enseignant:</strong> {item.enseignantId.prenom} {item.enseignantId.nom}</p>
                        <p><strong>Année:</strong> {item.anneeScolaireId.libelle}</p>
                      </div>
                      <div className="mt-4 text-right">
                        <button className="text-blue-600 dark:text-blue-500 hover:underline flex items-center justify-end">
                          <Eye className="h-4 w-4 mr-1" /> Voir Détails
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={`p-4 rounded-lg shadow-md text-center text-lg dark:bg-gray-800 border dark:border-gray-700 bg-white border border-gray-200`}>
                    Aucune donnée trouvée.
                  </div>
                )}
              </div>}
            </div>
                        {/* <Modal
                          isOpen={isAddModalOpen}
                          onClose={closeAddModal}
                          title="Saisir les notes d'une classe"
                        >
                          <NoteFormTable/>
                        </Modal> */}
    </div>
  )
}

export default NotesSaisie