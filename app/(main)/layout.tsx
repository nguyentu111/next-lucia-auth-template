import { requiredAuth } from "@/lib/auth";
import { AuthProvider, useRequiredAuth } from "@/providers/auth-provider";

export default async function PrivatePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, session } = await requiredAuth();
  return (
    <AuthProvider user={user} session={session}>
      {children}
    </AuthProvider>
  );
}
