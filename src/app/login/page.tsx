import { LoginScreen } from "@/components/LoginScreen";
import { SHARE_LINE, pageMeta } from "@/lib/brand";

export const metadata = pageMeta("/login", "Sign in", SHARE_LINE);

export default function LoginPage() {
  const googleConfigured = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
  return <LoginScreen googleConfigured={googleConfigured} />;
}
