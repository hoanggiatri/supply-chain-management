import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, error, ...props }, ref) => {
    return (
        <textarea
            className={cn(
                "flex min-h-[100px] w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/10 focus-visible:border-indigo-500 focus-visible:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-y",
                error && "border-red-500 focus-visible:ring-red-500/10 focus-visible:border-red-500 bg-red-50/30",
                className
            )}
            ref={ref}
            {...props}
        />
    )
})
Textarea.displayName = "Textarea"

export { Textarea }
