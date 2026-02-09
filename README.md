<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1vM4T1mS_btYFDtvvN5PApMHilmloZBzi

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy gratuito (Vercel)

1. Suba o projeto para o GitHub (repositório público ou privado).
2. No Vercel, clique em **Add New → Project** e conecte o repositório.
3. Em **Environment Variables**, adicione `GEMINI_API_KEY` com o mesmo valor do `.env.local`.
4. Mantenha as configurações padrão do Vite:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Clique em **Deploy**. O Vercel fará o build e publicará o site.

> Dica: qualquer novo commit na branch principal dispara um novo deploy automaticamente.

## Auto-commit local

Se quiser criar commits automáticos **localmente** enquanto edita o projeto, rode:

```bash
npm install
npm run auto-commit
```

O watcher cria um commit a cada ~30 segundos quando houver mudanças, com a mensagem
`Auto-commit: <timestamp>`. Ele ignora `node_modules`, `.git` e `dist`.

> Observação: commits automáticos só funcionam na sua máquina (não no GitHub/Vercel).

## Documentação Técnica: AGENDA MED (Health OS 2.0)

### 1. Visão Geral
O AGENDA MED é uma plataforma de gestão de saúde Premium projetada para otimizar a ocupação de clínicas médicas através de realocação inteligente, lista de espera ativa e sincronização em nuvem. O sistema oferece experiências distintas e isoladas para Médicos e Pacientes.

### 2. Stack Tecnológica
- **Frontend:** React 19 (ESM)
- **Estilização:** Tailwind CSS (Design System Minimalista/Futurista)
- **Animações:** GSAP 3.12 (ScrollTrigger, Reveal effects)
- **Backend & Database:** Firebase 11.1.0 (Firestore, Authentication)
- **Gráficos:** ECharts 5.4 (Integração preparada)
- **Linguagem:** TypeScript (Type Safety total)

### 3. Arquitetura de Software

#### 3.1. Fluxo de Navegação
- **Landing Page:** Seções de conversão (Problema, Benefícios, Pilares, Comparativo).
- **Autenticação (Auth Hub):** Sistema de login/cadastro com isolamento de papéis (RBAC).
- **Onboarding:** Tutorial interativo (GSAP) personalizado conforme o perfil do usuário.
- **Dashboards:**
  - **Médico:** Gestão de grade, aprovação de encaixes e sincronização com Google Calendar.
  - **Paciente:** Busca inteligente por especialidade/plano e entrada em filas de espera.

#### 3.2. Segurança e Regras de Negócio
- **Isolamento de Perfil:** Um e-mail cadastrado como "Paciente" é impedido de logar na interface "Médico".
- **Validação de E-mail:** Firebase Auth exige verificação da conta antes do primeiro acesso.
- **Sincronização Cloud:** Uso de tokens OAuth do Google para espelhamento de agenda (preparado no PhysicianDashboard).

### 4. Estrutura de Arquivos
- `index.html`: Entry point com configuração de importmap (Firebase v11.1 fixo).
- `App.tsx`: Orquestrador de rotas lógicas e estado global de autenticação.
- `firebase.ts`: Configuração central do Firebase (DB, Auth, Google Provider).
- `types.ts`: Definições de interfaces (User, Physician, Appointment) e Mocks.
- `components/`: Componentes modulares (Hero, Dashboards, AuthView, etc.).
- `services/`: Lógica externa, como o EmailService para notificações.

### 5. Principais Funcionalidades

#### 5.1. Sistema de Lista de Espera (Waiting List)
- O paciente pode clicar em **"Entrar na Fila de Espera"** quando a agenda do médico estiver lotada.
- O registro é salvo no Firestore com o status `WAITING_LIST`.
- O médico visualiza esses pedidos em um painel lateral destacado no seu Dashboard.
- Ao **"Liberar Vaga"**, o sistema atualiza o status e notifica o paciente.

#### 5.2. Sincronização Google Calendar
- Permite que o médico conecte sua conta Google.
- O sistema solicita permissões de `calendar.events` para evitar conflitos entre consultas da clínica e compromissos pessoais do médico.

#### 5.3. Busca Inteligente (Patient Search)
- Filtros em tempo real por nome, especialidade ou plano de saúde.
- Calendário dinâmico para seleção de datas e slots de tempo baseados nas regras de disponibilidade (`availabilityRules`) de cada médico.

### 6. Configuração e Instalação

#### Requisitos de Ambiente
O projeto utiliza variáveis de ambiente injetadas pelo Google AI Studio (`process.env.API_KEY`).

#### Credenciais Firebase
Para produção, as chaves em `firebase.ts` devem ser atualizadas para o seu projeto oficial no Console do Firebase. Certifique-se de ativar:
- Email/Password Auth
- Google Sign-In (com suporte a escopos de Calendar)
- Firestore Database (modo produção com regras de segurança para `users` e `appointments`)

### 7. Guia de Estilo (UI/UX)
- **Cores:** Deep Aqua (#0D9488), Baby Blue (#B9E6FE), Slate (#0F172A).
- **Tipografia:** Plus Jakarta Sans (Corpo) e Space Grotesk (Títulos/Display).
- **Componentes:** Cards com backdrop-blur (Glassmorphism) e bordas arredondadas de 3rem.

> Nota Final: Este sistema foi construído seguindo padrões de engenharia de software de nível sênior, priorizando escalabilidade e a experiência do usuário final.
