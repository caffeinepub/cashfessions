import List "mo:core/List";
import NewTypes "types/confessions";

module {
  // Old types defined inline (copied from .old/src/backend/types/confessions.mo)
  type OldConfessionId = Nat;
  type OldConfession = {
    id : OldConfessionId;
    text : Text;
    tags : [Text];
    timestamp : Int;
    isHidden : Bool;
  };

  type OldActor = {
    confessions : List.List<OldConfession>;
  };

  type NewActor = {
    confessions : List.List<NewTypes.Confession>;
    comments : List.List<NewTypes.Comment>;
  };

  public func run(old : OldActor) : NewActor {
    let zeroReactions : NewTypes.ReactionCount = {
      relatable = 0;
      crazy = 0;
      sad = 0;
      funny = 0;
    };
    let confessions = old.confessions.map<OldConfession, NewTypes.Confession>(
      func(c) {
        {
          c with
          reactions = zeroReactions;
          commentCount = 0;
        }
      }
    );
    let comments = List.empty<NewTypes.Comment>();
    { confessions; comments };
  };
};
