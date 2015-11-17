var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SearchSchema = new Schema({
  searchString: { type: String, required: true }
});
module.exports = mongoose.model('Search', SearchSchema);
