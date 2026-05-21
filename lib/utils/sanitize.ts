/**
 * Input Sanitization Utilities
 * Prevents XSS and HTML injection attacks
 */

/**
 * Sanitize text input by removing HTML tags and dangerous characters
 */
export function sanitizeText(input: string): string {
    if (!input) return '';

    // Remove HTML tags
    let sanitized = input.replace(/<[^>]*>/g, '');

    // Escape special HTML characters
    sanitized = sanitized
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');

    return sanitized;
}

/**
 * Sanitize email input
 */
export function sanitizeEmail(email: string): string {
    if (!email) return '';

    // Remove any characters that aren't valid in emails
    return email.replace(/[^a-zA-Z0-9@._+-]/g, '');
}

/**
 * Sanitize phone input
 */
export function sanitizePhone(phone: string): string {
    if (!phone) return '';

    // Only allow digits, spaces, +, -, (, )
    return phone.replace(/[^\d\s\-\+\(\)]/g, '');
}

/**
 * Sanitize URL input
 */
export function sanitizeUrl(url: string): string {
    if (!url) return '';

    // Basic URL validation and sanitization
    try {
        const parsed = new URL(url);
        // Only allow http and https protocols
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            return '';
        }
        return parsed.toString();
    } catch {
        // If not a valid URL, return empty
        return url.startsWith('http') ? url : '';
    }
}

/**
 * Truncate text to maximum length
 */
export function truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength);
}

/**
 * Sanitize and truncate text input
 */
export function sanitizeAndTruncate(input: string, maxLength: number): string {
    const sanitized = sanitizeText(input);
    return truncateText(sanitized, maxLength);
}
