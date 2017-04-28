# Example of School - WIP -

School-Students-Teachers-Notes relations

Requirement: You have to install **mongo** in your system.


```bash
npm install && npm run start
```


Open browser in **http://localhost:4000** for app

Open browser in **http://localhost:8001/graphiql** for graphiql

## School

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
    students {
      _id
      name
      active
      street
    }
  }
}


```

School Variables


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

## Student

Student Mutations

```javascript


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

mutation removeStudent($id: String) {
  removeStudent(id: $id) {
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

query listStudent {
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
}


```

Student Variables


```Javascript

{
  "id": "58f6dc057cc0bf109e54d03a",
  "newStudent": {
    "name": "Student name",
    "street": "Student direction"
  },
  "updateStudent": {
    "name": "New Student name",
    "street": "New Student direction",
    "active": true
  }
}

```

## Teacher

Teacher Mutations

```javascript


mutation createTeacher($newTeacher: createTeacher) {
  createTeacher(teacher: $newTeacher) {
    teacher {
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

mutation updateTeacher($id: String, $updateTeacher: updateTeacher) {
  updateTeacher(id: $id, teacher: $updateTeacher) {
    teacher {
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

mutation removeTeacher($id: String) {
  removeTeacher(id: $id) {
    teacher {
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

query listTeacher {
  teacher {
    _id
    name
    street
    active
  }
}


```

Teacher Variables


```Javascript

{
  "id": "58f6dd957cc0bf109e54d03c",
  "newTeacher": {
    "name": "Teacher name",
    "street": "Teacher direction"
  },
  "updateTeacher": {
    "name": "New Teacher name",
    "street": "New Teacher direction",
    "active": true
  }
}

```