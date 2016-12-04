'use strict';
require('./set.js');
const expect = require('chai').expect;
const LEM2 = require('./lem2.js');

// Data Example 1

const dataset1 = [["temperature", "headache", "weakness", "nausea", "flu"], ["very_high", "yes", "yes", "no", "yes"], ["high", "yes", "no", "yes", "yes"], ["normal", "no", "no", "no", "no"], ["normal", "yes", "yes", "yes", "yes"], ["high", "no", "yes", "no", "yes"], ["high", "no", "no", "no", "no"], ["normal", "no", "yes", "no", "no"]];
const rulesetFluYes1 = [{ "conditions": [{ "attribute": "headache", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }, { "conditions": [{ "attribute": "temperature", "value": "high" }, { "attribute": "weakness", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }];
const rulesetFluNo1 = [{ "conditions": [{ "attribute": "temperature", "value": "normal" }, { "attribute": "headache", "value": "no" }], "decision": { "name": "flu", "value": "no" } }, { "conditions": [{ "attribute": "headache", "value": "no" }, { "attribute": "weakness", "value": "no" }], "decision": { "name": "flu", "value": "no" } }];
const blocks1 = { "temperature": { "very_high": [1], "high": [2, 5, 6], "normal": [3, 4, 7] }, "headache": { "yes": [1, 2, 4], "no": [3, 5, 6, 7] }, "weakness": { "yes": [1, 4, 5, 7], "no": [2, 3, 6] }, "nausea": { "yes": [2, 4], "no": [1, 3, 5, 6, 7] } };
const conceptFluYes1 = { "decision": "flu", "value": "yes", "cases": new Set([1, 2, 4, 5]) };
const conceptFluNo1 = { "decision": "flu", "value": "no", "cases": new Set([3, 6, 7]) };

// Data Example 2

const dataset2 = [["temperature", "headache", "nausea", "cough", "flu"], ["high", "yes", "no", "yes", "yes"], ["very_high", "yes", "yes", "no", "yes"], ["high", "no", "no", "no", "no"], ["high", "yes", "yes", "yes", "yes"], ["normal", "yes", "no", "no", "no"], ["normal", "no", "yes", "yes", "no"]];
const rulesetFluYes2 = [{ "conditions": [{ "attribute": "headache", "value": "yes" }, { "attribute": "temperature", "value": "high" }], "decision": { "name": "flu", "value": "yes" } }, { "conditions": [{ "attribute": "temperature", "value": "very_high" }], "decision": { "name": "flu", "value": "yes" } }];
const rulesetFluNo2 = [{ "conditions": [{ "attribute": "headache", "value": "no" }], "decision": { "name": "flu", "value": "no" } }, { "conditions": [{ "attribute": "temperature", "value": "normal" }], "decision": { "name": "flu", "value": "no" } }];
const blocks2 = { "temperature": { "very_high": [2], "high": [1, 3, 4], "normal": [5, 6] }, "headache": { "yes": [1, 2, 4, 5], "no": [3, 6] }, "nausea": { "yes": [2, 4, 6], "no": [1, 3, 5] }, "cough": { "yes": [1, 4, 6], "no": [2, 3, 5] } };
const conceptFluYes2 = { "decision": "flu", "value": "yes", "cases": new Set([1, 2, 4]) };
const conceptFluNo2 = { "decision": "flu", "value": "no", "cases": new Set([3, 5, 6]) };

describe('LEM2 Module', function () {
    it('should exist', function () {
        expect(LEM2).to.not.be.undefined;
    });

    // Properties

    it('should have a dataset array', function () {
        expect(LEM2.dataset).to.be.a('array');
    });

    it('should have a blocks object', function () {
        expect(LEM2.blocks).to.be.a('object');
    });

    it('should have a concepts array', function () {
        expect(LEM2.concepts).to.be.a('array');
    });

    it('should have a goal set', function () {
        expect(LEM2.goal).to.be.a('set');
    });
    
    it('should have a single local covering set', function () {
        expect(LEM2.goal).to.be.a('set');
    });

    // Functions

    it('should have an executeProcedure function', function () {
        expect(LEM2.executeProcedure).to.be.a('function');
    });

    it('should have a newConcepts function', function () {
        expect(LEM2.newConcepts).to.be.a('function');
    });

    it('should have a newAttributeValueBlocks function', function () {
        expect(LEM2.newAttributeValueBlocks).to.be.a('function');
    });

    it('should have a getCasesCoveredByRule function', function () {
        expect(LEM2.getCasesCoveredByRule).to.be.a('function');
    });

    it('should have a getCasesCoveredByRuleset function', function () {
        expect(LEM2.getCasesCoveredByRuleset).to.be.a('function');
    });

    it('should have a compressRuleset function', function () {
        expect(LEM2.compressRuleset).to.be.a('function');
    });

    it('should have an initialize function', function () {
        expect(LEM2.initialize).to.be.a('function');
    })

    // Function Tests

    describe('#initialize()', function () {
        it('should take an array (dataset) and set the LEM2 dataset object', function () {
            // Example 1
            LEM2.initialize(dataset1);
            expect(LEM2.dataset).to.be.eql(dataset1);

            // Example 2
            LEM2.initialize(dataset2);
            expect(LEM2.dataset).to.be.eql(dataset2);
        });

        it('should take an array (dataset) and create the concepts', function () {
            // Example 1
            LEM2.initialize(dataset1);
            expect(LEM2.blocks).to.be.eql(blocks1);

            // Example 1
            LEM2.initialize(dataset2);
            expect(LEM2.blocks).to.be.eql(blocks2);
        });

        it('should take an array (dataset) and create the blocks', function () {
            // Example 1
            LEM2.initialize(dataset1);
            let concepts1 = [conceptFluYes1, conceptFluNo1];
            expect(LEM2.concepts).to.be.eql(concepts1);

            // Example 1
            LEM2.initialize(dataset2);
            let concepts2 = [conceptFluYes2, conceptFluNo2];
            expect(LEM2.concepts).to.be.eql(concepts2);
        });
    });

    describe('#newConcepts()', function () {
        it('should create an array of concepts object from the data set', function () {
            // Example 1
            LEM2.dataset = dataset1;
            LEM2.newConcepts();
            let expected = [conceptFluYes1, conceptFluNo1];
            expect(LEM2.concepts).to.be.eql(expected);

            // Example 2
            LEM2.dataset = dataset2;
            LEM2.newConcepts();
            expected = [conceptFluYes2, conceptFluNo2];
            expect(LEM2.concepts).to.be.eql(expected);
        });

        it('should not modify the input array (data set)', function () {
            // Example 1
            LEM2.dataset = dataset1;
            LEM2.newConcepts();
            let expected = [["temperature", "headache", "weakness", "nausea", "flu"], ["very_high", "yes", "yes", "no", "yes"], ["high", "yes", "no", "yes", "yes"], ["normal", "no", "no", "no", "no"], ["normal", "yes", "yes", "yes", "yes"], ["high", "no", "yes", "no", "yes"], ["high", "no", "no", "no", "no"], ["normal", "no", "yes", "no", "no"]];
            expect(dataset1).to.be.eql(expected);

            // Example 2
            LEM2.dataset = dataset2;
            LEM2.newConcepts();
            expected = [["temperature", "headache", "nausea", "cough", "flu"], ["high", "yes", "no", "yes", "yes"], ["very_high", "yes", "yes", "no", "yes"], ["high", "no", "no", "no", "no"], ["high", "yes", "yes", "yes", "yes"], ["normal", "yes", "no", "no", "no"], ["normal", "no", "yes", "yes", "no"]];
            expect(dataset2).to.be.eql(expected);
        })
    });

    describe('#newAttributeValueBlocks()', function () {
        it('should create a blocks object (attribute-value blocks) from the data set', function () {
            LEM2.dataset = [["A1", "A2", "D"], ["N", "N", "False"], ["N", "Y", "True"], ["Y", "N", "False"], ["Y", "Y", "True"]];
            const blocks = { "A1": { "Y": [3, 4], "N": [1, 2] }, "A2": { "Y": [2, 4], "N": [1, 3] } };
            LEM2.newAttributeValueBlocks();
            expect(LEM2.blocks).to.be.eql(blocks);

            // Example 1
            LEM2.dataset = dataset1;
            LEM2.newAttributeValueBlocks();
            expect(LEM2.blocks).to.be.eql(blocks1);

            // Example 2
            LEM2.dataset = dataset2;
            LEM2.newAttributeValueBlocks();
            expect(LEM2.blocks).to.be.eql(blocks2);
        });

        it('should not modify the input array (data set)', function () {
            // Example 1
            LEM2.dataset = dataset1;
            LEM2.newAttributeValueBlocks();
            let expected = [["temperature", "headache", "weakness", "nausea", "flu"], ["very_high", "yes", "yes", "no", "yes"], ["high", "yes", "no", "yes", "yes"], ["normal", "no", "no", "no", "no"], ["normal", "yes", "yes", "yes", "yes"], ["high", "no", "yes", "no", "yes"], ["high", "no", "no", "no", "no"], ["normal", "no", "yes", "no", "no"]];
            expect(dataset1).to.be.eql(expected);

            // Example 2
            LEM2.dataset = dataset2;
            LEM2.newAttributeValueBlocks();
            expected = [["temperature", "headache", "nausea", "cough", "flu"], ["high", "yes", "no", "yes", "yes"], ["very_high", "yes", "yes", "no", "yes"], ["high", "no", "no", "no", "no"], ["high", "yes", "yes", "yes", "yes"], ["normal", "yes", "no", "no", "no"], ["normal", "no", "yes", "yes", "no"]];
            expect(dataset2).to.be.eql(expected);
        })
    });

    describe('#executeProcedure()', function () {
        it('should take a set (concept) and set singeLocalCovering to an array of rules (single local covering of the data set)', function () {
            // Example 1
            LEM2.initialize(dataset1);
            LEM2.executeProcedure(conceptFluYes1);
            expect(Array.from(LEM2.singeLocalCovering)).to.be.eql(Array.from(rulesetFluYes1));

            LEM2.executeProcedure(conceptFluNo1);
            expect(Array.from(LEM2.singeLocalCovering)).to.be.eql(Array.from(rulesetFluNo1));

            // Example 2
            LEM2.initialize(dataset2);
            LEM2.executeProcedure(conceptFluYes2);
            expect(Array.from(LEM2.singeLocalCovering)).to.be.eql(Array.from(rulesetFluYes2));

            LEM2.executeProcedure(conceptFluNo2);
            expect(Array.from(LEM2.singeLocalCovering)).to.be.eql(Array.from(rulesetFluNo2));
        });

        it('should take a set (concept) and set the goal equal to the concept', function () {
            // Example 1
            LEM2.initialize(dataset1);
            LEM2.executeProcedure(conceptFluYes1);
            expect(LEM2.goal).to.be.eql(conceptFluYes1);

            LEM2.executeProcedure(conceptFluNo1);
            expect(LEM2.goal).to.be.eql(conceptFluNo1);

            // Example 2
            LEM2.initialize(dataset2);
            LEM2.executeProcedure(conceptFluYes2);
            expect(LEM2.goal).to.be.eql(conceptFluYes2);

            LEM2.executeProcedure(conceptFluNo2);
            expect(LEM2.goal).to.be.eql(conceptFluNo2);
        });
    });

    describe('#getCasesCoveredByRuleset()', function () {
        it('should take an array of rules and return a set (cases covered by ruleset)', function () {
            // Example 1
            LEM2.initialize(dataset1);
            let actual = LEM2.getCasesCoveredByRuleset(rulesetFluYes1);
            expect(Array.from(actual)).to.be.eql(Array.from(conceptFluYes1.cases));

            actual = LEM2.getCasesCoveredByRuleset(rulesetFluNo1);
            expect(Array.from(actual)).to.be.eql(Array.from(conceptFluNo1.cases));

            // Example 2
            LEM2.initialize(dataset2);
            actual = LEM2.getCasesCoveredByRuleset(rulesetFluYes2);
            expect(Array.from(actual)).to.be.eql(Array.from(conceptFluYes2.cases));

            actual = LEM2.getCasesCoveredByRuleset(rulesetFluNo2);
            expect(Array.from(actual)).to.be.eql(Array.from(conceptFluNo2.cases));
        });
    });

    describe('#getCasesCoveredByRule()', function () {
        it('should take a rule object and return a set (cases covered of data set)', function () {
            // Example 1
            LEM2.initialize(dataset1);
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
            LEM2.initialize(dataset2);
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

    describe('#compressRuleset()', function () {
        it('should take an array of rules and return a minimal array of rules', function () {
            // Example 1 (already minimal)
            LEM2.initialize(dataset1);
            let actual = LEM2.compressRuleset(rulesetFluYes1);
            expect(actual).to.be.eql(rulesetFluYes1);

            actual = LEM2.compressRuleset(rulesetFluNo1);
            expect(actual).to.be.eql(rulesetFluNo1);

            // Example 1 (not minimal)
            const expandedRulesetFluYes1 = [{ "conditions": [{ "attribute": "headache", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }, { "conditions": [{ "attribute": "headache", "value": "yes" }, { "attribute": "weakness", "value": "yes" }, { "attribute": "nausea", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }, { "conditions": [{ "attribute": "temperature", "value": "high" }, { "attribute": "weakness", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }];
            actual = LEM2.compressRuleset(expandedRulesetFluYes1);
            expect(actual).to.be.eql(rulesetFluYes1);

            const expandedRulesetFluNo1 = [{ "conditions": [{ "attribute": "temperature", "value": "normal" }, { "attribute": "headache", "value": "no" }], "decision": { "name": "flu", "value": "no" } }, { "conditions": [{ "attribute": "temperature", "value": "normal" }, { "attribute": "headache", "value": "no" }], "decision": { "name": "flu", "value": "no" } }, { "conditions": [{ "attribute": "headache", "value": "no" }, { "attribute": "weakness", "value": "no" }], "decision": { "name": "flu", "value": "no" } }, { "conditions": [{ "attribute": "temperature", "value": "normal" }, { "attribute": "headache", "value": "no" }, { "attribute": "weakness", "value": "no" }], "decision": { "name": "flu", "value": "no" } }];
            actual = LEM2.compressRuleset(expandedRulesetFluNo1);
            expect(actual).to.be.eql(rulesetFluNo1);
        });
    });
});
