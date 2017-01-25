var LEM2 = {
    blocks: {},
    dataset: [],
    datasetConcepts: [],
    singleLocalCovering: [],
    goal: new Set(),
    concept: { "decision": "", "value": "", "cases": new Set() },

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
        LEM2.concept = concept;
        LEM2.singleLocalCovering = [];
        LEM2.updateGoal();
    },

    invokeProcedure: function (concept) {
        LEM2.initializeProcedure(concept);
        LEM2.newRuleset();
        LEM2.compressRuleset();
    },

    newRuleset: function () {
        while (LEM2.goal.size) {
            var rule = LEM2.newRule();
            LEM2.singleLocalCovering.push(rule);
            LEM2.updateGoal();
        }
    },

    newRule: function () {

        var rule = { "conditions": [], "decision": { "name": LEM2.concept.decision, "value": LEM2.concept.value }, "consistent": true };

        do {
            var intersections = LEM2.newGoalBlockIntersections(rule);
            
            if (intersections.length === 0) {
                rule.consistent = false;
                console.error("Inconsistent Rule Created");
                console.log(rule);
                break;
            }

            var bestBlock = LEM2.selectBestBlock(intersections);
            var condition = { "attribute": bestBlock.attribute, "value": bestBlock.value };
            rule.conditions.push(condition);
            LEM2.goal = LEM2.goal.intersection(bestBlock.cases);

            var coveredCases = LEM2.getCasesCoveredByRule(rule);
            var isSubset = LEM2.concept.cases.isSuperset(coveredCases);
        } while (rule.conditions.length === 0 || !isSubset)

        rule = LEM2.compressRule(rule);
        return rule;
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
            "decision": rule.decision,
            "consistent": rule.consistent
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

            if (LEM2.concept.cases.isSuperset(coveredCasesMinusCondition)) {
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
            var coveredDifference = LEM2.concept.cases.difference(coveredCasesMinusRule);

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

    findCondition: function (rule, targetCondition) {
        var targetIndex = -1;

        rule.conditions.forEach(function (condition, conditionIndex) {
            if (condition.attribute !== targetCondition.attribute) {
                return;
            }

            if (condition.value !== targetCondition.value) {
                return;
            }

            targetIndex = conditionIndex;
        });

        return targetIndex;
    },

    newGoalBlockIntersections: function (rule) {
        var intersections = [];

        for (var attribute in LEM2.blocks) {
            var attributeBlocks = LEM2.blocks[attribute];
            for (var attributeValue in attributeBlocks) {
                var conditionIndex = LEM2.findCondition(rule, { "attribute": attribute, "value": attributeValue });
                if (conditionIndex !== -1) {
                    continue;
                }

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
        var coveredCases = LEM2.getCasesCoveredByRuleset(LEM2.singleLocalCovering);
        LEM2.goal = LEM2.concept.cases.difference(coveredCases);
    },

    convertToSetValuedDataset: function (dataset) {
      var dataset = JSON.parse(JSON.stringify(dataset));

      dataset.forEach(function (row, rowIndex) {
        if (rowIndex === 0) {
          // skip header
          return;
        }

        row.forEach(function (cell, cellIndex) {
          if (cell.indexOf("|") === -1) {
            return;
          }

          var splitCell = cell.split("|");
          dataset[rowIndex][cellIndex] = new Set(splitCell);
        });
      });

      return dataset;
    }
};

