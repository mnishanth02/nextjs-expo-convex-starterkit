import { Pressable, Text, View } from "react-native"

export function TestNativeWind() {
  return (
    <View className="flex-1 items-center justify-center bg-white p-4 dark:bg-gray-900">
      <View className="rounded-xl bg-primary-500 p-6 shadow-lg">
        <Text className="mb-4 font-bold text-2xl text-white">NativeWind Test</Text>
        <Text className="mb-4 text-base text-white">
          If you can see styled text, NativeWind is working!
        </Text>
        <Pressable className="rounded-lg bg-white p-4 active:opacity-80 dark:bg-gray-800">
          <Text className="text-center font-semibold text-primary-500 dark:text-primary-400">
            Test Button
          </Text>
        </Pressable>
      </View>
    </View>
  )
}
