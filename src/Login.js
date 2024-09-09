import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [otp, setOtp] = useState('');
  const [fullResponse, setFullResponse] = useState(null); // State to store the full response

  useEffect(() => {
    const script = document.createElement('script');
    script.id = 'otpless-sdk';
    script.src = 'https://otpless.com/v2/headless.js';
    script.setAttribute('data-appid', 'J6JRZPT7M1LJ0LSK2RFC');
    script.async = true;

    document.body.appendChild(script);

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

  const callback = (userinfo) => {
    console.log(userinfo);
  };

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
          document.getElementById('otp-section').style.display = 'block';
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } else {
      console.error('OTPlessSignin is not initialized.');
    }
  };

  const verifyOTP = () => {
    const otpValue = document.getElementById('otp-input').value;
    if (window.OTPlessSignin) {
      window.OTPlessSignin.verify({
        otp: otpValue
      })
        .then(response => {
          console.log('OTP Verification Success:', response);

          if (response.success) {
            console.log('OTP verified successfully!');
            setFullResponse(response); // Set the full response in the state
            toast("OTP verified successfully!");
          } else {
            console.error('OTP verification failed:', response);
            setFullResponse(response); // Set the response even on failure
            toast("OTP verification failed!");
          }
        })
        .catch(error => {
          console.error('Error during OTP verification:', error);
          setFullResponse({ error: 'Error during OTP verification' });  // Set error in state
          toast("Error during OTP verification");
        });
    } else {
      console.error('OTPlessSignin is not initialized.');
      setFullResponse({ error: 'OTPlessSignin is not initialized.' });  // Set initialization error
      toast("OTPlessSignin is not initialized.");
    }
  };
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
      <ToastContainer />
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', top: '150px' }}>
        <div className="card" style={{ padding: '30px', width: '400px', height: 'auto', borderRadius: '5px', boxShadow: '0 0 15px black' }}>
          <input
            id="mobile-input"
            placeholder="Enter mobile number"
            style={{ margin: '18px', height: '30px', width: '190px', borderRadius: '5px', border: '2px solid black' }}
          />
          <button
            onClick={phoneAuth}
            style={{ margin: '18px', background: 'blue', borderRadius: '5px', height: '30px', width: '100px', boxShadow: '0 0 10px green', cursor: 'pointer' }}
          >
            Request OTP
          </button>

          <div id="otp-section" style={{ display: 'none' }}>
            <input
              id="otp-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              style={{ margin: '18px', height: '30px', width: '190px', borderRadius: '5px', border: '2px solid black' }}
            />
            <button
              onClick={verifyOTP}
              style={{ margin: '18px', background: 'blue', borderRadius: '5px', height: '30px', width: '100px', boxShadow: '0 0 10px green', cursor: 'pointer' }}
            >
              Verify OTP
            </button>
          </div>
          <div className="row">
       <div className="col">
         <button onClick={() => oauth('WHATSAPP')} style={{ width: '330px', height: '50px', margin: '20px', border: '2px solid black', borderRadius: '6px' }}>Continue with WhatsApp</button>
       </div>
       <div className="col mb-4">
         <button onClick={() => oauth('GMAIL')} style={{ width: '330px', height: '50px', margin: '20px', border: '2px solid black', borderRadius: '6px' }}>Continue with Gmail</button>
       </div>
     </div>

       
          {fullResponse && (
            <div style={{ marginTop: '20px', wordBreak: 'break-word' }}>
              <h4>Full Response:</h4>
              <pre>{JSON.stringify(fullResponse, null, 2)}</pre> 
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
