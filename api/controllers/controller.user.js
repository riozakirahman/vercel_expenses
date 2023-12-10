const bcrypt = require("bcrypt");
const User = require("../models/model.user");
const ExcelJS = require("exceljs");
const jwt = require("jsonwebtoken");

const createUser = async (req, res, next) => {
  const saltRounds = 10;
  const { username, password, role, email } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    if (hashedPassword) {
      const userDoc = User.create({
        username,
        password: hashedPassword,
        role,
        email,
      });
      const newUser = await userDoc;
      res.status(200).json(newUser);
    } else {
      const err = new Error();
      err.statusCode = 500;
      throw err;
    }
  } catch (error) {
    if (error.name == "ValidationError") {
      error.statusCode = 400;
    }
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const saltRounds = 10;
  const { username, password, role, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    const updDoc = await User.findByIdAndUpdate(
      id,
      { username, password: hashedPassword, role, email },
      { new: true, runValidators: true }
    );
    if (!updDoc) {
      const err = new Error();
      err.message = "User not found";
      err.name = "InvalidUser";
      err.statusCode = 404;
      throw err;
    }
    return res.status(200).json(updDoc);
  } catch (error) {
    if (error.name == "CastError") {
      error.statusCode = 400;
      error.message = "Make sure user id is correct";
    } else if (error.name == "ValidationError") {
      error.statusCode = 400;
    }
    next(error);
  }
};

const main = async (req, res, next) => {
  let minute = 60 * 1000;
  res.cookie("cookie_name", "cookie_value", { maxAge: minute });
  return res.send("cookie has been set!");
};

const exportToExcel = async (req, res, next) => {
  try {
    // Fetch data from the database
    const users = await User.find();

    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    // Define the header row
    worksheet.addRow(["Username", "Email", "Role"]);

    // Add data rows
    users.forEach((user) => {
      worksheet.addRow([user.username, user.email, user.role.join(", ")]);
    });

    // Set response headers for Excel file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");

    // Write the Excel file to the response stream
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).select("+password");
    if (user) {
      const isPasswordTrue = await bcrypt.compare(password, user.password);
      if (isPasswordTrue) {
        const token = jwt.sign(
          { id: user._id, role: user.role, tenant: user.tenant },
          process.env.secret_key || "1234",
          {
            expiresIn: "7d",
          }
        );
        res.cookie("token", token);
        res.status(200).json({ token, status: "authenticated" });
      } else {
        const err = new Error("Invalid Password!");
        err.statusCode = 400;
        throw err;
      }
    } else {
      const err = new Error("Invalid username!");
      err.statusCode = 400;
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  updateUser,
  exportToExcel,
  login,
  main,
};
