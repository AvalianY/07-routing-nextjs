import { fetchNoteById } from "@/lib/api";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import NoteDetailsClient from '@/app/notes/[id]/NoteDetails.client';
import { Metadata } from "next";

type Props = {
    params: Promise<{ id: string }>
}


export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const res = await fetchNoteById(id)

    return {
        title: res.title,
        description: res.content.slice(0, 15),
        openGraph: {
            title: res.title,
            description: res.content.slice(0, 10),
            url: `https://08-zustand-2id0t83qf-pavlos-projects-5ce3b785.vercel.app/notes/${id}`,
            siteName: "NoteHub",
            images: [
                {
                    url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
                    width: 1200,
                    height: 630,
                    alt: `Note details ${res.title}`

                }
            ],
            type: 'website',
        }
    }
}



const NoteDetails = async ({ params }: Props) => {
    const { id } = await params;

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['note', id],
        queryFn: () => fetchNoteById(id),
    })


    return (
        <>
            <HydrationBoundary state={dehydrate(queryClient)}>

                <NoteDetailsClient />
            </HydrationBoundary>
        </>
    )
}

export default NoteDetails;