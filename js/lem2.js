var LEM2;

LEM2 = {
    executeProcedure: function() {
      return {"ruleset":[{"conditions":[{"headache":"yes"}],"decision":{"flu":"yes"}},{"conditions":[{"temperature":"high"}],"decision":{"flu":"yes"}},{"conditions":[{"weakness":"yes"}],"decision":{"flu":"yes"}}]};
    }
};

module.exports = LEM2;
