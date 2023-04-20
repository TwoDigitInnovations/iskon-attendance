const localStratagy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("User");
module.exports = new localStratagy(
  {
    usernameField: "phone",
    passwordField: "password",
  },
  async (username, password, callback) => {
    try {
      let user = await User.findOne({
        $or: [{ phone: username }, { email: username }],
      });
      if (user) {
        if (!user.isValidPassword(password)) {
          return callback(null, false, { message: "Password is Incorrect." });
        }
      } else {
        return callback(null, false, { message: "User does not exist." });
      }
      return callback(null, user, { message: "Successfully LoggedIn." });
    } catch (error) {
      return callback(error, false, { message: "Something Went Wrong." });
    }
  }
);
