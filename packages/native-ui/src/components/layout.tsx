import type React from "react"
import type { ViewProps } from "react-native"
import { View } from "react-native"
import { cn } from "../lib/utils"

/**
 * Box component props
 */
export interface BoxProps extends ViewProps {
  children?: React.ReactNode
  className?: string
}

/**
 * Box component - flexible container
 * Basic building block for layouts
 */
export function Box({ children, className, ...props }: BoxProps) {
  return (
    <View className={cn(className)} {...props}>
      {children}
    </View>
  )
}

/**
 * Center component props
 */
export interface CenterProps extends ViewProps {
  children?: React.ReactNode
  className?: string
}

/**
 * Center component - centers content horizontally and vertically
 */
export function Center({ children, className, ...props }: CenterProps) {
  return (
    <View className={cn("items-center justify-center", className)} {...props}>
      {children}
    </View>
  )
}

/**
 * HStack component props
 */
export interface HStackProps extends ViewProps {
  children?: React.ReactNode
  className?: string
  /** Gap between items (Tailwind spacing scale) */
  gap?: number
}

/**
 * HStack component - horizontal stack layout
 * Arranges children in a row
 */
export function HStack({ children, className, gap, ...props }: HStackProps) {
  const gapClass = gap ? `gap-${gap}` : ""
  return (
    <View className={cn("flex-row items-center", gapClass, className)} {...props}>
      {children}
    </View>
  )
}

/**
 * VStack component props
 */
export interface VStackProps extends ViewProps {
  children?: React.ReactNode
  className?: string
  /** Gap between items (Tailwind spacing scale) */
  gap?: number
}

/**
 * VStack component - vertical stack layout
 * Arranges children in a column
 */
export function VStack({ children, className, gap, ...props }: VStackProps) {
  const gapClass = gap ? `gap-${gap}` : ""
  return (
    <View className={cn("flex-col", gapClass, className)} {...props}>
      {children}
    </View>
  )
}

/**
 * Spacer component - flexible space filler
 */
export interface SpacerProps {
  className?: string
}

export function Spacer({ className }: SpacerProps) {
  return <View className={cn("flex-1", className)} />
}

/**
 * Divider component - horizontal line
 */
export interface DividerProps extends ViewProps {
  className?: string
  orientation?: "horizontal" | "vertical"
}

export function Divider({ className, orientation = "horizontal", ...props }: DividerProps) {
  return (
    <View
      className={cn(
        orientation === "horizontal"
          ? "h-px w-full bg-gray-200 dark:bg-gray-700"
          : "h-full w-px bg-gray-200 dark:bg-gray-700",
        className
      )}
      {...props}
    />
  )
}
