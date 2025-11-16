import type React from "react"
import { ActivityIndicator, Pressable, Text, View } from "react-native"
import { cn } from "../lib/utils"

/**
 * Button component props
 */
export interface ButtonProps {
  /** Button text or content */
  children?: React.ReactNode
  /** Whether button is in loading state */
  isLoading?: boolean
  /** Icon to display on the left */
  leftIcon?: React.ReactNode
  /** Icon to display on the right */
  rightIcon?: React.ReactNode
  /** Additional className for styling */
  className?: string
  /** Additional className for text styling */
  textClassName?: string
  /** Whether button is disabled */
  disabled?: boolean
  /** Press handler */
  onPress?: () => void
  /** Test ID for testing */
  testID?: string
}

/**
 * Button component with loading state and icon support
 * Wraps React Native Pressable with Tailwind styling
 */
export function Button({
  children,
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  textClassName,
  disabled = false,
  onPress,
  testID,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      className={cn(
        "flex-row items-center justify-center gap-2 rounded-lg bg-primary-500 px-6 py-3",
        "active:bg-primary-600 disabled:opacity-50",
        className
      )}
      testID={testID}
    >
      {isLoading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <>
          {leftIcon && <View>{leftIcon}</View>}
          {typeof children === "string" ? (
            <Text className={cn("text-base font-medium text-white", textClassName)}>
              {children}
            </Text>
          ) : (
            children
          )}
          {rightIcon && <View>{rightIcon}</View>}
        </>
      )}
    </Pressable>
  )
}

/**
 * ButtonText component for custom text styling
 */
export interface ButtonTextProps {
  children: React.ReactNode
  className?: string
}

export function ButtonText({ children, className }: ButtonTextProps) {
  return <Text className={cn("text-base font-medium text-white", className)}>{children}</Text>
}

/**
 * ButtonIcon component wrapper
 */
export interface ButtonIconProps {
  children: React.ReactNode
  className?: string
}

export function ButtonIcon({ children, className }: ButtonIconProps) {
  return <View className={cn(className)}>{children}</View>
}

/**
 * ButtonSpinner component for loading state
 */
export interface ButtonSpinnerProps {
  color?: string
  size?: "small" | "large"
}

export function ButtonSpinner({ color = "white", size = "small" }: ButtonSpinnerProps) {
  return <ActivityIndicator color={color} size={size} />
}
