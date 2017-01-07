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

        const tests = [
            { "dataset": dataset1, "concept": conceptFluYes1, "ruleset": rulesetFluYes1, "example": 1 },
            { "dataset": dataset1, "concept": conceptFluNo1, "ruleset": rulesetFluNo1, "example": 1 },
            { "dataset": dataset2, "concept": conceptFluYes2, "ruleset": rulesetFluYes2, "example": 2 },
            { "dataset": dataset2, "concept": conceptFluNo2, "ruleset": rulesetFluNo2, "example": 2 }
        ];

        tests.forEach(function (test) {
            const example = " - Example #" + test.example + " (" + test.concept.decision + "," + test.concept.value + ")";

            it("should take a concept and set singleLocalCovering to an array of rules" + example, function () {
                LEM2.initialize(test.dataset);
                LEM2.invokeProcedure(test.concept);

                expect(LEM2.singleLocalCovering).to.be.deep.equal(test.ruleset);
            });
        });
    });

    describe("#getCasesCoveredByRuleset()", function () {

        const tests = [
            { "dataset": dataset1, "concept": conceptFluYes1, "ruleset": rulesetFluYes1, "example": 1 },
            { "dataset": dataset1, "concept": conceptFluNo1, "ruleset": rulesetFluNo1, "example": 1 },
            { "dataset": dataset2, "concept": conceptFluYes2, "ruleset": rulesetFluYes2, "example": 2 },
            { "dataset": dataset2, "concept": conceptFluNo2, "ruleset": rulesetFluNo2, "example": 2 }
        ];

        tests.forEach(function (test) {
            const example = " - Example #" + test.example + " (" + test.concept.decision + "," + test.concept.value + ")";

            it("should take an array of rules and return the set of cases covered by ruleset" + example, function () {
                LEM2.initialize(test.dataset);
                const actual = LEM2.getCasesCoveredByRuleset(test.ruleset);

                expect(actual).to.be.deep.equal(test.concept.cases);
            });
        });
    });

    describe("#getCasesCoveredByRule()", function () {

        const tests = [
            { "dataset": dataset1, "coveredCases": new Set([1, 2, 4]), "rule": rulesetFluYes1[0], "example": 1 },
            { "dataset": dataset1, "coveredCases": new Set([5]), "rule": rulesetFluYes1[1], "example": 1 },
            { "dataset": dataset1, "coveredCases": new Set([3, 7]), "rule": rulesetFluNo1[0], "example": 1 },
            { "dataset": dataset1, "coveredCases": new Set([3, 6]), "rule": rulesetFluNo1[1], "example": 1 },
            { "dataset": dataset2, "coveredCases": new Set([1, 4]), "rule": rulesetFluYes2[0], "example": 2 },
            { "dataset": dataset2, "coveredCases": new Set([2]), "rule": rulesetFluYes2[1], "example": 2 },
            { "dataset": dataset2, "coveredCases": new Set([3, 6]), "rule": rulesetFluNo2[0], "example": 2 },
            { "dataset": dataset2, "coveredCases": new Set([5, 6]), "rule": rulesetFluNo2[1], "example": 2 }
        ];

        tests.forEach(function (test, testIndex) {
            const decision = " (" + test.rule.decision.name + "," + test.rule.decision.value + ")";
            const example = " - Example #" + test.example + decision + " Rule #" + (testIndex % 2 + 1);

            it("should take a rule and return a set of cases covered" + example, function () {
                LEM2.initialize(test.dataset);
                const actual = LEM2.getCasesCoveredByRule(test.rule);

                expect(actual).to.be.deep.equal(test.coveredCases);
            });
        });
    });

    describe("#compressRule()", function () {

        const rule1 = { "conditions": [{ "attribute": "headache", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } };
        const rule2 = { "conditions": [{ "attribute": "temperature", "value": "high" }, { "attribute": "weakness", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } };
        const expandedRule1 = { "conditions": [{ "attribute": "temperature", "value": "normal" }, { "attribute": "headache", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } };
        const expandedRule2 = { "conditions": [{ "attribute": "temperature", "value": "high" }, { "attribute": "headache", "value": "no" }, { "attribute": "weakness", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } };

        const tests = [
            { "dataset": dataset1, "concept": conceptFluYes1, "ruleIn": rule1, "ruleOut": rule1, "display": "Minimal Rule" },
            { "dataset": dataset1, "concept": conceptFluYes1, "ruleIn": rule2, "ruleOut": rule2, "display": "Minimal Rule" },
            { "dataset": dataset1, "concept": conceptFluYes1, "ruleIn": expandedRule1, "ruleOut": rule1, "display": "Non-Minimal Rule" },
            { "dataset": dataset1, "concept": conceptFluYes1, "ruleIn": expandedRule2, "ruleOut": rule2, "display": "Non-Minimal Rule" },
        ];

        tests.forEach(function (test) {
            it("should take a " + test.display + " and return a minimal rule", function () {
                LEM2.initialize(test.dataset);
                LEM2.concept = test.concept.cases;

                const actual = LEM2.compressRule(test.ruleIn);
                expect(actual).to.be.deep.equal(test.ruleOut);
            });
        });
    });

    describe("#compressRuleset()", function () {

        const singleRuleRuleset = [{ "conditions": [{ "attribute": "headache", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }];
        const expandedRulesetFluYes1 = [{ "conditions": [{ "attribute": "headache", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }, { "conditions": [{ "attribute": "headache", "value": "yes" }, { "attribute": "weakness", "value": "yes" }, { "attribute": "nausea", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }, { "conditions": [{ "attribute": "temperature", "value": "high" }, { "attribute": "weakness", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }];
        const expandedRulesetFluNo1 = [{ "conditions": [{ "attribute": "temperature", "value": "normal" }, { "attribute": "headache", "value": "no" }], "decision": { "name": "flu", "value": "no" } }, { "conditions": [{ "attribute": "temperature", "value": "normal" }, { "attribute": "headache", "value": "no" }], "decision": { "name": "flu", "value": "no" } }, { "conditions": [{ "attribute": "headache", "value": "no" }, { "attribute": "weakness", "value": "no" }], "decision": { "name": "flu", "value": "no" } }, { "conditions": [{ "attribute": "temperature", "value": "normal" }, { "attribute": "headache", "value": "no" }, { "attribute": "weakness", "value": "no" }], "decision": { "name": "flu", "value": "no" } }];;

        const tests = [
            { "dataset": dataset1, "concept": conceptFluYes1, "rulesetIn": rulesetFluYes1, "rulesetOut": rulesetFluYes1, "display": "Minimal Ruleset", "example": 1 },
            { "dataset": dataset1, "concept": conceptFluNo1, "rulesetIn": rulesetFluNo1, "rulesetOut": rulesetFluNo1, "display": "Minimal Ruleset", "example": 1 },
            { "dataset": dataset2, "concept": conceptFluYes2, "rulesetIn": rulesetFluYes2, "rulesetOut": rulesetFluYes2, "display": "Minimal Ruleset", "example": 2 },
            { "dataset": dataset2, "concept": conceptFluNo2, "rulesetIn": rulesetFluNo2, "rulesetOut": rulesetFluNo2, "display": "Minimal Ruleset", "example": 2 },
            { "dataset": dataset1, "concept": conceptFluYes1, "rulesetIn": singleRuleRuleset, "rulesetOut": singleRuleRuleset, "display": "Single Rule Ruleset", "example": 1 },
            { "dataset": dataset1, "concept": conceptFluYes1, "rulesetIn": expandedRulesetFluYes1, "rulesetOut": rulesetFluYes1, "display": "Non-Minimal Ruleset", "example": 1 },
            { "dataset": dataset1, "concept": conceptFluNo1, "rulesetIn": expandedRulesetFluNo1, "rulesetOut": rulesetFluNo1, "display": "Non-Minimal Ruleset", "example": 1 }
        ];

        tests.forEach(function (test) {
            const example = " - Example #" + test.example + " (" + test.concept.decision + "," + test.concept.value + ")";
            it("should remove unnecessary rules from a " + test.display + example, function () {
                LEM2.initialize(test.dataset);
                LEM2.concept = test.concept.cases;
                LEM2.singleLocalCovering = test.rulesetIn;

                LEM2.compressRuleset();
                expect(LEM2.singleLocalCovering).to.be.deep.equal(test.rulesetOut);
            });
        });
    });

    describe("#newGoalBlockIntersections()", function () {

        // Intersection Structure

        it("should create an array of intersections, each with an attribute string, a value string, and a non-empty set", function () {
            const emptySet = new Set();

            LEM2.initialize(dataset1);
            LEM2.initializeProcedure(conceptFluYes1);
            const intersections = LEM2.newGoalBlockIntersections();

            expect(intersections.length).to.be.not.equal(0);
            intersections.forEach(function (intersection) {
                expect(intersection.attribute).to.be.a("string");
                expect(intersection.value).to.be.a("string");
                expect(intersection.cases).to.be.a("set");
                expect(intersection.cases).to.be.not.deep.equal(emptySet);
            });
        });

        // Create Intersections

        const intersectionsFluYes1 = [{ "attribute": "temperature", "value": "very_high", "cases": new Set([1]) }, { "attribute": "temperature", "value": "high", "cases": new Set([2, 5]) }, { "attribute": "temperature", "value": "normal", "cases": new Set([4]) }, { "attribute": "headache", "value": "yes", "cases": new Set([1, 2, 4]) }, { "attribute": "headache", "value": "no", "cases": new Set([5]) }, { "attribute": "weakness", "value": "yes", "cases": new Set([1, 4, 5]) }, { "attribute": "weakness", "value": "no", "cases": new Set([2]) }, { "attribute": "nausea", "value": "no", "cases": new Set([1, 5]) }, { "attribute": "nausea", "value": "yes", "cases": new Set([2, 4]) }];
        const intersectionsFluNo1 = [{ "attribute": "temperature", "value": "high", "cases": new Set([6]) }, { "attribute": "temperature", "value": "normal", "cases": new Set([3, 7]) }, { "attribute": "headache", "value": "no", "cases": new Set([3, 6, 7]) }, { "attribute": "weakness", "value": "yes", "cases": new Set([7]) }, { "attribute": "weakness", "value": "no", "cases": new Set([3, 6]) }, { "attribute": "nausea", "value": "no", "cases": new Set([3, 6, 7]) }];
        const intersectionsFluYes2 = [{ "attribute": "temperature", "value": "high", "cases": new Set([1, 4]) }, { "attribute": "temperature", "value": "very_high", "cases": new Set([2]) }, { "attribute": "headache", "value": "yes", "cases": new Set([1, 2, 4]) }, { "attribute": "nausea", "value": "no", "cases": new Set([1]) }, { "attribute": "nausea", "value": "yes", "cases": new Set([2, 4]) }, { "attribute": "cough", "value": "yes", "cases": new Set([1, 4]) }, { "attribute": "cough", "value": "no", "cases": new Set([2]) }];

        const tests = [
            { "dataset": dataset1, "concept": conceptFluYes1, "intersections": intersectionsFluYes1, "example": 1 },
            { "dataset": dataset1, "concept": conceptFluNo1, "intersections": intersectionsFluNo1, "example": 1 },
            { "dataset": dataset2, "concept": conceptFluYes2, "intersections": intersectionsFluYes2, "example": 2 }
        ];

        tests.forEach(function (test) {
            const example = " - Example #" + test.example + " (" + test.concept.decision + "," + test.concept.value + ")";

            it("should create an array of intersections between each attribute value block and the goal" + example, function () {
                LEM2.initialize(test.dataset);
                LEM2.initializeProcedure(test.concept);

                const actual = LEM2.newGoalBlockIntersections();
                expect(actual).to.be.deep.equal(test.intersections);
            });
        });
    });

    describe("#selectBestBlock()", function () {

        const intersectionsFluYes1 = [{ "attribute": "temperature", "value": "very_high", "cases": new Set([1]) }, { "attribute": "temperature", "value": "high", "cases": new Set([2, 5]) }, { "attribute": "temperature", "value": "normal", "cases": new Set([4]) }, { "attribute": "headache", "value": "yes", "cases": new Set([1, 2, 4]) }, { "attribute": "headache", "value": "no", "cases": new Set([5]) }, { "attribute": "weakness", "value": "yes", "cases": new Set([1, 4, 5]) }, { "attribute": "weakness", "value": "no", "cases": new Set([2]) }, { "attribute": "nausea", "value": "no", "cases": new Set([1, 5]) }, { "attribute": "nausea", "value": "yes", "cases": new Set([2, 4]) }];
        const intersectionsFluNo1 = [{ "attribute": "temperature", "value": "high", "cases": new Set([6]) }, { "attribute": "temperature", "value": "normal", "cases": new Set([3, 7]) }, { "attribute": "headache", "value": "no", "cases": new Set([3, 6, 7]) }, { "attribute": "weakness", "value": "yes", "cases": new Set([7]) }, { "attribute": "weakness", "value": "no", "cases": new Set([3, 6]) }, { "attribute": "nausea", "value": "no", "cases": new Set([3, 6, 7]) }];
        const intersectionsFluYes2 = [{ "attribute": "temperature", "value": "high", "cases": new Set([1, 4]) }, { "attribute": "temperature", "value": "very_high", "cases": new Set([2]) }, { "attribute": "headache", "value": "yes", "cases": new Set([1, 2, 4]) }, { "attribute": "nausea", "value": "no", "cases": new Set([1]) }, { "attribute": "nausea", "value": "yes", "cases": new Set([2, 4]) }, { "attribute": "cough", "value": "yes", "cases": new Set([1, 4]) }, { "attribute": "cough", "value": "no", "cases": new Set([2]) }];

        const intersectionsTieFluNo1 = [{ "attribute": "headache", "value": "no", "cases": new Set([6]) }, { "attribute": "weakness", "value": "no", "cases": new Set([6]) }, { "attribute": "nausea", "value": "no", "cases": new Set([6]) }];
        const intersectionsTieFluNo2 = [{ "attribute": "temperature", "value": "high", "cases": new Set([3]) }, { "attribute": "headache", "value": "no", "cases": new Set([3]) }, { "attribute": "nausea", "value": "no", "cases": new Set([3]) }, { "attribute": "cough", "value": "no", "cases": new Set([3]) }];

        const tests = [
            { "dataset": dataset1, "intersetcions": intersectionsFluYes1, "bestIntersection": { "attribute": "headache", "value": "yes", "cases": new Set([1, 2, 4]) }, "display": "Intersection Maximimum" },
            { "dataset": dataset1, "intersetcions": intersectionsFluNo1, "bestIntersection": { "attribute": "headache", "value": "no", "cases": new Set([3, 6, 7]) }, "display": "Intersection Maximimum" },
            { "dataset": dataset2, "intersetcions": intersectionsFluYes2, "bestIntersection": { "attribute": "headache", "value": "yes", "cases": new Set([1, 2, 4]) }, "display": "Intersection Maximimum" },
            { "dataset": dataset1, "intersetcions": intersectionsTieFluNo1, "bestIntersection": { "attribute": "weakness", "value": "no", "cases": new Set([6]) }, "display": "Minimal Cardinality" },
            { "dataset": dataset2, "intersetcions": intersectionsTieFluNo2, "bestIntersection": { "attribute": "headache", "value": "no", "cases": new Set([3]) }, "display": "Minimal Cardinality" },
        ];

        tests.forEach(function (test) {
            it("should take an array of intersections and return the intersection of " + test.display, function () {
                LEM2.initialize(test.dataset);
                const actual = LEM2.selectBestBlock(test.intersetcions);

                expect(actual).to.be.deep.equal(test.bestIntersection);
            });
        });
    });

    describe("#updateGoal()", function () {
        const tests = [
            { "dataset": dataset1, "concept": conceptFluYes1, "example": 1 },
            { "dataset": dataset1, "concept": conceptFluNo1, "example": 1 },
            { "dataset": dataset2, "concept": conceptFluYes2, "example": 2 },
            { "dataset": dataset2, "concept": conceptFluNo2, "example": 2 }
        ];

        tests.forEach(function (test) {
            const example = " - Example #" + test.example + " (" + test.concept.decision + "," + test.concept.value + ")";

            it("should set the goal to the concept minus the single local covering" + example, function () {
                LEM2.initialize(test.dataset);
                LEM2.initializeProcedure(test.concept);
                LEM2.updateGoal();

                expect(LEM2.goal).to.be.deep.equal(LEM2.concept);
            });
        });
    });

    describe("#newRule()", function () {

        it("should return a rule object", function () {
            const rule = LEM2.newRule();

            expect(rule).to.be.a("object");

            expect(rule).to.have.property("conditions")
                .to.be.a("array");
            expect(rule).to.have.property("decision")
                .to.be.a("object");

            expect(rule.decision).to.have.property("name")
                .to.be.a("string");
            expect(rule.decision).to.have.property("value")
                .to.be.a("string");
        });

        it("should return a rule with at least one condition", function () {
            const rule = LEM2.newRule();

            expect(rule.conditions).to.not.be.empty;

            expect(rule.conditions[0]).to.have.property("attribute")
                .to.be.a("string");
            expect(rule.conditions[0]).to.have.property("value")
                .to.be.a("string");
        });
    });
});
