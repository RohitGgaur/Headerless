import React, { useState, useEffect } from 'react';

const Login = () => {
  const [otp, setOtp] = useState('');

  useEffect(() => {

    const script = document.createElement('script');
    script.id = 'otpless-sdk';
    script.src = 'https://otpless.com/v2/headless.js';
    script.setAttribute('data-appid', 'J6JRZPT7M1LJ0LSK2RFC');
    script.async = true;

    document.body.appendChild(script);

    // Wait for the SDK to load and then initialize OTPless
    script.onload = () => {
      if (window.OTPless) {
        const OTPlessSignin = new window.OTPless(callback);
        window.OTPlessSignin = OTPlessSignin; 
      } else {
        console.error('OTPless SDK failed to load.');
      }
    };

    return () => {
      document.body.removeChild(script); 
    };
  }, []);

  // Callback for OTP-less integration
  const callback = (userinfo) => {
    console.log(userinfo);
    // Your custom logic goes here.
  };

  // Function to handle phone authentication
  const phoneAuth = () => {
    const phone = document.getElementById('mobile-input').value;
    if (window.OTPlessSignin) {
      window.OTPlessSignin.initiate({
        channel: 'PHONE',
        phone: phone,
        countryCode: '+91',
      })
        .then((response) => {
          console.log('Success:', response);
          document.getElementById('otp-section').style.display = 'block'; // Show OTP section
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } else {
      console.error('OTPlessSignin is not initialized.');
    }
  };

  // Function to handle OTP verification
  const verifyOTP = () => {
    const otp = document.getElementById('otp-input').value;
    if (window.OTPlessSignin) {
      window.OTPlessSignin.verify({
        otp: otp
      })
      .then(response => {
        console.log('OTP Verification Success:', response);
        if (response.success) {
          // Handle successful OTP verification
          console.log('OTP verified successfully!');
          // You might want to redirect the user or show a success message
        } else {
          // Handle failed OTP verification
          console.error('OTP verification failed:', response);
        }
      })
      .catch(error => {
        console.error('Error during OTP verification:', error);
      });
    } else {
      console.error('OTPlessSignin is not initialized.');
    }
  };
  

  // OAuth authentication function
  const oauth = (provider) => {
    if (window.OTPlessSignin) {
      window.OTPlessSignin.initiate({
        channel: 'OAUTH',
        channelType: provider,
      });
    } else {
      console.error('OTPlessSignin is not initialized.');
    }
  };

  return (
    <>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', top: '150px' }}>
 <div className="card" style={{ padding: '30px', width: '400px', height: '300px', borderRadius: '5px', boxShadow: '0 0 15px black' }}>






   <input id="mobile-input" placeholder="Enter mobile number" style={{ margin: '18px', height: '30px', width: '190px', borderRadius: '5px', border: '2px solid black' }} />





   <button onClick={phoneAuth} style={{ margin: '18px', background: 'blue', borderRadius: '5px', height: '30px', width: '100px', boxShadow: '0 0 10px green', cursor: 'pointer' }}>Request OTP</button>




   <div id="otp-section" style={{display:"none"}}>
     <input id="otp-input" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" style={{ margin: '18px', height: '30px', width: '190px', borderRadius: '5px', border: '2px solid black' }} />
     <button onClick={verifyOTP} style={{ margin: '18px', background: 'blue', borderRadius: '5px', height: '30px', width: '100px', boxShadow: '0 0 10px green', cursor: 'pointer' }}>Verify OTP</button>
   </div>




   
   <div className="row">
       <div className="col">
         <button onClick={() => oauth('WHATSAPP')} style={{ width: '330px', height: '50px', margin: '20px', border: '2px solid black', borderRadius: '6px' }}>Continue with WhatsApp</button>
       </div>
       <div className="col mb-4">
         <button onClick={() => oauth('GMAIL')} style={{ width: '330px', height: '50px', margin: '20px', border: '2px solid black', borderRadius: '6px' }}>Continue with Gmail</button>
       </div>
     </div>
 </div>
</div>

    </>
  );
};

export default Login;
