const mongoose = require('mongoose');

const newsSchema = mongoose.Schema({
    newsID: { type: Number, required: true },
    title: { type: String, required: true },
    content: { type: String },
    image: { type: String },
    createUser: { type: String },
    createDate: { type: Date, default: Date.now() },
    updateUser: { type: String },
    updateDate: { type: Date, default: Date.now() },
    Type: {type: String}
});

// Update the updated_at field on save
newsSchema.pre('save', (next) => {
  this.updated_at = Date.now()
  next()
})

module.exports = News = mongoose.model('News', newsSchema);


