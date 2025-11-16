import { ActivityIndicator, StyleSheet, View } from "react-native"

/**
 * Loading screen shown while checking authentication state
 * Displayed during app initialization before auth state is determined
 */
export function AuthLoading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3B82F6" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
})
