const Message = require('../models/Message');
const User = require('../models/user');

// Generate conversation ID between two users
const generateConversationId = (userId1, userId2) => {
  return [userId1, userId2].sort().join('_');
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    const conversationId = generateConversationId(req.user.id, receiverId);

    const message = new Message({
      sender: req.user.id,
      receiver: receiverId,
      content: content.trim(),
      conversationId
    });

    await message.save();
    
    // Populate sender info for response
    await message.populate('sender', 'name role');
    await message.populate('receiver', 'name role');

    res.status(201).json(message);
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Get conversation between two users
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const conversationId = generateConversationId(req.user.id, userId);

    const messages = await Message.find({ conversationId })
      .populate('sender', 'name role')
      .populate('receiver', 'name role')
      .sort({ createdAt: 1 });

    // Mark messages as read where current user is receiver
    await Message.updateMany(
      { conversationId, receiver: req.user.id, isRead: false },
      { isRead: true }
    );

    res.json(messages);
  } catch (err) {
    console.error('Get conversation error:', err);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
};

// Get all conversations for a user
exports.getConversations = async (req, res) => {
  try {
    // Get all unique conversation partners
    const sentMessages = await Message.find({ sender: req.user.id })
      .distinct('receiver');
    const receivedMessages = await Message.find({ receiver: req.user.id })
      .distinct('sender');

    const allPartnerIds = [...new Set([...sentMessages, ...receivedMessages])];

    const conversations = [];

    for (const partnerId of allPartnerIds) {
      const conversationId = generateConversationId(req.user.id, partnerId);
      
      // Get last message in conversation
      const lastMessage = await Message.findOne({ conversationId })
        .populate('sender', 'name role')
        .populate('receiver', 'name role')
        .sort({ createdAt: -1 });

      // Get unread count
      const unreadCount = await Message.countDocuments({
        conversationId,
        receiver: req.user.id,
        isRead: false
      });

      // Get partner info
      const partner = await User.findById(partnerId).select('name role location');

      if (lastMessage && partner) {
        conversations.push({
          partner,
          lastMessage,
          unreadCount,
          conversationId
        });
      }
    }

    // Sort by last message time
    conversations.sort((a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt));

    res.json(conversations);
  } catch (err) {
    console.error('Get conversations error:', err);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user.id,
      isRead: false
    });

    res.json({ count });
  } catch (err) {
    console.error('Get unread count error:', err);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
};

// Mark conversation as read
exports.markConversationAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const conversationId = generateConversationId(req.user.id, userId);

    await Message.updateMany(
      { conversationId, receiver: req.user.id, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'Conversation marked as read' });
  } catch (err) {
    console.error('Mark conversation as read error:', err);
    res.status(500).json({ error: 'Failed to mark conversation as read' });
  }
};
