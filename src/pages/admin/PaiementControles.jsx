import React, { useEffect, useState } from 'react'

const getClasseNom = (classeId) =>
  typeof classeId === "object" && classeId !== null
    ? classeId.nom
    : typeof classeId === "string"
    ? classeId
    : "";
function PaiementControles() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://schoolelite.onrender.com/api/paiements/affiche")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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

  return (
    <div className="min-h-screen mt-10 w-full p-4 md:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-all duration-300">
       <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700 dark:text-blue-300">
        Contrôle des paiements des élèves
      </h1>
      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-300">Chargement...</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <table className="min-w-full text-xs sm:text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-2 py-2 border dark:border-gray-700">Année scolaire</th>
                <th className="px-2 py-2 border dark:border-gray-700">Photo</th>
                <th className="px-2 py-2 border dark:border-gray-700">Matricule</th>
                <th className="px-2 py-2 border dark:border-gray-700">Nom & Prénom</th>
                <th className="px-2 py-2 border dark:border-gray-700">Classe</th>
                <th className="px-2 py-2 border dark:border-gray-700">Inscription</th>
                <th className="px-2 py-2 border dark:border-gray-700">Réinscription</th>
                <th className="px-2 py-2 border dark:border-gray-700">Tranche 1</th>
                <th className="px-2 py-2 border dark:border-gray-700">Tranche 2</th>
                <th className="px-2 py-2 border dark:border-gray-700">Tranche 3</th>
                <th className="px-2 py-2 border dark:border-gray-700">Montant total</th>
                <th className="px-2 py-2 border dark:border-gray-700">Montant payé</th>
                <th className="px-2 py-2 border dark:border-gray-700">Reste à payer</th>
              </tr>
            </thead>
            <tbody>
              {data.map((el) => {
                const frais = el.eleveId.fraisId || {};
                return (
                  <tr key={el._id} className="text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <td className="px-2 py-2 border dark:border-gray-700">{el.anneeScolaireId?.libelle || ""}</td>
                    <td className="px-2 py-2 border dark:border-gray-700">
                      {el.eleveId.photo ? (
                        <img
                          src={`https://schoolelite.onrender.com${el.eleveId.photo}`}
                          alt="photo"
                          className="w-10 h-10 rounded-full object-cover mx-auto border border-gray-300 dark:border-gray-600"
                        />
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-2 py-2 border dark:border-gray-700">{el.eleveId.matricule}</td>
                    <td className="px-2 py-2 border dark:border-gray-700">
                      {el.eleveId.nom} {el.eleveId.prenom}
                    </td>
                    <td className="px-2 py-2 border dark:border-gray-700">
                      {getClasseNom(el.eleveId.classeId)}
                    </td>
                    <td className={`px-2 py-2 border dark:border-gray-700 ${getStatusColor(el, "inscription")}`}>
                      {frais.inscription?.toLocaleString("fr-FR") || "-"}
                    </td>
                    <td className={`px-2 py-2 border dark:border-gray-700 ${getStatusColor(el, "reinscription")}`}>
                      {el.eleveId.statut === "inscrit"
                        ? "-"
                        : montantReinscription
                        ? montantReinscription.toLocaleString("fr-FR")
                        : "0"}
                    </td>
                    <td className={`px-2 py-2 border dark:border-gray-700 ${getStatusColor(el, "tranche1")}`}>
                      {frais.tranche1?.toLocaleString("fr-FR") || "-"}
                    </td>
                    <td className={`px-2 py-2 border dark:border-gray-700 ${getStatusColor(el, "tranche2")}`}>
                      {frais.tranche2?.toLocaleString("fr-FR") || "-"}
                    </td>
                    <td className={`px-2 py-2 border dark:border-gray-700 ${getStatusColor(el, "tranche3")}`}>
                      {frais.tranche3?.toLocaleString("fr-FR") || "-"}
                    </td>
                    <td className="px-2 py-2 border dark:border-gray-700 font-bold">
                      {frais.montantTotal?.toLocaleString("fr-FR") || "-"}
                    </td>
                    <td className="px-2 py-2 border dark:border-gray-700 font-bold">
                      {el.montantPaye?.toLocaleString("fr-FR") || "0"}
                    </td>
                    <td className="px-2 py-2 border dark:border-gray-700 font-bold">
                      {el.montantRestant?.toLocaleString("fr-FR") || "0"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
        </div>
  )
}

export default PaiementControles