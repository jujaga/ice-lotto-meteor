Template.tierRow.rendered = function() {
   $("[data-toggle='tooltip']").tooltip();
};

Template.tierRow.helpers({
  prizeLoop: function (prizes) {
    var tierId = this._id;
    var prizeList = [];
    var i = 1;
    var sortedPrizes = _.sortBy(prizes, function(p) {return p.pos;});

    // fill unused spaces with empty prizes
    // TODO make better
    _.each(sortedPrizes, function (p) {
      while (p.pos > i) {
        prizeList.push({_id: Random.id(), pos: i, prize: null, tierId: tierId});
        i++;
      }
      prizeList.push(_.extend({}, p, {tierId: tierId}));
      i++;
    });
    while (i < 11) {
      prizeList.push({_id: Random.id(), pos: i, prize: null, tierId: tierId});
      i++;
    }
    return prizeList;
  },
  isLottoOpen: function() {
    return !Lottos.findOne().closed;
  },
  attributes: function() {
    if (!!this.winner) {
      return { class: "winner" };
    }
    return {};
  },
  whichever: function(name1, name2) {
    if (!!name1) return name1;
    return name2;
  },
  winnerName: function() {
    var winnerPrize = _.find(this.prizes, function(p) {return !!p.winner;});
    if (winnerPrize) {
      var that = this;
      var entry = _.find(Lottos.findOne().entries, function(e) { return e.amount === that.tier && e.winner;});
      return GWUsers.findOne(entry.gwuserId).alts[0];
    }
  },
  winnerItem: function() {
    var winnerPrize = _.find(this.prizes, function(p) {return !!p.winner;});
    if (winnerPrize) {
      return winnerPrize.name;
    }
  }
});

Template.tierRow.events({
  'click .tier-number': function (e) {
    e.preventDefault();
    if (Session.equals('SelectedTier', this.tier)) {
      Session.set('SelectedTier', null);
    }
    else {
      Session.set('SelectedTier', this.tier);
    }
  },
  'click .prize-row > td': function (e) {
    e.preventDefault();
    if (Session.equals('SelectedPrize', this._id)) {
      Session.set('SelectedPrize', null);
    }
    else {
      Session.set('SelectedPrize', this._id);
    }
  }
});
