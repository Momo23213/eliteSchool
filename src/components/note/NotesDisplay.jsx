import React, { useState } from "react";
import { User, Filter, Plus, Search, ChevronDown, Book, GraduationCap, SquareGanttChart } from "lucide-react";


const NotesDisplay = ({ notes, eleves, matieres, onEdit, onDelete, onDetail, onAddNote }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        eleveId: "",
        matiereId: "",
        classeId: "",
    });

    const uniqueClasses = Array.from(new Set(eleves.map(e => e.classeId)));
    
    const getEleveNomComplet = (id) => {
        const eleve = eleves.find(e => e._id === id);
        return eleve ? `${eleve.prenom} ${eleve.nom}` : "Élève inconnu";
    };

    const getEleveClasse = (id) => {
        const eleve = eleves.find(e => e._id === id);
        return eleve ? eleve.classeId : "Classe inconnue";
    };

    const getMatiereNom = (id) => {
        const matiere = matieres.find(m => m._id === id);
        return matiere ? matiere.nom : "Matière inconnue";
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const filteredNotes = notes.filter(note => {
        const eleve = eleves.find(e => e._id === note.eleveId);
        const eleveNomComplet = eleve ? `${eleve.prenom} ${eleve.nom}`.toLowerCase() : "";
        const eleveClasseId = eleve?.classeId || "";

        const matchesSearchTerm = eleveNomComplet.includes(searchTerm.toLowerCase());
        const matchesFilters =
            (filters.eleveId === "" || note.eleveId === filters.eleveId) &&
            (filters.matiereId === "" || note.matiereId === filters.matiereId) &&
            (filters.classeId === "" || eleveClasseId === filters.classeId);

        return matchesSearchTerm && matchesFilters;
    });

    return (
        <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
            <div className="container mx-auto">
                <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white">Gestion des Notes</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Suivez les performances académiques des élèves.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105" onClick={onAddNote}>
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter une note
                        </button>
                    </div>
                </header>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Rechercher par nom d'élève..."
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

                    <div className={`mt-4 transition-all duration-300 ease-in-out overflow-hidden ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-600">
                            <div>
                                <label className="block text-sm font-medium mb-1">Élève</label>
                                <select name="eleveId" value={filters.eleveId} onChange={handleFilterChange} className="w-full p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                                    <option value="">Tous les élèves</option>
                                    {eleves.map(e => <option key={e._id} value={e._id}>{`${e.prenom} ${e.nom}`}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Matière</label>
                                <select name="matiereId" value={filters.matiereId} onChange={handleFilterChange} className="w-full p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                                    <option value="">Toutes les matières</option>
                                    {matieres.map(m => <option key={m._id} value={m._id}>{m.nom}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Classe</label>
                                <select name="classeId" value={filters.classeId} onChange={handleFilterChange} className="w-full p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                                    <option value="">Toutes les classes</option>
                                    {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tableau des notes (Desktop) */}
                <div className="hidden md:block overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Élève</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Matière</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Note</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredNotes.length > 0 ? (
                                filteredNotes.map((note) => (
                                    <tr key={note._id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{getEleveNomComplet(note.eleveId)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{getMatiereNom(note.matiereId)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-bold">{note.note}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{note.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button onClick={() => onEdit?.(note)} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-500">Modifier</button>
                                            <button onClick={() => onDelete?.(note)} className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-500">Supprimer</button>
                                            <button onClick={() => onDetail?.(note)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Détail</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Aucune note trouvée.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Cartes des notes (Mobile) */}
                <div className="md:hidden grid gap-4 grid-cols-1 sm:grid-cols-2 mt-6">
                    {filteredNotes.length > 0 ? (
                        filteredNotes.map((note) => (
                            <div key={note._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{getEleveNomComplet(note.eleveId)}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    <span className="flex items-center gap-1"><Book size={12} /> {getMatiereNom(note.matiereId)}</span>
                                    <span className="flex items-center gap-1"><GraduationCap size={12} /> {note.note}</span>
                                </p>
                                <div className="flex space-x-2 mt-4 w-full justify-center">
                                    <button onClick={() => onEdit?.(note)} className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition-colors flex items-center gap-1">Modifier</button>
                                    <button onClick={() => onDelete?.(note)} className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition-colors flex items-center gap-1">Supprimer</button>
                                    <button onClick={() => onDetail?.(note)} className="px-3 py-1 bg-gray-500 text-white rounded-lg text-xs hover:bg-gray-600 transition-colors flex items-center gap-1">Détail</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="sm:col-span-2 text-center text-gray-500 dark:text-gray-400 mt-4">Aucune note trouvée.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotesDisplay;