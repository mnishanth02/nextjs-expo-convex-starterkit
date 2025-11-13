import { useState } from "react"
import { StyleSheet, Text, TextInput, type TextInputProps, View } from "react-native"

interface AuthInputProps extends TextInputProps {
  label: string
  error?: string
  touched?: boolean
}

export function AuthInput({ label, error, touched, ...inputProps }: AuthInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const hasError = touched && error

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...inputProps}
        style={[styles.input, isFocused && styles.inputFocused, hasError && styles.inputError]}
        onFocus={(e) => {
          setIsFocused(true)
          inputProps.onFocus?.(e)
        }}
        onBlur={(e) => {
          setIsFocused(false)
          inputProps.onBlur?.(e)
        }}
        placeholderTextColor="#9CA3AF"
      />
      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },
  inputFocused: {
    borderColor: "#3B82F6",
    borderWidth: 2,
  },
  inputError: {
    borderColor: "#EF4444",
    borderWidth: 2,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
  },
})
