var formidable = require('formidable');
var fs = require('fs');
var { Image } = require('../models/image');
var { Comment } = require('../models/comment');

module.exports = {
  getImage,
  getImagesByUser,
  getImages,
  createImage,
  updateImage,
  removeImage
}

// ****************************************************************************************

async function getImage(req, res){
  try {
    var image = await Image
    .findOne({
      _id: req.params.id
    })
    .lean()
    .exec()

    if (!image) {
      return res.status(400).end();
    }
    
    res.status(200).json({ data: image });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
}

async function getImages(req, res) {
  try {
    var images = await Image
      .find()
      .lean()
      .exec();

    res.status(200).json({ data: images });

  } catch (error) {
    console.log(error);
    res.status(400).end();
  }
}

// TODO probably is going to move to user controllers, main use in user profile
async function getImagesByUser(req, res) {
  try {
    var images = await Image
      .find({ createdBy: req.params.user_id })
      .lean()
      .exec();

    res.status(200).json({ data: images })

  } catch (error) {
    console.log(error);
    res.status(400).end();
  }
}

async function createImage(req, res) {
  var createdBy = req.user._id;

  if (req.isHostedHere) {
    saveImage()
      .then(resPath => req.body.imageSource = resPath)
      .catch(error => {
        console.log(error);
        return res.status(500).end();
      })
  }
  try {
    var createdImage = await Image.create({
      ...req.body,
      createdBy
    })
    if (!createdImage) {
      res.status(401).end();
    }

    res.status(200).json({ data: createdImage });

  } catch (error) {

    console.error(error);
    res.status(401).end();
  
  }
}

async function updateImage(req, res) {
  try {
    var updatedImage = await Image.findOneAndUpdate(
      {
        createdBy: req.user._id,
        _id: req.params.id
      },
      req.body,
      { new: true }
    ).lean()
    .exec();
    
    if (!updatedImage) {
      return res.status(401).end();
    }

    res.status(201).json({ data: updatedImage });
  } catch (error) {
    console.error(error);
    res.status(401).end();
  }
}

async function removeImage(req, res) {
  
  try {
    var removedImage = await Image.findOneAndRemove({
      createdBy: req.user._id,
      _id: req.params.id
    });

    if (!removedImage) {
      return res.status(400).end();
    }

    var deletedComments = await new Promise(function (resolve, reject) {
      Comment.deleteMany({
      parentType: "image",
      parent: req.params.id
      }, function (error, data) {
      if (error) {
        reject(error);
      }
      resolve(data);
    })
  });

    res.status(200).json({ data: removedImage });

  } catch (error) {
    console.log(error);
    res.status(400).end();
  }
}

// *************************************************************************************************

function saveImage() {
  
  var form = new formidable.IncomingForm({ uploadDir: 'images' });
  var url = "http://localhost:3000/";
  
  return new Promise((resolve, reject) => {
    form.parse(req, function (error, fields, files) {
      if (error) reject(error);

      var oldpath = files.image.path;

      var newpath = `${url}/images/${req.body.createdBy}-${files.image.name}`;
      fs.rename(oldpath, newpath, function (error) {
        if (error) reject(error);
        resolve(newpath);
      });
    })
  })

}