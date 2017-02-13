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
        const dataset = [];
        LEM2.dataset.forEach(function (row, rowIndex) {
            dataset[rowIndex] = row.slice(0);
        });

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

            // TODO: Refactor indentation levels
            var attributeValues = [];
            column.forEach(function (attributeValue) {
                if (attributeValue.size) {
                    attributeValue.forEach(function (setValue) {
                        // TODO: Combine usage of duplicate code
                        if (attributeValues.indexOf(setValue) === -1) {
                            attributeValues.push(setValue);
                        }
                    });
                    return;
                }

                if (attributeValues.indexOf(attributeValue) !== -1) {
                    return;
                }

                attributeValues.push(attributeValue);
            });

            attributeValues.forEach(function (attributeValue) {
                LEM2.blocks[attributeName][attributeValue] = column.reduce(function (attributeValues, value, index) {

                    if (value.size) {
                        value.forEach(function (setValue) {
                            // TODO: Combine usage of duplicate code
                            if (setValue === attributeValue) {
                                attributeValues.push(index + 1);
                            }
                        });
                        return attributeValues;
                    }

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
        LEM2.dataset = LEM2.convertToSetValuedDataset(LEM2.dataset);
        LEM2.newConcepts();
        LEM2.newAttributeValueBlocks();
    },

    initializeProcedure: function (concept) {
        LEM2.concept = concept;
        LEM2.singleLocalCovering = [];
        LEM2.goal = concept.cases;
    },

    invokeProcedure: function (concept) {
        LEM2.initializeProcedure(concept);
        LEM2.newRuleset();
        LEM2.compressRuleset();
    },

    newRuleset: function () {

        // Start Time
        console.log(new Date());
        var totalRuleCreationTime = 0;
        var totalGoalUpdateTime = 0;
        var totalInductionTime = 0;

        var casesCoveredByRuleset = new Set();
        while (LEM2.goal.size) {
            console.log('---');
            console.log(new Date());
            console.log('Goal Size: ' + LEM2.goal.size);
            var t0 = performance.now();

            var rule = LEM2.newRule();
            LEM2.singleLocalCovering.push(rule);
            var t1 = performance.now();
            totalRuleCreationTime += (t1 - t0);
            var averageRuleCreationTime = (totalRuleCreationTime / LEM2.singleLocalCovering.length) * .001;
            console.log("Creating a rule took " + (t1 - t0) * .001 + " seconds (" + averageRuleCreationTime.toFixed(4) + " avg)");

            casesCoveredByRuleset = casesCoveredByRuleset.union(rule.coveredCases);
            casesCoveredByRuleset = casesCoveredByRuleset.sort();
            LEM2.goal = LEM2.concept.cases.difference(casesCoveredByRuleset);
            var t2 = performance.now();
            totalGoalUpdateTime += (t2 - t1);
            var averageGoalCreationTime = (totalGoalUpdateTime / LEM2.singleLocalCovering.length) * .001;
            console.log("Updating the Goal took " + (t2 - t1) * .001 + " seconds (" + averageGoalCreationTime.toFixed(4) + " avg)");

            totalInductionTime += (t2 - t0);
            var averageInductionTime = (totalInductionTime / LEM2.singleLocalCovering.length) * .001;
            console.log("Inducing the Rule took " + (t2 - t0) * .001 + " seconds (" + averageInductionTime.toFixed(4) + " avg)");

            console.log("STATUS");


            var percentCompleteRuleset = casesCoveredByRuleset.size / LEM2.concept.cases.size * 100;
            var remainingCasesRuleset = (LEM2.concept.cases.size - casesCoveredByRuleset.size);
            // var remainingTimeRuleset = (remainingCasesRuleset * averageInductionTime) / 60;
            var remainingTimeRuleset = totalInductionTime / (percentCompleteRuleset / 100);
            // console.log(remainingTimeRuleset)
            remainingTimeRuleset = (remainingTimeRuleset * .001) / 60;
            console.log("Cases Covered by Ruleset: " + casesCoveredByRuleset.size);
            console.log("Remaining Cases by Ruleset: " + remainingCasesRuleset + " (" + percentCompleteRuleset.toFixed(4) + "% complete)");
            var hoursRuleset = remainingTimeRuleset / 60;
            if (hoursRuleset < 1) {
                console.log("Estimated Time Remaining by Ruleset: " + Math.round(remainingTimeRuleset) + " min");
            }
            else {
                console.log("Estimated Time Remaining by Ruleset: " + hoursRuleset.toFixed(2) + " hours");
            }

            var percentCompleteGoal = (LEM2.concept.cases.size - LEM2.goal.size) / LEM2.concept.cases.size * 100;
            // var remainingCasesGoal = LEM2.goal.size;
            // var remainingTimeGoal = (remainingCasesGoal * averageInductionTime) / 60; // minutes
            var remainingTimeGoal = totalInductionTime / (percentCompleteGoal / 100);
            // console.log(remainingTimeGoal)
            remainingTimeGoal = (remainingTimeGoal * .001) / 60;
            console.log("Cases Covered by Goal: " + (LEM2.concept.cases.size - LEM2.goal.size));
            console.log("Remaining Cases by Goal: " + LEM2.goal.size + " (" + percentCompleteGoal.toFixed(4) + "% complete)");
            var hoursGoal = remainingTimeGoal / 60;
            if (hoursGoal < 1) {
                console.log("Estimated Time Remaining by Goal: " + Math.round(remainingTimeGoal) + " min");
            }
            else {
                console.log("Estimated Time Remaining by Goal: " + hoursGoal.toFixed(2) + " hours");
            }
        }

        // End Time
        console.log(new Date());
    },

    newRule: function () {

        var rule = { "conditions": [], "decision": { "name": LEM2.concept.decision, "value": LEM2.concept.value }, "coveredCases": new Set(), "consistent": true };

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

            var block = new Set(LEM2.blocks[condition.attribute][condition.value]);
            if (rule.coveredCases.size === 0) {
                rule.coveredCases = block;
            }
            else {
                rule.coveredCases = rule.coveredCases.intersection(block);
            }

            var isSubset = LEM2.concept.cases.isSuperset(rule.coveredCases);
        } while (rule.conditions.length === 0 || !isSubset)

        rule = LEM2.compressRule(rule);
        return rule;
    },

    getCasesCoveredByRuleset: function (ruleset) {

        var coveredCases = new Set();
        ruleset.forEach(function (rule) {
            coveredCases = coveredCases.union(rule.coveredCases);
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
            "coveredCases": new Set(),
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
        minimalRule.coveredCases = LEM2.getCasesCoveredByRule(minimalRule);
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

    // TODO: Rename to selectBestIntersection
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
