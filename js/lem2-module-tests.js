'use strict';
const expect = require('chai').expect;
const LEM2 = require('./lem2.js');

describe('LEM2 Module', function() {
    it('should exist', function() {
        expect(LEM2).to.not.be.undefined;
    });

    // Properties

    it('should have a dataset array', function() {
        expect(LEM2.dataset).to.be.a('array');
    });

    it('should have a blocks object', function() {
        expect(LEM2.blocks).to.be.a('object');
    });

    it('should have a datasetConcepts array', function() {
        expect(LEM2.datasetConcepts).to.be.a('array');
    });

    it('should have a goal set', function() {
        expect(LEM2.goal).to.be.a('set');
    });

    it('should have a single local covering set', function() {
        expect(LEM2.goal).to.be.a('set');
    });

    it('should have a concept set', function() {
        expect(LEM2.concept).to.be.a('set');
    });

    it('should have a goalBlockIntersections array', function() {
        expect(LEM2.goalBlockIntersections).to.be.a('array');
    });

    // Functions

    it('should have an invokeProcedure function', function() {
        expect(LEM2.invokeProcedure).to.be.a('function');
    });

    it('should have a newConcepts function', function() {
        expect(LEM2.newConcepts).to.be.a('function');
    });

    it('should have a newAttributeValueBlocks function', function() {
        expect(LEM2.newAttributeValueBlocks).to.be.a('function');
    });

    it('should have a getCasesCoveredByRule function', function() {
        expect(LEM2.getCasesCoveredByRule).to.be.a('function');
    });

    it('should have a getCasesCoveredByRuleset function', function() {
        expect(LEM2.getCasesCoveredByRuleset).to.be.a('function');
    });

    it('should have a compressRuleset function', function() {
        expect(LEM2.compressRuleset).to.be.a('function');
    });

    it('should have an initialize function', function() {
        expect(LEM2.initialize).to.be.a('function');
    })

    it('should have a newRuleset function', function() {
        expect(LEM2.newRuleset).to.be.a('function');
    });

    it('should have a compressRule function', function() {
        expect(LEM2.compressRule).to.be.a('function');
    });

    it('should have an initializeProcedure function', function() {
        expect(LEM2.initializeProcedure).to.be.a('function');
    });

    it('should have a newGoalBlockIntersections function', function() {
        expect(LEM2.newGoalBlockIntersections).to.be.a('function');
    });
});
