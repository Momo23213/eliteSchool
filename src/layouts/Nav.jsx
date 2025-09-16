// src/components/Navbar.tsx
import { useState, useEffect } from 'react';
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu, X, Home, Users, BookOpen, Book, GraduationCap, DollarSign, User, Sun, Moon,
  LogOut, Calendar, ChevronDown, WalletCards,
  MessageCircle,
  Calendar1,
  Star,
  School
} from 'lucide-react';
import "../styles/animations.css";
import { useAuth } from '../context/AuthContext';



const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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

  // Vérifier si l'utilisateur existe avant d'accéder à ses propriétés
  if (!user) {
    return null; // ou un composant de chargement
  }

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
          { name: "Emploi du temps", path: "/emploi-du-temps", icon: Calendar },
          { name: "Messagerie", path: "/messageries", icon: MessageCircle }
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
      { name: "Messagerie", path: "/messageries", icon: MessageCircle },
      { name: "Mon Ecole", path: "/setting", icon: School },
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
          { name: "Messagerie", path: "/messageries", icon: MessageCircle },
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
      { name: "Messagerie", path: "/messageries", icon: MessageCircle },
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
          { name: "Messagerie", path: "/messageries", icon: MessageCircle },
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
      { name: "Messagerie", path: "/messageries", icon: MessageCircle },
      { name: "Profil", path: "/profil", icon: User },
    ];
  }

  // ------------------------------
  // Reste du code identique à NavbarAdmin
  // ------------------------------
  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
      navigate('/');
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

  const linkBaseStyle = "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover-lift";
  const linkInactiveStyle = "text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 dark:hover:bg-gradient-to-r dark:hover:from-gray-800 dark:hover:to-gray-700 dark:hover:text-blue-400 hover:shadow-lg";
  const linkActiveStyle = "bg-gradient-to-r from-blue-500 to-purple-600 text-white dark:from-blue-600 dark:to-purple-700 font-semibold shadow-lg animate-pulse-soft";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl border-b border-gray-200/50 dark:border-gray-700/50 animate-slide-down">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 text-2xl font-extrabold font-serif bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:scale-110 transition-all duration-300 animate-fade-in">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg animate-float">
            <GraduationCap size={28} className="text-white" />
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">EliteSchool</span>
        </NavLink>

        {/* Liens de navigation (grand écran) */}
        <div className="hidden md:flex space-x-2 lg:space-x-4 items-center animate-fade-in-delay-1">
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
                  className={`${linkBaseStyle} ${linkInactiveStyle} flex items-center relative overflow-hidden`}
                >
                  {group.icon ? <group.icon size={18} /> : null}
                  <span className="hidden lg:inline">{group.label}</span>
                  <ChevronDown size={16} className={`ml-1 transition-transform ${openGroup === group.label ? 'rotate-180' : ''}`} />
                </button>
                {/* Dropdown */}
                <div
                  className={`absolute right-0 mt-2 w-56 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform origin-top-right ${openGroup === group.label ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
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
            className="p-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-blue-500 dark:to-purple-600 text-white hover:scale-110 hover:rotate-12 transition-all duration-300 shadow-lg hover:shadow-xl animate-bounce-soft"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
                  onClick={handleLogout}
                  className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white hover:scale-110 hover:shadow-xl transition-all duration-300 hover-lift"
                  title="Se déconnecter"
                >
                  <LogOut className="w-5 h-5" />
                </button>
        </div>

        {/* Boutons pour mobile (hamburger et thème) */}
        <div className="md:hidden flex items-center gap-3 animate-fade-in-delay-2">
       
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-blue-500 dark:to-purple-600 text-white hover:scale-110 transition-all duration-300 shadow-lg"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-110 hover:rotate-180 transition-all duration-300 shadow-lg"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu mobile (slide-in) */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleMenu}
      >
        <div
          className={`fixed top-0 right-0 w-72 h-full bg-white dark:bg-gray-900 shadow-2xl transform transition-all duration-500 ease-in-out border-l border-gray-200 dark:border-gray-700 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Navigation</span>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white hover:scale-110 hover:rotate-90 transition-all duration-300 shadow-lg"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col p-6 space-y-3">
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
            
            {/* Bouton de déconnexion pour mobile */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 w-full px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <LogOut size={20} />
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
