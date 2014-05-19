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

    '*': false,

    SnippetController: {
        '*': false,

        raw: true,
        findAll: false,
        findOne: true,

        // both passport and apiKey may change current req.user!
        create:  ['passport', 'apiKey'],
        update:  ['passport', 'authSnippetUser'],
        destroy: ['passport', 'apiKey'],
        // need to be fully auth'd to see user info (access via populate)
        populate: false,

        subscribe: true,
    },

    UserController: {
        // passport sets req.user!
        // findAll will NEVER return all users (see UserController),
        // so it's safe to give access to
        '*': ['passport', 'auth'],
    },

    AuthController: {
        '*': ['passport'],
    },
};