import List "mo:core/List";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Types "../types/confessions";

module {
  public type Confession = Types.Confession;
  public type ConfessionId = Types.ConfessionId;
  public type Comment = Types.Comment;
  public type CommentId = Types.CommentId;
  public type Reaction = Types.Reaction;
  public type ReactionCount = Types.ReactionCount;
  public type TagAnalytic = Types.TagAnalytic;

  let CATEGORIES : [Text] = [
    "crypto",
    "stocks",
    "real estate",
    "forex",
    "money",
    "money and relationships",
    "school and money",
    "dark money secrets",
    "investing losses",
  ];

  let ZERO_REACTIONS : ReactionCount = { relatable = 0; crazy = 0; sad = 0; funny = 0 };

  public func totalReactions(r : ReactionCount) : Nat {
    r.relatable + r.crazy + r.sad + r.funny;
  };

  public func submit(
    confessions : List.List<Confession>,
    nextId : Nat,
    text : Text,
    tags : [Text],
  ) : (Confession, Nat) {
    let confession : Confession = {
      id = nextId;
      text;
      tags;
      timestamp = Time.now();
      isHidden = false;
      reactions = ZERO_REACTIONS;
      commentCount = 0;
    };
    confessions.add(confession);
    (confession, nextId + 1);
  };

  // Returns non-hidden confessions sorted most recent first
  public func getPublic(confessions : List.List<Confession>) : [Confession] {
    let visible = confessions.filter(func(c) { not c.isHidden });
    let arr = visible.toArray();
    arr.sort(func(a, b) { Int.compare(b.timestamp, a.timestamp) });
  };

  // Returns non-hidden confessions matching tag, most recent first
  public func getByTag(confessions : List.List<Confession>, tag : Text) : [Confession] {
    let filtered = confessions.filter(func(c) {
      not c.isHidden and c.tags.find(func t { t == tag }) != null
    });
    let arr = filtered.toArray();
    arr.sort(func(a, b) { Int.compare(b.timestamp, a.timestamp) });
  };

  // Returns all confessions (including hidden), most recent first
  public func getAll(confessions : List.List<Confession>) : [Confession] {
    let arr = confessions.toArray();
    arr.sort(func(a, b) { Int.compare(b.timestamp, a.timestamp) });
  };

  // Permanently removes confession by id; returns true if found and removed
  public func delete(confessions : List.List<Confession>, id : ConfessionId) : Bool {
    let found = confessions.find(func(c) { c.id == id }) != null;
    if (not found) return false;
    // Rebuild list by filtering out the target id
    let remaining = confessions.filter(func(c) { c.id != id });
    confessions.clear();
    confessions.append(remaining);
    true;
  };

  // Toggles isHidden on confession by id; returns new isHidden value or null if not found
  public func toggleHide(confessions : List.List<Confession>, id : ConfessionId) : ?Bool {
    var result : ?Bool = null;
    confessions.mapInPlace(func(c) {
      if (c.id == id) {
        let newHidden = not c.isHidden;
        result := ?newHidden;
        { c with isHidden = newHidden };
      } else c
    });
    result;
  };

  // Adds a reaction to a confession; returns the updated ReactionCount or null if not found
  public func addReaction(
    confessions : List.List<Confession>,
    id : ConfessionId,
    reaction : Reaction,
  ) : ?ReactionCount {
    var result : ?ReactionCount = null;
    confessions.mapInPlace(func(c) {
      if (c.id == id) {
        let newReactions : ReactionCount = switch (reaction) {
          case (#Relatable) { { c.reactions with relatable = c.reactions.relatable + 1 } };
          case (#Crazy)     { { c.reactions with crazy = c.reactions.crazy + 1 } };
          case (#Sad)       { { c.reactions with sad = c.reactions.sad + 1 } };
          case (#Funny)     { { c.reactions with funny = c.reactions.funny + 1 } };
        };
        result := ?newReactions;
        { c with reactions = newReactions };
      } else c
    });
    result;
  };

  // Adds a comment to the comments list; increments commentCount on the confession
  public func addComment(
    confessions : List.List<Confession>,
    comments : List.List<Comment>,
    nextId : Nat,
    confessionId : ConfessionId,
    text : Text,
  ) : ?(Comment, Nat) {
    switch (confessions.find(func(c) { c.id == confessionId })) {
      case null null;
      case (?_) {
        confessions.mapInPlace(func(c) {
          if (c.id == confessionId) { { c with commentCount = c.commentCount + 1 } } else c
        });
        let comment : Comment = {
          id = nextId;
          confessionId;
          text;
          timestamp = Time.now();
        };
        comments.add(comment);
        ?(comment, nextId + 1);
      };
    };
  };

  // Returns all comments for a given confessionId
  public func getComments(
    comments : List.List<Comment>,
    confessionId : ConfessionId,
  ) : [Comment] {
    comments.filter(func(c) { c.confessionId == confessionId }).toArray();
  };

  // Returns the confession with the highest total reaction count, or null if empty
  public func getConfessionOfDay(confessions : List.List<Confession>) : ?Confession {
    let visible = confessions.filter(func(c) { not c.isHidden });
    visible.max(func(a, b) {
      let ta = totalReactions(a.reactions);
      let tb = totalReactions(b.reactions);
      Nat.compare(ta, tb);
    });
  };

  // Returns top 5 non-hidden confessions by total reactions, descending
  public func getTrending(confessions : List.List<Confession>) : [Confession] {
    let visible = confessions.filter(func(c) { not c.isHidden });
    let arr = visible.toArray();
    let sorted = arr.sort(func(a, b) {
      let ta = totalReactions(a.reactions);
      let tb = totalReactions(b.reactions);
      Nat.compare(tb, ta);
    });
    if (sorted.size() <= 5) sorted
    else sorted.sliceToArray(0, 5);
  };

  // Returns count of non-hidden confessions per investment category tag
  public func getTagAnalytics(confessions : List.List<Confession>) : [TagAnalytic] {
    let visible = confessions.filter(func(c) { not c.isHidden });
    CATEGORIES.map<Text, TagAnalytic>(func(cat) {
      let count = visible.foldLeft(0, func(acc, c) {
        if (c.tags.find(func t { t == cat }) != null) acc + 1 else acc
      });
      { tag = cat; count };
    });
  };

  // Seed sample confessions; returns next available id after seeding
  public func seedSamples(confessions : List.List<Confession>, startId : Nat) : Nat {
    if (confessions.size() > 0) return startId;

    let samples : [(Text, [Text], ReactionCount)] = [
      (
        "Threw my entire savings into Dogecoin after Elon tweeted about it. Lost 80% in two weeks. Still haven't told my wife.",
        ["crypto"],
        { relatable = 42; crazy = 31; sad = 15; funny = 8 },
      ),
      (
        "Bought a rental property at peak market, couldn't find tenants, and ended up selling at a $40k loss six months later.",
        ["real estate"],
        { relatable = 28; crazy = 12; sad = 35; funny = 3 },
      ),
      (
        "Got a margin call on my forex trades at 3am. Had to wire money from my emergency fund to cover it. Never again.",
        ["forex"],
        { relatable = 19; crazy = 22; sad = 27; funny = 6 },
      ),
      (
        "Used student loan money to buy meme stocks during the GameStop craze. Told my parents it was for textbooks.",
        ["stocks", "school and money"],
        { relatable = 55; crazy = 48; sad = 12; funny = 20 },
      ),
      (
        "My partner found out I lost $15k in crypto by checking our joint account. That conversation destroyed our relationship.",
        ["crypto", "money and relationships"],
        { relatable = 33; crazy = 10; sad = 50; funny = 2 },
      ),
      (
        "I have a separate bank account my spouse doesn't know about. I've been secretly trying to recover my trading losses for two years.",
        ["dark money secrets", "money and relationships"],
        { relatable = 25; crazy = 18; sad = 40; funny = 1 },
      ),
      (
        "Convinced my parents to invest their retirement savings in a coin my 'research' said would 10x. It went to zero.",
        ["crypto", "money"],
        { relatable = 8; crazy = 45; sad = 60; funny = 0 },
      ),
      (
        "Lost $3k in a week trying to day-trade tech stocks. Told myself I just needed one more try to break even. Lost another $2k.",
        ["stocks", "investing losses"],
        { relatable = 65; crazy = 20; sad = 18; funny = 12 },
      ),
      (
        "Put my emergency fund into a 'sure thing' altcoin. Got sick the same month, had no money for medical bills.",
        ["crypto", "investing losses"],
        { relatable = 38; crazy = 15; sad = 55; funny = 4 },
      ),
    ];

    var id = startId;
    let baseTime = Time.now();
    var offset : Int = 0;

    for ((text, tags, reactions) in samples.vals()) {
      let confession : Confession = {
        id;
        text;
        tags;
        timestamp = baseTime - offset * 86_400_000_000_000;
        isHidden = false;
        reactions;
        commentCount = 0;
      };
      confessions.add(confession);
      id += 1;
      offset += 1;
    };

    id;
  };
};
