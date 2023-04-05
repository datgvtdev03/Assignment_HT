const mongoose = require('mongoose');
const Account = new mongoose.Schema({
  fullName: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  avatar: {
    type: String
  }
});
const User = mongoose.model('account', Account);
module.exports = User;