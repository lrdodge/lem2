var LEM2;

LEM2 = {
    executeProcedure: function(concept) {
      if (concept.size === 4) {
        return {"ruleset":[{"conditions":[{"headache":"yes"}],"decision":{"flu":"yes"}},{"conditions":[{"temperature":"high","weakness":"yes"}],"decision":{"flu":"yes"}}]};
      }
      else {
        return {"ruleset":[{"conditions":[{"temperature":"normal","headache":"no"}],"decision":{"flu":"no"}},{"conditions":[{"headache":"no","weakness":"no"}],"decision":{"flu":"no"}}]};
      }
    }
};

module.exports = LEM2;
