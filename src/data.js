// ─────────────────────────────────────────────────────────────────────────────
// data.js — fonte única de verdade para toda a Bússola
// ─────────────────────────────────────────────────────────────────────────────

export const UI_TEXT = {
  pt: {
    dashboard: 'Painel', trilha: 'Trilha', skills: 'Skills',
    resources: 'Recursos', market: 'Mercado', settings: 'Configurações',
    greeting_morning: 'Bom dia', greeting_afternoon: 'Boa tarde', greeting_evening: 'Boa noite',
    hero_title: 'Sua jornada Salesforce', hero_sub: 'Do Admin ao CTA — guiado por fases.',
    certs_done: 'Certificações', skills_done: 'Skills', progress: 'Progresso',
    study_today: 'FOCO AGORA', phase_label: 'Fase atual',
    section_trilha_title: 'Trilha de Certificação',
    section_trilha_sub: 'Cinco fases sequenciais — expanda cada uma para ver certs, checkpoints e recursos',
    section_skills_title: 'Skills Técnicas', section_skills_sub: 'Marque o que já domina — organizado por fase',
    section_resources_title: 'Recursos de Estudo', section_resources_sub: 'Os melhores de cada tipo, organizados por fase de aprendizado',
    section_market_title: 'Mercado & Estratégia', section_market_sub: 'Salários reais, decisões que importam, o que priorizar agora',
    section_settings_title: 'Configurações', section_settings_sub: 'Gerencie seu progresso',
    all: 'Todos', not_started: 'Não iniciada', studying: 'Estudando', completed: 'Concluída', retired: 'Aposentada',
    export_data: 'Exportar Progresso', import_data: 'Importar Progresso', reset_data: 'Resetar Tudo',
    reset_confirm: 'Tem certeza? Todo progresso será perdido.',
    checkpoints: 'Checkpoints — quando avançar', gotchas: 'Atenção — erros comuns',
    key_resources: 'Recursos-chave', how_to_study: 'Como estudar',
    exam_info: 'Sobre o exame', why_it_matters: 'Por que importa',
    unlocks: 'Desbloqueia', optional: 'opcional',
    salary_section: 'Salários no mercado brasileiro (2025-2026)',
    salary_note: 'Glassdoor subestima em 30-40%. Esta tabela cruza Salary Survey Salesforce Ben + vagas reais.',
    decisions_title: 'As 3 decisões que realmente movem a agulha',
    market_insights_title: 'O que o mercado está dizendo agora',
    intl_note: 'R$ equiv./mês (dólar ~R$ 5.20)',
    exp_label: 'Experiência',
    phase_of: 'de',
    phase_completed: 'concluída',
    phase_in_progress: 'em andamento',
    phase_locked: 'bloqueada',
  },
  en: {
    dashboard: 'Dashboard', trilha: 'Path', skills: 'Skills',
    resources: 'Resources', market: 'Market', settings: 'Settings',
    greeting_morning: 'Good morning', greeting_afternoon: 'Good afternoon', greeting_evening: 'Good evening',
    hero_title: 'Your Salesforce Journey', hero_sub: 'From Admin to CTA — guided by phases.',
    certs_done: 'Certifications', skills_done: 'Skills', progress: 'Progress',
    study_today: 'FOCUS NOW', phase_label: 'Current phase',
    section_trilha_title: 'Certification Path',
    section_trilha_sub: 'Five sequential phases — expand each to see certs, checkpoints and resources',
    section_skills_title: 'Technical Skills', section_skills_sub: 'Check off what you\'ve mastered — organized by phase',
    section_resources_title: 'Study Resources', section_resources_sub: 'The best of each type, organized by learning phase',
    section_market_title: 'Market & Strategy', section_market_sub: 'Real salaries, decisions that matter, what to prioritize now',
    section_settings_title: 'Settings', section_settings_sub: 'Manage your progress',
    all: 'All', not_started: 'Not started', studying: 'Studying', completed: 'Completed', retired: 'Retired',
    export_data: 'Export Progress', import_data: 'Import Progress', reset_data: 'Reset All',
    reset_confirm: 'Are you sure? All progress will be lost.',
    checkpoints: 'Checkpoints — when to advance', gotchas: 'Watch out — common mistakes',
    key_resources: 'Key resources', how_to_study: 'How to study',
    exam_info: 'About the exam', why_it_matters: 'Why it matters',
    unlocks: 'Unlocks', optional: 'optional',
    salary_section: 'Salaries in the Brazilian market (2025-2026)',
    salary_note: 'Glassdoor underestimates by 30-40%. This table combines Salesforce Ben Salary Survey + real job postings.',
    decisions_title: 'The 3 decisions that actually move the needle',
    market_insights_title: 'What the market is saying now',
    intl_note: 'R$ equiv./month (USD ~R$ 5.20)',
    exp_label: 'Experience',
    phase_of: 'of',
    phase_completed: 'completed',
    phase_in_progress: 'in progress',
    phase_locked: 'locked',
  }
};

export const NAV_ITEMS = [
  { id: 'dashboard', icon: 'dashboard', key: 'dashboard' },
  { id: 'trilha', icon: 'map', key: 'trilha' },
  { id: 'skills', icon: 'construction', key: 'skills' },
  { id: 'resources', icon: 'menu_book', key: 'resources' },
  { id: 'market', icon: 'trending_up', key: 'market' },
  { id: 'settings', icon: 'settings', key: 'settings' },
];

