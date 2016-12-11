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

describe('LEM2 Module Functions', function() {

    describe('#initialize()', function() {
        it('should take an array (dataset) and set the LEM2 dataset object', function() {
            // Example 1
            LEM2.initialize(dataset1);
            expect(LEM2.dataset).to.be.eql(dataset1);

            // Example 2
            LEM2.initialize(dataset2);
            expect(LEM2.dataset).to.be.eql(dataset2);
        });

        it('should take an array (dataset) and create the dataset concepts', function() {
            // Example 1
            LEM2.initialize(dataset1);
            expect(LEM2.blocks).to.be.eql(blocks1);

            // Example 1
            LEM2.initialize(dataset2);
            expect(LEM2.blocks).to.be.eql(blocks2);
        });

        it('should take an array (dataset) and create the blocks', function() {
            // Example 1
            LEM2.initialize(dataset1);
            let datasetConcepts1 = [conceptFluYes1, conceptFluNo1];
            expect(LEM2.datasetConcepts).to.be.eql(datasetConcepts1);

            // Example 1
            LEM2.initialize(dataset2);
            let datasetConcepts2 = [conceptFluYes2, conceptFluNo2];
            expect(LEM2.datasetConcepts).to.be.eql(datasetConcepts2);
        });
    });

    describe('#initializeProcedure()', function() {
        it('should take a set (concept) and set the goal equal to the concept', function() {
            // Example 1
            LEM2.initialize(dataset1);
            LEM2.initializeProcedure(conceptFluYes1);
            expect(LEM2.goal).to.be.eql(conceptFluYes1);

            LEM2.initializeProcedure(conceptFluNo1);
            expect(LEM2.goal).to.be.eql(conceptFluNo1);

            // Example 2
            LEM2.initialize(dataset2);
            LEM2.initializeProcedure(conceptFluYes2);
            expect(LEM2.goal).to.be.eql(conceptFluYes2);

            LEM2.initializeProcedure(conceptFluNo2);
            expect(LEM2.goal).to.be.eql(conceptFluNo2);
        });

        it('should take a set (concept) and set the module concept equal to the set', function() {
            // Example 1
            LEM2.initialize(dataset1);
            LEM2.initializeProcedure(conceptFluYes1);
            expect(LEM2.concept).to.be.eql(conceptFluYes1.cases);

            LEM2.initializeProcedure(conceptFluNo1);
            expect(LEM2.concept).to.be.eql(conceptFluNo1.cases);

            // Example 2
            LEM2.initialize(dataset2);
            LEM2.initializeProcedure(conceptFluYes2);
            expect(LEM2.concept).to.be.eql(conceptFluYes2.cases);

            LEM2.initializeProcedure(conceptFluNo2);
            expect(LEM2.concept).to.be.eql(conceptFluNo2.cases);
        });

        it('should set the singleLocalCovering to the empty set', function() {
            LEM2.goal = new Set([1,2,3]);
            LEM2.initializeProcedure(conceptFluYes1);
            const emptySet = new Set();
            expect(LEM2.singleLocalCovering).to.be.eql(emptySet);
        });
    });

    describe('#newRuleset()', function() {
        it('should create an array of rules (ruleset) from the data set', function() {
            // Example 1
            LEM2.initialize(dataset1);
            LEM2.initializeProcedure(conceptFluYes1);
            LEM2.newRuleset();
            expect(LEM2.singleLocalCovering).to.be.eql(rulesetFluYes1);

            LEM2.initializeProcedure(conceptFluNo1);
            LEM2.newRuleset();
            expect(LEM2.singleLocalCovering).to.be.eql(rulesetFluNo1);

            // Example 2
            LEM2.initialize(dataset2);
            LEM2.initializeProcedure(conceptFluYes2);
            LEM2.newRuleset();
            expect(LEM2.singleLocalCovering).to.be.eql(rulesetFluYes2);

            LEM2.initializeProcedure(conceptFluNo2);
            LEM2.newRuleset();
            expect(LEM2.singleLocalCovering).to.be.eql(rulesetFluNo2);
        });

        it('should finish when the goal is the empty set', function() {
            // Example 1
            LEM2.initialize(dataset1);
            LEM2.initializeProcedure(conceptFluYes1);
            LEM2.newRuleset();
            const emptySet = new Set();
            expect(LEM2.goal).to.be.eql(emptySet);
        });
    });

    describe('#newConcepts()', function() {
        it('should create an array of concepts object from the data set', function() {
            // Example 1
            LEM2.dataset = dataset1;
            LEM2.newConcepts();
            let expected = [conceptFluYes1, conceptFluNo1];
            expect(LEM2.datasetConcepts).to.be.eql(expected);

            // Example 2
            LEM2.dataset = dataset2;
            LEM2.newConcepts();
            expected = [conceptFluYes2, conceptFluNo2];
            expect(LEM2.datasetConcepts).to.be.eql(expected);
        });

        it('should not modify the input array (data set)', function() {
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

    describe('#newAttributeValueBlocks()', function() {
        it('should create a blocks object (attribute-value blocks) from the data set', function() {
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

        it('should not modify the input array (data set)', function() {
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

    describe('#invokeProcedure()', function() {
        it('should take a set (concept) and set singleLocalCovering to an array of rules (single local covering of the data set)', function() {
            // Example 1
            LEM2.initialize(dataset1);
            LEM2.invokeProcedure(conceptFluYes1);
            expect(Array.from(LEM2.singleLocalCovering)).to.be.eql(Array.from(rulesetFluYes1));

            LEM2.invokeProcedure(conceptFluNo1);
            expect(Array.from(LEM2.singleLocalCovering)).to.be.eql(Array.from(rulesetFluNo1));

            // Example 2
            LEM2.initialize(dataset2);
            LEM2.invokeProcedure(conceptFluYes2);
            expect(Array.from(LEM2.singleLocalCovering)).to.be.eql(Array.from(rulesetFluYes2));

            LEM2.invokeProcedure(conceptFluNo2);
            expect(Array.from(LEM2.singleLocalCovering)).to.be.eql(Array.from(rulesetFluNo2));
        });        
    });

    describe('#getCasesCoveredByRuleset()', function() {
        it('should take an array of rules and return a set (cases covered by ruleset)', function() {
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

    describe('#getCasesCoveredByRule()', function() {
        it('should take a rule object and return a set (cases covered of data set)', function() {
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

    describe('#compressRule()', function() {
        it('should take a rule and return a minimal rule', function() {
            // Example 1 (already minimal)
            LEM2.initialize(dataset1);
            LEM2.concept = conceptFluYes1.cases;
            let rule1 = { "conditions": [{ "attribute": "headache", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } };
            let actual = LEM2.compressRule(rule1);
            expect(actual).to.be.eql(rule1);

            let rule2 = { "conditions": [{ "attribute": "temperature", "value": "high" }, { "attribute": "weakness", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } };
            actual = LEM2.compressRule(rule2);
            expect(actual).to.be.eql(rule2);

            // Example 1 (not minimal)
            let expandedRule1 = { "conditions": [{ "attribute": "temperature", "value": "normal" }, { "attribute": "headache", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } };
            actual = LEM2.compressRule(expandedRule1);
            expect(actual).to.be.eql(rule1);

            let expandedRule2 = { "conditions": [{ "attribute": "temperature", "value": "high" }, { "attribute": "headache", "value": "no" }, { "attribute": "weakness", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } };
            actual = LEM2.compressRule(rule2);
            expect(actual).to.be.eql(rule2);
        });
    });

    describe('#compressRuleset()', function() {
        it('should remove unnecessary rules from the ruleset', function() {
            // Example 1 (already minimal)
            LEM2.initialize(dataset1);
            LEM2.concept = conceptFluYes1.cases;
            LEM2.singleLocalCovering = rulesetFluYes1;
            LEM2.compressRuleset();
            expect(LEM2.singleLocalCovering).to.be.eql(rulesetFluYes1);

            LEM2.concept = conceptFluNo1.cases;
            LEM2.singleLocalCovering = rulesetFluNo1;
            LEM2.compressRuleset();
            expect(LEM2.singleLocalCovering).to.be.eql(rulesetFluNo1);

            // Example 1 (single rule)
            LEM2.concept = conceptFluYes1.cases;
            LEM2.singleLocalCovering = [{ "conditions": [{ "attribute": "headache", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }];
            let ruleset = [{ "conditions": [{ "attribute": "headache", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }];
            LEM2.compressRuleset();
            expect(LEM2.singleLocalCovering).to.be.eql(ruleset);

            // Example 1 (not minimal)
            LEM2.concept = conceptFluYes1.cases;
            LEM2.singleLocalCovering = [{ "conditions": [{ "attribute": "headache", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }, { "conditions": [{ "attribute": "headache", "value": "yes" }, { "attribute": "weakness", "value": "yes" }, { "attribute": "nausea", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }, { "conditions": [{ "attribute": "temperature", "value": "high" }, { "attribute": "weakness", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }];
            LEM2.compressRuleset();
            expect(LEM2.singleLocalCovering).to.be.eql(rulesetFluYes1);

            LEM2.concept = conceptFluNo1.cases;
            LEM2.singleLocalCovering = [{ "conditions": [{ "attribute": "temperature", "value": "normal" }, { "attribute": "headache", "value": "no" }], "decision": { "name": "flu", "value": "no" } }, { "conditions": [{ "attribute": "temperature", "value": "normal" }, { "attribute": "headache", "value": "no" }], "decision": { "name": "flu", "value": "no" } }, { "conditions": [{ "attribute": "headache", "value": "no" }, { "attribute": "weakness", "value": "no" }], "decision": { "name": "flu", "value": "no" } }, { "conditions": [{ "attribute": "temperature", "value": "normal" }, { "attribute": "headache", "value": "no" }, { "attribute": "weakness", "value": "no" }], "decision": { "name": "flu", "value": "no" } }];
            LEM2.compressRuleset();
            expect(LEM2.singleLocalCovering).to.be.eql(rulesetFluNo1);
        });
    });

    describe('#newGoalBlockIntersections()', function () {
        it('should create an array of objects (intersections), each with an attribute string, a value string, and a non-empty set (cases)', function () {
            const emptySet = new Set();

            LEM2.initialize(dataset1);
            LEM2.initializeProcedure(conceptFluYes1);
            const intersections = LEM2.newGoalBlockIntersections();

            expect(intersections.length).to.be.not.eql(0);
            intersections.forEach(function (intersection) {
                expect(intersection.attribute).to.be.a('string');
                expect(intersection.value).to.be.a('string');
                expect(intersection.cases).to.be.a('set');
                expect(intersection.cases).to.be.not.eql(emptySet);
            });
        });

        it('should create an array of intersections between the each attribute value block and the goal', function () {
            // Example 1
            LEM2.initialize(dataset1);
            LEM2.initializeProcedure(conceptFluYes1);
            let intersections = LEM2.newGoalBlockIntersections();

            const intersectionsFluYes1 = [{ "attribute": "temperature", "value": "very_high", "cases": new Set([1]) }, { "attribute": "temperature", "value": "high", "cases": new Set([2, 5]) }, { "attribute": "temperature", "value": "normal", "cases": new Set([4]) }, { "attribute": "headache", "value": "yes", "cases": new Set([1, 2, 4]) }, { "attribute": "headache", "value": "no", "cases": new Set([5]) }, { "attribute": "weakness", "value": "yes", "cases": new Set([1, 4, 5]) }, { "attribute": "weakness", "value": "no", "cases": new Set([2]) }, { "attribute": "nausea", "value": "no", "cases": new Set([1, 5]) }, { "attribute": "nausea", "value": "yes", "cases": new Set([2, 4]) }];
            expect(intersections).to.be.eql(intersectionsFluYes1);

            LEM2.initializeProcedure(conceptFluNo1);
            intersections = LEM2.newGoalBlockIntersections();

            const intersectionsFluNo1 = [{ "attribute": "temperature", "value": "high", "cases": new Set([6]) }, { "attribute": "temperature", "value": "normal", "cases": new Set([3, 7]) }, { "attribute": "headache", "value": "no", "cases": new Set([3, 6, 7]) }, { "attribute": "weakness", "value": "yes", "cases": new Set([7]) }, { "attribute": "weakness", "value": "no", "cases": new Set([3, 6]) }, { "attribute": "nausea", "value": "no", "cases": new Set([3, 6, 7]) }];
            expect(intersections).to.be.eql(intersectionsFluNo1);
        });
    });

    describe('#selectBestBlock()', function() {
        it('should take an array (intersections) and return an object (intersection) according to LEM2 selection criteria', function exampleOneFluYes(){
            const intersectionsFluYes1 = [{ "attribute": "temperature", "value": "very_high", "cases": new Set([1]) }, { "attribute": "temperature", "value": "high", "cases": new Set([2, 5]) }, { "attribute": "temperature", "value": "normal", "cases": new Set([4]) }, { "attribute": "headache", "value": "yes", "cases": new Set([1, 2, 4]) }, { "attribute": "headache", "value": "no", "cases": new Set([5]) }, { "attribute": "weakness", "value": "yes", "cases": new Set([1, 4, 5]) }, { "attribute": "weakness", "value": "no", "cases": new Set([2]) }, { "attribute": "nausea", "value": "no", "cases": new Set([1, 5]) }, { "attribute": "nausea", "value": "yes", "cases": new Set([2, 4]) }];
            const bestIntersectionFluYes1 = { "attribute": "headache", "value": "yes", "cases": new Set([1, 2, 4]) };
            const actual = LEM2.selectBestBlock(intersectionsFluYes1);
            expect(actual).to.be.eql(bestIntersectionFluYes1);
        });

        it('should take an array (intersections) and return an object (intersection) according to LEM2 selection criteria', function exampleOneFluNo(){
            const intersectionsFluNo1 = [{ "attribute": "temperature", "value": "high", "cases": new Set([6]) }, { "attribute": "temperature", "value": "normal", "cases": new Set([3, 7]) }, { "attribute": "headache", "value": "no", "cases": new Set([3, 6, 7]) }, { "attribute": "weakness", "value": "yes", "cases": new Set([7]) }, { "attribute": "weakness", "value": "no", "cases": new Set([3, 6]) }, { "attribute": "nausea", "value": "no", "cases": new Set([3, 6, 7]) }];
            const bestIntersectionFluNo1 = { "attribute": "headache", "value": "no", "cases": new Set([3, 6, 7]) };
            const actual = LEM2.selectBestBlock(intersectionsFluNo1);
            expect(actual).to.be.eql(bestIntersectionFluNo1);
        });
    });
});
