# node-react-heroku-template

## SETUP

These instruction assume you have already started a Heroku app to host this project on.

1. Create `.env` file with the following variables:
	* `PORT=` *port number to use for local dev env*
	* `HEROKU_URL=` *heroku app url*

2. ```yarn install```
3. ```cd client && yarn install```
4. In `App.js` update the `baseURL` to reflect the correct Heroku URL for production.

5. In root run ```yarn dev```

6. In `client` run ```yarn start```

*If you have set up successfully localhost:3000 should have a blue banner that reads **hello world**.*
