import { introspectionQuery } from 'graphql/utilities/introspectionQuery';
import { buildClientSchema } from 'graphql/utilities/buildClientSchema';
import { printSchema } from 'graphql/utilities/schemaPrinter';
import fetch from 'node-fetch';

export const getSchema = async function(url) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: introspectionQuery }),
    });

    const { data, errors } = await response.json();

    if (errors) {
      throw new Error(JSON.stringify(errors, null, 2));
    }
    const schema = buildClientSchema(data);
    return printSchema(schema);
  } catch (e) {
    return e;
  }
};
