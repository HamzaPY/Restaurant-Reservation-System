const express = require('express');
const app = express();
const adminRoute = express.Router();
var passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
var authenticate = require('../authenticate');
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
var nodemailer = require("nodemailer");

let User = require('../models/user');
let Restaurant = require('../models/restaurant');
let Customer = require('../models/customer');
let Menu = require('../models/menu');
let Rating = require('../models/rating');

const { isValidObjectId } = require('mongoose');

var storage = multer.diskStorage({
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
      if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});

cloudinary.config({
  cloud_name: 'hamzapy',
  api_key: '519318448811347',
  api_secret: 'io1nfdKZdNlLuaw-_RzAuKfCbA0'
  });

var upload = multer({storage: storage});

const cloudinaryImageUploadMethod = async file => {
  return new Promise(resolve => {
      cloudinary.uploader.upload( file , (err, res) => {
        if (err) return res.status(500).send("upload image error")
          console.log( res.secure_url )
          resolve({
            res: res.secure_url
          }) 
        }
      ) 
  })
}

// Add Photos Gallery //

adminRoute.post('/addPhotos', upload.array("uploads[]", 20), async (req, res, next) => {
  if(!req.files) {
    return res.status(500).send({ message: 'Upload fail'});
  } else {
    images = []
    for (let i = 0; i < req.files.length; i++)
    {
      const newPath = await cloudinaryImageUploadMethod(req.files[i].path)
      images.push(newPath.res)
      //images.push('../../../assets/uploads/' + req.files[i].filename);
      //images.push('/' + req.files[i].filename);
    }
    Restaurant.findOneAndUpdate({ name: req.body.rName }, {
      $push: { galleryImages: images } 
     }, (error, data) => {
      if (error) {
        return next(error);
        console.log(error)
      } else {
        res.send({status: 200});
        console.log('Gallery updated successfully')
      }
    })
  }
});

// Add Restaurant //

adminRoute.post('/addRest', upload.fields([{
  name: 'fileI', maxCount: 1
  }, {
  name: 'fileT', maxCount: 1
  }]), async (req, res, next) => {
  if(!req.files['fileI']) {
    console.log("HELLO")
    return res.status(500).send({ message: 'Upload fail'});
  } else {
    const newPath = await cloudinaryImageUploadMethod(req.files['fileI'][0].path)
    req.body.imageFile = newPath.res;
    const newPath2= await cloudinaryImageUploadMethod(req.files['fileT'][0].path)
    req.body.imageFileTitle = newPath2.res;

    const rest = new Restaurant(
      {
        image: req.body.imageFile,
        titleImage: req.body.imageFileTitle,
        name: req.body.rName,
        overview: req.body.rOver,
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        zip: req.body.zipCode,
        reservations: true,
        rating: 0,
        foodRating: 0,
        serviceRating: 0,
        ambienceRating: 0,
        valueRating: 0,
        timer: "",
        bookings: req.body.rBook,
        contact: req.body.rCont,
        website: req.body.rWeb,
        facebook: req.body.rFace,
        instagram: req.body.rInst,
        youtube: req.body.rYt,
        delivery: req.body.rDel,
        category: req.body.rCate,
        price: req.body.rPrice,
        email: req.body.rEmail,
        password: req.body.rPass,
        openingDays: req.body.rDays,
        startTime: req.body.rStart,
        endTime: req.body.rEnd
      });
      Restaurant.create(rest.save((err,data)=>
      {
        console.log('Restaurant Registered!');
        User.register(new User({username: req.body.rName}), 
        req.body.rPass, (err, user) => {
        if(err) {
          res.statusCode = 600;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
        }
        else {
            user.admin = false;
            user.email = req.body.rEmail;
            user.save((err, user) => {
            if (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.json({err: err});
              return ;
            }
            res.send({status: 200});
            passport.authenticate('local')(req, res, () => {
              console.log('Restaurant Account Registered!')
              res.json(data);
            });
          });
        }
        });
      })
      )
      .catch(err => {
        console.log('Error while registering');
        res.send('error: ' + err)
      })
  }
});

// Get Restaurant //

adminRoute.get('/getRest', (req, res, next) => {
  Restaurant.find({})
    .then(rest => {
        if (rest){
          console.log(rest);
          res.send(rest);
        }
        else
        {
          res.send("Restaurant does not exist");
        }
    })
    .catch(err => {
      res.json('error: ' + err)
    })
})

