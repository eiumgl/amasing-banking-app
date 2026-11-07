import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
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

const API_BASE_URL = "https://6aeade2fee39618d7bf77400.mockapi.io/api/v1";

export default function CompleteProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = Array.isArray(params.userId) ? params.userId[0] : params.userId;
  const phoneNumber = Array.isArray(params.phoneNumber)
    ? params.phoneNumber[0]
    : params.phoneNumber;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSaveProfile = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      setError("Enter your name and email.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    if (!userId || !phoneNumber) {
      setError("Registration details are missing. Please register again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail }),
      });

      if (!response.ok) {
        throw new Error(`Could not save your profile (${response.status}).`);
      }

      await response.json();
      router.replace({ pathname: "/login", params: { phoneNumber } });
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Could not connect to the API. Check your internet connection; on web, the API may also need to allow this app's origin."
          : err.message || "Could not save your profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground colors={["black", "teal"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.overlay}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>COMPLETE PROFILE</Text>
          <Text style={styles.titleBody}>Add your name and email.</Text>

          <View style={styles.form}>
            <View style={styles.inputBox}>
              <Ionicons
                name="person-outline"
                size={20}
                color="dimgray"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Full name"
                autoCapitalize="words"
                value={name}
                onChangeText={(value) => {
                  setName(value);
                  setError("");
                }}
              />
            </View>

            <View style={styles.inputBox}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="dimgray"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  setError("");
                }}
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.actionButton, loading && styles.disabledButton]}
              onPress={handleSaveProfile}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>
                {loading ? "Saving..." : "Continue"}
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
    justifyContent: "center",
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 2,
    marginBottom: 6,
  },
  titleBody: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    marginBottom: 24,
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
  errorText: {
    color: "red",
    fontSize: 13,
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: "forestgreen",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 5,
  },
  disabledButton: { opacity: 0.7 },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
});
