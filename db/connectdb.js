const mongoose = require('mongoose');

const dbconnect = () => {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Database is connected"))
    .catch(err => console.error("Unable to connect with Database", err));
};

module.exports = dbconnect;
