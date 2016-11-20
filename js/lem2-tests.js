'use strict';
var expect = require('chai').expect;
var LEM2 = require('./lem2.js');

describe('LEM2 Module', function() {
    it('should exist', function() {
        expect(LEM2).to.not.be.undefined;
    });

    it('should have an executeProcedure function', function() {
      expect(LEM2.executeProcedure).to.be.a('function');
    });

    describe('#executeProcedure()', function() {
      it('should take a set (concept) and an array (data set) and return a single local covering of the set', function() {
        var dataSet = [["temperature","headache","weakness","nausea","flu"],["very_high","yes","yes","no","yes"],["high","yes","no","yes","yes"],["normal","no","no","no","no"],["normal","yes","yes","yes","yes"],["high","no","yes","no","yes"],["high","no","no","no","no"],["normal","no","yes","no","no"]];

        var conceptFluYes = new Set([1,2,4,5]);
        var singleLocalCovering = {"ruleset":[{"conditions":[{"headache":"yes"}],"decision":{"flu":"yes"}},{"conditions":[{"temperature":"high","weakness":"yes"}],"decision":{"flu":"yes"}}]};
        var actual = LEM2.executeProcedure(conceptFluYes, dataSet);
        expect(actual).to.be.eql(singleLocalCovering);

        var conceptFluNo = new Set([3,6,7]);
        var singleLocalCovering = {"ruleset":[{"conditions":[{"temperature":"normal","headache":"no"}],"decision":{"flu":"no"}},{"conditions":[{"headache":"no","weakness":"no"}],"decision":{"flu":"no"}}]};
        var actual = LEM2.executeProcedure(conceptFluNo, dataSet);
        expect(actual).to.be.eql(singleLocalCovering);
      })
    });
});
