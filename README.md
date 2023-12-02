# Milestone 4 Project

## FullStack Project Todo APP

This is a simple full-stack to-do list application built using Flask for the backend and React with TypeScript for the frontend. The app supports CRUD operations and implements Role-Based Access Control (RBAC) for user roles.

The backend (Flask) communicates with the frontend (React) through a RESTful API. The API defines endpoints for CRUD operations on tasks, allowing the frontend to interact seamlessly with the backend.

## Technology

- Flask Python

- React Typescript

- Postman

## Getting Started

### Installation

- BE :
  
  ```
  git clone https://github.com/RevoU-FSSE-2/week-22-RPrasetyoB
  cd functions
  pipenv install
  pipenv shell
  flask run
  ```

- FE :
  
  ```
  git clone https://github.com/RevoU-FSSE-2/week-22-RPrasetyoB
  cd hosting
  npm install
  npm run dev
  ```

 

## API Documentation

- [week22-milestone4](https://documenter.getpostman.com/view/29092304/2s9YeHZqCM)
- [postmant](https://drive.google.com/file/d/1CnD0QD1OiVSVurDTurRvbVokhHsbxKUe/view?usp=sharing)

 

## API End Point

|              | Endpoint                | Req body                                                                                       | Access Token | Authorization                                                     |
| ------------ |:-----------------------:|:----------------------------------------------------------------------------------------------:|:------------:| ----------------------------------------------------------------- |
| Login        | POST<br/>/auth/login    | username, password                                                                             | -            | -                                                                 |
| Register     | POST<br/>/auth/register | username (unique), password, role (if role empty auto set to 'user')                           | -            | -                                                                 |
| Get todolist | GET<br/>/todo           | -                                                                                              | required     | by role: admin will get all todo, user only get todo that he made |
| Add new todo | POST<br>/todo           | todo, priority<br/>(status auto set to "in progress"<br/> & due_date auto set to 3 days ahead) | required     | -                                                                 |
| Update todo  | PUT<br>/todo/:id        | todo, status, due_date                                                                         | required     | by username / maker                                               |
| Delete todo  | DEL<br>/todo/:id        |                                                                                                | required     | by username / maker                                               |

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

## Website design

![Screenshot_19](https://github.com/RevoU-FSSE-2/week-22-RPrasetyoB/assets/129088807/fa509fe9-f42e-4b1e-aa0e-a6b3acfd7f09)

## Security Headers
- BE :
  
  ![Screenshot_18](https://github.com/RevoU-FSSE-2/week-22-RPrasetyoB/assets/129088807/dec5df37-621a-4b5e-a9bf-2acf0b10e56d)

- FE :
  
  ![Screenshot_17](https://github.com/RevoU-FSSE-2/week-22-RPrasetyoB/assets/129088807/baada7bb-af58-4799-8303-bf96393830a1)

## Deployment

- FE  :  https://week22-rpb.web.app
- BE :  https://week22-rpb-s6tv3qk23q-uc.a.run.app
