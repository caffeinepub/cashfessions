import { Reaction, createActor } from "@/backend";
import { ShareCardCanvas } from "@/components/ShareCardCanvas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Comment, Confession } from "@/types";
import {
  buildSocialCaption,
  downloadImage,
  generateConfessionImage,
} from "@/utils/shareImage";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  EyeOff,
  Loader2,
  MessageCircle,
  Send,
  Trash2,
} from "lucide-react";
import { useCallback, useId, useState } from "react";
import { toast } from "sonner";

interface ConfessionCardProps {
  confession: Confession;
  isOwner?: boolean;
  onDelete?: (id: bigint) => void;
  onToggleHide?: (id: bigint) => void;
  compact?: boolean;
  badge?: React.ReactNode;
}

const REACTIONS: {
  key: keyof Confession["reactions"];
  emoji: string;
  label: string;
  variant: Reaction;
}[] = [
  {
    key: "relatable",
    emoji: "🤝",
    label: "Relatable",
    variant: Reaction.Relatable,
  },
  { key: "crazy", emoji: "🤯", label: "Crazy", variant: Reaction.Crazy },
  { key: "sad", emoji: "😢", label: "Sad", variant: Reaction.Sad },
  { key: "funny", emoji: "😂", label: "Funny", variant: Reaction.Funny },
];

function getConfessionUrl(confessionId: bigint): string {
  const base =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "";
  return `${base}/feed?confession=${confessionId.toString()}`;
}

type SharePlatform = "twitter" | "linkedin" | "whatsapp";