// ─── CERTIFICAÇÕES ────────────────────────────────────────────────────────────
// phaseId mapeia para PHASES.id abaixo
// studyTips: ações concretas de estudo — o que fazer HOJE
// gotcha: armadilha comum a evitar
// examDetails: preço, questões, nota mínima
export const CERTIFICATIONS = [
  {
    id: 'admin', name: 'Platform Administrator', phaseId: 'foundations',
    desc: 'Base declarativa: profiles, permissions, flows, reports, segurança.',
    estimatedWeeks: '8-12 semanas',
    whyItMatters: 'É a porta de entrada. Sem Admin não tem acesso a 90% das vagas. O exame cobre ~8% de Agentforce desde dez/2025.',
    studyTips: [
      'Comece pelo trailmix oficial @strailhead para Admin no Trailhead',
      'Faça o Superbadge: Business Administration Specialist antes do exame',
      'Faça o Superbadge: Security Specialist (cobre OWD, perfis, permission sets)',
      'Simule o exame em Focus on Force ou Salesforce Ben Quizzes',
      'Cubra a parte de Agentforce (~8% do exame desde dez/2025)',
    ],
    gotcha: 'Completar trilhas no Trailhead ≠ estar pronto para o exame. Simule muito antes de agendar.',
    examDetails: { price: 'US$ 200', questions: 60, passingPct: 65 },
    order: 1, defaultStatus: 'not_started',
  },
  {
    id: 'app_builder', name: 'Platform App Builder', phaseId: 'practitioner',
    desc: 'Lightning App Builder, Dynamic Forms, data model, automações declarativas.',
    estimatedWeeks: '6-8 semanas',
    whyItMatters: 'Junto com Dev I, abre 70% das vagas do ecossistema. Habilita trabalhar sem código e entender o que é possível declarativamente.',
    studyTips: [
      'Foque em data model (relacionamentos, tipos de campo, lookup vs master-detail)',
      'Domine Flow Builder — Screen, Record-Triggered, Scheduled e Platform Events Flow',
      'Estude Lightning App Builder e Dynamic Forms com Trailhead hands-on',
      'App Builder parece fácil mas o exame é específico — simule bastante',
    ],
    gotcha: 'O exame cobra detalhes técnicos de Flow que vão além do "básico". Não subestime.',
    examDetails: { price: 'US$ 200', questions: 60, passingPct: 63 },
    order: 2, defaultStatus: 'not_started',
  },
  {
    id: 'dev1', name: 'Platform Developer', phaseId: 'practitioner',
    desc: 'Apex, SOQL/SOSL, LWC, triggers, governor limits, test classes.',
    estimatedWeeks: '12-16 semanas',
    whyItMatters: 'Maior demanda do ecossistema. Com Dev I você acessa projetos de desenvolvimento e dobra seu potencial de renda.',
    studyTips: [
      'Faça o Superbadge: Apex Specialist — obrigatório antes do exame',
      'Faça o Superbadge: Lightning Web Components Specialist',
      'Pratique bulkification: nunca SOQL ou DML dentro de loop',
      'Domine os governor limits: 100 SOQL síncronos, 150 DML, 6MB heap',
      'Escreva test classes com @isTest, @TestSetup, Test.startTest() / stopTest()',
      'Leia o SFDC99 de David Liu — Apex explicado para quem vem do Admin',
    ],
    gotcha: 'NUNCA coloque SOQL ou DML dentro de um loop. Isso é o que separa Junior de Pleno — e o exame cobra isso.',
    examDetails: { price: 'US$ 200', questions: 60, passingPct: 65 },
    order: 3, defaultStatus: 'not_started',
  },
  {
    id: 'adv_admin', name: 'Platform Administrator II', phaseId: 'practitioner',
    desc: 'Territory Management 2.0, Flow Orchestrator, sandbox strategy, segurança avançada. (Opcional)',
    estimatedWeeks: '6-10 semanas',
    whyItMatters: 'Opcional na trilha principal, mas detalha skills que arquitetos cobram: Territory, Flow Orchestrator, data skew.',
    studyTips: [
      'Foque em Territory Management 2.0 e Flow Orchestrator — são os diferenciais',
      'Entenda data skew (account, owner, lookup) — aparece muito em exames de arquitetura',
      'Estude Sharing Sets para Experience Cloud',
    ],
    gotcha: 'Opcional na trilha CTA, mas fica mais difícil depois do Dev I. Se quiser, faça junto com App Builder.',
    examDetails: { price: 'US$ 200', questions: 60, passingPct: 65 },
    order: 4, defaultStatus: 'not_started', optional: true,
  },
  {
    id: 'sales_cloud', name: 'Sales Cloud Consultant', phaseId: 'specialist',
    desc: 'Oportunidades, forecasting, produtos, CPQ básico — contexto de negócio.',
    estimatedWeeks: '8-10 semanas',
    whyItMatters: 'Contextualiza o negócio. Consultorias exigem pelo menos uma cloud consultant para cargos plenos+.',
    studyTips: [
      'Foque no processo de venda: Leads → Oportunidades → Produtos → Contratos',
      'Entenda forecasting, quotas e territory management em contexto de negócio',
      'Leia cases reais de implementação no Architect Hub',
      'Simule o exame — tem muitas questões de cenário/negócio, não só técnicas',
    ],
    gotcha: 'Exige experiência real em projetos de Sales Cloud. Simule projetos em dev org antes.',
    examDetails: { price: 'US$ 200', questions: 60, passingPct: 62 },
    order: 5, defaultStatus: 'not_started',
  },
  {
    id: 'service_cloud', name: 'Service Cloud Consultant', phaseId: 'specialist',
    desc: 'Cases, Knowledge, Omni-Channel, Entitlements, Field Service básico.',
    estimatedWeeks: '8-10 semanas',
    whyItMatters: 'Service Cloud é um dos maiores mercados do ecossistema no Brasil (bancos, telecoms, varejo). Alta demanda.',
    studyTips: [
      'Domine Cases, Knowledge e Entitlements com SLAs',
      'Entenda Omni-Channel: routing, presence, capacity',
      'Estude Contact Center metrics e relatórios de suporte',
    ],
    gotcha: 'Semelhante ao Sales Cloud — o exame cobra cenários reais. Precisar de experiência prática.',
    examDetails: { price: 'US$ 200', questions: 60, passingPct: 62 },
    order: 6, defaultStatus: 'not_started',
  },
  {
    id: 'data_arch', name: 'Platform Data Architect', phaseId: 'architect',
    desc: 'Data modeling, large data volumes, data migration, Big Objects.',
    estimatedWeeks: '12-16 semanas',
    whyItMatters: 'Primeira cert de arquitetura. Entra no Application Architect designation. Exige pensar em escala, não só em funcionalidade.',
    studyTips: [
      'Leia o Architect Hub: Data Management Guide e Large Data Volumes Guide',
      'Entenda quando usar custom objects vs Big Objects vs External Objects',
      'Estude data skew profundamente (account skew, owner skew, lookup skew)',
      'Faça o Superbadge: Process Automation Specialist',
      'Pratique desenhar ERDs de soluções complexas',
    ],
    gotcha: 'O exame é mais difícil do que parece. Foca em cenários de trade-off — não existe resposta única.',
    examDetails: { price: 'US$ 200', questions: 60, passingPct: 62 },
    order: 7, defaultStatus: 'not_started',
  },
  {
    id: 'sharing_arch', name: 'Platform Sharing & Visibility Architect', phaseId: 'architect',
    desc: 'OWD, sharing rules, Restriction/Scoping Rules, field-level security em escala.',
    estimatedWeeks: '10-14 semanas',
    whyItMatters: 'Completa o Application Architect designation (junto com Data Arch + App Builder + Dev I). Uma das designações mais reconhecidas.',
    studyTips: [
      'Domine completamente OWD → Role Hierarchy → Sharing Rules → Manual Sharing',
      'Entenda Restriction Rules e Scoping Rules (introduzidos mais recentemente)',
      'Estude Sharing Sets para Experience Cloud (comunidades externas)',
      'Pratique cenários de "mínimo acesso necessário" — o princípio do exame',
    ],
    gotcha: 'Exige entender implicações de performance de sharing. Apex Managed Sharing tem custos altos.',
    examDetails: { price: 'US$ 200', questions: 60, passingPct: 62 },
    order: 8, defaultStatus: 'not_started', unlocks: 'Application Architect',
  },
  {
    id: 'integration_arch', name: 'Platform Integration Architect', phaseId: 'architect',
    desc: '6 padrões de integração, REST/SOAP/Bulk API 2.0/Pub-Sub API, MuleSoft, Named Credentials.',
    estimatedWeeks: '14-18 semanas',
    whyItMatters: 'A cert mais pesada da trilha. Integração é o skill mais bem pago do ecossistema (mediana US$150k nos EUA).',
    studyTips: [
      'Leia o "Salesforce Integration Patterns & Practices" no Architect Hub — é a bíblia',
      'Domine os 6 padrões: Request-Reply, Fire-and-Forget, Batch Sync, Remote Call-In, UI Update, Data Virtualization',
      'Entenda quando usar cada API: REST vs SOAP vs Bulk 2.0 vs Composite vs Pub/Sub',
      'Faça o Superbadge: Data Integration Specialist',
      'Estude Named Credentials e External Credentials (OAuth, JWT, mTLS)',
      'A Streaming API foi SUBSTITUÍDA pelo Pub/Sub API (gRPC + Avro) — estude o novo',
    ],
    gotcha: 'A Streaming API foi depreciada. O exame agora cobra Pub/Sub API como padrão. Não estude a Streaming API como solução principal.',
    examDetails: { price: 'US$ 200', questions: 60, passingPct: 62 },
    order: 9, defaultStatus: 'not_started',
  },
  {
    id: 'identity_arch', name: 'Platform Identity & Access Management Architect', phaseId: 'architect',
    desc: 'SAML 2.0, os 6 OAuth 2.0 flows, OIDC com PKCE, SSO, Connected Apps, SCIM.',
    estimatedWeeks: '12-16 semanas',
    whyItMatters: 'SSO e identidade são requisitos em qualquer projeto enterprise. Entra no System Architect designation.',
    studyTips: [
      'Memorize os 6 OAuth 2.0 flows: Web Server, JWT Bearer, Device, Client Credentials, SAML Bearer, Refresh',
      'Entenda SP-initiated vs IdP-initiated SAML — o exame cobra os dois',
      'Estude JIT Provisioning e SCIM para criação automática de usuários',
      'Entenda My Domain e como ele afeta SSO e Connected Apps',
      'Pratique configurar SSO com um Identity Provider real (Okta, Azure AD)',
    ],
    gotcha: 'Os fluxos OAuth têm detalhes sutis que o exame explora. Confundir JWT Bearer com SAML Bearer é erro comum.',
    examDetails: { price: 'US$ 200', questions: 60, passingPct: 62 },
    order: 10, defaultStatus: 'not_started',
  },
  {
    id: 'devops_arch', name: 'Platform Dev Lifecycle & Deployment Architect', phaseId: 'architect',
    desc: 'Salesforce DX, scratch orgs, unlocked packages, CI/CD pipelines, Git.',
    estimatedWeeks: '10-14 semanas',
    whyItMatters: 'Completa o System Architect designation. DevOps moderno é esperado em qualquer projeto de enterprise.',
    studyTips: [
      'Domine Salesforce DX: sf CLI, scratch orgs, unlocked packages',
      'Configure um pipeline completo de CI/CD com GitHub Actions (é grátis)',
      'Compare as plataformas: Copado vs Gearset vs Flosum vs AutoRABIT vs DevOps Center',
      'Entenda Trunk-Based Development vs Gitflow em contexto Salesforce',
      'Configure Apex Unit Tests, Jest para LWC e PMD/Code Analyzer no pipeline',
    ],
    gotcha: 'DevOps Center oficial é gratuito mas muito limitado. O mercado usa Gearset ou Copado — saiba a diferença.',
    examDetails: { price: 'US$ 200', questions: 60, passingPct: 62 },
    order: 11, defaultStatus: 'not_started', unlocks: 'System Architect',
  },
  {
    id: 'cta_eval', name: 'CTA Review Board Evaluation', phaseId: 'cta',
    desc: 'Avaliação inicial — elegibilidade para o Review Board.',
    estimatedWeeks: 'Vários meses de prep',
    whyItMatters: 'Primeiro passo do processo CTA. Valida que você tem Application + System Architect antes de pagar o exame.',
    studyTips: [
      'Ter Application Architect + System Architect destravados é pré-requisito',
      'Faça o workshop CTA601 da Trailhead Academy — praticamente obrigatório',
      'Encontre um mentor ativo: Apex Hours, Architect Trailblazers, Ladies be Architects',
      'Participe do Architect Ohana e CTA Gang of Four no Discord',
    ],
    gotcha: 'Sem inglês fluente o Review Board não é viável — toda a apresentação e Q&A é em inglês.',
    examDetails: { price: 'US$ 1.500', questions: 'Review Board', passingPct: '25-30% taxa histórica' },
    order: 12, defaultStatus: 'not_started',
  },
  {
    id: 'cta_exam', name: 'CTA Review Board Exam', phaseId: 'cta',
    desc: '180min desenhando solução enterprise + 45min apresentação + 40min Q&A com 3 juízes CTA.',
    estimatedWeeks: '4-12 meses de prep exclusiva',
    whyItMatters: 'Menos de 500 CTAs no mundo, ~5-12 brasileiros. O maior símbolo de prestígio do ecossistema.',
    studyTips: [
      'Pratique mocks do Review Board: 180min de solução + apresentação + Q&A',
      'Domine o Well-Architected Framework (Trusted, Easy, Adaptable) — é a linguagem do Board',
      'Leia TODAS as Decision Guides no Architect Hub (integração, data, agentforce, sharing)',
      'Grave suas apresentações e critique — postura e clareza contam tanto quanto técnica',
      'Tenha experiência real em projetos enterprise multinuvem',
    ],
    gotcha: 'O custo total na primeira tentativa é ~US$ 6.000 (Evaluation US$1.500 + Exam US$4.500). Planeje.',
    examDetails: { price: 'US$ 4.500', questions: 'Review Board ao vivo', passingPct: '25-30% histórico' },
    order: 13, defaultStatus: 'not_started',
  },
  // Complementares
  { id: 'sep1', name: '── Complementares ──', desc: '', order: 100, isSeparator: true },
  {
    id: 'mc_email', name: 'Marketing Cloud Email Specialist', phaseId: 'specialist',
    desc: 'Email marketing, AMPscript, Automation Studio.', order: 101, defaultStatus: 'completed',
    estimatedWeeks: '6-8 semanas', whyItMatters: 'Nicho bem pago com poucos especialistas no Brasil.', studyTips: [], gotcha: null, examDetails: { price: 'US$ 200', questions: 60, passingPct: 63 },
  },
  {
    id: 'ai_associate', name: 'AI Associate', phaseId: 'specialist',
    desc: 'APOSENTADA em 02/02/2026. Substituída pelo programa Agentblazer (Champion → Innovator → Legend).', order: 102, defaultStatus: 'retired',
    estimatedWeeks: 'N/A', whyItMatters: 'Não investir mais tempo nesta cert.', studyTips: [],
    gotcha: 'APOSENTADA. Não estude esta cert — o programa Agentblazer é o substituto oficial.', examDetails: { price: 'N/A', questions: 'N/A', passingPct: 'N/A' },
  },
  {
    id: 'agentforce', name: 'Agentforce Specialist', phaseId: 'specialist',
    desc: 'Prompt Engineering 30%, Agentforce 30%, Data Cloud 20%, Service/Sales 20%.',
    estimatedWeeks: '6-8 semanas',
    whyItMatters: 'A certificação-chave de 2025-2026. Prêmio salarial de 15-30%. Substitui a AI Associate aposentada.',
    studyTips: [
      'Junte o programa Agentblazer no Trailhead — Champion → Innovator → Legend',
      'Construa um agente real no Agent Builder e teste no Testing Center',
      'Entenda Einstein Trust Layer: dynamic grounding, zero-data retention, audit trail',
      'Domine Prompt Builder e os templates: Sales Email, Field Generation, Record Summary, Flex',
      'Estude MCP (Model Context Protocol) para comunicação agent-to-agent',
    ],
    gotcha: 'A distribuição do exame: Prompt Engineering 30% + Agentforce Concepts 30%. Não descuide de nenhuma das duas.',
    examDetails: { price: 'US$ 200', questions: 60, passingPct: 73 },
    order: 103, defaultStatus: 'not_started',
  },
  {
    id: 'data360', name: 'Data 360 Consultant', phaseId: 'specialist',
    desc: 'Ex-Data Cloud Consultant (renomeado em abr/2026). Ingestão, DLOs→DMOs, Identity Resolution.',
    estimatedWeeks: '8-10 semanas',
    whyItMatters: 'Data Cloud (Data 360) é a base de toda a estratégia de IA da Salesforce. Perfil mais bem pago nos especialistas.',
    studyTips: [
      'Comece pelo trailmix "Get Hands on with Data Cloud!" — 10h+ de vídeos',
      'Entenda o fluxo: Data Streams → DLOs → DMOs → Identity Resolution → Segments → Activations',
      'Domine zero-copy connectors (Snowflake, Databricks, BigQuery via Apache Iceberg)',
      'Entenda como Retrievers conectam Data 360 com Agentforce para RAG',
    ],
    gotcha: 'Renomeado de "Data Cloud Consultant" para "Data 360 Consultant" em abril/2026. A cert mudou de nome — não confunda.',
    examDetails: { price: 'US$ 200', questions: 60, passingPct: 62 },
    order: 104, defaultStatus: 'not_started',
  },
];

