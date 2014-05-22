var _    = require('lodash');
var hljs = require('highlight.js');

// Helper Funcions
// -------------------------
module.exports = {
    undent: function  (code) {
        if (!code) return '';

        // we only want to trim the newlines and not the spaces like .trim'd do
        // we also want to convert tabs to spaces. Yes. We do.
        code = code.replace(/^\n+|\n+$/, '').replace(/\t/g, '    ');
        var lines = code.split("\n");

        // get an array of the whitespace at the start of each line
        var shortest = _(lines).map(function (line) {
            // skip lines with no code
            if (line.trim() === '') return false;
            var matches = line.match(/^( *)/);
            // if there were no matches, whitespace is ''
            return matches && matches[1] ? matches[1] : '';
        })
        .reject(function (ws) {
            return ws === false;
        })
        .reduce(function (shortest, ws) {
            if (shortest === null) shortest = ws.length;
            return Math.min(shortest, ws.length);
        }, null);

        // remove the LCD of whitespace from the start of each line
        if (shortest !== null && shortest > 0) {
            lines = _.map(lines, function (line) {
                return line.slice(shortest);
            });

            code = lines.join("\n");
        }

        return code;
    },

    // this should be called with code that has NOT been
    // through undent, but should still work either way
    guessTabSize: function (code) {
        var lines = code.split("\n");

        var usesTabs = _.any(lines, function (line) {
            return line[0] === "\t";
        });
        // Helpers.undent turns tabs into 4 spaces
        if (usesTabs) return 4;

        var guessLengths = [8, 4, 3, 2];
        var guess = _(lines).map(function (line) {
            // code blocks can mess up indention guess, so let's
            // skip any lines that start with a *
            if (line.trim()[0] == '*') return 0;

            var matches = line.match(/^( *)/);
            return matches && matches[1] ? matches[1].length : 0;
        }).reject(function (wsLen) {
            return wsLen <= 1;
        }).map(function (wsLen) {
            return _.reduce(guessLengths, function (runningGuess, guess) {
                if (wsLen % guess === 0 && !runningGuess) runningGuess = guess;
                return runningGuess;
            }, false);
        }).min().value();

        if (!guess || guess === Infinity) return 2;
        return guess;
    },

    getLanguageFromSnippetModel: function (model, useFileName) {
        if (model.language) return model.language;

        var language = false;
        if (useFileName !== false && model.filename) {
            var modeObj = Modelist.getModeForPath(model.filename);
            language = modeObj.name;
        }

        return language || hljs.highlightAuto(model.snippet).language;
    },

    getFileNameFromSnippetModel: function (model, override) {
        if (model.filename && !override) return model.filename;

        var basename = 'glue.';
        if (override && model.filename) {
            var parts = model.filename.split('.');
            if (parts.length > 1) {
                parts.pop();
                basename = parts.join('.') + '.';
            }
        }

        var filename = basename + 'txt';
        var language = model.language;

        var mode = Modelist.modesByName[language];
        if (mode) {
            var ext = mode.extensions.split('|')[0];
            filename = basename + ext;
        }

        return filename;
    }
};