import type { Dictionary } from './en';

export const es: Dictionary = {
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
    quickInfo: 'En resumen',
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
    botCheckRequired: 'Completá la verificación antes de enviar.',
    botCheckNotConfigured: 'La verificación no está configurada.',
    botCheckExpired: 'La verificación expiró. Probá de nuevo.',
    botCheckFailedToLoad: 'No se pudo cargar la verificación.',
  },
};
