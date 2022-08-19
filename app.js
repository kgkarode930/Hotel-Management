// const http = require('http');
// const fs = require('fs');
const express = require('express');  //npm install express
const path = require('path');
const connection = require('./server');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const sessionStore = new MySQLStore({}, connection);



const app = express();
app.use('/static',express.static('static'));

app.use(
  session({
      secret: 'cookie_secret',
      resave: false,
      saveUninitialized: false,
      store: sessionStore,      // assigning sessionStore to the session
  })
);

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {

//       // Uploads is the Upload_folder_name
//       cb(null, "uploads")
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + "-" + Date.now()+".jpg")
//   }
// })
var curr_session;

//set the template engine as pug
app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({
  extended: true
}))

const hostname = '127.0.0.1';
const port = 3000;

var currentUserId='-1';

// , { title: 'Welcome', message: 'Hello there!' }

//start of project
app.get('/', function (req, res) {
  res.status(200).render('login');
})


//Receptionist Login
app.post('/receptionist',function(req,res){

  let user_data=req.body;
  connection.query("select *from Receptionist where Re_id= '"+user_data.Id+"' and Re_name= '"+user_data.name+"' and Re_passcode= MD5('"+user_data.psw+"');", (err, results, rows) => {
  
    //if some error occurs
  if(err) throw err;

  //if user inputs wrong credentials
  if(results.length==0){ 
    console.log("No such records exist");
          res.status(200).redirect('/');}

else {console.log("Logged in Successfully");
  // currentUserId=user_data.Id;
    curr_session=req.session;
    req.session.loggedin = true;
    req.session.userid=req.body.Id;
    console.log(req.session)


res.status(200).render('Re_home');}
});
// res.status(200).render('receptionist'); ,{title:user_data.name}
});
//home page
app.get('/Re_home',function(req, res){
  res.status(200).render('Re_home');
});
//room booking page
app.get('/Re_room_booking',function(req, res){
  res.status(200).render('Re_room_booking');
});
app.post('/send_guest_data',function(req,res){
  let user_data=req.body;
  connection.query("INSERT INTO guest (room_number,guest_fname,guest_lname,guest_address,guest_phone_number,guest_email,room_type,checkin,checkout,number_of_rooms,guest_adults,guest_child,ID_proof,guest_password)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,md5(?))",[user_data.room_number,user_data.fname,user_data.lname,user_data.address,user_data.phonenumber,user_data.email,user_data.room_type,user_data.checkin,user_data.checkout,user_data.number_of_rooms,user_data.guest_adults,user_data.guest_child,user_data.ID_proof,user_data.password] ,(err, results, rows) => {
    if(err) throw err;
    
    else console.log("Inserted Successfuly");
  });
  res.status(200).redirect('/Re_room_booking');
  });
//rooms page
app.get('/Re_rooms',function(req, res){
  res.status(200).render('Re_rooms');
});
//employee registration page
app.get('/Re_employee_registration',function(req, res){
  res.status(200).render('Re_employee_registration');
  });
// receptionist registration
  app.post('/send_receptionist_data',function(req,res){
    let user_data=req.body;
    console.log(user_data.dob);
    connection.query("INSERT INTO Receptionist (Re_name,Re_dob,Re_email,Re_status,Re_phone_number,Re_address,Re_passcode)VALUES(?,?,?,?,?,?,md5(?))",[user_data.name,user_data.dob,user_data.email,user_data.status,user_data.phnumber,user_data.address,user_data.psw] ,(err, results, rows) => {
      if(err) throw err;
    
      else console.log("Inserted Successfuly");
    });
    res.status(200).redirect('/Re_employee_registration');
    });
