import nodemailer from 'nodemailer'



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kgk1999@gmail.com',
    pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
  },
})


export default async function donutSubmit(req, res) {
  const formData = req.body


  await transporter.sendMail({
    from: `"Christ Archives" <kgk1999@gmail.com>`,
    to: 'kgk1999@gmail.com',
    subject: `New subscription! ${formData.email}`,
    text: `
      

      ----------------------------------------------
      
      Email: ${formData.email}

      ----------------------------------------------
    `,
  })

  res.status(200).json({message: "Email sent!"})
}