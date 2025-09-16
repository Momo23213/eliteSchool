import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Users, 
  Search, 
  Send, 
  Plus, 
  MoreVertical,
  ArrowLeft,
  Phone,
  Video,
  Paperclip,
  Smile
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { messageService } from '../services/messageService';
import classeService from '../services/classeService';
import { notifySuccess, notifyError } from '../components/toastService';
import socketService from '../services/socketService';

const Messagerie = () => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  // États principaux
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  // États pour les groupes de classe
  const [classGroups, setClassGroups] = useState([]);
  const [activeTab, setActiveTab] = useState('private'); // 'private' ou 'groups'
  const [showUserModal, setShowUserModal] = useState(false);

  // Charger les conversations et groupes de classe
  useEffect(() => {
    if (user) {
      console.log('Chargement initial des données pour utilisateur:', user);
      fetchConversations();
      fetchClassGroups();
      fetchAvailableUsers();
      
      socketService.connect();
      
      // Configuration de la réception des messages en temps réel
      socketService.onReceiveMessage((message) => {
        console.log('Message reçu via Socket.IO:', message);
        console.log('Conversation active actuelle:', activeConversation);
        
        // Ajouter le message reçu aux messages actuels
        setMessages(prev => {
          const exists = prev.some(m => m._id === message._id);
          if (!exists) {
            console.log('Ajout du nouveau message reçu');
            return [...prev, message];
          }
          console.log('Message déjà existant, ignoré');
          return prev;
        });
        
        // Mettre à jour la liste des conversations
        fetchConversations();
      });
    }
    
    // Cleanup lors du démontage
    return () => {
      socketService.offReceiveMessage();
      socketService.disconnect();
    };
  }, [user, activeConversation]);

  // Auto-scroll vers le bas des messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      const userId = user?.id || user?._id;
      if (!userId) {
        console.log('Pas d\'ID utilisateur pour charger les conversations');
        setLoading(false);
        return;
      }
      
      console.log('Tentative de chargement des conversations pour userId:', userId);
      const data = await messageService.getConversations(userId);
      console.log('Conversations chargées depuis API:', data);
      setConversations(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClassGroups = async () => {
    try {
      // Récupérer les classes selon le rôle de l'utilisateur
      let classes = [];
      if (user.role === 'eleve') {
        // Pour un élève, récupérer sa classe
        const classeData = await classeService.getById(user.classeId);
        classes = [classeData];
      } else if (user.role === 'enseignant') {
        // Pour un enseignant, récupérer toutes les classes où il enseigne
        const allClasses = await classeService.getAll();
        classes = allClasses.filter(classe => 
          classe.enseignants?.some(ens => ens._id === user._id)
        );
      } else if (user.role === 'admin') {
        // Pour un admin, toutes les classes
        classes = await classeService.getAll();
      }
      
      setClassGroups(classes);
    } catch (error) {
      console.error('Erreur lors du chargement des groupes:', error);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      // Récupérer les enseignants et élèves pour les conversations privées
      const [enseignants, eleves] = await Promise.all([
        fetch('https://schoolelite.onrender.com/api/enseignants', {
          credentials: 'include',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(res => res.ok ? res.json() : []).catch(() => []),
        fetch('https://schoolelite.onrender.com/api/eleves', {
          credentials: 'include',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(res => res.ok ? res.json() : []).catch(() => [])
      ]);
      
      // Combiner et filtrer l'utilisateur actuel
      const allUsers = [...enseignants, ...eleves];
      const userId = user?.id || user?._id;
      const filteredUsers = allUsers.filter(u => u._id !== userId);
      
      setAvailableUsers(filteredUsers);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setAvailableUsers([]);
    }
  };

  const fetchMessages = async (conversation) => {
    setLoadingMessages(true);
    try {
      let data;
      if (conversation.type === 'private') {
        const userId = user?.id || user?._id;
        const otherUserId = conversation.participants.find(p => p._id !== userId)?._id;
        console.log('Debug fetchMessages - user:', user, 'userId:', userId, 'otherUserId:', otherUserId);
        if (!userId || !otherUserId) {
          console.log('IDs manquants pour charger les messages privés - userId:', userId, 'otherUserId:', otherUserId);
          setMessages([]);
          return;
        }
        data = await messageService.getPrivateMessages(userId, otherUserId);
      } else {
        data = await messageService.getGroupMessages(conversation._id);
      }
      setMessages(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleConversationClick = (conversation) => {
    console.log('Sélection de conversation:', conversation);
    setActiveConversation(conversation);
    fetchMessages(conversation);
    
    if (conversation.type === 'private') {
      const userId = user?.id || user?._id;
      const otherUserId = conversation.participants.find(p => p._id !== userId)?._id;
      console.log('Rejoindre conversation privée - userId:', userId, 'otherUserId:', otherUserId);
      if (userId && otherUserId) {
        socketService.joinPrivateConversation(userId, otherUserId);
      }
    } else if (conversation.type === 'group') {
      console.log('Rejoindre groupe classe:', conversation._id);
      socketService.joinClassGroup(conversation._id);
    }
  };

  const handleGroupClick = (classe) => {
    const groupConversation = {
      _id: classe._id,
      type: 'group',
      name: `Classe ${classe.nom}`,
      participants: [...(classe.eleves || []), ...(classe.enseignants || [])],
      lastMessage: null
    };
    setActiveConversation(groupConversation);
    fetchMessages(groupConversation);
    
    socketService.joinClassGroup(classe._id);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    try {
      const userId = user?.id || user?._id;
      const messageData = {
        contenu: newMessage.trim(),
        expediteur: userId,
        expediteurNom: user?.nom || user?.prenom || 'Utilisateur'
      };

      let sentMessage;
      if (activeConversation.type === 'private') {
        const userId = user?.id || user?._id;
        const otherUserId = activeConversation.participants.find(p => p._id !== userId)?._id;
        console.log('Debug sendMessage - user:', user, 'userId:', userId, 'otherUserId:', otherUserId, 'participants:', activeConversation.participants);
        
        if (!userId || !otherUserId) {
          console.error('Utilisateur ou destinataire manquant - userId:', userId, 'otherUserId:', otherUserId);
          return;
        }
        
        sentMessage = await messageService.sendPrivateMessage({
          ...messageData,
          destinataire: otherUserId
        });
        
        socketService.sendPrivateMessage({
          expediteur: userId,
          destinataire: otherUserId,
          contenu: messageData.contenu,
          messageId: sentMessage._id,
          expediteurData: user
        });
      } else {
        sentMessage = await messageService.sendGroupMessage({
          ...messageData,
          classeId: activeConversation._id
        });
        
        socketService.sendGroupMessage({
          expediteur: user._id,
          classeId: activeConversation._id,
          contenu: messageData.contenu,
          messageId: sentMessage._id,
          expediteurData: user
        });
      }

      // Ajouter le message localement pour un affichage immédiat
      const localMessage = {
        _id: sentMessage._id || Date.now().toString(),
        contenu: messageData.contenu,
        expediteur: messageData.expediteur,
        expediteurNom: messageData.expediteurNom,
        createdAt: new Date(),
        type: activeConversation.type
      };
      
      setMessages(prev => {
        const exists = prev.some(m => m._id === localMessage._id);
        if (!exists) {
          return [...prev, localMessage];
        }
        return prev;
      });

      // Mettre à jour la conversation avec le dernier message
      setConversations(prev => prev.map(conv => 
        conv._id === activeConversation._id 
          ? { ...conv, lastMessage: localMessage, updatedAt: new Date() }
          : conv
      ));

      setNewMessage('');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      notifyError('Impossible d\'envoyer le message');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const startNewConversation = (selectedUser) => {
    console.log('Debug startNewConversation - user:', user, 'selectedUser:', selectedUser);
    
    const userId = user?.id || user?._id;
    const selectedUserId = selectedUser?._id;
    
    if (!userId || !selectedUserId) {
      console.error('Impossible de créer une conversation - IDs manquants - userId:', userId, 'selectedUserId:', selectedUserId);
      return;
    }
    
    // Vérifier si une conversation existe déjà
    const existingConversation = conversations.find(c => 
      c.type === 'private' && 
      c.participants.some(p => p._id === selectedUserId)
    );
    
    if (existingConversation) {
      // Utiliser la conversation existante
      setActiveConversation(existingConversation);
      fetchMessages(existingConversation);
      setShowUserModal(false);
      return;
    }
    
    const newConversation = {
      _id: `private_${userId}_${selectedUserId}`,
      type: 'private',
      participants: [{ ...user, _id: userId }, selectedUser],
      lastMessage: null,
      updatedAt: new Date()
    };
    
    console.log('Nouvelle conversation créée:', newConversation);
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversation(newConversation);
    setMessages([]);
    setShowUserModal(false);
  };

  const formatDate = (date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    }
    
    return messageDate.toLocaleDateString('fr-FR');
  };

  const filteredConversations = conversations.filter(conv => {
    const userId = user?.id || user?._id;
    const otherUser = conv.participants?.find(p => p._id !== userId);
    return otherUser?.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           otherUser?.prenom?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredGroups = classGroups.filter(classe =>
    classe.nom?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex mt-20 h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar - Liste des conversations */}
      <div className={`${activeConversation ? 'hidden' : 'flex'} md:flex md:w-1/3 w-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Messagerie
            </h1>
            <button
              onClick={() => setShowUserModal(true)}
              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('private')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'private'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              Privé
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'groups'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              Groupes
            </button>
          </div>

          {/* Barre de recherche */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Liste des conversations/groupes */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'private' ? (
            // Conversations privées
            <div className="p-2">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Chargement des conversations...</p>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Aucune conversation</p>
                  <button 
                    onClick={() => setShowUserModal(true)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Nouvelle conversation
                  </button>
                </div>
              ) : (
                filteredConversations.map((conversation) => {
                  const userId = user?.id || user?._id;
                  const otherUser = conversation.participants?.find(p => p._id !== userId);
                  return (
                    <div
                      key={conversation._id}
                      onClick={() => handleConversationClick(conversation)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                        activeConversation?._id === conversation._id
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                          {otherUser?.prenom?.[0] || otherUser?.nom?.[0] || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {`${otherUser?.prenom || 'Utilisateur'} ${otherUser?.nom || ''}`.trim()}
                            </p>
                            {conversation.lastMessage && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTime(conversation.lastMessage.createdAt)}
                              </span>
                            )}
                          </div>
                          {conversation.lastMessage && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                              {conversation.lastMessage.contenu}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            // Groupes de classe
            <div className="p-2">
              {filteredGroups.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Aucun groupe disponible</p>
                </div>
              ) : (
                filteredGroups.map((classe) => (
                  <div
                    key={classe._id}
                    onClick={() => handleGroupClick(classe)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                      activeConversation?._id === classe._id
                        ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Classe {classe.nom}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {(classe.eleves?.length || 0) + (classe.enseignants?.length || 0)} membres
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Zone de chat */}
      <div className={`${activeConversation ? 'flex' : 'hidden'} md:flex flex-1 flex-col`}>
        {activeConversation ? (
          <>
            {/* Header du chat */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setActiveConversation(null)}
                    className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                    {activeConversation.type === 'group' ? (
                      <Users className="w-5 h-5" />
                    ) : (
                      (() => {
                        const userId = user?.id || user?._id;
                        const otherUser = activeConversation.participants?.find(p => p._id !== userId);
                        return otherUser?.prenom?.[0] || otherUser?.nom?.[0] || 'U';
                      })()
                    )}
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {activeConversation.type === 'group' 
                        ? activeConversation.name
                        : (() => {
                            const userId = user?.id || user?._id;
                            const otherUser = activeConversation.participants?.find(p => p._id !== userId);
                            return `${otherUser?.prenom || 'Utilisateur'} ${otherUser?.nom || ''}`.trim();
                          })()
                      }
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {activeConversation.type === 'group' 
                        ? `${activeConversation.participants?.length || 0} membres`
                        : 'En ligne'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {activeConversation.type === 'private' && (
                    <>
                      <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <Phone className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <Video className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
<div className="flex-1 overflow-y-auto p-4 space-y-4">
  {loadingMessages ? (
    // Affichage du loader pendant le chargement
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Chargement des messages...
        </p>
      </div>
    </div>
  ) : messages.length === 0 ? (
    // Affichage si aucun message
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-50" />
        <p className="text-gray-500 dark:text-gray-400">
          Aucun message dans cette conversation
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Envoyez le premier message !
        </p>
      </div>
    </div>
  ) : (
    // Affichage des messages
    messages.map((message, index) => {
      const isOwn = message.expediteur?._id === user?._id;

      // Afficher la date uniquement si le message précédent est d'une autre date
      const showDate =
        index === 0 ||
        (messages[index - 1] &&
          formatDate(message.createdAt) !== formatDate(messages[index - 1].createdAt));

      return (
        <div key={message._id}>
          {showDate && (
            <div className="text-center my-4">
              <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-3 py-1 rounded-full">
                {formatDate(message.createdAt)}
              </span>
            </div>
          )}

          <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-sm lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
              {!isOwn && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 ml-2">
                  {message.expediteur?.nom || message.expediteur?.prenom || 'Utilisateur'}
                </p>
              )}
              <div
                className={`p-3 rounded-2xl ${
                  isOwn
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <p className="text-sm md:text-base">{message.contenu}</p>
                <p
                  className={`text-xs mt-1 ${
                    isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {formatTime(message.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    })
  )}
  {/* Référence pour scroll automatique */}
  <div ref={messagesEndRef} />
</div>
            {/* Zone de saisie */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 md:p-4">
              <div className="flex items-center space-x-2 md:space-x-3">
                <button className="hidden sm:flex p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <Paperclip className="w-5 h-5" />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tapez votre message..."
                    className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <button className="hidden sm:flex p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <Smile className="w-5 h-5" />
                </button>
                
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          // État vide - aucune conversation sélectionnée
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Sélectionnez une conversation
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choisissez une conversation ou un groupe pour commencer à discuter
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modal pour nouvelle conversation */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Nouvelle conversation
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              {availableUsers
                .filter(u => 
                  u.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  u.prenom?.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((selectedUser) => (
                <div
                  key={selectedUser._id}
                  onClick={() => startNewConversation(selectedUser)}
                  className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                    {selectedUser.prenom?.[0]}{selectedUser.nom?.[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedUser.prenom} {selectedUser.nom}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedUser.role === 'enseignant' ? 'Enseignant' : 'Élève'}
                    </p>
                  </div>
                </div>
              ))}
              
              {availableUsers.filter(u => 
                u.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.prenom?.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>Aucun utilisateur trouvé</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messagerie;
