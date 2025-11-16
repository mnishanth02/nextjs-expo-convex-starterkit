import { Text, View } from "react-native"

export function TestNativeWind() {
  return (
    <View className="flex-1 items-center justify-center bg-primary-50 dark:bg-primary-900">
      <Text className="font-bold text-2xl text-primary-700 dark:text-primary-100">
        NativeWind is working! 🎉
      </Text>
      <View className="mt-4 rounded-lg bg-primary-500 px-6 py-3">
        <Text className="font-semibold text-white">Styled Button</Text>
      </View>
    </View>
  )
}
