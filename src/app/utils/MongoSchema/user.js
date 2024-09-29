import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    // required: true,
  },
  credits: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

const preloadedaudioSchema = new mongoose.Schema({
  audios: {
    type: Array,
    required: true,
  },
});

const preloadedaudio =
  mongoose.models.preloadedaudio ||
  mongoose.model("preloadedaudio", preloadedaudioSchema);

export { preloadedaudio };

export default User;
