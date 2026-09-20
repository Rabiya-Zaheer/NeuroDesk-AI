"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { GraduationCap, RotateCcw, ChevronLeft, ChevronRight, Trash2, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  generateFlashcards,
  toggleFlashcardKnown,
  deleteFlashcard,
  addReading,
  updateReadingProgress,
  deleteReading,
  type FlashcardItem,
  type ReadingItem,
} from "@/features/workspace/study-actions";

export function StudyAssistantView({
  workspaceId,
  workspaceName,
  initialFlashcards,
  initialReadings,
}: {
  workspaceId: string;
  workspaceName: string;
  initialFlashcards: FlashcardItem[];
  initialReadings: ReadingItem[];
}) {
  const [cards, setCards] = useState(initialFlashcards);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [topic, setTopic] = useState("");
  const [genError, setGenError] = useState<string | null>(null);
  const [isGenerating, startGenerating] = useTransition();
  const [, startTransition] = useTransition();

  const [readings, setReadings] = useState(initialReadings);
  const [readingTitle, setReadingTitle] = useState("");
  const [readingUrl, setReadingUrl] = useState("");

  const currentCard = cards[cardIndex];

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setGenError(null);
    const insertAt = cards.length;
    startGenerating(async () => {
      const result = await generateFlashcards(workspaceId, topic);
      if (!result.ok) {
        setGenError(result.error);
        return;
      }
      setCards((prev) => [...prev, ...result.cards]);
      setCardIndex(insertAt);
      setFlipped(false);
      setTopic("");
      toast.success(`${result.cards.length} flashcards added`);
    });
  };

  const handleMarkKnown = (known: boolean) => {
    if (!currentCard) return;
    const id = currentCard.id;
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, known } : c)));
    startTransition(() => {
      void toggleFlashcardKnown(id, known);
    });
  };

  const handleDeleteCard = () => {
    if (!currentCard) return;
    const id = currentCard.id;
    setCards((prev) => prev.filter((c) => c.id !== id));
    setCardIndex((i) => Math.max(0, Math.min(i, cards.length - 2)));
    setFlipped(false);
    startTransition(() => {
      void deleteFlashcard(id);
    });
  };

  const handleAddReading = () => {
    if (!readingTitle.trim()) return;
    const tempId = `temp-${Date.now()}`;
    setReadings((prev) => [
      { id: tempId, title: readingTitle, url: readingUrl || undefined, progress: 0 },
      ...prev,
    ]);
    const title = readingTitle;
    const url = readingUrl;
    setReadingTitle("");
    setReadingUrl("");

    startTransition(async () => {
      const result = await addReading(workspaceId, title, url);
      if (!result.ok) {
        toast.error("Couldn't add reading", { description: result.error });
        setReadings((prev) => prev.filter((r) => r.id !== tempId));
      }
    });
  };

  const handleProgressChange = (id: string, progress: number) => {
    setReadings((prev) => prev.map((r) => (r.id === id ? { ...r, progress } : r)));
  };

  const handleProgressCommit = (id: string, progress: number) => {
    startTransition(() => {
      void updateReadingProgress(id, progress);
    });
  };

  const handleDeleteReading = (id: string) => {
    setReadings((prev) => prev.filter((r) => r.id !== id));
    startTransition(() => {
      void deleteReading(id);
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-2xl bg-(--color-accent-soft) text-(--color-accent)">
          <GraduationCap className="size-4.5" />
        </span>
        <div>
          <p className="font-(family-name:--font-display) text-xl font-bold text-(--color-ink)">
            Study Assistant
          </p>
          <p className="text-sm text-(--color-ink-muted)">Flashcards and reading progress for {workspaceName}</p>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-(--color-ink-faint)">
          Flashcards
        </h2>

        <div className="mb-3 flex gap-2">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Paste a topic or some text to turn into flashcards..."
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />
          <Button size="sm" onClick={handleGenerate} disabled={isGenerating || !topic.trim()}>
            {isGenerating ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
            Generate
          </Button>
        </div>
        {genError && <p className="mb-3 text-xs text-red-600">{genError}</p>}

        {cards.length === 0 ? (
          <div className="rounded-(--radius-card) border border-dashed border-(--color-border) bg-(--color-surface) px-6 py-10 text-center">
            <p className="text-sm text-(--color-ink-muted)">
              No flashcards yet — generate some from a topic above.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) p-8 shadow-(--shadow-soft)">
            <button
              onClick={() => setFlipped((f) => !f)}
              className="flex min-h-32 w-full max-w-md flex-col items-center justify-center rounded-2xl bg-(--color-accent-soft) p-6 text-center"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-(--color-accent)">
                {flipped ? "Answer" : "Question"}
              </p>
              <p className="mt-2 text-base font-medium text-(--color-ink)">
                {flipped ? currentCard?.answer : currentCard?.question}
              </p>
            </button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Previous card"
                disabled={cardIndex === 0}
                onClick={() => {
                  setCardIndex((i) => Math.max(0, i - 1));
                  setFlipped(false);
                }}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setFlipped((f) => !f)}>
                <RotateCcw className="size-3.5" />
                Flip
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Next card"
                disabled={cardIndex >= cards.length - 1}
                onClick={() => {
                  setCardIndex((i) => Math.min(cards.length - 1, i + 1));
                  setFlipped(false);
                }}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant={currentCard?.known ? "primary" : "outline"} onClick={() => handleMarkKnown(true)}>
                Know it
              </Button>
              <Button
                size="sm"
                variant={currentCard?.known === false ? "primary" : "outline"}
                onClick={() => handleMarkKnown(false)}
              >
                Still learning
              </Button>
              <button
                onClick={handleDeleteCard}
                className="flex size-8 items-center justify-center rounded-lg text-(--color-ink-faint) hover:bg-(--color-surface-muted) hover:text-red-600"
                aria-label="Delete card"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>

            <p className="text-xs text-(--color-ink-faint)">
              Card {cardIndex + 1} of {cards.length}
            </p>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-(--color-ink-faint)">
          Reading progress
        </h2>

        <div className="mb-3 flex gap-2">
          <Input
            value={readingTitle}
            onChange={(e) => setReadingTitle(e.target.value)}
            placeholder="Reading title"
            className="flex-1"
          />
          <Input
            value={readingUrl}
            onChange={(e) => setReadingUrl(e.target.value)}
            placeholder="URL (optional)"
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleAddReading()}
          />
          <Button size="sm" onClick={handleAddReading} disabled={!readingTitle.trim()}>
            <Plus className="size-4" />
          </Button>
        </div>

        {readings.length === 0 ? (
          <div className="rounded-(--radius-card) border border-dashed border-(--color-border) bg-(--color-surface) px-6 py-10 text-center">
            <p className="text-sm text-(--color-ink-muted)">No readings tracked yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {readings.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-(--shadow-soft)"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  {r.url ? (
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate text-sm font-medium text-(--color-ink) hover:underline"
                    >
                      {r.title}
                    </a>
                  ) : (
                    <p className="truncate text-sm font-medium text-(--color-ink)">{r.title}</p>
                  )}
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs font-medium text-(--color-ink-faint)">{r.progress}%</span>
                    <button
                      onClick={() => handleDeleteReading(r.id)}
                      className="flex size-6 items-center justify-center rounded-lg text-(--color-ink-faint) hover:bg-(--color-surface-muted) hover:text-red-600"
                      aria-label={`Delete ${r.title}`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={r.progress}
                  onChange={(e) => handleProgressChange(r.id, Number(e.target.value))}
                  onMouseUp={(e) => handleProgressCommit(r.id, Number((e.target as HTMLInputElement).value))}
                  onTouchEnd={(e) => handleProgressCommit(r.id, Number((e.target as HTMLInputElement).value))}
                  className="w-full accent-(--color-accent)"
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}