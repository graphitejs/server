<p align="center">
  <img alt="GraphiteJS" src="https://github.com/graphitejs/graphitejs/blob/master/images/graphite.png" width="334">
</p>

<p align="center">
    Framework NodeJS for GraphQl
</p>

<p align="center">
    <a href="http://graphitejs.com"><img alt="graphitejs" src="https://img.shields.io/badge/GraphiteJS-Beta-yellow.svg"></a>
    <a href="https://circleci.com/gh/graphitejs/graphitejs"><img alt="CircleCI Status" src="https://circleci.com/gh/graphitejs/graphitejs.svg?style=shield&circle-token=:circle-token"></a>
    <a href="https://codecov.io/gh/graphitejs/graphitejs"><img alt="Codecov Status" src="https://codecov.io/gh/graphitejs/graphitejs/branch/master/graph/badge.svg"></a>
</p>

<br />

[GraphiteJS](http://graphitejs.com) is a NODE.JS Framework for building GraphQL schemas/types fast, easily and scalability.
This project is a monorepo built with [Lerna](https://github.com/lerna/lerna).

- **Easy to use:** GraphiteJS make easy GraphQL in NodeJS without effort.
- **Any Front:** GraphiteJS support any front library.
- **Data agnostic:** GraphiteJS supports any kind of data source. Now is availabe MongoDB.

---
## Guide

- [How to use](#how-to-use)
  - [Setup](#setup)
  - [Create GraphQl server](#create-graphql-server)
  - [Create a GraphQl Schema model](#create-a-graphql-schema-model)
  - [Querying](#querying)
  - [Mutations](#mutations)
  - [Resolver Query and Mutation](#resolvers-query-and-mutation)
  - [Update GraphQl server](#update-graphql-server)
- [Examples](#examples)
  - [For accounts](#for-accounts)
  - [Todo List](#todo-list)
  - [REST APIs](#rest-apis)
- [Scaffolds](#scaffolds)
- [Packages](#packages)
- [Contributing](#contributing)
- [Team](#team)

---

## How to use

GraphiteJS **allow choose** the packages and built your project **like you want**

Firstly you need to choose one Sever - GraphQL.

## Setup

Install it:

**For example:**

#### Add Graphite server

```bash

npm i @graphite/apollo-express --save

yarn add @graphite/apollo-express

```
#### Add Graphite decorators

```bash

npm i @graphite/decorators --save
yarn add @graphite/decorators

```


## Create GraphQl server:

```javascript

import { Graphite } from '@graphite/apollo-express';
Graphite.graphQLServer({ graphql: PORT: 8001 }, []);

```

Done, your first server **is ready!** Now you only need to create the models and pass them to GraphQl server.

## Create a GraphQl Schema model:

```javascript

import { property, graphQl, query } from '@graphite/decorators';

@graphQl
class Todo {
  @property('String | required')
  name;

  @property('Boolean')
  status = false;
}

export default new Todo();

```


## Querying:

```javascript

import { property, graphQl, query } from '@graphite/decorators';

@graphQl
class Todo {
  @property('String | required')
  name;

  @property('Boolean')
  status = false;

  @query()
  todo() {
    return [
        {
            name: 'To do homework 1',
            status: false
        },
        {
            name: 'To do homework 2',
            status: false
        }
    ];
  }
}

export default new Todo();

```

## Mutations:

```javascript

import { property, graphQl, mutation } from '@graphite/decorators';

@graphQl
class Todo {
  @property('String | required')
  name;

  @property('Boolean')
  status = false;
  
  @mutation({
    fields: 'name: String, status: Boolean',
    responseType: 'Todo',
  })
  async createTodo(_, { name, status }) {
    try {
      // Handling the new data 
      return todo;
    } catch (err) {
      // Handling the error
      return err;
    }
  }
}

export default new Todo();

```

## Mutation decorator

You have to define the arguments will accepts the mutation and return type.

The mutation decorator accepts these type parameter for to define the arguments and return type. 

- **String** - When you pass a String, you are specified the field that will accepts the mutation
The String is a key value where value is a valid Scalar Type. In this case the default return type regards to name Class User.

```javascript

@graphql
class User {
    @mutation('firstName: String, lastName: String')
    createUser(_, { firstName, lastName }) {
        ...
    }
}

```

- **Object**


There two cases, the first one you choose the field and return type. For example below:

```javascript

@graphql
class User {
    @mutation({
        fields: 'firstName: String, lastName: String',
        responseType: 'User',
    })
    createUser(_, { firstName, lastName }) {
        ...
    }
}

```
The second one you pass the type key with option you want. The option can be:

 - **create**

    When you send create like type. This will create an Input Type for the argument. Also will create
    a return type with the current Type object and Error type.


 - **update** 

   When you send update like type. This will create an Input Type with any field required for the argument and id:ID!. Also will create
   a return type with the current Type object and Error type.

 - **remove**

 When you send remove like type. This will id:ID! like paramteer. Also will create
 a return type with the current Type object and Error type.


```javascript

@graphql
class User {
    @mutation({ type: 'create' })
    createUser(_, { user }) {
        ...
    }

    @mutation({ type: 'update' })
    updateUser(_, { id, user }) {
        ...
    }

    @mutation({ type: 'remove' })
    removeUser(_, { id }) {
        ...
    }
}

```

- **Empty**

If you have decided send empty arguments its not have available arguments and  return Type will be the current Type.

## Resolvers Query and Mutation

Every resolver in a GraphQL.js schema accepts four positional arguments:

```javascript

fieldName(obj, args, context, info) { result }

```

These arguments have the following meanings and conventional names:

- **obj**: The object that contains the result returned from the resolver on the parent field, or, in the case of a top-level Query field, the rootValue passed from the server configuration. This argument enables the nested nature of GraphQL queries.

- **args**: An object with the arguments passed into the field in the query. For example, if the field was called with author(name: "Ada"), the args object would be: { "name": "Ada" }.

- **context**: This is an object shared by all resolvers in a particular query, and is used to contain per-request state, including authentication information, dataloader instances, and anything else that should be taken into account when resolving the query. If you’re using Apollo Server, read about how to set the context in the setup documentation.

- **info**: This argument should only be used in advanced cases, but it contains information about the execution state of the query, including the field name, path to the field from the root, and more. It’s only documented in the GraphQL.js source code.


### Resolver result format

Resolvers in GraphQL can return different kinds of results which are treated differently:

- **null or undefined** - this indicates the object could not be found. If your schema says that field is nullable, then the result will have a null value at that position. If the field is non-null, the result will “bubble up” to the nearest nullable field and that result will be set to null. This is to ensure that the API consumer never gets a null value when they were expecting a result.

- **An array** - this is only valid if the schema indicates that the result of a field should be a list. The sub-selection of the query will run once for every item in this array.

- **A promise** - resolvers often do asynchronous actions like fetching from a database or backend API, so they can return promises. This can be combined with arrays, so a resolver can return a promise that resolves to an array, or an array of promises, and both are handled correctly.

- **A scalar or object value** - a resolver can also return any other kind of value, which doesn’t have any special meaning but is simply passed down into any nested resolvers, as described in the next section.
## Update GraphQl server:

You need to pass the new model Todo.

```javascript

import { Graphite } from '@graphite/apollo-express';
import Todo from './models/Todo';

Graphite.graphQLServer({ graphql: PORT: 8001 }, [Todo]);

```

## Examples


Graphite JS, we are working in several examples for you. Nowadays you can find this examples.

#### For accounts:

- [graphite-mongoose-accounts](/examples/accounts/graphite-mongoose-accounts)

#### Todo List:

- [todo-list-redux-sagas](/examples/todo-list-redux-sagas)

- [todo-list](/examples/todo-list)

#### REST APIs:

- [Example with Spotify API](https://github.com/wzalazar/spotify)
- [Demo](https://spotify-graphitejs-scbvotbkhb.now.sh/)

## Scaffolds

Start with this scaffolds.

[Scaffold with React](https://github.com/graphitejs/graphitejs-scaffold-react)


## Packages

GraphiteJS has several solutions. Contains solutions for SERVER or CLIENT.

<table>
    <tr>
        <td colspan="2" align="left"><strong>Server</strong> - GraphQL</td>
    </tr>
    <tr>
        <td width="88%">Package</td>
        <td>Version</td>
    </tr>
    <tr>
        <td>
            <a href="/packages/graphite-apollo-express">graphite-apollo-express</a>
        </td>
        <td>
            <a href="https://www.npmjs.com/package/@graphite/apollo-express">
                <img src="https://img.shields.io/npm/v/@graphite/apollo-express.svg?style=flat"
                     alt="npm"
                     data-canonical-src="https://img.shields.io/npm/v/@graphite/apollo-express.svg?style=flat"
                     style="max-width:100%;">
            </a>
        </td>
    </tr>
</table>

<table>
    <tr>
        <td colspan="2" align="left"><strong>Server</strong> - Common</td>
    </tr>
    <tr>
        <td width="88%">Package</td>
        <td>Version</td>
    </tr>
    <tr>
        <td>
            <a href="/packages/graphite-decorators">graphite-decorators</a>
        </td>
        <td>
            <a href="https://www.npmjs.com/package/@graphite/decorators">
                <img src="https://img.shields.io/npm/v/@graphite/decorators.svg?style=flat"
                     alt="npm"
                     data-canonical-src="https://img.shields.io/npm/v/@graphite/decorators.svg?style=flat"
                     style="max-width:100%;">
            </a>
        </td>
    </tr>
    <tr>
        <td>
            <a href="/packages/graphite-scalars">graphite-scalars</a>
        </td>
        <td>
            <a href="https://www.npmjs.com/package/@graphite/scalars">
                <img src="https://img.shields.io/npm/v/@graphite/scalars.svg?style=flat"
                     alt="npm"
                     data-canonical-src="https://img.shields.io/npm/v/@graphite/scalars.svg?style=flat"
                     style="max-width:100%;">
            </a>
        </td>
    </tr>
    <tr>
        <td>
            <a href="/packages/graphite-utils">graphite-utils</a>
        </td>
        <td>
            <a href="https://www.npmjs.com/package/@graphite/utils">
                <img src="https://img.shields.io/npm/v/@graphite/utils.svg?style=flat"
                     alt="npm"
                     data-canonical-src="https://img.shields.io/npm/v/@graphite/utils.svg?style=flat"
                     style="max-width:100%;">
            </a>
        </td>
    </tr>
</table>

<table>
    <tr>
        <td colspan="2" align="left"><strong>Server</strong> - Databases Connectors</td>
    </tr>
    <tr>
        <td width="88%">Package</td>
        <td>Version</td>
    </tr>
    <tr>
        <td>
            <a href="/packages/graphite-mongoose">graphite-mongoose</a>
        </td>
        <td>
            <a href="https://www.npmjs.com/package/@graphite/mongoose">
                <img src="https://img.shields.io/npm/v/@graphite/mongoose.svg?style=flat"
                     alt="npm"
                     data-canonical-src="https://img.shields.io/npm/v/@graphite/mongoose.svg?style=flat"
                     style="max-width:100%;">
            </a>
        </td>
    </tr>
</table>

<table>
    <tr>
        <td colspan="2" align="left"><strong>Server</strong> - Mongoose Accounts</td>
    </tr>
    <tr>
        <td width="88%">Package</td>
        <td>Version</td>
    </tr>
    <tr>
        <td>
            <a href="/packages/graphite-mongoose-account">graphite-mongoose-account</a>
        </td>
        <td>
            <a href="https://www.npmjs.com/package/@graphite/mongoose-account">
                <img src="https://img.shields.io/npm/v/@graphite/mongoose-account.svg?style=flat"
                     alt="npm"
                     data-canonical-src="https://img.shields.io/npm/v/@graphite/mongoose-account.svg?style=flat"
                     style="max-width:100%;">
            </a>
        </td>
    </tr>
    <tr>
        <td>
            <a href="/packages/graphite-mongoose-account-facebook">graphite-mongoose-account-facebook</a>
        </td>
        <td>
            <a href="https://www.npmjs.com/package/@graphite/mongoose-account-facebook">
                <img src="https://img.shields.io/npm/v/@graphite/mongoose-account-facebook.svg?style=flat"
                     alt="npm"
                     data-canonical-src="https://img.shields.io/npm/v/@graphite/mongoose-account-facebook.svg?style=flat"
                     style="max-width:100%;">
            </a>
        </td>
    </tr>
    <tr>
        <td>
            <a href="/packages/graphite-mongoose-account-password">graphite-mongoose-account-password</a>
        </td>
        <td>
            <a href="https://www.npmjs.com/package/@graphite/mongoose-account-password">
                <img src="https://img.shields.io/npm/v/@graphite/mongoose-account-password.svg?style=flat"
                     alt="npm"
                     data-canonical-src="https://img.shields.io/npm/v/@graphite/mongoose-account-password.svg?style=flat"
                     style="max-width:100%;">
            </a>
        </td>
    </tr>
</table>

<table>
    <tr>
        <td colspan="2" align="left"><strong>Client</strong> - Common</td>
    </tr>
    <tr>
        <td width="88%">Package</td>
        <td>Version</td>
    </tr>
    <tr>
        <td>
            <a href="/packages/graphite-account">graphite-account</a>
        </td>
        <td>
            <a href="https://www.npmjs.com/package/@graphite/account">
                <img src="https://img.shields.io/npm/v/@graphite/account.svg?style=flat"
                     alt="npm"
                     data-canonical-src="https://img.shields.io/npm/v/@graphite/account.svg?style=flat"
                     style="max-width:100%;">
            </a>
        </td>
    </tr>
</table>

<table>
    <tr>
        <td colspan="2" align="left"><strong>Client</strong> - React JS</td>
    </tr>
    <tr>
        <td width="88%">Package</td>
        <td>Version</td>
    </tr>
    <tr>
        <td>
            <a href="/packages/graphite-react-account-facebook">graphite-react-account-facebook</a>
        </td>
        <td>
            <a href="https://www.npmjs.com/package/@graphite/react-account-facebook">
                <img src="https://img.shields.io/npm/v/@graphite/react-account-facebook.svg?style=flat"
                     alt="npm"
                     data-canonical-src="https://img.shields.io/npm/v/@graphite/react-account-facebook.svg?style=flat"
                     style="max-width:100%;">
            </a>
        </td>
    </tr>
    <tr>
        <td>
            <a href="/packages/graphite-react-account-logout">graphite-react-account-logout</a>
        </td>
        <td>
            <a href="https://www.npmjs.com/package/@graphite/react-account-logout">
                <img src="https://img.shields.io/npm/v/@graphite/react-account-logout.svg?style=flat"
                     alt="npm"
                     data-canonical-src="https://img.shields.io/npm/v/@graphite/react-account-logout.svg?style=flat"
                     style="max-width:100%;">
            </a>
        </td>
    </tr>
    <tr>
        <td>
            <a href="/packages/graphite-react-account-password">graphite-react-account-password</a>
        </td>
        <td>
            <a href="https://www.npmjs.com/package/@graphite/react-account-password">
                <img src="https://img.shields.io/npm/v/@graphite/react-account-password.svg?style=flat"
                     alt="npm"
                     data-canonical-src="https://img.shields.io/npm/v/@graphite/react-account-password.svg?style=flat"
                     style="max-width:100%;">
            </a>
        </td>
    </tr>
</table>


## Contributing

Please see our [contributing.md](./CONTRIBUTING.md)

- Clone this repository.
- Install dependencies.

```bash

npm install

```

- Execute a lerna command.

```bash

lerna bootstap

```

**Bootstrap the packages in the current Lerna repo. Installs all of their dependencies and links any cross-dependencies.**

- Manage the packages with npm link.

- Feel free for pull request.


## Documentation

Is under development.

## Team

### Creator

[![Walter Zalazar](https://avatars.githubusercontent.com/u/5795257?s=64)](https://github.com/wzalazar) |
|---|
Walter Zalazar |
:octocat: [@wzalazar](https://github.com/wzalazar) |
:bird: [@wzalazar_](https://twitter.com/wzalazar_) |

### Core members

[![Walter Zalazar](https://avatars.githubusercontent.com/u/5795257?s=64)](https://github.com/wzalazar) |
[![Jose Casella](https://avatars.githubusercontent.com/u/23145933?s=64)](https://github.com/jl-casella) |
|---|---|
Walter Zalazar | José Luis Casella |
:octocat:[@wzalazar](https://github.com/wzalazar) | [@jl-casella](https://github.com/jl-casella) |
:bird:[@wzalazar_](https://twitter.com/wzalazar_) | [@jl-casella](https://twitter.com/jl-casella) |

## License

[MIT](https://github.com/babel/babel/blob/master/LICENSE)
