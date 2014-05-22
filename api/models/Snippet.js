/**
 * Snippet.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var uuid = require('node-uuid');
var _    = require('lodash');

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
                // increase chance of collision for shorter URL
                return uuid.v4().slice(0, 7);
            }
        },

        snippet: 'text',
        language: 'string', // used for Ace, based on the modelist
        filename: 'string',

        tabSize: 'integer',

        user: {
            model: 'User',
            required: true,
        },
    },

    beforeValidate: function (model, cb) {
        if (typeof model.snippets === 'string') {
            try {
                model.snippets = JSON.parse(model.snippets);
            } catch (e) {}
        }

        // prefer snippet over snippets
        if (model.snippet && model.snippets) delete model.snippets;

        // if we have an array of one `snippets`, let's treat it as if we just passed a str to `snippet`
        if (model.snippets && _.isArray(model.snippets) && model.snippets.length === 1) {
            model.snippet = model.snippets[0];
            delete model.snippets;
        }

        // if we pass in an array to snippets (of more than 1 snippet), concat them here
        if (model.snippets && _.isArray(model.snippets)) {
            var count = 0;
            var code = '';
            model.snippets.forEach(function (snippet, i) {
                snippet = Helpers.undent(snippet);
                count = i + 1;
                code += "// Selection " + count + ":\n\n" + snippet + "\n\n\n";
            });
            model.snippet = code.trim();
        } else {
            model.snippet = Helpers.undent(model.snippet);
        }

        model.language = Helpers.getLanguageFromSnippetModel(model, !model.isUpdate);
        model.filename = Helpers.getFileNameFromSnippetModel(model, model.isUpdate);

        // snippet tab length
        if (!model.tabSize)
            model.tabSize = Helpers.guessTabSize(model.snippet);

        cb(null, model);
    }
};