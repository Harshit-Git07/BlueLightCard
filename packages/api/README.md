# BlueLightCard API

Documentation for the OpenAPI spec

## Getting started
To run the API, first install the dependencies with npm. 
`npm i`.

Then run it via Docker compose at the root of this repo, or `npm run start:dev`

## Key Information

* **Local development**. When doing local development, whenever you make a change, it will automatically reload the application for you. Modules are linked from your computer with the Docker virtual machine so are reloaded for you as well.

* **Requests and responses**. Requests and responses should be designed around the OpenAPI spec that is connected with this project. All responses and errors should adhere strictly to this pattern to reduce bugs.
In the future, the application will automatically validate this for you.

## Tech Stack

* **Typescript** - This project uses typescript for typings. Where required, make this available on the frontend for consumption there.
* **Sequelize** - Used to conenct to the database.
* **Routing Controllers** - Used to add decorators to routes like `@Get('/folder')`.
* **Winston** - For logging
* **Jest** - for testing
* **Nodemon / TS Node** - used for running the app locally and hot reloading.