"use server";

import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { debounceTimeout } from "@/lib/constant";
import { handleError } from "@/lib/utils";
import openai from "@/openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export const createNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to update a note");

    await prisma.note.create({
      data: {
        id: noteId,
        authorId: user.id,
        text: "",
      },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const updateNoteAction = async (noteId: string, text: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("User not authenticated");

    const note = await prisma.note.update({
      where: {
        id: noteId,
        authorId: user.id, // Ensure user owns the note
      },
      data: {
        text,
      },
    });

    return { note, errorMessage: null };
  } catch (error) {
    return { note: null, ...handleError(error) };
  }
};

export const deleteNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to delete a note");

    const note = await prisma.note.delete({
      where: {
        id: noteId,
        authorId: user.id, // Ensure user owns the note
      },
    });

    return { note, errorMessage: null };
  } catch (error) {
    return { note: null, ...handleError(error) };
  }
};

export const askAIAboutNotesAction = async (
  newQuestions: string[],
  responses: string[],
) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to Ask AI question");

    const notes = await prisma.note.findMany({
      where: {
        authorId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        text: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (notes.length === 0) {
      return { errorMessage: "No notes found" };
    }

    const formattedNotes = notes
      .map((note) =>
        `Text: ${note.text}
      CreatedAt: ${note.createdAt}
      UpdatedAt: ${note.updatedAt}
    `.trim(),
      )
      .join("\n");
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "developer",
        content: `
        You are a helpful assistant that can answer questions about the following notes:
        Assume alll questions are relatrd to the users note.
        Make sure that your answers are not too verbose and you speak succintly.
        Your responses MUST be formatted in clean, valid HTML with proper structure. 
        Use tags like <p>, <strong>, <em>, <ul>, <li>, <ol>, <h1> to <h6>, and <br> when appropriate.
        Do NOT wrap the entire response in a single <p> tag unless it's a single paragraph.
        Avoid inline styles, Javascript, or custom attributes.

        Rendered like this in JSX: 
        <p dangerouslySetInnerHTML={{ __html: YOUR_RESPONSE }} />

        Here are the user's notes:
        ${formattedNotes}
        `,
      },
    ];

    for (let i = 0; i < newQuestions.length; i++) {
      messages.push({ role: "user", content: newQuestions[i] });
      if (responses.length > i) {
        messages.push({ role: "assistant", content: responses[i] });
      }
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    return completion.choices[0].message.content || "A problem has occurred";
  } catch (error) {
    return handleError(error);
  }
};
