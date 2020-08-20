var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      maxlength: 400,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    createdDate: Date,
    parentType: {
      type: String,
      required: true,
      enum: ["image", "comment"]
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'parentType'
    },
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
  { timestamps: true}
);

var Comment = mongoose.model('comment', commentSchema);

module.exports = {
  Comment
};