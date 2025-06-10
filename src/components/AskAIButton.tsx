"use client";

import { User } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Fragment, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { askAIAboutNotesAction } from "@/actions/notes";
import "@/styles/ai-response.css";

type Props = {
  user: User | null;
};

function AskAIButton({ user }: Props) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);
  const handleOpenChange = (isOpen: boolean) => {
    if (!user) {
      router.push("/login");
    } else {
      if (isOpen) {
        setQuestionText("");
        setQuestions([]);
        setResponses([]);
      }
      setOpen(isOpen);
    }
  };
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    contentRef.current?.scrollTo({
      top: contentRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleSubmit = () => {
    if (questionText.trim() === "") return;
    const newQuestions = [...questions, questionText];
    setQuestions(newQuestions);
    setQuestionText("");
    setTimeout(scrollToBottom, 100);

    startTransition(async () => {
      const response = await askAIAboutNotesAction(newQuestions, responses);
      if (typeof response === "string") {
        setResponses((prev) => [...prev, response]);
      } else {
        // Handle error case
        setResponses((prev) => [
          ...prev,
          response.errorMessage || "An error occurred",
        ]);
      }
      setTimeout(scrollToBottom, 100);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClickInput = () => {
    textareaRef.current?.focus();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <form>
        <DialogTrigger asChild>
          <Button variant="secondary">Ask AI</Button>
        </DialogTrigger>
        <DialogContent className="custom-scrollbar flex h-[80vh] max-w-4xl flex-col overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ask AI About Your Notes</DialogTitle>
            <DialogDescription>
              Our AI is ready to answer your questions about your notes.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-8">
            {questions.map((question, index) => (
              <Fragment key={index}>
                <p className="bg-muted text-muted-foreground max-w- ml-auto max-w-[60%] rounded-md px-2 py-1 text-sm">
                  {question}
                </p>
                {responses[index] && (
                  <p
                    className="bot-response text-muted-foreground text-sm"
                    dangerouslySetInnerHTML={{ __html: responses[index] }}
                  />
                )}
              </Fragment>
            ))}
            {isPending && <p className="animate-pulse text-sm">Thinking...</p>}
          </div>
          <div
            className="mt-auto flex cursor-text flex-col rounded-lg border p-4"
            onClick={handleClickInput}
          >
            <Textarea
              ref={textareaRef}
              className="placeholder:text-muted-foreground resize-none rounded-none border-none bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Ask me anything about your notes..."
              style={{
                lineHeight: "normal",
                minHeight: "0",
              }}
              rows={1}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
            <Button className="ml-auto size-8 rounded-full">
              <ArrowUpIcon className="text-background" />
            </Button>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default AskAIButton;
