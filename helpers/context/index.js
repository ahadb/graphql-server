const jwt = require("jsonwebtoken");
const User = require("../../database/models/user");

module.exports.verifyUser = async (req) => {
  try {
    req.email = null;
    req.loggedInUserId = null;
    const bearerFromHeader = req.headers.authorization;
    if (bearerFromHeader) {
      const token = bearerFromHeader.split(" ")[1];
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY || "mysecrectkey"
      );
      console.log(req.email);
      req.email = payload.email;
      const user = await User.findOne({ email: payload.email });
      req.loggedInUserId = user.id;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};
