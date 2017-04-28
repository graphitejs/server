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

export const remove = gql `
  mutation removeSchool($id: String) {
    removeSchool(id: $id) {
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

export const edit = gql `
  query listSchool {
    schools {
      _id
      name
      street
      student {
        _id
        name
        active
        street
      }
    }
    students {
      _id
      name
      street
      active
      school {
        _id
        name
        street
      }
    }
  }
`;

export const update = gql `
  mutation updateSchool($id: String, $updateSchool: updateSchool) {
    updateSchool(id: $id, school: $updateSchool) {
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
