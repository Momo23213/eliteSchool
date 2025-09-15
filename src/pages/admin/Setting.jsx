import React, { useEffect, useState } from "react";
import { anneeService } from "../../services/annee";

function Setting() {
  const [annees, setAnnees] = useState([]);
  const [activeAnnee, setActiveAnnee] = useState(null);
  const [newAnnee, setNewAnnee] = useState({ libelle: "", dateDebut: "", dateFin: "", active: false });

  const [ecole, setEcole] = useState({
    nom: "Elite School",
    adresse: "Conakry, Guinée",
    logo: "",
  });

  useEffect(() => {
    fetchAnnees();
  }, []);

  const fetchAnnees = async () => {
    const allAnnees = await anneeService.getAll();
    const active = await anneeService.getActive().catch(() => null);
    setAnnees(allAnnees);
    setActiveAnnee(active);
  };

  const handleCreateAnnee = async () => {
    if (!newAnnee.libelle || !newAnnee.dateDebut || !newAnnee.dateFin) return;
    await anneeService.create(newAnnee);
    setNewAnnee({ libelle: "", dateDebut: "", dateFin: "", active: false });
    fetchAnnees();
  };

  const handleSetActive = async (id) => {
    await anneeService.setActive(id);
    fetchAnnees();
  };

  const handleEcoleChange = (e) => {
    const { name, value } = e.target;
    setEcole((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-all duration-300">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center md:text-left">Paramètres de l'école</h1>

        {/* Informations de l'école */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-4 transition-colors duration-300">
          <h2 className="text-xl font-semibold">Informations sur l'école</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="nom"
              value={ecole.nom}
              onChange={handleEcoleChange}
              placeholder="Nom de l'école"
              className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="adresse"
              value={ecole.adresse}
              onChange={handleEcoleChange}
              placeholder="Adresse"
              className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </section>

        {/* Gestion des années scolaires */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-4 transition-colors duration-300">
          <h2 className="text-xl font-semibold">Années scolaires</h2>

          {/* Formulaire création */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Libellé"
              value={newAnnee.libelle}
              onChange={(e) => setNewAnnee((prev) => ({ ...prev, libelle: e.target.value }))}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              placeholder="Date début"
              value={newAnnee.dateDebut}
              onChange={(e) => setNewAnnee((prev) => ({ ...prev, dateDebut: e.target.value }))}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              placeholder="Date fin"
              value={newAnnee.dateFin}
              onChange={(e) => setNewAnnee((prev) => ({ ...prev, dateFin: e.target.value }))}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={newAnnee.active}
                  onChange={(e) => setNewAnnee((prev) => ({ ...prev, active: e.target.checked }))}
                  className="accent-blue-600"
                />
                Active
              </label>
              <button
                onClick={handleCreateAnnee}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Ajouter
              </button>
            </div>
          </div>

          {/* Liste des années */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {annees.map((annee) => (
              <div
                key={annee._id}
                className={`flex justify-between items-center p-3 rounded-lg border transition-colors duration-300 ${
                  annee._id === activeAnnee?._id
                    ? "bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-700 text-green-800 dark:text-green-300"
                    : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                }`}
              >
                <span className="font-medium">{annee.libelle} ({annee.statut})</span>
                {annee._id !== activeAnnee?._id && (
                  <button
                    onClick={() => handleSetActive(annee._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition-colors duration-200 text-sm"
                  >
                    Activer
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Setting;
