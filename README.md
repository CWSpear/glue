# Glue
> Throw some code into the air and see what sticks.

Glue is an open-source and self-hosted MEAN application for pasting and sharing snippets.

May add more features. Who knows?

## Technologies
This is a [SailsJS](http://sailsjs.org/) app built on top of the MEAN stack. You can use any database that Sails' ORM, [Waterline](https://github.com/balderdashy/waterline) supports. The Mavrx Glue site is using MongoDB.

## Installation
This application was built with Sails `0.10.x` in mind.

It's possible the app may be made into an `npm` package, but for now, clone the repo and `cd` into the cloned directory, then:

```bash
npm install # this will install sails 0.10.x locally
bower install
gulp build
node app # or if you have sails installed globally: "sails lift"
open http://localhost:1337 # at least in Unix
```

## Docs & API
**POSTing Snippets**
`POST /api/snippets`

```javascript
{
    // You can either pass in an array of code snippets in `snippets`
    // or a single snippets in `snippet`. If both are present, then
    // `snippet` is preferred over `snippets`.
    snippet: 'text', // either this or snippets is required
    // snippets: 'array',

    // If you pass in an *optional* filename, it will use this to help
    // detect syntax highlighting.
    filename: 'string', // optional, but helps with syntax highlighting 

    // You can pass in the tab size for spaces (tabs are converted to 4
    // spaces automatically). This is *optional* as Glue will try and
    // determine the tab size based on your code.
    tabSize: 'integer', // optional, default is to "guess"

    // You need an API key to POST snippets programattically. Sign up
    // at http://glue.mavrx.io/#/account/ for an API key.
    apiKey: 'string', // required

    // Some plugins prefer to be redirected to the URL rather than having
    // the snippet model returned. Set this to true for that to happen.
    redirect: 'boolean', // optional, default is false
}
```

## TODO
* [ ] ~~Lock down the API. Only allow access to people with an API key,~~ limit the number of requests per X time period so that we don't get people abusing the API.
* [x] ~~Create a page that issues/manages accounts/API keys.~~
* [ ] Create lots of plugins that integrate it! (~~Sublime version is all but done and works great for pasting code out of your editor) (I realize this depends on getting the API finished)~~ For example: [Sublime's plugin](https://github.com/surgeforward/glue-sublime-plugin)
* [ ] Integrate with [MLearn.js](https://github.com/surgeforward/MLearn.js/) to auto-detect the language being used if you can't determine it by other means.
* [ ] More and/or better testing!