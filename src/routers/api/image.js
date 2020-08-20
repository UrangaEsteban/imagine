var express = require('express');
var imageRouter = express.Router();

var { commentRouter } = require('./comment');

var { getImages, getImagesByUser, getImage, createImage, updateImage, removeImage} = require('../../controllers/image');

imageRouter.get('/', getImages);

imageRouter.get('/:id', getImage);

imageRouter.post('/', createImage);

imageRouter.put('/:id', updateImage);

imageRouter.delete('/:id', removeImage);

imageRouter.use('/:id/comment', saveParams, commentRouter);

function saveParams(req, res, next) {
  req.myParams = req.params;
  next();
}

module.exports = {
  imageRouter
};