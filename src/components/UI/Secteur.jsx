import React from 'react'
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from 'recharts'

function Secteur() {


     const levelData = [
    { name: '6ème', value: 45, color: '#3B82F6' },
    { name: '5ème', value: 38, color: '#10B981' },
    { name: '4ème', value: 42, color: '#F59E0B' },
    { name: '3ème', value: 35, color: '#EF4444' },
  ];


  return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            la repartition des eleves par classe
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={levelData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {levelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

  )
}

export default Secteur