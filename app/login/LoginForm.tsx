"use client";

import { emailLogin, signup } from "./actions";
import "./login.css";
import '../styles/globals.css'; // adjust path as needed

export default function LoginForm({ message }: { message: string }) {
  return (
    <section className="login-container">
      <div className="login-card">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="text-sm text-gray-500">
            Enter your email below to login to your account
          </p>
        </div>
        <form id="login-form" className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
              className="form-input"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              minLength={6}
              name="password"
              id="password"
              type="password"
              required
              className="form-input"
            />
          </div>
          {message && (
            <div className="text-sm font-medium text-red-600">
              {message}
            </div>
          )}
          <button
            type="submit"
            formAction={emailLogin}
            className="login-button"
          >
            Login
          </button>
        </form>
        <div className="text-center text-sm mt-4">
          Don&apos;t have an account?{" "}
          <button
            type="submit"
            formAction={signup}
            form="login-form"
            className="signup-link"
          >
            Sign up
          </button>
        </div>
      </div>
    </section>
  );
}
