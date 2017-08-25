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

- [How to use](#how-to-use)
  - [Setup](#setup)
- [Contributing](#contributing)
- [Team](#team)

## How to work

GraphiteJS **allow choose** the packages and built your project **like you want**

Firstly you need to choose one Sever - GraphQL.

**For example:**

```bash

npm i @graphite/apollo-express --save

```


#### Create GraphQl server:

```javascript

import { Graphite } from '@graphite/apollo-express';
Graphite.graphQLServer({ graphql: PORT: 8001 }, []);

```

Done, your first server **is ready!** Now you only need to create the models and pass them to GraphQl server.

#### Create your first model:

```bash

npm i @graphite/decorators --save

```

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

#### Update GraphQl server:

Now, you need to pass the new model Todo.

```javascript

import { Graphite } from '@graphite/apollo-express';
import Todo from './models/Todo';

Graphite.graphQLServer({ graphql: PORT: 8001 }, [Todo]);

```

## Examples


Graphite JS, we are working in several examples for you. Nowadays you can find this examples.

For accounts:

[graphite-mongoose-accounts](/examples/accounts/graphite-mongoose-accounts)

Todo List:

[todo-list-redux-sagas](/examples/todo-list-redux-sagas)

[todo-list](/examples/todo-list)

REST APIs:

[Example with Spotify API](https://github.com/wzalazar/spotify) <br/>
[Demo](https://spotify-graphitejs-scbvotbkhb.now.sh/)

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

Please see our [contributing.md](./contributing.md)

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
