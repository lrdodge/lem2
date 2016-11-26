'use strict';
require('./set.js');
const expect = require('chai').expect;
const LEM2 = require('./lem2.js');

// Data Example 1

const dataSet1 = [["temperature","headache","weakness","nausea","flu"],["very_high","yes","yes","no","yes"],["high","yes","no","yes","yes"],["normal","no","no","no","no"],["normal","yes","yes","yes","yes"],["high","no","yes","no","yes"],["high","no","no","no","no"],["normal","no","yes","no","no"]];
const rulesetFluYes1 = {"rules":[{"conditions":[{"attribute":"headache","value":"yes"}],"decision":{"flu":"yes"}},{"conditions":[{"attribute":"temperature","value":"high"},{"attribute":"weakness","value":"yes"}],"decision":{"flu":"yes"}}]};
const rulesetFluNo1 = {"rules":[{"conditions":[{"attribute":"temperature","value":"normal"},{"attribute":"headache","value":"no"}],"decision":{"flu":"no"}},{"conditions":[{"attribute":"headache","value":"no"},{"attribute":"weakness","value":"no"}],"decision":{"flu":"no"}}]};
const blocks1 = {"temperature":{"very_high":[1],"high":[2,5,6],"normal":[3,4,7]},"headache":{"yes":[1,2,4],"no":[3,5,6,7]},"weakness":{"yes":[1,4,5,7],"no":[2,3,6]},"nausea":{"yes":[2,4],"no":[1,3,5,6,7]}};

// Data Example 2

const dataSet2 = [["temperature","headache","nausea","cough","flu"],["high","yes","no","yes","yes"],["very_high","yes","yes","no","yes"],["high","no","no","no","no"],["high","yes","yes","yes","yes"],["normal","yes","no","no","no"],["normal","no","yes","yes","no"]];
const rulesetFluYes2 = {"rules":[{"conditions":[{"attribute":"headache","value":"yes"},{"attribute":"temperature","value":"high"}],"decision":{"flu":"yes"}},{"conditions":[{"attribute":"temperature","value":"very_high"}],"decision":{"flu":"yes"}}]};
const rulesetFluNo2 = {"rules":[{"conditions":[{"attribute":"headache","value":"no"}],"decision":{"flu":"no"}},{"conditions":[{"attribute":"temperature","value":"normal"}],"decision":{"flu":"no"}}]};
const blocks2 = {"temperature":{"very_high":[2],"high":[1,3,4],"normal":[5,6]},"headache":{"yes":[1,2,4,5],"no":[3,6]},"nausea":{"yes":[2,4,6],"no":[1,3,5]},"cough":{"yes":[1,4,6],"no":[2,3,5]}};

