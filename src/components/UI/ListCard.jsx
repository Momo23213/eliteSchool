
function ListCard({ title, items }) {
  return (
     <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{title}</h3>
    {items.map((item, i) => (
      <div key={i} className="flex justify-between items-center py-2 border-b last:border-b-0 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors rounded-md px-2">
        <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
        <span className="text-gray-500 text-sm">{item.subtitle}</span>
        {item.extra && <span className="text-gray-400 text-xs">{item.extra}</span>}
      </div>
    ))}
  </div>
  )
}

export default ListCard