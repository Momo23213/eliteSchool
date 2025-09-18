import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, AreaChart, Area
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
        console.error("Erreur lors du chargement des statistiques:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);


  if (loading || !stats) {
    return (
      <div className="mt-15 md:mt-11 flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Chargement des données...</p>
        </div>
      </div>
    );
  }

  const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];
  const GRADIENT_COLORS = ["#4f46e5", "#7c3aed", "#0891b2", "#059669"];

  // Données graphiques → prennent directement les valeurs du backend (pas les compteurs animés)
  const barDataClasse = stats.classes?.map(c => ({
    nom: c.nom,
    nbEleves: c.nbEleves
  })) || [];

  const sexeData = stats.sexeStats?.map(s => ({
    name: s._id === "M" ? "Garçons" : "Filles",
    value: s.count
  })) || [];
  
  console.log("sexeData transformé:", sexeData);

  const pieRevenue = [
    { name: "Revenu Actuel", value: stats.revenuActuel },
    { name: "Revenu Restant", value: stats.revenuRestant }
  ];

  return (
    <div className="min-h-screen mt-15 md:mt-11 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Dashboard École Elite</h1>
              <p className="text-indigo-100 mt-1">Vue d'ensemble des statistiques scolaires</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques globales améliorées */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card Élèves */}
          <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Élèves</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats?.totalEleves || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full px-2 py-1">
                  <span className="text-xs font-medium text-blue-800 dark:text-blue-300">Actifs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Classes */}
          <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Classes</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats?.totalClasses || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full px-2 py-1">
                  <span className="text-xs font-medium text-purple-800 dark:text-purple-300">Ouvertes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Revenu Annuel */}
          <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Revenu Annuel</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats?.revenuAnnuel?.toLocaleString() || 0} GNF</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <div className="bg-green-100 dark:bg-green-900/30 rounded-full px-2 py-1">
                  <span className="text-xs font-medium text-green-800 dark:text-green-300">Objectif</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Revenu Actuel */}
          <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-cyan-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Revenu Actuel</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats?.revenuActuel?.toLocaleString() || 0} GNF</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <div className="bg-cyan-100 dark:bg-cyan-900/30 rounded-full px-2 py-1">
                  <span className="text-xs font-medium text-cyan-800 dark:text-cyan-300">Collecté</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Graphiques en grille */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Élèves par Classe */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Élèves par Classe</h2>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={barDataClasse} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="nom" 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}
                  />
                  <Bar 
                    dataKey="nbEleves" 
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Répartition Filles/Garçons */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-rose-600 px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Répartition par Genre</h2>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <defs>
                    <linearGradient id="maleGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                    <linearGradient id="femaleGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#be185d" />
                    </linearGradient>
                  </defs>
                  <Pie 
                    data={sexeData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={120}
                    innerRadius={60}
                    paddingAngle={5}
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {sexeData.map((entry, index) => (
                      <Cell 
                        key={index} 
                        fill={entry.name === "Garçons" ? "url(#maleGradient)" : "url(#femaleGradient)"} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Revenus - Section complète */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Analyse des Revenus</h2>
              </div>
              <div className="text-right">
                <p className="text-emerald-100 text-sm">Progression</p>
                <p className="text-white font-bold">
                  {((stats.revenuActuel / stats.revenuAnnuel) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Graphique en secteurs */}
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <defs>
                      <linearGradient id="currentRevenue" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <linearGradient id="remainingRevenue" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                    </defs>
                    <Pie 
                      data={pieRevenue} 
                      dataKey="value" 
                      nameKey="name" 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={100}
                      innerRadius={50}
                      paddingAngle={5}
                    >
                      {pieRevenue.map((entry, index) => (
                        <Cell 
                          key={index} 
                          fill={entry.name === "Revenu Actuel" ? "url(#currentRevenue)" : "url(#remainingRevenue)"} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => value.toLocaleString() + " GNF"}
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Statistiques détaillées */}
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">Revenu Collecté</p>
                      <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                        {stats.revenuActuel.toLocaleString()} GNF
                      </p>
                    </div>
                    <div className="bg-green-500 rounded-full p-2">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Revenu Restant</p>
                      <p className="text-2xl font-bold text-amber-800 dark:text-amber-200">
                        {stats.revenuRestant.toLocaleString()} GNF
                      </p>
                    </div>
                    <div className="bg-amber-500 rounded-full p-2">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Barre de progression */}
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Progression Annuelle</span>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      {((stats.revenuActuel / stats.revenuAnnuel) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${(stats.revenuActuel / stats.revenuAnnuel) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
