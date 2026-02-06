
/**
 * AGENDA MED - Serviço de E-mail Transacional
 * Recomendação: Resend.com (3.000 envios/mês grátis)
 */

// Chave para testes ou produção
const API_KEY = 're_123456789'; // Insira sua chave do Resend aqui
const FROM_EMAIL = 'onboarding@resend.dev'; // No Resend grátis, use este remetente para testes

export const sendEmail = async (to: string, subject: string, html: string) => {
  // Se não houver chave real, simulamos o envio no console para desenvolvimento
  if (API_KEY.includes('123456789')) {
    console.warn('--- SIMULAÇÃO DE E-MAIL ---');
    console.log(`Para: ${to}`);
    console.log(`Assunto: ${subject}`);
    console.log('---------------------------');
    return { success: true, simulated: true };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        from: 'Agenda Med <onboarding@resend.dev>',
        to: [to],
        subject: subject,
        html: html
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return null;
  }
};

export const sendEmailViaResend = sendEmail;

export const getWelcomeTemplate = (name: string) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
    <h2 style="color: #0d9488;">Bem-vindo ao Futuro, ${name}!</h2>
    <p>Sua conta no Agenda Med foi criada. Prepare-se para uma gestão de saúde sem furos na agenda.</p>
    <div style="margin-top: 20px; padding: 15px; background: #f0fdfa; border-radius: 8px; color: #134e4a;">
      <strong>Dica:</strong> Complete seu perfil para começar a receber agendamentos.
    </div>
  </div>
`;

export const getAppointmentTemplate = (patient: string, doctor: string, time: string, date: string) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
    <h2 style="color: #0d9488;">Consulta Confirmada!</h2>
    <p>Olá ${patient}, sua consulta com <strong>${doctor}</strong> está agendada.</p>
    <p>📅 <strong>Data:</strong> ${date}</p>
    <p>⏰ <strong>Horário:</strong> ${time}</p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="font-size: 12px; color: #666;">Se precisar desmarcar, acesse o aplicativo com pelo menos 24h de antecedência.</p>
  </div>
`;
