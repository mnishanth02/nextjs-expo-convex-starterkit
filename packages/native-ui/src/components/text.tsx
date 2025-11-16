import type React from "react"
import type { TextProps as RNTextProps } from "react-native"
import { Text as RNText } from "react-native"
import { cn } from "../lib/utils"

/**
 * Text variant types
 */
export type TextVariant = "heading" | "body" | "caption"

/**
 * Text component props
 */
export interface TextProps extends RNTextProps {
  /** Text content */
  children?: React.ReactNode
  /** Text variant for predefined styles */
  variant?: TextVariant
  /** Additional className for styling */
  className?: string
}

/**
 * Variant class mappings
 */
const variantClasses: Record<TextVariant, string> = {
  heading: "text-2xl font-bold text-gray-900 dark:text-gray-100",
  body: "text-base text-gray-700 dark:text-gray-300",
  caption: "text-sm text-gray-500 dark:text-gray-400",
}

/**
 * Text component with variant support
 * Wraps React Native Text with Tailwind styling
 */
export function Text({ children, variant = "body", className, ...props }: TextProps) {
  return (
    <RNText className={cn(variantClasses[variant], className)} {...props}>
      {children}
    </RNText>
  )
}

/**
 * Heading component - convenience wrapper for heading variant
 */
export interface HeadingProps extends Omit<TextProps, "variant"> {
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

const headingClasses: Record<number, string> = {
  1: "text-4xl font-bold text-gray-900 dark:text-gray-100",
  2: "text-3xl font-bold text-gray-900 dark:text-gray-100",
  3: "text-2xl font-bold text-gray-900 dark:text-gray-100",
  4: "text-xl font-semibold text-gray-900 dark:text-gray-100",
  5: "text-lg font-semibold text-gray-900 dark:text-gray-100",
  6: "text-base font-semibold text-gray-900 dark:text-gray-100",
}

export function Heading({ children, level = 1, className, ...props }: HeadingProps) {
  return (
    <RNText className={cn(headingClasses[level], className)} {...props}>
      {children}
    </RNText>
  )
}
