import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

import styles from './checkbox.module.scss';

import { cn } from "../../../../features/lib/utils" 

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        `${styles.checkbox} peer hover:border-[#00C293] !rounded-[4px]  dark:bg-input/30 data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-[#00C293] data-[state=checked]:bg-[#00C293] focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-[20px] border-[1px] data-[state=checked]:border-none border-[#CDD3E0] w-[20px]`,
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
