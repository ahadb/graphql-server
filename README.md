## GraphQL Server API
This repository is a small (but detailed) project that houses a GraphQL API Server using Apollo Server, Express, NodeJS, MongoDB, Mongoose and JWT Authentication. The server is essentially a task manager for users, ...similar to a todo list.

It uses modern syntax, tools and concepts that we would use in the real world to build a GraphQL server from scratch and persists data
from Atlas (Mongo cloud).

It is set up to follow pragmatic design patterns and conforms to modular code, reusability and a single responsibility principles.

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
Change the connection string to connect to your database first. If you're using MongoDB then pass the db in your connection string and it should work automatically.

### Commands
$ npm install
$ npm run dev

http://localhost:3001/graphql

Basics:
 
1. Connect to your database
2. Create a user
3. Add a token to user
4. Begin adding tasks

Auth:
Each user needs to be authenticated and can only perform request/query operations on her tasks.

1. Login to GET/SET token
2. Use the token as "Bearer _TOKEN_" for additional request(s)

See below for the details of the API, and check the docs for the rest of the queries.

### Basic Mutations
You can create your own mutations, here are some of the basics:

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

```gql
mutation CreateTask {
  createTask(input: { name: "Task 1", completed: false }) {
    id
    name
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

```gql
query GetAllTasks {
  tasks {
    id
    name
    completed
    user {
      id
      email
      name
    }
  }
}
```

## Advanced
Some more advanced GraphQL features included in this repo:

1. Relationships
2. Data Loaders (this will help cache our data)
3. Subscriptions
