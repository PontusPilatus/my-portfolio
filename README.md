# Personal Portfolio Website

![Portfolio Preview](public/images/portfolio-preview.png)

A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS featuring clean design, subtle animations, and multilingual capabilities (English/Swedish).

## 🌟 Features

- **Responsive Design**: Optimized for all device sizes
- **Smooth Animations**: Clean transitions and interactive elements
- **Multilingual Support**: Toggle between English and Swedish
- **Interactive Project Cards**: Showcases projects with details, tags, and links
- **Tech Stack Visualization**: Visual representation of skills with categorization
- **Contact Form**: Email.js integration for direct contact
- **React Router**: Single-page application with clean routing

## 🛠️ Technologies Used

- **Frontend**: 
  - React 18
  - TypeScript
  - Tailwind CSS
  - React Router DOM
  - React Hook Form
  - React Intersection Observer
  - Lucide Icons
  - Email.js

- **UI Components**:
  - Radix UI primitives
  - Custom Tilt effect
  - Custom tooltip components

- **Build Tools**:
  - Vite
  - SWC (for fast compilation)
  - ESLint
  - PostCSS

## 💻 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/YourUsername/my-portfolio.git
   cd my-portfolio
   ```

2. Install dependencies
   ```sh
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```sh
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to [http://localhost:8080](http://localhost:8080)

## 📁 Project Structure

```
my-portfolio/
├── src/                   # Source files
│   ├── components/        # React components
│   │   ├── ui/            # UI components and primitives
│   │   ├── About.tsx      # About section
│   │   ├── Contact.tsx    # Contact form
│   │   ├── Hero.tsx       # Hero section
│   │   ├── Navigation.tsx # Navigation bar
│   │   ├── Projects.tsx   # Projects showcase
│   │   ├── TechStack.tsx  # Skills visualization
│   │   └── Footer.tsx     # Footer component
│   ├── contexts/          # Context providers
│   │   └── LanguageContext.tsx # Multilingual support
│   ├── pages/             # Page components
│   │   ├── Index.tsx      # Main landing page
│   │   └── NotFound.tsx   # 404 page
│   ├── utils/             # Utility functions
│   │   └── translations.ts # Translation strings
│   ├── App.tsx            # Main App component
│   └── main.tsx           # Entry point
├── public/                # Static assets
│   ├── files/             # PDFs and downloadable content
│   └── images/            # Images and icons
├── index.html             # HTML entry point
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies
```

## 🎨 Customization

### Adding Your Projects

Edit the `projects` array in `src/components/Projects.tsx` to add your own projects:

```typescript
const projects: Project[] = [
  {
    id: 1,
    key: "yourProject", // Used for translations
    image: "https://your-image-url.jpg",
    tags: ["React", "Node.js", "Express", "PostgreSQL"],
    githubLink: "https://github.com/yourusername/your-project",
    liveLink: "https://your-project.com",
    featured: true,
  },
  // Add more projects...
];
```

### Adding New Translations

Edit the `translations.ts` file in the `utils` directory to add or modify translations:

```typescript
export const translations = {
  en: {
    // English translations
    projects: {
      yourProject: {
        title: "Your Project Title",
        description: "Description of your project in English"
      }
    }
  },
  sv: {
    // Swedish translations
    projects: {
      yourProject: {
        title: "Din Projekttitel",
        description: "Beskrivning av ditt projekt på svenska"
      }
    }
  }
};
```

## 🚀 Deployment

The portfolio can be deployed to various platforms:

- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [GitHub Pages](https://pages.github.com/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

Feel free to reach out if you have any questions or feedback!

- Website: [your-website.com](https://your-website.com)
- Email: your.email@example.com
- LinkedIn: [Your Name](https://linkedin.com/in/yourname)
- GitHub: [@YourUsername](https://github.com/YourUsername)
