import { Document } from 'mongoose';

export interface IPublisher {
  publisherId: string,
  name: string;
}

export interface IPublisherDocument extends IPublisher, Document {}
