import mongoose from "mongoose";

// Virtual starting balance for new paper-trading accounts.
export const DEFAULT_STARTING_BALANCE = 100000;

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: DEFAULT_STARTING_BALANCE,
    },
  },
  { timestamps: true }
);

// Existing users saved before the balance field existed won't have it in the
// DB; this keeps every read of balance safe without needing a migration.
export const getUserBalance = (user) => user?.balance ?? DEFAULT_STARTING_BALANCE;

const User = mongoose.model("User", UserSchema);

export default User;