import type { Dictionary } from './en';

export const es: Dictionary = {
  meta: {
    title: 'Alejo Assain — Desarrollo de software',
    description:
      'Alejo Assain, desarrollo de software en Córdoba, Argentina. Cocreó Lymbo, una plataforma de gestión y control de acceso para gimnasios, nacida de gestionar gimnasios reales.',
  },
  language: {
    label: 'Idioma',
  },
  header: {
    skipToContent: 'Saltar al contenido',
    sayHello: 'Escribime',
  },
  nav: {
    label: 'Secciones',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    about: 'Sobre mí',
    experience: 'Experiencia',
    projects: 'Proyectos',
    skills: 'Skills',
  },
  hero: {
    scroll: 'Bajar',
    scrollLabel: 'Ir a la sección Sobre mí',
  },
  about: {
    heading: 'Sobre mí',
    location: 'Ubicación',
    email: 'Email',
    status: 'Estado',
  },
  experience: {
    heading: 'Experiencia',
  },
  projects: {
    heading: 'Proyectos',
    featured: 'Proyecto destacado',
    other: 'Otros proyectos',
    links: {
      github: 'GitHub',
      demo: 'Demo',
      landing: 'Landing',
    },
    viewLink: (title, link) => `Ver ${link} de ${title}`,
  },
  skills: {
    heading: 'Skills',
    categories: {
      backend: 'Backend',
      database: 'Bases de datos',
      frontend: 'Frontend',
      infrastructure: 'Infraestructura',
      automation: 'Hardware y automatización',
      product: 'Producto y operaciones',
    },
  },
  contact: {
    heading: 'Contacto',
    intro:
      '¿Tenés una idea, un proyecto o un problema que valga la pena resolver? Dejame un mensaje y te respondo.',
    trigger: 'Dejame un mensaje',
    title: 'Dejame un mensaje',
    description:
      'Contame qué estás construyendo, arreglando o tratando de que moleste menos.',
    name: 'Nombre',
    namePlaceholder: 'Tu nombre',
    email: 'Email',
    emailPlaceholder: 'vos@ejemplo.com',
    message: 'Mensaje',
    messagePlaceholder: '¿Qué tenés en mente?',
    send: 'Enviar mensaje',
    sending: 'Enviando...',
    sent: '¡Gracias! Te respondo pronto.',
    sendFailed: 'No se pudo enviar el mensaje.',
    errors: {
      invalid_name: 'Revisá tu nombre y probá de nuevo.',
      invalid_email: 'Revisá tu email y probá de nuevo.',
      invalid_message: 'Revisá tu mensaje y probá de nuevo.',
      missing_bot_check: 'Completá la verificación antes de enviar.',
      bot_check_failed: 'La verificación falló. Probá de nuevo.',
      bot_check_unavailable:
        'La verificación no está disponible por ahora. Probá de nuevo.',
      network: 'No se pudo enviar el mensaje. Revisá tu conexión.',
    },
    botCheckRequired: 'Completá la verificación antes de enviar.',
    botCheckNotConfigured: 'La verificación no está configurada.',
    botCheckExpired: 'La verificación expiró. Probá de nuevo.',
    botCheckFailedToLoad: 'No se pudo cargar la verificación.',
  },
};