//manager registration
  app.post('/send_manager_data',function(req,res){
    let user_data=req.body;
    console.log(user_data.dob);
    connection.query("INSERT INTO restaurant_manager (rm_name,rm_dob,rm_email,rm_status,rm_phone_number,rm_address,rm_password)VALUES(?,?,?,?,?,?,md5(?))",[user_data.name,user_data.dob,user_data.email,user_data.status,user_data.phnumber,user_data.address,user_data.psw] ,(err, results, rows) => {
      if(err) throw err;
    
      else console.log("Inserted Successfuly");
    });
    res.status(200).redirect('/Re_employee_registration');
    });
//housekeeper registration
  app.post('/send_housekeeper_data',function(req,res){
  let user_data=req.body;
  connection.query("INSERT INTO house_keeper (hk_name,hk_dob,hk_email,hk_status,hk_phone_number,hk_address,hk_password)VALUES(?,?,?,?,?,?,md5(?))",[user_data.name,user_data.dob,user_data.email,user_data.status,user_data.phnumber,user_data.address,user_data.psw] ,(err, results, rows) => {
    if(err) throw err;
  
    else console.log("Inserted Successfuly");
        res.status(200).redirect('/Re_employee_registration');
    });
    });
//contact employees page
app.get('/Re_contact_employees', function (req, res) {
  if(req.session.loggedin)
    connection.query("select *from Receptionist",(err, Re_results) => {
      if(err) throw err;
      connection.query("select *from house_keeper",(err,hk_results)=>{
        if(err) throw err;
        connection.query("select *from restaurant_manager",(err,rm_results)=>{
          if(err) throw err;
          res.status(200).render('Re_contact_employees',{Re_results: Re_results,hk_results: hk_results,rm_results: rm_results});
        });
      });
    });
  else
      res.redirect("/");
  });
//account page
app.get('/Re_account', function (req, res) {
  connection.query("select *from Receptionist where Re_id="+req.session.userid+";",(err,results)=>{
              if(err) throw err;
              console.log(results);
              res.status(200).render('Re_account', { results });
      });
  });
  //delete account
  app.get('/Redelete',function(req,res){
    let user_data=req.body;
    connection.query("Delete from Receptionist where Re_id='"+req.session.userid +"'" , (err, results, rows) => {
      if(err) throw err;
      if(results.affectedRows===0){ console.log("Kindly check your password");
                            res.send("Kindly check your password");}
      else {console.log("Account Deleted Successfully");
           res.redirect("/logout")};
    });
    });
    //reset password
    app.post('/Re_reset',function(req,res){
      let user_data=req.body;
      connection.query("update Receptionist set Re_passcode= md5('"+user_data.pswd+"') where Re_id='"+req.session.userid +"' and Re_passcode= md5('"+user_data.oldpswd+"');", (err, results, rows) => {
        if(err) throw err;
        if(user_data.oldpswd != req.session.passcode){
          console.log("Error!");
        }
        if(results.affectedRows===0){ console.log("Kindly check your password");
                              res.send("Kindly check your password");}
        else {console.log("Password changed Successfully");
             res.redirect("/logout")};
      });
      });


// Restaurant Manager Login
app.post('/manager',function(req,res){
  let user_data=req.body;
  // let user_data=req.body;
  connection.query("select *from restaurant_manager where rm_id= '"+user_data.Id+"' and rm_name= '"+user_data.name+"' and rm_password= md5('"+user_data.psw+"');", (err, results, rows) => {
    if(err) throw err;
    if(results.length==0){ console.log("No such records exist");
            res.status(200).redirect('/');}
    
    else {console.log("Logged in Successfully");
      // currentUserId=user_data.Id;
        curr_session=req.session;
        req.session.loggedin = true;
        req.session.userid=req.body.Id;
        console.log(req.session);
        res.status(200).render('rm_home',{title:user_data.name});}
    });
  // res.status(200).render('manager');
  });
  //home page
  app.get('/rm_home',function(req, res){
    res.status(200).render('rm_home');
  });
  //seat availability page
  app.get('/rm_seat_availability',function(req, res){
    res.status(200).render('rm_seat_availability');
  });