// ─── FASES ────────────────────────────────────────────────────────────────────
// Cada fase mapeia cert IDs, skill categories, checkpoints e recursos-chave
export const PHASES = [
  {
    id: 'foundations', number: 1, name: 'Fundação', color: '#0071e3',
    tagline: 'Entender o ecossistema e passar no Admin',
    estimatedTime: '6-12 meses',
    certIds: ['admin'],
    primarySkillCategories: ['Administrator'],
    checkpoints: [
      'Completou o trailmix oficial @strailhead para Admin no Trailhead',
      'Fez Superbadge: Business Administration Specialist',
      'Fez Superbadge: Security Specialist',
      'Praticou em org Salesforce por pelo menos 3-6 meses',
      'Passou no exame Platform Administrator (US$ 200, 65%)',
    ],
    gotchas: [
      'Completar trilhas no Trailhead ≠ estar pronto para o exame. Simule muito.',
      'O exame inclui ~8% de Agentforce desde dezembro/2025 — cubra isso antes de agendar.',
      'Não pule a prática real em orgs — conhecimento teórico não é suficiente.',
    ],
    keyResources: [
      { name: 'Trailmix Oficial Admin (@strailhead)', url: 'https://trailhead.salesforce.com', type: 'trailhead', desc: 'O ponto de partida. O trailmix oficial mantido pelo Salesforce.' },
      { name: 'Superbadge: Business Administration Specialist', url: 'https://trailhead.salesforce.com/content/learn/superbadges/superbadge_bas', type: 'trailhead', desc: 'Obrigatório antes do exame Admin.' },
      { name: 'Superbadge: Security Specialist', url: 'https://trailhead.salesforce.com/content/learn/superbadges/superbadge_security', type: 'trailhead', desc: 'Cobre OWD, perfis e permission sets em profundidade.' },
      { name: 'Automation Champion (Rakesh Gupta)', url: 'https://automationchampion.com', type: 'blog', desc: '300+ posts sobre Flow — essencial para automação.' },
      { name: 'CRM Salesforce (Rodrigo — PT-BR)', url: 'https://www.youtube.com/@crmvendas', type: 'youtube', desc: 'Melhor canal em PT-BR para Admin. Vídeos práticos semanais.' },
      { name: 'Salesforce Ben Admin Study Guide', url: 'https://www.salesforceben.com', type: 'blog', desc: 'Guia editorial completo para o exame. Imprescindível.' },
    ],
    salaryAfter: { level: 'Admin Junior → Pleno', clt: 'R$ 3-12k', pj: 'R$ 4-15k', intl: 'R$ 12-28k' },
    marketInsight: 'Mercado tem muita oferta de Admin Junior. Diferencie-se combinando com App Builder e Agentforce.',
  },
  {
    id: 'practitioner', number: 2, name: 'Desenvolvedor', color: '#34c759',
    tagline: 'Dominar Apex, LWC e lógica declarativa avançada',
    estimatedTime: '12-18 meses',
    certIds: ['app_builder', 'dev1', 'adv_admin'],
    primarySkillCategories: ['Advanced Administrator', 'Apex & LWC (Developer I)'],
    checkpoints: [
      'Passou no exame Platform App Builder',
      'Passou no exame Platform Developer (antigo Developer I)',
      'Fez Superbadge: Apex Specialist',
      'Fez Superbadge: LWC Specialist',
      'Escreve triggers bulkificados de ponta a ponta com test class',
      'Cria LWC que consome dados via @wire e @api',
    ],
    gotchas: [
      'NUNCA coloque SOQL ou DML dentro de um loop em Apex. Isso viola governor limits.',
      'Bulkification não é opcional — é o que separa Junior de Pleno e o exame cobra.',
      'O "I" foi removido da cert Developer I em 2025 — agora é só "Platform Developer".',
      'App Builder parece simples mas tem questões específicas de Flow — simule muito.',
    ],
    keyResources: [
      { name: 'Superbadge: Apex Specialist', url: 'https://trailhead.salesforce.com/content/learn/superbadges/superbadge-apex', type: 'trailhead', desc: 'O mais importante para Dev. Faça antes do exame.' },
      { name: 'Superbadge: LWC Specialist', url: 'https://trailhead.salesforce.com/content/learn/superbadges/superbadge-lwc', type: 'trailhead', desc: 'Prática real com Lightning Web Components.' },
      { name: 'SFDC99 — Apex para Admins (David Liu)', url: 'https://www.sfdc99.com', type: 'blog', desc: 'Melhor recurso para quem vem do lado declarativo e está aprendendo Apex.' },
      { name: 'Salesforce Developers (YouTube)', url: 'https://www.youtube.com/@SalesforceDevelopers', type: 'youtube', desc: 'Deep dives técnicos oficiais em Apex, LWC e APIs.' },
      { name: 'Coding With The Force (Matt Gerry, CTA)', url: 'https://www.youtube.com/@CodingWithTheForce', type: 'youtube', desc: 'Design patterns, fflib, arquitetura de código. Essencial para Dev II.' },
      { name: 'Automation Champion', url: 'https://automationchampion.com', type: 'blog', desc: 'Flow Orchestrator e automações avançadas.' },
    ],
    salaryAfter: { level: 'Developer Pleno / Admin Sênior', clt: 'R$ 8-20k', pj: 'R$ 11-23k', intl: 'R$ 20-40k' },
    marketInsight: 'Developer I + App Builder é a combinação de maior demanda do ecossistema. Abre 70% das vagas disponíveis.',
  },
  {
    id: 'specialist', number: 3, name: 'Especialista', color: '#ff9500',
    tagline: 'Apex avançado, produtos estratégicos e contexto de negócio',
    estimatedTime: '18-24 meses',
    certIds: ['sales_cloud', 'service_cloud', 'agentforce', 'data360'],
    primarySkillCategories: ['Apex Avançado (Developer II)', 'Data Cloud', 'Agentforce & AI', 'OmniStudio'],
    checkpoints: [
      'Domina Apex assíncrono: Batch, Queueable (chaining), Future, Schedulable',
      'Passou em pelo menos uma cert Consultant (Sales ou Service Cloud)',
      'Passou no Agentforce Specialist',
      'Fez Superbadge: Advanced Apex Specialist',
      'Fez Superbadge: Data Integration Specialist',
      'Construiu um agente no Agent Builder e testou no Testing Center',
    ],
    gotchas: [
      'AI Associate foi APOSENTADA em 02/02/2026 — não invista mais nela.',
      '"Data Cloud Consultant" renomeou para "Data 360 Consultant" em abril/2026.',
      'Agentforce Specialist cobra Prompt Engineering (30%) tanto quanto Agentforce (30%) — cubra as duas.',
      'Consultants exigem experiência real — simule projetos em dev orgs.',
    ],
    keyResources: [
      { name: 'Superbadge: Advanced Apex Specialist', url: 'https://trailhead.salesforce.com/content/learn/superbadges/superbadge-advanced-apex', type: 'trailhead', desc: 'Async Apex, design patterns. Foco em Developer II.' },
      { name: 'Superbadge: Data Integration Specialist', url: 'https://trailhead.salesforce.com/content/learn/superbadges/superbadge-data-integration', type: 'trailhead', desc: 'Integrações REST/SOAP, Bulk API.' },
      { name: 'Trailmix: Get Hands on with Data Cloud!', url: 'https://trailhead.salesforce.com', type: 'trailhead', desc: '10h+ de conteúdo. Melhor ponto de partida para Data 360.' },
      { name: 'Agentblazer Program', url: 'https://trailhead.salesforce.com/agentblazer', type: 'trailhead', desc: 'Champion → Innovator → Legend. Programa oficial Agentforce.' },
      { name: 'Apex Hours (Amit Chaudhary, MVP)', url: 'https://www.youtube.com/@ApexHours', type: 'youtube', desc: 'Webinars ao vivo com Dev II, design patterns e arquitetura.' },
      { name: 'Salesforce Developers Blog', url: 'https://developer.salesforce.com/blogs', type: 'blog', desc: 'Conteúdo técnico oficial sobre Agentforce, Platform Events, CDC.' },
    ],
    salaryAfter: { level: 'Developer Sênior / Consultant Sênior', clt: 'R$ 14-26k', pj: 'R$ 18-35k', intl: 'R$ 27-55k' },
    marketInsight: 'Agentforce + Data 360 = 15-30% de prêmio salarial. A combinação mais estratégica do ecossistema em 2025-2026.',
  },
  {
    id: 'architect', number: 4, name: 'Arquiteto', color: '#bf5af2',
    tagline: 'Integrações, identidade, CI/CD e modelagem em escala',
    estimatedTime: '2-4 anos',
    certIds: ['data_arch', 'sharing_arch', 'integration_arch', 'identity_arch', 'devops_arch'],
    primarySkillCategories: ['Integrações', 'Identity & Access', 'CI/CD & DevOps'],
    checkpoints: [
      'Destravou Application Architect (App Builder + Dev + Data Arch + Sharing Arch)',
      'Destravou System Architect (Dev + Integration + Identity + DevOps)',
      'Sabe defender trade-offs: Apex vs Flow vs OmniStudio vs LWC',
      'Construiu pipeline CI/CD com scratch orgs em projeto real',
      'Domina os 6 padrões de integração e sabe quando aplicar cada um',
      'Domina os 6 flows OAuth 2.0 com implementação prática',
      'Leu o Well-Architected Framework completo no Architect Hub',
    ],
    gotchas: [
      'Application e System Architect são DESIGNAÇÕES AUTOMÁTICAS — não há prova específica.',
      'A Streaming API foi SUBSTITUÍDA pelo Pub/Sub API (gRPC + Avro) — não estude o antigo.',
      'DevOps Center oficial é gratuito mas muito limitado. O mercado usa Gearset/Copado.',
      'Começar a estudar o Well-Architected Framework AGORA encurta 2-3 anos do caminho.',
    ],
    keyResources: [
      { name: 'Architect Hub (architect.salesforce.com)', url: 'https://architect.salesforce.com', type: 'blog', desc: 'Well-Architected Framework + todas as Decision Guides. LEITURA OBRIGATÓRIA para CTA.' },
      { name: 'Integration Patterns & Practices (Architect Hub)', url: 'https://architect.salesforce.com/decision-guides/integrate', type: 'blog', desc: 'Os 6 padrões de integração que o exame Integration Architect cobra.' },
      { name: 'Apex Hours — Architect Series', url: 'https://www.youtube.com/@ApexHours', type: 'youtube', desc: 'Série completa de Application e System Architect.' },
      { name: 'Superbadge: Process Automation Specialist', url: 'https://trailhead.salesforce.com', type: 'trailhead', desc: 'Flow avançado — importante para Data Architect.' },
      { name: 'Ladies be Architects', url: 'https://trailhead.salesforce.com/trailblazer-community', type: 'community', desc: 'Comunidade com mentoria ativa. Indispensável para prep CTA.' },
      { name: 'Coding With The Force', url: 'https://www.youtube.com/@CodingWithTheForce', type: 'youtube', desc: 'Arquitetura de soluções e design patterns avançados.' },
    ],
    salaryAfter: { level: 'Application / System Architect', clt: 'R$ 18-35k', pj: 'R$ 24-45k', intl: 'R$ 45-70k' },
    marketInsight: '1% dos profissionais têm perfil de arquiteto. System Arch com inglês fluente = R$ 50-70k/mês remoto — sem precisar do CTA.',
  },
  {
    id: 'cta', number: 5, name: 'CTA', color: '#FFD700',
    tagline: 'O topo — menos de 500 profissionais no mundo',
    estimatedTime: '3-5 anos a partir de System Architect',
    certIds: ['cta_eval', 'cta_exam'],
    primarySkillCategories: [],
    checkpoints: [
      'Application Architect + System Architect destravados',
      'Completou o workshop CTA601 da Trailhead Academy',
      'Tem mentor ativo (Apex Hours, Architect Ohana, Ladies be Architects)',
      'Praticou mocks do Review Board (180min solução + 45min apresentação + 40min Q&A)',
      'Inglês fluente para defesa técnica ao vivo',
      'Reservou ~US$ 6.000 para a primeira tentativa completa',
    ],
    gotchas: [
      'Taxa de aprovação histórica: 25-30% — planeje tentar mais de uma vez.',
      'Custo total na 1ª tentativa: ~US$ 6.000 (Evaluation US$1.500 + Exam US$4.500).',
      'Sem inglês fluente o Review Board não é viável — toda a interação é em inglês.',
      'O CTA é mais símbolo de prestígio do que o maior ROI financeiro. System Arch remoto já paga muito bem.',
    ],
    keyResources: [
      { name: 'Architect Hub — Well-Architected Framework', url: 'https://architect.salesforce.com', type: 'blog', desc: 'Leitura obrigatória: Trusted, Easy, Adaptable. A linguagem do Review Board.' },
      { name: 'CTA601 — Workshop Oficial (Trailhead Academy)', url: 'https://trailheadacademy.salesforce.com', type: 'event', desc: 'Workshop pago — praticamente obrigatório para passar no Review Board.' },
      { name: 'Apex Hours — CTA Gang of Four', url: 'https://www.youtube.com/@ApexHours', type: 'youtube', desc: 'Comunidade e série de estudos focada exclusivamente em CTA.' },
      { name: 'Architect Trailblazers Community', url: 'https://trailhead.salesforce.com/trailblazer-community', type: 'community', desc: 'Comunidade oficial de arquitetos. Imprescindível.' },
      { name: 'Ladies be Architects', url: 'https://trailhead.salesforce.com/trailblazer-community', type: 'community', desc: 'Mentoria ativa e simulações de Review Board.' },
    ],
    salaryAfter: { level: 'Technical Architect (CTA)', clt: 'R$ 35-80k+', pj: 'R$ 45-100k+', intl: 'R$ 80-130k+' },
    marketInsight: 'Menos de 500 CTAs no mundo, ~5-12 brasileiros. Maioria atua no exterior (Accenture Netherlands, PwC UK). Declaração de identidade profissional mais do que ROI.',
  },
];

