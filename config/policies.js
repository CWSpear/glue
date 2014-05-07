/**
 * Policy mappings (ACL)
 *
 * Policies are simply Express middleware functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect just one of its actions.
 *
 * Any policy file (e.g. `authenticated.js`) can be dropped into the `/policies` folder,
 * at which point it can be accessed below by its filename, minus the extension, (e.g. `authenticated`)
 *
 * For more information on policies, check out:
 * http://sailsjs.org/#documentation
 */


module.exports.policies = {
        
    '*': [ passport.initialize(), passport.session(), false ],

    SnippetController: {
        '*': false,

        raw: true,

        find: true,
        create:  'apiKey',
        edit:    'apiKey',
        destroy: 'apiKey',
    },

    UserController: {
        // no public access
        '*': false,
        edit: 'github',
        destroy: 'github',
        find: 'github',

        githubAuth: true,
        githubCallback: true,
    },

    ApiKeyController: {
        // no public access
        '*': false, 
    },

    NonceController: {
        // no public access
        '*': false, 
    },

};