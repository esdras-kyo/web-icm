import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import { dark } from "@clerk/themes";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{ theme: dark }}
      localization={ptBR}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInForceRedirectUrl="/"
      signInFallbackRedirectUrl="/"
    >
      <html lang="pt-BR">
        <body className="bg-page bg-black">{children}</body>
      </html>
    </ClerkProvider>
  );
}