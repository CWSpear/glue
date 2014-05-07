/**
 * Snippet.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var uuid = require('node-uuid');
var _ = require('lodash');
var modelist = require('../services/modelist');
var hljs = require('highlight.js');

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
                snippet = _undent(snippet);
                count = i + 1;
                code += "// Selection " + count + ":\n\n" + snippet + "\n\n\n";
            });
            values.snippet = code.trim();
        } else {
            values.snippet = _undent(values.snippet);
        }

        // if there is no filename, we try and detect the language being used
        // (this will be replaced by MLearn.js's implementation of detection)
        var language = false;
        if (!values.filename || values.filename === 'false') {
            language = hljs.highlightAuto(values.snippet).language;
            var ext = modelist.modesByName[language].extensions.split('|')[0];
            values.filename = 'glue.' + ext;
        }

        if (language) {
            values.language = language;
        } else {
            // based on the filename, get the language mode that Ace will use
            var modeObj = modelist.getModeForPath(values.filename);
            values.language = modeObj.name;
        }

        cb(null, values);
    }
};

// Helper Funcions
// -------------------------
function _undent (code) {
    if (!code) return '';

    // we only want to trim the newlines and not the spaces like .trim'd do
    code = code.replace(/^\n+|\n+$/, '');
    var parts = code.split("\n");
    whitespace = [];

    // get an array of the whitespace at the start of each line
    var whitespace = _(parts).map(function(part, index) {
        if (part.trim() === '') return false;
        part = part.replace("\t", "    ");
        var matches = part.match(/( *)/);
        return matches && matches[1] ? matches[1] : '';
    }).reject(function (ws) { return ws === false; });

    // find the shortest amount of whitespace amongst all the line
    var shortest = whitespace.reduce(function (shortest, ws) {
        if (shortest === null) shortest = ws.length;
        return Math.min(shortest, ws.length);
    }, null);

    // remove the LCD of whitespace from the start of each line
    if (shortest !== null && shortest > 0) {
        parts = _.map(parts, function(part) {
            return part.slice(shortest);
        });

        code = parts.join("\n");
    }

    return code;
}