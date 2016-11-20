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
        // Example 1
        var dataSet1 = [["temperature","headache","weakness","nausea","flu"],["very_high","yes","yes","no","yes"],["high","yes","no","yes","yes"],["normal","no","no","no","no"],["normal","yes","yes","yes","yes"],["high","no","yes","no","yes"],["high","no","no","no","no"],["normal","no","yes","no","no"]];

        var conceptFluYes = new Set([1,2,4,5]);
        var singleLocalCovering = {"ruleset":[{"conditions":[{"headache":"yes"}],"decision":{"flu":"yes"}},{"conditions":[{"temperature":"high","weakness":"yes"}],"decision":{"flu":"yes"}}]};
        var actual = LEM2.executeProcedure(conceptFluYes, dataSet1);
        expect(actual).to.be.eql(singleLocalCovering);

        var conceptFluNo = new Set([3,6,7]);
        singleLocalCovering = {"ruleset":[{"conditions":[{"temperature":"normal","headache":"no"}],"decision":{"flu":"no"}},{"conditions":[{"headache":"no","weakness":"no"}],"decision":{"flu":"no"}}]};
        actual = LEM2.executeProcedure(conceptFluNo, dataSet1);
        expect(actual).to.be.eql(singleLocalCovering);

        // Example 2
        var dataSet2 = [["temperature","headache","nausea","cough","flu"],["high","yes","no","yes","yes"],["very_high","yes","yes","no","yes"],["high","no","no","no","no"],["high","yes","yes","yes","yes"],["normal","yes","no","no","no"],["normal","no","yes","yes","no"],[""]];

        conceptFluYes = new Set([1,2,4]);
        singleLocalCovering = {"ruleset":[{"conditions":[{"headache":"yes","temperature":"high"}],"decision":{"flu":"yes"}},{"conditions":[{"temperature":"very_high"}],"decision":{"flu":"yes"}}]};
        actual = LEM2.executeProcedure(conceptFluYes, dataSet2);
        expect(actual).to.be.eql(singleLocalCovering);

        conceptFluNo = new Set([3,5,6]);
        singleLocalCovering = {"ruleset":[{"conditions":[{"headache":"no"}],"decision":{"flu":"no"}},{"conditions":[{"temperature":"normal"}],"decision":{"flu":"no"}}]};
        actual = LEM2.executeProcedure(conceptFluNo, dataSet2);
        expect(actual).to.be.eql(singleLocalCovering);
      })
    });
});
