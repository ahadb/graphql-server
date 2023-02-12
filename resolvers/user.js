const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { combineResolvers } = require("graphql-resolvers");

//const { users, tasks } = require("../mock-data");
const User = require("../database/models/user");
const Task = require("../database/models/task");
const { isAuthenticated } = require("./middleware");
const { off } = require("../database/models/user");

module.exports = {
 
  Query: {
    user: combineResolvers(isAuthenticated, async (_, __, { email }) => {
      try {
        const user = await User.findOne({email})
        if(!user) {
          throw new Error('User not found')
        }
        return user;
        
      } catch(err) {
        console.log(err)
        throw err
      }
    }),
  },
  Mutation: {
    signup: async (_, { input }) => {
      try {
        const user = await User.findOne({ email: input.email });
        if (user) {
          throw new Error("Email already in use");
        }
        const hashedPwd = await bcrypt.hash(input.password, 12);
        const newUser = new User({
          ...input,
          password: hashedPwd,
        });
        const result = await newUser.save();

        return result;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    login: async (_, { input }) => {
      try {
        const user = await User.findOne({ email: input.email });
        if (!user) {
          throw new Error("User not found");
        }
        const isPwdValid = await bcrypt.compare(input.password, user.password);
        if (!isPwdValid) {
          throw new Error("Incorrect Password");
        }
        const secret = process.env.JWT_SECRET_KEY || "mysecretkey";
        const token = jwt.sign({ email: user.email }, secret, {
          expiresIn: "1d",
        });
        return { token };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  User: {
    tasks: async ({ id }) => {
      try {
        const tasks = await Task.find({ user: id})
        return tasks;
      } catch(err) {
        console.log(err)
        throw err
      }
    },
  },
};
