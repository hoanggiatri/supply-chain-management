import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

const Checkbox = React.forwardRef(({ className, checked, onChange, disabled, ...props }, ref) => {
    return (
        <div className="relative flex items-center">
            <input
                type="checkbox"
                className="peer h-4 w-4 shrink-0 rounded-sm border border-gray-200 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-white checked:bg-indigo-600 checked:border-indigo-600"
                ref={ref}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                {...props}
            />
            <Check className="absolute h-3 w-3 text-white pointer-events-none hidden peer-checked:block left-0.5" strokeWidth={3} />
        </div>
    )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
