import { CVData } from './types';

// =========================================================================
// TO CUSTOMIZE THIS APP PERMANENTLY:
// Replace the content of RESUME_DATA below with your own information.
// This will be the default CV shown to anyone visiting your deployed app.
// =========================================================================

export const RESUME_DATA: CVData = {
  name: "Roberto Baca",
  title: "Ingeniero Industrial",
  summary:
    "Ingeniero Industrial con sólida experiencia liderando equipos, gestionando operaciones y optimizando procesos en entornos productivos complejos. Especialista en cadena de suministro, planificación de producción, logística, abastecimiento y mantenimiento. Enfocado en la mejora continua, la eficiencia operativa y el cumplimiento de estándares de calidad. Actualmente ampliando mi perfil hacia Ciencia de Datos y analítica aplicada a la optimización industrial.",
  contact: {
    email: "ing.baca@gmail.com",
    phone: "261 6917870",
    linkedin: "", // completá si querés
    github: "", // opcional
    location: "Mendoza Capital, Argentina"
  },

  experience: [
    {
      id: "exp-1",
      role: "Responsable de Proyectos y Mejora Continua",
      company: "Codorniu España",
      period: "Enero 2025 – Mayo 2025",
      description:
        "Gestión de proyectos, implementación de nuevas instalaciones y mejora continua en Bodega Codorníu (Sant Sadurní d’Anoia, Cataluña).",
      achievements: [
        "Administración del presupuesto de CAPEX del centro productivo.",
        "Implementación y seguimiento de KPIs operativos.",
        "Gestión de mejoras en instalaciones y procesos productivos."
      ]
    },
    {
      id: "exp-2",
      role: "Jefe de Producción y Logística",
      company: "Bodega Séptima",
      period: "Octubre 2021 – Diciembre 2024",
      description:
        "A cargo de la producción y, posteriormente, del área logística de la bodega.",
      achievements: [
        "Planificación y programación de cargas para exportación y mercado interno.",
        "Gestión documental, coordinación con despachantes, navieras y forwarders.",
        "Administración de bookings y disponibilidad de contenedores.",
        "Manejo de KPIs y emisión de reportes operativos."
      ]
    },
    {
      id: "exp-3",
      role: "Jefe de Producción",
      company: "Bodega Séptima",
      period: "Junio 2015 – Octubre 2021",
      description:
        "Responsable de la planificación, control y seguimiento de la producción.",
      achievements: [
        "Gestión de mantenimiento, insumos y abastecimiento.",
        "Control de stocks de producto terminado, estibas e insumos.",
        "Administración del presupuesto de Operaciones.",
        "Análisis de inversiones y coordinación de despachos."
      ]
    },
    {
      id: "exp-4",
      role: "Jefe de Programación de la Producción",
      company: "Grupo Peñaflor",
      period: "Abril 2013 – Junio 2015",
      description:
        "Programación y control de producción con foco en abastecimiento y cargas.",
      achievements: [
        "Planificación MRP/MPS de producto terminado.",
        "Manejo de JDE One World ERP.",
        "Revisión de cargas para exportación y mercado interno."
      ]
    },
    {
      id: "exp-5",
      role: "Analista de Producción",
      company: "Grupo Peñaflor",
      period: "Noviembre 2008 – Abril 2013",
      description:
        "Programación y control de la producción en plantas de gran escala.",
      achievements: [
        "Ejecución y seguimiento de planes de producción.",
        "Optimización de flujos operativos y análisis de desvíos."
      ]
    }
  ],

  education: [
    {
      id: "edu-1",
      degree: "Diplomatura en Ciencia de Datos con R y Python",
      institution: "Instituto de Ciencia de Datos UTN",
      year: "2025 – Actualidad"
    },
    {
      id: "edu-2",
      degree: "Certificación en Google Data Analytics (R)",
      institution: "Google",
      year: "2025"
    },
    {
      id: "edu-3",
      degree: "Técnico en Diseño y Programación de Videojuegos",
      institution: "Universidad Nacional del Litoral",
      year: "2019 – 2023"
    },
    {
      id: "edu-4",
      degree: "Bootcamp Programación Web FullStack",
      institution: "NUCBA",
      year: "2021 – 2022"
    },
    {
      id: "edu-5",
      degree: "MBA en Administración y Dirección de Empresas",
      institution: "EUDE Business School",
      year: "2014 – 2016"
    },
    {
      id: "edu-6",
      degree: "Diplomatura en Habilidades Gerenciales",
      institution: "ADEN Business School",
      year: "2014"
    },
    {
      id: "edu-7",
      degree: "Diplomatura en Logística",
      institution: "Universidad Austral",
      year: "2011"
    },
    {
      id: "edu-8",
      degree: "Ingeniería Industrial",
      institution: "Universidad Nacional de Cuyo",
      year: "2003 – 2008"
    }
  ],

  skills: [
    {
      category: "Operaciones y Producción",
      items: [
        "Planificación de la producción",
        "Logística y Supply Chain",
        "Gestión de mantenimiento",
        "Control de stocks",
        "Gestión de CAPEX",
        "KPIs operativos"
      ]
    },
    {
      category: "Data & Analytics",
      items: ["Power BI", "Excel Avanzado", "SQL", "Python", "R"]
    },
    {
      category: "Sistemas y ERP",
      items: ["SAP", "Oracle JDE One World"]
    },
    {
      category: "Idiomas",
      items: ["Inglés B2 (Upper Intermediate)", "Catalán básico"]
    }
  ]
};

export const SUGGESTED_QUESTIONS = [
  "¿Cuál fue tu rol en la mejora continua de Codorníu?",
  "¿Qué experiencia tenés liderando operaciones?",
  "¿Cómo aplicás la analítica de datos en la industria?",
  "¿Qué logros destacarías en Bodega Séptima?"
];