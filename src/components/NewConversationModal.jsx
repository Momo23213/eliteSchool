import React, { useState, useEffect } from 'react';
import { X, Search, Users, MessageCircle } from 'lucide-react';
import { messageService } from '../services/messageService';
import userService from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { useToast } from './toastService';

const NewConversationModal = ({ isOpen, onClose, onConversationCreated }) => {
  const { user } = useAuth();
  const { notifySuccess, notifyError } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchUsers = async () => {
    if (searchQuery.length < 2) return;
    
    setSearchLoading(true);
    try {
      const results = await messageService.searchUsers(searchQuery);
      // Filtrer l'utilisateur actuel
      const filteredResults = results.filter(u => u._id !== user._id);
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      notifyError('Erreur lors de la recherche d\'utilisateurs');
    } finally {
      setSearchLoading(false);
    }
  };

  const toggleUserSelection = (selectedUser) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(u => u._id === selectedUser._id);
      if (isSelected) {
        return prev.filter(u => u._id !== selectedUser._id);
      } else {
        return [...prev, selectedUser];
      }
    });
  };

  const createConversation = async () => {
    if (selectedUsers.length === 0) {
      notifyError('Veuillez sélectionner au moins un utilisateur');
      return;
    }

    setLoading(true);
    try {
      const participantIds = [user._id, ...selectedUsers.map(u => u._id)];
      const conversation = await messageService.createPrivateConversation(participantIds);
      
      notifySuccess('Conversation créée avec succès');
      onConversationCreated(conversation);
      handleClose();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      notifyError('Impossible de créer la conversation');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedUsers([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Nouvelle conversation
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher des utilisateurs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            {searchLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Users */}
        {selectedUsers.length > 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Utilisateurs sélectionnés ({selectedUsers.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map(selectedUser => (
                <div
                  key={selectedUser._id}
                  className="flex items-center gap-2 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                >
                  <span>{selectedUser.prenom} {selectedUser.nom}</span>
                  <button
                    onClick={() => toggleUserSelection(selectedUser)}
                    className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto max-h-64">
          {searchQuery.trim() === '' ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Tapez pour rechercher des utilisateurs</p>
            </div>
          ) : searchResults.length === 0 && !searchLoading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucun utilisateur trouvé</p>
            </div>
          ) : (
            <div className="p-2">
              {searchResults.map(searchUser => {
                const isSelected = selectedUsers.some(u => u._id === searchUser._id);
                return (
                  <div
                    key={searchUser._id}
                    onClick={() => toggleUserSelection(searchUser)}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                      {searchUser.prenom?.[0]}{searchUser.nom?.[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {searchUser.prenom} {searchUser.nom}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {searchUser.role === 'eleve' ? 'Élève' : 
                         searchUser.role === 'enseignant' ? 'Enseignant' : 
                         searchUser.role === 'admin' ? 'Administrateur' : searchUser.role}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={createConversation}
            disabled={selectedUsers.length === 0 || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
            Créer la conversation
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewConversationModal;
