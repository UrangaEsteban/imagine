var { User } = require('../models/user');

// TODO proper user controllers
async function  getUser(req, res) {
  return res.status(200).json({ data: req.user })
}

async function addFavorite(req, res) {
  var favoriteImage = req.params.favorite_id;
  try {
    var user = { ...req.user };

    if (!user) {
      res.status(400).end();
    }

    var currentIndex = user.favorites.findIndex(function (id) {
      return id.equals(favoriteImage);
    });

    if (currentIndex == -1) {
      user.favorites = [].concat(user.favorites, favoriteImage);
    }

    var updatedUser = await User.findOneAndUpdate({
      _id: user._id
    },
    user,
    { new: true });

    res.status(200).json({ data: updatedUser });

  } catch (error) {
    res.status(400).end();
  }
}

async function removeFavorite(req, res) {
  var favoriteImage = req.params.favorite_id;

  try {
    var user = { ...req.user };

    var removeIndex = user.favorites.findIndex(function (id) {
      return id.equals(favoriteImage);
    });

    if ( removeIndex == -1 ) {
      return res.status(200).json(user).end();
    }

    user.favorites = [].concat(
      user.favorites.slice(0, removeIndex),
      user.favorites.slice(removeIndex + 1)
    );
    
    var updatedUser = await User.findOneAndUpdate({
      _id: user._id
    },
    user,
    { new: true });

    res.status(200).json({ data: updatedUser });

  } catch (error) {
    res.status(400).end();
  }
}

module.exports = {
  getUser,
  addFavorite,
  removeFavorite
}