export function ConfessionCard({
  confession,
  isOwner = false,
  onDelete,
  onToggleHide,
  compact = false,
  badge,
}: ConfessionCardProps) {
  const { id, text, tags, timestamp, isHidden, reactions, commentCount } =
    confession;
  const relativeTime = formatRelativeTime(timestamp);
  const [copied, setCopied] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [shareLoading, setShareLoading] = useState<SharePlatform | null>(null);
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const isMobile = useIsMobile(640);

  // Stable unique ID for the off-screen share card element
  const cardId = useId().replace(/:/g, "-");
  const shareCardId = `share-card-${cardId}`;

  // Reactions mutation
  const reactionMutation = useMutation({
    mutationFn: async (reaction: Reaction) => {
      if (!actor) throw new Error("Backend unavailable");
      return actor.addReaction(id, reaction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public-confessions"] });
      queryClient.invalidateQueries({ queryKey: ["all-confessions"] });
      queryClient.invalidateQueries({ queryKey: ["confession-of-day"] });
      queryClient.invalidateQueries({ queryKey: ["trending-confessions"] });
    },
  });

  // Comments query — only fetch when expanded
  const { data: comments = [], isLoading: commentsLoading } = useQuery<
    Comment[]
  >({
    queryKey: ["comments", String(id)],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getComments(id);
    },
    enabled: showComments && !!actor,
  });

  // Add comment mutation
  const commentMutation = useMutation({
    mutationFn: async (commentBody: string) => {
      if (!actor) throw new Error("Backend unavailable");
      return actor.addComment(id, commentBody);
    },
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["comments", String(id)] });
      queryClient.invalidateQueries({ queryKey: ["public-confessions"] });
      toast.success("Comment posted anonymously!", { duration: 3000 });
    },
  });

  function handleCopyLink() {
    const url = getConfessionUrl(id);
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success("Link copied!", { duration: 3000 });
      setTimeout(() => setCopied(false), 2500);
    });
  }

  const handleShare = useCallback(
    async (platform: SharePlatform) => {
      if (shareLoading) return;
      setShareLoading(platform);
      try {
        const dataUrl = await generateConfessionImage(shareCardId);
        downloadImage(dataUrl, `gothicgarden-confession-${String(id)}.png`);
        const confessionUrl = getConfessionUrl(id);
        const caption = buildSocialCaption(confessionUrl, { text, tags });

        if (platform === "twitter") {
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}`,
            "_blank",
            "noopener,noreferrer",
          );
        } else if (platform === "linkedin") {
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(confessionUrl)}`,
            "_blank",
            "noopener,noreferrer",
          );
        } else {
          window.open(
            `https://wa.me/?text=${encodeURIComponent(caption)}`,
            "_blank",
            "noopener,noreferrer",
          );
        }
      } catch (_err) {
        toast.error("Couldn't generate card image.", { duration: 4000 });
      } finally {
        setShareLoading(null);
      }
    },
    [shareCardId, shareLoading, id, text, tags],
  );

  function handleSubmitComment() {
    const trimmed = commentText.trim();
    if (!trimmed) return;
    commentMutation.mutate(trimmed);
  }

  const totalReactions =
    Number(reactions.relatable) +
    Number(reactions.crazy) +
    Number(reactions.sad) +
    Number(reactions.funny);

  const isSharing = shareLoading !== null;

  return (
    <>
      {/* Off-screen share card — captured by html2canvas */}
      <ShareCardCanvas confession={confession} id={shareCardId} />

      <article
        className={cn(
          "card-elevated flex flex-col gap-0 transition-smooth overflow-hidden",
          isHidden && "opacity-60",
        )}
        data-ocid="confession-card"
      >
        {/* Badge slot (Confession of the Day / Trending) */}
        {badge && <div className="px-4 pt-4 pb-0">{badge}</div>}

        {/* Confession text */}
        <div className={cn("px-4", badge ? "pt-3" : "pt-4", "pb-0")}>
          <p
            className={cn(
              "font-display leading-snug text-foreground",
              compact ? "text-base line-clamp-4" : "text-lg",
            )}
          >
            {text}
          </p>
        </div>

        {/* Tags row */}
        {tags.length > 0 && (
          <div
            className="flex flex-wrap gap-1.5 px-4 pt-3"
            data-ocid="confession-tags"
          >
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/30"
              >
                #{tag.toUpperCase()}
              </span>
            ))}
          </div>
        )}

        {/* Reactions row — 2-column grid on very small screens */}
        <div
          className={cn(
            "px-4 pt-3 pb-0",
            isMobile
              ? "grid grid-cols-2 gap-2"
              : "flex items-center gap-1 flex-wrap",
          )}
          data-ocid="confession-reactions"
        >
          {REACTIONS.map(({ key, emoji, label, variant }) => {
            const count = Number(reactions[key]);
            return (
              <button
                key={key}
                type="button"
                onClick={() => reactionMutation.mutate(variant)}
                disabled={reactionMutation.isPending}
                aria-label={`React with ${label}`}
                data-ocid={`reaction-${key}`}
                className={cn(
                  "flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full text-xs font-semibold border transition-smooth",
                  "bg-muted/40 border-border/50 text-muted-foreground",
                  "hover:bg-accent/10 hover:border-accent/40 hover:text-accent",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "min-h-[44px]",
                  count > 0 && "border-accent/30 text-accent bg-accent/5",
                )}
              >
                <span className="text-sm leading-none">{emoji}</span>
                <span className="tabular-nums">
                  {count > 0 ? count : label}
                </span>
              </button>
            );
          })}
          {!isMobile && totalReactions > 0 && (
            <span className="ml-auto text-[11px] text-muted-foreground tabular-nums">
              {totalReactions} reaction{totalReactions !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Total reactions count on mobile (below the grid) */}
        {isMobile && totalReactions > 0 && (
          <div className="px-4 pt-1">
            <span className="text-[11px] text-muted-foreground tabular-nums">
              {totalReactions} reaction{totalReactions !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Footer: timestamp + controls */}
        <div className="flex items-center justify-between px-4 pt-3 pb-0 border-t border-border/40 mt-3">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{relativeTime}</span>
            {isHidden && (
              <Badge
                variant="outline"
                className="ml-1 text-[10px] py-0 px-1.5 text-muted-foreground"
              >
                Hidden
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Comment toggle — min 44x44px */}
            <button
              type="button"
              onClick={() => setShowComments((v) => !v)}
              aria-expanded={showComments}
              aria-label="Toggle comments"
              data-ocid="confession-comments-toggle"
              className="flex items-center gap-1 px-3 py-2.5 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 min-h-[44px] min-w-[44px] justify-center"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="tabular-nums">{Number(commentCount)}</span>
              {showComments ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>

            {isOwner && (
              <div
                className="flex items-center gap-1"
                data-ocid="confession-actions"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 text-muted-foreground hover:text-foreground"
                  aria-label={isHidden ? "Show confession" : "Hide confession"}
                  onClick={() => onToggleHide?.(id)}
                  data-ocid="confession-toggle-hide"
                >
                  <EyeOff className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 text-muted-foreground hover:text-destructive"
                  aria-label="Delete confession"
                  onClick={() => onDelete?.(id)}
                  data-ocid="confession-delete"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Share row — direct platform buttons */}
        <div
          className="flex items-center gap-1 px-4 py-2 border-t border-border/30 mt-2 flex-wrap"
          data-ocid="confession-share"
        >
          {/* Twitter/X */}
          <button
            type="button"
            onClick={() => handleShare("twitter")}
            disabled={isSharing}
            aria-label="Share on X / Twitter"
            data-ocid="share-twitter"
            className={cn(
              "flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold border transition-colors duration-200 min-h-[44px]",
              "bg-muted/30 border-border/40 text-muted-foreground hover:text-foreground hover:bg-muted/60",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            {shareLoading === "twitter" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 fill-current shrink-0"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.859L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
              </svg>
            )}
            X
          </button>

          {/* LinkedIn */}
          <button
            type="button"
            onClick={() => handleShare("linkedin")}
            disabled={isSharing}
            aria-label="Share on LinkedIn"
            data-ocid="share-linkedin"
            className={cn(
              "flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold border transition-colors duration-200 min-h-[44px]",
              "bg-muted/30 border-border/40 text-muted-foreground hover:text-foreground hover:bg-muted/60",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            {shareLoading === "linkedin" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 fill-current shrink-0"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            )}
            LinkedIn
          </button>

          {/* WhatsApp */}
          <button
            type="button"
            onClick={() => handleShare("whatsapp")}
            disabled={isSharing}
            aria-label="Share on WhatsApp"
            data-ocid="share-whatsapp"
            className={cn(
              "flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold border transition-colors duration-200 min-h-[44px]",
              "bg-muted/30 border-[rgba(37,211,102,0.25)] text-muted-foreground hover:text-foreground hover:bg-muted/60",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            {shareLoading === "whatsapp" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 fill-current shrink-0"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            )}
            WhatsApp
          </button>

          {/* Copy link */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-11 w-11 ml-auto transition-colors duration-200",
              copied
                ? "text-accent"
                : "text-muted-foreground hover:text-primary",
            )}
            aria-label="Copy link"
            onClick={handleCopyLink}
            data-ocid="share-copy"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>

        {/* Comments section (collapsible) */}
        {showComments && (
          <div
            className="border-t border-border/40 px-4 py-4 bg-muted/20 flex flex-col gap-3"
            data-ocid="confession-comments"
          >
            {commentsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-muted-foreground text-xs text-center py-2">
                No comments yet. Be the first to react anonymously.
              </p>
            ) : (
              <div
                className="space-y-2 max-h-64 overflow-y-auto pr-1"
                data-ocid="comments-list"
              >
                {comments.map((c) => (
                  <div
                    key={String(c.id)}
                    className="flex flex-col gap-0.5 bg-card border border-border/50 rounded-lg px-3 py-2"
                    data-ocid="comment-item"
                  >
                    <p className="text-sm text-foreground leading-snug">
                      {c.text}
                    </p>
                    <span className="text-[11px] text-muted-foreground">
                      {formatRelativeTime(c.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Add comment input */}
            <div className="flex gap-2 items-end" data-ocid="comment-form">
              <Textarea
                placeholder="Add an anonymous comment…"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={2}
                className="resize-none bg-background border-border text-foreground placeholder:text-muted-foreground text-base rounded-lg flex-1"
                style={{ fontSize: "16px" }}
                data-ocid="comment-input"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitComment();
                  }
                }}
              />
              <Button
                size="icon"
                onClick={handleSubmitComment}
                disabled={!commentText.trim() || commentMutation.isPending}
                aria-label="Post comment"
                data-ocid="comment-submit"
                className="h-11 w-11 shrink-0"
              >
                {commentMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </article>
    </>
  );
}
