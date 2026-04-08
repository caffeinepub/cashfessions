import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Types "../types/confessions";
import ConfessionsLib "../lib/confessions";

mixin (
  confessions : List.List<Types.Confession>,
) {
  // Seed sample confessions at init; nextConfessionId starts after the samples
  var nextConfessionId : Nat = ConfessionsLib.seedSamples(confessions, 0);
  var owner : ?Principal = null;

  // Public: submit an anonymous confession (no caller stored)
  public shared func submitConfession(text : Text, tags : [Text]) : async Nat {
    let (confession, newId) = ConfessionsLib.submit(confessions, nextConfessionId, text, tags);
    confessions.add(confession);
    nextConfessionId := newId;
    confession.id;
  };

  // Public: browse non-hidden confessions, newest first
  public query func getPublicConfessions() : async [Types.Confession] {
    ConfessionsLib.getPublic(confessions);
  };

  // Public: filter non-hidden confessions by tag
  public query func getConfessionsByTag(tag : Text) : async [Types.Confession] {
    ConfessionsLib.getByTag(confessions, tag);
  };

  // Owner only: all confessions including hidden
  public query ({ caller }) func getOwnerConfessions() : async [Types.Confession] {
    switch owner {
      case (?o) { assert caller == o };
      case null { assert false };
    };
    ConfessionsLib.getAll(confessions);
  };

  // Owner only: permanently delete a confession
  public shared ({ caller }) func deleteConfession(id : Nat) : async Bool {
    switch owner {
      case (?o) { assert caller == o };
      case null { assert false };
    };
    ConfessionsLib.delete(confessions, id);
  };

  // Owner only: toggle isHidden flag, returns new state
  public shared ({ caller }) func toggleHideConfession(id : Nat) : async Bool {
    switch owner {
      case (?o) { assert caller == o };
      case null { assert false };
    };
    switch (ConfessionsLib.toggleHide(confessions, id)) {
      case (?result) result;
      case null Runtime.trap("confession not found");
    };
  };

  // Owner claim — first caller becomes the owner
  public shared ({ caller }) func claimOwnership() : async Bool {
    switch owner {
      case (?_) false;
      case null {
        owner := ?caller;
        true;
      };
    };
  };
};
