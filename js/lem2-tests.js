"use strict";

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

describe("LEM2 Module", function () {

    describe("#initialize()", function () {

        const tests = [
            { "dataset": dataset1, "blocks": blocks1, "concepts": [conceptFluYes1, conceptFluNo1] },
            { "dataset": dataset2, "blocks": blocks2, "concepts": [conceptFluYes2, conceptFluNo2] }
        ];

        tests.forEach(function (test, testIndex) {
            const example = " - Example #" + (testIndex + 1);

            it("should take a dataset and set the LEM2 dataset" + example, function () {
                LEM2.initialize(test.dataset);
                expect(LEM2.dataset).to.be.deep.equal(test.dataset);
            });

            it("should take a dataset and create the dataset blocks" + example, function () {
                expect(LEM2.blocks).to.be.deep.equal(test.blocks);
            });

            it("should take a dataset and create the dataset concepts" + example, function () {
                expect(LEM2.datasetConcepts).to.be.deep.equal(test.concepts);
            });
        });
    });

    describe('#initializeProcedure()', function () {

        const tests = [
            { "concept": conceptFluYes1, "example": 1 },
            { "concept": conceptFluNo1, "example": 1 },
            { "concept": conceptFluYes2, "example": 2 },
            { "concept": conceptFluNo2, "example": 2 }
        ];

        tests.forEach(function (test) {

            const example = " - Example #" + test.example + " (" + test.concept.decision + "," + test.concept.value + ")";

            // Goal

            it("should take a concept and set the goal equal to the input concept" + example, function () {
                LEM2.initializeProcedure(test.concept);

                expect(LEM2.goal).to.be.deep.equal(test.concept.cases);
            });

            // Concept

            it("should take a concept and set the module concept equal to the input set" + example, function () {
                expect(LEM2.concept).to.be.deep.equal(test.concept.cases);
            });

            // Single Local Covering

            it("should set singleLocalCovering to an empty array" + example, function () {
                const emptyArray = [];
                expect(LEM2.singleLocalCovering).to.be.deep.equal(emptyArray);
            });
        });
    });

    describe("#newRuleset()", function () {

        const tests = [
            { "dataset": dataset1, "concept": conceptFluYes1, "ruleset": rulesetFluYes1, "example": 1 },
            { "dataset": dataset1, "concept": conceptFluNo1, "ruleset": rulesetFluNo1, "example": 1 },
            { "dataset": dataset2, "concept": conceptFluYes2, "ruleset": rulesetFluYes2, "example": 2 },
            { "dataset": dataset2, "concept": conceptFluNo2, "ruleset": rulesetFluNo2, "example": 2 }
        ];

        tests.forEach(function (test) {

            const example = " - Example #" + test.example + " (" + test.concept.decision + "," + test.concept.value + ")";

            it("should create an array of rules from the dataset" + example, function () {
                LEM2.initialize(test.dataset);
                LEM2.initializeProcedure(test.concept);
                LEM2.newRuleset();

                expect(LEM2.singleLocalCovering).to.be.deep.equal(test.ruleset);
            });

            // Empty Set Goal

            it("should finish when the goal is the empty set" + example, function () {
                const emptySet = new Set();
                expect(LEM2.goal).to.be.deep.equal(emptySet);
            });
        });
    });

    describe("#newConcepts()", function () {

        const tests = [
            { "dataset": dataset1, "concepts": [conceptFluYes1, conceptFluNo1] },
            { "dataset": dataset2, "concepts": [conceptFluYes2, conceptFluNo2] }
        ];

        tests.forEach(function (test, testIndex) {
            // TODO: Create clone function and use across tests and application instead of slice
            const originalDataset = JSON.parse(JSON.stringify(test.dataset));
            const example = " - Example #" + (testIndex + 1)

            it("should create an array of concept objects from the dataset" + example, function () {
                LEM2.dataset = test.dataset;
                LEM2.newConcepts();

                expect(LEM2.datasetConcepts).to.be.deep.equal(test.concepts);
            });

            it("should not modify the input dataset" + example, function () {
                expect(test.dataset).to.be.deep.equal(originalDataset);
            });
        });
    });

    describe("#newAttributeValueBlocks()", function () {
        const adHocDataset = [["A1", "A2", "D"], ["N", "N", "False"], ["N", "Y", "True"], ["Y", "N", "False"], ["Y", "Y", "True"]];
        const adHocBlocks = { "A1": { "Y": [3, 4], "N": [1, 2] }, "A2": { "Y": [2, 4], "N": [1, 3] } };

        const tests = [
            { "dataset": adHocDataset, "blocks": adHocBlocks },
            { "dataset": dataset1, "blocks": blocks1 },
            { "dataset": dataset2, "blocks": blocks2 }
        ];

        tests.forEach(function (test, testIndex) {
            const example = " - Example #" + testIndex;
            const originalDataset = JSON.parse(JSON.stringify(test.dataset));

            // Create Blocks

            it("should create attribute-value blocks from the dataset" + example, function () {
                LEM2.dataset = test.dataset;
                LEM2.newAttributeValueBlocks();

                expect(LEM2.blocks).to.be.deep.equal(test.blocks);
            });

            // Does Not Modify Dataset

            it("should not modify the input dataset" + example, function () {
                expect(LEM2.dataset).to.be.deep.equal(originalDataset);
            });
        });
    });

    describe('#invokeProcedure()', function () {

        // Single Local Covering

        const singleLocalCovering = 'should take a concept and set singleLocalCovering to an array of rules';

        it(singleLocalCovering, function exampleOneFluYes() {
            LEM2.initialize(dataset1);
            LEM2.invokeProcedure(conceptFluYes1);
            expect(Array.from(LEM2.singleLocalCovering)).to.be.eql(Array.from(rulesetFluYes1));
        });

        it(singleLocalCovering, function exampleOneFluNo() {
            LEM2.initialize(dataset1);
            LEM2.invokeProcedure(conceptFluNo1);
            expect(Array.from(LEM2.singleLocalCovering)).to.be.eql(Array.from(rulesetFluNo1));
        });

        it(singleLocalCovering, function exampleTwoFluYes() {
            LEM2.initialize(dataset2);
            LEM2.invokeProcedure(conceptFluYes2);
            expect(Array.from(LEM2.singleLocalCovering)).to.be.eql(Array.from(rulesetFluYes2));
        });

        it(singleLocalCovering, function exampleTwoFluNo() {
            LEM2.initialize(dataset2);
            LEM2.invokeProcedure(conceptFluNo2);
            expect(Array.from(LEM2.singleLocalCovering)).to.be.eql(Array.from(rulesetFluNo2));
        });
    });

    describe('#getCasesCoveredByRuleset()', function () {

        // Covered Cases

        const coveredCases = 'should take an array of rules and return the set of cases covered by ruleset';

        it(coveredCases, function exmpleOneFluYes() {
            LEM2.initialize(dataset1);
            const actual = LEM2.getCasesCoveredByRuleset(rulesetFluYes1);
            expect(Array.from(actual)).to.be.eql(Array.from(conceptFluYes1.cases));
        });

        it(coveredCases, function exmpleOneFluNo() {
            LEM2.initialize(dataset1);
            const actual = LEM2.getCasesCoveredByRuleset(rulesetFluNo1);
            expect(Array.from(actual)).to.be.eql(Array.from(conceptFluNo1.cases));
        });

        it(coveredCases, function exmpleTwoFluYes() {
            LEM2.initialize(dataset2);
            const actual = LEM2.getCasesCoveredByRuleset(rulesetFluYes2);
            expect(Array.from(actual)).to.be.eql(Array.from(conceptFluYes2.cases));
        });

        it(coveredCases, function exmpleTwoFluNo() {
            LEM2.initialize(dataset2);
            const actual = LEM2.getCasesCoveredByRuleset(rulesetFluNo2);
            expect(Array.from(actual)).to.be.eql(Array.from(conceptFluNo2.cases));
        });
    });

    describe('#getCasesCoveredByRule()', function () {

        // Covered Cases

        const coveredCases = 'should take a rule and return a set of cases covered';

        it(coveredCases, function exampleOneFluYesRule1() {
            LEM2.initialize(dataset1);
            const coveredCases = new Set([1, 2, 4]);
            const actual = LEM2.getCasesCoveredByRule(rulesetFluYes1[0]);
            expect(Array.from(actual)).to.be.eql(Array.from(coveredCases));
        });

        it(coveredCases, function exampleOneFluYesRule2() {
            LEM2.initialize(dataset1);
            const coveredCases = new Set([5]);
            const actual = LEM2.getCasesCoveredByRule(rulesetFluYes1[1]);
            expect(Array.from(actual)).to.be.eql(Array.from(coveredCases));
        });

        it(coveredCases, function exampleOneFluNoRule1() {
            LEM2.initialize(dataset1);
            const coveredCases = new Set([3, 7]);
            const actual = LEM2.getCasesCoveredByRule(rulesetFluNo1[0]);
            expect(Array.from(actual)).to.be.eql(Array.from(coveredCases));
        });

        it(coveredCases, function exampleOneFluNoRule2() {
            LEM2.initialize(dataset1);
            const coveredCases = new Set([3, 6]);
            const actual = LEM2.getCasesCoveredByRule(rulesetFluNo1[1]);
            expect(Array.from(actual)).to.be.eql(Array.from(coveredCases));
        });

        it(coveredCases, function exampleTwoFluYesRule1() {
            LEM2.initialize(dataset2);
            const coveredCases = new Set([1, 4]);
            const actual = LEM2.getCasesCoveredByRule(rulesetFluYes2[0]);
            expect(Array.from(actual)).to.be.eql(Array.from(coveredCases));
        });

        it(coveredCases, function exampleTwoFluYesRule2() {
            LEM2.initialize(dataset2);
            const coveredCases = new Set([2]);
            const actual = LEM2.getCasesCoveredByRule(rulesetFluYes2[1]);
            expect(Array.from(actual)).to.be.eql(Array.from(coveredCases));
        });

        it(coveredCases, function exampleTwoFluNoRule1() {
            LEM2.initialize(dataset2);
            const coveredCases = new Set([3, 6]);
            const actual = LEM2.getCasesCoveredByRule(rulesetFluNo2[0]);
            expect(Array.from(actual)).to.be.eql(Array.from(coveredCases));
        });

        it(coveredCases, function exampleTwoFluNoRule2() {
            LEM2.initialize(dataset2);
            const coveredCases = new Set([5, 6]);
            const actual = LEM2.getCasesCoveredByRule(rulesetFluNo2[1]);
            expect(Array.from(actual)).to.be.eql(Array.from(coveredCases));
        });
    });

    describe('#compressRule()', function () {

        // Minimal Rule

        const minimalRule = 'should take a rule and return a minimal rule';
        const rule1 = { "conditions": [{ "attribute": "headache", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } };
        const rule2 = { "conditions": [{ "attribute": "temperature", "value": "high" }, { "attribute": "weakness", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } };

        it(minimalRule, function minimalRule1() {
            LEM2.initialize(dataset1);
            LEM2.concept = conceptFluYes1.cases;
            const actual = LEM2.compressRule(rule1);
            expect(actual).to.be.eql(rule1);
        });

        it(minimalRule, function minimalRule2() {
            LEM2.initialize(dataset1);
            LEM2.concept = conceptFluYes1.cases;
            const actual = LEM2.compressRule(rule2);
            expect(actual).to.be.eql(rule2);
        });

        // Non-Minimal Rule

        it(minimalRule, function expandedRule1() {
            const expandedRule1 = { "conditions": [{ "attribute": "temperature", "value": "normal" }, { "attribute": "headache", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } };
            const actual = LEM2.compressRule(expandedRule1);
            expect(actual).to.be.eql(rule1);
        });

        it(minimalRule, function expandedRule2() {
            const expandedRule2 = { "conditions": [{ "attribute": "temperature", "value": "high" }, { "attribute": "headache", "value": "no" }, { "attribute": "weakness", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } };
            const actual = LEM2.compressRule(expandedRule2);
            expect(actual).to.be.eql(rule2);
        });
    });

    describe('#compressRuleset()', function () {

        const compressRuleset = 'should remove unnecessary rules from the ruleset';

        // Minimal Ruleset

        it(compressRuleset, function minimalRulesetFluYes() {
            LEM2.initialize(dataset1);
            LEM2.concept = conceptFluYes1.cases;
            LEM2.singleLocalCovering = rulesetFluYes1;
            LEM2.compressRuleset();
            expect(LEM2.singleLocalCovering).to.be.eql(rulesetFluYes1);
        });

        it(compressRuleset, function minimalRulesetFluNo() {
            LEM2.initialize(dataset1);
            LEM2.concept = conceptFluNo1.cases;
            LEM2.singleLocalCovering = rulesetFluNo1;
            LEM2.compressRuleset();
            expect(LEM2.singleLocalCovering).to.be.eql(rulesetFluNo1);
        });

        // Single Rule

        it(compressRuleset, function singleRule() {
            LEM2.concept = conceptFluYes1.cases;
            LEM2.singleLocalCovering = [{ "conditions": [{ "attribute": "headache", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }];
            let ruleset = [{ "conditions": [{ "attribute": "headache", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }];
            LEM2.compressRuleset();
            expect(LEM2.singleLocalCovering).to.be.eql(ruleset);
        });

        // Non-Minimal Ruleset

        it(compressRuleset, function expandedRulesetFluYes() {
            LEM2.concept = conceptFluYes1.cases;
            LEM2.singleLocalCovering = [{ "conditions": [{ "attribute": "headache", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }, { "conditions": [{ "attribute": "headache", "value": "yes" }, { "attribute": "weakness", "value": "yes" }, { "attribute": "nausea", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }, { "conditions": [{ "attribute": "temperature", "value": "high" }, { "attribute": "weakness", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }];
            LEM2.compressRuleset();
            expect(LEM2.singleLocalCovering).to.be.eql(rulesetFluYes1);
        });

        it(compressRuleset, function expandedRulesetFluNo() {
            LEM2.concept = conceptFluNo1.cases;
            LEM2.singleLocalCovering = [{ "conditions": [{ "attribute": "temperature", "value": "normal" }, { "attribute": "headache", "value": "no" }], "decision": { "name": "flu", "value": "no" } }, { "conditions": [{ "attribute": "temperature", "value": "normal" }, { "attribute": "headache", "value": "no" }], "decision": { "name": "flu", "value": "no" } }, { "conditions": [{ "attribute": "headache", "value": "no" }, { "attribute": "weakness", "value": "no" }], "decision": { "name": "flu", "value": "no" } }, { "conditions": [{ "attribute": "temperature", "value": "normal" }, { "attribute": "headache", "value": "no" }, { "attribute": "weakness", "value": "no" }], "decision": { "name": "flu", "value": "no" } }];
            LEM2.compressRuleset();
            expect(LEM2.singleLocalCovering).to.be.eql(rulesetFluNo1);
        });
    });

    describe('#newGoalBlockIntersections()', function () {

        // Intersection Structure

        it('should create an array of intersections, each with an attribute string, a value string, and a non-empty set', function intersectionStructure() {
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

        // Create Intersections

        const createIntersections = 'should create an array of intersections between each attribute value block and the goal';

        it(createIntersections, function exampleOneFluYes() {
            LEM2.initialize(dataset1);
            LEM2.initializeProcedure(conceptFluYes1);

            const actual = LEM2.newGoalBlockIntersections();
            const intersections = [{ "attribute": "temperature", "value": "very_high", "cases": new Set([1]) }, { "attribute": "temperature", "value": "high", "cases": new Set([2, 5]) }, { "attribute": "temperature", "value": "normal", "cases": new Set([4]) }, { "attribute": "headache", "value": "yes", "cases": new Set([1, 2, 4]) }, { "attribute": "headache", "value": "no", "cases": new Set([5]) }, { "attribute": "weakness", "value": "yes", "cases": new Set([1, 4, 5]) }, { "attribute": "weakness", "value": "no", "cases": new Set([2]) }, { "attribute": "nausea", "value": "no", "cases": new Set([1, 5]) }, { "attribute": "nausea", "value": "yes", "cases": new Set([2, 4]) }];

            expect(actual).to.be.eql(intersections);
        });

        it(createIntersections, function exampleOneFluNo() {
            LEM2.initialize(dataset1);
            LEM2.initializeProcedure(conceptFluNo1);

            const actual = LEM2.newGoalBlockIntersections();
            const intersections = [{ "attribute": "temperature", "value": "high", "cases": new Set([6]) }, { "attribute": "temperature", "value": "normal", "cases": new Set([3, 7]) }, { "attribute": "headache", "value": "no", "cases": new Set([3, 6, 7]) }, { "attribute": "weakness", "value": "yes", "cases": new Set([7]) }, { "attribute": "weakness", "value": "no", "cases": new Set([3, 6]) }, { "attribute": "nausea", "value": "no", "cases": new Set([3, 6, 7]) }];

            expect(actual).to.be.eql(intersections);
        });

        it(createIntersections, function exampleTwoFluYes() {
            LEM2.initialize(dataset2);
            LEM2.initializeProcedure(conceptFluYes2);

            const actual = LEM2.newGoalBlockIntersections();
            const intersections = [{ "attribute": "temperature", "value": "high", "cases": new Set([1, 4]) }, { "attribute": "temperature", "value": "very_high", "cases": new Set([2]) }, { "attribute": "headache", "value": "yes", "cases": new Set([1, 2, 4]) }, { "attribute": "nausea", "value": "no", "cases": new Set([1]) }, { "attribute": "nausea", "value": "yes", "cases": new Set([2, 4]) }, { "attribute": "cough", "value": "yes", "cases": new Set([1, 4]) }, { "attribute": "cough", "value": "no", "cases": new Set([2]) }];

            expect(actual).to.be.eql(intersections);
        });
    });

    describe('#selectBestBlock()', function () {

        // Intersection Maximimum

        const intersectionMaximum = 'should take an array of intersections and return the largest intersection';

        it(intersectionMaximum, function exampleOneFluYes() {
            LEM2.initialize(dataset1);
            const intersectionsFluYes1 = [{ "attribute": "temperature", "value": "very_high", "cases": new Set([1]) }, { "attribute": "temperature", "value": "high", "cases": new Set([2, 5]) }, { "attribute": "temperature", "value": "normal", "cases": new Set([4]) }, { "attribute": "headache", "value": "yes", "cases": new Set([1, 2, 4]) }, { "attribute": "headache", "value": "no", "cases": new Set([5]) }, { "attribute": "weakness", "value": "yes", "cases": new Set([1, 4, 5]) }, { "attribute": "weakness", "value": "no", "cases": new Set([2]) }, { "attribute": "nausea", "value": "no", "cases": new Set([1, 5]) }, { "attribute": "nausea", "value": "yes", "cases": new Set([2, 4]) }];

            const bestIntersection = { "attribute": "headache", "value": "yes", "cases": new Set([1, 2, 4]) };
            const actual = LEM2.selectBestBlock(intersectionsFluYes1);

            expect(actual).to.be.eql(bestIntersection);
        });

        it(intersectionMaximum, function exampleOneFluNo() {
            LEM2.initialize(dataset1);
            const intersectionsFluNo1 = [{ "attribute": "temperature", "value": "high", "cases": new Set([6]) }, { "attribute": "temperature", "value": "normal", "cases": new Set([3, 7]) }, { "attribute": "headache", "value": "no", "cases": new Set([3, 6, 7]) }, { "attribute": "weakness", "value": "yes", "cases": new Set([7]) }, { "attribute": "weakness", "value": "no", "cases": new Set([3, 6]) }, { "attribute": "nausea", "value": "no", "cases": new Set([3, 6, 7]) }];

            const bestIntersection = { "attribute": "headache", "value": "no", "cases": new Set([3, 6, 7]) };
            const actual = LEM2.selectBestBlock(intersectionsFluNo1);

            expect(actual).to.be.eql(bestIntersection);
        });

        it(intersectionMaximum, function exampleTwoFluYes() {
            LEM2.initialize(dataset2);
            const intersectionsFluYes2 = [{ "attribute": "temperature", "value": "high", "cases": new Set([1, 4]) }, { "attribute": "temperature", "value": "very_high", "cases": new Set([2]) }, { "attribute": "headache", "value": "yes", "cases": new Set([1, 2, 4]) }, { "attribute": "nausea", "value": "no", "cases": new Set([1]) }, { "attribute": "nausea", "value": "yes", "cases": new Set([2, 4]) }, { "attribute": "cough", "value": "yes", "cases": new Set([1, 4]) }, { "attribute": "cough", "value": "no", "cases": new Set([2]) }];

            const bestIntersection = { "attribute": "headache", "value": "yes", "cases": new Set([1, 2, 4]) };
            const actual = LEM2.selectBestBlock(intersectionsFluYes2);

            expect(actual).to.be.eql(bestIntersection);
        });

        // Minimal Cardinality

        const minimalCardinality = 'should take an array of intersections and return the largerst intersection with minimum cardinality';

        it(minimalCardinality, function exampleOneFluNo() {
            LEM2.initialize(dataset1);
            const intersectionsFluNo1 = [{ "attribute": "headache", "value": "no", "cases": new Set([6]) }, { "attribute": "weakness", "value": "no", "cases": new Set([6]) }, { "attribute": "nausea", "value": "no", "cases": new Set([6]) }];

            const bestIntersection = { "attribute": "weakness", "value": "no", "cases": new Set([6]) };
            const actual = LEM2.selectBestBlock(intersectionsFluNo1);

            expect(actual).to.be.eql(bestIntersection);
        });

        it(minimalCardinality, function exampleTwoFluNo() {
            LEM2.initialize(dataset2);
            const intersectionsFluNo2 = [{ "attribute": "temperature", "value": "high", "cases": new Set([3]) }, { "attribute": "headache", "value": "no", "cases": new Set([3]) }, { "attribute": "nausea", "value": "no", "cases": new Set([3]) }, { "attribute": "cough", "value": "no", "cases": new Set([3]) }];

            const bestIntersection = { "attribute": "headache", "value": "no", "cases": new Set([3]) };
            const actual = LEM2.selectBestBlock(intersectionsFluNo2);

            expect(actual).to.be.eql(bestIntersection);
        });
    });

    describe('#updateGoal()', function () {

        // Update Goal

        const updateGoal = 'should set the goal to the concept minus the single local covering';

        it(updateGoal, function goalInitialization() {
            LEM2.initialize(dataset1);
            LEM2.initializeProcedure(conceptFluYes1);

            LEM2.updateGoal();

            expect(LEM2.goal).to.be.eql(LEM2.concept);
        });

        it(updateGoal, function subtractCoveringFromConcept() {
            LEM2.initialize(dataset1);
            LEM2.initializeProcedure(conceptFluYes1);

            LEM2.singleLocalCovering = rulesetFluYes1;
            const newGoal = new Set();

            LEM2.updateGoal();

            expect(LEM2.goal).to.be.eql(newGoal);
        });
    });
});
