var express = require('express');
var commentRouter = express.Router();

var { getCommentsByImage, getComment, createComment, updateComment, removeComment } = require('../../controllers/comment');

commentRouter.get('/', getCommentsByImage);

commentRouter.get('/:comment_id', getComment);

commentRouter.post('/', createComment);

commentRouter.put('/:comment_id', updateComment);

commentRouter.delete('/:comment_id', removeComment);

module.exports = {
  commentRouter
}