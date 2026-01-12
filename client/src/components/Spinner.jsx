import { Badge } from "@/components/ui/badge";

export function SpinnerBadge({content}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white backdrop-blur-sm">
            <Badge className="gap-2 py-3 px-6 text-base bg-[#000000dd] text-white">
                <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
                </div>
                <span className="ml-2">{content}</span>
            </Badge>
        </div>
    );
}