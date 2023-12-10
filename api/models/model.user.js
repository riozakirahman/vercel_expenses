const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 2,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          // Regular expression for a basic email validation
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email format",
      },
    },
    role: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true, type: Date }
);
const User = mongoose.model("user", userSchema);
const userChangeStream = User.watch();

// Event listener for change events
userChangeStream.on("change", (change) => {
  console.log("Change event:", change);
});

module.exports = User;
