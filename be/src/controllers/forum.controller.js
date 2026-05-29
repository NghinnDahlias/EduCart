const Joi = require("joi");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { repositories } = require("../container"); // ← Import container

const listSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  subjectId: Joi.number().integer().optional(),
  search: Joi.string().max(255).optional(),
});

const createPostSchema = Joi.object({
  title: Joi.string().min(5).max(255).required(),
  content: Joi.string().min(10).max(5000).required(),
  subjectId: Joi.number().integer().optional(),
  tags: Joi.string().max(500).optional(),
});

const createCommentSchema = Joi.object({
  content: Joi.string().min(1).max(2000).required(),
  parentCommentId: Joi.number().integer().optional(),
});

/**
 * GET /forum
 * List all posts (public)
 */
const list = asyncHandler(async (req, res) => {
  const { value, error } = listSchema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });

  if (error) {
    throw new AppError(
      "Validation failed",
      400,
      error.details.map((d) => ({ path: d.path.join("."), msg: d.message })),
    );
  }

  const result = await repositories.forumRepository.list(value);
  res.json({ ok: true, ...result });
});

/**
 * GET /forum/:id
 * Get post details with comments (public)
 */
const getById = asyncHandler(async (req, res) => {
  const postId = Number(req.params.id);
  if (!Number.isFinite(postId)) {
    throw new AppError("Invalid post ID", 400);
  }

  const post = await repositories.forumRepository.findByIdWithComments(postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }

  // Increment view count
  await repositories.forumRepository.incrementViewCount(postId);

  res.json({ ok: true, post });
});

/**
 * POST /forum
 * Create a new post (auth required)
 */
const create = asyncHandler(async (req, res) => {
  const { value, error } = createPostSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    throw new AppError(
      "Validation failed",
      400,
      error.details.map((d) => ({ path: d.path.join("."), msg: d.message })),
    );
  }

  const post = await repositories.forumRepository.create({
    authorId: req.user.id,
    subjectId: value.subjectId,
    title: value.title,
    content: value.content,
    tags: value.tags,
  });

  res.status(201).json({ ok: true, post });
});

/**
 * POST /forum/:id/comments
 * Add a comment to a post (auth required)
 */
const addComment = asyncHandler(async (req, res) => {
  const { value, error } = createCommentSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    throw new AppError(
      "Validation failed",
      400,
      error.details.map((d) => ({ path: d.path.join("."), msg: d.message })),
    );
  }

  const postId = Number(req.params.id);
  if (!Number.isFinite(postId)) {
    throw new AppError("Invalid post ID", 400);
  }

  // Verify post exists
  const post = await repositories.forumRepository.findByIdWithComments(postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const comment = await repositories.forumRepository.addComment({
    postId,
    authorId: req.user.id,
    content: value.content,
    parentCommentId: value.parentCommentId,
  });

  res.status(201).json({ ok: true, comment });
});

/**
 * POST /forum/:id/vote
 * Vote on a post (auth required)
 */
const vote = asyncHandler(async (req, res) => {
  const postId = Number(req.params.id);
  const voteType = req.body.type; // "up" or "down"

  if (!Number.isFinite(postId)) {
    throw new AppError("Invalid post ID", 400);
  }

  if (!["up", "down"].includes(voteType)) {
    throw new AppError('Vote type must be "up" or "down"', 400);
  }

  await repositories.forumRepository.vote(postId, voteType);
  res.json({ ok: true, message: "Vote recorded" });
});

/**
 * DELETE /forum/:id
 * Delete a post (auth required - post author only)
 */
const deletePost = asyncHandler(async (req, res) => {
  const postId = Number(req.params.id);

  if (!Number.isFinite(postId)) {
    throw new AppError("Invalid post ID", 400);
  }

  const post = await repositories.forumRepository.findByIdWithComments(postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }

  if (post.AuthorID !== req.user.id) {
    throw new AppError("You can only delete your own posts", 403);
  }

  await repositories.forumRepository.delete(postId);
  res.json({ ok: true, message: "Post deleted" });
});

module.exports = {
  list,
  getById,
  create,
  addComment,
  vote,
  deletePost,
};
