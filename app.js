const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require("dotenv").config();


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/" , function (req , res ){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/" , function (req , res) {
    const fullName = req.body.fullname;
    const email = req.body.email;
    

    
    const authUser = process.env.MAILCHIMP_AUTH_USER;
    const url = process.env.MAILCHIMP_URL;

    const options = {
        method: "POST",
        auth: authUser,

    };
    const data = {
        members : [ {
            email_address: email,
            status: "subscribed",
            merge_fields : {
                FNAME: fullName
            }
        }
        ]
    };
    
    const jsonData = JSON.stringify(data);

    

    const request = https.request(url , options , function (response) {

        
        response.on("data" , function (data) {
            
            if (response.statusCode == 200)
            {
                res.sendFile(__dirname + "/success.html");

            }
            else
            {
                res.sendFile(__dirname + "/failure.html");
            }
        })
    });

    request.write(jsonData);
    request.end();



});


app.post("/failure", function(req , res){
    res.redirect("/");
});







app.listen(process.env.PORT || 1338 , function ( ) {
    console.log("The server is listening on port 1338...");
});

