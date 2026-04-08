import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Types "../types/confessions";
import ConfessionsLib "../lib/confessions";

mixin (
  confessions : List.List<Types.Confession>,
  comments : List.List<Types.Comment>,
) {
  // Seed sample confessions at init; nextConfessionId starts after the samples
  var nextConfessionId : Nat = ConfessionsLib.seedSamples(confessions, 0);
  var nextCommentId : Nat = 0;
  var owner : ?Principal = null;

  // Public: submit an anonymous confession (no caller stored)
  public shared func submitConfession(text : Text, tags : [Text]) : async Nat {
    let (confession, newId) = ConfessionsLib.submit(confessions, nextConfessionId, text, tags);
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
  public query ({ caller }) func getAllConfessions() : async [Types.Confession] {
    switch (owner) {
      case (?o) {
        if (caller != o) Runtime.trap("Unauthorized");
      };
      case null {};
    };
    ConfessionsLib.getAll(confessions);
  };

  // Owner only: permanently delete a confession
  public shared ({ caller }) func deleteConfession(id : Nat) : async Bool {
    switch (owner) {
      case (?o) {
        if (caller != o) Runtime.trap("Unauthorized");
      };
      case null {};
    };
    ConfessionsLib.delete(confessions, id);
  };

  // Owner only: toggle isHidden flag, returns new state
  public shared ({ caller }) func toggleHideConfession(id : Nat) : async Bool {
    switch (owner) {
      case (?o) {
        if (caller != o) Runtime.trap("Unauthorized");
      };
      case null {};
    };
    switch (ConfessionsLib.toggleHide(confessions, id)) {
      case (?hidden) hidden;
      case null Runtime.trap("Confession not found");
    };
  };

  // Owner claim — first caller becomes the owner
  public shared ({ caller }) func claimOwnership() : async Bool {
    switch (owner) {
      case (?_) false;
      case null {
        owner := ?caller;
        true;
      };
    };
  };

  // Public: analytics — count of non-hidden confessions per investment category
  public query func getTagAnalytics() : async [Types.TagAnalytic] {
    ConfessionsLib.getTagAnalytics(confessions);
  };

  // Public: add a reaction to a confession; returns updated reaction counts
  public shared func addReaction(confessionId : Nat, reaction : Types.Reaction) : async Types.ReactionCount {
    switch (ConfessionsLib.addReaction(confessions, confessionId, reaction)) {
      case (?rc) rc;
      case null Runtime.trap("Confession not found");
    };
  };

  // Public: get all comments for a confession
  public query func getComments(confessionId : Nat) : async [Types.Comment] {
    ConfessionsLib.getComments(comments, confessionId);
  };

  // Public: add an anonymous comment to a confession
  public shared func addComment(confessionId : Nat, text : Text) : async Types.Comment {
    switch (ConfessionsLib.addComment(confessions, comments, nextCommentId, confessionId, text)) {
      case (?(comment, newId)) {
        nextCommentId := newId;
        comment;
      };
      case null Runtime.trap("Confession not found");
    };
  };

  // Public: confession with the highest total reaction count
  public query func getConfessionOfDay() : async ?Types.Confession {
    ConfessionsLib.getConfessionOfDay(confessions);
  };

  // Public: top 5 non-hidden confessions by total reactions
  public query func getTrendingConfessions() : async [Types.Confession] {
    ConfessionsLib.getTrending(confessions);
  };
};
