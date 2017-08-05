# A dashboard to display the results of my automated testing suite

Designed around the MEAN stack (minus the DB) utilising a RESTful API

Make sure to have [NodeJS](https://nodejs.org) installed.

Clone repo: 

    git clone git@github.com:krynv/regression-dashboard.git && cd regression-dashboard

Install dependencies:

    npm i
    npm i -g nodemon
    npm i -g webpack

Run the server:
	
    DEBUG=dashboard:* nodemon

Set up a webpack watch:

    webpack --config webpack.config.js --watch

**Will need to have a working `/reports` directory within the root of this project for the dashboard to work.**
One has been provided as a proof of concept

Further dashboard documentation to follow...
