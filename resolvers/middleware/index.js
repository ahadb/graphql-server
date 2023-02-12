const { skip } = require("graphql-resolvers");
const Task = require("../../database/models/task");
const {isValidObjId} = require('../../database/utils')

// if email is present (we're authenticated via JWT token, then move onto next middleware[resolver])
module.exports.isAuthenticated = (_, __, { email }) => {
  //console.log(email)
  if (!email) {
    throw new Error("Access Denied! Please login to continue");
  }

  return skip;
};

module.exports.isTaskOwner = async (_, { id }, { loggedInUserId }) => {
  try {
    // if(!isValidObjId) {
    //   throw new Error('Invalid Task Id')
    // }
    const task = await Task.findById(id);
    if (!task) {
      throw new Error("Task not found");
    } else if (task.user.toString() !== loggedInUserId) {
      throw new Error("Not authorized as task owner");
    }

    return skip;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
