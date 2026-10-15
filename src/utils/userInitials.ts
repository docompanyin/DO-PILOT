/**
 * Extracts 1-2 uppercase initials/letters from a user's name for profile badge display.
 * Examples:
 * - "Rahul Verma" -> "RV"
 * - "Bimal Kumar" -> "BK"
 * - "John Doe Smith" -> "JS"
 * - "Bimal" -> "BI"
 * - "A" -> "A"
 */
export const getUserInitials = (name?: string | null): string => {
  if (!name || typeof name !== 'string') return 'U';
  const trimmed = name.trim();
  if (!trimmed) return 'U';

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    const first = words[0][0] || '';
    const last = words[words.length - 1][0] || '';
    return (first + last).toUpperCase();
  }

  // Single word name: take the first two letters if available
  if (words[0].length >= 2) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return words[0].toUpperCase();
};

export default getUserInitials;
