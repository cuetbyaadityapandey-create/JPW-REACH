// api/create-order.js

import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export default async function handler(req, res) {
  
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed"
    });
  }
  
  try {
    
    const amount = req.body.amount || 1500;
    
    const order = await razorpay.orders.create({
      
      amount,
      
      currency: "INR",
      
      receipt: "JPW_" + Date.now(),
      
      payment_capture: 1,
      
      notes: {
        
        service: "JPW Reach",
        
        company: "AINEX SERVICES"
        
      }
      
    });
    
    return res.status(200).json(order);
    
  } catch (err) {
    
    console.log(err);
    
    return res.status(500).json({
      
      success: false,
      
      message: "Unable To Create Order"
      
    });
    
  }
  
}
