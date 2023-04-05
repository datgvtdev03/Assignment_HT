const express = require("express");
const userModel = require("../models/user");
const multer = require("multer");
const fs = require("fs");

const app = express();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //neu chua co folder thi tao ra folder
    var dir = "./uploads";

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, "uploads");
  },

  filename: function (req, file, cb) {
    let fileName = file.originalname;
    arr = fileName.split(".");

    let newFileName = "";

    for (let i = 0; i < arr.length; i++) {
      if (i != arr.length - 1) {
        newFileName += arr[i];
      } else {
        newFileName += "-" + Date.now() + "." + arr[i];
      }
    }
    cb(null, newFileName);
  },
});
var upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.render("users/addOrEdit");
});

// add data
app.post("/add", upload.single("file"), (req, res) => {
  console.log("co gia tri: ", req.body);

  const fullName = req.body.fullName;
  const email = req.body.email;
  const password = req.body.password;

  if (req.body.id == "") {
    //add
    // addUser(req, res);
    let user = new userModel({
      fullName: fullName,
      email: email,
      password: password,
      avatar: req.file,
    });
    user
      .save()
      .then((user) => {
        res.json(user);
        res.render("users/addOrEdit", {
          viewTitle: "Thêm thành viên",
        });
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    //sua
    updateUser(req, res);
  }
});

// function addUser(req, res) {
//     let user = new userModel({
//         fullName: req.body.fullName,
//         email: req.body.email,
//         password: req.body.password,
//         avatar: req.file
//     })
//     try {
//         user.save();
//         res.render('users/addOrEdit', {
//             viewTitle: "Thêm thành viên"
//         })
//     } catch (err) {
//         res.status(500).send(err);
//     }
// }

function updateUser(req, res) {
  userModel
    .findByIdAndUpdate({ _id: req.body.id }, req.body, { new: true })
    .then((updateUser) => {
      console.log("Updated user:", updateUser);
      res.redirect("/user/list");
    })
    .catch((err) => {
      console.error("Error updating user:", err);
    });
}

app.get("/list", async (req, res) => {
  userModel.find({}).then((users) => {
    res.render("users/view-users", {
      users: users.map((user) => user.toJSON()),
    });
  });
});

app.get("/edit/:id", async (req, res) => {
  await userModel
    .findById(req.params.id)
    .then((user) => {
      res.render("users/addOrEdit", {
        user: user.toJSON(),
        viewTitle: "Sửa thành viên",
      });
      console.log("Data: ", user);
    })
    .catch((err) => {
      console.error("err: ", err);
    });
});

app.get("/delete/:id", async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id, req.body);
    if (!user) {
      res.status(404).send("Khong co user de xoa");
    } else {
      res.redirect("/user/list");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/register", upload.single("file"), (req, res) => {
  let user = new userModel({
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    avatar: req.file,
  });
  user
    .save()
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = app;
