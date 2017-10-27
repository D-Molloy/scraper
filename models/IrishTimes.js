var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var IrishTimesSchema = new Schema({
  // `title` is required and of type String
  headline: {
    type: String,
    required: true
  },
  // `title` is required and of type String
  summary: {
    type: String,
    required: true
  },
    // `link` is required and of type String
  link: {
    type: String,
    required: true
  }
});

// This creates our model from the above schema, using mongoose's model method
var IrishTimes = mongoose.model("IrishTimes", IrishTimesSchema);

// Export the IrishTimes model
module.exports = IrishTimes;