import { createClient, defaultExchanges, subscriptionExchange } from "urql";

import { createClient as createWSClient } from "graphql-ws";

export const wsClient =
  typeof window !== "undefined"
    ? createWSClient({
        url: "ws://localhost:8080/v1/graphql",
        on: {
          connecting: () => console.log("connecting"),
          opened: () => console.log("opened"),
          error: (err) => console.log("error", err),
          closed: () => console.log("closed"),
        },
      })
    : null;

export const client = createClient({
  url: "http://localhost:8080/v1/graphql",
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: (operation) => ({
        subscribe: (sink) => ({
          unsubscribe: wsClient.subscribe(operation, sink),
        }),
      }),
    }),
  ],
});
