export function caesarEncrypt(text: string, shift: number = 3): string {
  return text
    .split('')
    .map(char => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0)
        const base = code >= 65 && code <= 90 ? 65 : 97
        return String.fromCharCode(((code - base + shift) % 26) + base)
      }
      return char
    })
    .join('')
}

export function caesarDecrypt(text: string, shift: number = 3): string {
  return caesarEncrypt(text, 26 - shift)
}

export function hashPassword(password: string): string {
  return caesarEncrypt(password, 7) // Using shift of 7 for password encryption
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}
