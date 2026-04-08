import List "mo:core/List";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Types "../types/confessions";

module {
  public type Confession = Types.Confession;
  public type ConfessionId = Types.ConfessionId;

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
    };
    (confession, nextId + 1);
  };

  // Returns non-hidden confessions sorted most recent first
  public func getPublic(confessions : List.List<Confession>) : [Confession] {
    let visible = confessions.filter(func(c) { not c.isHidden });
    let sorted = visible.sort(func(a, b) { Int.compare(b.timestamp, a.timestamp) });
    sorted.toArray();
  };

  // Returns non-hidden confessions matching tag, most recent first
  public func getByTag(confessions : List.List<Confession>, tag : Text) : [Confession] {
    let matching = confessions.filter(func(c) {
      if (c.isHidden) return false;
      c.tags.find(func(t) { t == tag }) != null;
    });
    let sorted = matching.sort(func(a, b) { Int.compare(b.timestamp, a.timestamp) });
    sorted.toArray();
  };

  // Returns all confessions (including hidden), most recent first
  public func getAll(confessions : List.List<Confession>) : [Confession] {
    let sorted = confessions.sort(func(a, b) { Int.compare(b.timestamp, a.timestamp) });
    sorted.toArray();
  };

  // Permanently removes confession by id; returns true if found and removed
  public func delete(confessions : List.List<Confession>, id : ConfessionId) : Bool {
    let sizeBefore = confessions.size();
    let filtered = confessions.filter(func(c) { c.id != id });
    confessions.clear();
    confessions.append(filtered);
    confessions.size() < sizeBefore;
  };

  // Toggles isHidden on confession by id; returns new isHidden value or null if not found
  public func toggleHide(confessions : List.List<Confession>, id : ConfessionId) : ?Bool {
    var result : ?Bool = null;
    confessions.mapInPlace(func(c) {
      if (c.id == id) {
        let newHidden = not c.isHidden;
        result := ?newHidden;
        { c with isHidden = newHidden };
      } else c;
    });
    result;
  };

  // Seed sample confessions; returns next available id after seeding
  public func seedSamples(confessions : List.List<Confession>, startId : Nat) : Nat {
    let samples : [(Text, [Text])] = [
      (
        "Bought $50k of LUNA at $80 thinking it was 'digital gold'. Watched it go to zero in 72 hours. The worst part? I told my whole family to buy too.",
        ["crypto"],
      ),
      (
        "Panic-sold all my Amazon shares in March 2020 at the bottom of the COVID crash. Lost $30k in realized losses and missed a 300% recovery. Lesson learned: never trade on fear.",
        ["stocks"],
      ),
      (
        "Invested my entire emergency fund into a 'can't miss' real estate deal from a guy I met at a conference. The project collapsed and I spent 8 months without a safety net.",
        ["real estate"],
      ),
      (
        "Went 10x leveraged long on EUR/USD before a surprise ECB announcement. Margin called out of $15k overnight. Always respect the news calendar.",
        ["forex"],
      ),
      (
        "Bought GameStop at $400 during the short squeeze hype. Held all the way down to $12 because I was 'diamond hands.' Down 97%. At least I have a great story.",
        ["stocks"],
      ),
    ];

    let baseTime = Time.now();
    let oneDayNs : Int = 86_400_000_000_000;
    var id = startId;
    var i = 0;

    for ((text, tags) in samples.values()) {
      let confession : Confession = {
        id;
        text;
        tags;
        timestamp = baseTime - (Int.fromNat(i) * oneDayNs);
        isHidden = false;
      };
      confessions.add(confession);
      id += 1;
      i += 1;
    };
    id;
  };
};
