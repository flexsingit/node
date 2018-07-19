# Building a RESTful API in Node and Express
# Using the Express Router to build an API
# Making the test cases for Login API
# Run test cases after database creation, add a user by signup API 

## Requirements

- Node and npm

## Installation

- Install dependencies: `npm install`
- Start the server: `npm start`
- Run test cases with coverage: `npm test`
- Read below explanations

## 1. Signup API

    #Api Url

        http://localhost:3000/user/api/signup

    - After successfully Installation
    - Open Postman
    - Choose POST Method and enter above API Url
    - Click on Header tab in postman, Enter below header key or value
        - Content-Type : application/json
    - Click on Body tab in postman 
        - Click on raw button
        - Copy below JSON and paste it as a raw json 
        <!-- 
            {
                "name":"Manoj Bhagat",
                "emailid":"test@gmail.com",
                "password":"12345",
                "username":"test",
                "mobile":"9999999999"
            }
        -->
        - username is unique. if you will try to signup with the same unique name api will through the error.


## 2. Signin API

    #Api Url

        http://localhost:3000/user/api/signin

    - Open Postman
    - Choose POST Method and enter above API Url
    - Click on Header tab in postman, Enter below header key or value
        - Content-Type : application/json
    - Click on Body tab in postman 
        - Click on raw button
        - Copy below JSON and paste it as a raw json
        <!-- 
            {
                "username":"manoj1989",
                "password":"12345"
            }
        -->
