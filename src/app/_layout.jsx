import { Stack } from "expo-router";
import { BankingProvider } from "../context/BankingContext";

export default function RootLayout() {
  return (
    <BankingProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="transactions" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="otp" />
        <Stack.Screen name="complete-profile" />

        <Stack.Screen
          name="details/[id]"
          options={{ headerShown: true, title: "Transaction Receipt" }}
        />
      </Stack>
    </BankingProvider>
  );
}
