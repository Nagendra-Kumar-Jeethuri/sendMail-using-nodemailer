const nodemailer=require('nodemailer');
const {EMAIL,PASSWORD}=require('../routes/env.js');
const mailgen=require('mailgen');
const Mailgen = require('mailgen');
//send mail from testing account
const signup=async(req,res)=>{
    let testAccount=await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,//true for 465 , false for others 587 etc.,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    let message = {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Successfully registered with us", // plain text body
        html: "<b>Successfully registered with us</b>", // html body
    }
    transporter.sendMail(message).then((info)=>{
        return res.status(201).json({
            msg:"You should receive an email",
            info:info.messageId,
            preview:nodemailer.getTestMessageUrl(info)
        })
    }).catch(error=>{
        return res.status(500).json({error})
    });
    // res.status(201).json("signup Successfully.....!");
}
//send mail from real gmail account
const getBill=(req,res)=>{
    const {userEmail}=req.body;
    let config={
        service:'gmail',
        auth:{
            user:EMAIL,
            pass:PASSWORD
        }
    }
    let transporter = nodemailer.createTransport(config);
    let MailGenerator=new Mailgen({
        theme:"default",
        product:{
            name:"Mailgen",
            link:'https://mailgen.js/'
        }
    });
    let response={
        body:{
            name:"Daily Tution",
            intro:"Your bill has arrived!",
            table:{
                data:[
                    {
                    item:"Nodemailer Stack Book",
                    description:"A backend application",
                    price:"$10.99",
                    }
                ],
                outro:"Looking formard to do more business"
            }
        }
    }
    let mail=MailGenerator.generate(response)
    let message={
        from:EMAIL,
        to:userEmail,
        subject:"Place Order",
        html:mail,
    }
    transporter.sendMail(message).then(()=>{
        return res.status(201).json({
            msg:"you should receive an email"
        })
    }).catch(error=>{
        return res.status(500).json({error});
    })
}
module.exports={
    signup,
    getBill
}