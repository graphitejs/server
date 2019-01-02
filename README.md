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

GraphiteJS is a NODE.JS Framework for building GraphQL schemas/types fast, easily and scalability. 

- **Easy to use:** GraphiteJS make easy GraphQL in NodeJS without effort.
- **Any Front:** GraphiteJS support any front library.
- **Data agnostic:** GraphiteJS supports any kind of data source.

---
## Guide

- [Install](#install)
- [How to use](#how-to-use)
    - [Types](#types)
    - [Queries](#queries)
    - [Mutations](#mutations)
    - [Subscriptions](#subscriptions)
    - [Relations](#relations)
- [Contributing](#contributing)
- [Team](#team)

---

## Install

```bash

npm i @graphite/server --save

yarn add @graphite/server

```

on your index file:

```javascript

import { Graphite } from '@graphite/server'

main = async () => {
  const graphite = await Graphite()
}

main()

```

and that's all, you have running the graphqli tool on the port [4000](http://localhost:4000/graphqle) by default.

## How to use

After install `@graphite/server` you have to create your first model. I recommend creating a folder called models and follow the pattern matching the filename with the Type name.

#### Types

```javascript

import { GraphQL } from '@graphite/server'

export const Developer = GraphQL('Developer')({
   // the value always have to be an array first arg is the type, the second arg is an optional comment
  name: ['String!', 'Your name is required'],
  age: ['Number'],
  isGreatDeveloper: ['Boolean']
})

```

So, now you need to pass this model to the Graphite Server


on `index.js`

```javascript

import { Graphite } from '@graphite/server'
import { Developer } from './models/Developer'

main = async () => {
  await Graphite({ models: [Developer] })
}

main()

```

#### Queries


```javascript

import { GraphQL } from '@graphite/server'

export const Developer = GraphQL('Developer')({
  name: ['String!', 'Your name is required'],
  age: ['Number'],
  isGreatDeveloper: ['Boolean'],

  Query: {
    'developer: Developer': () => ({ name: 'Your name' }),
    'developers: [Developer]': () => ([{ name: 'Your name' }]),
  }
})

```

#### Mutations


```javascript

import { GraphQL } from '@graphite/server'

export const Developer = GraphQL('Developer')({
  name: ['String!', 'Your name is required'],

  Mutation: {
    'createDeveloper(name: String): Developer': (_, { name, }) => ({ name }),
    'updateDeveloper(id: ID!, name: String): Developer': (_, { name }) => ({ name }),
    'removeDeveloper(id: ID!): Developer': (_, { name }) => ({ name }),
  },
})

```


#### Subscriptions


```javascript

import { GraphQL, PubSub } from '@graphite/server'

const pubsub = new PubSub()
const DEVELOPER_ADDED = 'DEVELOPER_ADDED'

export const Developer = GraphQL('Developer')({
  name: ['String!', 'Your name is required'],

  Mutation: {
    'createDeveloper(name: String): Developer': (_, { name, }) => { 
      pubsub.publish(DEVELOPER_ADDED, { developerAdded: { name } })
      return { name }
    },
  },

  Subscription: {
    'developerAdded: Developer': {
      subscribe: () => pubsub.asyncIterator([DEVELOPER_ADDED]),
    },
  },
})

```

#### Relations


```javascript

  // models/Repository.js
  const Repository = GraphQL('Repository')({
      name: ['String'],
      url: ['String'],
  })

  // models/GithubProfile.js
  const GithubProfile = GraphQL('GithubProfile')({
      url: ['String'],
  })

  // models/Developer.js
  const Developer = GraphQL('Developer')({
    name: ['String'],

    'respositories: [Repository]': () => [{ name: 'GraphiteJS', url: 'https://github.com/graphitejs/graphitejs' }],

    'githubProfile: GithubProfile': () => ({ url: 'https://github.com/wzalazar' }),

    Query: {
      'developer: Developer': () => ({ name: 'Walter Zalazar' }),
    },
  })

```

So, now you need to pass this model to the Graphite Server


on `index.js`

```javascript

import { Graphite } from '@graphite/server'
import { Developer } from './models/Developer'
import { Repository } from './models/Repository'
import { GithubProfile } from './models/GithubProfile'

main = async () => {
  await Graphite({ models: [Developer, Repository, GithubProfile] })
}

main()

```

## Contributing

Please see our [contributing.md](./CONTRIBUTING.md)

- Clone this repository.
- Install dependencies.

```bash

npm install

```

- Feel free for pull request.


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
