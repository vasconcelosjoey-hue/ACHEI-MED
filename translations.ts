
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
      cta: "Entrar no App",
      back: "Voltar para o Site"
    },
    login: {
      title: "Acesso Restrito",
      subtitle: "Entre com as credenciais da sua clínica",
      email: "E-mail profissional",
      password: "Senha",
      button: "Entrar no Sistema",
      forgot: "Esqueci minha senha",
      demo: "Acessar modo demonstração"
    },
    app: {
      welcome: "Gestão Achei Med",
      today: "Agenda de Hoje",
      register: "Novo Paciente",
      physician: "Médico Responsável",
      time: "Horário",
      conflict: "⚠️ Este horário já está ocupado!",
      suggestion: "Sugestão de horário vago:",
      confirmWa: "Confirmar via WhatsApp",
      freeSlots: "Horários Disponíveis",
      stats: {
        occupied: "Ocupados",
        free: "Vagos",
        canceled: "Cancelados",
        total: "Total do Dia"
      },
      form: {
        name: "Nome Completo",
        email: "E-mail",
        whatsapp: "WhatsApp (com DDD)",
        submit: "Agendar Consulta"
      },
      actions: {
        confirm: "Confirmar",
        cancel: "Cancelar",
        delete: "Remover"
      }
    },
    hero: {
      h1: "O Fim da Sua Agenda Vazia.",
      sub: "Achei Med: Gestão ativa de pacientes e reencaixe inteligente para clínicas que buscam excelência e alta performance.",
      ctaPrimary: "Conhecer Plataforma",
      ctaSecondary: "Ver Planos e Preços",
      comingSoon: "Novos planos em breve! Nossa equipe comercial entrará em contato."
    },
    problem: { 
      title: "Seu consultório perde dinheiro todos os dias.", 
      subtitle: "Hoje, a gestão tradicional enfrenta 4 travas críticas que impedem o seu crescimento:", 
      card1: { t: "Faltas (No-Show).", d: "Pacientes que esquecem e deixam buracos irrecuperáveis na sua grade." }, 
      card2: { t: "Lacunas Invisíveis.", d: "Cancelamentos em cima da hora que a sua equipe não consegue repor a tempo." }, 
      card3: { t: "Fricção no Agendamento.", d: "Processos lentos que fazem o paciente desistir da consulta." }, 
      card4: { t: "Gestão 100% Manual.", d: "Secretárias sobrecarregadas com tarefas que poderiam ser automatizadas." } 
    },
    cost: { 
      title: "O Custo de uma Agenda Ineficiente.", 
      text: "Cada horário vago é um faturamento que se perde para sempre. O médico trabalha muito, mas o resultado financeiro não acompanha o esforço." 
    },
    benefits: { 
      title: "Um consultório onde cada minuto gera valor.", 
      subtitle: "Nossa tecnologia garante:", 
      b1: "Agenda Otimizada e Inteligente", 
      b2: "Faturamento Previsível", 
      b3: "Rotina Administrativa Organizada", 
      b4: "Pacientes Satisfeitos e Engajados" 
    },
    bridge: { 
      title: "Achei Med: A ponte para o sucesso da sua clínica.", 
      phrase: "Não é apenas um software. É um acelerador de resultados médicos." 
    },
    pillars: { 
      p1: { t: "IA Anti-Faltas.", i1: "Lembretes via WhatsApp", i2: "Confirmação em um clique", i3: "Status de Presença em Tempo Real", res: "Redução drástica de ausências" }, 
      p2: { t: "Reencaixe em Segundos.", i1: "Detecção de Vagas", i2: "Fila de Espera Inteligente", i3: "Preenchimento Automático", res: "Ocupação próxima de 100%" }, 
      p3: { t: "Visibilidade Total.", i1: "Dashboard Operacional", i2: "Busca Inteligente", i3: "Gestão Multi-Médicos", res: "Controle total da sua operação" } 
    },
    comparison: { 
      title: "O Salto de Qualidade da Sua Clínica", 
      current: "Cenário Atual", 
      withUs: "Com Achei Med", 
      row1: ["Faltas constantes", "Faltas reduzidas em 90%"], 
      row2: ["Buracos na agenda", "Reencaixe automático"], 
      row3: ["Secretária estressada", "Equipe focada no acolhimento"], 
      row4: ["Processos lentos", "Agendamento instantâneo"], 
      row5: ["Faturamento estagnado", "Aumento real de receita"] 
    },
    testimonials: { 
      title: "Quem usa, aprova", 
      t1: "Meu faturamento aumentou consideravelmente desde que paramos de perder horários com desistências.", 
      a1: "Dr. Ricardo Mendes - Cardiologista", 
      t2: "A ferramenta de reencaixe é fantástica. Não temos mais buracos na agenda da tarde.", 
      a2: "Dra. Juliana Costa - Dermatologista", 
      disclaimer: "Os resultados podem variar de acordo com a região e especialidade." 
    },
    start: { 
      title: "Simples. Rápido. Lucrativo.", 
      subtitle: "Implementação em 3 passos:", 
      s1: { t: "Configuração", d: "Ativamos sua agenda em menos de 24 horas." }, 
      s2: { t: "Treinamento", d: "Sua equipe aprende a usar em apenas 60 minutos." }, 
      s3: { t: "Resultados", d: "Sinta a diferença na ocupação já na primeira semana." } 
    },
    contact: { 
      title: "Vamos transformar sua clínica?", 
      colA: "BAIXAR AGORA", 
      colB: "FALAR COM ESPECIALISTA", 
      btnWhats: "WhatsApp", 
      form: { 
        name: "Seu Nome", 
        whatsapp: "Seu WhatsApp", 
        specialty: "Sua Especialidade", 
        city: "Sua Cidade", 
        submit: "Quero uma Agenda Cheia", 
        sending: "Processando...", 
        success: "Recebemos seus dados! Entraremos em contato em breve.", 
        error: "Ocorreu um erro. Tente novamente." 
      } 
    },
    footer: { 
      lgpd: "Seus dados estão seguros e em conformidade com a LGPD.", 
      privacy: "Privacidade", 
      terms: "Termos de Uso" 
    }
  },
  'en': {
    nav: { cta: "App Login", back: "Back to Site" },
    login: { title: "Login", subtitle: "Enter credentials", button: "Login" },
    app: { welcome: "Achei Med", register: "New Patient" },
    hero: { comingSoon: "Coming Soon!" }
  }
};
