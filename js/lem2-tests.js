'use strict';
var expect = require('chai').expect;
var LEM2 = require('./lem2.js');

// Data Example 1

var dataSet1 = [["temperature","headache","weakness","nausea","flu"],["very_high","yes","yes","no","yes"],["high","yes","no","yes","yes"],["normal","no","no","no","no"],["normal","yes","yes","yes","yes"],["high","no","yes","no","yes"],["high","no","no","no","no"],["normal","no","yes","no","no"]];
var rulesetFluYes1 = {"rules":[{"conditions":[{"headache":"yes"}],"decision":{"flu":"yes"}},{"conditions":[{"temperature":"high","weakness":"yes"}],"decision":{"flu":"yes"}}]};
var rulesetFluNo1 = {"rules":[{"conditions":[{"temperature":"normal","headache":"no"}],"decision":{"flu":"no"}},{"conditions":[{"headache":"no","weakness":"no"}],"decision":{"flu":"no"}}]}

// Data Example 2

var dataSet2 = [["temperature","headache","nausea","cough","flu"],["high","yes","no","yes","yes"],["very_high","yes","yes","no","yes"],["high","no","no","no","no"],["high","yes","yes","yes","yes"],["normal","yes","no","no","no"],["normal","no","yes","yes","no"]];
var rulesetFluYes2 = {"rules":[{"conditions":[{"headache":"yes","temperature":"high"}],"decision":{"flu":"yes"}},{"conditions":[{"temperature":"very_high"}],"decision":{"flu":"yes"}}]};
var rulesetFluNo2 = {"rules":[{"conditions":[{"headache":"no"}],"decision":{"flu":"no"}},{"conditions":[{"temperature":"normal"}],"decision":{"flu":"no"}}]};

describe('LEM2 Module', function() {
    it('should exist', function() {
        expect(LEM2).to.not.be.undefined;
    });

    it('should have an executeProcedure function', function() {
      expect(LEM2.executeProcedure).to.be.a('function');
    });

    it('should have an getCasesCoveredByRule function', function() {
      expect(LEM2.getCasesCoveredByRule).to.be.a('function');
    });

    it('should have an reduceRuleset function', function() {
      expect(LEM2.reduceRuleset).to.be.a('function');
    });

    // Functions

    describe('#executeProcedure()', function() {
      it('should take a set (concept) and an array (data set) and return a ruleset object (single local covering of the set)', function() {
        // Example 1
        var conceptFluYes = new Set([1,2,4,5]);
        var actual = LEM2.executeProcedure(conceptFluYes, dataSet1);
        expect(actual).to.be.eql(rulesetFluYes1);

        var conceptFluNo = new Set([3,6,7]);
        actual = LEM2.executeProcedure(conceptFluNo, dataSet1);
        expect(actual).to.be.eql(rulesetFluNo1);

        // Example 2
        conceptFluYes = new Set([1,2,4]);
        actual = LEM2.executeProcedure(conceptFluYes, dataSet2);
        expect(actual).to.be.eql(rulesetFluYes2);

        conceptFluNo = new Set([3,5,6]);
        actual = LEM2.executeProcedure(conceptFluNo, dataSet2);
        expect(actual).to.be.eql(rulesetFluNo2);
      })
    });

    describe('#getCasesCoveredByRule', function() {
      it('should take a rule object and an array (data set) and return a set (covered cases)', function() {
        // Example 1
        var coveredCases = new Set([1,2,4]);
        var actual = LEM2.getCasesCoveredByRule(rulesetFluYes1.rules[0], dataSet1);
        expect(actual).to.be.eql(coveredCases);
      })
    });

    describe('#reduceRuleset()', function() {
      it('should take a ruleset object and an array (data set) and return a minimal ruleset object', function() {
        // Example 1 (already minimal)
        var actual = LEM2.reduceRuleset(rulesetFluYes1, dataSet1);
        expect(actual).to.be.eql(rulesetFluYes1);

        actual = LEM2.reduceRuleset(rulesetFluNo1, dataSet1);
        expect(actual).to.be.eql(rulesetFluNo1);

      });
    });
});
