import { Document, Types } from 'mongoose';

export interface IPublisher {
  name: string;
}

export interface IPublisherDocument extends IPublisher, Document {
  _id: Types.ObjectId;
  platformId: string;
}

export interface IPublisherQuery {
  page?: number;
  limit?: number;
  query?: any;
}
