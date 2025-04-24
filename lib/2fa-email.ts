// lib/2fa-email.ts
export function generateCode(): string {
    // Générer un code aléatoire à 6 chiffres
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  export function isCodeExpired(expiryDate: Date | null): boolean {
    if (!expiryDate) return true;
    return new Date() > expiryDate;
  }