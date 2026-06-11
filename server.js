/* ═══════════════════════════════════════════════
   WASHIT — Backend Server
   Express + Nodemailer Booking Confirmation
   ═══════════════════════════════════════════════ */

require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── MIDDLEWARE ──
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ── EMAIL TRANSPORTER ──
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verify transporter on startup
transporter.verify((error) => {
    if (error) {
        console.error('❌ Email transporter error:', error.message);
        console.log('⚠️  Make sure EMAIL_USER and EMAIL_PASS are set in .env');
    } else {
        console.log('✅ Email transporter ready — emails will be sent from:', process.env.EMAIL_USER);
    }
});

// ── GENERATE BOOKING EMAIL HTML ──
function generateBookingEmail(data) {
    const {
        name, email, phone, brand, brandName,
        pairs, service, serviceName, pickupDate,
        notes, isBranded, surcharge, total
    } = data;

    const formattedDate = new Date(pickupDate + 'T00:00:00').toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#16161f;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);">

    <!-- HEADER -->
    <tr>
        <td style="background:linear-gradient(135deg,rgba(0,212,170,0.15) 0%,rgba(124,92,252,0.15) 50%,rgba(255,107,157,0.10) 100%);padding:40px 40px 30px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
            <div style="font-size:28px;margin-bottom:8px;">👟</div>
            <h1 style="margin:0;font-size:28px;font-weight:800;color:#f0f0f5;">
                Wash<span style="background:linear-gradient(135deg,#00d4aa,#7c5cfc,#ff6b9d);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">It</span>
            </h1>
            <p style="margin:8px 0 0;font-size:13px;color:#9898a8;letter-spacing:2px;text-transform:uppercase;">Premium Sneaker Care</p>
        </td>
    </tr>

    <!-- CONFIRMATION BADGE -->
    <tr>
        <td style="padding:30px 40px 10px;text-align:center;">
            <div style="display:inline-block;background:rgba(0,212,170,0.1);border:1px solid rgba(0,212,170,0.25);border-radius:100px;padding:10px 24px;margin-bottom:16px;">
                <span style="color:#00d4aa;font-size:14px;font-weight:600;">✅ Booking Confirmed</span>
            </div>
            <h2 style="margin:12px 0 8px;font-size:22px;font-weight:700;color:#f0f0f5;">Hey ${name.split(' ')[0]}! 🎉</h2>
            <p style="margin:0;font-size:15px;color:#9898a8;line-height:1.6;">Your sneaker wash has been booked successfully. Here are your booking details:</p>
        </td>
    </tr>

    <!-- BOOKING DETAILS -->
    <tr>
        <td style="padding:20px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#1e1e2a;border-radius:14px;border:1px solid rgba(255,255,255,0.06);overflow:hidden;">
                <tr>
                    <td style="padding:20px 24px 12px;">
                        <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#6a6a7a;font-weight:600;">Booking Details</p>
                    </td>
                </tr>
                <tr>
                    <td style="padding:0 24px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);color:#9898a8;font-size:14px;">Name</td>
                                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);color:#f0f0f5;font-size:14px;font-weight:600;text-align:right;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);color:#9898a8;font-size:14px;">Email</td>
                                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);color:#f0f0f5;font-size:14px;font-weight:600;text-align:right;">${email}</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);color:#9898a8;font-size:14px;">Phone</td>
                                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);color:#f0f0f5;font-size:14px;font-weight:600;text-align:right;">${phone}</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);color:#9898a8;font-size:14px;">Service</td>
                                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);color:#f0f0f5;font-size:14px;font-weight:600;text-align:right;">${serviceName}</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);color:#9898a8;font-size:14px;">Sneaker Brand</td>
                                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);color:#f0f0f5;font-size:14px;font-weight:600;text-align:right;">${brandName}${isBranded ? ' 👑' : ''}</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);color:#9898a8;font-size:14px;">Pairs</td>
                                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);color:#f0f0f5;font-size:14px;font-weight:600;text-align:right;">${pairs}</td>
                            </tr>
                            ${isBranded ? `
                            <tr>
                                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);color:#f5c842;font-size:14px;">Brand Surcharge</td>
                                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);color:#f5c842;font-size:14px;font-weight:600;text-align:right;">+₹${surcharge}/pair</td>
                            </tr>` : ''}
                            <tr>
                                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);color:#9898a8;font-size:14px;">📅 Pickup Date</td>
                                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);color:#f0f0f5;font-size:14px;font-weight:600;text-align:right;">${formattedDate}</td>
                            </tr>
                            ${notes ? `
                            <tr>
                                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);color:#9898a8;font-size:14px;">📝 Notes</td>
                                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);color:#f0f0f5;font-size:14px;font-weight:600;text-align:right;">${notes}</td>
                            </tr>` : ''}
                        </table>
                    </td>
                </tr>
                <!-- TOTAL -->
                <tr>
                    <td style="padding:16px 24px;background:linear-gradient(135deg,rgba(0,212,170,0.08),rgba(124,92,252,0.08));">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="font-size:18px;font-weight:800;color:#00d4aa;">Total</td>
                                <td style="font-size:18px;font-weight:800;color:#00d4aa;text-align:right;">₹${total}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    <!-- NEXT STEPS -->
    <tr>
        <td style="padding:20px 40px 10px;text-align:center;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(124,92,252,0.06);border:1px solid rgba(124,92,252,0.15);border-radius:14px;">
                <tr>
                    <td style="padding:20px 24px;text-align:center;">
                        <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#f0f0f5;">📦 What's Next?</p>
                        <p style="margin:0;font-size:13px;color:#9898a8;line-height:1.6;">Our team will pick up your sneakers on the scheduled date. Sit back and relax — we'll handle the rest!</p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    <!-- FOOTER -->
    <tr>
        <td style="padding:30px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.04);margin-top:20px;">
            <p style="margin:0 0 4px;font-size:13px;color:#6a6a7a;">Questions? Contact us at</p>
            <a href="mailto:hello@washit.in" style="color:#00d4aa;font-size:14px;font-weight:600;text-decoration:none;">hello@washit.in</a>
            <p style="margin:16px 0 0;font-size:12px;color:#6a6a7a;">© 2026 WashIt. All rights reserved. 🇮🇳</p>
        </td>
    </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

