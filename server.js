//requiring modules.
const express = require('express');
var bodyParser = require('body-parser')
const mongoose = require('mongoose');

//connecting to the server
var mongoDB = 'mongodb://127.0.0.1/studentsDB';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//defining schema for mongoDB and inserting variables.
var Schema = mongoose.Schema;
var ResultSchema = new Schema({
    Result: Number,
    Attendance: Number,
    Review: String
})
var StudentSchema = new Schema({
 USN: String,
 name: String,
 DOB: Number,
 password: Number,
 fees: String,
 performance: ResultSchema
});
var TeacherSchema = new Schema ({
    Email: String,
    passwd: Number,
    studentDisp: StudentSchema
})
var student = mongoose.model('student', StudentSchema );
var result = mongoose.model('result', ResultSchema);
var teacher = mongoose.model('teacher', TeacherSchema);

//adding sample values to daatabase.
var result6 = new result ({
    Result: 4.5,
    Attendance: 48,
    Review: "Is very talkative."
});

// result6.save();

// var teacher1 = new teacher ({
//     Email: "admin@gmail.com",
//     passwd: 4578,
// });

// teacher1.save();

// student.updateOne({USN: "1NT19CS042"}, {fees: "paid"}, function(err){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("succesfully updated document.")
//     }
// });

student.find(function(err, students){
    if(err){
        console.log(err);
    }
    else
    {
        // mongoose.connection.close();
        students.forEach(function(student){
            console.log(student);
        });
    }
});

// student.deleteMany({USN: "mihir"}, function(err){
//     if(err){
//         console.log(err);
//     }
//     else
//     {
//         console.log("Deleted successfully");
//     }
// });

//defining server using express.
const app = express()
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.listen(3000, function(){
    console.log("Server is running on port 3000");
})
app.use(express.static("public"));

//all the routes are defined.
app.get('/',function(req, res){
    res.sendFile(__dirname + "/landing.html")
})
app.get('/teacher',function(req, res){
    res.sendFile(__dirname + "/teacher.html")
})
app.get('/student',function(req, res){
    res.sendFile(__dirname + "/student.html")
})
app.get('/demo', function(req, res){
    student.find(function(err, students){
        if(err){
            console.log(err);
        }
        else{
            students.forEach(function(student){
                    userData.USN = student.USN;
                    userData.DOB = student.DOB;
                    userData.password = student.password;
            })
            console.log("logged in successfully.");
            res.render('creat', {userData: final});
        }
    })
})

//validating the students data using login form.
app.post('/student', function(req, res){
    var usn = req.body.usn;
    var dob = req.body.dob;
    var passwd = req.body.passwd;

    var check = new student ({
        USN: usn,
        DOB: dob,
        password: passwd
    });
    student.find(function(err, students){
        if(err){
            console.log(err);
        }
        else
        {
            // mongoose.connection.close();
            students.forEach(function(student){
                if(check.USN == student.USN){
                    if(check.DOB == student.DOB)
                        if(check.password == student.password)
                            {   if(student.fees == "paid"){

                                console.log("logged in successfully.");
                                res.render('creat', {userData: student});
                                console.log(student);
                            }
                                else{
                                    res.render('fail');
                                    student.updateOne( {fees: "paid"}, function(err){
                                        if(err){
                                            console.log(err);
                                        }
                                        else{
                                            console.log("Fees Paid.")
                                        }
                                    });
                                }
                            }            
                }
            });
        }
    });
})

//validating teachers data.
app.post('/teacher', function(req,res){
    
    var mail = req.body.mail;
    var pwd = req.body.pwd;

    var data = new teacher ({
        Email: mail,
        password: pwd
    });

    teacher.find(function(err, teachers){
        if(err){
            console.log(err);
        }else{
            teachers.forEach(function(teacher){
                if(data.Email == teacher.Email)
                    if(data.password == teacher.password){
                        res.render('creat');
                    }
            })
        }
    })
})