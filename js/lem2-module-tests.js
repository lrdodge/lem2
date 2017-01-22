'use strict';

describe('LEM2 Module', function () {
    ("should exist", function () {
        expect(LEM2).to.not.be.undefined;
    });

    // Properties

    const propertyTests = [
        { "name": "dataset", "type": "array", "value": [] },
        { "name": "blocks", "type": "object", "value": {} },
        { "name": "datasetConcepts", "type": "array", "value": [] },
        { "name": "goal", "type": "set", "value": new Set() },
        { "name": "singleLocalCovering", "type": "array", "value": [] },
        { "name": "concept", "type": "object", "value": { "decision": "", "value": "", "cases": new Set() } }
    ];

    propertyTests.forEach(function (property) {
        it("should have a " + property.name + " " + property.type, function () {
            expect(LEM2).to.have.property(property.name)
                .that.is.a(property.type)
                .that.deep.equals(property.value);
        });
    });

    // Functions

    const functionTests = [
        { "name": "invokeProcedure" },
        { "name": "newConcepts" },
        { "name": "newAttributeValueBlocks" },
        { "name": "getCasesCoveredByRule" },
        { "name": "getCasesCoveredByRuleset" },
        { "name": "compressRuleset" },
        { "name": "initialize" },
        { "name": "newRuleset" },
        { "name": "compressRule" },
        { "name": "initializeProcedure" },
        { "name": "newGoalBlockIntersections" },
        { "name": "selectBestBlock" },
        { "name": "updateGoal" },
        { "name": "newRule" },
        { "name": "findCondition" },
        { "name": "convertToSetValuedDataset" },
    ];

    functionTests.forEach(function (funct) {
        it("should have an " + funct.name + " function", function () {
            expect(LEM2).to.have.property(funct.name)
                .that.is.a('function');
        });
    });
});
