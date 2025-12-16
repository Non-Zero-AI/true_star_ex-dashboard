// Authentication configuration
export const ALLOWED_DOMAINS = ['@truestarcapital.com', '@nonzeroai.com'] as const

export const ADMIN_EMAILS = [
  'brant@truestarcapital.com',
  'jessica@truestarcapital.com',
  'joseph@nonzeroai.com',
] as const

export const DEFAULT_USER_PASSWORD = 'Godisgood!'
export const DEFAULT_ADMIN_PASSWORD = 'GodisGreat!'

export function isValidEmailDomain(email: string): boolean {
  return ALLOWED_DOMAINS.some((domain) => email.endsWith(domain))
}

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email as any)
}

export function getExpectedPassword(email: string): string {
  return isAdminEmail(email) ? DEFAULT_ADMIN_PASSWORD : DEFAULT_USER_PASSWORD
}


