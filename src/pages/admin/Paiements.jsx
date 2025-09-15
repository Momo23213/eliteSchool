import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import fraisScolaireService from '../../services/fraisScolaire';
import paiementService from '../../services/paiementService';
import { 
  CreditCard, 
  User, 
  Users, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Receipt,
  Search,
  Filter,
  Plus,
  X,
  UserCheck,
  Loader2
} from 'lucide-react';

function Paiements() {
  const { classes, eleves, fetchElevesByClasse, annesActive } = useSchool();
  const [selectedClasse, setSelectedClasse] = useState('');
  const [selectedAnnee, setSelectedAnnee] = useState('');
  const [selectedEleve, setSelectedEleve] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEleveModal, setShowEleveModal] = useState(false);
  const [paiementData, setPaiementData] = useState({
    montant: '',
    type: 'scolarite',
    mois: '',
    description: ''
  });
  const [classePayments, setClassePayments] = useState({
    inscription: 0,
    reinscription: 0,
    tranche1: 0,
    tranche2: 0,
    tranche3: 0,
    montantTotal: 0
  });
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [eleveHistorique, setEleveHistorique] = useState(null);
  const [loadingHistorique, setLoadingHistorique] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Les classes sont déjà chargées automatiquement par le SchoolContext

  // Initialiser l'année sélectionnée avec la première année active
  useEffect(() => {
    if (annesActive && annesActive.length > 0 && !selectedAnnee) {
      setSelectedAnnee(annesActive[0]._id);
    }
  }, [annesActive]);

  useEffect(() => {
    if (selectedClasse) {
      fetchElevesByClasse(selectedClasse);
    }
    if (selectedClasse && selectedAnnee) {
      fetchClassePayments();
    }
  }, [selectedClasse, selectedAnnee]);

  const fetchClassePayments = async () => {
    if (!selectedClasse || !selectedAnnee) return;
    
    try {
      setLoadingPayments(true);
      const response = await fraisScolaireService.getfraiByClasse(selectedClasse, selectedAnnee);
      
      // Traiter les données selon la structure API réelle
      const payments = {
        inscription: 0,
        reinscription: 0,
        tranche1: 0,
        tranche2: 0,
        tranche3: 0,
        montantTotal: 0
      };

      if (response && response.frais) {
        const frais = response.frais;
        payments.inscription = parseFloat(frais.inscription) || 0;
        payments.reinscription = parseFloat(frais.reinscription) || 0;
        payments.tranche1 = parseFloat(frais.tranche1) || 0;
        payments.tranche2 = parseFloat(frais.tranche2) || 0;
        payments.tranche3 = parseFloat(frais.tranche3) || 0;
        payments.montantTotal = parseFloat(frais.montantTotal) || 0;
      }

      setClassePayments(payments);
    } catch (error) {
      console.error('Erreur lors du chargement des frais de la classe:', error);
      // Garder les valeurs par défaut en cas d'erreur
    } finally {
      setLoadingPayments(false);
    }
  };

  const handleSelectEleve = async (eleve) => {
    setSelectedEleve(eleve);
    setShowEleveModal(false);
    
    // Charger l'historique des paiements de l'élève
    try {
      setLoadingHistorique(true);
      const historique = await paiementService.getByEleve(eleve._id);
      setEleveHistorique(historique);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
      setEleveHistorique(null);
    } finally {
      setLoadingHistorique(false);
    }
    setSearchTerm('');
  };

  const filteredEleves = eleves.filter(eleve =>
    eleve.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eleve.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eleve.matricule?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
  };

  const handlePaiement = async () => {
    if (!selectedEleve || !paiementData.montant || !selectedClasse || !selectedAnnee) {
      showToast('Veuillez remplir tous les champs requis', 'error');
      return;
    }
    
    try {
      const paiementPayload = {
        eleveId: selectedEleve._id,
        classeId: selectedClasse,
        anneeScolaireId: selectedAnnee,
        typePaiement: paiementData.type,
        montant: parseFloat(paiementData.montant)
      };

      await paiementService.ajouter(paiementPayload);
      showToast(`Paiement de ${paiementData.montant} GNF enregistré avec succès pour ${selectedEleve.prenom} ${selectedEleve.nom}`, 'success');
      
      // Recharger l'historique de l'élève
      const historique = await paiementService.getByEleve(selectedEleve._id);
      setEleveHistorique(historique);
      
      // Mettre à jour les détails de paiement de la classe
      fetchClassePayments();
      
      // Réinitialiser le formulaire
      setPaiementData({
        montant: '',
        type: 'inscription',
        mois: '',
        description: ''
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du paiement:', error);
      showToast('Erreur lors de l\'enregistrement du paiement. Veuillez réessayer.', 'error');
    }
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-gray-900 dark:text-white transition-all duration-300">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        
        {/* En-tête */}
        <div className="text-center md:text-left animate-slide-up">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg animate-float">
              <CreditCard className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Gestion des Paiements
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Gérez les paiements des élèves et suivez les statistiques</p>
        </div>

        {/* Sélection de classe et année */}
        <div className="backdrop-blur-md bg-white/70 dark:bg-gray-800/70 p-4 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 animate-slide-up" style={{animationDelay: '0.1s'}}>
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Sélecteur de classe */}
            <div className="flex flex-col md:flex-row gap-2 items-center flex-1">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <label className="font-medium text-gray-700 dark:text-gray-300">Classe:</label>
              </div>
              <select
                value={selectedClasse}
                onChange={(e) => setSelectedClasse(e.target.value)}
                className="flex-1 min-w-[200px] p-3 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300"
              >
                <option value="">Sélectionner une classe</option>
                {classes.map((classe) => (
                  <option key={classe._id} value={classe._id}>
                    {classe.nom} - {classe.niveau}
                  </option>
                ))}
              </select>
            </div>

            {/* Sélecteur d'année scolaire */}
            <div className="flex flex-col md:flex-row gap-2 items-center flex-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <label className="font-medium text-gray-700 dark:text-gray-300">Année:</label>
              </div>
              <select
                value={selectedAnnee}
                onChange={(e) => setSelectedAnnee(e.target.value)}
                className="flex-1 min-w-[200px] p-3 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
              >
                <option value="">Sélectionner une année</option>
                {annesActive && annesActive.map((annee) => (
                  <option key={annee._id} value={annee._id}>
                    {annee.libelle}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {selectedClasse && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Section 1: Sélection d'élève */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Bouton de sélection d'élève */}
              <div className="backdrop-blur-md bg-white/70 dark:bg-gray-800/70 p-6 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Sélectionner un Élève
                  </h2>
                </div>
                
                <button
                  onClick={() => setShowEleveModal(true)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium"
                >
                  <Search className="w-5 h-5" />
                  Choisir un élève
                </button>
              </div>

              {/* Informations de l'élève sélectionné */}
              {selectedEleve && (
                <div className="backdrop-blur-md bg-white/70 dark:bg-gray-800/70 p-6 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 animate-slide-up" style={{animationDelay: '0.3s'}}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                      <User className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Élève Sélectionné
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xl">
                        {selectedEleve.prenom?.[0]}{selectedEleve.nom?.[0]}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{selectedEleve.prenom} {selectedEleve.nom}</h3>
                        <p className="text-gray-600 dark:text-gray-400">Matricule: {selectedEleve.matricule}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Âge</p>
                        <p className="font-semibold">{selectedEleve.age || 'N/A'} ans</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Statut</p>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="font-semibold text-green-600 dark:text-green-400">Actif</span>
                        </div>
                      </div>
                    </div>

                    {/* Historique des paiements */}
                    {loadingHistorique ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Chargement de l'historique...</span>
                        </div>
                      </div>
                    ) : eleveHistorique && eleveHistorique.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                          <Receipt className="w-4 h-4" />
                          Historique des Paiements
                        </h4>
                        
                        {eleveHistorique.map((historique) => (
                          <div key={historique._id} className="p-4 rounded-xl bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-700/30 dark:to-gray-600/30 border border-gray-200/30 dark:border-gray-600/30">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                  {historique.anneeScolaireId.libelle}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {historique.classeId.nom} - {historique.classeId.niveau}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Montant Total</p>
                                <p className="font-bold text-lg">{historique.montantTotal.toLocaleString()} GNF</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <div className="p-2 rounded-lg bg-green-50/50 dark:bg-green-900/20">
                                <p className="text-xs text-green-600 dark:text-green-400">Payé</p>
                                <p className="font-semibold text-green-700 dark:text-green-300">{historique.montantPaye.toLocaleString()} GNF</p>
                              </div>
                              <div className="p-2 rounded-lg bg-red-50/50 dark:bg-red-900/20">
                                <p className="text-xs text-red-600 dark:text-red-400">Restant</p>
                                <p className="font-semibold text-red-700 dark:text-red-300">{historique.montantRestant.toLocaleString()} GNF</p>
                              </div>
                            </div>

                            {historique.paiements && historique.paiements.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Détail des paiements</p>
                                {historique.paiements.map((paiement) => (
                                  <div key={paiement._id} className="flex justify-between items-center p-2 rounded-lg bg-white/50 dark:bg-gray-800/50">
                                    <div>
                                      <span className="text-sm font-medium capitalize">{paiement.typePaiement}</span>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(paiement.datePaiement).toLocaleDateString('fr-FR')}
                                      </p>
                                    </div>
                                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                                      {paiement.montant.toLocaleString()} GNF
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : selectedEleve && (
                      <div className="p-4 rounded-xl bg-gray-50/50 dark:bg-gray-700/30 text-center">
                        <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 dark:text-gray-400">Aucun historique de paiement trouvé</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Détails de paiement de la classe */}
            <div className="lg:col-span-1">
              <div className="backdrop-blur-md bg-white/70 dark:bg-gray-800/70 p-6 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 animate-slide-up" style={{animationDelay: '0.4s'}}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Détails de Paiement
                  </h2>
                </div>
                
                {loadingPayments ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="text-lg">Chargement des frais...</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/30 dark:border-blue-700/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-6 h-6 text-blue-600" />
                          <span className="font-medium">Inscription</span>
                        </div>
                        <span className="text-xl font-bold text-blue-600">{classePayments.inscription.toLocaleString()} GNF</span>
                      </div>
                    </div>
                  
                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/30 dark:border-purple-700/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-purple-600" />
                        <span className="font-medium">Réinscription</span>
                      </div>
                      <span className="text-xl font-bold text-purple-600">{classePayments.reinscription.toLocaleString()} GNF</span>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/30 dark:border-green-700/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-6 h-6 text-green-600" />
                        <span className="font-medium">Tranche 1</span>
                      </div>
                      <span className="text-xl font-bold text-green-600">{classePayments.tranche1.toLocaleString()} GNF</span>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-50/50 to-orange-50/50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200/30 dark:border-yellow-700/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-6 h-6 text-yellow-600" />
                        <span className="font-medium">Tranche 2</span>
                      </div>
                      <span className="text-xl font-bold text-yellow-600">{classePayments.tranche2.toLocaleString()} GNF</span>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-gradient-to-r from-red-50/50 to-pink-50/50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200/30 dark:border-red-700/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-6 h-6 text-red-600" />
                        <span className="font-medium">Tranche 3</span>
                      </div>
                      <span className="text-xl font-bold text-red-600">{classePayments.tranche3.toLocaleString()} GNF</span>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-gradient-to-r from-gray-100/80 to-gray-200/80 dark:from-gray-700/50 dark:to-gray-600/50 border-2 border-gray-300/50 dark:border-gray-500/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        <span className="font-bold text-lg">Montant Total</span>
                      </div>
                      <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">{classePayments.montantTotal.toLocaleString()} GNF</span>
                    </div>
                  </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Interface de paiement */}
            <div className="lg:col-span-1">
              <div className="backdrop-blur-md bg-white/70 dark:bg-gray-800/70 p-6 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 animate-slide-up" style={{animationDelay: '0.5s'}}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Enregistrer un Paiement
                  </h2>
                </div>
                
                {selectedEleve ? (
                  <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/30">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Élève sélectionné:</p>
                      <p className="font-semibold">{selectedEleve.prenom} {selectedEleve.nom}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Type de paiement
                        </label>
                        <select
                          value={paiementData.type}
                          onChange={(e) => setPaiementData({...paiementData, type: e.target.value})}
                          className="w-full p-3 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300"
                        >
                          <option value="scolarite">Frais de scolarité</option>
                          <option value="inscription">Frais d'inscription</option>
                          <option value="transport">Transport</option>
                          <option value="cantine">Cantine</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Montant (GNF)
                        </label>
                        <input
                          type="number"
                          placeholder="Ex: 50000"
                          value={paiementData.montant}
                          onChange={(e) => setPaiementData({...paiementData, montant: e.target.value})}
                          className="w-full p-3 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Mois concerné
                        </label>
                        <input
                          type="month"
                          value={paiementData.mois}
                          onChange={(e) => setPaiementData({...paiementData, mois: e.target.value})}
                          className="w-full p-3 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Description (optionnel)
                        </label>
                        <textarea
                          placeholder="Détails du paiement..."
                          value={paiementData.description}
                          onChange={(e) => setPaiementData({...paiementData, description: e.target.value})}
                          rows={3}
                          className="w-full p-3 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 resize-none"
                        />
                      </div>
                      
                      <button
                        onClick={handlePaiement}
                        disabled={!paiementData.montant}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium disabled:hover:scale-100"
                      >
                        <Plus className="w-5 h-5" />
                        Enregistrer le Paiement
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <User className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Sélectionnez un élève</p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Choisissez un élève dans la liste pour enregistrer un paiement</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {!selectedClasse && (
          <div className="text-center py-16">
            <CreditCard className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-600 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">Sélectionnez une classe</h2>
            <p className="text-gray-500 dark:text-gray-500">Choisissez une classe pour commencer à gérer les paiements</p>
          </div>
        )}

        {/* Modal de sélection d'élève */}
        {showEleveModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="backdrop-blur-md bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/30 w-full max-w-2xl max-h-[80vh] overflow-hidden animate-scale-in">
              
              {/* En-tête du modal */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                    <Search className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Sélectionner un Élève
                  </h3>
                </div>
                <button
                  onClick={() => setShowEleveModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Contenu du modal */}
              <div className="p-6">
                {/* Barre de recherche */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Rechercher par nom, prénom ou matricule..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                    autoFocus
                  />
                </div>

                {/* Liste des élèves */}
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {filteredEleves.length > 0 ? (
                    filteredEleves.map((eleve, index) => (
                      <div
                        key={eleve._id}
                        onClick={() => handleSelectEleve(eleve)}
                        className="p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 bg-white/60 dark:bg-gray-700/60 hover:bg-white/80 dark:hover:bg-gray-700/80 border border-white/30 dark:border-gray-600/30 animate-slide-up"
                        style={{animationDelay: `${index * 0.05}s`}}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                            {eleve.prenom?.[0]}{eleve.nom?.[0]}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {eleve.prenom} {eleve.nom}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Matricule: {eleve.matricule}
                            </p>
                            {eleve.age && (
                              <p className="text-sm text-gray-500 dark:text-gray-500">
                                Âge: {eleve.age} ans
                              </p>
                            )}
                          </div>
                          <div className="text-blue-600 dark:text-blue-400">
                            <UserCheck className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <User className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 text-lg">
                        {searchTerm ? 'Aucun élève trouvé' : 'Aucun élève dans cette classe'}
                      </p>
                      {searchTerm && (
                        <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                          Essayez avec un autre terme de recherche
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Pied du modal */}
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200/50 dark:border-gray-700/50">
                <button
                  onClick={() => setShowEleveModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-200/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toast.show && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border backdrop-blur-md animate-slide-in-right ${
            toast.type === 'success' 
              ? 'bg-green-50/90 dark:bg-green-900/90 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200'
              : 'bg-red-50/90 dark:bg-red-900/90 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200'
          }`}>
            <div className="flex items-center gap-3">
              {toast.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              )}
              <p className="font-medium">{toast.message}</p>
              <button
                onClick={() => setToast({ show: false, message: '', type: '' })}
                className="ml-2 p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Paiements;