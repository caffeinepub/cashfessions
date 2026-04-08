import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Confession } from "@/types";
import { Clock, EyeOff, Trash2 } from "lucide-react";

interface ConfessionCardProps {
  confession: Confession;
  /** Show owner controls (delete / toggle hide) */
  isOwner?: boolean;
  onDelete?: (id: bigint) => void;
  onToggleHide?: (id: bigint) => void;
  /** Compact mode for grid layout */
  compact?: boolean;
}

export function ConfessionCard({
  confession,
  isOwner = false,
  onDelete,
  onToggleHide,
  compact = false,
}: ConfessionCardProps) {
  const { id, text, tags, timestamp, isHidden } = confession;
  const relativeTime = formatRelativeTime(timestamp);

  return (
    <article
      className={cn(
        "card-elevated flex flex-col gap-3 transition-smooth",
        compact ? "p-4" : "p-5",
        isHidden && "opacity-60",
      )}
      data-ocid="confession-card"
    >
      {/* Confession text */}
      <p
        className={cn(
          "font-display leading-snug text-foreground",
          compact ? "text-base line-clamp-4" : "text-lg",
        )}
      >
        {text}
      </p>

      {/* Tags row */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5" data-ocid="confession-tags">
          {tags.map((tag) => (
            <span key={tag} className="tag-badge">
              #{tag.toUpperCase()}
            </span>
          ))}
        </div>
      )}

      {/* Footer: timestamp + controls */}
      <div className="flex items-center justify-between mt-auto pt-1 border-t border-border/50">
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

        {isOwner && (
          <div
            className="flex items-center gap-1"
            data-ocid="confession-actions"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              aria-label={isHidden ? "Show confession" : "Hide confession"}
              onClick={() => onToggleHide?.(id)}
              data-ocid="confession-toggle-hide"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              aria-label="Delete confession"
              onClick={() => onDelete?.(id)}
              data-ocid="confession-delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
