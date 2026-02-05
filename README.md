# 🔐 CipherVault

**CipherVault** es un portal web de vanguardia diseñado para la generación de contraseñas de alta seguridad con una
interfaz futurista y minimalista. Enfocado en la privacidad absoluta, todas las operaciones se realizan localmente en el
navegador del usuario.

## 🚀 Características Principales

- **Modo Dual de Generación**: Alterna entre contraseñas aleatorias criptográficas y frases de contraseña (Diceware)
  fáciles de recordar pero imposibles de hackear.
- **Escáner de Filtraciones (Pwned Check)**: Integración con la API de *HaveIBeenPwned* usando k-anonimato para
  verificar si tu clave ha sido expuesta en la dark web sin comprometer tu privacidad.
- **Medidor de Entropía Real**: Cálculo visual dinámico de la robustez de la contraseña.
- **Privacidad Local (Client-Side)**: Ningún dato se envía a servidores. Las claves se generan mediante la API Web
  Crypto del navegador.
- **Interfaz Futurista**: Diseño ultra-moderno con efectos de glassmorphism, animaciones fluidas y optimización para
  dispositivos móviles.

## 📂 Estructura del Proyecto

```text
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── password-generator.tsx  # Lógica central del generador y API de filtraciones
│   │   │   └── ui/                  # Componentes de UI y assets
│   │   └── App.tsx                      # Componente principal y estructura de la Landing Page
│   ├── styles/
│   │   ├── theme.css                   # Variables de diseño y tokens de Tailwind
│   │   └── fonts.css                   # Importación de tipografías futuristas
│   └── main.tsx                        # Punto de entrada de React
├── public/                             # Assets estáticos
└── package.json                        # Dependencias (React, Tailwind v4, Motion, Lucide)
```

## 🛠️ Tecnologías Utilizadas

- **React**: Biblioteca principal para la interfaz de usuario.
- **Tailwind CSS v4**: Framework de estilos de última generación para el diseño ultra-moderno.
- **Motion**: Para animaciones y transiciones fluidas.
- **Lucide React**: Iconografía minimalista y funcional.
- **Sonner**: Sistema de notificaciones elegante para el copiado de claves.

## 🛡️ Compromiso de Seguridad

CipherVault no utiliza bases de datos ni herramientas de rastreo. El objetivo es proporcionar una herramienta 100%
transparente y segura para la protección de la identidad digital global.
