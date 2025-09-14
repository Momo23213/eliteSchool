import React, { useState } from "react";
import { User, Filter, Plus, Search, ChevronDown, Edit, Trash, Eye, Book, Layers, Mail, Phone } from "lucide-react";




const matieresFictives = [
    { id: "mat1", nom: "Mathématiques" },
    { id: "mat2", nom: "Français" },
    { id: "mat3", nom: "Histoire-Géographie" },
];

const classesFictives = [
    { id: "classe1", nom: "6ème A" },
    { id: "classe2", nom: "5ème B" },
    { id: "classe3", nom: "4ème C" },
];

const EnseignantsDisplay = ({ enseignants, onEdit, onDelete, onDetail, onAddEnseignant }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        matiereId: "",
        classeId: "",
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const filteredEnseignants = enseignants.filter(enseignant => {
        const matchesSearchTerm =
            enseignant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enseignant.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enseignant.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilters =
            (filters.matiereId === "" || enseignant.matieres.includes(filters.matiereId))
            // (filters.classeId === "" || enseignant.classes.includes(filters.classeId));

        return matchesSearchTerm && matchesFilters;
    });

    const getMatiereNom = (id) => matieresFictives.find(m => m.id === id)?.nom || id;
    const getClasseNom = (id) => classesFictives.find(c => c.id === id)?.nom || id;

    return (
        <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
            <div className="container mx-auto">
                {/* En-tête de la page */}
                <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white">Gestion des Enseignants</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Organisez et gérez les informations de vos enseignants.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105" onClick={onAddEnseignant}>
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter un enseignant
                        </button>
                    </div>
                </header>

                {/* Barre de recherche et filtres */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Rechercher par nom, prénom, email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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
                    </div>
                    
                    {/* Section des filtres (affichée/masquée) */}
                    <div className={`mt-4 transition-all duration-300 ease-in-out overflow-hidden ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-600">
                            <div>
                                <label className="block text-sm font-medium mb-1">Matière</label>
                                <select name="matiereId" value={filters.matiereId} onChange={handleFilterChange} className="w-full p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                                    <option value="">Toutes les matières</option>
                                    {matieresFictives.map(matiere => <option key={matiere.id} value={matiere.id}>{matiere.nom}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Classe</label>
                                <select name="classeId" value={filters.classeId} onChange={handleFilterChange} className="w-full p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                                    <option value="">Toutes les classes</option>
                                    {classesFictives.map(classe => <option key={classe.id} value={classe.id}>{classe.nom}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tableau des enseignants (Desktop) */}
                <div className="hidden md:block overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nom & Prénom</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Matières</th>
                                {/* <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Classes</th> */}
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredEnseignants.length > 0 ? (
                                filteredEnseignants.map((enseignant) => (
                                    <tr key={enseignant._id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {`${enseignant.prenom} ${enseignant.nom}`}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            <p className="flex items-center gap-1"><Mail size={12} /> {enseignant.email}</p>
                                            <p className="flex items-center gap-1"><Phone size={12} /> {enseignant.telephone}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {enseignant.matieres.map(getMatiereNom).join(', ')}
                                        </td>
                                        {/*   */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button onClick={() => onEdit?.(enseignant)} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-500">
                                                Modifier
                                            </button>
                                            <button onClick={() => onDelete?.(enseignant)} className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-500">
                                                Supprimer
                                            </button>
                                            <button onClick={() => onDetail?.(enseignant)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                                                Détail
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        Aucun enseignant trouvé.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Cartes des enseignants (Mobile) */}
                <div className="md:hidden grid gap-4 grid-cols-1 sm:grid-cols-2 mt-6">
                    {filteredEnseignants.length > 0 ? (
                        filteredEnseignants.map((enseignant) => (
                            <div key={enseignant._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{`${enseignant.prenom} ${enseignant.nom}`}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    <span className="flex items-center gap-1"><Mail size={12} /> {enseignant.email}</span>
                                    <span className="flex items-center gap-1"><Phone size={12} /> {enseignant.telephone}</span>
                                </p>
                                <div className="mt-4 text-left w-full space-y-1">
                                    <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold flex items-center gap-2"><Book size={12} /> Matières:</p>
                                    <p className="text-sm text-gray-800 dark:text-gray-200">{enseignant.matieres.map(getMatiereNom).join(', ')}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold flex items-center gap-2"><Layers size={12} /> Classes:</p>
                                    <p className="text-sm text-gray-800 dark:text-gray-200">{enseignant.classes.map(getClasseNom).join(', ')}</p>
                                </div>
                                <div className="flex space-x-2 mt-4 w-full justify-center">
                                    <button
                                        onClick={() => onEdit?.(enseignant)}
                                        className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition-colors flex items-center gap-1"
                                    >
                                        <Edit size={14} /> Modifier
                                    </button>
                                    <button
                                        onClick={() => onDelete?.(enseignant)}
                                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition-colors flex items-center gap-1"
                                    >
                                        <Trash size={14} /> Supprimer
                                    </button>
                                    <button
                                        onClick={() => onDetail?.(enseignant)}
                                        className="px-3 py-1 bg-gray-500 text-white rounded-lg text-xs hover:bg-gray-600 transition-colors flex items-center gap-1"
                                    >
                                        <Eye size={14} /> Détail
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="sm:col-span-2 text-center text-gray-500 dark:text-gray-400 mt-4">
                            Aucun enseignant trouvé.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EnseignantsDisplay;