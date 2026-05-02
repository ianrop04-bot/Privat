const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')

const app = express()

app.use(cors())
app.use(express.json())

//Replace Wth your App pasword
const EMAIL = 'groupanimators4@gmail.com'
const PASS= 'pmzg eboq hrrv czbp'

const transporter = nodemailer.createTransport({
  service:'gmail',
  auth:{
    user:EMAIL,
    pass: PASS
  }
})

let pass= ''

async function code(){
  try {
    const chars = '0740088891BCKLHUB'
    
    for (var i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random()*chars.length))
    }
    
  } catch (e) {
    alert(e.message)
  }
}
code()
app.get('/', (req,res)=>{
  res.send(`
  <!DOCTYPE html>
  <html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Verification Code | Cloud</title>
</head>
<style>
  body {
    background:#E6E6E6;
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  }
  div{
    background:#FFFFFF;
    margin:10px;
    padding: 20px;
    border-radius:15px;
    box-shadow: 0px 12px 5px #3E3E41;
  }
  .profile{
    width:60px;
    height:60px;
    border-radius: 60px;
    box-shadow:0px 0px 1px #3E3E41;
      font-size: 50px;
    color:#F8FAFF;
    text-align: center;
  }
  button{
    width:50%;
    background: linear-gradient(#009EF4,#004CFF);
    color:white;
    font-style:italic;
    margin:10px;
    height:35px;
    border-radius: 35px;
    font-weight: 20px;
  
  }
  input{
    padding:17px;
    border-radius: 15px;
    margin:10px;
    border:none;
    outline-color: #004CFF;
  }
  #sectionA{
    display: none;
  }
</style>
<body>
  <div id="sectionB">
    <h2>Verification Account</h2>
    <input type="email" id="email"placeholder="Enter your Email">
    <button onclick="change()">Verify Now Via Email</button>
  </div>
  
  <div id="sectionA">
    <button onclick="changeb()">←Back Wrong Email</button>
    <div class="profile" id="p">👤</div>
    <label for="">Enter Code:</label>
    <input type="text" placeholder="XXXXXX"id="code">
    
    <button onclick="verify()">Verify Code</button>
  </div>
  <script>
    function changep(){
      const color =['blue','green','yellow','red','brown']
      const random = color[Math.floor(Math.random()* color.length)]
      document.getElementById('p').style.background = random
    }
    changep();
    function change(){
      const secA= document.getElementById('sectionB')
      const secB= document.getElementById('sectionA')
      secA.style.display='none'
      secB.style.display='block'
    }
    function changeb(){
      const secA= document.getElementById('sectionA')
      const secB= document.getElementById('sectionB')
      secA.style.display='none'
      secB.style.display='block'
    }
    function verify(){
    try {
      const email = document.getElementById('email').value
      const verify = document.getElementById('code').value;
      // Tab to edit
   
      const response = await fetch('/send',{
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(verify , email)
      })
      const data = response.json()
      if(data.success){
        alert('Verification Complete')
      }
    } catch (error) {
      confirm(error.message)
    }
    }
  </script>
</body>
</html>`)
})
app.post('/send', async(req,res) =>{
 const { verify, email } = req.body
 
 try {
   await transporter.sendMail({
     from:EMAIL,
     to:email,
     text:`📥New Ch Verification code`,
     subject:`💌 Ch verification From ${EMAIL}`,
     html:`<h2>We recieved your trying to verify your account</h2><br><p>CODE:</p><br><h1 style='color:blue;'>${pass}</h1>`
   })
 } catch (error) {
   res.json({error:'Cant Deliver Email'})
 }
 if (!verify === pass) {
   res.json({error:'Wrong Code'})
 }else{
   res.json({success:true,text:'💌 Verification Done'})
 }
})
