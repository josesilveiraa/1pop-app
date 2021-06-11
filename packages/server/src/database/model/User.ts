import { Schema, Document, model, HookNextFunction } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
  minecraftUsername: String,
  password: {
    type: String,
    select: false,
  },
  hardwareId: String,
  isBanned: {
    type: Boolean,
    select: false,
  },
  isAdmin: {
    type: Boolean,
    select: false,
    default: false,
  },
});

interface IUser extends Document {
  minecraftUsername: string;
  hardwareId: string;
  password: string;
  isAdmin: boolean;
  isBanned: boolean;
}

UserSchema.pre('save', async (next: HookNextFunction) => {
  const self: IUser = this;
  if (!self.isModified('password')) {
    next();
  }

  self.password = bcrypt.hashSync(self.password, 8);
  next();
});

export default model<IUser>('User', UserSchema);
