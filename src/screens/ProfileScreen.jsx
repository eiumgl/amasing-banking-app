import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import BottomNav from "../components/BottomNav";
import { getProfile } from "../services/profileApi";

const emptyProfile = {
  name: "User",
  email: "user@example.com",
  phone: "",
  address: "",
};

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState(emptyProfile);
  const [draft, setDraft] = useState(emptyProfile);
  const [isEditorVisible, setEditorVisible] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getProfile()
      .then((apiProfile) => {
        if (!isMounted) return;
        setProfile({
          name: apiProfile.name ?? emptyProfile.name,
          email: apiProfile.email ?? emptyProfile.email,
          phone: apiProfile.phone ?? emptyProfile.phone,
          address: apiProfile.address ?? emptyProfile.address,
        });
      })
      .catch((error) => {
        if (isMounted) Alert.alert("Unable to load profile", error.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const openEditor = () => {
    setDraft(profile);
    setEditorVisible(true);
  };

  const saveProfile = () => {
    setProfile(draft);
    setEditorVisible(false);
  };

  return (
    <LinearGradient colors={["black", "teal"]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Profile</Text>
            <Text style={styles.headerSubtitle}>Manage your account</Text>
          </View>
          <Ionicons name="person-circle" size={42} color="white" />
        </View>

        {/* CONTENT */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* PROFILE CARD */}
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={45} color="forestgreen" />
            </View>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.email}>{profile.email}</Text>
            <View style={styles.memberBadge}>
              <Text style={styles.memberText}>Basic Account</Text>
            </View>
          </View>

          {/* ACCOUNT SETTINGS */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            <TouchableOpacity style={styles.option} onPress={openEditor}>
              <View style={styles.optionIcon}>
                <Ionicons name="person-outline" size={22} color="forestgreen" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionText}>Personal Information</Text>
                <Text style={styles.optionDescription}>
                  Manage your personal details
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={() => Alert.alert("Security", "Settings coming soon.")}
            >
              <View style={styles.optionIcon}>
                <Ionicons
                  name="lock-closed-outline"
                  size={22}
                  color="forestgreen"
                />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionText}>Security</Text>
                <Text style={styles.optionDescription}>
                  Manage your MPIN and security
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="gray" />
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal
          visible={isEditorVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setEditorVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.modalBackdrop}
          >
            <View style={styles.editor}>
              <Text style={styles.editorTitle}>Personal Information</Text>
              <ScrollView keyboardShouldPersistTaps="handled">
                <Text style={styles.fieldLabel}>Full name</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={draft.name}
                  onChangeText={(name) => setDraft({ ...draft, name })}
                  autoCapitalize="words"
                  placeholder="Full name"
                />
                <Text style={styles.fieldLabel}>Email</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={draft.email}
                  onChangeText={(email) => setDraft({ ...draft, email })}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="Email address"
                />
                <Text style={styles.fieldLabel}>Phone</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={draft.phone}
                  onChangeText={(phone) => setDraft({ ...draft, phone })}
                  keyboardType="phone-pad"
                  placeholder="Phone number"
                />
                <Text style={styles.fieldLabel}>Address</Text>
                <TextInput
                  style={[styles.fieldInput, styles.addressInput]}
                  value={draft.address}
                  onChangeText={(address) => setDraft({ ...draft, address })}
                  multiline
                  placeholder="Address"
                />
              </ScrollView>
              <View style={styles.editorActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setEditorVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={saveProfile}
                >
                  <Text style={styles.saveButtonText}>Save changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* BOTTOM NAVIGATION */}
        <BottomNav
          active="home"
          onHome={() => router.replace("/home")}
          onTransactions={() => router.replace("/transactions")}
          onProfile={() => router.replace("/profile")}
          onLogout={() => router.replace("/")}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: { color: "white", fontSize: 25, fontWeight: "bold" },
  headerSubtitle: { color: "lightgray", fontSize: 13, marginTop: 4 },
  content: { padding: 20, paddingBottom: 30 },
  profileCard: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 85,
    height: 85,
    borderRadius: 45,
    backgroundColor: "whitesmoke",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  name: { fontSize: 21, fontWeight: "bold", color: "black" },
  email: { fontSize: 13, color: "gray", marginTop: 5 },
  memberBadge: {
    backgroundColor: "honeydew",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: 12,
  },
  memberText: { color: "forestgreen", fontSize: 11, fontWeight: "bold" },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    paddingHorizontal: 18,
    paddingTop: 18,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  optionIcon: {
    width: 42,
    height: 42,
    borderRadius: 22,
    backgroundColor: "whitesmoke",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  optionInfo: { flex: 1 },
  optionText: { fontSize: 14, fontWeight: "bold", color: "black" },
  optionDescription: { fontSize: 11, color: "gray", marginTop: 3 },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.55)",
  },
  editor: {
    maxHeight: "90%",
    backgroundColor: "white",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 22,
    paddingBottom: 30,
  },
  editorTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "black",
    marginBottom: 18,
  },
  fieldLabel: {
    color: "dimgray",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: "black",
    marginBottom: 14,
  },
  addressInput: { minHeight: 72, textAlignVertical: "top" },
  editorActions: { flexDirection: "row", gap: 10, marginTop: 4 },
  cancelButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 8,
  },
  cancelButtonText: { color: "dimgray", fontWeight: "bold" },
  saveButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 13,
    backgroundColor: "forestgreen",
    borderRadius: 8,
  },
  saveButtonText: { color: "white", fontWeight: "bold" },
});
