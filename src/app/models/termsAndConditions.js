import mongoose from "mongoose";

const termsAndConditionsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  accepted: {
    type: Boolean,
    default: false,
  },
  acceptedAt: {
    type: Date,
    default: null,
  },
});

const TermsAndConditions =
  mongoose.models.TermsAndConditions ||
  mongoose.model("TermsAndConditions", termsAndConditionsSchema);

export default TermsAndConditions;
