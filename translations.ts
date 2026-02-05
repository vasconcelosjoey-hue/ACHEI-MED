
import { Language } from './types';

export const translations: Record<Language, any> = {
  'pt-BR': {
    nav: {
      problem: "O Problema",
      benefits: "Benefícios",
      pillars: "Pilares",
      comparison: "Comparativo",
      testimonials: "Depoimentos",
      start: "Como Começar",
      contact: "Contato",
      cta: "Entrar no Sistema",
      back: "Voltar para o Site"
    },
    login: {
      title: "Portal AGENDA MED",
      subtitle: "Gestão inteligente com realocação ativa",
      email: "E-mail cadastrado",
      password: "Senha de acesso",
      button: "Entrar no Hub",
      forgot: "Recuperar senha",
      demo: "Modo Demonstração",
      address: "Endereço da Clínica",
      plans: "Planos que Atende",
      name: "Nome Completo",
      register: "Criar Conta",
      login: "Entrar",
      noAccount: "Não tem conta? Cadastre-se",
      hasAccount: "Já tem conta? Login",
      verificationSent: "Verifique seu E-mail",
      verificationDesc: "Enviamos um link de confirmação para seu e-mail. Por favor, verifique sua caixa de entrada e spam para ativar sua conta.",
      backToLogin: "Voltar ao Login",
      footer: "Powered By Agenda Med | Todos os direitos reservados 2026"
    },
    map: {
      searchPlaceholder: "Buscar por especialidade ou médico",
      viewList: "Ver em Lista",
      viewMap: "Ver no Mapa",
      bookWhatsapp: "Agendar via WhatsApp",
      nearbyDoctors: "Médicos próximos a você"
    },
    integrations: {
      title: "Integrações Inteligentes",
      googleDesc: "Sincronize sua agenda pessoal com o fluxo da clínica.",
      connect: "Conectar Google Agenda",
      connected: "Google Agenda Conectado",
      syncing: "Sincronizando em tempo real...",
      lastSync: "Última sincronização há 2 min",
      authTitle: "Autorização Google",
      authDesc: "O AGENDA MED solicita acesso para ler e escrever eventos no seu Google Calendar.",
      permissions: ["Ver seus calendários", "Adicionar consultas novas", "Bloquear horários ocupados"],
      allow: "Permitir Acesso",
      deny: "Cancelar"
    },
    app: {
      welcome: "Painel AGENDA MED",
      today: "Agenda do Dia",
      register: "Novo Agendamento",
      physician: "Médico",
      time: "Horário",
      conflict: "⚠️ Conflito de horário detectado!",
      suggestion: "Sugestão de vaga disponível:",
      confirmWa: "Notificar via WhatsApp",
      freeSlots: "Grades Livres",
      stats: {
        occupied: "Consultas",
        free: "Vagas",
        canceled: "Desistências",
        total: "Capacidade"
      },
      form: {
        name: "Nome do Paciente",
        email: "E-mail",
        whatsapp: "WhatsApp",
        submit: "Confirmar Reserva"
      },
      actions: {
        confirm: "Aprovar",
        cancel: "Liberar Vaga",
        delete: "Remover"
      }
    },
    modals: {
      settings: "Configurações do Perfil",
      newSlot: "Abrir Nova Grade",
      healthTips: "Orientações de Saúde - Manaus",
      booking: "Agendar Consulta",
      save: "Salvar Alterações",
      close: "Fechar"
    },
    hero: {
      h1: "Sua Agenda Nunca Mais Ficará Vazia.",
      sub: "AGENDA MED: O hub definitivo para médicos e clínicas que automatiza a realocação de pacientes em tempo real via IA.",
      ctaPrimary: "Começar Agora",
      ctaSecondary: "Agendar Demonstração",
      comingSoon: "Módulo de IA avançada em fase beta. Nosso comercial entrará em contato."
    },
    problem: { 
      title: "Clínicas perdem 30% do faturamento por faltas.", 
      subtitle: "O AGENDA MED elimina o prejuízo do 'No-Show' através de algoritmos de substituição instantânea.", 
      card1: { t: "Fila de Espera.", d: "Pacientes aguardam uma brecha para serem atendidos antes do prazo." }, 
      card2: { t: "Substituição Ativa.", d: "Se o primeiro não confirmar em 24h, o próximo é chamado automaticamente." }, 
      card3: { t: "Check-in Digital.", d: "Confirmação via token único para garantir segurança jurídica." }, 
      card4: { t: "Gestão Centralizada.", d: "Atendentes gerenciam múltiplos médicos em uma interface única." } 
    },
    benefits: {
      title: "Por que escolher o AGENDA MED?",
      subtitle: "Uma infraestrutura robusta para sua clínica escalar com segurança.",
      b1: "Automatização completa de realocações.",
      b2: "Confirmações via token seguro.",
      b3: "Interface responsiva e intuitiva.",
      b4: "Suporte a múltiplos planos de saúde."
    },
    bridge: {
      title: "A ponte entre a necessidade e o cuidado.",
      phrase: "Conectamos médicos e pacientes através de uma malha logística de saúde digital inédita."
    },
    pillars: {
      p1: { t: "Fila de Espera Inteligente", i1: "Monitoramento em tempo real", i2: "Priorização por urgência", i3: "Notificação push automática", res: "Otimização de 40% no tempo de espera." },
      p2: { t: "Segurança de Dados", i1: "Criptografia ponta-a-ponta", i2: "Conformidade LGPD", i3: "Backup em tempo real", res: "Segurança total para sua clínica." },
      p3: { t: "Gestão de Atendentes", i1: "Controle de permissões", i2: "Múltiplas agendas simultâneas", i3: "Histórico completo de ações", res: "Redução de erros operacionais." }
    },
    comparison: {
      title: "O Antes e Depois da sua Clínica",
      current: "Sem AGENDA MED",
      withUs: "Com AGENDA MED",
      row1: ["Agendas com buracos por faltas", "Realocação automática de fila de espera"],
      row2: ["Perda de tempo confirmando consultas", "Sistema confirma e substitui sozinho"],
      row3: ["Pacientes desistem sem avisar", "Check-in digital antecipado e obrigatório"],
      row4: ["Gestão de fila manual em papel", "Dashboard digital em tempo real"],
      row5: ["Faturamento instável", "Previsibilidade e ROI maximizado"]
    },
    testimonials: {
      title: "O que dizem os especialistas",
      t1: "A realocação automática mudou meu consultório. Nunca mais tive horários ociosos.",
      a1: "Dr. Ricardo Santos - Cardiologista",
      t2: "A interface é futurista e muito fácil de usar pelos meus atendentes.",
      a2: "Dra. Letícia Mayer - Dermatologista",
      disclaimer: "Relatos baseados na fase beta da plataforma."
    },
    start: {
      title: "Comece em minutos",
      subtitle: "Siga o rito tecnológico para ativar sua agenda.",
      s1: { t: "Cadastro Rápido", d: "Crie sua conta e defina seu CRM e especialidades." },
      s2: { t: "Defina sua Grade", d: "Insira seus horários e planos de saúde aceitos." },
      s3: { t: "Ative a Realocação", d: "Nossa IA começa a trabalhar na sua lista de espera." }
    },
    contact: {
      title: "Pronto para o futuro?",
      colA: "Acesse via App",
      colB: "Fale conosco",
      btnWhats: "WhatsApp Direto",
      form: {
        name: "Seu Nome",
        whatsapp: "Seu WhatsApp",
        specialty: "Sua Especialidade",
        city: "Sua Cidade",
        submit: "Solicitar Acesso",
        sending: "Enviando...",
        success: "Lead capturado com sucesso!",
        error: "Erro ao enviar. Tente novamente."
      }
    },
    footer: { 
      lgpd: "Plataforma em total conformidade com a LGPD e sigilo médico.", 
      privacy: "Políticas de Privacidade", 
      terms: "Termos de Serviço" 
    }
  },
  'en': {
    nav: { cta: "System Login", back: "To Website" },
    login: { title: "AGENDA MED Portal", subtitle: "Smart management", button: "Token Login" },
    app: { welcome: "AGENDA MED Dashboard", register: "New Appointment" },
    hero: { comingSoon: "Coming Soon!" },
    bridge: { title: "Bridge to Care", phrase: "Connecting health and technology." }
  }
};
