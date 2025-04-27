import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';

const app = express();
const PORT = 3001; // diferente da porta do frontend

app.use(cors());
app.use(express.json());

app.post('/api/send-reset-code', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "E-mail é obrigatório" });
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000); // Código de 6 dígitos

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'elissonvictorc@gmail.com',
      pass: 'rntb guue dzls uokq', // precisa ser uma senha de aplicativo
    },
  });

  const mailOptions = {
    from: 'elissonvictorc@gmail.com',
    to: email,
    subject: 'Seu código de recuperação de senha',
    text: `Seu código de recuperação é: ${resetCode}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Código enviado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao enviar e-mail.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
