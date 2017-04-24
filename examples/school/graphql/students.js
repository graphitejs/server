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

export const removeStudent = gql `
  mutation removeStudent($id: String) {
    removeStudent(id: $id) {
      student {
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