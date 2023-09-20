import nodemailer from 'nodemailer'



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kgk1999@gmail.com',
    pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
  },
})


export default async function resetPasswordMailer(req, res) {
  const { code, email } = req.body


  await transporter.sendMail({
    from: `"Christ Archives" <kgk1999@gmail.com>`,
    to: email,
    subject: `Password reset`,
    text: `
      

      ----------------------------------------------
      
      Your password reset code is: ${code}

      ----------------------------------------------
    `,
  })

  res.status(200).json({message: "Email sent!"})
}