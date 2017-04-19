# Example of School - WIP -

School-Students-Teachers-Notes relations

Requirement: You have to install **mongo** in your system.


```bash
npm install && npm run start
```


Open browser in **http://localhost:4000** for app

Open browser in **http://localhost:8001/graphiql** for graphiql

School Mutations

```javascript


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

query listSchool {
  school {
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
}


```

Variables Accounts


```Javascript

{
  "id": "58f6d2967cc0bf109e54d037",
  "newSchool": {
    "name": "School name",
    "street": "School direction"
  },
  "updateSchool": {
    "name": "Updated School name",
    "street": "Updated School direction"
  }
}

```