// ─── SKILLS ───────────────────────────────────────────────────────────────────
// phaseId conecta cada categoria de skill à fase correspondente
export const SKILLS_DATA = [
  { category: 'Administrator', phaseId: 'foundations', icon: 'bolt', skills: [
    'Profiles & Permission Sets', 'Permission Set Groups', 'OWD (Organization-Wide Defaults)',
    'Role Hierarchy', 'Sharing Rules', 'Flow Builder — Screen Flow',
    'Flow Builder — Record-Triggered Flow', 'Flow Builder — Scheduled Flow',
    'Lightning App Builder', 'Dynamic Forms', 'Reports & Dashboards',
    'Data Import Wizard / Data Loader', 'Duplicate Rules', 'Agentforce basics (~8% do exame)'
  ]},
  { category: 'Advanced Administrator', phaseId: 'practitioner', icon: 'tune', skills: [
    'Territory Management 2.0', 'Restriction/Scoping Rules', 'Sharing Sets (Experience Cloud)',
    'Big Objects', 'Data Skew (account/owner/lookup)', 'Flow Orchestrator',
    'Estratégia de Sandbox'
  ]},
  { category: 'Apex & LWC (Developer)', phaseId: 'practitioner', icon: 'code', skills: [
    'Apex fundamentals', 'SOQL & SOSL', 'Lightning Web Components (LWC)',
    'Triggers bulkificados', 'Bulkification (nunca SOQL em loop)', 'Governor Limits',
    'Exception handling', 'with/without/inherited sharing',
    'Test classes (@isTest, @TestSetup)', 'LWC decorators (@api, @wire)',
    'LWC lifecycle (connectedCallback, renderedCallback)'
  ]},
  { category: 'Apex Avançado (Developer II)', phaseId: 'specialist', icon: 'rocket_launch', skills: [
    'Future methods', 'Queueable Apex (chaining até 50)', 'Batch Apex (Database.Batchable)',
    'Schedulable Apex', 'Dynamic Apex', 'Custom Metadata Types',
    'Platform Events (EventBus.publish)', 'Change Data Capture',
    'Pub/Sub API (gRPC + Avro)', 'Trigger Handler Pattern', 'Service Layer (fflib)',
    'Selector Pattern (fflib)', 'Unit of Work Pattern (fflib)'
  ]},
  { category: 'Integrações', phaseId: 'architect', icon: 'hub', skills: [
    'Request-Reply Pattern', 'Fire-and-Forget Pattern', 'Batch Data Sync Pattern',
    'Remote Call-In Pattern', 'UI Update Based on Data Changes', 'Data Virtualization (Salesforce Connect)',
    'REST API', 'SOAP API', 'Bulk API 2.0', 'Composite API', 'GraphQL API',
    'Pub/Sub API (substitui Streaming API)', 'External Services (OpenAPI)',
    'Named Credentials', 'External Credentials (OAuth, JWT, mTLS)',
    'MuleSoft Anypoint', 'Event Relays (AWS EventBridge)'
  ]},
  { category: 'Identity & Access', phaseId: 'architect', icon: 'lock', skills: [
    'SAML 2.0 (SP-initiated e IdP-initiated)', 'OAuth 2.0 — Web Server Flow',
    'OAuth 2.0 — JWT Bearer Flow', 'OAuth 2.0 — Device Flow',
    'OAuth 2.0 — Client Credentials', 'OAuth 2.0 — SAML Bearer', 'OAuth 2.0 — Refresh',
    'OpenID Connect com PKCE', 'My Domain', 'Connected Apps',
    'JIT Provisioning', 'SCIM'
  ]},
  { category: 'CI/CD & DevOps', phaseId: 'architect', icon: 'sync', skills: [
    'Salesforce DX (sf CLI)', 'Scratch Orgs', 'Unlocked Packages',
    'Git + Gitflow / Trunk-Based Development', 'GitHub Actions / CI pipelines',
    'Copado vs Gearset vs Flosum vs AutoRABIT', 'Apex Unit Tests no pipeline',
    'Jest para LWC', 'PMD / Code Analyzer', 'Sandbox vs Scratch Org strategy'
  ]},
  { category: 'Data Cloud (Data 360)', phaseId: 'specialist', icon: 'cloud', skills: [
    'Data Streams (batch, streaming, Ingestion API, Web SDK)',
    'DLOs → DMOs (modelagem)', 'Identity Resolution (match + reconciliation rules)',
    'Unified Individuals', 'Calculated Insights (SQL-like)',
    'Segmentação + Activations', 'Retrievers (RAG com Agentforce)',
    'Zero-copy connectors (Snowflake, Databricks, BigQuery)', 'Apache Iceberg + Parquet'
  ]},
  { category: 'Agentforce & AI', phaseId: 'specialist', icon: 'smart_toy', skills: [
    'Prompt Builder & Templates (Sales Email, Field Generation, Record Summary, Flex)',
    'Prompt Engineering (grounding com merge fields)',
    'Topics & Actions (via Flow e Apex)', 'Agent Builder',
    'Testing Center (batch testing até 1.000 casos)', 'Einstein Trust Layer',
    'Model Builder (BYOLLM)', 'MCP (Model Context Protocol)'
  ]},
  { category: 'OmniStudio (Industries)', phaseId: 'specialist', icon: 'widgets', skills: [
    'FlexCards', 'OmniScripts', 'DataRaptors (Extract/Load/Transform/Turbo Extract)',
    'Integration Procedures', 'Expression Sets', 'Decision Matrices'
  ]},
];

