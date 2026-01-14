import { Badge } from "@/components/ui/badge";

export function SpinnerBadge({ content }) {
    return (
        <>
            <div className="flex flex-col min-h-screen justify-center items-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            {content}
            </div>
        </>
    );
}
