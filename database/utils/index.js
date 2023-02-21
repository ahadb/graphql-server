const mongoose = require("mongoose");

module.exports.connection = async () => {
  try {
    mongoose.set('debug', true);
    await mongoose.connect(process.env.MONGO_DB_CONN_STR, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected successfully");
  } catch (err) {
    console.log(err);
  }
};

// module.exports.isValidObjId = (id) => {
//   return mongoose.Types.ObjectId.isValid(id)
// }
