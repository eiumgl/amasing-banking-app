import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import GradientBackground from "../components/GradientBackground";

export default function OTPScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = Array.isArray(params.userId) ? params.userId[0] : params.userId;
  const phoneNumber = Array.isArray(params.phoneNumber)
    ? params.phoneNumber[0]
    : params.phoneNumber;
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    if (!/^\d{6}$/.test(otp)) {
      Alert.alert("Verification", "Enter a 6-digit demo code.");
      return;
    }

    if (!userId || !phoneNumber) {
      Alert.alert(
        "Verification",
        "Registration details are missing. Please register again."
      );
      return;
    }

    router.push({
      pathname: "/complete-profile",
      params: { userId, phoneNumber },
    });
  };

  return (
    <GradientBackground colors={["black", "teal"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.overlay}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require("../../assets/snack-icon.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>VERIFICATION</Text>
          <Text style={styles.titleBody}>
            Enter the OTP sent to your device.
          </Text>

          <View style={styles.form}>
            <View style={styles.inputBox}>
              <Ionicons
                name="keypad-outline"
                size={20}
                color="dimgray"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter OTP Code"
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
              />
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleVerify}
            >
              <Text style={styles.actionButtonText}>Verify</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.footerLink}
              onPress={() => router.back()}
            >
              <Text style={styles.footerText}>
                Didn&apos;t receive code?{" "}
                <Text style={styles.footerTextlink}>Go Back</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logo: {
    width: 250,
    height: 250,
    alignSelf: "center",
    marginBottom: 50,
    marginTop: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
    marginBottom: 1,
    letterSpacing: 2,
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  titleBody: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    marginBottom: 30,
    letterSpacing: 2,
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  form: {
    backgroundColor: "white",
    width: "100%",
    padding: 25,
    borderRadius: 15,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    backgroundColor: "whitesmoke",
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16 },
  actionButton: {
    backgroundColor: "forestgreen",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  footerLink: { alignItems: "center" },
  footerText: { color: "black", fontSize: 14 },
  footerTextlink: { color: "blue", fontSize: 14, fontWeight: "bold" },
});
