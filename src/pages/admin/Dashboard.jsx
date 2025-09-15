import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("https://schoolelite.onrender.com/api/statistiques");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700 dark:text-gray-300">
        Chargement...
      </div>
    );
  }

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

  // Préparer les données pour les graphiques
  const barDataClasse = stats.classes?.map(c => ({
    nom: c.nom,
    nbEleves: c.nbEleves
  })) || [];

  const pieData = [
    { name: "Revenu Actuel", value: stats.revenuActuel },
    { name: "Revenu Restant", value: stats.revenuRestant }
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Dashboard École</h1>

      {/* Stats globales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">Total Élèves</p>
          <p className="text-2xl font-bold">{stats.totalEleves}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">Total Classes</p>
          <p className="text-2xl font-bold">{stats.totalClasses}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">Revenu Annuel</p>
          <p className="text-2xl font-bold">{stats.revenuAnnuel.toLocaleString()} GNF</p>
        </div>
      </div>

      {/* Graphique Bar : Élèves par Classe */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Nombre d'élèves par classe</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barDataClasse}>
            <XAxis dataKey="nom" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="nbEleves" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique Pie : Revenu actuel vs restant */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Revenu Actuel vs Restant</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => value.toLocaleString() + " GNF"} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
