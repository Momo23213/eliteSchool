import { faBook, faChalkboardTeacher, faMoneyBillWave, faUserGraduate } from "@fortawesome/free-solid-svg-icons";

function ActionRapide() {

    const quickActions = [
    {
      title: 'Inscrire un élève',
      description: 'Ajouter un nouvel élève',
      icon: <FontAwesomeIcon icon={faUserGraduate} className="text-2xl" />,
      color: 'bg-blue-500',
      path: '/eleves'
    },
    {
      title: 'Ajouter un enseignant',
      description: 'Enregistrer un nouveau professeur',
      icon: <FontAwesomeIcon icon={faChalkboardTeacher} className="text-2xl" />,
      color: 'bg-purple-500',
      path: '/enseignants'
    },
    {
      title: 'Créer une matière',
      description: 'Ajouter une nouvelle matière',
      icon: <FontAwesomeIcon icon={faBook} className="text-2xl" />,
      color: 'bg-green-500',
      path: '/matieres'
    },
    {
      title: 'Enregistrer un paiement',
      description: 'Saisir un nouveau paiement',
      icon: <FontAwesomeIcon icon={faMoneyBillWave} className="text-2xl" />,
      color: 'bg-yellow-500',
      path: '/paiements'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Actions rapides
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                {action.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {action.description}
              </p>
            </button>
          ))}
        </div>
      </div>
  )
}

export default ActionRapide