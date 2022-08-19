# CS257 Group Project (Hotel Management System)

This is a website designed for internal functioning of a hotel. It can be used for booking purposes by the receptionist. It also provides support system and utility for the guests. From management of housekeepers to restaurant , it provides a wide range of solutions.

## Requirements
For development you will need Node.js and packages like nodemon, express, express-session, pug , my-sql , express-mysql-session , body-parser.
You will also need my sql workbench installed on your system. You will get instructions at [official Mysql website](https://docs.oracle.com/cd/E19078-01/mysql/mysql-workbench/wb-installing.html)

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
- #### Installing the required Node.js packages
  Use the package manager [npm](https://docs.npmjs.com/) to install following modules.

```bash
npm install nodemon express express-session pug my-sql express-mysql-session body-parser
```
- #### Creation of Database
  Open file named query.sql present in the root directory and run it in mysql workbench. \
 Default receptionist with id =1 and password= 1234 has been already created , you can use these credentials to login and create other users.
- #### Changing password of Database in server
  In the file named server.js change the password to the password of your Database
## Usage
- Open the root folder in VS code or any other IDE and run the application using the following command
```bash
nodemon ./app.js
```
- Open your browser and go to the address localhost:3000 

