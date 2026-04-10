import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    methods: {
      comparePassword: async function (candidatePassword: string) {
        return bcrypt.compare(candidatePassword, this.password);
      },
    },
  },
);

// Hook que se ejecuta antes de guardar
userSchema.pre("save", async function () {
  // Solo encripta si la contraseña fue modificada (o es nueva)
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

const User = model("User", userSchema);
export { User };
