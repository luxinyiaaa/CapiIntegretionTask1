import { VStack, Heading, Text, Button, Link } from "@chakra-ui/react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

import { AuthLayout } from "@/components/auth/Authlayout";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthField } from "@/components/auth/AuthField";
import { PasswordField } from "@/components/auth/PasswordField";

import { useAuth } from "@/context/useAuth";

type LoginLocationState = {
  reason?: "session_expired";
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LoginLocationState | null;
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

  function validate() {
    let ok = true;

    // reset
    setEmailError("");
    setPasswordError("");

    if (!emailRegex.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      ok = false;
    }

    if (!password.trim()) {
      setPasswordError("Password is required.");
      ok = false;
    }

    return ok;
  }

  async function handleLogin() {
    if (!validate()) return;

    try {
      const ok = await login(email.trim(), password);
      if (!ok) {
        setPasswordError("Invalid email or password");
        return;
      }
      navigate("/dashboard");
    } catch {
      setPasswordError("Invalid email or password");
    }
  }

  return (
    <AuthLayout>
      <AuthCard>
        <VStack gap={{ base: 3, md: 4 }} align="stretch" textAlign="center">
          <Heading textStyle="h1">Welcome</Heading>

          <Text color="text.muted">
            Great to see you! Please enter your account details.
          </Text>
          {locationState?.reason === "session_expired" ? (
            <Text color="orange.500" fontSize="sm">
              Session expired. Please log in again.
            </Text>
          ) : null}

          <AuthField
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
          />

          <PasswordField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
          />

          <Button
            w="full"
            h="button"
            bg="button.primary"
            borderRadius="button"
            color="text.primary"
            onClick={handleLogin}
          >
            Login
          </Button>

          <Text fontSize="sm" color="text.primary">
            Don’t have an account?{" "}
            <Link asChild textDecoration="underline">
              <RouterLink to="/register">Sign Up</RouterLink>
            </Link>
          </Text>
        </VStack>
      </AuthCard>
    </AuthLayout>
  );
}
