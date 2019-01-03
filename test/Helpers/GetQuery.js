export const getQuery = (query) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: `query { ${query} }` }),
})
