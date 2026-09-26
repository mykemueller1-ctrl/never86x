/** X, Instagram, Facebook, and other in-app webviews block Google (disallowed_useragent). */
export function isEmbeddedWebview(userAgent: string): boolean {
  return /Twitter|FBAN|FBAV|Instagram|TikTok|Snapchat|MicroMessenger|Line\/|Musical_ly|;\s*wv\)/i.test(userAgent);
}

export function showGoogleSignIn(userAgent: string, clientId: string | undefined): boolean {
  return Boolean(clientId && clientId.trim()) && !isEmbeddedWebview(userAgent);
}
