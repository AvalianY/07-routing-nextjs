import axios from "axios";
import type { NewNote, Note, NoteTag } from "../types/note";

interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
}

interface Params {
    page: number;
    perPage?: number;
    search?: string;
    tag?: NoteTag;
}

const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

axios.defaults.baseURL = "https://notehub-public.goit.study/api";
axios.defaults.headers.common['Authorization'] = `Bearer ${myKey}`;

export const fetchNotes = async (
    page: number,
    search: string,
    tag?: NoteTag,
    perPage = 10
): Promise<FetchNotesResponse> => {
    const params: Params = {
        page,
        perPage,
        search,
        tag,
    };

    const response = await axios.get<FetchNotesResponse>("/notes", {
        params,
    });

    return response.data;
};

export const createNote = async (newNote: NewNote): Promise<Note> => {
    const res = await axios.post<Note>("/notes", newNote);
    return res.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
    const res = await axios.delete<Note>(`/notes/${noteId}`);
    return res.data;
};

export const fetchNoteById = async (noteId: string): Promise<Note> => {
    const res = await axios.get<Note>(`/notes/${noteId}`);
    return res.data;
};
