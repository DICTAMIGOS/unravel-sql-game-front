# 🕵️ Unravel SQL Game

> **Un juego educativo de SQL con temática noir que combina storytelling interactivo con validación real de consultas SQL**

## 📋 Descripción del Proyecto

**Unravel SQL Game** es una aplicación web educativa desarrollada para el **HackRush de Guayabas Devs** por el equipo **Dictamigos**. El juego presenta una experiencia inmersiva de aprendizaje de SQL a través de una narrativa noir donde los jugadores asumen el rol de un detective que debe resolver casos utilizando consultas SQL reales.

### 🎯 Objetivo
Crear una experiencia de aprendizaje interactiva que permita a los usuarios practicar SQL de manera divertida y efectiva, con validación real de consultas sobre una base de datos MySQL.

## 🏆 HackRush Guayabas Devs

Este proyecto fue desarrollado durante el **HackRush de Guayabas Devs**, un evento de desarrollo colaborativo que fomenta la innovación y el aprendizaje en equipo.

**Equipo:** Dictamigos  


## 🏗️ Arquitectura del Sistema

### Frontend (React + TypeScript)
- **Framework:** React 19 con TypeScript
- **Build Tool:** Vite 7
- **Routing:** React Router DOM 7
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **UI Components:** HeroUI Tabs

### Backend (Flask + Python)
- **Framework:** Flask (Python)
- **API:** RESTful API
- **Authentication:** JWT-based authentication
- **CORS:** Configurado para desarrollo y producción

### Bases de Datos

#### 🎮 Base de Datos del Juego (MySQL)
- **Propósito:** Contiene los datos del caso de investigación
- **Tablas:** Ciudadanos, Incidentes, Casos, Propiedades, Operativos_Estafa
- **Validación:** Las consultas SQL de los jugadores se ejecutan contra esta BD real
- **Seguridad:** Consultas de solo lectura para evitar modificaciones accidentales

#### 👤 Base de Datos de la Aplicación (PostgreSQL)
- **Propósito:** Gestión de usuarios, records y rankings
- **Tablas:** Usuarios, Records, Rankings
- **Funcionalidad:** Autenticación, persistencia de progreso, sistema de puntuaciones

## 🎨 Patrones de Diseño Frontend

### 🏛️ Arquitectura de Componentes
```
src/
├── components/          # Componentes reutilizables
│   ├── ChallengeCard.tsx
│   ├── Leaderboard.tsx
│   ├── SequenceRanking.tsx
│   └── ...
├── contexts/           # Context API para estado global
│   ├── AuthContext.tsx
│   ├── ModalContext.tsx
│   └── GameStateContext.tsx
├── hooks/              # Custom hooks
│   ├── useAuth.ts
│   ├── useGameState.ts
│   └── useModal.ts
├── pages/              # Páginas principales
│   ├── LoginPage.tsx
│   ├── HomePage.tsx
│   ├── ChapterPage.tsx
│   └── RegisterPage.tsx
├── services/           # Servicios de API
│   ├── authService.ts
│   └── recordService.ts
└── types/              # Definiciones de TypeScript
    └── game.ts
```

### 🔄 Patrones Implementados

#### 1. **Context Pattern**
#### 2. **Custom Hooks Pattern**
#### 3. **Service Layer Pattern**
#### 4. **Component Composition**

## 🚀 Características Principales

### 🎮 Gameplay
- **5 Secuencias de Investigación:** Cada una con múltiples challenges SQL
- **Validación Real:** Las consultas se ejecutan contra MySQL real
- **Sistema de Puntuación:** Basado en tiempo y errores
- **Rankings:** Globales y por secuencia
- **Progreso Persistente:** Guardado automático del progreso

### 🔐 Autenticación
- **Registro/Login:** Sistema completo de autenticación
- **JWT Tokens:** Autenticación segura
- **Persistencia:** Tokens guardados en localStorage

### 📊 Sistema de Rankings
- **Clasificaciones Globales:** Todos los niveles combinados
- **Rankings por Secuencia:** Específicos para cada secuencia
- **Múltiples Dificultades:** Easy, Medium, Hard
- **Posición del Usuario:** Destacada en los rankings

## 🛠️ Tecnologías y Dependencias

### Frontend Dependencies
```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-router-dom": "^7.8.2",
  "typescript": "~5.8.3",
  "vite": "^7.1.2",
  "tailwindcss": "^4.1.13",
  "framer-motion": "^12.23.12",
  "lucide-react": "^0.542.0",
  "@heroui/tabs": "^2.2.23"
}
```

### Development Tools
- **ESLint:** Linting y calidad de código
- **TypeScript:** Tipado estático
- **Vite:** Build tool y dev server
- **PostCSS:** Procesamiento de CSS

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o pnpm
- Backend Flask ejecutándose: https://github.com/gaeliam100/unravel-sql-game-back-2
- Bases de datos MySQL y PostgreSQL configuradas

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd unravel-sql-game

# Instalar dependencias
npm install
# o
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con las URLs de tu API
```

### Variables de Entorno
```env
VITE_API_BASE_URL=http://127.0.0.1:5000/api
```

### Desarrollo
```bash
# Iniciar servidor de desarrollo
npm run dev
```

## 🎯 Funcionalidades del Juego

### 📖 Narrativa
- **Caso Redentor:** Historia noir de investigación
- **5 Secuencias:** Progresión narrativa con challenges SQL
- **Storytelling Visual:** Imágenes y diálogos inmersivos

### 🔍 Challenges SQL
1. **Secuencia 1:** Configuración de Base de Datos
2. **Secuencia 2:** Investigación NYPD
3. **Secuencia 3:** Análisis de Ciudadanos e Incidentes
4. **Secuencia 4:** Investigación Avanzada
5. **Secuencia 5:** Análisis Final de Casos

### ⏱️ Sistema de Puntuación
- **Tiempo:** Menor tiempo = mejor puntuación
- **Errores:** Penalización por consultas incorrectas
- **Rankings:** Comparación con otros jugadores

## 🔧 Configuración del Backend

### Endpoints Principales
```
POST /api/auth/register     # Registro de usuario
POST /api/auth/login        # Login de usuario
POST /api/record/create-record  # Crear record de juego
POST /api/game/validate-str  # Validar query del nivel
GET  /api/record/ranking/:difficulty/:level/:userId  # Ranking por secuencia
GET  /api/record/global-ranking  # Ranking global
```

### Base de Datos MySQL (Juego)
```sql
-- Tablas principales del caso
CREATE DATABASE Caso_Redentor;
USE Caso_Redentor;

-- Tablas: Ciudadanos, Incidentes, Casos, Propiedades, Operativos_Estafa
```

## 👥 Equipo Dictamigos

**Desarrollado con 💙 por el equipo Dictamigos para HackRush Guayabas Devs**



## 🤝 Contribuciones

Este proyecto fue desarrollado durante un hackathon. Para contribuciones futuras, por favor contactar al equipo Dictamigos.

---

**🎮 ¡Disfruta resolviendo casos con SQL! 🕵️‍♂️**