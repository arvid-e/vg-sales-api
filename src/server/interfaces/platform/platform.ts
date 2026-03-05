import { Document } from 'mongoose'

export interface IPlatform {
  platform: string
}

export interface IPlatformDocument extends IPlatform, Document {}