// ── BOOKING ENDPOINT ──
app.post('/api/book', async (req, res) => {
    try {
        const { name, email, phone, brand, brandName, pairs, service, serviceName, pickupDate, notes, isBranded, surcharge, total } = req.body;

        // Basic validation
        if (!name || !email || !phone || !service || !pickupDate) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields. Please fill in all required fields.',
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email address.',
            });
        }

        // Generate email HTML
        const emailHTML = generateBookingEmail(req.body);

        // Check if email config is placeholder/invalid
        const isPlaceholderEmail = 
            !process.env.EMAIL_USER || 
            !process.env.EMAIL_PASS || 
            process.env.EMAIL_USER.includes('your-email@gmail.com') || 
            process.env.EMAIL_PASS.includes('your-app-password-here');

        if (isPlaceholderEmail) {
            console.log(`⚠️ Email configuration is placeholder or empty. Skipping email sending.`);
            console.log(`📝 Mock booking logged: ${name} (${email}) - Brand: ${brandName}, Total: ₹${total}`);
            return res.json({
                success: true,
                message: 'Booking confirmed! (Email sending was skipped because credentials in .env are not configured)',
            });
        }

        // Send email
        const mailOptions = {
            from: `"WashIt 👟" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `✅ Booking Confirmed — ${serviceName || 'Sneaker Wash'} | WashIt`,
            html: emailHTML,
        };

        await transporter.sendMail(mailOptions);

        console.log(`📧 Confirmation email sent to ${email} for ${name}`);

        res.json({
            success: true,
            message: `Booking confirmed! Confirmation email sent to ${email}`,
        });

    } catch (error) {
        console.error('❌ Booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Booking saved but failed to send confirmation email. We\'ll reach out to you shortly.',
        });
    }
});

// ── START SERVER ──
app.listen(PORT, () => {
    console.log(`\n🚀 WashIt server running at http://localhost:${PORT}`);
    console.log(`📂 Serving static files from: ${__dirname}\n`);
});
