import { Image } from "expo-image"
import { Link } from "expo-router"
import { ActivityIndicator, Platform, Pressable, StyleSheet } from "react-native"
import { HelloWave } from "@/components/hello-wave"
import ParallaxScrollView from "@/components/parallax-scroll-view"
import { ThemedText } from "@/components/themed-text"
import { ThemedView } from "@/components/themed-view"
import { useAuthState, useLogout } from "@/lib/auth/hooks"

export default function HomeScreen() {
  const { user } = useAuthState()
  const { logout, isLoading } = useLogout()

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome{user?.name ? `, ${user.name}` : ""}!</ThemedText>
        <HelloWave />
      </ThemedView>

      {/* User Info Section */}
      {user && (
        <ThemedView style={styles.userInfoContainer}>
          <ThemedView style={styles.userInfoCard}>
            <ThemedText type="subtitle" style={styles.userInfoTitle}>
              Your Account
            </ThemedText>
            <ThemedView style={styles.userInfoRow}>
              <ThemedText style={styles.userInfoLabel}>Name:</ThemedText>
              <ThemedText style={styles.userInfoValue}>{user.name || "Not provided"}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.userInfoRow}>
              <ThemedText style={styles.userInfoLabel}>Email:</ThemedText>
              <ThemedText style={styles.userInfoValue}>{user.email || "Not provided"}</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      )}

      <ThemedView style={styles.stepContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutButtonPressed,
            isLoading && styles.logoutButtonDisabled,
          ]}
          onPress={logout}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
          )}
        </Pressable>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{" "}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: "cmd + d",
              android: "cmd + m",
              web: "F12",
            })}
          </ThemedText>{" "}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert("Action pressed")} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert("Share pressed")}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert("Delete pressed")}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{" "}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{" "}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  logoutButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  logoutButtonPressed: {
    opacity: 0.8,
  },
  logoutButtonDisabled: {
    opacity: 0.5,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  userInfoContainer: {
    marginBottom: 16,
  },
  userInfoCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
  },
  userInfoTitle: {
    marginBottom: 12,
    color: "#3B82F6",
  },
  userInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(229, 231, 235, 0.3)",
  },
  userInfoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  userInfoValue: {
    fontSize: 14,
    flex: 1,
    textAlign: "right",
    marginLeft: 16,
  },
})
