import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const trimmedPhoneNumber = phoneNumber.trim();
    if (!trimmedPhoneNumber) {
      Alert.alert("Registration", "Enter your phone number.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://6aeade2fee39618d7bf77400.mockapi.io/api/v1/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber: trimmedPhoneNumber }),
        }
      );

      if (!response.ok) {
        throw new Error(`Registration failed (${response.status}).`);
      }

      const createdUser = await response.json();
      if (!createdUser?.id) {
        throw new Error(
          "Registration succeeded but the API returned no user ID."
        );
      }

      router.push({
        pathname: "/otp",
        params: {
          userId: String(createdUser.id),
          phoneNumber: trimmedPhoneNumber,
        },
      });
    } catch (err) {
      Alert.alert(
        "Registration",
        err instanceof TypeError
          ? "Could not connect to the API. Check your internet connection; on web, the API may also need to allow this app's origin."
          : err.message || "Could not register. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["black", "teal"]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
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
            <Text style={styles.title}>REGISTER</Text>
            <Text style={styles.titleBody}>Create a new account.</Text>

            <View style={styles.form}>
              <View style={styles.inputBox}>
                <Ionicons
                  name="call-outline"
                  size={20}
                  color="dimgray"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>

              <View style={styles.inputBox}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="dimgray"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Create 6-Digit PIN"
                  keyboardType="number-pad"
                  maxLength={6}
                  secureTextEntry={!showPin}
                  value={pin}
                  onChangeText={setPin}
                />
                <TouchableOpacity onPress={() => setShowPin(!showPin)}>
                  <Ionicons
                    name={showPin ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="dimgray"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.registerButton, loading && styles.disabledButton]}
                onPress={handleSave}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.registerButtonText}>Register</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.footerLink}
                onPress={() => router.push("/login")}
              >
                <Text style={styles.footerText}>
                  Have an account?{" "}
                  <Text style={styles.footerTextlink}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  overlay: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 30,
    marginTop: 10,
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 2,
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  titleBody: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    marginBottom: 30,
    letterSpacing: 1.5,
    alignSelf: "flex-start",
    marginLeft: 20,
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
  input: { flex: 1, fontSize: 16, color: "black" },
  registerButton: {
    backgroundColor: "forestgreen",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 15,
    marginTop: 5,
  },
  disabledButton: { opacity: 0.7 },
  registerButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  footerLink: { alignItems: "center" },
  footerText: { color: "black", fontSize: 14 },
  footerTextlink: { color: "forestgreen", fontSize: 14, fontWeight: "bold" },
});
