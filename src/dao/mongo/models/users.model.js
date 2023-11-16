import mongoose from "mongoose";

const usersCollection = "users";

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  lastname: String,
  email: {
    type: String,
    require: true,
    unique: true,
  },
  age: Number,
  password: {
    type: String,
    require: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

export const usersModel = mongoose.model(usersCollection, userSchema);
