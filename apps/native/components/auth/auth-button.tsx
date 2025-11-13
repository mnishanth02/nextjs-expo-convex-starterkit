import { ActivityIndicator, Pressable, type PressableProps, StyleSheet, Text } from "react-native"

interface AuthButtonProps extends Omit<PressableProps, "children"> {
  title: string
  variant?: "primary" | "secondary"
  loading?: boolean
}

export function AuthButton({
  title,
  variant = "primary",
  loading = false,
  disabled,
  ...pressableProps
}: AuthButtonProps) {
  const isDisabled = disabled || loading

  return (
    <Pressable
      {...pressableProps}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        variant === "primary" ? styles.primaryButton : styles.secondaryButton,
        isDisabled && styles.buttonDisabled,
        pressed && !isDisabled && styles.buttonPressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#FFFFFF" : "#3B82F6"} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            variant === "primary" ? styles.primaryButtonText : styles.secondaryButtonText,
            isDisabled && styles.buttonTextDisabled,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
  primaryButton: {
    backgroundColor: "#3B82F6",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButtonText: {
    color: "#FFFFFF",
  },
  secondaryButtonText: {
    color: "#3B82F6",
  },
  buttonTextDisabled: {
    opacity: 0.7,
  },
})
