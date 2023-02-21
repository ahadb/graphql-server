const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const cors = require("cors");
const dotEnv = require("dotenv");
const DataLoader = require("dataloader");

const resolvers = require("./resolvers");
const schemas = require("./schemas");
const { connection } = require("./database/utils");
const { verifyUser } = require("./helpers/context");
const loaders = require("./loaders");

dotEnv.config();

const PORT = process.env.PORT || 3000;
const app = express();
connection();

app.use(cors());

app.use(express.json());

const apolloServer = new ApolloServer({
  typeDefs: schemas,
  resolvers,
  // evaluate jwt
  // context can be an object or function
  // object won't declare on per req basis, use a fn instead
  // real world scenario is a function
  context: async ({ req, connection }) => {
    const contextObj = {};
    if (req) {
      await verifyUser(req);
      contextObj.email = req.email;
      contextObj.loggedInUserId = req.loggedInUserId;
    }

    contextObj.loaders = {
      user: new DataLoader((keys) => loaders.user.batchUsers(keys)),
    };

    return contextObj;
  },
});

apolloServer.applyMiddleware({ app, path: "/graphql" });

app.use("/", (req, res, next) => {
  res.send({ message: "Hello" });
});

// subscription
const httpServer = app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
  console.log(`Graphql Endpoint: ${apolloServer.graphqlPath}`);
});

// app.listen(PORT, () => {
//   console.log(`Server listening on PORT: ${PORT}`);
//   console.log(`Graphql Endpoint: ${apolloServer.graphqlPath}`);
// });

apolloServer.installSubscriptionHandlers(httpServer);
