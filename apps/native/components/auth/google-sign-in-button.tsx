import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native"
import { useGoogleSignIn } from "@/lib/auth/hooks/use-google-sign-in"

/**
 * Google Sign-In button component
 * Displays a branded button that initiates Google OAuth flow
 */
export function GoogleSignInButton() {
  const { signInWithGoogle, isLoading } = useGoogleSignIn()

  return (
    <Pressable
      onPress={signInWithGoogle}
      disabled={isLoading}
      style={({ pressed }) => [
        styles.button,
        pressed && !isLoading && styles.buttonPressed,
        isLoading && styles.buttonDisabled,
      ]}
    >
      <View style={styles.buttonContent}>
        {isLoading ? (
          <ActivityIndicator color="#1F2937" style={styles.icon} />
        ) : (
          <View style={styles.googleIcon}>
            <GoogleIcon />
          </View>
        )}
        <Text style={styles.buttonText}>
          {isLoading ? "Signing in..." : "Continue with Google"}
        </Text>
      </View>
    </Pressable>
  )
}

/**
 * Google "G" logo SVG as React Native components
 * Using the official Google colors
 */
function GoogleIcon() {
  return (
    <View style={styles.svgContainer}>
      <Text style={styles.googleText}>G</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginVertical: 8,
  },
  buttonPressed: {
    opacity: 0.8,
    backgroundColor: "#F9FAFB",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 12,
  },
  googleIcon: {
    marginRight: 12,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  svgContainer: {
    width: 20,
    height: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  googleText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4285F4",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
})
