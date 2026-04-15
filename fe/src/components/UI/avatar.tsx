"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "./utils";

function Avatar({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
  className?: string;
}) {
  return (
    <div
      data-slot="avatar"
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full",
        className,
      )}
    >
      <AvatarPrimitive.Root {...props} />
    </div>
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> & {
  className?: string;
}) {
  return (
    <AvatarPrimitive.Image data-slot="avatar-image" {...props} />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> & {
  className?: string;
}) {
  return (
    <AvatarPrimitive.Fallback data-slot="avatar-fallback" {...props} />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