// ─── RECURSOS ─────────────────────────────────────────────────────────────────
export const RESOURCES_BY_PHASE = [
  {
    phase: 'Fase 1 — Fundação (Admin)', icon: 'start', phaseId: 'foundations',
    items: [
      { type: 'trailhead', name: 'Trailhead', desc: 'Plataforma oficial. Foque no trailmix @strailhead para Admin.', url: 'https://trailhead.salesforce.com', lang: 'PT/EN' },
      { type: 'trailhead', name: 'Superbadge: Business Administration Specialist', desc: 'Obrigatório antes do exame Admin.', url: 'https://trailhead.salesforce.com/content/learn/superbadges/superbadge_bas', lang: 'EN' },
      { type: 'trailhead', name: 'Superbadge: Security Specialist', desc: 'OWD, perfis, permission sets na prática.', url: 'https://trailhead.salesforce.com/content/learn/superbadges/superbadge_security', lang: 'EN' },
      { type: 'youtube', name: 'CRM Salesforce (Rodrigo)', desc: 'Melhor canal PT-BR para Admin. Vídeos práticos semanais às terças.', url: 'https://www.youtube.com/@crmvendas', lang: 'PT' },
      { type: 'youtube', name: 'Salesforce Brasil (oficial)', desc: 'Canal oficial em português para conceitos gerais.', url: 'https://www.youtube.com/@SalesforceBrasil', lang: 'PT' },
      { type: 'blog', name: 'Automation Champion (Rakesh Gupta)', desc: '300+ posts sobre Flow — o mestre da automação declarativa.', url: 'https://automationchampion.com', lang: 'EN' },
      { type: 'blog', name: 'Salesforce Ben', desc: 'Referência editorial para certificações. Guias de exame detalhados.', url: 'https://www.salesforceben.com', lang: 'EN' },
      { type: 'blog', name: 'unofficialsf.com', desc: 'Screen components e ações de Flow construídos pela comunidade.', url: 'https://unofficialsf.com', lang: 'EN' },
    ]
  },
  {
    phase: 'Fase 2 — Desenvolvedor (App Builder + Dev I)', icon: 'terminal', phaseId: 'practitioner',
    items: [
      { type: 'trailhead', name: 'Superbadge: Apex Specialist', desc: 'O mais importante para Developer. Faça antes do exame.', url: 'https://trailhead.salesforce.com/content/learn/superbadges/superbadge-apex', lang: 'EN' },
      { type: 'trailhead', name: 'Superbadge: LWC Specialist', desc: 'Prática real com Lightning Web Components.', url: 'https://trailhead.salesforce.com/content/learn/superbadges/superbadge-lwc', lang: 'EN' },
      { type: 'blog', name: 'SFDC99 (David Liu)', desc: 'Apex explicado para quem vem do Admin. O melhor ponto de entrada para código.', url: 'https://www.sfdc99.com', lang: 'EN' },
      { type: 'youtube', name: 'Salesforce Developers (oficial)', desc: 'Deep dives técnicos em Apex e LWC. Tutoriais avançados.', url: 'https://www.youtube.com/@SalesforceDevelopers', lang: 'EN' },
      { type: 'youtube', name: 'Coding With The Force (CTA Matt Gerry)', desc: 'Design patterns, fflib, arquitetura de código Apex.', url: 'https://www.youtube.com/@CodingWithTheForce', lang: 'EN' },
      { type: 'podcast', name: 'Salesforce Developer Podcast (Joshua Birk)', desc: 'Podcast semanal oficial para desenvolvedores.', url: 'https://developer.salesforce.com/podcast', lang: 'EN' },
    ]
  },
  {
    phase: 'Fase 3 — Especialista (Consultants + Agentforce + Data 360)', icon: 'hub', phaseId: 'specialist',
    items: [
      { type: 'trailhead', name: 'Superbadge: Advanced Apex Specialist', desc: 'Async Apex e design patterns para Developer II.', url: 'https://trailhead.salesforce.com/content/learn/superbadges/superbadge-advanced-apex', lang: 'EN' },
      { type: 'trailhead', name: 'Superbadge: Data Integration Specialist', desc: 'Integrações REST/SOAP e Bulk API na prática.', url: 'https://trailhead.salesforce.com/content/learn/superbadges/superbadge-data-integration', lang: 'EN' },
      { type: 'trailhead', name: 'Trailmix: Get Hands on with Data Cloud!', desc: '10h+ sobre Data 360. Melhor ponto de partida para a cloud.', url: 'https://trailhead.salesforce.com', lang: 'EN' },
      { type: 'trailhead', name: 'Agentblazer Program', desc: 'Champion → Innovator → Legend. Programa oficial para Agentforce.', url: 'https://trailhead.salesforce.com/agentblazer', lang: 'EN' },
      { type: 'youtube', name: 'Apex Hours (Amit Chaudhary, MVP)', desc: 'Webinars ao vivo, série Dev II, design patterns e arquitetura.', url: 'https://www.youtube.com/@ApexHours', lang: 'EN' },
      { type: 'blog', name: 'Salesforce Developers Blog', desc: 'Conteúdo técnico oficial: Agentforce, Platform Events, CDC, Pub/Sub API.', url: 'https://developer.salesforce.com/blogs', lang: 'EN' },
      { type: 'youtube', name: 'Salesforce Hulk (Shrey Sharma)', desc: 'Tutoriais práticos e mock interviews para especialistas.', url: 'https://www.youtube.com/@SalesforceHulk', lang: 'EN' },
    ]
  },
  {
    phase: 'Fase 4 — Arquiteto (Data → Sharing → Integration → Identity → DevOps)', icon: 'architecture', phaseId: 'architect',
    items: [
      { type: 'blog', name: 'Architect Hub (architect.salesforce.com)', desc: 'Well-Architected Framework + Decision Guides + Agentic Patterns. LEITURA OBRIGATÓRIA para CTA.', url: 'https://architect.salesforce.com', lang: 'EN' },
      { type: 'blog', name: 'Integration Patterns & Practices', desc: 'Os 6 padrões de integração — literatura oficial do exame.', url: 'https://architect.salesforce.com/decision-guides/integrate', lang: 'EN' },
      { type: 'blog', name: 'Salesforce Architects Blog (Medium)', desc: 'Posts técnicos de CTAs e Architects sobre decisões de design.', url: 'https://medium.com/salesforce-architects', lang: 'EN' },
      { type: 'youtube', name: 'Apex Hours — Architect Series', desc: 'Série completa de Application e System Architect.', url: 'https://www.youtube.com/@ApexHours', lang: 'EN' },
      { type: 'community', name: 'Ladies be Architects', desc: 'Mentoria ativa e simulações de Review Board. Melhor comunidade para prep CTA.', url: 'https://trailhead.salesforce.com/trailblazer-community', lang: 'EN' },
      { type: 'community', name: 'Architect Trailblazers', desc: 'Comunidade oficial de arquitetos Salesforce.', url: 'https://trailhead.salesforce.com/trailblazer-community', lang: 'EN' },
    ]
  },
  {
    phase: 'Fase 5 — CTA (Review Board)', icon: 'military_tech', phaseId: 'cta',
    items: [
      { type: 'event', name: 'CTA601 — Workshop Oficial (Trailhead Academy)', desc: 'Workshop pago — praticamente obrigatório para o Review Board.', url: 'https://trailheadacademy.salesforce.com', lang: 'EN' },
      { type: 'event', name: 'Dreamforce / TDX 2026 (15-16 abril, Moscone West)', desc: 'Sessões ao vivo e gravadas 100% grátis via Salesforce+.', url: 'https://www.salesforce.com/plus/', lang: 'EN' },
      { type: 'community', name: 'Architect Ohana', desc: 'Comunidade focada em prep CTA. Mentores ativos.', url: 'https://trailhead.salesforce.com/trailblazer-community', lang: 'EN' },
      { type: 'community', name: 'CTA Gang of Four (Apex Hours)', desc: 'Grupo de estudo para CTA com mocks regulares.', url: 'https://www.youtube.com/@ApexHours', lang: 'EN' },
      { type: 'event', name: 'Brazil Dreamin\' 2026 (agosto, São Paulo)', desc: 'Maior evento da comunidade BR. Trailblazer Groups ativos em SP, RJ, BH, Curitiba, Fortaleza, Florianópolis.', url: 'https://trailhead.salesforce.com/trailblazer-community', lang: 'PT/EN' },
    ]
  },
  {
    phase: 'Comunidade & Descoberta (todos os níveis)', icon: 'groups', phaseId: 'all',
    items: [
      { type: 'community', name: 'Trailblazer Community', desc: 'Fórum oficial — resolve a maioria das dúvidas técnicas do dia a dia.', url: 'https://trailhead.salesforce.com/trailblazer-community', lang: 'EN' },
      { type: 'community', name: 'Salesforce Stack Exchange', desc: 'Q&A técnico de alto nível — para dúvidas específicas de código.', url: 'https://salesforce.stackexchange.com', lang: 'EN' },
      { type: 'podcast', name: 'Salesforce Admins Podcast (Mike Gerholdt)', desc: 'Podcast semanal oficial para Admins — bom para se manter atualizado.', url: 'https://admin.salesforce.com/blog/category/podcast', lang: 'EN' },
      { type: 'podcast', name: 'Salesforce For Everyone (Talent Stacker)', desc: 'Ideal para transição de carreira. Free 5 Day Challenge para iniciantes.', url: 'https://www.youtube.com/@TalentStacker', lang: 'EN' },
      { type: 'community', name: 'Discord: Salesforce Developers (oficial)', desc: 'Discussão assíncrona rápida com a comunidade de devs.', url: 'https://discord.gg/salesforce', lang: 'EN' },
    ]
  },
];

