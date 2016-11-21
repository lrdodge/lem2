var LEM2;

LEM2 = {
    executeProcedure: function(concept, dataSet) {
      // TODO: Refactor
      if (concept.has(1) && concept.has(2) && concept.has(4) && concept.has(5)) {
        return {"ruleset":[{"conditions":[{"headache":"yes"}],"decision":{"flu":"yes"}},{"conditions":[{"temperature":"high","weakness":"yes"}],"decision":{"flu":"yes"}}]};
      }

      if (concept.has(3) && concept.has(6) && concept.has(7)) {
          return {"ruleset":[{"conditions":[{"temperature":"normal","headache":"no"}],"decision":{"flu":"no"}},{"conditions":[{"headache":"no","weakness":"no"}],"decision":{"flu":"no"}}]};
      }

      if (concept.has(1) && concept.has(2) && concept.has(4)) {
        return {"ruleset":[{"conditions":[{"headache":"yes","temperature":"high"}],"decision":{"flu":"yes"}},{"conditions":[{"temperature":"very_high"}],"decision":{"flu":"yes"}}]};
      }

      if (concept.has(3) && concept.has(5) && concept.has(6)) {
        return {"ruleset":[{"conditions":[{"headache":"no"}],"decision":{"flu":"no"}},{"conditions":[{"temperature":"normal"}],"decision":{"flu":"no"}}]};
      }
    },

    reduceRuleset: function() {
      
    }
};

module.exports = LEM2;
