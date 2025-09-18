import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/animations.css";

const DetailEleve = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eleve, setEleve] = useState(null);
  const [paiements, setPaiements] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [eleveRes, paiementRes, noteRes] = await Promise.all([
          axios.get(`https://schoolelite.onrender.com/api/eleves/${id}`),
          axios.get(`https://schoolelite.onrender.com/api/paiements/eleves/${id}`),
          axios.get(`https://schoolelite.onrender.com/api/notes/eleve/${id}`),
        ]);

        setEleve(eleveRes.data);
        setPaiements(paiementRes.data);
        setNotes(noteRes.data.sort((a, b) =>
          a.anneeScolaireId.libelle.localeCompare(b.anneeScolaireId.libelle)
        ));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Chargement des données...</p>
        </div>
      </div>
    );
  }
  
  if (!eleve) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-red-600 dark:text-red-400">Élève introuvable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-15 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header avec navigation */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/eleves")}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 hover:bg-white/30 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Retour aux élèves</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Profil Élève</h1>
                <p className="text-indigo-100">Détails et historique complet</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Carte profil élève */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8 animate-fade-in-up hover-lift">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                {eleve.photo ? (
                  <img
                    src={`${eleve.photo}`}
                    alt="photo élève"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white/30 shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center">
                    <svg className="w-16 h-16 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              <div className="text-center md:text-left text-white flex-1">
                <h2 className="text-3xl font-bold mb-2">{eleve.nom} {eleve.prenom}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 animate-fade-in-delay-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="text-sm opacity-80">Matricule</span>
                    </div>
                    <p className="font-semibold">{eleve.matricule}</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 animate-fade-in-delay-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-sm opacity-80">Classe actuelle</span>
                    </div>
                    <p className="font-semibold">{eleve.classeId.nom}</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 animate-fade-in-delay-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm opacity-80">Statut</span>
                    </div>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium animate-scale-in ${
                      eleve.statut === 'Actif' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                    }`}>
                      {eleve.statut}
                    </span>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 animate-fade-in-delay-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 2m8-2l2 2m-2-2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2h8a2 2 0 012 2z" />
                      </svg>
                      <span className="text-sm opacity-80">Informations</span>
                    </div>
                    <p className="text-sm">
                      {eleve.sexe === 'M' ? '♂' : '♀'} {eleve.sexe === 'M' ? 'Masculin' : 'Féminin'}
                    </p>
                    <p className="text-sm">{new Date(eleve.dateNaissance).toLocaleDateString("fr-FR")}</p>
                    <p className="text-sm">{eleve.lieuNaissance}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parcours scolaire */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mb-8 animate-slide-up hover-lift">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Parcours Scolaire</h2>
            </div>
          </div>
          <div className="p-6">
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Classe</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Année scolaire</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Date inscription</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Date sortie</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {eleve.parcours.map((p, index) => (
                    <tr key={p._id} className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${index % 2 === 0 ? 'bg-gray-50/50 dark:bg-gray-800/50' : ''}`}>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{p.classeId.nom}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{p.anneeScolaireId?.libelle || "-"}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{new Date(p.dateInscription).toLocaleDateString("fr-FR")}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{p.dateSortie ? new Date(p.dateSortie).toLocaleDateString("fr-FR") : "-"}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                          {p.typeInscription}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden space-y-4">
              {eleve.parcours.map((p, index) => (
                <div key={p._id} className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800 animate-card-delay hover-lift" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg text-emerald-800 dark:text-emerald-200">{p.classeId.nom}</h3>
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                      {p.typeInscription}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Année scolaire:</span> {p.anneeScolaireId?.libelle || "-"}</p>
                    <p><span className="font-medium">Date inscription:</span> {new Date(p.dateInscription).toLocaleDateString("fr-FR")}</p>
                    <p><span className="font-medium">Date sortie:</span> {p.dateSortie ? new Date(p.dateSortie).toLocaleDateString("fr-FR") : "-"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Paiements */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mb-8 animate-slide-up-delay-1 hover-lift">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Historique des Paiements</h2>
            </div>
          </div>
          <div className="p-6">
            {paiements.length ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {paiements.map((p, index) => (
                  <div key={p._id} className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800 animate-card-delay hover-lift" style={{animationDelay: `${index * 0.15}s`}}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-blue-800 dark:text-blue-200">{p.anneeScolaireId.libelle}</h3>
                      <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full">
                        {p.classeId.nom}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total</p>
                        <p className="font-bold text-gray-900 dark:text-white">{p.montantTotal?.toLocaleString()} GNF</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Payé</p>
                        <p className="font-bold text-green-600 dark:text-green-400">{p.montantPaye?.toLocaleString()} GNF</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Restant</p>
                        <p className="font-bold text-red-600 dark:text-red-400">{p.montantRestant?.toLocaleString()} GNF</p>
                      </div>
                    </div>

                    {/* Barre de progression */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>Progression</span>
                        <span>{((p.montantPaye / p.montantTotal) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(p.montantPaye / p.montantTotal) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Détails des paiements */}
                    {p.paiements && p.paiements.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Détails des versements:</p>
                        {p.paiements.map((pay, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs bg-white/50 dark:bg-gray-800/50 rounded-lg p-2">
                            <span className="font-medium">{pay.typePaiement}</span>
                            <div className="text-right">
                              <p className="font-bold">{pay.montant?.toLocaleString()} GNF</p>
                              <p className="text-gray-500">{new Date(pay.datePaiement).toLocaleDateString("fr-FR")}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400">Aucun paiement effectué</p>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mb-8 animate-slide-up-delay-2 hover-lift">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Relevé de Notes</h2>
            </div>
          </div>
          <div className="p-6">
            {notes.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {notes.map((n, index) => (
                  <div key={n._id} className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800 animate-card-delay hover-lift" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-purple-800 dark:text-purple-200">{n.matiereId.nom}</h3>
                      <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded-full">
                        Coef. {n.matiereId.coef || 1}
                      </span>
                    </div>
                    
                    <div className="text-center mb-4">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold animate-scale-in ${
                        n.valeur >= 16 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        n.valeur >= 14 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                        n.valeur >= 12 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        n.valeur >= 10 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`} style={{animationDelay: `${index * 0.1 + 0.3}s`}}>
                        {n.valeur}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Trimestre:</span>
                        <span className="font-medium">{n.trimestre}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Séquence:</span>
                        <span className="font-medium">{n.sequence}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Enseignant:</span>
                        <span className="font-medium">{n.enseignantId.nom} {n.enseignantId.prenom}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Année:</span>
                        <span className="font-medium">{n.anneeScolaireId.libelle}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400">Aucune note enregistrée</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailEleve;
