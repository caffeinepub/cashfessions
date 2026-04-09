import List "mo:core/List";
import Types "types/confessions";
import ConfessionsMixin "mixins/confessions-api";



actor {
  let confessions = List.empty<Types.Confession>();
  let comments = List.empty<Types.Comment>();

  include ConfessionsMixin(confessions, comments);
};
