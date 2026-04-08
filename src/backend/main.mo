import List "mo:core/List";
import Types "types/confessions";
import ConfessionsMixin "mixins/confessions-api";

actor {
  let confessions = List.empty<Types.Confession>();

  include ConfessionsMixin(confessions);
};
