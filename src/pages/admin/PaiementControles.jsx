import React, { useEffect, useState } from 'react';
import paiementService from '../../services/paiementService';
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Users, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Loader2,
  AlertCircle
} from 'lucide-react';

const getClasseNom = (classeId) =>
  typeof classeId === "object" && classeId !== null
    ? classeId.nom
    : typeof classeId === "string"
    ? classeId
    : "";
function PaiementControles() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPaiements();
  }, [currentPage]);

  const fetchPaiements = async () => {
    try {
      setLoading(true);
      const response = await paiementService.getAllPaiements(currentPage, 20);
      setData(response.paiements || response || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error('Erreur lors du chargement des paiements:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (eleve,palier) => {
    const { montantPaye } = eleve;
    const { fraisId, statut } = eleve.eleveId;
    let palierValue = 0;
    let palierSum = 0;

    if (!fraisId) return "";

    if (palier === "inscription") {
      palierValue = fraisId.inscription || 0;
      return montantPaye >= palierValue
        ? "text-green-600 dark:text-green-400 font-bold"
        : "text-red-600 dark:text-red-400 font-bold";
    }
    if (palier === "reinscription") {
      palierValue = fraisId.reinscription || 0;
      return montantPaye >= palierValue
        ? "text-green-600 dark:text-green-400 font-bold"
        : "text-red-600 dark:text-red-400 font-bold";
    }
    if (palier === "tranche1") {
      palierSum =
        (statut === "inscrit"
          ? fraisId.inscription || 0
          : fraisId.reinscription || 0) + (fraisId.tranche1 || 0);
      return montantPaye >= palierSum
        ? "text-green-600 dark:text-green-400 font-bold"
        : "text-red-600 dark:text-red-400 font-bold";
    }
    if (palier === "tranche2") {
      palierSum =
        (statut === "inscrit"
          ? fraisId.inscription || 0
          : fraisId.reinscription || 0) +
        (fraisId.tranche1 || 0) +
        (fraisId.tranche2 || 0);
      return montantPaye >= palierSum
        ? "text-green-600 dark:text-green-400 font-bold"
        : "text-red-600 dark:text-red-400 font-bold";
    }
    if (palier === "tranche3") {
      palierSum =
        (statut === "inscrit"
          ? fraisId.inscription || 0
          : fraisId.reinscription || 0) +
        (fraisId.tranche1 || 0) +
        (fraisId.tranche2 || 0) +
        (fraisId.tranche3 || 0);
      return montantPaye >= palierSum
        ? "text-green-600 dark:text-green-400 font-bold"
        : "text-red-600 dark:text-red-400 font-bold";
    }
    return "";
  };

  // Filtrer les données selon la recherche et le statut
  const filteredData = data.filter(el => {
    const matchSearch = searchTerm === '' || 
      el.eleveId?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.eleveId?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.eleveId?.matricule?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchSearch;
    if (filterStatus === 'paid') return matchSearch && el.montantRestant === 0;
    if (filterStatus === 'unpaid') return matchSearch && el.montantRestant > 0;
    return matchSearch;
  });

  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-gray-900 dark:text-white transition-all duration-300">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        
        {/* En-tête */}
        <div className="text-center md:text-left animate-slide-up">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg animate-float">
              <DollarSign className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Contrôle des Paiements
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Suivi et contrôle des paiements de tous les élèves</p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="backdrop-blur-md bg-white/70 dark:bg-gray-800/70 p-4 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 animate-slide-up" style={{animationDelay: '0.1s'}}>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, prénom ou matricule..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
              />
            </div>

            {/* Filtre par statut */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-3 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
              >
                <option value="all">Tous les élèves</option>
                <option value="paid">Entièrement payé</option>
                <option value="unpaid">Reste à payer</option>
              </select>
            </div>

            {/* Statistiques rapides */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="font-medium">{filteredData.length} élèves</span>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xl">Chargement des données...</span>
            </div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">Aucun résultat trouvé</h3>
            <p className="text-gray-500 dark:text-gray-500">Aucun élève ne correspond à vos critères de recherche.</p>
          </div>
        ) : (
        <>
          {/* Vue Desktop - Tableau */}
          <div className="hidden lg:block backdrop-blur-md bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm table-fixed">
              <colgroup>
                <col className="w-32" />
                <col className="w-20" />
                <col className="w-28" />
                <col className="w-40" />
                <col className="w-24" />
                <col className="w-32" />
                <col className="w-32" />
                <col className="w-32" />
                <col className="w-32" />
                <col className="w-32" />
                <col className="w-36" />
                <col className="w-36" />
                <col className="w-36" />
              </colgroup>
              <thead className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-900/30 dark:to-indigo-900/30">
                <tr>
                  <th className="px-3 py-4 text-left font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200/50 dark:border-gray-600/50">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="truncate">Année scolaire</span>
                    </div>
                  </th>
                  <th className="px-2 py-4 text-center font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200/50 dark:border-gray-600/50">Photo</th>
                  <th className="px-3 py-4 text-left font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200/50 dark:border-gray-600/50">Matricule</th>
                  <th className="px-3 py-4 text-left font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200/50 dark:border-gray-600/50">Nom & Prénom</th>
                  <th className="px-2 py-4 text-left font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200/50 dark:border-gray-600/50">Classe</th>
                  <th className="px-3 py-4 text-right font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200/50 dark:border-gray-600/50">
                    <span className="block">Inscription</span>
                  </th>
                  <th className="px-3 py-4 text-right font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200/50 dark:border-gray-600/50">
                    <span className="block">Réinscription</span>
                  </th>
                  <th className="px-3 py-4 text-right font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200/50 dark:border-gray-600/50">
                    <span className="block">Tranche 1</span>
                  </th>
                  <th className="px-3 py-4 text-right font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200/50 dark:border-gray-600/50">
                    <span className="block">Tranche 2</span>
                  </th>
                  <th className="px-3 py-4 text-right font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200/50 dark:border-gray-600/50">
                    <span className="block">Tranche 3</span>
                  </th>
                  <th className="px-3 py-4 text-right font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200/50 dark:border-gray-600/50">
                    <div className="flex items-center justify-end gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="block">Montant total</span>
                    </div>
                  </th>
                  <th className="px-3 py-4 text-right font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200/50 dark:border-gray-600/50">
                    <div className="flex items-center justify-end gap-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="block">Montant payé</span>
                    </div>
                  </th>
                  <th className="px-3 py-4 text-right font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200/50 dark:border-gray-600/50">
                    <div className="flex items-center justify-end gap-1">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="block">Reste à payer</span>
                    </div>
                  </th>
                </tr>
              </thead>
            <tbody>
              {filteredData.map((el) => {
                const frais = el.eleveId?.fraisId || {};
                console.log('Données élève:', el); // Debug
                console.log('Frais:', frais); // Debug
                return (
                  <tr key={el._id} className="hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-200 border-b border-gray-100/50 dark:border-gray-700/50">
                    <td className="px-3 py-4 text-left truncate">{el.anneeScolaireId?.libelle || ""}</td>
                    <td className="px-2 py-4 text-center">
                      {el.eleveId?.photo ? (
                        <img
                          src={el.eleveId.photo.startsWith('http') ? el.eleveId.photo : `https://schoolelite.onrender.com${el.eleveId.photo}`}
                          alt="photo"
                          className="w-12 h-12 rounded-full object-cover mx-auto border-2 border-blue-200 dark:border-blue-700 shadow-sm"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center mx-auto text-white font-bold text-lg ${el.eleveId?.photo ? 'hidden' : ''}`}>
                        {el.eleveId?.nom?.[0] || 'E'}{el.eleveId?.prenom?.[0] || 'L'}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-left font-medium truncate">{el.eleveId.matricule}</td>
                    <td className="px-3 py-4 text-left">
                      <div className="font-medium truncate">{el.eleveId.nom} {el.eleveId.prenom}</div>
                    </td>
                    <td className="px-2 py-4 text-left">
                      <span className="px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium truncate block">
                        {el.classeId?.nom || getClasseNom(el.eleveId?.classeId) || 'N/A'}
                      </span>
                    </td>
                    <td className={`px-3 py-4 text-right font-semibold ${getStatusColor(el, "inscription")}`}>
                      <div className="whitespace-nowrap">
                        {el.eleveId?.fraisId?.inscription?.toLocaleString("fr-FR") || "-"} GNF
                      </div>
                    </td>
                    <td className={`px-3 py-4 text-right font-semibold ${getStatusColor(el, "reinscription")}`}>
                      <div className="whitespace-nowrap">
                        {el.eleveId?.statut === "inscrit"
                          ? "-"
                          : el.eleveId?.fraisId?.reinscription
                          ? `${el.eleveId.fraisId.reinscription.toLocaleString("fr-FR")} GNF`
                          : "0 GNF"}
                      </div>
                    </td>
                    <td className={`px-3 py-4 text-right font-semibold ${getStatusColor(el, "tranche1")}`}>
                      <div className="whitespace-nowrap">
                        {el.eleveId?.fraisId?.tranche1?.toLocaleString("fr-FR") || "-"} GNF
                      </div>
                    </td>
                    <td className={`px-3 py-4 text-right font-semibold ${getStatusColor(el, "tranche2")}`}>
                      <div className="whitespace-nowrap">
                        {el.eleveId?.fraisId?.tranche2?.toLocaleString("fr-FR") || "-"} GNF
                      </div>
                    </td>
                    <td className={`px-3 py-4 text-right font-semibold ${getStatusColor(el, "tranche3")}`}>
                      <div className="whitespace-nowrap">
                        {el.eleveId?.fraisId?.tranche3?.toLocaleString("fr-FR") || "-"} GNF
                      </div>
                    </td>
                    <td className="px-3 py-4 text-right font-bold text-lg text-blue-600 dark:text-blue-400">
                      <div className="whitespace-nowrap">
                        {el.eleveId?.fraisId?.montantTotal?.toLocaleString("fr-FR") || el.montantTotal?.toLocaleString("fr-FR") || "-"} GNF
                      </div>
                    </td>
                    <td className="px-3 py-4 text-right font-bold text-lg text-green-600 dark:text-green-400">
                      <div className="whitespace-nowrap">
                        {el.montantPaye?.toLocaleString("fr-FR") || "0"} GNF
                      </div>
                    </td>
                    <td className="px-3 py-4 text-right font-bold text-lg">
                      <div className={`whitespace-nowrap ${el.montantRestant > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                        {el.montantRestant?.toLocaleString("fr-FR") || "0"} GNF
                      </div>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        </div>

          {/* Vue Mobile - Cards */}
          <div className="lg:hidden space-y-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
            {filteredData.map((el) => (
              <div key={el._id} className="backdrop-blur-md bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 p-4 hover:shadow-2xl transition-all duration-300">
                {/* En-tête de la card */}
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200/30 dark:border-gray-600/30">
                  <div className="flex-shrink-0">
                    {el.eleveId?.photo ? (
                      <img
                        src={el.eleveId.photo.startsWith('http') ? el.eleveId.photo : `https://schoolelite.onrender.com${el.eleveId.photo}`}
                        alt="photo"
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-200 dark:border-blue-700 shadow-sm"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xl ${el.eleveId?.photo ? 'hidden' : ''}`}>
                      {el.eleveId?.nom?.[0] || 'E'}{el.eleveId?.prenom?.[0] || 'L'}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                      {el.eleveId?.nom} {el.eleveId?.prenom}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Matricule: {el.eleveId?.matricule}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium">
                        {el.classeId?.nom || getClasseNom(el.eleveId?.classeId) || 'N/A'}
                      </span>
                      <span className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 text-xs">
                        {el.anneeScolaireId?.libelle || ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Résumé financier */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 rounded-xl bg-blue-50/50 dark:bg-blue-900/20">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Total</span>
                    </div>
                    <p className="font-bold text-sm text-blue-700 dark:text-blue-300">
                      {(el.eleveId?.fraisId?.montantTotal || el.montantTotal || 0).toLocaleString("fr-FR")} GNF
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-green-50/50 dark:bg-green-900/20">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">Payé</span>
                    </div>
                    <p className="font-bold text-sm text-green-700 dark:text-green-300">
                      {(el.montantPaye || 0).toLocaleString("fr-FR")} GNF
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-red-50/50 dark:bg-red-900/20">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="text-xs font-medium text-red-600 dark:text-red-400">Restant</span>
                    </div>
                    <p className="font-bold text-sm text-red-700 dark:text-red-300">
                      {(el.montantRestant || 0).toLocaleString("fr-FR")} GNF
                    </p>
                  </div>
                </div>

                {/* Détail des frais */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Détail des frais</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50/50 dark:bg-gray-700/30">
                      <span className="text-gray-600 dark:text-gray-400">Inscription</span>
                      <span className={`font-semibold ${getStatusColor(el, "inscription")}`}>
                        {(el.eleveId?.fraisId?.inscription || 0).toLocaleString("fr-FR")} GNF
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50/50 dark:bg-gray-700/30">
                      <span className="text-gray-600 dark:text-gray-400">Réinscription</span>
                      <span className={`font-semibold ${getStatusColor(el, "reinscription")}`}>
                        {el.eleveId?.statut === "inscrit" ? "-" : `${(el.eleveId?.fraisId?.reinscription || 0).toLocaleString("fr-FR")} GNF`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50/50 dark:bg-gray-700/30">
                      <span className="text-gray-600 dark:text-gray-400">Tranche 1</span>
                      <span className={`font-semibold ${getStatusColor(el, "tranche1")}`}>
                        {(el.eleveId?.fraisId?.tranche1 || 0).toLocaleString("fr-FR")} GNF
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50/50 dark:bg-gray-700/30">
                      <span className="text-gray-600 dark:text-gray-400">Tranche 2</span>
                      <span className={`font-semibold ${getStatusColor(el, "tranche2")}`}>
                        {(el.eleveId?.fraisId?.tranche2 || 0).toLocaleString("fr-FR")} GNF
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50/50 dark:bg-gray-700/30 col-span-2">
                      <span className="text-gray-600 dark:text-gray-400">Tranche 3</span>
                      <span className={`font-semibold ${getStatusColor(el, "tranche3")}`}>
                        {(el.eleveId?.fraisId?.tranche3 || 0).toLocaleString("fr-FR")} GNF
                      </span>
                    </div>
                  </div>
                </div>

                {/* Barre de progression */}
                <div className="mt-4 pt-4 border-t border-gray-200/30 dark:border-gray-600/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Progression du paiement</span>
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      {Math.round(((el.montantPaye || 0) / (el.eleveId?.fraisId?.montantTotal || el.montantTotal || 1)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.round(((el.montantPaye || 0) / (el.eleveId?.fraisId?.montantTotal || el.montantTotal || 1)) * 100))}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
        )}
      </div>
    </div>
  );
}

export default PaiementControles