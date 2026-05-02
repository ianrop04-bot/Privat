const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

app.use(cors());
app.use(express.json());

// Replace with your App Password
const EMAIL = 'groupanimators4@gmail.com';
const PASS = 'pmzg eboq hrrv czbp'; // 👈 PUT YOUR APP PASSWORD HERE

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL,
        pass: PASS
    }
});

// Store verification codes
const verificationCodes = {};

// Generate verification code
function generateCode() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Homepage
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                font-family: 'Segoe UI', Roboto, sans-serif;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1.5rem;
            }
            .card {
                background: white;
                border-radius: 2rem;
                padding: 2.5rem 2rem;
                width: 100%;
                max-width: 450px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                text-align: center;
            }
            .icon { font-size: 4rem; margin-bottom: 1rem; }
            h2 { color: #1a1a2e; margin-bottom: 0.5rem; }
            p { color: #666; margin-bottom: 1.5rem; font-size: 0.9rem; }
            
            input {
                width: 100%;
                padding: 1rem;
                margin-bottom: 1rem;
                border: 2px solid #e2e8f0;
                border-radius: 0.8rem;
                font-size: 1rem;
                outline: none;
                font-family: inherit;
                transition: 0.3s;
            }
            input:focus {
                border-color: #667eea;
                box-shadow: 0 0 0 4px rgba(102,126,234,0.1);
            }
            .btn {
                width: 100%;
                padding: 1rem;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 3rem;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                font-family: inherit;
                transition: 0.3s;
                margin-bottom: 0.5rem;
            }
            .btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
            .btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
            .back-btn {
                background: transparent;
                color: #667eea;
                border: 2px solid #667eea;
            }
            .back-btn:hover { background: #667eea; color: white; }
            
            #sectionA { display: none; }
            .profile {
                width: 60px;
                height: 60px;
                border-radius: 60px;
                margin: 0 auto 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 30px;
                color: white;
                font-weight: bold;
            }
            .status {
                margin-top: 1rem;
                padding: 0.8rem;
                border-radius: 0.5rem;
                display: none;
                font-size: 0.9rem;
            }
            .status.success { display: block; background: #dcfce7; color: #166534; }
            .status.error { display: block; background: #fee2e2; color: #991b1b; }
        </style>
    </head>
    <body>
        <div class="card">
            <div id="sectionB">
                <div class="icon">📧</div>
                <h2>Email Verification</h2>
                <p>Enter your email to receive a verification code</p>
                <input type="email" id="emailInput" placeholder="your@email.com">
                <button class="btn" id="sendBtn" onclick="sendCode()">📤 Send Code</button>
                <div class="status" id="statusB"></div>
            </div>
            
            <div id="sectionA">
                <button class="btn back-btn" onclick="goBack()">← Change Email</button>
                <div class="profile" id="profilePic">?</div>
                <p style="margin-top: 0.5rem;">Code sent to:</p>
                <p style="font-weight: 600; color: #1a1a2e;" id="emailDisplay"></p>
                <label style="display: block; text-align: left; margin-bottom: 0.3rem; font-weight: 600; color: #1a1a2e;">Enter Code:</label>
                <input type="text" id="codeInput" placeholder="XXXXXX" maxlength="6">
                <button class="btn" id="verifyBtn" onclick="verifyCode()">✅ Verify Code</button>
                <div class="status" id="statusA"></div>
            </div>
        </div>
        
        <script>
            const colors = ['#667eea','#22c55e','#f59e0b','#ef4444','#ec4899','#8b5cf6'];
            
            function randomColor() {
                return colors[Math.floor(Math.random() * colors.length)];
            }
            
            document.getElementById('profilePic').style.background = randomColor();
            
            let userEmail = '';
            
            function showStatus(elementId, message, type) {
                const el = document.getElementById(elementId);
                el.textContent = message;
                el.className = 'status ' + type;
            }
            
            async function sendCode() {
                const email = document.getElementById('emailInput').value.trim();
                
                if (!email) {
                    showStatus('statusB', '❌ Please enter your email', 'error');
                    return;
                }
                
                if (!email.includes('@') || !email.includes('.')) {
                    showStatus('statusB', '❌ Invalid email format', 'error');
                    return;
                }
                
                const btn = document.getElementById('sendBtn');
                btn.disabled = true;
                btn.textContent = '⏳ Sending...';
                
                try {
                    const response = await fetch('/send-code', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        userEmail = email;
                        document.getElementById('emailDisplay').textContent = email;
                        document.getElementById('sectionB').style.display = 'none';
                        document.getElementById('sectionA').style.display = 'block';
                        document.getElementById('profilePic').style.background = randomColor();
                        document.getElementById('profilePic').textContent = email.charAt(0).toUpperCase();
                    } else {
                        showStatus('statusB', '❌ ' + (data.error || 'Failed to send'), 'error');
                    }
                } catch (err) {
                    showStatus('statusB', '❌ Connection error', 'error');
                } finally {
                    btn.disabled = false;
                    btn.textContent = '📤 Send Code';
                }
            }
            
            async function verifyCode() {
                const code = document.getElementById('codeInput').value.trim();
                
                if (!code || code.length < 4) {
                    showStatus('statusA', '❌ Please enter the code', 'error');
                    return;
                }
                
                const btn = document.getElementById('verifyBtn');
                btn.disabled = true;
                btn.textContent = '⏳ Verifying...';
                
                try {
                    const response = await fetch('/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: userEmail, code })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        showStatus('statusA', '✅ Verification successful!', 'success');
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    } else {
                        showStatus('statusA', '❌ ' + (data.error || 'Wrong code'), 'error');
                    }
                } catch (err) {
                    showStatus('statusA', '❌ Connection error', 'error');
                } finally {
                    btn.disabled = false;
                    btn.textContent = '✅ Verify Code';
                }
            }
            
            function goBack() {
                document.getElementById('sectionA').style.display = 'none';
                document.getElementById('sectionB').style.display = 'block';
                document.getElementById('codeInput').value = '';
                document.getElementById('statusA').className = 'status';
            }
        </script>
    </body>
    </html>
    `);
});

// Send verification code
app.post('/send-code', async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.json({ success: false, error: 'Email required' });
    }
    
    const code = generateCode();
    
    // Store code for this email
    verificationCodes[email] = {
        code,
        expires: Date.now() + 10 * 60 * 1000 // 10 minutes
    };
    
    try {
        await transporter.sendMail({
            from: `"Verification" <${EMAIL}>`,
            to: email,
            subject: '🔐 Your Verification Code',
            html: `
                <div style="text-align: center;">
                    <h2>Email Verification</h2>
                    <p>Use this code to verify your account:</p>
                    <h1 style="color: #667eea; font-size: 2.5rem; letter-spacing: 5px;">${code}</h1>
                    <p style="color: #666;">Code expires in 10 minutes</p>
                </div>
            `
        });
        
        console.log(`✅ Code sent to ${email}: ${code}`);
        res.json({ success: true, message: 'Code sent!' });
        
    } catch (error) {
        console.error('Email error:', error);
        res.json({ success: false, error: 'Failed to send email. Check your App Password.' });
    }
});

// Verify code
app.post('/verify', (req, res) => {
    const { email, code } = req.body;
    
    if (!email || !code) {
        return res.json({ success: false, error: 'Email and code required' });
    }
    
    const stored = verificationCodes[email];
    
    if (!stored) {
        return res.json({ success: false, error: 'No code sent to this email' });
    }
    
    if (Date.now() > stored.expires) {
        delete verificationCodes[email];
        return res.json({ success: false, error: 'Code expired' });
    }
    
    if (stored.code.toUpperCase() !== code.toUpperCase()) {
        return res.json({ success: false, error: 'Wrong code' });
    }
    
    // Code matched - remove it
    delete verificationCodes[email];
    
    res.json({ success: true, message: 'Verified!' });
});

// Start server
const PORT = process.env.PORT || 3230;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
