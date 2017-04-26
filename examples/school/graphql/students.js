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

export const remove = gql `
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

export const edit = gql `
  query listStudents {
    students {
      _id
      name
      street
      active
      school {
        _id
        name
        active
        street
      }
    }
    schools {
      _id
      name
      street
    }
  }
`;

export const update = gql `
  mutation updateStudent($id: String, $updateStudent: updateStudent) {
    updateStudent(id: $id, student: $updateStudent) {
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
