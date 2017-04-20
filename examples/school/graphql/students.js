import gql from 'graphql-tag';

export const all = gql `
  query listSchool {
    schools {
      _id
      name
      active
      street
    }
  }
`;

export const create = gql `
  mutation createSchool($newSchool: createSchool) {
    createSchool(school: $newSchool) {
      school {
        _id
        name
        street
      }
      errors {
        key
        message
      }
    }
  }
`;