describe('LEM2 Module', function() {
    it('should exist', function() {
        expect(LEM2).to.not.be.undefined;
    });

    it('should have an executeProcedure function', function() {
      expect(LEM2.executeProcedure).to.be.a('function');
    });

    it('should have a blocks object', function() {
      expect(LEM2.blocks).to.be.a('object');
    });

    it('should have an newAttributeValueBlocks function', function() {
      expect(LEM2.newAttributeValueBlocks).to.be.a('function');
    });

    it('should have an getCasesCoveredByRule function', function() {
      expect(LEM2.getCasesCoveredByRule).to.be.a('function');
    });

    it('should have an reduceRuleset function', function() {
      expect(LEM2.reduceRuleset).to.be.a('function');
    });

    // Functions

    describe('#newAttributeValueBlocks()', function() {
      it('should take an array (data set) and create a blocks object (attribute-value blocks)', function() {
        const dataset = [["A1","A2","D"],["N","N","False"],["N","Y","True"],["Y","N","False"],["Y","Y","True"]];
        const blocks = {"A1":{"Y":[3,4],"N":[1,2]},"A2":{"Y":[2,4],"N":[1,3]}};
        LEM2.newAttributeValueBlocks(dataset);
        expect(LEM2.blocks).to.be.eql(blocks);

        // Example 1
        LEM2.newAttributeValueBlocks(dataSet1);
        expect(LEM2.blocks).to.be.eql(blocks1);

        // Example 2
        LEM2.newAttributeValueBlocks(dataSet2);
        expect(LEM2.blocks).to.be.eql(blocks2);
      });

      it('should not modify the input array (data set)', function() {
        let expected = [["temperature","headache","weakness","nausea","flu"],["very_high","yes","yes","no","yes"],["high","yes","no","yes","yes"],["normal","no","no","no","no"],["normal","yes","yes","yes","yes"],["high","no","yes","no","yes"],["high","no","no","no","no"],["normal","no","yes","no","no"]];
        expect(dataSet1).to.be.eql(expected);

        expected = [["temperature","headache","nausea","cough","flu"],["high","yes","no","yes","yes"],["very_high","yes","yes","no","yes"],["high","no","no","no","no"],["high","yes","yes","yes","yes"],["normal","yes","no","no","no"],["normal","no","yes","yes","no"]];
        expect(dataSet2).to.be.eql(expected);
      })
    });

    describe('#executeProcedure()', function() {
      it('should take a set (concept) and an array (data set) and return a ruleset object (single local covering of the set)', function() {
        // Example 1
        let conceptFluYes = new Set([1,2,4,5]);
        let actual = LEM2.executeProcedure(conceptFluYes, dataSet1);
        expect(actual).to.be.eql(rulesetFluYes1);

        let conceptFluNo = new Set([3,6,7]);
        actual = LEM2.executeProcedure(conceptFluNo, dataSet1);
        expect(actual).to.be.eql(rulesetFluNo1);

        // Example 2
        conceptFluYes = new Set([1,2,4]);
        actual = LEM2.executeProcedure(conceptFluYes, dataSet2);
        expect(actual).to.be.eql(rulesetFluYes2);

        conceptFluNo = new Set([3,5,6]);
        actual = LEM2.executeProcedure(conceptFluNo, dataSet2);
        expect(actual).to.be.eql(rulesetFluNo2);
      });
    });

    describe('#getCasesCoveredByRule', function() {
      it('should take a rule object and an array (data set) and return a set (covered cases)', function() {
        // Example 1
        LEM2.newAttributeValueBlocks(dataSet1);
        let coveredCases = new Set([1,2,4]);
        let actual = LEM2.getCasesCoveredByRule(rulesetFluYes1.rules[0], dataSet1);
        expect(Array.from(actual)).to.be.eql(Array.from(coveredCases));

        coveredCases = new Set([5]);
        actual = LEM2.getCasesCoveredByRule(rulesetFluYes1.rules[1], dataSet1);
        expect(Array.from(actual)).to.be.eql(Array.from(coveredCases));

        coveredCases = new Set([3,7]);
        actual = LEM2.getCasesCoveredByRule(rulesetFluNo1.rules[0], dataSet1);
        expect(Array.from(actual)).to.be.eql(Array.from(coveredCases));

        coveredCases = new Set([3,6]);
        actual = LEM2.getCasesCoveredByRule(rulesetFluNo1.rules[1], dataSet1);
        expect(Array.from(actual)).to.be.eql(Array.from(coveredCases));
      });
    });

    describe('#reduceRuleset()', function() {
      it('should take a ruleset object and an array (data set) and return a minimal ruleset object', function() {
        // Example 1 (already minimal)
        let actual = LEM2.reduceRuleset(rulesetFluYes1, dataSet1);
        expect(actual).to.be.eql(rulesetFluYes1);

        actual = LEM2.reduceRuleset(rulesetFluNo1, dataSet1);
        expect(actual).to.be.eql(rulesetFluNo1);

        // Example 1 (not minimal)
        const expandedRulesetFluYes1 = {"rules":[{"conditions":[{"headache":"yes"}],"decision":{"flu":"yes"}},{"conditions":[{"headache":"yes"},{"weakness":"yes"},{"nausea":"yes"}],"decision":{"flu":"yes"}},{"conditions":[{"temperature":"high","weakness":"yes"}],"decision":{"flu":"yes"}}]};
        actual = LEM2.reduceRuleset(expandedRulesetFluYes1, dataSet1);
        expect(actual).to.be.eql(rulesetFluYes1);

        const expandedRulesetFluNo1 = {"rules":[{"conditions":[{"temperature":"normal","headache":"no"}],"decision":{"flu":"no"}},{"conditions":[{"temperature":"normal","headache":"no","weakness":"yes"}],"decision":{"flu":"no"}},{"conditions":[{"headache":"no","weakness":"no"}],"decision":{"flu":"no"}},{"conditions":[{"temperature":"normal","headache":"no","weakness":"no"}],"decision":{"flu":"no"}}]};
        actual = LEM2.reduceRuleset(expandedRulesetFluNo1, dataSet1);
        expect(actual).to.be.eql(rulesetFluNo1);
      });
    });
});
