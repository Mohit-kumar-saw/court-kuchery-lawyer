import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
  ActivityIndicator,
} from "react-native";

import { useAuth } from "@/contexts/AuthContext";

export default function LawyerSignupScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [specialization, setSpecialization] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [ratePerMinute, setRatePerMinute] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      setError("");
      setLoading(true);

      if (
        !name ||
        !email ||
        !phone ||
        !password ||
        !specialization ||
        !experienceYears ||
        !ratePerMinute
      ) {
        setError("All fields are required");
        return;
      }

      await signUp(
        name,
        email,
        phone,
        password,
        specialization,
        experienceYears,
        ratePerMinute
      );

      router.replace("/(tabs)");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Lawyer Registration</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* NAME */}
        <Input icon="person-outline" placeholder="Full Name" value={name} setValue={setName} />

        {/* EMAIL */}
        <Input
          icon="mail-outline"
          placeholder="Email"
          value={email}
          setValue={setEmail}
          keyboardType="email-address"
        />

        {/* PHONE */}
        <Input
          icon="call-outline"
          placeholder="Phone Number"
          value={phone}
          setValue={setPhone}
          keyboardType="phone-pad"
        />

        {/* PASSWORD */}
        <Input
          icon="lock-closed-outline"
          placeholder="Password"
          value={password}
          setValue={setPassword}
          secure
        />

        {/* SPECIALIZATION */}
        <Input
          icon="briefcase-outline"
          placeholder="Specialization (e.g. Criminal)"
          value={specialization}
          setValue={setSpecialization}
        />

        {/* EXPERIENCE */}
        <Input
          icon="time-outline"
          placeholder="Experience (Years)"
          value={experienceYears}
          setValue={setExperienceYears}
          keyboardType="numeric"
        />

        {/* RATE */}
        <Input
          icon="cash-outline"
          placeholder="Rate per minute (₹)"
          value={ratePerMinute}
          setValue={setRatePerMinute}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register as Lawyer</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.link}>Already registered? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* 🔹 Reusable Input Component */
function Input({
  icon,
  placeholder,
  value,
  setValue,
  secure,
  keyboardType,
}: any) {
  return (
    <View style={styles.inputContainer}>
      <Ionicons name={icon} size={20} color="#2563EB" />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
        secureTextEntry={secure}
        keyboardType={keyboardType}
      />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 24, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 30 },
  error: { color: "red", marginBottom: 10 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2563EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  input: { flex: 1, paddingVertical: 14 },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#2563EB",
  },
});
