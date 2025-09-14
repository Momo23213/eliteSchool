import { BookOpen, CheckCircle, GraduationCap, Users } from 'lucide-react'
import Cards from '../../components/UI/Card'
import Secteur from '../../components/UI/Secteur'


function Dashboard() {
  return (
    <div className="min-h-screen mt-10 w-full p-4 md:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-all duration-300">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Dashboard École</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Cards icon={<Users className="w-10 h-10 text-blue-500" />} title="Élèves" value={100} />
        <Cards icon={<GraduationCap className="w-10 h-10 text-purple-500" />} title="Classes" value={100} />
        <Cards icon={<BookOpen className="w-10 h-10 text-green-500" />} title="Matières" value={100} />
        <Cards icon={<CheckCircle className="w-10 h-10 text-orange-500" />} title="Occupation totale" value={100} />
        </div>

        <div>
          <Secteur/>
        </div>
    </div>
  )
}

export default Dashboard