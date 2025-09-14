





function Cards({ icon, title, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-300">
    {icon}
    <span className="text-2xl font-bold mt-2">{value}</span>
    <span className="text-gray-500 dark:text-gray-300">{title}</span>
  </div>
  )
}

export default Cards;