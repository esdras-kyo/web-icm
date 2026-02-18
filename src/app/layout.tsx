import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import { dark } from "@clerk/themes";
import CookieBanner from "./components/CookieBanner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{ theme: dark }}
      localization={ptBR}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInForceRedirectUrl="/welcome?from=signin"
      signInFallbackRedirectUrl="/welcome?from=signin"
      signUpFallbackRedirectUrl="/welcome?from=signup"
      signUpForceRedirectUrl="/welcome?from=signup"
    >
      <html lang="pt-BR">
        <body className="bg-page bg-black">{children}<CookieBanner /></body>
      </html>
    </ClerkProvider>
  );
}