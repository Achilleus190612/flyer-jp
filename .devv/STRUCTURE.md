# This file is only for editing file nodes, do not break the structure

/src
├── assets/          # Static resources directory, storing static files like images and fonts
│
├── components/      # Components directory
│   ├── flyer/       # Flyer generator components
│   │   ├── BackgroundCustomization.tsx # Component for customizing background image styles and settings
│   │   ├── FlyerCustomization.tsx # Component for customizing flyer text, colors and styles
│   │   ├── FlyerPreview.tsx      # Component for displaying the flyer preview with download functionality
│   │   ├── ImageLayers.tsx       # Component for managing multiple image layers with positioning and styling
│   │   ├── ImageSearch.tsx       # Component for searching, uploading and selecting images
│   │   ├── LanguageSelector.tsx  # Language selector component for switching between English and Japanese
│   │   ├── PromptInput.tsx       # Text input component for generating flyer content
│   │   ├── TemplateSelector.tsx  # Template selection component for choosing flyer templates
│   │   └── TextLayers.tsx        # Component for managing multiple text layers with styling and positioning
│   ├── ui/         # Pre-installed shadcn/ui components, avoid modifying or rewriting unless necessary
│   └── [feature]/  # Feature module components directory, organizing custom components by feature modules
│
├── hooks/          # Custom Hooks directory
│   ├── use-mobile.ts # Pre-installed mobile detection Hook from shadcn (import { useIsMobile } from '@/hooks/use-mobile')
│   └── use-toast.ts  # Toast notification system hook for displaying toast messages (import { useToast } from '@/hooks/use-toast')
│
├── lib/            # Utility library directory
│   └── utils.ts    # Utility functions, including the cn function for merging Tailwind class names
│
├── pages/          # Page components directory, based on React Router structure
│   ├── HomePage.tsx # Home page component with flyer ad generator implementation
│   └── NotFoundPage.tsx # 404 error page component, displays when users access non-existent routes
│
├── store/          # State management directory
│   ├── flyerStore.ts  # State management for flyer templates, customization, image and text layers, background, and page sizes
│   └── languageStore.ts # State management for language selection and translations
│
├── App.tsx         # Root component, with React Router routing system configured
│                   # Add new route configurations in this file
│                   # Includes catch-all route (*) for 404 page handling
│
├── main.tsx        # Entry file, rendering the root component and mounting to the DOM
│
├── index.css       # Global styles file, containing Tailwind configuration and custom styles
│                   # Modify theme colors and design system variables in this file 
│
└── tailwind.config.js  # Tailwind CSS v3 configuration file
                      # Contains theme customization, plugins, and content paths
                      # Includes shadcn/ui theme configuration 