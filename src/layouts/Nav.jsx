// src/components/Navbar.tsx
import { useState, useEffect } from 'react';
import { Navigate, NavLink } from 'react-router-dom';
import {
  Menu, X, Home, Users, BookOpen, Book, GraduationCap, DollarSign, User, Sun, Moon,
  LogOut, Calendar, ChevronDown, WalletCards,
  MessageCircle,
  Calendar1,
  Star,
  School
} from 'lucide-react';
// import { useAuth } from '../context/AuthContext';



const Navbar = () => {
  // const { user, logout } = useAuth();
  const user={role:"admin"}
  const [isOpen, setIsOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  // ------------------------------
  // Définition des menus par rôle
  // ------------------------------
  let navGroups = [];
  let navMobileLinks = [];

  if (user.role === 'admin') {
    navGroups = [
      {
        label: "Accueil",
        icon: Home,
        items: [{ name: "Tableau de bord", path: "/admin/dashboard", icon: Home }]
      },
      {
        label: "Scolarité",
        icon: GraduationCap,
        items: [
          { name: "Élèves", path: "/eleves", icon: Users },
          { name: "Classes", path: "/classes", icon: BookOpen },
          { name: "Enseignants", path: "/enseignants", icon: GraduationCap },
          { name: "Matières", path: "/matieres", icon: Book }
        ]
      },
      {
        label: "Notes",
        icon: BookOpen,
        items: [
          { name: "Notes", path: "/notes", icon: BookOpen },
          { name: "Résultats", path: "/notes_resultats", icon: BookOpen },
          { name: "Saisie", path: "/notes_saisie", icon: BookOpen }
        ]
      },
      {
        label: "Comptabilité",
        icon: DollarSign,
        items: [
          { name: "Paiements", path: "/paiements", icon: DollarSign },
          { name: "Contrôle Scolaire", path: "/controleScolaire", icon: DollarSign },
          { name: "Frai Scolaire", path: "/fraiScolaire", icon: WalletCards },
          { name: "Calendrier", path: "/calendrier", icon: Calendar },
          { name: "Emploi du temps", path: "/emploi-du-temps", icon: Calendar }
        ]
      },
      {
        label: "Setting",
        icon: User,
        items: [
          { name: "Mon Ecole", path: "/setting", icon: User },
        ]
      }
    ];

    navMobileLinks = [
      { name: "Tableau de bord", path: "/", icon: Home },
      { name: "Élèves", path: "/eleves", icon: Users },
      { name: "Enseignants", path: "/enseignants", icon: GraduationCap },
      { name: "Classes", path: "/classes", icon: BookOpen },
      { name: "Matières", path: "/matieres", icon: Book },
      { name: "Notes", path: "/notes", icon: BookOpen },
      { name: "Résultats", path: "/notes_resultats", icon: BookOpen },
      { name: "Saisie", path: "/notes_saisie", icon: BookOpen },
      { name: "Paiements", path: "/paiements", icon: DollarSign },
      { name: "Calendrier", path: "/calendrier", icon: Calendar },
      { name: "Emploi du temps", path: "/emploi-du-temps", icon: Calendar },
      { name: "Mon Ecole", path: "/setting", icon: School },
      { name: "Année scolaire", path: "/profil", icon: Calendar1 },
    ];
  }

  if (user.role === 'enseignant') {
    navGroups = [
      {
        label: "Accueil",
        icon: Home,
        items: [{ name: "Tableau de bord", path: "/", icon: Home }]
      },
      {
        label: "Scolarité",
        icon: GraduationCap,
        items: [
          { name: "Mes Classes", path: "/mes-classes", icon: GraduationCap },
          { name: "Emploi du temps", path: "/emploi-du-temps", icon: Calendar },
          { name: "Message", path: "/profil", icon: MessageCircle },
        ]
      },
      {
        label: "Notes",
        icon: BookOpen,
        items: [
          { name: "Saisie Notes", path: "/notes/saisie", icon: BookOpen },
          { name: "Résultats", path: "/notes/resultats", icon: BookOpen }
        ]
      },
      {
        label: "Compte",
        icon: User,
        items: [{ name: "Profil", path: "/profil", icon: User }]
      }
    ];

    navMobileLinks = [
      { name: "Tableau de bord", path: "/", icon: Home },
      { name: "Mes Classes", path: "/mes-classes", icon: GraduationCap },
      { name: "Emploi du temps", path: "/emploi-du-temps", icon: Calendar },
      { name: "Saisie Notes", path: "/notes/saisie", icon: BookOpen },
      { name: "Résultats", path: "/notes/resultats", icon: BookOpen },
      { name: "Message", path: "/profil", icon: MessageCircle },
      { name: "Profil", path: "/profil", icon: User },
    ];
  }

  if (user.role === 'eleve') {
    navGroups = [
      {
        label: "Accueil",
        icon: Home,
        items: [{ name: "Tableau de bord", path: "/", icon: Home }]
      },
      {
        label: "Scolarité",
        icon: GraduationCap,
        items: [
          { name: "Emploi du temps", path: "/emploi-du-temps", icon: Calendar },
          { name: "Calendrier", path: "/calendrier", icon: Calendar },
          { name: "Message", path: "/profil", icon: MessageCircle },
        ]
      },
      {
        label: "Notes",
        icon: BookOpen,
        items: [
          { name: "Mes Notes", path: "/notes", icon: BookOpen },
          { name: "Résultats", path: "/notes/resultats", icon: BookOpen }
        ]
      },
      {
        label: "Paiements",
        icon: DollarSign,
        items: [
          { name: "Historique", path: "/historique", icon: DollarSign }
        ]
      },
      {
        label: "Compte",
        icon: User,
        items: [{ name: "Profil", path: "/profil", icon: User }]
      }
    ];

    navMobileLinks = [
      { name: "Tableau de bord", path: "/", icon: Home },
      { name: "Emploi du temps", path: "/emploi-du-temps", icon: Calendar },
      { name: "Calendrier", path: "/calendrier", icon: Calendar },
      { name: "Mes Notes", path: "/notes", icon: BookOpen },
      { name: "Résultats", path: "/notes/resultats", icon: BookOpen },
      { name: "Historique Paiements", path: "/historique", icon: DollarSign },
      { name: "Message", path: "/profil", icon: MessageCircle },
      { name: "Profil", path: "/profil", icon: User },
    ];
  }

  // ------------------------------
  // Reste du code identique à NavbarAdmin
  // ------------------------------
  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      // logout();
      <Navigate to="/" />;
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [isDarkMode]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const linkBaseStyle = "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out";
  const linkInactiveStyle = "text-gray-600 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-gray-800 dark:hover:text-blue-400";
  const linkActiveStyle = "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-semibold shadow-sm";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 text-2xl font-extrabold font-serif text-blue-600 dark:text-blue-400">
          <GraduationCap size={30} className="text-blue-500" />
          EliteSchool
        </NavLink>

        {/* Liens de navigation (grand écran) */}
        <div className="hidden md:flex space-x-2 lg:space-x-4 items-center">
          {navGroups.map(group => (
            group.items.length === 1 ? (
              <NavLink
                key={group.label}
                to={group.items[0].path}
                className={({ isActive }) => `${linkBaseStyle} ${isActive ? linkActiveStyle : linkInactiveStyle}`}
              >
                {group.icon ? <group.icon size={18} /> : null}
                <span className="hidden lg:inline">{group.items[0].name}</span>
              </NavLink>
            ) : (
              <div key={group.label} className="relative">
                <button
                  onClick={() => setOpenGroup(prev => prev === group.label ? null : group.label)}
                  className={`${linkBaseStyle} ${linkInactiveStyle} flex items-center`}
                >
                  {group.icon ? <group.icon size={18} /> : null}
                  <span className="hidden lg:inline">{group.label}</span>
                  <ChevronDown size={16} className={`ml-1 transition-transform ${openGroup === group.label ? 'rotate-180' : ''}`} />
                </button>
                {/* Dropdown */}
                <div
                  className={`absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden transition transform origin-top-right ${openGroup === group.label ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                >
                  <div className="py-2">
                    {group.items.map(item => (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => `${linkBaseStyle} ${isActive ? linkActiveStyle : linkInactiveStyle}`}
                        onClick={() => setOpenGroup(null)}
                      >
                        {item.icon ? <item.icon size={16} /> : null}
                        <span>{item.name}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            )
          ))}
         
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full animate-spin-clockwise text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  title="Se déconnecter"
                >
                  <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400 " />
                </button>
        </div>

        {/* Boutons pour mobile (hamburger et thème) */}
        <div className="md:hidden flex items-center gap-2">
       
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu mobile (slide-in) */}
      <div
        className={`md:hidden fixed inset-0  bg-opacity-50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleMenu}
      >
        <div
          className={`fixed top-0 right-0 w-64 h-full bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">Navigation</span>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col p-4 space-y-2">
            {navMobileLinks.map(link => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `${linkBaseStyle} ${isActive ? linkActiveStyle : linkInactiveStyle}`}
              >
                {link.icon ? <link.icon size={20} /> : null}
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
