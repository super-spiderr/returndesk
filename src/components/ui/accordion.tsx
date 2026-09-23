"use client";

// shadcn-style Accordion primitive, built on Radix, wired to this site's own
// tokens (ink/rule/paper) instead of a generic shadcn theme. Height/opacity
// animate via plain CSS keyed off Radix's [data-state] attribute — no extra
// "tailwindcss-animate" plugin needed under Tailwind v4.

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn("rounded-xl border border-rule bg-paper transition-colors", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex flex-1 cursor-pointer items-center justify-between gap-4 px-4 py-4 text-left text-sm font-bold text-ink outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-ink/30 rounded-xl",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown
          size={18}
          strokeWidth={1.75}
          className="shrink-0 text-muted transition-transform duration-300 group-data-[state=open]:rotate-180 group-data-[state=open]:text-ink"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden text-sm text-muted data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <p className={cn("px-4 pb-4 leading-relaxed", className)}>{children}</p>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
