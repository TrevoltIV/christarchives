import nodemailer from 'nodemailer'



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kgk1999@gmail.com',
    pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
  },
})


export default async function newUploadMailer(req, res) {
  const data = req.body


  await transporter.sendMail({
    from: `"Christ Archives" <kgk1999@gmail.com>`,
    to: data.email,
    subject: `Your post has been reviewed: ${data.postData.title}`,
    text: `
      

      ----------------------------------------------
      
      Your post has just been peer reviewed!

      Title: ${data.postData.title}
      Author: ${data.postData.author}

      ----------------------------------------------
    `,
  })

  res.status(200).json({message: "Email sent!"})
}