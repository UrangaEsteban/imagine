var  mongoose = require('mongoose');

var imageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 80
    },
    description: {
      type: String
    },
    imageSource: {
      type: String,
      required: true,
    },
    isHostedHere: {
      type: Boolean,
      required: true,
      default: true
    },
    createdBy: {
      type:  mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    createdDate: Date,
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      }
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      }
    ]
  },
  { timestamps: true }
);

var Image = mongoose.model('image', imageSchema);

module.exports = {
  Image
};