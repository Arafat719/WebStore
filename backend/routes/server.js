// routes/contact.js
import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/send-email", async (req, res) => {
    const { name, email, message } = req.body;

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: "gmail", // Gmail use korte caile
        auth: {
            user: "tomar.email@gmail.com", // তোমার Gmail
            pass: "app_password_here",     // Gmail App Password
        },
    });

    const mailOptions = {
        from: email, // sender
        to: "tomar.email@gmail.com", // যেই email এ মেসেজ যাবে
        subject: `New Contact Message from ${name}`,
        text: message,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "Message sent successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending email" });
    }
});

export default router;