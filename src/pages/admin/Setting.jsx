import React, { useEffect, useState } from "react";
import  anneeService  from "../../services/annee";
import { School, Calendar, Plus, Check, Settings, Loader2 } from "lucide-react";

function Setting() {
  const [annees, setAnnees] = useState([]);
  const [activeAnnee, setActiveAnnee] = useState(null);
  const [newAnnee, setNewAnnee] = useState({ libelle: "", dateDebut: "", dateFin: "", active: false });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const [ecole, setEcole] = useState({
    nom: "Elite School",
    adresse: "Conakry, Guinée",
    logo: "",
  });

  useEffect(() => {
    fetchAnnees();
  }, []);

  const fetchAnnees = async () => {
    try {
      setLoading(true);
      setError(null);
      const allAnnees = await anneeService.getAll();
      const active = await anneeService.getActive().catch(() => null);
      setAnnees(allAnnees || []);
      setActiveAnnee(active);
    } catch (err) {
      console.error('Erreur lors du chargement des années:', err);
      setError('Erreur lors du chargement des années scolaires');
      setAnnees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnee = async () => {
    if (!newAnnee.libelle || !newAnnee.dateDebut || !newAnnee.dateFin) return;
    try {
      setCreating(true);
      await anneeService.create(newAnnee);
      setNewAnnee({ libelle: "", dateDebut: "", dateFin: "", active: false });
      await fetchAnnees();
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      setError('Erreur lors de la création de l\'année scolaire');
    } finally {
      setCreating(false);
    }
  };

  const handleSetActive = async (id) => {
    try {
      await anneeService.setActive(id);
      await fetchAnnees();
    } catch (err) {
      console.error('Erreur lors de l\'activation:', err);
      setError('Erreur lors de l\'activation de l\'année scolaire');
    }
  };

  const handleEcoleChange = (e) => {
    const { name, value } = e.target;
    setEcole((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen mt-15 md:mt-11 w-full p-4 md:p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-gray-900 dark:text-white transition-all duration-300">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center md:text-left animate-slide-up">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg animate-float">
              <Settings className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Paramètres de l'école
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Gérez les informations de votre établissement</p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="backdrop-blur-md bg-red-100/70 dark:bg-red-900/70 border border-red-300/50 dark:border-red-700/50 text-red-800 dark:text-red-200 px-4 py-3 rounded-xl animate-slide-up">
            <p className="font-medium">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-sm underline hover:no-underline mt-1"
            >
              Fermer
            </button>
          </div>
        )}

        {/* Informations de l'école */}
        <section className="backdrop-blur-md bg-white/70 dark:bg-gray-800/70 p-6 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 space-y-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] animate-slide-up" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <School className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Informations sur l'école
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nom de l'école</label>
              <input
                type="text"
                name="nom"
                value={ecole.nom}
                onChange={handleEcoleChange}
                placeholder="Nom de l'école"
                className="w-full p-3 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-700/70"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Adresse</label>
              <input
                type="text"
                name="adresse"
                value={ecole.adresse}
                onChange={handleEcoleChange}
                placeholder="Adresse"
                className="w-full p-3 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-700/70"
              />
            </div>
          </div>
        </section>

        {/* Gestion des années scolaires */}
        <section className="backdrop-blur-md bg-white/70 dark:bg-gray-800/70 p-6 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 space-y-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] animate-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Années scolaires
            </h2>
          </div>

          {/* Formulaire création */}
          <div className="backdrop-blur-sm bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-gray-700/30 dark:to-gray-600/30 p-4 rounded-xl border border-white/30 dark:border-gray-600/30">
            <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Ajouter une nouvelle année</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Libellé</label>
                <input
                  type="text"
                  placeholder="Ex: 2024-2025"
                  value={newAnnee.libelle}
                  onChange={(e) => setNewAnnee((prev) => ({ ...prev, libelle: e.target.value }))}
                  className="w-full p-3 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date début</label>
                <input
                  type="date"
                  value={newAnnee.dateDebut}
                  onChange={(e) => setNewAnnee((prev) => ({ ...prev, dateDebut: e.target.value }))}
                  className="w-full p-3 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date fin</label>
                <input
                  type="date"
                  value={newAnnee.dateFin}
                  onChange={(e) => setNewAnnee((prev) => ({ ...prev, dateFin: e.target.value }))}
                  className="w-full p-3 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Options</label>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={newAnnee.active}
                      onChange={(e) => setNewAnnee((prev) => ({ ...prev, active: e.target.checked }))}
                      className="w-4 h-4 text-purple-600 bg-white/50 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    Année active
                  </label>
                  <button
                    onClick={handleCreateAnnee}
                    disabled={creating}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium disabled:hover:scale-100"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Création...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Ajouter
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des années */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Années existantes</h3>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-lg">Chargement des années scolaires...</span>
                </div>
              </div>
            ) : annees.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">Aucune année scolaire trouvée</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Créez votre première année scolaire ci-dessus</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {annees.map((annee, index) => (
                <div
                  key={annee._id}
                  className={`backdrop-blur-sm p-4 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-lg animate-slide-up ${
                    annee._id === activeAnnee?._id
                      ? "bg-gradient-to-r from-green-100/80 to-emerald-100/80 dark:from-green-900/50 dark:to-emerald-900/50 border-green-400/50 dark:border-green-600/50 shadow-green-200/50 dark:shadow-green-800/50"
                      : "bg-white/60 dark:bg-gray-700/60 border-white/30 dark:border-gray-600/30"
                  }`}
                  style={{animationDelay: `${0.3 + index * 0.1}s`}}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        annee._id === activeAnnee?._id
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                          : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                      }`}>
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {annee.libelle}
                        </span>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {annee.statut}
                        </div>
                      </div>
                    </div>
                    {annee._id === activeAnnee?._id ? (
                      <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-medium">
                        <Check className="w-4 h-4" />
                        Active
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSetActive(annee._id)}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-3 py-1 rounded-full transition-all duration-300 transform hover:scale-105 text-sm font-medium"
                      >
                        <Check className="w-4 h-4" />
                        Activer
                      </button>
                    )}
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Setting;
