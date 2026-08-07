"use client";

import { FormEvent, useId, useState } from "react";
import styles from "./LegacyChatbot.module.scss";

type AuthMode = "signIn" | "createAccount" | "forgotPassword";
type Feedback = { kind: "info" | "error"; text: string } | null;

function EyeIcon({ hidden }: { hidden: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        d={
          hidden
            ? "M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 4.2A10.8 10.8 0 0 1 12 4c5.5 0 9 5 9 5a15.4 15.4 0 0 1-2.1 2.6M6.2 6.2C4.2 7.5 3 9 3 9s3.5 5 9 5c1 0 1.9-.2 2.8-.5"
            : "M3 12s3.5-5 9-5 9 5 9 5-3.5 5-9 5-9-5-9-5Zm9 2a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        }
      />
    </svg>
  );
}

export function LegacyChatbot() {
  const fieldId = useId();
  const [mode, setMode] = useState<AuthMode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const selectMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setPassword("");
    setConfirmation("");
    setShowPassword(false);
    setFeedback(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === "createAccount" && password !== confirmation) {
      setFeedback({ kind: "error", text: "The two preview passwords do not match." });
      return;
    }

    const text =
      mode === "signIn"
        ? "Archive preview complete. No sign-in request was sent and no session was created."
        : mode === "createAccount"
          ? "Account creation is disabled in this preserved interface. Nothing was stored or transmitted."
          : "Password recovery is disabled in this preserved interface. No reset email was sent.";

    setPassword("");
    setConfirmation("");
    setShowPassword(false);
    setFeedback({ kind: "info", text });
  };

  const isForgotPassword = mode === "forgotPassword";
  const title =
    mode === "signIn"
      ? "Sign in to your account"
      : mode === "createAccount"
        ? "Create a new account"
        : "Reset your password";

  return (
    <section className={styles.page} aria-labelledby={`${fieldId}-title`}>
      <div className={styles.authenticator}>
        <div className={styles.card}>
          {!isForgotPassword && (
            <div className={styles.tabs} role="tablist" aria-label="Authentication mode">
              <button
                type="button"
                role="tab"
                aria-selected={mode === "signIn"}
                className={mode === "signIn" ? styles.activeTab : undefined}
                onClick={() => selectMode("signIn")}
              >
                Sign In
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "createAccount"}
                className={mode === "createAccount" ? styles.activeTab : undefined}
                onClick={() => selectMode("createAccount")}
              >
                Create Account
              </button>
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
            <h1 className={styles.srOnly} id={`${fieldId}-title`}>
              {title}
            </h1>

            {isForgotPassword && (
              <p className={styles.instructions}>
                Enter an email address to preview the original recovery flow. No
                message will be sent.
              </p>
            )}

            <label className={styles.field} htmlFor={`${fieldId}-email`}>
              <span>Email</span>
              <input
                id={`${fieldId}-email`}
                name="archiveEmail"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your Email"
                autoComplete="off"
                required
              />
            </label>

            {!isForgotPassword && (
              <label className={styles.field} htmlFor={`${fieldId}-password`}>
                <span>Password</span>
                <span className={styles.passwordControl}>
                  <input
                    id={`${fieldId}-password`}
                    name="archivePassword"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your Password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    className={styles.showPassword}
                    aria-pressed={showPassword}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    <EyeIcon hidden={showPassword} />
                    <span className={styles.srOnly}>
                      {showPassword ? "Password is shown" : "Password is hidden"}
                    </span>
                  </button>
                </span>
              </label>
            )}

            {mode === "createAccount" && (
              <label className={styles.field} htmlFor={`${fieldId}-confirmation`}>
                <span>Confirm Password</span>
                <input
                  id={`${fieldId}-confirmation`}
                  name="archivePasswordConfirmation"
                  type={showPassword ? "text" : "password"}
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                  placeholder="Confirm your Password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </label>
            )}

            {feedback && (
              <p
                className={`${styles.feedback} ${
                  feedback.kind === "error" ? styles.feedbackError : styles.feedbackInfo
                }`}
                role={feedback.kind === "error" ? "alert" : "status"}
              >
                {feedback.text}
              </p>
            )}

            <button type="submit" className={styles.submitButton}>
              {mode === "signIn"
                ? "Sign in"
                : mode === "createAccount"
                  ? "Create Account"
                  : "Send reset code"}
            </button>

            {mode === "signIn" && (
              <button
                type="button"
                className={styles.forgotLink}
                onClick={() => selectMode("forgotPassword")}
              >
                Forgot your password?
              </button>
            )}

            {isForgotPassword && (
              <button
                type="button"
                className={styles.backLink}
                onClick={() => selectMode("signIn")}
              >
                Back to Sign In
              </button>
            )}
          </form>
        </div>

      </div>
    </section>
  );
}
