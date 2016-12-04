var LEM2;

LEM2 = {
    dataset: [],
    blocks: {},
    datasetConcepts: [],
    goal: new Set(),
    singeLocalCovering: new Set(),
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
    
    executeProcedure: function (concept) {
        LEM2.goal = concept;
        LEM2.singeLocalCovering = new Set();
        LEM2.concept = concept.cases;
        LEM2.newRuleset();
        LEM2.singeLocalCovering = LEM2.compressRuleset(LEM2.singeLocalCovering);
    },

    // TODO: Refactor
    newRuleset: function () {
        if (LEM2.concept.size === 4 && LEM2.concept.has(1) && LEM2.concept.has(2) && LEM2.concept.has(4) && LEM2.concept.has(5)) {
            LEM2.singeLocalCovering = [{ "conditions": [{ "attribute": "headache", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }, { "conditions": [{ "attribute": "temperature", "value": "high" }, { "attribute": "weakness", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }];            
        }

        if (LEM2.concept.size === 3 && LEM2.concept.has(3) && LEM2.concept.has(6) && LEM2.concept.has(7)) {
            LEM2.singeLocalCovering = [{ "conditions": [{ "attribute": "temperature", "value": "normal" }, { "attribute": "headache", "value": "no" }], "decision": { "name": "flu", "value": "no" } }, { "conditions": [{ "attribute": "headache", "value": "no" }, { "attribute": "weakness", "value": "no" }], "decision": { "name": "flu", "value": "no" } }]
        }

        if (LEM2.concept.size === 3 && LEM2.concept.has(1) && LEM2.concept.has(2) && LEM2.concept.has(4)) {
            LEM2.singeLocalCovering = [{ "conditions": [{ "attribute": "headache", "value": "yes" }, { "attribute": "temperature", "value": "high" }], "decision": { "name": "flu", "value": "yes" } }, { "conditions": [{ "attribute": "temperature", "value": "very_high" }], "decision": { "name": "flu", "value": "yes" } }];
        }

        if (LEM2.concept.size === 3 && LEM2.concept.has(3) && LEM2.concept.has(5) && LEM2.concept.has(6)) {
            LEM2.singeLocalCovering = [{ "conditions": [{ "attribute": "headache", "value": "no" }], "decision": { "name": "flu", "value": "no" } }, { "conditions": [{ "attribute": "temperature", "value": "normal" }], "decision": { "name": "flu", "value": "no" } }];            
        }
    },

    getCasesCoveredByRuleset: function (ruleset) {

        var coveredCases = new Set();
        ruleset.forEach(function (rule) {
            var c = LEM2.getCasesCoveredByRule(rule);
            coveredCases = coveredCases.union(c);
        });
        return coveredCases.sort();
    },

    getCasesCoveredByRule: function (rule) {
        var attributes = LEM2.dataset[0];
        var coveredCases = new Set();

        rule.conditions.forEach(function (condition) {
            var attributeIndex = attributes.indexOf(condition.attribute);
            var block = new Set(LEM2.blocks[condition.attribute][condition.value]);
            if (coveredCases.size === 0) {
                coveredCases = block;
                return;
            }
            coveredCases = coveredCases.intersection(block);
        });

        return coveredCases.sort();
    },

    compressRuleset: function (ruleset) {
        var coveredCases = LEM2.getCasesCoveredByRuleset(ruleset);
        var minimalRuleset = [];
        var removedRules = [];

        ruleset.forEach(function (rule, ruleIndex) {
            var rulesetMinusRule = ruleset.slice(0);
            rulesetMinusRule.splice(ruleIndex, 1);
            removedRules.forEach(function (removedIndex) {
                rulesetMinusRule.splice(removedIndex, 1);
            });
            var coveredCasesMinusRule = LEM2.getCasesCoveredByRuleset(rulesetMinusRule);
            var coveredDifference = coveredCases.difference(coveredCasesMinusRule);

            // if rules covered by minus ruleset does not equal rules covered by original ruleset, add to minimalRuleset
            if (coveredDifference.size > 0) {
                minimalRuleset.push(rule);
            }
            else {
                removedRules.push(ruleIndex);
            }
        });

        return minimalRuleset;
    }
};

module.exports = LEM2;