// Get Specific Restaurant //

adminRoute.route('/getSpecRest/:id').get((req, res) => {
  Restaurant.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Update Restaurant //

adminRoute.route('/updateRest/:id').put((req, res, next) => {
  Restaurant.findByIdAndUpdate(req.params.id, {
    $set: { 'name': req.body.rName, 'overview': req.body.rOver, 'location': req.body.rLoc,
    'contact': req.body.rCont, 'category': req.body.rCate, 'price': req.body.rPrice, 'email': req.body.rEmail, 'street': req.body.street,
    'city': req.body.city, 'state': req.body.state, 'country': req.body.country, 'zip': req.body.zipCode
   }
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Data updated successfully')
    }
  })
})

// Delete Restaurant //

adminRoute.route('/deleteRest/:id/:name').delete((req, res, next) => {
  Restaurant.findByIdAndDelete(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      User.findOneAndDelete({ username: req.params.name }, (error, data) => {
        if (error) {
          return next(error);
        } else {
          Menu.findOneAndDelete({ itemRest: req.params.name }, (error, data) => {
            if (error) {
              return next(error);
            } else {
              Rating.deleteMany({ userTheRest: req.params.name }, (error, data) => {
                if (error) {
                  return next(error);
                } else {
                  res.status(200).json({
                    msg: data
                  })
                }
              })
            }
          })
        }
      })
    }
  })
})

// Get Users //

adminRoute.get('/getUsers', (req, res, next) => {
  User.find({})
    .then(user => {
        if (user){
          console.log(user);
          res.send(user);
        }
        else
        {
          res.send("User does not exist");
        }
    })
    .catch(err => {
      res.json('error: ' + err)
    })
})

// Update Users Verify Email //

adminRoute.route('/verifyUserEmail/:id').put((req, res, next) => {
  User.findByIdAndUpdate(req.params.id, {
    $set: { 'emailVerify': true,
   }
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Email verified successfully')
    }
  })
})

// Edit Reservation //

adminRoute.put('/editReserve', (req, res, next) => {
    Restaurant.findOneAndUpdate({ name: req.body.rName }, {
      $set: { reservations: req.body.rReserve }
    }, (error, data) => {
      if (error) {
        return next(error);
        console.log(error)
      } else {
        res.json(data)
        console.log('Reservation updated successfully')
      }
    })
});

// Edit Rating //

adminRoute.put('/editRating', (req, res, next) => {
    Restaurant.findOneAndUpdate({ name: req.body.rName }, {
      $set: { rating: req.body.rRating, foodRating: req.body.rFood, serviceRating: req.body.rService, ambienceRating: req.body.rAmbience, valueRating: req.body.rValue }
    }, (error, data) => {
      if (error) {
        return next(error);
        console.log(error)
      } else {
        res.json(data)
        console.log('Rating updated successfully')
      }
    })
});

// Edit Booking //

adminRoute.put('/editBooking', (req, res, next) => {
  Restaurant.findOneAndUpdate({ name: req.body.rName }, {
    $set: { bookings: req.body.rBooking }
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Booking updated successfully')
    }
  })
});

// Send Contact //

adminRoute.post('/sendContact', (req, res, next) => {
  var transporter = nodemailer.createTransport({
    name: "https://www.gostro.de",
    host: "box2417.bluehost.com",
    port: 465,
    secure: true,
    auth: {
      user: 'info@gostro.de',
      pass: 'Gostro2021'
    },
    tls: {
      rejectUnauthorized: false,
    },
   });

   let mailOptions;
   if (req.body.contAddress == '')
   {
    mailOptions = {
      from: req.body.contEmail, // sender address
      to: 'info@gostro.de', // list of receivers
      subject: 'Restaurant Contact Form!', // Subject line
      html: '<p>Dear Gostro Admin, </p><p>A restaurant wants to contact you having the following details: </p><br><p>Restaurant Name: ' + req.body.contName + '</p><p>Phone Number: ' + req.body.contPhone + '</p><p>Email: ' + req.body.contEmail + '</p><p>Package: ' + req.body.contPackage + '</p><p>Message: ' + req.body.contMessage + '</p><br><p>Best regards, </p><p>' + req.body.contName + '</p>',
    };
   }
   else
   {
    mailOptions = {
      from: req.body.contEmail, // sender address
      to: 'info@gostro.de', // list of receivers
      subject: 'Restaurant Contact Form!', // Subject line
      html: '<p>Dear Gostro Admin, </p><p>A restaurant wants to contact you having the following details: </p><br><p>Restaurant Name: ' + req.body.contName + '</p><p>Restaurant Address: ' + req.body.contAddress + '</p><p>Phone Number: ' + req.body.contPhone + '</p><p>Email: ' + req.body.contEmail + '</p><p>Package: ' + req.body.contPackage + '</p><p>Message: ' + req.body.contMessage + '</p><br><p>Best regards, </p><p>' + req.body.contName + '</p>',
    };
   }

  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      console.log(err)
    else
      console.log(info);
      res.send({status: 200});
  });
});

