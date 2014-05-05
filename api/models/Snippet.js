/**
 * Snippet.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var uuid = require('node-uuid');
var _ = require('lodash');
var modelist = require('../services/modelist');

module.exports = {

    adapter: 'mysql',

    attributes: {
        id: {
            type: 'string',
            uuidv4: true,
            primaryKey: true,
            unique: true,
            required: true,
            defaultsTo: function () { return uuid.v4(); }
        },
        snippet: 'text',
        language: 'string', // used for Ace
        filename: 'string',
    },

    beforeValidate: function (values, cb) {
        // if we pass in an array to snippets, concat them here
        if (values.snippets && _.isArray(values.snippets) && values.snippets.length === 1) {
            values.snippet = values.snippets[0];
            delete values.snippets;
        } 

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

        if (!values.filename) values.filename = 'unknown.txt';

        var modeObj = modelist.getModeForPath(values.filename);
        values.language = modeObj.name;

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