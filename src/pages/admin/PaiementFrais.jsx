import { useEffect, useState } from "react";
import fraiService from "../../services/fraisScolaire";
import FraiDisplay from './../../components/paiements/FraisDisplay';
import { Modal } from "../../components/Modal";
import EleveForm from "../../components/eleves/FomEleves";
import EditStudentForm from "../../components/eleves/EditStudentModal";
import { notifySuccess, notifyError, notifyInfo } from '../../components/toastService';
import { Loader2, AlertCircle } from 'lucide-react';
import FraisScolariteForm from "../../components/paiements/FraiFormulaire";

function PaiementFrais() {

   const [eleves, setEleves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEleve, setSelectedEleve] = useState(null);

  // Charger la liste des frais de scolarité
  const fetchEleves = async () => {
    try {
      setLoading(true);
      const data = await fraiService.getAllfrai();
      setEleves(data);
      notifySuccess(`${data.length} frais de scolarité chargés avec succès`);
    } catch (error) {
      console.error("Erreur lors du chargement des frais :", error);
      notifyError("Erreur lors du chargement des frais de scolarité");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEleves();
  }, []);

  // Actions sur les élèves
  const handleAdd = () => {
    setSelectedEleve(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (eleve) => {
    setSelectedEleve(eleve);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (frais) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer les frais de la classe ${frais.classeId.nom} pour l'année ${frais.anneeScolaireId.libelle} ?`)) return;

    try {
      // TODO: Implémenter la suppression via le service
      // await fraiService.remove(frais._id);
      // setEleves(prev => prev.filter(e => e._id !== frais._id));
      // toast.success('Frais supprimés avec succès');
      notifyInfo('Fonctionnalité de suppression en cours de développement');
    } catch (error) {
      console.error(error);
      notifyError("Impossible de supprimer les frais.");
    }
  };

  const closeAddModal = () => setIsAddModalOpen(false);
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEleve(null);
  };

  return (
    <div className="min-h-screen mt-15 md:mt-11 w-full p-4 md:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        {/* En-tête de la page */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Gestion des Frais de Scolarité
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configuration et gestion des frais par classe et année scolaire
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Chargement des frais de scolarité...
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Veuillez patienter pendant le chargement des données
            </p>
          </div>
        ) : eleves.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Aucun frais configuré
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">
              Commencez par ajouter des frais de scolarité pour vos classes
            </p>
            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Ajouter des frais
            </button>
          </div>
        ) : (
          <FraiDisplay
            eleves={eleves}
            onAddEleve={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onReinsEleve={() => notifyInfo("Fonctionnalité de réinscription en cours de développement")}
            onScolariteCheck={() => notifyInfo("Fonctionnalité de contrôle en cours de développement")}
          />
        )}

        {/* Modal Ajouter des frais */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          title="Ajouter des frais de scolarité"
        >
          <FraisScolariteForm
            onSuccess={() => {
              closeAddModal();
              fetchEleves();
              notifySuccess('Frais ajoutés avec succès');
            }}
          />
        </Modal>

        {/* Modal Modifier des frais */}
        {selectedEleve && (
          <Modal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            title="Modifier les frais de scolarité"
          >
            <EditStudentForm
              eleve={selectedEleve}
              onSuccess={() => {
                closeEditModal();
                fetchEleves();
                notifySuccess('Frais modifiés avec succès');
              }}
            />
          </Modal>
        )}
      </div>
    </div>
  )
}

export default PaiementFrais