import nodemailer from 'nodemailer'



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kgk1999@gmail.com',
    pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
  },
})


export default async function newUploadMailer(req, res) {
  const formData = req.body


  await transporter.sendMail({
    from: `"Christ Archives" <kgk1999@gmail.com>`,
    to: 'kgk1999@gmail.com',
    subject: `New post for peer review: ${formData.title}`,
    text: `
      

      ----------------------------------------------
      
      This post was just submitted for peer review!

      Title: ${formData.title}
      Author: ${formData.author}

      ----------------------------------------------
    `,
  })

  res.status(200).json({message: "Email sent!"})
}