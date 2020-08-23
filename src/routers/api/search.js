var express = require('express');
var searchRouter = express.Router();
var { User } = require('../../models/user');
var { Image } = require('../../models/image');
var { Comment } = require('../../models/comment');


searchRouter.get('/', handleSearch);

module.exports = {
  searchRouter
}

// searches in the titles and descriptions of images, and throug user names for 
// a searchTerm given through the body
async function handleSearch(req, res) {
  var searchTermRegex = new RegExp(`${req.body.searchTerm}`);  
  var userPromise = User.find({
    $or: [
      { username: { $regex: searchTermRegex } },
      { email: { $regex: searchTermRegex } }
    ]
  });
  var imagePromise = Image.find({
    $or: [
      { title: { $regex: searchTermRegex } },
      { description: { $regex: searchTermRegex } },
    ]
  });
  
  var commentPromise = Comment.find({
    $or: [
      { content: { $regex: searchTermRegex } },
    ]
  });

  try {
    var data = await Promise.all([userPromise, imagePromise, commentPromise]);
    if (!data) {
      res.status(400).end();
    }
    res.status(200).json({
      data: {
        users: data[0],
        images: data[1],
        commets: data[2]
      }
    });

  } catch (error) {
    console.error(error);
    res.status(400).end();
  }


}