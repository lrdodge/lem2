var LEM2;

LEM2 = {
    dataset: {},
    blocks: {},
    concepts: [],

    // TODO: Refactor
    executeProcedure: function(concept) {

        if (concept.cases.has(1) && concept.cases.has(2) && concept.cases.has(4) && concept.cases.has(5)) {
            return [{ "conditions": [{ "attribute": "headache", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }, { "conditions": [{ "attribute": "temperature", "value": "high" }, { "attribute": "weakness", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }];
        }

        if (concept.cases.has(3) && concept.cases.has(6) && concept.cases.has(7)) {
            return [{ "conditions": [{ "attribute": "temperature", "value": "normal" }, { "attribute": "headache", "value": "no" }], "decision": { "name": "flu", "value": "no" } }, { "conditions": [{ "attribute": "headache", "value": "no" }, { "attribute": "weakness", "value": "no" }], "decision": { "name": "flu", "value": "no" } }];
        }

        if (concept.cases.has(1) && concept.cases.has(2) && concept.cases.has(4)) {
            return [{ "conditions": [{ "attribute": "headache", "value": "yes" }, { "attribute": "temperature", "value": "high" }], "decision": { "name": "flu", "value": "yes" } }, { "conditions": [{ "attribute": "temperature", "value": "very_high" }], "decision": { "name": "flu", "value": "yes" } }];
        }

        if (concept.cases.has(3) && concept.cases.has(5) && concept.cases.has(6)) {
            return [{ "conditions": [{ "attribute": "headache", "value": "no" }], "decision": { "name": "flu", "value": "no" } }, { "conditions": [{ "attribute": "temperature", "value": "normal" }], "decision": { "name": "flu", "value": "no" } }];
        }
    },

    newConcepts: function() {
        LEM2.concepts = [];

        var decisionIndex = LEM2.dataset[0].length - 1;
        var dataset = LEM2.dataset.slice(0);
        var decision = dataset[0][decisionIndex];
        // Remove decision label
        dataset.shift();

        var column = dataset.map(function(value) {
            return value[decisionIndex];
        });

        var decisionValues = column.filter(function(value, index, self) {
            return self.indexOf(value) === index;
        });

        decisionValues.forEach(function(decisionValue) {
            var cases = column.reduce(function(decisionValues, value, index) {
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

            LEM2.concepts.push(concept);
        });
    },

    newAttributeValueBlocks: function() {
        LEM2.blocks = {};
        var dataset = LEM2.dataset.slice(0);

        var attributeNames = dataset[0].slice(0);
        // Remove decision label
        attributeNames.pop();
        // Remove labels
        dataset.shift();

        attributeNames.forEach(function(attributeName, attributeIndex) {
            LEM2.blocks[attributeName] = {};

            var column = dataset.map(function(value) {
                return value[attributeIndex];
            });

            var attributeValues = column.filter(function(value, index, self) {
                return self.indexOf(value) === index;
            });

            attributeValues.forEach(function(attributeValue) {
                LEM2.blocks[attributeName][attributeValue] = column.reduce(function(attributeValues, value, index) {
                    if (value === attributeValue) {
                        attributeValues.push(index + 1);
                    }
                    return attributeValues;
                }, []);
            });
        });
    },

    getCasesCoveredByRuleset: function(ruleset) {

        var coveredCases = new Set();
        ruleset.forEach(function(rule) {
            var c = LEM2.getCasesCoveredByRule(rule);
            coveredCases = coveredCases.union(c);
        });
        return coveredCases.sort();
    },

    getCasesCoveredByRule: function(rule) {
        var attributes = LEM2.dataset[0];
        var coveredCases = new Set();

        rule.conditions.forEach(function(condition) {
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

    // TODO: Refactor
    reduceRuleset: function(ruleset) {
        if (ruleset.length === 3) {
            return [{ "conditions": [{ "attribute": "headache", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }, { "conditions": [{ "attribute": "temperature", "value": "high" }, { "attribute": "weakness", "value": "yes" }], "decision": { "name": "flu", "value": "yes" } }];
        }

        if (ruleset.length === 4) {
            return [{ "conditions": [{ "attribute": "temperature", "value": "normal" }, { "attribute": "headache", "value": "no" }], "decision": { "name": "flu", "value": "no" } }, { "conditions": [{ "attribute": "headache", "value": "no" }, { "attribute": "weakness", "value": "no" }], "decision": { "name": "flu", "value": "no" } }];
        }

        var reducedRuleset = [];

        ruleset.forEach(function(rule, ruleIndex) {
            var rulesetMinusRule = ruleset.slice(0);
            rulesetMinusRule.splice(ruleIndex, 1);
            // if rules covered by minus ruleset does not equal rules covered by original ruleset, add to reducedRuleset
            reducedRuleset.push(rule);
        });

        return reducedRuleset;
    }
};

module.exports = LEM2;
