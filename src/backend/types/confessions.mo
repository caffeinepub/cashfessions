module {
  public type ConfessionId = Nat;
  public type CommentId = Nat;

  public type Reaction = {
    #Relatable;
    #Crazy;
    #Sad;
    #Funny;
  };

  public type ReactionCount = {
    relatable : Nat;
    crazy : Nat;
    sad : Nat;
    funny : Nat;
  };

  public type Confession = {
    id : ConfessionId;
    text : Text;
    tags : [Text];
    timestamp : Int;
    isHidden : Bool;
    reactions : ReactionCount;
    commentCount : Nat;
  };

  public type Comment = {
    id : CommentId;
    confessionId : ConfessionId;
    text : Text;
    timestamp : Int;
  };

  public type TagAnalytic = {
    tag : Text;
    count : Nat;
  };
};
