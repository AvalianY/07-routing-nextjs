"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";

import css from "./NoteForm.module.css";
import { ChangeEvent, useEffect, useId } from "react";
import { createNote } from "@/lib/api";
import type { NewNote } from "../../types/note";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useNoteDraft } from "@/lib/store/noteStore";

const NotesSchema = Yup.object().shape({
  title: Yup.string().min(3).max(50).required(),
  content: Yup.string().max(500),
  tag: Yup.string().oneOf([
    "Todo",
    "Work",
    "Personal",
    "Meeting",
    "Shopping",
  ]).required(),
});

export default function NoteForm() {
  const { draft, setDraft, clearDraft } = useNoteDraft();

  const fieldId = useId();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isError, isPending } = useMutation({
    mutationFn: (newNote: NewNote) => createNote(newNote),

    onSuccess: async () => {
      toast.success("Note created successfully!");
      clearDraft();

      await queryClient.invalidateQueries({
        queryKey: ["notes"],
        exact: false,
      });

      router.push("/notes/filter/All");
    },
  });

  const handleSubmit = (formData: FormData) => {
    const data = Object.fromEntries(formData) as unknown as NewNote;
    mutate(data);
  };

  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
      | ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDraft({
      ...(draft as NewNote),
      [e.target.name as keyof NewNote]: e.target.value,
    });
  };

  const handleCancel = () => {
    router.back();
  };

  useEffect(() => {
    if (isError) {
      toast.error(
        "Oops.. There was an error creating the note. Please try again later."
      );
    }
  }, [isError]);

  return (
    <>
      <form action={handleSubmit} className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`title-${fieldId}`}>Title</label>
          <input
            id={`title-${fieldId}`}
            type="text"
            name="title"
            className={css.input}
            onChange={handleChange}
            defaultValue={draft.title}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`content-${fieldId}`}>Content</label>
          <textarea
            id={`content-${fieldId}`}
            name="content"
            rows={8}
            className={css.textarea}
            onChange={handleChange}
            defaultValue={draft.content}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`tag-${fieldId}`}>Tag</label>
          <select
            id={`tag-${fieldId}`}
            name="tag"
            className={css.select}
            onChange={handleChange}
            defaultValue={draft.tag}
          >
            <option value="">-- Choose tag --</option>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </select>
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={handleCancel}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={css.submitButton}
            disabled={isPending}
          >
            {isPending ? "Creating a note..." : "Create note"}
          </button>
        </div>
      </form>

      <Toaster />
    </>
  );
}