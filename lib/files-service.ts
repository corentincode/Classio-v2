// Client pour interagir avec votre API VPS
export class VPSClient {
  private baseUrl: string
  private apiKey: string

  constructor() {
    this.baseUrl = process.env.VPS_API_URL || ""
    this.apiKey = process.env.VPS_API_KEY || ""
  }

  async uploadFile(file: File, folder = "messages"): Promise<{ url: string; path: string; filename: string }> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", folder)

    const response = await fetch(`${this.baseUrl}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Upload failed: ${response.status} - ${errorText}`)
    }

    return await response.json()
  }

  async deleteFile(path: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/files`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path }),
    })

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.status}`)
    }
  }

  getFileUrl(path: string): string {
    return `${process.env.VPS_STORAGE_URL}/${path}`
  }
}

export const vpsClient = new VPSClient()