// Notify Restaurant //

adminRoute.post('/notifyRest', (req, res, next) => {
  var transporter = nodemailer.createTransport({
    name: "https://www.gostro.de",
    host: "box2417.bluehost.com",
    port: 465,
    secure: true,
    auth: {
      user: 'info@gostro.de',
      pass: 'Gostro2021'
    },
    tls: {
      rejectUnauthorized: false,
    },
   });

  const mailOptions = {
    from: 'info@gostro.de', // sender address
    to: req.body.notifyEmail, // list of receivers
    subject: 'You got New Reservation!', // Subject line
    html: '<p>Dear ' + req.body.notifyRest +',</p><p>You got a new reservation from ' + req.body.notifyCust + ' on ' + req.body.notifyDate + ' at ' + req.body.notifyHour + ' hour. You can accept or decline the reservation in your Admin Dashboard.</p><p>Best regards, </p><p>GOSTRO</p>'// plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      console.log(err)
    else
      console.log(info);
      res.send({status: 200});
  });
});

// Notify Customer //

adminRoute.post('/notifyCust', (req, res, next) => {
  var transporter = nodemailer.createTransport({
    name: "https://www.gostro.de",
    host: "box2417.bluehost.com",
    port: 465,
    secure: true,
    auth: {
      user: 'info@gostro.de',
      pass: 'Gostro2021'
    },
   });

   const mailOptions = {
    from: 'info@gostro.de', // sender address
    to: req.body.notifyEmail, // list of receivers
    subject: 'Reservation Confirmation!', // Subject line
    html: '<p>Dear ' + req.body.notifyCust +',</p><p>Your reservation on ' + req.body.notifyDate + ' at ' + req.body.notifyHour + ' hour in ' + req.body.notifyRest + ' is ' + req.body.notifyStatus +'.</p><p>Best regards, </p><p>GOSTRO</p>'// plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      console.log(err)
    else
      console.log(info);
      res.send({status: 200});
  });
});


// Add Rating //

adminRoute.post('/addRating', (req, res, next) => {
  const rate = new Rating(
    {
      userTheRest: req.body.rRestName,
      rating: req.body.rRating,
      foodRating: req.body.rFood,
      serviceRating: req.body.rService,
      ambienceRating: req.body.rAmbience,
      valueRating: req.body.rValue,
      comment: req.body.rComment,
      userTheDate: req.body.rUserDate,
      rateUser: req.body.rRateUser
    });
    Rating.create(rate.save((err,data)=>
    {
      res.json('Rating Added!');
    })
    )
    .catch(err => {
      res.send('error: ' + err)
    })
});

// Get Rating //

adminRoute.get('/getRating', (req, res, next) => {
  Rating.find({}).populate('rateUser').exec(function (err, results) {
    if (err) {
      console.log(err);
    } else 
    {
      res.json(results)
    }
  })
})

// Add Customer //

adminRoute.post('/addCustomer', (req, res, next) => {
  const cust = new Customer(
    {
      firstname: req.body.cFirst,
      lastname: req.body.cLast,
      contactNo: req.body.cCont,
      emailAddr: req.body.cEmail,
      restName: req.body.crName,
      dateReserve: req.body.crDate,
      timeReserve: req.body.crTime,
      tableReserve: req.body.crTable,
      status: "Pending",
      reserveUser: req.body.cReserveUser
    });
    Customer.create(cust.save((err,data)=>
    {
      res.json('Customer Registered');
    })
    )
    .catch(err => {
      res.send('error: ' + err)
    })
});

// Edit Customer //

