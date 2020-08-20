var { Comment } = require('../models/comment');
var { Image } = require('../models/image');

module.exports = {
  getCommentsByImage,
  getComment,
  createComment,
  updateComment,
  removeComment
}

// *********************************************************************

async function getCommentsByImage(req, res) {
  var parentType = "image";
  var parentId = req.params.id;
  try {
    var comments = await Comment
    .find({ parentType, parentId })
    .lean()
    .exec()

    if (!comments) {
      return res.status(400).end();
    }
    res.status(200).json({ data: comments });
    
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
}

async function getComment(req, res){
  try {
    var comment = await Comment
    .findOne({ createdBy: req.user._id, _id: req.params.comment_id })
    .lean()
    .exec()

    if (!comment) {
      return res.status(400).end();
    }
    res.status(200).json({ data: comment });
    
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
}

async function createComment(req, res) {
  var createdBy = req.user._id;

  try {
    var image = await Image.findOne({
      _id: req.myParams.id
    })
    .lean()
    .exec();
    
    if (!image) {
      console.log(req.myParams)
      console.log(image)
      return res.status(404).end();
    }

    var createdComment = await Comment.create({
      parentType: 'image',
      parent: image._id,
      ...req.body,
      createdBy
    });
    
    if (!createdComment) {
      res.status(404).end();
    }

    res.status(200).json({ data: createdComment });
  } catch (error) {
    console.error(error);
    res.status(401).end();
  }
}


async function updateComment(req, res) {
  try {
    var updatedComment = await Comment.findOneAndUpdate(
      {
        createdBy: req.user._id,
        _id: req.params.comment_id
      },
      req.body,
      { new: true }
    ).lean()
    .exec();
    
    if (!updatedComment) {
      return res.status(401).end();
    }

    res.status(200).json({ data: updatedComment });
  } catch (error) {
    console.error(error);
    res.status(401).end();
  }
}

async function removeComment(req, res) {
  try {
    var removedComment = await Comment.findOneAndRemove({
        createdBy: req.user._id,
        _id: req.params.comment_id
      });

    if (!removedComment) {
      return res.status(401).end()
    }

    res.status(200).json({ data: removedComment});
  } catch (error) {
    console.error(error);
    res.status(401).end()
  }
}
