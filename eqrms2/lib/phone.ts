/**
 * Normalizes phone numbers to E.164 format
 * @param phone - Input phone number (can be various formats)
 * @param defaultCountryCode - Default country code to prepend if missing
 * @returns Normalized phone number in E.164 format or null if invalid
 */
export function normalizePhone(phone: string, defaultCountryCode: string = '+91'): string | null {
    if (!phone || typeof phone !== 'string') {
      return null
    }
  
    // Remove all non-digit characters except +
    let cleaned = phone.replace(/[^\d+]/g, '')
    
    // If it already starts with +, use as is
    if (cleaned.startsWith('+')) {
      // Ensure it has a reasonable length (country code + number)
      if (cleaned.length >= 10 && cleaned.length <= 15) {
        return cleaned
      }
      return null
    }
    
    // If it starts with 0, remove it (common in some countries)
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1)
    }
    
    // If it's 10 digits (typical for Indian numbers), add default country code
    if (cleaned.length === 10 && /^\d{10}$/.test(cleaned)) {
      return `${defaultCountryCode}${cleaned}`
    }
    
    // If it's 11-12 digits, assume it already has country code
    if (cleaned.length >= 11 && cleaned.length <= 12 && /^\d+$/.test(cleaned)) {
      return `+${cleaned}`
    }
    
    // If it's 13-15 digits, assume it already has country code
    if (cleaned.length >= 13 && cleaned.length <= 15 && /^\d+$/.test(cleaned)) {
      return `+${cleaned}`
    }
    
    // If we can't determine a valid format, return null
    return null
  }