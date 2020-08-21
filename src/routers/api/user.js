var express = require('express');
var userRouter = express.Router();
var { getUser, addFavorite, removeFavorite } = require('../../controllers/user');

userRouter.get('/', getUser);
userRouter.post('/:favorite_id', addFavorite);
userRouter.delete('/:favorite_id', removeFavorite);

module.exports = {
  userRouter
}