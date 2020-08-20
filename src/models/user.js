var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
    },
    createdDate: Date,
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts'
      }
    ],
    isActive: {
      type: Boolean,
      required: true,
      default: true
    },
    settings: {
      notifications: {
        type: Boolean,
        required: true,
        default: true
      }
    }
  },
  { timestamps: true }
);

userSchema.pre('save', function hashPwd(next) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.hash(this.password, 8, (error, hash) => {
    if (error) {
      console.error(error);
      return next(error);
    }
    this.password = hash;
    next();
  });
});

userSchema.methods.checkPassword = function(password) {
  var passwordHash = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err);
      }
      resolve(same);
    });
  })
}

var User = mongoose.model('user', userSchema);

module.exports = {
  User
};