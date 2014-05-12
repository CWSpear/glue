/**
 * Snippet.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var uuid     = require('node-uuid');
var _        = require('lodash');
var hljs     = require('highlight.js');

module.exports = {
    schema: true,

    attributes: {
        id: {
            type: 'string',
            primaryKey: true,
            unique: true,
            required: true,
            // uuidv4: true,
            defaultsTo: function () { 
                // return uuid.v4();
                return uuid.v4().slice(0, 7);
            }
        },

        snippet: 'text',
        language: 'string', // used for Ace, based on the modelist
        filename: 'string',

        // snippet specific settings
        tabSize: 'integer',

        user: { 
            model: 'User',
            required: true,
        },
    },

    beforeValidate: function (values, cb) {
        if (typeof values.snippets === 'string') {
            try {
                values.snippets = JSON.parse(values.snippets);
            } catch (e) {}
        }

        // prefer snippet over snippets
        if (values.snippet && values.snippets) delete values.snippets;

        // if we have an array of one `snippets`, let's treat it as if we just passed a str to `snippet`
        if (values.snippets && _.isArray(values.snippets) && values.snippets.length === 1) {
            values.snippet = values.snippets[0];
            delete values.snippets;
        }

        // if we pass in an array to snippets (of more than 1 snippet), concat them here
        if (values.snippets && _.isArray(values.snippets)) {
            var count = 0;
            var code = '';
            values.snippets.forEach(function (snippet, i) {
                snippet = Helpers.undent(snippet);
                count = i + 1;
                code += "// Selection " + count + ":\n\n" + snippet + "\n\n\n";
            });
            values.snippet = code.trim();
        } else {
            values.snippet = Helpers.undent(values.snippet);
        }

        try {
            // if there is no filename, we try and detect the language being used
            // (this will be replaced by MLearn.js's implementation of detection)
            var language = false;
            if (!values.filename || values.filename === 'false') {
                language = hljs.highlightAuto(values.snippet).language;
                var mode = Modelist.modesByName[language];
                if (mode) {
                    var ext = mode.extensions.split('|')[0];
                    values.filename = 'glue.' + ext;
                } else {
                    values.filename = 'glue.txt';
                }
            }

            if (language) {
                values.language = language;
            } else {
                // based on the filename, get the language mode that Ace will use
                var modeObj = Modelist.getModeForPath(values.filename);
                values.language = modeObj.name;
            }            
        } catch (err) {
            console.error(err);
            throw err;
        }

        // snippet tab length
        if (!values.tabSize)
            values.tabSize = Helpers.guessTabSize(values.snippet);

        console.log(values, values.tabSize);

        cb(null, values);
    }
};