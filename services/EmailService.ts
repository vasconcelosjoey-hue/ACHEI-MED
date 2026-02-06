
// Service para Postmark - https://postmarkapp.com
const POSTMARK_SERVER_TOKEN = 'seu-token-aqui'; 

export const sendEmailViaPostmark = async (to: string, subject: string, html: string) => {
  try {
    const response = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': POSTMARK_SERVER_TOKEN
      },
      body: JSON.stringify({
        From: 'contato@agendamed.com.br', // Seu domínio verificado no Postmark
        To: to,
        Subject: subject,
        HtmlBody: html,
        MessageStream: 'outbound' // Otimiza a entrega transacional
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Erro Postmark:', error);
    return null;
  }
};

// Alias para facilitar a troca sem quebrar o resto do app
export const sendEmailViaResend = sendEmailViaPostmark;

export const getWelcomeTemplate = (name: string) => `
  <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #ffffff; border: 1px solid #f1f5f9; border-radius: 32px; color: #0f172a;">
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="background: linear-gradient(135deg, #B9E6FE 0%, #99F6E4 100%); width: 64px; height: 64px; border-radius: 20px; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 24px; color: white; margin-bottom: 16px; line-height: 64px; box-shadow: 0 10px 15px -3px rgba(185, 230, 254, 0.4);">AM</div>
      <h1 style="font-size: 26px; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.05em; text-transform: uppercase;">Agenda Med Cloud</h1>
      <p style="color: #94a3b8; font-size: 12px; font-weight: 700; letter-spacing: 0.2em; margin-top: 8px;">ATIVADO COM SUCESSO</p>
    </div>
    <div style="background-color: #f8fafc; padding: 32px; border-radius: 24px; margin-bottom: 32px;">
        <p style="font-size: 16px; line-height: 1.6; color: #475569; margin: 0;">Olá, <strong>${name}</strong>.</p>
        <p style="font-size: 16px; line-height: 1.6; color: #475569; margin-top: 16px;">Sua jornada para uma gestão de saúde mais inteligente começou. O sistema de realocação ativa já está monitorando sua conta.</p>
    </div>
    <div style="text-align: center;">
      <a href="https://agenda-med-br.vercel.app" style="background-color: #0f172a; color: #ffffff; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-weight: bold; display: inline-block; box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.1);">Acessar Dashboard</a>
    </div>
    <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #f1f5f9; text-align: center;">
      <p style="font-size: 11px; color: #cbd5e1; text-transform: uppercase; font-weight: 800; letter-spacing: 0.1em;">Tecnologia Segura • LGPD Compliant</p>
    </div>
  </div>
`;

export const getAppointmentTemplate = (patientName: string, docName: string, time: string, date: string) => `
  <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #ffffff; border: 1px solid #f1f5f9; border-radius: 32px;">
    <div style="background: #0f172a; padding: 32px; border-radius: 28px; color: #ffffff; margin-bottom: 32px; position: relative; overflow: hidden;">
      <h2 style="font-size: 24px; font-weight: 800; margin: 0; position: relative; z-index: 2;">Agendamento Confirmado</h2>
      <p style="font-size: 14px; color: #99f6e4; margin-top: 8px; font-weight: 600; position: relative; z-index: 2;">Sua consulta foi sincronizada na nuvem.</p>
    </div>
    <div style="padding: 0 8px;">
        <p style="font-size: 16px; color: #64748b; margin-bottom: 32px;">Olá <strong>${patientName}</strong>, os dados da sua consulta com <strong>${docName}</strong> foram processados:</p>
        <div style="display: flex; gap: 12px; margin-bottom: 32px;">
            <div style="flex: 1; background: #f8fafc; padding: 20px; border-radius: 20px;">
                <span style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 8px;">Data</span>
                <span style="font-size: 18px; font-weight: 800; color: #0f172a;">${date}</span>
            </div>
            <div style="flex: 1; background: #f8fafc; padding: 20px; border-radius: 20px;">
                <span style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 8px;">Horário</span>
                <span style="font-size: 18px; font-weight: 800; color: #0d9488;">${time}h</span>
            </div>
        </div>
        <div style="background-color: #fffbeb; border: 1px solid #fef3c7; padding: 20px; border-radius: 20px; margin-bottom: 32px;">
            <p style="font-size: 13px; color: #92400e; margin: 0; font-weight: 600;">⚠️ Chegue com 15 minutos de antecedência para o check-in digital.</p>
        </div>
    </div>
    <p style="font-size: 12px; color: #cbd5e1; text-align: center;">Agenda Med Cloud - A ponte entre a necessidade e o cuidado.</p>
  </div>
`;
