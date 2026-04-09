import type { Confession } from "@/types";
import { formatShareText } from "@/utils/shareImage";

interface ShareCardCanvasProps {
  confession: Confession;
  id: string;
}

const REACTION_LABELS: Record<string, { emoji: string; label: string }> = {
  relatable: { emoji: "🤝", label: "Relatable" },
  crazy: { emoji: "🤯", label: "Crazy" },
  sad: { emoji: "😢", label: "Sad" },
  funny: { emoji: "😂", label: "Funny" },
};

/**
 * An off-screen DOM element rendered at fixed dimensions for html2canvas capture.
 * Positioned off-screen (left: -9999px) so it doesn't affect the layout.
 */
export function ShareCardCanvas({ confession, id }: ShareCardCanvasProps) {
  const { text, tags, reactions } = confession;
  const displayText = formatShareText(text);

  const reactionEntries = Object.entries(reactions).filter(
    ([, count]) => Number(count) > 0,
  );

  return (
    <div
      id={id}
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        top: 0,
        width: "600px",
        height: "auto",
        minHeight: "340px",
        background:
          "linear-gradient(145deg, #1e1a14 0%, #16120c 50%, #1a1710 100%)",
        border: "2px solid rgba(186, 145, 72, 0.45)",
        borderRadius: "16px",
        padding: "36px 40px 28px",
        fontFamily: "Lora, Georgia, serif",
        display: "flex",
        flexDirection: "column",
        gap: "0",
        overflow: "hidden",
        boxShadow:
          "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(186,145,72,0.15)",
      }}
    >
      {/* Gold accent top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background:
            "linear-gradient(90deg, #b8913a 0%, #e0c068 50%, #b8913a 100%)",
          borderRadius: "16px 16px 0 0",
        }}
      />

      {/* Header: brand mark */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "22px",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            fontFamily: "Lora, Georgia, serif",
            fontWeight: 600,
            color: "#c9a04a",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          gothicgarden
        </span>
        <span
          style={{
            width: "1px",
            height: "12px",
            background: "rgba(186,145,72,0.35)",
            display: "inline-block",
          }}
        />
        <span
          style={{
            fontSize: "11px",
            color: "rgba(220, 210, 195, 0.55)",
            fontFamily: "Satoshi, system-ui, sans-serif",
            letterSpacing: "0.04em",
          }}
        >
          investment therapy community
        </span>
      </div>

      {/* Confession text */}
      <p
        style={{
          fontSize: "20px",
          lineHeight: "1.65",
          color: "#eee8dc",
          fontFamily: "Lora, Georgia, serif",
          fontStyle: "italic",
          fontWeight: 400,
          margin: 0,
          flex: 1,
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
        }}
      >
        "{displayText}"
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            marginTop: "20px",
          }}
        >
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: "3px 10px",
                borderRadius: "999px",
                fontSize: "11px",
                fontWeight: 600,
                fontFamily: "Satoshi, system-ui, sans-serif",
                background: "rgba(72, 168, 186, 0.12)",
                color: "#70c8d8",
                border: "1px solid rgba(72, 168, 186, 0.3)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Reactions */}
      {reactionEntries.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "18px",
            flexWrap: "wrap",
          }}
        >
          {reactionEntries.map(([key, count]) => {
            const { emoji, label } = REACTION_LABELS[key] ?? {
              emoji: "👍",
              label: key,
            };
            return (
              <span
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                  color: "rgba(220, 210, 195, 0.7)",
                  fontFamily: "Satoshi, system-ui, sans-serif",
                }}
              >
                <span style={{ fontSize: "14px" }}>{emoji}</span>
                <span>
                  {Number(count)} {label}
                </span>
              </span>
            );
          })}
        </div>
      )}

      {/* Divider */}
      <div
        style={{
          height: "1px",
          background: "rgba(186,145,72,0.2)",
          margin: "20px 0 16px",
        }}
      />

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            color: "rgba(220, 210, 195, 0.4)",
            fontFamily: "Satoshi, system-ui, sans-serif",
          }}
        >
          Anonymous confession
        </span>
        <span
          style={{
            fontSize: "11px",
            color: "#c9a04a",
            fontFamily: "Satoshi, system-ui, sans-serif",
            letterSpacing: "0.05em",
          }}
        >
          gothicgarden.caffeine.xyz
        </span>
      </div>
    </div>
  );
}
