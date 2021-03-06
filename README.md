# ngrx-quiz-api

Backend for [ngrx-quiz](https://github.com/pmstss/ngrx-quiz) - MEAN-based Open Source Quiz Platform

**ALPHA VERSION, bugs are highly possible...**

### Live Demo
[https://rankme.pro](https://rankme.pro/)

### Features
* heavy usage of [MongoDB aggregation framework](https://docs.mongodb.com/manual/aggregation/)
* JWT access tokens
* sessions
* social login
* recaptcha
* password recovery mails

### Most important building blocks

* [Node.js](https://github.com/nodejs/node)
* [Express](https://github.com/expressjs/express)
* [MongoDB](https://github.com/mongodb/mongo)
* [Mongoose](https://github.com/Automattic/mongoose)
* [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
* [nodemailer](https://github.com/nodemailer/nodemailer)
* [Typescript](https://github.com/Microsoft/TypeScript)
* [TSLint](https://github.com/palantir/tslint)

### Running locally for development

    git clone https://github.com/pmstss/ngrx-quiz-api && cd ngrx-quiz-api
    <... adjust environment variables, see src/consts/consts.ts ...>
    npm install
    npm run dev
    
### Running locally without development intent

    npm install ngrx-quiz-api
    <... adjust environment variables, see src/consts/consts.ts ...>
    ./node_modules/bin/ngrx-quiz-api    

### Contribution
You are kindly welcome to join to project development!
Feel free to contribute by opening issues with any questions, ideas or feature requests.

### TODO
* update/fix tests. Initial (now highly outdated) version was done with [swagger](https://swagger.io/), [oatts](https://github.com/google/oatts) and [chakram](https://github.com/dareid/chakram/)
* reasonable limitations, protection from abusive usage

### Author
Viachaslau Tyshkavets

### License
[GPLv3](LICENSE.txt) license.
