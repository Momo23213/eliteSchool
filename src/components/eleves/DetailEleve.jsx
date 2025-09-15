import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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

  if (loading) return <p className="text-center py-10">Chargement...</p>;
  if (!eleve) return <p className="text-center py-10 text-red-500">Élève introuvable</p>;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Bouton retour */}
      <button
        onClick={() => navigate("/eleves")}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        ← Retour
      </button>

      {/* En-tête élève */}
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl shadow mb-6">
        {eleve.photo && (
          <img
            src={`${eleve.photo}`}
            alt="photo élève"
            className="w-24 h-24 rounded-full object-cover mb-4 md:mb-0"
          />
        )}
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold">{eleve.nom} {eleve.prenom}</h1>
          <p>Matricule : {eleve.matricule}</p>
          <p>Classe actuelle : {eleve.classeId.nom}</p>
          <p>Statut : {eleve.statut}</p>
          <p>Sexe : {eleve.sexe}</p>
          <p>Date de naissance : {new Date(eleve.dateNaissance).toLocaleDateString("fr-FR")}</p>
          <p>Lieu de naissance : {eleve.lieuNaissance}</p>
        </div>
      </div>

      {/* Parcours scolaire */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Parcours scolaire</h2>
        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full table-fixed bg-gray-100 dark:bg-gray-800 rounded-2xl shadow">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="px-4 py-2 text-left">Classe</th>
                <th className="px-4 py-2 text-left">Année scolaire</th>
                <th className="px-4 py-2 text-left">Date inscription</th>
                <th className="px-4 py-2 text-left">Date sortie</th>
                <th className="px-4 py-2 text-left">Type</th>
              </tr>
            </thead>
            <tbody>
              {eleve.parcours.map((p) => (
                <tr key={p._id} className="border-b border-gray-300 dark:border-gray-600">
                  <td className="px-4 py-2">{p.classeId.nom}</td>
                  <td className="px-4 py-2">{p.anneeScolaireId?.libelle || "-"}</td>
                  <td className="px-4 py-2">{new Date(p.dateInscription).toLocaleDateString("fr-FR")}</td>
                  <td className="px-4 py-2">{p.dateSortie ? new Date(p.dateSortie).toLocaleDateString("fr-FR") : "-"}</td>
                  <td className="px-4 py-2">{p.typeInscription}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {eleve.parcours.map((p) => (
            <div key={p._id} className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow p-4">
              <p className="font-semibold text-lg">{p.classeId.nom}</p>
              <p>Année scolaire : {p.anneeScolaireId?.libelle || "-"}</p>
              <p>Date inscription : {new Date(p.dateInscription).toLocaleDateString("fr-FR")}</p>
              <p>Date sortie : {p.dateSortie ? new Date(p.dateSortie).toLocaleDateString("fr-FR") : "-"}</p>
              <p>Type : {p.typeInscription}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Paiements */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Paiements</h2>
        {paiements.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paiements.map((p) => (
              <div key={p._id} className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow p-4">
                <p className="font-semibold">{p.anneeScolaireId.libelle} - {p.classeId.nom}</p>
                <p>Total : {p.montantTotal}</p>
                <p>Payé : {p.montantPaye}</p>
                <p>Restant : {p.montantRestant}</p>
                <div className="mt-2 space-y-1">
                  {p.paiements.map((pay, idx) => (
                    <div key={idx} className="text-sm">
                      {pay.typePaiement} : {pay.montant} ({new Date(pay.datePaiement).toLocaleDateString("fr-FR")})
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucun paiement effectué</p>
        )}
      </div>

      {/* Notes */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Notes</h2>
        {notes.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((n) => (
              <div key={n._id} className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow p-4">
                <p className="font-semibold">{n.matiereId.nom} ({n.matiereId.coef || 1})</p>
                <p>Valeur : {n.valeur}</p>
                <p>Trimestre : {n.trimestre}</p>
                <p>Sequence : {n.sequence}</p>
                <p>Enseignant : {n.enseignantId.nom} {n.enseignantId.prenom}</p>
                <p>Année scolaire : {n.anneeScolaireId.libelle}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucune note enregistrée</p>
        )}
      </div>
    </div>
  );
};

export default DetailEleve;
