## GraphQL Server API
This repository is a small (but detailed) project that houses a GraphQL API Server with Apollo Server, Express, NodeJS, MongoDB, Mongoose and JWT Authentication. The server is essentially a task manager for users, ...similar to a todo list.

It uses all the modern syntax, tools and concepts that we would use to build a GraphQL server from scratch and persists data
from Atlas (Mongo cloud, though you could use your own).

## Dependencies (packages)

* GraphQL & friends
* Apollo Server
* Express & friends
* Mongoose models
* Dot env
* Bcrypt
* Json web token
* Uuid

## Get Started

### Commands
$ npm install
$ npm run dev

http://localhost:3001/graphql

Basics:
 
1. Connect to your database
2. Create a user

Auth:
Each user needs to be authenticated and can only perform CRUD operations on her tasks.

1. Login to GET/SET token
2. Use the token as "Bearer _TOKEN_" for additional CRUD request(s)

See below for the details of the API, and check the docs for the rest of the queries.

### Basic Mutations

```gql
mutation CreateUser {
  signup(input: {
    name: "Ahad",
    email: "Ahad@test.com",
    password: "abcde"
  }), {
    id
    name
    email
    createdAt
    updatedAt
  }
}
```

```gql
mutation Login {
  login(input: {
    email: "Ahad@test.com",
    password: "abcde"
  }) {
    token
  }
}
```

### Basic Queries

```gql
query GetUser {
  user {
    name
    email
    tasks {
      id
      name
    }
  }
}
```
