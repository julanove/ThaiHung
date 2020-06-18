const mongoose = require('mongoose');

const mediaSchema = mongoose.Schema({
  mediaID: { type: int, required: true },
  source: { type: String, required: true },
  description: { type: String },
  mediaTypeID: { type: String },
  //created_at: { type: Date, default: Date.now() },
});

// Update the updated_at field on save
//userSchema.pre('save', (next) => {
//  this.updated_at = Date.now()
//  next()
//})

module.exports = User = mongoose.model('media', userSchema);


