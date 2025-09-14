import React from 'react';
// types removed (was importing TS types) — runtime JS doesn't need these imports
import { Book, Calendar, GraduationCap } from 'lucide-react';


const StudentGradesDisplay = ({ eleve, notes, matieres }) => {
    const studentNotes = notes.filter(note => note.eleveId === eleve._id);

    const notesByTrimestre = studentNotes.reduce((acc, note) => {
        const trimestre = note.trimestre;
        if (!acc[trimestre]) {
            acc[trimestre] = [];
        }
        acc[trimestre].push(note);
        return acc;
    }, {} );

    const getMatiereNom = (id) => {
        const matiere = matieres.find(m => m._id === id);
        return matiere ? matiere.nom : "Matière inconnue";
    };

    const calculateAverage = (noteList) => {
        if (noteList.length === 0) return 0;
        const sum = noteList.reduce((acc, note) => acc + note.note, 0);
        return (sum / noteList.length).toFixed(2);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Notes de {eleve.prenom} {eleve.nom}
            </h2>

            {Object.keys(notesByTrimestre).length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">Aucune note trouvée pour cet élève.</p>
            ) : (
                <div className="space-y-8">
                    {Object.keys(notesByTrimestre).sort().map(trimestre => {
                        const trimestreNotes = notesByTrimestre[Number(trimestre)];
                        const trimestreAverage = calculateAverage(trimestreNotes);

                        const notesBySequence = trimestreNotes.reduce((acc, note) => {
                            const sequence = note.sequence;
                            if (!acc[sequence]) {
                                acc[sequence] = [];
                            }
                            acc[sequence].push(note);
                            return acc;
                        }, {} );

                        return (
                            <div key={trimestre} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">Trimestre {trimestre}</h3>
                                    <span className="text-md font-semibold text-gray-700 dark:text-gray-300">
                                        Moyenne du trimestre: <span className="text-blue-600 dark:text-blue-400">{trimestreAverage}</span>
                                    </span>
                                </div>
                                
                                {Object.keys(notesBySequence).sort().map(sequence => {
                                    const sequenceNotes = notesBySequence[Number(sequence)];
                                    const sequenceAverage = calculateAverage(sequenceNotes);
                                    
                                    return (
                                        <div key={`${trimestre}-${sequence}`} className="mb-6">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Séquence {sequence}</h4>
                                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Moyenne de la séquence: <span className="text-green-600 dark:text-green-400">{sequenceAverage}</span>
                                                </span>
                                            </div>

                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                                        <tr>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                                                <div className="flex items-center gap-1"><Book size={14} /> Matière</div>
                                                            </th>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                                                <div className="flex items-center gap-1"><GraduationCap size={14} /> Note</div>
                                                            </th>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                                                <div className="flex items-center gap-1"><Calendar size={14} /> Date</div>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                        {sequenceNotes.map(note => (
                                                            <tr key={note._id}>
                                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{getMatiereNom(note.matiereId)}</td>
                                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{note.note}</td>
                                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{note.date}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StudentGradesDisplay;