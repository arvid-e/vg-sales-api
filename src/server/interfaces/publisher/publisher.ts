import { Document } from 'mongoose'

export interface IPublisher {
  publisher: string
}

export interface IPublisherDocument extends IPublisher, Document {}
