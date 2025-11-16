import {
  Box,
  Button,
  ButtonText,
  HStack,
  Input,
  InputField,
  Text,
  VStack,
} from "@gluestack-ui/themed"
import { useState } from "react"
import { ScrollView } from "react-native"

export function TestGluestack() {
  const [inputValue, setInputValue] = useState("")

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <VStack className="gap-6 p-6">
        {/* Header */}
        <Box className="rounded-2xl bg-primary-500 p-6">
          <Text className="mb-2 font-bold text-3xl text-white">Gluestack UI Test</Text>
          <Text className="text-base text-white opacity-90">
            Testing Gluestack UI v3 with NativeWind integration
          </Text>
        </Box>

        {/* Button Tests */}
        <VStack className="gap-4">
          <Text className="font-bold text-gray-900 text-xl dark:text-white">Button Components</Text>

          <Button className="bg-primary-500">
            <ButtonText>Primary Button</ButtonText>
          </Button>

          <Button className="border-primary-500 bg-transparent">
            <ButtonText className="text-primary-500">Outline Button</ButtonText>
          </Button>

          <Button className="bg-secondary-500">
            <ButtonText>Secondary Button</ButtonText>
          </Button>

          <Button isDisabled>
            <ButtonText>Disabled Button</ButtonText>
          </Button>
        </VStack>

        {/* Input Tests */}
        <VStack className="gap-4">
          <Text className="font-bold text-gray-900 text-xl dark:text-white">Input Components</Text>

          <Input className="border-gray-300 dark:border-gray-600">
            <InputField
              placeholder="Enter text here"
              value={inputValue}
              onChangeText={setInputValue}
              className="text-gray-900 dark:text-white"
            />
          </Input>

          <Input isDisabled className="bg-gray-100 dark:bg-gray-800">
            <InputField placeholder="Disabled input" className="text-gray-500" />
          </Input>
        </VStack>

        {/* Layout Tests */}
        <VStack className="gap-4">
          <Text className="font-bold text-gray-900 text-xl dark:text-white">Layout Components</Text>

          <HStack className="gap-3">
            <Box className="flex-1 rounded-lg bg-primary-500 p-4">
              <Text className="text-center text-white">HStack Item 1</Text>
            </Box>
            <Box className="flex-1 rounded-lg bg-secondary-500 p-4">
              <Text className="text-center text-white">HStack Item 2</Text>
            </Box>
          </HStack>

          <VStack className="gap-3">
            <Box className="rounded-lg bg-primary-400 p-4">
              <Text className="text-white">VStack Item 1</Text>
            </Box>
            <Box className="rounded-lg bg-primary-600 p-4">
              <Text className="text-white">VStack Item 2</Text>
            </Box>
          </VStack>
        </VStack>

        {/* Dark Mode Test */}
        <VStack className="gap-4">
          <Text className="font-bold text-gray-900 text-xl dark:text-white">Dark Mode Support</Text>

          <Box className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <Text className="mb-2 text-base text-gray-900 dark:text-white">
              This box changes color based on theme
            </Text>
            <Text className="text-gray-600 text-sm dark:text-gray-400">
              Light mode: white background
            </Text>
            <Text className="text-gray-600 text-sm dark:text-gray-400">
              Dark mode: dark gray background
            </Text>
          </Box>
        </VStack>

        {/* Success Message */}
        {inputValue.length > 0 && (
          <Box className="rounded-lg border border-green-500 bg-green-100 p-4 dark:bg-green-900/30">
            <Text className="text-green-800 dark:text-green-300">✓ Input value: {inputValue}</Text>
          </Box>
        )}
      </VStack>
    </ScrollView>
  )
}
