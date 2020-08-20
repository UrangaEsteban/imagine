module.exports = function (model) {
  return {
    getOne: getOne(model),
    getMany: getMany(model),
    getManyByUser: getManyByUser(model),
    createOne: createOne(model),
    updateOne: updateOne(model),
    removeOne: removeOne(model)
  }
}

// **************************************************************************************

function getOne(model) {
  return async function (req, res){
    try {
      var doc = await model
      .findOne({ createdBy: req.user._id, _id: req.params.id })
      .lean()
      .exec()

      if (!doc) {
        return res.status(400).end();
      }
      res.status(200).json({ data: doc });
    } catch (error) {
      console.error(error);
      res.status(400).end();
    }
  };
}

function getMany(model) {
  return async function (req, res) {
    try {
      var docs = await model
        .find()
        .lean()
        .exec();

      res.status(200).json({ data: docs })
    } catch (error) {
      console.log(error);
      res.status(400).end();
    }
  }
}


function getManyByUser(model) {
  return async function (req, res) {
    try {
      var docs = await model
        .find({ createdBy: req.user._id })
        .lean()
        .exec();

      res.status(200).json({ data: docs })
    } catch (error) {
      console.log(error);
      res.status(400).end();
    }
  }
}

function createOne(model) {
  return async function (req, res) {
    var createdBy = req.user._id;

    try {
      var doc = await model.create({
        ...req.body,
        createdBy
      })
      res.status(201).json({ data: doc });
    } catch (error) {
      console.error(error);
      res.status(401).end();
    }
  }
}

function updateOne(model) {
  return async function (req, res) {
    try {
      var updatedDoc = await model.findOneAndUpdate(
        {
          createdBy: req.user._id,
          _id: req.params.id
        },
        req.body,
        { new: true }
      ).lean()
      .exec();
      
      if (!updatedDoc) {
        return res.status(401).end();
      }

      res.status(201).json({ data: updatedDoc });
    } catch (error) {
      console.error(error);
      res.status(401).end();
    }
  }
}

function removeOne(model) {
  return async function (req, res) {
  try {
    var removed = await model.findOneAndRemove({
        createdBy: req.user._id,
        _id: req.params.id
      });

    if (!removed) {
      return res.status(401).end()
    }
    
    res.status(202).json({ data: removed});

    } catch (error) {
      console.error(error);
      res.status(401).end()
    }
  }
}