adminRoute.put('/editCustomer', upload.fields([{
  name: 'fileI', maxCount: 1
  }]), async (req, res, next) => {
    if (!req.files['fileI'])
    {
      User.findByIdAndUpdate({ _id: req.body.cId }, {
        $set: { username: req.body.cUsername, firstname: req.body.cFirst, lastname: req.body.cLast, email: req.body.cEmail }
      }, (error, data) => {
        if (error) {
          return next(error);
          console.log(error)
        } else {
          res.send({status: 200});
          console.log('Customer updated successfully')
        }
      })
    }
    else
    {
      const newPath = await cloudinaryImageUploadMethod(req.files['fileI'][0].path)
      req.body.imageFile = newPath.res;
      User.findByIdAndUpdate({ _id: req.body.cId }, {
        $set: { profilePic: req.body.imageFile, username: req.body.cUsername, firstname: req.body.cFirst, lastname: req.body.cLast, email: req.body.cEmail }
      }, (error, data) => {
        if (error) {
          return next(error);
          console.log(error)
        } else {
          res.send({status: 200});
          console.log('Customer updated successfully')
        }
      })
    }
});

// Get Customers //

adminRoute.get('/getCustomer', (req, res, next) => {
  Customer.find({}).populate('reserveUser').exec(function (err, results) {
    if (err) {
      console.log(err);
    } else 
    {
      res.json(results)
    }
  })
})

// Add Menu //

adminRoute.post('/addMenu', upload.fields([{
  name: 'fileC', maxCount: 1
  }]), async (req, res, next) => {
  if(!req.files['fileC']) {
    console.log("Failed!")
    return res.status(500).send({ message: 'Upload fail'});
  } else {
    const newPath = await cloudinaryImageUploadMethod(req.files['fileC'][0].path)
    req.body.cImage = newPath.res;
    const menu = new Menu(
      {
        itemRest: req.body.iRest,
      });
      Menu.create(menu.save((err,data)=>
      {
        console.log("Category Added")
        Menu.findOneAndUpdate({ itemRest: req.body.iRest }, {
          $push: { "itemCategory": { name: req.body.cName, image: req.body.cImage } },
        }, (error, data) => {
          if (error) {
            return next(error);
            console.log(error)
          } else {
            res.send({status: 200});
            console.log('Data updated successfully')
          }
        })
      })
      )
      .catch(err => {
        res.send('error: ' + err)
      })
  }
});


// Add Menu Category //

adminRoute.put('/addMenuCategory', upload.fields([{
  name: 'fileC', maxCount: 1
  }]), async (req, res, next) => {
  if(!req.files['fileC']) {
    console.log("Failed!")
    return res.status(500).send({ message: 'Upload fail'});
  } else {
    const newPath = await cloudinaryImageUploadMethod(req.files['fileC'][0].path)
    req.body.cImage = newPath.res;
    Menu.findOneAndUpdate({ itemRest: req.body.iRest }, {
      $push: { "itemCategory": { name: req.body.cName, image: req.body.cImage } },
    }, (error, data) => {
      if (error) {
        return next(error);
        console.log(error)
      } else {
        res.send({status: 200});
        console.log('Category Added successfully')
      }
    })
  }
});

// Add Items //

adminRoute.post('/addItems', upload.fields([{
  name: 'fileI', maxCount: 1
  }]), async (req, res, next) => {
  if(!req.files['fileI']) {
    console.log("Failed!")
    return res.status(500).send({ message: 'Upload fail'});
  } else {
    const newPath = await cloudinaryImageUploadMethod(req.files['fileI'][0].path)
    req.body.itemImage = newPath.res;
    Menu.findOneAndUpdate({ itemRest: req.body.iRest, "itemCategory.name": req.body.iCategory }, {
      $push: { "itemCategory.$.items": { itemImage: req.body.itemImage, itemName: req.body.iName, itemPrice: req.body.iPrice, itemDesc: req.body.iDesc } },
    }, (error, data) => {
      if (error) {
        return next(error);
        console.log(error)
      } else {
        res.send({status: 200});
        console.log('Data updated successfully')
      }
    })
  }
});

// Update Customer Status //

adminRoute.put('/editStatus/:id/:status', (req, res, next) => {
  Customer.findByIdAndUpdate({ _id: req.params.id }, {
    $set: { status: req.params.status }
  }, (error, data) => {
    if (error) {
      console.log(error)
      return next(error);
    } else {
      res.json(data)
      console.log('Reservation updated successfully!')
    }
  })
})

// Get Menu //

