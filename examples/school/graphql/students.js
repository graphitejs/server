import gql from 'graphql-tag';

export const studentList = gql `
  query listSchool {
    schools {
      _id
      name
      active
      street
    }
  }
`;
