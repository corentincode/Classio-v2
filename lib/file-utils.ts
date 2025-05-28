// Utilitaires pour la gestion des fichiers
export function validateFileType(fileType: string): boolean {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]
  
    return allowedTypes.includes(fileType)
  }
  
  export function validateFileSize(fileSize: number, maxSize: number = 10 * 1024 * 1024): boolean {
    return fileSize <= maxSize
  }
  
  export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
  
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
  
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }
  
  export function getFileIcon(fileType: string): string {
    if (fileType.startsWith("image/")) return "🖼️"
    if (fileType === "application/pdf") return "📄"
    if (fileType.includes("word")) return "📝"
    if (fileType.includes("excel") || fileType.includes("spreadsheet")) return "📊"
    if (fileType.startsWith("text/")) return "📄"
    return "📎"
  }
  
  export function generateFileName(originalName: string): string {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = originalName.split(".").pop()
    return `${timestamp}-${randomString}.${extension}`
  }
  