export const RESOURCE_ICONS = {
  trailhead: 'school', youtube: 'play_circle', blog: 'article',
  podcast: 'headphones', event: 'event', community: 'groups',
};

// ─── TABELA DE SALÁRIOS ────────────────────────────────────────────────────────
export const SALARY_TABLE = [
  { role: 'Admin Junior', clt: 'R$ 3-6k', pj: 'R$ 4-8k', intl: 'R$ 12-20k', highlight: false },
  { role: 'Admin Pleno', clt: 'R$ 6-12k', pj: 'R$ 8-15k', intl: 'R$ 18-28k', highlight: false },
  { role: 'Admin Sênior / Adv. Admin', clt: 'R$ 10-20k', pj: 'R$ 13-23k', intl: 'R$ 25-40k', highlight: false },
  { role: 'Developer Pleno', clt: 'R$ 8-15k', pj: 'R$ 11-20k', intl: 'R$ 20-30k', highlight: false },
  { role: 'Developer Sênior (PD II)', clt: 'R$ 14-26k', pj: 'R$ 18-32k', intl: 'R$ 27-50k', highlight: true },
  { role: 'Consultant Sênior (Sales/Service)', clt: 'R$ 12-22k', pj: 'R$ 16-30k', intl: 'R$ 30-50k', highlight: false },
  { role: 'Data 360 / Agentforce Specialist', clt: 'R$ 10-22k', pj: 'R$ 14-30k', intl: 'R$ 30-55k', highlight: true },
  { role: 'Tech Lead', clt: 'R$ 15-28k', pj: 'R$ 20-35k', intl: 'R$ 40-65k', highlight: false },
  { role: 'Application Architect', clt: 'R$ 18-32k', pj: 'R$ 24-40k', intl: 'R$ 45-65k', highlight: true },
  { role: 'System Architect', clt: 'R$ 20-35k', pj: 'R$ 26-45k', intl: 'R$ 50-70k', highlight: true },
  { role: 'Technical Architect (sem CTA)', clt: 'R$ 25-45k', pj: 'R$ 30-55k', intl: 'R$ 60-85k', highlight: false },
  { role: 'CTA', clt: 'R$ 35-80k+', pj: 'R$ 45-100k+', intl: 'R$ 80-130k+', highlight: true },
];

