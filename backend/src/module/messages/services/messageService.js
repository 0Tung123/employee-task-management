const { db } = require('../../../configs/firebase.config');
const { collection, addDoc, query, where, orderBy, getDocs, limit, startAfter, updateDoc, doc } = require('firebase/firestore');

class MessageService {
  constructor() {
    this.messagesCollection = 'messages';
  }

  async createMessage(messageData) {
    try {
      const messageDoc = {
        fromId: messageData.fromId,
        fromType: messageData.fromType, // 'owner' or 'employee'  
        toId: messageData.toId,
        toType: messageData.toType, // 'owner' or 'employee'
        text: messageData.text,
        timestamp: new Date(),
        read: false,
        conversationId: this.generateConversationId(messageData.fromId, messageData.toId)
      };

      const docRef = await addDoc(collection(db, this.messagesCollection), messageDoc);
      
      return {
        id: docRef.id,
        ...messageDoc,
        timestamp: messageDoc.timestamp.toISOString()
      };
    } catch (error) {
      throw error;
    }
  }

  async getConversation(userId1, userId2, lastMessageId = null, limitCount = 50) {
    try {
      const conversationId = this.generateConversationId(userId1, userId2);
      

      let q = query(
        collection(db, this.messagesCollection),
        where('conversationId', '==', conversationId)
      );

      const querySnapshot = await getDocs(q);
      let messages = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp.toDate()
        });
      });


      messages.sort((a, b) => a.timestamp - b.timestamp);


      if (lastMessageId) {
        const lastMessageIndex = messages.findIndex(msg => msg.id === lastMessageId);
        if (lastMessageIndex !== -1) {

          messages = messages.slice(Math.max(0, lastMessageIndex - limitCount), lastMessageIndex);
        } else {

          messages = messages.slice(-limitCount);
        }
      } else {

        messages = messages.slice(-limitCount);
      }


      return messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString()
      }));
    } catch (error) {
      throw error;
    }
  }

  async getUserConversations(userId) {
    try {

      const sentQuery = query(
        collection(db, this.messagesCollection),
        where('fromId', '==', userId)
      );


      const receivedQuery = query(
        collection(db, this.messagesCollection),
        where('toId', '==', userId)
      );

      const [sentSnapshot, receivedSnapshot] = await Promise.all([
        getDocs(sentQuery),
        getDocs(receivedQuery)
      ]);

      const conversations = new Map();
      const allMessages = [];


      sentSnapshot.forEach((doc) => {
        const data = doc.data();
        allMessages.push({
          ...data,
          id: doc.id,
          timestamp: data.timestamp.toDate()
        });
      });

      receivedSnapshot.forEach((doc) => {
        const data = doc.data();
        allMessages.push({
          ...data,
          id: doc.id,
          timestamp: data.timestamp.toDate()
        });
      });


      allMessages.sort((a, b) => b.timestamp - a.timestamp);


      allMessages.forEach((message) => {
        const conversationId = message.conversationId;
        
        if (!conversations.has(conversationId)) {
          const otherUserId = message.fromId === userId ? message.toId : message.fromId;
          const otherUserType = message.fromId === userId ? message.toType : message.fromType;
          
          conversations.set(conversationId, {
            conversationId,
            otherUserId,
            otherUserType,
            lastMessage: message.text,
            timestamp: message.timestamp.toISOString(),
            read: message.fromId === userId || (message.toId === userId && message.read),
            messageId: message.id
          });
        }
      });

      return Array.from(conversations.values())
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
      throw error;
    }
  }

  async markAsRead(messageId) {
    try {
      const messageRef = doc(db, this.messagesCollection, messageId);
      await updateDoc(messageRef, { read: true });
      return true;
    } catch (error) {
      throw error;
    }
  }

  async markConversationAsRead(userId1, userId2, currentUserId) {
    try {
      const conversationId = this.generateConversationId(userId1, userId2);
      

      const conversationQuery = query(
        collection(db, this.messagesCollection),
        where('conversationId', '==', conversationId)
      );

      const querySnapshot = await getDocs(conversationQuery);
      const updates = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (data.toId === currentUserId && !data.read) {
          updates.push(updateDoc(doc.ref, { read: true }));
        }
      });

      if (updates.length > 0) {
        await Promise.all(updates);
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  generateConversationId(userId1, userId2) {

    return [userId1, userId2].sort().join('_');
  }

  async getUnreadCount(userId) {
    try {

      const q = query(
        collection(db, this.messagesCollection),
        where('toId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      let unreadCount = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (!data.read) {
          unreadCount++;
        }
      });

      return unreadCount;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new MessageService();