//contact staff page
app.get('/rm_contact_employees', function (req, res) {
  if(req.session.loggedin)
    connection.query("select *from Receptionist",(err, Re_results) => {
      if(err) throw err;
      connection.query("select *from house_keeper",(err,hk_results)=>{
        if(err) throw err;
        connection.query("select *from restaurant_manager",(err,rm_results)=>{
          if(err) throw err;
          res.status(200).render('rm_contact_employees',{Re_results: Re_results,hk_results: hk_results,rm_results: rm_results});
        });
      });
    });
  else
      res.redirect("/");
  });
//account page
app.get('/rm_account', function (req, res) {
  connection.query("select *from restaurant_manager where rm_id="+req.session.userid+";",(err,results)=>{
              if(err) throw err;
              console.log(results);
              res.status(200).render('rm_account', { results });
      });
  });
  app.post('/rm_reset',function(req,res){
    let user_data=req.body;
    connection.query("update restaurant_manager set rm_password= md5('"+user_data.pswd+"') where rm_id='"+req.session.userid +"' and rm_password= md5('"+user_data.oldpswd+"');", (err, results, rows) => {
      if(err) throw err;
      if(user_data.oldpswd != req.session.passcode){
        console.log("Error!");
      }
      if(results.affectedRows===0){ console.log("Kindly check your password");
                            res.send("Kindly check your password");}
      else {console.log("Password changed Successfully");
           res.redirect("/logout")};
    });
    });
    app.get('/rmdelete',function(req,res){
      let user_data=req.body;
      connection.query("Delete from restaurant_manager where rm_id='"+req.session.userid +"'" , (err, results, rows) => {
        if(err) throw err;
        if(results.affectedRows===0){ console.log("Kindly check your password");
                              res.send("Kindly check your password");}
        else {console.log("Account Deleted Successfully");
             res.redirect("/logout")};
      });
      });


// Housekeeper Login
app.post('/house_keeper',function(req,res){
  let user_data=req.body;
  connection.query("select *from house_keeper where hk_id= '"+user_data.Id+"' and hk_name= '"+user_data.name+"'and hk_password= md5('"+user_data.psw+"');", (err, results, rows) => {
    // error
    if(err) throw err;
    // wrong credentials
    if(results.length==0){ console.log("No such records exist");
            res.status(200).redirect('/');}
    // successful login
    else {console.log("Logged in Successfully");
      // currentUserId=user_data.Id;
        curr_session=req.session;
        req.session.loggedin = true;
        req.session.userid=req.body.Id;
        console.log(req.session);
        res.status(200).render('hk_home',{title:user_data.name});}
    });
  });
//home page
app.get('/hk_home',function(req, res){
  res.status(200).render('hk_home');
});
//restaurant page
app.get('/restaurant',function(req, res){
  res.status(200).render('restaurant');
});
//contact page
app.get('/hk_contact_employees', function (req, res) {
  if(req.session.loggedin)
    connection.query("select *from Receptionist",(err, Re_results) => {
      if(err) throw err;
      connection.query("select *from house_keeper",(err,hk_results)=>{
        if(err) throw err;
        connection.query("select *from restaurant_manager",(err,rm_results)=>{
          if(err) throw err;
          res.status(200).render('hk_contact_employees',{Re_results: Re_results,hk_results: hk_results,rm_results: rm_results});
        });
      });
    });
  else
      res.redirect("/");
  });
