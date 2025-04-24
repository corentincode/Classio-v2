import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module "next-auth" {
    interface User {
      id: string
      email: string
      role?: string
      establishmentId?: string | null
      establishments?: any[] | null
    }
  
    interface Session {
      user: User & {
        id: string
        role?: string
        establishmentId?: string | null
        establishments?: any[] | null
      }
    }
  }
  
  declare module "next-auth/jwt" {
    interface JWT {
      id: string
      role?: string
      establishmentId?: string | null
      establishments?: any[] | null
    }
  }
  