import gql from 'graphql-tag';

export const all = gql `
  query listStudent {
    students {
      _id
      name
      street
      active
    }
  }
`;

export const create = gql `
  mutation createStudent($newStudent: createStudent) {
    createStudent(student: $newStudent) {
      student {
        _id
        name
        street
        active
      }
      errors {
        key
        message
      }
    }
  }
`;
