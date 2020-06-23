const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/" , function (req , res ){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/" , function (req , res) {
    const fullName = req.body.fullname;
    const email = req.body.email;
    
    const authUser = "usamavarikkottil:02625ab4e228113599b066744cd399d9-us10";
    const url = "https://us10.api.mailchimp.com/3.0/lists/cd8fa1c17a";
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

        // console.log(response);
        response.on("data" , function (data) {
            console.log(JSON.parse(data));
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

// res.send("Thanks for signing up...");


});


app.post("/failure", function(req , res){
    res.redirect("/");
});







app.listen(process.env.PORT || 1337 , function ( ) {
    console.log("The server is listening on port 1337...");
});

//api key mailchimp : 02625ab4e228113599b066744cd399d9-us10
//list id : cd8fa1c17a