// ─── DECISÕES ESTRATÉGICAS ────────────────────────────────────────────────────
export const MARKET_DECISIONS = [
  {
    title: 'Inglês fluente',
    impact: 'Multiplicador de 2-3x',
    desc: 'É o único investimento que dobra seu teto salarial independentemente do nível técnico. Um System Architect com inglês fluente acessa R$ 50-70k/mês remotamente.',
    action: 'Se ainda não é fluente, coloque inglês como meta paralela — não espere "chegar no nível X" para começar.',
    icon: 'translate',
    color: '#0071e3',
  },
  {
    title: 'Consultoria especializada vs cliente final',
    impact: '2-4 anos de diferença no CTA',
    desc: 'Consultorias Salesforce-especialistas (Everymind, K2U, Valtech) aceleram a exposição multi-cloud que o CTA exige. Clientes finais (bancos, telecoms) pagam mais, mas expõem menos tecnologia.',
    action: 'Nos primeiros 5 anos: consultoria especializada. Depois de Application Architect: cliente final ou international remote.',
    icon: 'business',
    color: '#34c759',
  },
  {
    title: 'Começar arquitetura cedo',
    impact: '2-3 anos a menos no caminho',
    desc: 'Estudar o Well-Architected Framework e Decision Guides já como Developer Sênior encurta drasticamente o salto para Application/System Architect.',
    action: 'Leia o Architect Hub (architect.salesforce.com) AGORA, independente do seu nível. É gratuito.',
    icon: 'architecture',
    color: '#bf5af2',
  },
];

