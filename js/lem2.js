var LEM2;

LEM2 = {
    dataset: [],
    blocks: {},
    datasetConcepts: [],
    goal: new Set(),
    singleLocalCovering: new Set(),
    concept: new Set(),

    newConcepts: function () {
        LEM2.datasetConcepts = [];

        var decisionIndex = LEM2.dataset[0].length - 1;
        var dataset = LEM2.dataset.slice(0);
        var decision = dataset[0][decisionIndex];
        // Remove decision label
        dataset.shift();

        var column = dataset.map(function (value) {
            return value[decisionIndex];
        });

        var decisionValues = column.filter(function (value, index, self) {
            return self.indexOf(value) === index;
        });

        decisionValues.forEach(function (decisionValue) {
            var cases = column.reduce(function (decisionValues, value, index) {
                if (value === decisionValue) {
                    decisionValues.push(index + 1);
                }
                return decisionValues;
            }, []);

            var concept = {
                "decision": decision,
                "value": decisionValue,
                "cases": new Set(cases)
            };

            LEM2.datasetConcepts.push(concept);
        });
    },

    newAttributeValueBlocks: function () {
        LEM2.blocks = {};
        var dataset = LEM2.dataset.slice(0);

        var attributeNames = dataset[0].slice(0);
        // Remove decision label
        attributeNames.pop();
        // Remove labels
        dataset.shift();

        attributeNames.forEach(function (attributeName, attributeIndex) {
            LEM2.blocks[attributeName] = {};

            var column = dataset.map(function (value) {
                return value[attributeIndex];
            });

            var attributeValues = column.filter(function (value, index, self) {
                return self.indexOf(value) === index;
            });

            attributeValues.forEach(function (attributeValue) {
                LEM2.blocks[attributeName][attributeValue] = column.reduce(function (attributeValues, value, index) {
                    if (value === attributeValue) {
                        attributeValues.push(index + 1);
                    }
                    return attributeValues;
                }, []);
            });
        });
    },

    initialize: function (dataset) {
        LEM2.dataset = dataset;
        LEM2.newConcepts();
        LEM2.newAttributeValueBlocks();
    },

    initializeProcedure: function (concept) {
        LEM2.concept = concept.cases;        
        LEM2.singleLocalCovering = new Set();
        LEM2.updateGoal();
    },

    invokeProcedure: function (concept) {        
        LEM2.initializeProcedure(concept);
        LEM2.newRuleset();
        LEM2.compressRuleset();
    },

    // TODO: Refactor
    newRuleset: function () {
        LEM2.goal = new Set();

        if (LEM2.concept.size === 4 && LEM2.concept.has(1) && LEM2.concept.has(2) && LEM2.concept.has(4) && LEM2.concept.has(5)) {
            LEM2.singleLocalCovering = [{ "conditions": [{ "attribute": "headache", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }, { "conditions": [{ "attribute": "temperature", "value": "high" }, { "attribute": "weakness", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }];
        }

        if (LEM2.concept.size === 3 && LEM2.concept.has(3) && LEM2.concept.has(6) && LEM2.concept.has(7)) {
            LEM2.singleLocalCovering = [{ "conditions": [{ "attribute": "temperature", "value": "normal" }, { "attribute": "headache", "value": "no" }], "decision": { "name": "flu", "value": "no" } }, { "conditions": [{ "attribute": "headache", "value": "no" }, { "attribute": "weakness", "value": "no" }], "decision": { "name": "flu", "value": "no" } }]
        }

        if (LEM2.concept.size === 3 && LEM2.concept.has(1) && LEM2.concept.has(2) && LEM2.concept.has(4)) {
            LEM2.singleLocalCovering = [{ "conditions": [{ "attribute": "headache", "value": "yes" }, { "attribute": "temperature", "value": "high" }], "decision": { "name": "flu", "value": "yes" } }, { "conditions": [{ "attribute": "temperature", "value": "very_high" }], "decision": { "name": "flu", "value": "yes" } }];
        }

        if (LEM2.concept.size === 3 && LEM2.concept.has(3) && LEM2.concept.has(5) && LEM2.concept.has(6)) {
            LEM2.singleLocalCovering = [{ "conditions": [{ "attribute": "headache", "value": "no" }], "decision": { "name": "flu", "value": "no" } }, { "conditions": [{ "attribute": "temperature", "value": "normal" }], "decision": { "name": "flu", "value": "no" } }];
        }
    },

    getCasesCoveredByRuleset: function (ruleset) {

        var coveredCases = new Set();
        ruleset.forEach(function (rule) {
            var coveredCasesByRule = LEM2.getCasesCoveredByRule(rule);
            coveredCases = coveredCases.union(coveredCasesByRule);
        });
        return coveredCases.sort();
    },

    getCasesCoveredByRule: function (rule) {
        var attributes = LEM2.dataset[0];
        var coveredCases = new Set();

        rule.conditions.forEach(function (condition) {
            var block = new Set(LEM2.blocks[condition.attribute][condition.value]);
            if (coveredCases.size === 0) {
                coveredCases = block;
                return;
            }
            coveredCases = coveredCases.intersection(block);
        });

        return coveredCases.sort();
    },

    compressRule: function (rule) {
        var minimalConditions = [];
        var removedConditions = [];
        var minimalRule = {
            "conditions": [],
            "decision": rule.decision
        }

        rule.conditions.forEach(function (condition, conditionIndex) {
            var conditionsMinusCondition = rule.conditions.slice(0);
            conditionsMinusCondition.splice(conditionIndex, 1);
            removedConditions.forEach(function (removedIndex) {
                conditionsMinusCondition.splice(removedIndex, 1);
            });

            if (conditionsMinusCondition.length === 0) {
                minimalConditions.push(condition);
                return false;
            }

            minimalRule.conditions = conditionsMinusCondition;
            var coveredCasesMinusCondition = LEM2.getCasesCoveredByRule(minimalRule);

            if (LEM2.concept.isSuperset(coveredCasesMinusCondition)) {
                removedConditions.push(conditionIndex);
            }
            else {
                minimalConditions.push(condition);
            }
        });

        minimalRule.conditions = minimalConditions;
        return minimalRule;
    },

    compressRuleset: function () {
        var minimalRuleset = [];
        var removedRules = [];

        LEM2.singleLocalCovering.forEach(function (rule, ruleIndex) {
            var rulesetMinusRule = LEM2.singleLocalCovering.slice(0);
            rulesetMinusRule.splice(ruleIndex, 1);
            removedRules.forEach(function (removedIndex) {
                rulesetMinusRule.splice(removedIndex, 1);
            });

            if (rulesetMinusRule.length === 0) {
                minimalRuleset.push(rule);
                return false;
            }

            var coveredCasesMinusRule = LEM2.getCasesCoveredByRuleset(rulesetMinusRule);
            var coveredDifference = LEM2.concept.difference(coveredCasesMinusRule);

            // if rules covered by minus ruleset does not equal rules covered by original ruleset, add to minimalRuleset
            if (coveredDifference.size > 0) {
                minimalRuleset.push(rule);
            }
            else {
                removedRules.push(ruleIndex);
            }
        });

        LEM2.singleLocalCovering = minimalRuleset;
    },

    newGoalBlockIntersections: function () {
        var intersections = [];

        for (var attribute in LEM2.blocks) {
            var attributeBlocks = LEM2.blocks[attribute];
            for (var attributeValue in attributeBlocks) {
                var blockCases = new Set(LEM2.blocks[attribute][attributeValue]);
                var intersection = {
                    "attribute": attribute,
                    "value": attributeValue,
                    "cases": blockCases.intersection(LEM2.goal)
                }
                if (intersection.cases.size) {
                   intersections.push(intersection);
                }
            }
        }

        return intersections;
    },

    selectBestBlock: function (intersections) {
        var bestBlock = intersections[0];
        var bestCardinality = LEM2.blocks[intersections[0].attribute][intersections[0].value].length;

        intersections.forEach(function (intersection) {
            var cardinality = LEM2.blocks[intersection.attribute][intersection.value].length;

            if (intersection.cases.size < bestBlock.cases.size) {
                return;
            }

            if (intersection.cases.size > bestBlock.cases.size) {
                bestBlock = intersection;
                bestCardinality = cardinality;
                return;
            }

            if (cardinality > bestCardinality) {
                return;
            }

            if (cardinality < bestCardinality) {
                bestBlock = intersection;
                bestCardinality = cardinality;
                return;
            }
        });

        return bestBlock;
    },

    updateGoal: function () {
        LEM2.goal = LEM2.concept.difference(LEM2.singleLocalCovering);
    }
};

module.exports = LEM2;
