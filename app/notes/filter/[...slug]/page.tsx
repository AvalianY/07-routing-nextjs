
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Metadata } from "next";

type Props = {
    params: Promise<{ slug: string[] }>;
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { slug } = await params;
    const tagName = slug[0];

    return {
        title: `Notes - Filter: ${tagName}`,
        description: `View notes filtered by ${tagName}.`,
        openGraph: {
            title: `Notes - Filter: ${tagName}`,
            description: `View notes filtered by ${tagName}.`,
            url: `https://08-zustand-2id0t83qf-pavlos-projects-5ce3b785.vercel.app/notes/filter/${tagName}`,
            siteName: "NoteHub",
            images: [
                {
                    url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
                    width: 1200,
                    height: 630,
                    alt: `Note filter ${tagName}`

                }
            ],
            type: 'website',
        }
    }
}




const NotesByTag = async ({ params }: Props) => {
    const { slug } = await params;
    const queryClient = new QueryClient()


    const currentPage = 1;
    const searchQuery = '';

    const tagName = slug[0] === "All" ? undefined : slug[0]

    await queryClient.prefetchQuery({
        queryKey: ['notes', currentPage, searchQuery, tagName],
        queryFn: () => fetchNotes(currentPage, searchQuery, tagName)
    })


    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NotesClient tag={tagName} />

        </HydrationBoundary>

    )
}

export default NotesByTag