
import React from 'react'
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell } from 'recharts'

function GrBar({occupancyData,titre}) {
  return (
     <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            {titre}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={occupancyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="dark:text-gray-700" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Occupation" radius={[4, 4, 0, 0]}>
                {occupancyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
  )
}

export default GrBar