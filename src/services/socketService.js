import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(serverUrl = 'https://schoolelite.onrender.com') {
    if (!this.socket) {
      this.socket = io(serverUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        console.log('Connecté au serveur Socket.IO:', this.socket.id);
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('Déconnecté du serveur Socket.IO');
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Erreur de connexion Socket.IO:', error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Rejoindre une conversation privée
  joinPrivateConversation(userId1, userId2) {
    if (this.socket) {
      this.socket.emit('join_private_conversation', { userId1, userId2 });
    }
  }

  // Rejoindre un groupe de classe
  joinClassGroup(classeId) {
    if (this.socket) {
      this.socket.emit('join_class_group', { classeId });
    }
  }

  // Envoyer un message privé
  sendPrivateMessage(data) {
    if (this.socket) {
      this.socket.emit('send_private_message', data);
    }
  }

  // Envoyer un message de groupe
  sendGroupMessage(data) {
    if (this.socket) {
      this.socket.emit('send_group_message', data);
    }
  }

  // Écouter les nouveaux messages
  onReceiveMessage(callback) {
    if (this.socket) {
      this.socket.on('receive_message', callback);
    }
  }

  // Arrêter d'écouter les messages
  offReceiveMessage() {
    if (this.socket) {
      this.socket.off('receive_message');
    }
  }

  // Notifications de frappe
  startTyping(roomName, userName) {
    if (this.socket) {
      this.socket.emit('typing', { roomName, userName });
    }
  }

  stopTyping(roomName) {
    if (this.socket) {
      this.socket.emit('stop_typing', { roomName });
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  onUserStopTyping(callback) {
    if (this.socket) {
      this.socket.on('user_stop_typing', callback);
    }
  }

  // Utilitaire pour vérifier la connexion
  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }
}

// Instance singleton
const socketService = new SocketService();
export default socketService;
