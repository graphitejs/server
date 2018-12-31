import { SubscriptionClient } from 'subscriptions-transport-ws'
import { WebSocketLink } from 'apollo-link-ws'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { gql } from 'apollo-server'

import WebSocket from 'ws'

export const CreateClient = () => {
  const wsClient = new SubscriptionClient('ws://localhost:4000/graphql', {}, WebSocket)
  const link = new WebSocketLink(wsClient)
  const cache = new InMemoryCache({})

  const apolloClient = new ApolloClient({
    link,
    cache,
  })

  const subscribe = (query, callback) => {
    return apolloClient.subscribe({
      query: gql(query),
    }).subscribe({
      next(data) {
        callback(data)
      },
    })
  }

  const close = () => {
    wsClient.close()
  }

  return {
    subscribe,
    close,
  }
}
