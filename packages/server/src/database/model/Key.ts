import { Schema, Document, model } from 'mongoose';

const KeySchema = new Schema({
  content: String,
  expirationDate: Date,
});

interface IKey extends Document {
  content: string;
  expirationDate: Date;
}

export default model<IKey>('Key', KeySchema);
