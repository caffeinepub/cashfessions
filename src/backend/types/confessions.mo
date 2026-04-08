module {
  public type ConfessionId = Nat;

  public type Confession = {
    id : ConfessionId;
    text : Text;
    tags : [Text];
    timestamp : Int;
    isHidden : Bool;
  };
};