adminRoute.get('/getMenu', (req, res, next) => {
  Menu.find({})
    .then(menu => {
        if (menu){
          console.log(menu);
          res.send(menu);
        }
        else
        {
          res.send("Item does not exist");
        }
    })
    .catch(err => {
      res.json('error: ' + err)
    })
})

// Get Specific Item //

adminRoute.get('/getItem/:itemId/:cateId/:iRest', (req, res, next) => {
  Menu.aggregate(
    [{ $match: { itemRest: req.params.iRest }},
    { $unwind: '$itemCategory'},
    { $match: { "itemCategory.name": req.params.cateId }}])
    .then(menu => {
        if (menu){
          console.log(menu);
          res.send(menu);
        }
        else
        {
          res.send("Item does not exist");
        }
    })
    .catch(err => {
      res.json('error: ' + err)
    })
})

// Update Menu Items //

adminRoute.route('/updateItem/:itemId/:cateId/:iRest').put((req, res, next) => {
  Menu.findOneAndUpdate({ itemRest: req.params.iRest , "itemCategory.name": req.params.cateId }, {
     $set: { "itemCategory.$.items.$[itemFilter].itemName": req.body.iName, "itemCategory.$.items.$[itemFilter].itemPrice": req.body.iPrice, "itemCategory.$.items.$[itemFilter].itemDesc": req.body.iDesc } },
     { arrayFilters: [ { "itemFilter._id": req.params.itemId } ],
    }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Item updated successfully')
    }
  })
})

// Delete Menu Items //

adminRoute.route('/deleteItem/:itemId/:cateId/:iRest').delete((req, res, next) => {
  Menu.findOneAndUpdate({ itemRest: req.params.iRest, "itemCategory._id": req.params.cateId }, {
    $pull: { "itemCategory.$.items": { _id: req.params.itemId } },
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Item removed successfully')
    }
  })
})

// Delete Menu Category //

adminRoute.route('/deleteCategory/:cateId/:iRest').delete((req, res, next) => {
  Menu.findOneAndUpdate({ itemRest: req.params.iRest }, {
    $pull: { "itemCategory": { _id: req.params.cateId } },
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Item removed successfully')
    }
  })
})


// Admin Login //

adminRoute.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

// Restaurant Login //

adminRoute.post('/loginRest', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

// Admin Register //

adminRoute.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 600;
      res.setHeader('Coreqntent-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if (req.body.email)
        user.email = req.body.email;
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lastname)
        user.lastname = req.body.lastname;
      if(req.body.admin)
        user.admin=req.body.admin;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        res.send({status: 200});
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      });
    }
  });
});

// Customer Register //

adminRoute.post('/signupCust', upload.fields([{
  name: 'fileI', maxCount: 1
  }]), async (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, async (err, user) => {
    if(err) {
      res.statusCode = 600;
      res.setHeader('Coreqntent-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if(!req.files['fileI']) {
        const newPath = await cloudinaryImageUploadMethod("./public/assets/img/default.jpg")
        req.body.imageFile = newPath.res;
      }
      else
      {
        const newPath = await cloudinaryImageUploadMethod(req.files['fileI'][0].path)
        req.body.imageFile = newPath.res;
      }
      if (req.body.email)
        user.email = req.body.email;
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lastname)
        user.lastname = req.body.lastname;
      if(req.body.admin)
        user.admin=req.body.admin;
      user.profilePic = req.body.imageFile;

      // Sending verifying email //

      var transporter = nodemailer.createTransport({
        name: "https://www.gostro.de",
        host: "box2417.bluehost.com",
        port: 465,
        secure: true,
        auth: {
          user: 'info@gostro.de',
          pass: 'Gostro2021'
        },
        tls: {
          rejectUnauthorized: false,
        },
       });
    
      const mailOptions = {
        from: 'info@gostro.de', // sender address
        to: req.body.email, // list of receivers
        subject: 'Verify your email address!', // Subject line
        html: '<p>Dear ' + req.body.username +',</p><p>In order to complete your registration, please verify your email address by clicking on the following link:<br> https://www.gostro.de/verifyEmail/'+req.body.username+' </p> <p>Best regards, </p><p>GOSTRO</p>'// plain text body
      };
    
      await transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);
          res.send({status: 200});
      });

      // ------------- //

      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          

          res.json({success: true, status: 'Registration Successful!'});
        });
      });
      }
    });
});


module.exports = adminRoute;