//acount page
app.get('/hk_account', function (req, res) {
  connection.query("select *from house_keeper where hk_id="+req.session.userid+";",(err,results)=>{
              if(err) throw err;
              console.log(results);
              res.status(200).render('hk_account', { results });
      });
  });
  app.get('/hkdelete',function(req,res){
    let user_data=req.body;
    connection.query("Delete from house_keeper where hk_id='"+req.session.userid +"'" , (err, results, rows) => {
      if(err) throw err;
      if(results.affectedRows===0){ console.log("Kindly check your password");
                            res.send("Kindly check your password");}
      else {console.log("Account Deleted Successfully");
           res.redirect("/logout")};
    });
    });
    app.post('/hk_reset',function(req,res){
      let user_data=req.body;
      connection.query("update housekeeper set hk_password= md5('"+user_data.pswd+"') where hk_id='"+req.session.userid +"' and hk_password= md5('"+user_data.oldpswd+"');", (err, results, rows) => {
        if(err) throw err;
        if(user_data.oldpswd != req.session.passcode){
          console.log("Error!");
        }
        if(results.affectedRows===0){ console.log("Kindly check your password");
                              res.send("Kindly check your password");}
        else {console.log("Password changed Successfully");
             res.redirect("/logout")};
      });
      });


//guest login
app.post('/guest',function(req,res){
  let user_data=req.body;
  connection.query("select *from guest where guest_id= '"+user_data.Id+"' and guest_password= md5('"+user_data.pswd+"');", (err, results, rows) => {
    if(err) throw err;
    if(results.length==0){ console.log("No such records exist");
      res.status(200).redirect('/');}
    
    else console.log("Logged in Successfully");
         curr_session=req.session;
         req.session.loggedin = true;
         req.session.userid=req.body.Id;
         console.log(req.session);
         res.status(200).render("guest_home");
  });
  });
  //home page
  app.get('/guest_home',function(req, res){
    res.status(200).render('guest_home');
  });
  //services contact
  app.get('/services_contact', function (req, res) {
    if(req.session.loggedin)
      connection.query("select *from Receptionist",(err, Re_results) => {
        if(err) throw err;
        connection.query("select *from house_keeper",(err,hk_results)=>{
          if(err) throw err;
          connection.query("select *from restaurant_manager",(err,rm_results)=>{
            if(err) throw err;
            res.status(200).render('guest_services_contact',{Re_results: Re_results,hk_results: hk_results,rm_results: rm_results});
          });
        });
      });
    else
        res.redirect("/");
    });
  //account page
  app.get('/guest_account', function (req, res) {
    connection.query("select *from guest where guest_id="+req.session.userid+";",(err,results)=>{
                if(err) throw err;
                console.log(results);
                res.status(200).render('guest_account', { results });
        });
    });
    app.get('/guest_delete',function(req,res){
      let user_data=req.body;
      connection.query("Delete from guest where guest_id='"+req.session.userid +"'" , (err, results, rows) => {
        if(err) throw err;
        if(results.affectedRows===0){ console.log("Kindly check your password");
                              res.send("Kindly check your password");}
        else {console.log("Account Deleted Successfully");
             res.redirect("/logout")};
      });
      });
      app.post('/guest_reset',function(req,res){
        let user_data=req.body;
        connection.query("update guest set guest_password= md5('"+user_data.pswd+"') where guest_id='"+req.session.userid +"' and guest_password= md5('"+user_data.oldpswd+"');", (err, results, rows) => {
          if(err) throw err;
          if(user_data.oldpswd != req.session.passcode){
            console.log("Error!");
          }
          if(results.affectedRows===0){ console.log("Kindly check your password");
                                res.send("Kindly check your password");}
          else {console.log("Password changed Successfully");
               res.redirect("/logout")};
        });
        });



// show contact tables
app.get('/contacts', function (req, res) {

  if(req.session.loggedin)
    connection.query("select *from Receptionist",(err, Re_results) => {
      if(err) throw err;
      connection.query("select *from house_keeper",(err,hk_results)=>{
        if(err) throw err;
        connection.query("select *from restaurant_manager",(err,rm_results)=>{
          if(err) throw err;
          res.status(200).render('contacts',{Re_results: Re_results,hk_results: hk_results,rm_results: rm_results});
        });
      });
    });
  else
      res.redirect("/");

});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

//logout in account 
app.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
});

app.locals.moment = require('moment');
