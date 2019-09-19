# regression-dashboard

[![CircleCI](https://circleci.com/gh/krynv/regression-dashboard.svg?style=svg)](https://circleci.com/gh/krynv/regression-dashboard)

A platform created for visualising the latest regression testing results for multiple project environments. 

Tests saved in the `/reports` directory are picked up by the RESTful API which gets consumed by the front end AngularJS application.

The project is designed around the MEAN stack (minus the DB) utilising AngularJS, Epress and NodeJS.

Clone the repo: 

    git clone git@github.com:krynv/regression-dashboard.git && cd regression-dashboard

Install the dependencies:

    npm i
    npm i -g nodemon webpack webpack-cli

Run the server:
	
    DEBUG=dashboard:* nodemon

Set up a webpack watch:

    webpack --config webpack.config.js --watch

> **NOTE**: **You will need to have a working `/reports` directory within the root of this project for the dashboard to work.**
One has been provided as a proof of concept.
