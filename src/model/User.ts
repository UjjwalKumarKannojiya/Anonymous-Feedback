import mongoose, { Document, Schema } from 'mongoose';

export interface Message extends Document {
    Content:string;
    createdAt:Date;
}

const MessageSchema: Schema<Message> = new Schema({
    Content: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now }
});
export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifycode: string;
    verifycodeexp: Date;
    isverified: boolean;
    isAccptingMessages: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: { type: String, required: [true,"Username is required"], trim: true, unique: true },
    email: { type: String, required: [true,"Email is required"], unique: true, match: [/.+\@.+\..+/, "Please enter a valid email"] },
    password: { type: String, required: [true,"Password is required"] },
    verifycode: { type: String, required: [true,"Verify code is required"] },
    verifycodeexp: { type: Date, required: [true,"Verify code expiration is required"] },
    isverified: { type: Boolean,  default: false },
    isAccptingMessages: { type: Boolean,  default: true },
    messages: { type: [MessageSchema], required: true, default: [] }
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);
export default UserModel;