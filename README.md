# Glue
> Throw some code into the air and see what sticks.

Glue is an open-source and self-hosted MEAN application for pasting and sharing snippets.

May add more features. Who knows?

## Technologies
This is a [SailsJS](http://sailsjs.org/) app built on top of the [MEAN](http://mean.io/) stack. You can use any database that Sails' ORM, [Waterline](https://github.com/balderdashy/waterline) supports. The Mavrx Glue site is using MongoDB.

## Installation
This application was build with Sails `0.10.x` in mind.

It's possible the app may be made into an `npm` package, but for now, clone the repo and `cd` into the cloned directory, then:

```bash
# make sure Sails is up to date; currently 0.10 is in beta
npm install -g sails@beta
npm install
bower install
gulp build
sails lift # or "node app"
open http://localhost:1337 # at least in Unix
```

## Docs & API
Documentation and Application Programming Interface Forthcoming.

## TODO
* Lock down the API. Only allow access to people with an API key, limit the number of requests per X time period so that we don't get people abusing the API.
* Create a page that issues/manages accounts/API keys.
* Create lots of plugins that integrate it! (Sublime version is all but done and works great for pasting code out of your editor) (I realize this depends on getting the API finished)
* Integrate with [MLearn.js](https://github.com/surgeforward/MLearn.js/) to auto-detect the language being used if you can't determine it by other means.