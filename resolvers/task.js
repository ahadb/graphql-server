const uuid = require("uuid");
const { combineResolvers } = require("graphql-resolvers");
const { users, tasks } = require("../mock-data");
const Task = require("../database/models/task");
const User = require("../database/models/user");
const { isAuthenticated, isTaskOwner } = require("./middleware");

module.exports = {
  Query: {
    tasks: combineResolvers(
      isAuthenticated,
      async (_, __, { loggedInUserId }) => {
        try {
          const tasks = await Task.find({ user: loggedInUserId });
          return tasks;
        } catch (err) {
          console.log(err);
          throw err;
        }
      }
    ),
    task: combineResolvers(isAuthenticated, isTaskOwner, async (_, { id }) => {
      // the logged in user and creator of tasks should be able to query their task by id
      // this is the owner
      try {
        const task = await Task.findById(id);
        return task;
      } catch (err) {
        console.log(err);
        throw err;
      }
    }),
  },
  Mutation: {
    createTask: combineResolvers(
      isAuthenticated,
      async (_, { input }, { email }) => {
        try {
          const user = await User.findOne({ email });
          const task = new Task({ ...input, user: user.id });
          const result = await task.save();
          user.tasks.push(result.id);
          await user.save();
          return result;
        } catch (err) {
          console.log(err);
          throw err;
        }
      }
    ),
    updateTask: combineResolvers(
      isAuthenticated,
      isTaskOwner,
      async (_, { id, input }) => {
        try {
          const task = await Task.findByIdAndUpdate(
            id,
            { ...input },
            { new: true }
          );

          return task;
        } catch (err) {
          console.log(err);
          throw err;
        }
      }
    ),
    deleteTask: combineResolvers(
      isAuthenticated,
      isTaskOwner,
      async (_, { id }, { loggedInUserId }) => {
        try {
          const task = await Task.findByIdAndDelete(id);
          // need to delete the tasks in users
          await User.updateOne(
            { _id: loggedInUserId },
            { $pull: { tasks: task.id } }
          );
          return task;
        } catch (err) {
          console.log(err);
          throw err;
        }
      }
    ),
  },
  Task: {
    user: async (parent) => {
      try {
        const user = await User.findById(parent.user);
        return user;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
};
