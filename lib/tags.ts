import type { NoteTag } from '@/types/note';

export const tagNames = ['All', 'Work', 'Personal', 'Meeting', 'Shopping', 'Todo'] as const;

export const noteTags: NoteTag[] = ['Work', 'Personal', 'Meeting', 'Shopping', 'Todo'];

export const isNoteTag = (tag: string): tag is NoteTag => {
    return noteTags.includes(tag as NoteTag);
};
