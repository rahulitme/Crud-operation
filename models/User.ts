import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "admin" },
    name: { type: String, required: true },
  },
  { timestamps: true },
)

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password)
}

export default mongoose.models.User || mongoose.model("User", UserSchema)
