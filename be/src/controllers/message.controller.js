const Joi = require('joi');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../utils/validate');
const AppError = require('../utils/AppError');
const { repositories } = require('../container');

const sendSchema = Joi.object({
  receiverId: Joi.number().integer().required(),
  content: Joi.string().min(1).max(2000).required(),
  productId: Joi.number().integer().optional(),
});

const getConversations = asyncHandler(async (req, res) => {
  const conversations = await repositories.messageRepository.getConversations(req.user.id);
  res.json({ ok: true, conversations });
});

const getMessages = asyncHandler(async (req, res) => {
  const otherUserId = Number(req.query.with);
  if (!otherUserId) throw new AppError('Query param "with" (userId) is required', 400);
  const messages = await repositories.messageRepository.getMessages(req.user.id, otherUserId);
  res.json({ ok: true, messages });
});
const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await repositories.messageRepository.getUnreadCount(req.user.id);
  res.json({ ok: true, count });
});

const send = asyncHandler(async (req, res) => {
  if (req.body.receiverId === req.user.id) throw new AppError('Cannot message yourself', 400);
  const message = await repositories.messageRepository.send({
    senderId: req.user.id,
    receiverId: req.body.receiverId,
    content: req.body.content,
    productId: req.body.productId,
  });
  res.status(201).json({ ok: true, message });
});

module.exports = { getConversations, getMessages, getUnreadCount, send, sendValidator: validate(sendSchema) };
