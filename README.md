# Milestone 4 Project

## FullStack Project Todo APP

This is a simple full-stack to-do list application built using Flask for the backend and React with TypeScript for the frontend. The app supports CRUD operations and implements Role-Based Access Control (RBAC) for user roles.

## Technology

- Flask Python

- React Typescript

- Postman

## API Documentation

- [week22-milestone4](https://documenter.getpostman.com/view/29092304/2s9YeHZqCM)
- [postmant](https://drive.google.com/file/d/1CnD0QD1OiVSVurDTurRvbVokhHsbxKUe/view?usp=sharing)

 

## Getting Started

### Installation

- BE :
  
  ```
  cd functions
  pipenv install
  pipenv shell
  python app.py
  ```

- FE :
  
  ```
  cd hosting
  npm install
  npm start
  ```

## API End Point

|              | Endpoint                | Req body                                                                                       | Access Token | Authorization                                                     |
| ------------ |:-----------------------:|:----------------------------------------------------------------------------------------------:|:------------:| ----------------------------------------------------------------- |
| Login        | POST<br/>/auth/login    | username, password                                                                             | -            | -                                                                 |
| Register     | POST<br/>/auth/register | username, password, role (if role empty auto set to 'user')                                    | -            | -                                                                 |
| Get todolist | GET<br/>/todo           | -                                                                                              | required     | by role: admin will get all todo, user only get todo that he made |
| Add new todo | POST<br>/todo           | todo, priority<br/>(status auto set to "in progress"<br/> & due_date auto set to 3 days ahead) | required     | -                                                                 |
| Update todo  | PUT<br>/todo/:id        | todo, status, due_date                                                                         | required     | by username / maker                                               |
| Delete todo  | DEL<br>/todo/:id        |                                                                                                |              | by username / maker                                               |

## Users for test

- admin

```json
{
"username":"rpb"
"password":"rpb123"
}
```

- user

```json
{
"username":"rpb2"
"password":"rpb123"
}
```

## Deployment

- FE  :  https://week22-revou-milestone4.web.app
- BE :  https://week22-rpb-s6tv3qk23q-uc.a.run.app
