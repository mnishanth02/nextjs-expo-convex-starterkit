import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "expo-router"
import { Controller, useForm } from "react-hook-form"
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native"
import { AuthButton, AuthInput } from "@/components/auth"
import { useSignUp } from "@/lib/auth/hooks"
import { type SignUpInput, signUpSchema } from "@/lib/schemas/auth"

export default function SignUpScreen() {
  const { signUp, isLoading } = useSignUp()
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: SignUpInput) => {
    Keyboard.dismiss()
    await signUp(data)
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  label="Name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.name?.message}
                  touched={touchedFields.name}
                  placeholder="Enter your name"
                  autoCapitalize="words"
                  autoComplete="name"
                  returnKeyType="next"
                  editable={!isLoading}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  touched={touchedFields.email}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="next"
                  editable={!isLoading}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  label="Password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  touched={touchedFields.password}
                  placeholder="Enter your password"
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password-new"
                  returnKeyType="next"
                  editable={!isLoading}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  label="Confirm Password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                  touched={touchedFields.confirmPassword}
                  placeholder="Confirm your password"
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password-new"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  editable={!isLoading}
                />
              )}
            />

            <AuthButton title="Sign Up" onPress={handleSubmit(onSubmit)} loading={isLoading} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => router.push("/(auth)/sign-in")}>
              <Text style={styles.linkText}>Sign In</Text>
            </Pressable>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  form: {
    marginBottom: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#6B7280",
  },
  link: {
    marginLeft: 4,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B82F6",
  },
})
