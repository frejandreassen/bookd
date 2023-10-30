import { LoginForm } from "@wasp/auth/forms/Login";
import { SignupForm } from "@wasp/auth/forms/Signup";
import { VerifyEmailForm } from "@wasp/auth/forms/VerifyEmail";
import { ForgotPasswordForm } from "@wasp/auth/forms/ForgotPassword";
import { ResetPasswordForm } from "@wasp/auth/forms/ResetPassword";
import { Link } from "react-router-dom";

export function Login() {
  return (
    <Layout>
      <LoginForm appearance={{
                colors: {
                  brand: 'var(--auth-form-brand)',
                  brandAccent: 'var(--auth-form-brand-accent)',
                  submitButtonText: 'var(--auth-form-submit-button-text-color)',
                }
              }}/>
      <br />
      <span className="text-sm font-medium text-gray-900">
        Don't have an account yet? <Link to="/signup">go to signup</Link>.
      </span>
      <br />
      <span className="text-sm font-medium text-gray-900">
        Forgot your password? <Link to="/request-password-reset">reset it</Link>
        .
      </span>
    </Layout>
  );
}

export function Signup() {
  return (
    <Layout>
      <SignupForm appearance={{
                colors: {
                  brand: 'var(--auth-form-brand)',
                  brandAccent: 'var(--auth-form-brand-accent)',
                  submitButtonText: 'var(--auth-form-submit-button-text-color)',
                }
              }}/>
      <br />
      <span className="text-sm font-medium text-gray-900">
        I already have an account (<Link to="/login">go to login</Link>).
      </span>
    </Layout>
  );
}

export function EmailVerification() {
  return (
    <Layout>
      <VerifyEmailForm appearance={{
                colors: {
                  brand: 'var(--auth-form-brand)',
                  brandAccent: 'var(--auth-form-brand-accent)',
                  submitButtonText: 'var(--auth-form-submit-button-text-color)',
                }
              }}/>
      <br />
      <span className="text-sm font-medium text-gray-900">
        If everything is okay, <Link to="/login">go to login</Link>
      </span>
    </Layout>
  );
}

export function RequestPasswordReset() {
  return (
    <Layout>
      <ForgotPasswordForm appearance={{
                colors: {
                  brand: 'var(--auth-form-brand)',
                  brandAccent: 'var(--auth-form-brand-accent)',
                  submitButtonText: 'var(--auth-form-submit-button-text-color)',
                }
              }}/>
    </Layout>
  );
}

export function PasswordReset() {
  return (
    <Layout>
      <ResetPasswordForm appearance={{
                colors: {
                  brand: 'var(--auth-form-brand)',
                  brandAccent: 'var(--auth-form-brand-accent)',
                  submitButtonText: 'var(--auth-form-submit-button-text-color)',
                }
              }}/>
      <br />
      <span className="text-sm font-medium text-gray-900">
        If everything is okay, <Link to="/login">go to login</Link>
      </span>
    </Layout>
  );
}

// A layout component to center the content
export function Layout({ children }) {
  return (
    <div className="w-full h-full bg-white">
      <div className="min-w-full min-h-[75vh] flex items-center justify-center">
        <div className="w-full h-full max-w-sm p-5 bg-white">
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}