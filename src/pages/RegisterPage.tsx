// pages/RegisterPage.tsx
import { VStack, Heading, Text, Button, Link } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/Authlayout";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthField } from "@/components/auth/AuthField";
import { PasswordField } from "@/components/auth/PasswordField";
import { FirebaseError } from "firebase/app";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/useAuth";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { register, user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  function mapRegisterError(error: unknown) {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/email-already-in-use":
          return "This email is already registered.";
        case "auth/invalid-email":
          return "Invalid email address.";
        case "auth/weak-password":
          return "Password must be at least 6 characters.";
        case "auth/operation-not-allowed":
          return "Email/Password sign-up is not enabled in Firebase.";
        default:
          return `Register failed (${error.code}).`;
      }
    }

    return "Register failed. Please try again.";
  }

  function validate() {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    const phoneRegex = /^[0-9]{8,15}$/;

    if (!phoneRegex.test(phone)) {
      newErrors.phone = "Phone number must be 8–15 digits";
    }

    if (!dob) {
      newErrors.dob = "Age is required";
    } else if (!/^\d+$/.test(dob)) {
      newErrors.dob = "Age must be a number";
    } else if (dob.length >= 3) {
      newErrors.dob = "Age must be less than 100";
    } else if (Number(dob) <= 18) {
      newErrors.dob = "You must be older than 18";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handeleRegister() {
    if (!validate()) return;
    try {
      await register(name, email, password, phone, dob);
    } catch (error) {
      console.error("Register error:", error);
      setErrors((prev) => ({
        ...prev,
        email: mapRegisterError(error),
      }));
    }
  }

  return (
    <AuthLayout>
      <AuthCard>
        <VStack gap={4} align="stretch" textAlign="center">
          <Heading>Sign up!</Heading>
          <Text color="text.muted">
            Register to our service to be able to invite clients!
          </Text>

          <AuthField
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          <AuthField
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <PasswordField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <AuthField
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
          />

          <AuthField
            placeholder="Date Of Birth"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            error={errors.dob}
          />

          <Button
            bg="button.primary"
            borderRadius="button"
            color="text.primary"
            onClick={handeleRegister}
          >
            Register
          </Button>

          <Text fontSize="sm">
            Already have an account?{" "}
            <Link asChild textDecoration="underline">
              <RouterLink to="/login">Log In</RouterLink>
            </Link>
          </Text>
        </VStack>
      </AuthCard>
    </AuthLayout>
  );
}
