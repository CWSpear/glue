/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var uuid = require('node-uuid');

module.exports = {
    schema: true,
    
    attributes: {
        id: {
            primaryKey: true,
            type: 'string',
            unique: true,
            required: true,
            uuidv4: true,
            defaultsTo: function () { 
                return uuid.v4();
            },
        },
        apiKey: {
            type: 'string',
            unique: true,
            required: true,
            defaultsTo: function () { 
                return uuid.v4().replace(/-/g, '');
            },
        },

        name: {
            type: 'string',
        },

        username: {
            type: 'string',
            unique: true,
        },

        email: {
            type: 'email',
            unique: true,
            required: true,
        },

        avatar: {
            type: 'string',
        },

        passports: { 
            collection: 'Passport',
            via: 'user',
        },

        snippets: { 
            collection: 'Snippet',
            via: 'user',
        },
    }
};
