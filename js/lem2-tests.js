'use strict';
require('./set.js');
const expect = require('chai').expect;
const LEM2 = require('./lem2.js');

// Data Example 1

const dataSet1 = [["temperature", "headache", "weakness", "nausea", "flu"], ["very_high", "yes", "yes", "no", "yes"], ["high", "yes", "no", "yes", "yes"], ["normal", "no", "no", "no", "no"], ["normal", "yes", "yes", "yes", "yes"], ["high", "no", "yes", "no", "yes"], ["high", "no", "no", "no", "no"], ["normal", "no", "yes", "no", "no"]];
const rulesetFluYes1 = [{ "conditions": [{ "attribute": "headache", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }, { "conditions": [{ "attribute": "temperature", "value": "high" }, { "attribute": "weakness", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }];
const rulesetFluNo1 = [{ "conditions": [{ "attribute": "temperature", "value": "normal" }, { "attribute": "headache", "value": "no" }], "decision": { "name": "flu", "value": "no" } }, { "conditions": [{ "attribute": "headache", "value": "no" }, { "attribute": "weakness", "value": "no" }], "decision": { "name": "flu", "value": "no" } }];
const blocks1 = { "temperature": { "very_high": [1], "high": [2, 5, 6], "normal": [3, 4, 7] }, "headache": { "yes": [1, 2, 4], "no": [3, 5, 6, 7] }, "weakness": { "yes": [1, 4, 5, 7], "no": [2, 3, 6] }, "nausea": { "yes": [2, 4], "no": [1, 3, 5, 6, 7] } };
const conceptFluYes1 = { "decision": "flu", "value": "yes", "cases": new Set([1, 2, 4, 5]) };
const conceptFluNo1 = { "decision": "flu", "value": "no", "cases": new Set([3, 6, 7]) };

// Data Example 2

const dataSet2 = [["temperature", "headache", "nausea", "cough", "flu"], ["high", "yes", "no", "yes", "yes"], ["very_high", "yes", "yes", "no", "yes"], ["high", "no", "no", "no", "no"], ["high", "yes", "yes", "yes", "yes"], ["normal", "yes", "no", "no", "no"], ["normal", "no", "yes", "yes", "no"]];
const rulesetFluYes2 = [{ "conditions": [{ "attribute": "headache", "value": "yes" }, { "attribute": "temperature", "value": "high" }], "decision": { "name": "flu", "value": "yes" } }, { "conditions": [{ "attribute": "temperature", "value": "very_high" }], "decision": { "name": "flu", "value": "yes" } }];
const rulesetFluNo2 = [{ "conditions": [{ "attribute": "headache", "value": "no" }], "decision": { "name": "flu", "value": "no" } }, { "conditions": [{ "attribute": "temperature", "value": "normal" }], "decision": { "name": "flu", "value": "no" } }];
const blocks2 = { "temperature": { "very_high": [2], "high": [1, 3, 4], "normal": [5, 6] }, "headache": { "yes": [1, 2, 4, 5], "no": [3, 6] }, "nausea": { "yes": [2, 4, 6], "no": [1, 3, 5] }, "cough": { "yes": [1, 4, 6], "no": [2, 3, 5] } };
const conceptFluYes2 = { "decision": "flu", "value": "yes", "cases": new Set([1, 2, 4]) };
const conceptFluNo2 = { "decision": "flu", "value": "no", "cases": new Set([3, 5, 6]) };

describe('LEM2 Module', function () {
    it('should exist', function () {
        expect(LEM2).to.not.be.undefined;
    });

    // Objects

    it('should have a dataset object', function () {
        expect(LEM2.dataset).to.be.a('array');
    });

    it('should have a blocks object', function () {
        expect(LEM2.blocks).to.be.a('object');
    });

    it('should have a concepts array', function () {
        expect(LEM2.concepts).to.be.a('array');
    });

    // Functions

    it('should have an executeProcedure function', function () {
        expect(LEM2.executeProcedure).to.be.a('function');
    });

    it('should have a newConcepts function', function () {
        expect(LEM2.newConcepts).to.be.a('function');
    });

    it('should have an newAttributeValueBlocks function', function () {
        expect(LEM2.newAttributeValueBlocks).to.be.a('function');
    });

    it('should have an getCasesCoveredByRule function', function () {
        expect(LEM2.getCasesCoveredByRule).to.be.a('function');
    });

    it('should have an getCasesCoveredByRuleset function', function () {
        expect(LEM2.getCasesCoveredByRuleset).to.be.a('function');
    });

    it('should have an reduceRuleset function', function () {
        expect(LEM2.reduceRuleset).to.be.a('function');
    });

    // Function Tests

    describe('#newConcepts()', function () {
        it('should create an array of concepts object from the data set', function () {
            // Example 1
            LEM2.dataset = dataSet1;
            LEM2.newConcepts();
            let expected = [conceptFluYes1, conceptFluNo1];
            expect(LEM2.concepts).to.be.eql(expected);

            // Example 2
            LEM2.dataset = dataSet2;
            LEM2.newConcepts();
            expected = [conceptFluYes2, conceptFluNo2];
            expect(LEM2.concepts).to.be.eql(expected);
        });

        it('should not modify the input array (data set)', function () {
            // Example 1
            LEM2.dataset = dataSet1;
            LEM2.newConcepts();
            let expected = [["temperature", "headache", "weakness", "nausea", "flu"], ["very_high", "yes", "yes", "no", "yes"], ["high", "yes", "no", "yes", "yes"], ["normal", "no", "no", "no", "no"], ["normal", "yes", "yes", "yes", "yes"], ["high", "no", "yes", "no", "yes"], ["high", "no", "no", "no", "no"], ["normal", "no", "yes", "no", "no"]];
            expect(dataSet1).to.be.eql(expected);

            // Example 2
            LEM2.dataset = dataSet2;
            LEM2.newConcepts();
            expected = [["temperature", "headache", "nausea", "cough", "flu"], ["high", "yes", "no", "yes", "yes"], ["very_high", "yes", "yes", "no", "yes"], ["high", "no", "no", "no", "no"], ["high", "yes", "yes", "yes", "yes"], ["normal", "yes", "no", "no", "no"], ["normal", "no", "yes", "yes", "no"]];
            expect(dataSet2).to.be.eql(expected);
        })
    });

    describe('#newAttributeValueBlocks()', function () {
        it('should create a blocks object (attribute-value blocks) from the data set', function () {
            LEM2.dataset = [["A1", "A2", "D"], ["N", "N", "False"], ["N", "Y", "True"], ["Y", "N", "False"], ["Y", "Y", "True"]];
            const blocks = { "A1": { "Y": [3, 4], "N": [1, 2] }, "A2": { "Y": [2, 4], "N": [1, 3] } };
            LEM2.newAttributeValueBlocks();
            expect(LEM2.blocks).to.be.eql(blocks);

            // Example 1
            LEM2.dataset = dataSet1;
            LEM2.newAttributeValueBlocks();
            expect(LEM2.blocks).to.be.eql(blocks1);

            // Example 2
            LEM2.dataset = dataSet2;
            LEM2.newAttributeValueBlocks();
            expect(LEM2.blocks).to.be.eql(blocks2);
        });

        it('should not modify the input array (data set)', function () {
            // Example 1
            LEM2.dataset = dataSet1;
            LEM2.newAttributeValueBlocks();
            let expected = [["temperature", "headache", "weakness", "nausea", "flu"], ["very_high", "yes", "yes", "no", "yes"], ["high", "yes", "no", "yes", "yes"], ["normal", "no", "no", "no", "no"], ["normal", "yes", "yes", "yes", "yes"], ["high", "no", "yes", "no", "yes"], ["high", "no", "no", "no", "no"], ["normal", "no", "yes", "no", "no"]];
            expect(dataSet1).to.be.eql(expected);

            // Example 2
            LEM2.dataset = dataSet2;
            LEM2.newAttributeValueBlocks();
            expected = [["temperature", "headache", "nausea", "cough", "flu"], ["high", "yes", "no", "yes", "yes"], ["very_high", "yes", "yes", "no", "yes"], ["high", "no", "no", "no", "no"], ["high", "yes", "yes", "yes", "yes"], ["normal", "yes", "no", "no", "no"], ["normal", "no", "yes", "yes", "no"]];
            expect(dataSet2).to.be.eql(expected);
        })
    });

    describe('#executeProcedure()', function () {
        it('should take a set (concept) and return an array of rules (single local covering of the data set)', function () {
            // Example 1
            LEM2.dataset = dataSet1;
            LEM2.newAttributeValueBlocks();
            let actual = LEM2.executeProcedure(conceptFluYes1);
            expect(actual).to.be.eql(rulesetFluYes1);

            actual = LEM2.executeProcedure(conceptFluNo1);
            expect(actual).to.be.eql(rulesetFluNo1);

            // Example 2
            LEM2.dataset = dataSet2;
            LEM2.newAttributeValueBlocks();
            actual = LEM2.executeProcedure(conceptFluYes2);
            expect(actual).to.be.eql(rulesetFluYes2);

            actual = LEM2.executeProcedure(conceptFluNo2);
            expect(actual).to.be.eql(rulesetFluNo2);
        });
    });

    describe('#getCasesCoveredByRuleset()', function () {
        it('should take an array of rules and return a set (cases covered by ruleset)', function () {
            // Example 1
            LEM2.dataset = dataSet1;
            LEM2.newAttributeValueBlocks();
            let actual = LEM2.getCasesCoveredByRuleset(rulesetFluYes1);
            expect(Array.from(actual)).to.be.eql(Array.from(conceptFluYes1.cases));

            actual = LEM2.getCasesCoveredByRuleset(rulesetFluNo1);
            expect(Array.from(actual)).to.be.eql(Array.from(conceptFluNo1.cases));

            // Example 2
            LEM2.dataset = dataSet2;
            LEM2.newAttributeValueBlocks();
            actual = LEM2.getCasesCoveredByRuleset(rulesetFluYes2);
            expect(Array.from(actual)).to.be.eql(Array.from(conceptFluYes2.cases));

            actual = LEM2.getCasesCoveredByRuleset(rulesetFluNo2);
            expect(Array.from(actual)).to.be.eql(Array.from(conceptFluNo2.cases));
        });
    });

    describe('#getCasesCoveredByRule()', function () {
        it('should take a rule object and return a set (cases covered of data set)', function () {
            // Example 1
            LEM2.dataset = dataSet1;
            LEM2.newAttributeValueBlocks();
            let coveredCases = new Set([1, 2, 4]);
            let actual = LEM2.getCasesCoveredByRule(rulesetFluYes1[0]);
            expect(Array.from(actual)).to.be.eql(Array.from(coveredCases));

            coveredCases = new Set([5]);
            actual = LEM2.getCasesCoveredByRule(rulesetFluYes1[1]);
            expect(Array.from(actual)).to.be.eql(Array.from(coveredCases));

            coveredCases = new Set([3, 7]);
            actual = LEM2.getCasesCoveredByRule(rulesetFluNo1[0]);
            expect(Array.from(actual)).to.be.eql(Array.from(coveredCases));

            coveredCases = new Set([3, 6]);
            actual = LEM2.getCasesCoveredByRule(rulesetFluNo1[1]);
            expect(Array.from(actual)).to.be.eql(Array.from(coveredCases));

            // Example 2
            LEM2.dataset = dataSet2;
            LEM2.newAttributeValueBlocks();
            coveredCases = new Set([1, 4]);
            actual = LEM2.getCasesCoveredByRule(rulesetFluYes2[0]);
            expect(Array.from(actual)).to.be.eql(Array.from(coveredCases));

            coveredCases = new Set([2]);
            actual = LEM2.getCasesCoveredByRule(rulesetFluYes2[1]);
            expect(Array.from(actual)).to.be.eql(Array.from(coveredCases));

            coveredCases = new Set([3, 6]);
            actual = LEM2.getCasesCoveredByRule(rulesetFluNo2[0]);
            expect(Array.from(actual)).to.be.eql(Array.from(coveredCases));

            coveredCases = new Set([5, 6]);
            actual = LEM2.getCasesCoveredByRule(rulesetFluNo2[1]);
            expect(Array.from(actual)).to.be.eql(Array.from(coveredCases));
        });
    });

    describe('#reduceRuleset()', function () {
        it('should take an array of rules and return a minimal array of rules', function () {
            // Example 1 (already minimal)
            LEM2.dataset = dataSet1;
            LEM2.newAttributeValueBlocks();
            let actual = LEM2.reduceRuleset(rulesetFluYes1);
            expect(actual).to.be.eql(rulesetFluYes1);

            actual = LEM2.reduceRuleset(rulesetFluNo1);
            expect(actual).to.be.eql(rulesetFluNo1);

            // Example 1 (not minimal)
            const expandedRulesetFluYes1 = [{ "conditions": [{ "attribute": "headache", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }, { "conditions": [{ "attribute": "headache", "value": "yes" }, { "attribute": "weakness", "value": "yes" }, { "attribute": "nausea", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }, { "conditions": [{ "attribute": "temperature", "value": "high" }, { "attribute": "weakness", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }];
            actual = LEM2.reduceRuleset(expandedRulesetFluYes1);
            expect(actual).to.be.eql(rulesetFluYes1);

            const expandedRulesetFluNo1 = [{ "conditions": [{ "attribute": "temperature", "value": "normal" }, { "attribute": "headache", "value": "no" }], "decision": { "name": "flu", "value": "no" } }, { "conditions": [{ "attribute": "temperature", "value": "normal" }, { "attribute": "headache", "value": "no" }], "decision": { "name": "flu", "value": "no" } }, { "conditions": [{ "attribute": "headache", "value": "no" }, { "attribute": "weakness", "value": "no" }], "decision": { "name": "flu", "value": "no" } }, { "conditions": [{ "attribute": "temperature", "value": "normal" }, { "attribute": "headache", "value": "no" }, { "attribute": "weakness", "value": "no" }], "decision": { "name": "flu", "value": "no" } }];
            actual = LEM2.reduceRuleset(expandedRulesetFluNo1);
            expect(actual).to.be.eql(rulesetFluNo1);
        });
    });
});
