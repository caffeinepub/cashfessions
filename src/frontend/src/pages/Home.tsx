import { createActor } from "@/backend";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Lock,
  TrendingDown,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const TAGS = [
  { label: "Crypto", value: "crypto" },
  { label: "Stocks", value: "stocks" },
  { label: "Real Estate", value: "real estate" },
  { label: "Forex", value: "forex" },
  { label: "Money", value: "money" },
  { label: "Money & Relationships", value: "money and relationships" },
  { label: "School & Money", value: "school and money" },
  { label: "Dark Money Secrets", value: "dark money secrets" },
  { label: "Investing Losses", value: "investing losses" },
];

export default function Home() {
  const { actor } = useActor(createActor);
  const [text, setText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async ({ text, tags }: { text: string; tags: string[] }) => {
      if (!actor) throw new Error("Backend unavailable");
      return actor.submitConfession(text, tags);
    },
    onSuccess: () => {
      setSubmitted(true);
      setText("");
      setSelectedTags([]);
    },
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSubmit = () => {
    if (!text.trim()) return;
    setSubmitted(false);
    mutate({ text: text.trim(), tags: selectedTags });
  };

  const canSubmit = text.trim().length > 0 && !isPending;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero section */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-20 pb-12 overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-[300px] h-[200px] rounded-full bg-accent/5 blur-2xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full"
        >
          {/* Icon badge */}
          <div className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-card border border-border text-muted-foreground text-sm">
            <Lock className="w-3.5 h-3.5 text-accent" />
            <span>Fully anonymous — no identity stored</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4">
            What's your biggest{" "}
            <span className="text-primary">investment mistake?</span>
          </h1>

          <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed mb-10">
            Share anonymously — your identity is never stored. Help the investor
            community learn from real stories.
          </p>

          {/* Form card */}
          <div className="w-full bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-lg">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center gap-4 py-8"
                  data-ocid="submission-success"
                >
                  <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-accent" />
                  </div>
                  <div className="text-center">
                    <h2 className="font-display text-xl font-semibold text-foreground mb-1">
                      Confession submitted
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Your confession was submitted anonymously.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSubmitted(false)}
                    data-ocid="submit-another-btn"
                  >
                    Share another
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  {/* Text area */}
                  <div className="space-y-2">
                    <label
                      htmlFor="confession-text"
                      className="text-sm font-medium text-foreground flex items-center gap-1.5"
                    >
                      <TrendingDown className="w-4 h-4 text-primary" />
                      Your confession
                    </label>
                    <Textarea
                      id="confession-text"
                      placeholder="I put my life savings into meme coins because a Twitter influencer said it would 100x..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      rows={5}
                      className="resize-none bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 transition-smooth rounded-xl text-base leading-relaxed"
                      data-ocid="confession-textarea"
                    />
                  </div>

                  {/* Tag selector */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      Tag your confession{" "}
                      <span className="text-muted-foreground font-normal">
                        (optional)
                      </span>
                    </p>
                    <div
                      className="flex flex-wrap gap-2"
                      data-ocid="tag-selector"
                    >
                      {TAGS.map((tag) => {
                        const isSelected = selectedTags.includes(tag.value);
                        return (
                          <button
                            key={tag.value}
                            type="button"
                            onClick={() => toggleTag(tag.value)}
                            aria-pressed={isSelected}
                            data-ocid={`tag-${tag.value.replace(/\s+/g, "-")}`}
                            className={cn(
                              "px-4 py-1.5 rounded-full text-sm font-semibold border transition-smooth cursor-pointer",
                              isSelected
                                ? "bg-accent/20 border-accent/60 text-accent"
                                : "bg-background border-border text-muted-foreground hover:border-accent/40 hover:text-foreground",
                            )}
                          >
                            #{tag.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Error message */}
                  <AnimatePresence>
                    {isError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm"
                        data-ocid="submission-error"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>
                          {error instanceof Error
                            ? error.message
                            : "Failed to submit. Please try again."}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth rounded-xl shadow-md"
                    data-ocid="submit-confession-btn"
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting anonymously…
                      </span>
                    ) : (
                      "Submit anonymously"
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    No account needed. Your submission is completely anonymous.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* Stats / trust strip */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="py-8 border-t border-border bg-muted/30"
      >
        <div className="max-w-2xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-center">
          {[
            { label: "Investor community", value: "gothicgarden" },
            { label: "Zero identity stored", value: "100% Anonymous" },
            { label: "Stories shared", value: "& counting" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <span className="font-display text-lg font-semibold text-primary">
                {item.value}
              </span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
