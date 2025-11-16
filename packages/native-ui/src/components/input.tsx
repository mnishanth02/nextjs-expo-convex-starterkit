import type React from "react"
import type { TextInputProps } from "react-native"
import { TextInput, View } from "react-native"
import { cn } from "../lib/utils"

/**
 * Input component props
 */
export interface InputProps extends TextInputProps {
  /** Icon to display on the left */
  leftIcon?: React.ReactNode
  /** Icon to display on the right */
  rightIcon?: React.ReactNode
  /** Additional className for container styling */
  containerClassName?: string
  /** Additional className for input field styling */
  className?: string
}

/**
 * Input component with icon support
 * Wraps React Native TextInput with Tailwind styling
 */
export function Input({
  leftIcon,
  rightIcon,
  containerClassName,
  className,
  ...props
}: InputProps) {
  return (
    <View
      className={cn(
        "flex-row items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3",
        "dark:border-gray-600 dark:bg-gray-800",
        containerClassName
      )}
    >
      {leftIcon && <View>{leftIcon}</View>}
      <TextInput
        className={cn(
          "flex-1 text-base text-gray-900 dark:text-gray-100",
          "placeholder:text-gray-400 dark:placeholder:text-gray-500",
          className
        )}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {rightIcon && <View>{rightIcon}</View>}
    </View>
  )
}

/**
 * InputField component - direct input without container
 */
export interface InputFieldProps extends TextInputProps {
  className?: string
}

export function InputField({ className, ...props }: InputFieldProps) {
  return (
    <TextInput
      className={cn(
        "rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900",
        "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100",
        "placeholder:text-gray-400 dark:placeholder:text-gray-500",
        className
      )}
      placeholderTextColor="#9CA3AF"
      {...props}
    />
  )
}

/**
 * InputSlot component for icons
 */
export interface InputSlotProps {
  children: React.ReactNode
  className?: string
}

export function InputSlot({ children, className }: InputSlotProps) {
  return <View className={cn(className)}>{children}</View>
}

/**
 * InputIcon component wrapper
 */
export interface InputIconProps {
  children: React.ReactNode
  className?: string
}

export function InputIcon({ children, className }: InputIconProps) {
  return <View className={cn(className)}>{children}</View>
}