// ─── INSIGHTS DE MERCADO ──────────────────────────────────────────────────────
export const MARKET_INSIGHTS = [
  {
    title: 'IA está bifurcando o mercado',
    desc: 'Desenvolvedores juniores estão sendo parcialmente substituídos por AI-assisted coding. Seniores e arquitetos se valorizam. Funções repetitivas de Admin migram para Agentforce.',
    type: 'warning', icon: 'warning',
  },
  {
    title: 'A maior reforma da história foi em julho/2025',
    desc: 'Webassessor foi aposentado → Trailhead Academy com Pearson VUE. 35 certs ganharam prefixo "Platform". AI Associate foi aposentada em fev/2026. Data Cloud renomeou para Data 360 em abr/2026.',
    type: 'info', icon: 'info',
  },
  {
    title: 'Mercado local estagnado, internacional crescendo',
    desc: 'Brasil local estagnou em 2 anos. Mercado remoto internacional absorve talento sênior a 2-3x o valor local. Turing, Revelo, Toptal, Deel e LinkedIn direto são as principais rotas.',
    type: 'insight', icon: 'insights',
  },
];

// ─── DESIGNAÇÕES AUTOMÁTICAS ──────────────────────────────────────────────────
export const DESIGNATIONS = [
  {
    name: 'Application Architect',
    certIds: ['app_builder', 'dev1', 'data_arch', 'sharing_arch'],
    color: '#ff453a',
    desc: 'Arquiteto "dentro da plataforma". Modelagem de dados, sharing e soluções declarativas profundas.',
  },
  {
    name: 'System Architect',
    certIds: ['dev1', 'integration_arch', 'identity_arch', 'devops_arch'],
    color: '#bf5af2',
    desc: 'Arquiteto "da plataforma com o mundo". Integrações, identidade, CI/CD.',
  },
  {
    name: 'Technical Architect (CTA)',
    certIds: ['cta_eval', 'cta_exam'],
    color: '#FFD700',
    desc: 'Estrategista end-to-end. Application + System Architect + Review Board ao vivo.',
    prereqs: ['Application Architect', 'System Architect'],
  },
];
