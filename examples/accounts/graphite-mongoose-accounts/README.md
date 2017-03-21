# Example Mars mongoose accounts

Requirement: You have to install **mongo** in your system.



```bash
npm install && npm run start
```



Open browser in **http://localhost:8001/graphiql**



```javascript

mutation createUser($email: String, $password: String) {
  createUser(email: $email, password: $password) {
    loginToken
    userId
    loginTokenExpires
  }
}

mutation loginPassword($email: String, $password: String) {
  loginPassword(email: $email, password: $password) {
    loginToken
    userId
    loginTokenExpires
  }
}

mutation loginFacebook {
  loginFacebook {
    url
  }
}

mutation changePassword($oldPassword: String, $newPassword: String) {
  changePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
    loginToken
    userId
    loginTokenExpires
  }
}

query getAccounts {
  accounts {
    _id
    accountPassword {
      _id
      userId
      email
      password
      verifiedEmail
    }
    accountFacebook {
      _id
      userId
      facebookId
      accessToken
    }
  }
}

query getAccountsPassword {
  accountPassword {
    _id
    userId
    email
    password
    verifiedEmail
  }
}

query getAccountsFacebook {
  accountFacebook {
    _id
    userId
    facebookId
    accessToken
  }
}


```

Variables Accounts


```Javascript

{
  "email": "graphitejs@graphitejs.com",
  "password": "123456",
  "oldPassword": "123456",
  "newPassword": "111111"
}

```
