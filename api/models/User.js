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
            uuidv4: true,
            defaultsTo: function () { 
                return uuid.v4();
            },
        },

        firstName: {
            type: 'string',
            // required: true,
        },

        lastName: {
            type: 'string',
            // required: true,
        },

        email: {
            type: 'email',
            // required: true,
        },

        githubId: {
            type: 'string',
            required: true,
        },

        fullName: function () {
            return this.firstName + ' ' + this.lastName;
        },
    }
};
