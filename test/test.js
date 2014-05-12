var assert = require('chai').assert;
var fs     = require('fs');

var fixture = function (f) {
  return fs.readFileSync('./test/fixtures/' + f + '.js', { encoding: 'utf8' });
};

describe('Helpers', function () {
  var Helpers = require('../api/services/helpers');

  describe('undent', function () {
    it('should undent spaces', function () {
      assert.equal(Helpers.undent(fixture('undent-1tabs4spaces-before')), fixture('undent-0tabs4spaces-expected'), '#undent: 4 Spaces');
      assert.equal(Helpers.undent(fixture('undent-4tabs2spaces-before')), fixture('undent-0tabs2spaces-expected'), '#undent: 2 Spaces');
    });

    it('should undent tabs (and convert tabs to 4 spaces)', function () {
      assert.equal(Helpers.undent(fixture('undent-1tabs4tabs-before')), fixture('undent-0tabs4tabs-expected', '#undent: Tabs (4 spaces)'));
      assert.equal(Helpers.undent(fixture('undent-4tabs2tabs-before')), fixture('undent-0tabs2tabs-expected', '#undent: Tabs (2 spaces)'));
    });
  });

  describe('guessTabLength', function () {
    it('should always return 4 for files with tabs', function () {
      assert.equal(Helpers.guessTabLength(fixture('undent-1tabs4tabs-before')),   4, '#guessTabLength: Tabs (1)');
      assert.equal(Helpers.guessTabLength(fixture('undent-0tabs4tabs-expected')), 4, '#guessTabLength: Tabs (2)');
      assert.equal(Helpers.guessTabLength(fixture('undent-4tabs2tabs-before')),   4, '#guessTabLength: Tabs (3)');
      assert.equal(Helpers.guessTabLength(fixture('undent-0tabs2tabs-expected')), 4, '#guessTabLength: Tabs (4)');
    });

    it('should guess tab length for files with spaces', function () {
      assert.equal(Helpers.guessTabLength(fixture('undent-1tabs4spaces-before')),   4, '#guessTabLength: 4 Spaces (1)');
      assert.equal(Helpers.guessTabLength(fixture('undent-0tabs4spaces-expected')), 4, '#guessTabLength: 4 Spaces (2)');
      assert.equal(Helpers.guessTabLength(fixture('undent-4tabs2spaces-before')),   2, '#guessTabLength: 2 Spaces (1)');
      assert.equal(Helpers.guessTabLength(fixture('undent-0tabs2spaces-expected')), 2, '#guessTabLength: 2 Spaces (2)');
    });
  });
});
