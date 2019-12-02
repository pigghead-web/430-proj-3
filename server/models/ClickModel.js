/**
  model for score
* */

// - REQUIRE -
const mongoose = require('mongoose'); // for creating schemas

// mongoose.Promise = global.Promise;

const convertId = mongoose.Types.ObjectId;

let ClickModel = {};

// - SCHEMA -
// Define our schema
const ClickSchema = new mongoose.Schema({
  totalClicks: { // Life time score
    type: Number,
    min: 0,
    required: true,
  },

  currentClicks: { // Currency more or less
    type: Number,
    min: 0,
    required: true,
  },

  autoClickers: { // How many auto clickers do we have
    type: Number,
    min: 0,
    required: true,
  },

  clickRate: { // Time between auto click
    type: Number,
    max: 1000, // Simulate miliseconds
    required: true,
  },
});

ClickSchema.statics.toAPI = (doc) => ({
  totalClicks: doc.totalClicks,
  currentClicks: doc.currentClicks,
  autoClickers: doc.autoClickers,
  clickRate: doc.clickRate,
});

ClickSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return ClickModel.find(search).select('totalClicks currentClicks autoClickers clickRate').exec(callback);
};

ClickModel = mongoose.model('ClickModel', ClickSchema);

module.exports.ClickModel = ClickModel;
module.exports.ClickSchema = ClickSchema;
