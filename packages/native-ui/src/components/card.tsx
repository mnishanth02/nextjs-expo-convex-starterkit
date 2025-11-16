import type React from "react"
import type { ViewProps } from "react-native"
import { View } from "react-native"
import { cn } from "../lib/utils"

/**
 * Card component props
 */
export interface CardProps extends ViewProps {
  /** Card content */
  children?: React.ReactNode
  /** Additional className for styling */
  className?: string
}

/**
 * Card component with default styling
 * Uses View with Tailwind styling for cards
 */
export function Card({ children, className, ...props }: CardProps) {
  return (
    <View
      className={cn(
        "rounded-xl bg-white p-4 shadow-md",
        "dark:bg-gray-800 dark:shadow-gray-900/50",
        className
      )}
      {...props}
    >
      {children}
    </View>
  )
}

/**
 * CardHeader component
 */
export interface CardHeaderProps extends ViewProps {
  children?: React.ReactNode
  className?: string
}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <View className={cn("mb-3", className)} {...props}>
      {children}
    </View>
  )
}

/**
 * CardContent component
 */
export interface CardContentProps extends ViewProps {
  children?: React.ReactNode
  className?: string
}

export function CardContent({ children, className, ...props }: CardContentProps) {
  return (
    <View className={cn(className)} {...props}>
      {children}
    </View>
  )
}

/**
 * CardFooter component
 */
export interface CardFooterProps extends ViewProps {
  children?: React.ReactNode
  className?: string
}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <View className={cn("mt-3", className)} {...props}>
      {children}
    </View>
  )
}
