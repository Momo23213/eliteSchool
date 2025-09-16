import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { X, Sparkles } from "lucide-react";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "default",
  showCloseButton = true,
  closeOnOverlayClick = true
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "max-w-md";
      case "large":
        return "max-w-5xl";
      case "full":
        return "max-w-7xl";
      default:
        return "max-w-3xl";
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-50" 
        onClose={closeOnOverlayClick ? onClose : () => {}}
      >
        {/* Overlay avec effet glassmorphism */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-md" />
        </Transition.Child>

        {/* Container principal */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel
                className={`
                  w-full ${getSizeClasses()} max-h-[90vh] 
                  overflow-hidden
                  rounded-3xl 
                  bg-white/95 dark:bg-gray-900/95 
                  backdrop-blur-xl 
                  shadow-2xl 
                  border border-white/20 dark:border-gray-700/30
                  text-left align-middle 
                  transition-all
                  relative
                `}
              >
                {/* Effet de brillance décoratif */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                
                {/* En-tête avec titre et bouton fermer */}
                <div className="relative px-8 py-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-gray-800/50 dark:to-gray-700/50">
                  {title && (
                    <Dialog.Title
                      as="h3"
                      className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3"
                    >
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      {title}
                    </Dialog.Title>
                  )}
                  
                  {/* Bouton fermer en haut à droite */}
                  {showCloseButton && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 transform hover:scale-110"
                      aria-label="Fermer"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  )}
                </div>

                {/* Contenu principal avec scroll personnalisé */}
                <div className="px-8 py-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                  <div className="text-gray-800 dark:text-gray-200">
                    {children}
                  </div>
                </div>

                {/* Footer optionnel avec gradient */}
                <div className="px-8 py-4 bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-700/80 border-t border-gray-200/50 dark:border-gray-700/50 rounded-b-3xl">
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-600/50 rounded-xl transition-all duration-200 font-medium"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
