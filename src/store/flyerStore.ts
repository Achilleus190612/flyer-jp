import { create } from 'zustand'

export type TemplateType = 'business' | 'event' | 'promotion'
export type ImagePosition = 'top' | 'bottom' | 'left' | 'right' | 'background'
export type FontFamily = 'sans' | 'serif' | 'mono' | 'display' | 'handwriting'
export type PageSize = 'a4' | 'letter' | 'social' | 'poster' | 'custom'
export type BackgroundStyle = 'cover' | 'contain' | 'stretch' | 'repeat' | 'pattern' | 'overlay'

export interface Position {
  x: number
  y: number
}

export interface ImageLayer {
  id: string
  image: string
  position: Position
  size: { width: number, height: number }
  opacity: number
  zIndex: number
  style?: string // CSS style adjustments (filters, transformations)
}

export interface TextLayer {
  id: string
  text: string
  position: Position
  color: string
  fontFamily: FontFamily
  fontSize: number
  zIndex: number
  opacity: number
  rotation: number
  bold: boolean
  italic: boolean
  width?: number // Optional width constraint
}

export interface BackgroundConfig {
  image: string
  color: string
  style: BackgroundStyle
  opacity: number
  filter: string // CSS filters (blur, brightness, etc.)
}

interface FlyerState {
  template: TemplateType
  prompt: string
  textLayers: TextLayer[]
  selectedImage: string
  imageLayers: ImageLayer[]
  textColor: string
  backgroundColor: string
  fontFamily: FontFamily
  imagePosition: ImagePosition
  pageSize: PageSize
  customPageSize: { width: number, height: number }
  textPosition: Position | null
  background: BackgroundConfig
  
  // Methods
  setTemplate: (template: TemplateType) => void
  setPrompt: (prompt: string) => void
  setSelectedImage: (image: string) => void
  setTextColor: (color: string) => void
  setBackgroundColor: (color: string) => void
  setFontFamily: (font: FontFamily) => void
  setImagePosition: (position: ImagePosition) => void
  setPageSize: (size: PageSize) => void
  setCustomPageSize: (size: { width: number, height: number }) => void
  
  // Image layers
  addImageLayer: (image: string) => void
  updateImageLayer: (id: string, updates: Partial<ImageLayer>) => void
  removeImageLayer: (id: string) => void
  
  // Text layers
  addTextLayer: (text?: string) => void
  updateTextLayer: (id: string, updates: Partial<TextLayer>) => void
  removeTextLayer: (id: string) => void
  
  // Background
  updateBackground: (updates: Partial<BackgroundConfig>) => void
  
  // Legacy support
  setText: (text: string) => void
  updateTextPosition: (position: Position) => void
  resetTextPosition: () => void
}

// Default placeholder images from Unsplash
const defaultImages = {
  business: "https://images.unsplash.com/photo-1573164574511-73c773193279?w=800&h=600&fit=crop",
  event: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
  promotion: "https://images.unsplash.com/photo-1572521165329-b197f9ea3da6?w=800&h=600&fit=crop"
}

// Page size dimensions (width, height in pixels at 72 DPI)
export const pageSizeDimensions = {
  a4: { width: 595, height: 842 }, // A4 at 72 DPI
  letter: { width: 612, height: 792 }, // US Letter at 72 DPI
  social: { width: 1080, height: 1080 }, // Square social media post
  poster: { width: 510, height: 768 }, // Common poster size
  custom: { width: 500, height: 700 } // Default custom size
}

// Default styles for background
export const backgroundStyles = {
  cover: 'object-cover w-full h-full',
  contain: 'object-contain w-full h-full',
  stretch: 'w-full h-full',
  repeat: 'bg-repeat',
  pattern: 'bg-repeat bg-auto',
  overlay: 'object-cover w-full h-full'
}

// Filter presets for images
export const filterPresets = {
  none: '',
  grayscale: 'grayscale(100%)',
  sepia: 'sepia(100%)',
  vintage: 'sepia(40%) brightness(90%)',
  blur: 'blur(2px)',
  contrast: 'contrast(150%)',
  bright: 'brightness(120%)',
  dark: 'brightness(80%)',
  warm: 'sepia(30%) saturate(140%)',
  cool: 'hue-rotate(30deg) saturate(80%)'
}

export const useFlyerStore = create<FlyerState>((set) => ({
  template: 'business',
  prompt: '',
  textLayers: [], // New array for text layers
  selectedImage: defaultImages.business,
  imageLayers: [],
  textColor: '#000000',
  backgroundColor: '#ffffff',
  fontFamily: 'sans',
  imagePosition: 'top',
  pageSize: 'a4',
  customPageSize: { width: 500, height: 700 },
  textPosition: null,
  
  // New background config
  background: {
    image: '',
    color: '#ffffff',
    style: 'cover',
    opacity: 1,
    filter: ''
  },
  
  setTemplate: (template) => set({ 
    template, 
    selectedImage: defaultImages[template]
  }),
  
  setPrompt: (prompt) => set({ prompt }),
  
  // Legacy text method - now creates/updates first text layer
  setText: (text) => set((state) => {
    if (state.textLayers.length === 0) {
      // Create first text layer if it doesn't exist
      const newLayer: TextLayer = {
        id: `text-${Date.now()}`,
        text,
        position: state.textPosition || { x: 20, y: 20 },
        color: state.textColor,
        fontFamily: state.fontFamily,
        fontSize: 16,
        zIndex: 10,
        opacity: 1,
        rotation: 0,
        bold: false,
        italic: false
      }
      return { textLayers: [newLayer] }
    } else {
      // Update the first text layer
      const updatedLayers = [...state.textLayers]
      updatedLayers[0].text = text
      return { textLayers: updatedLayers }
    }
  }),
  
  setSelectedImage: (image) => set({ selectedImage: image }),
  setTextColor: (color) => set({ textColor: color }),
  setBackgroundColor: (color) => set({ backgroundColor: color }),
  setFontFamily: (font) => set({ fontFamily: font }),
  setImagePosition: (position) => set({ imagePosition: position }),
  
  setPageSize: (pageSize) => set((state) => ({ 
    pageSize,
    customPageSize: pageSize === 'custom' ? state.customPageSize : pageSizeDimensions[pageSize]
  })),
  
  setCustomPageSize: (size) => set({ customPageSize: size }),
  
  addImageLayer: (image) => set((state) => {
    const newLayer: ImageLayer = {
      id: `layer-${Date.now()}`,
      image,
      position: { x: 0, y: 0 },
      size: { width: 200, height: 200 },
      opacity: 1,
      zIndex: state.imageLayers.length + 10 // Start image layers at z-index 10
    }
    return { imageLayers: [...state.imageLayers, newLayer] }
  }),
  
  updateImageLayer: (id, updates) => set((state) => ({
    imageLayers: state.imageLayers.map(layer => 
      layer.id === id ? { ...layer, ...updates } : layer
    )
  })),
  
  removeImageLayer: (id) => set((state) => ({
    imageLayers: state.imageLayers.filter(layer => layer.id !== id)
  })),
  
  // New methods for text layers
  addTextLayer: (text = "New Text") => set((state) => {
    const newLayer: TextLayer = {
      id: `text-${Date.now()}`,
      text,
      position: { x: 20, y: 20 + (state.textLayers.length * 40) },
      color: state.textColor,
      fontFamily: state.fontFamily,
      fontSize: 16,
      zIndex: 100 + state.textLayers.length, // Start text layers at z-index 100
      opacity: 1,
      rotation: 0,
      bold: false,
      italic: false
    }
    return { textLayers: [...state.textLayers, newLayer] }
  }),
  
  updateTextLayer: (id, updates) => set((state) => ({
    textLayers: state.textLayers.map(layer =>
      layer.id === id ? { ...layer, ...updates } : layer
    )
  })),
  
  removeTextLayer: (id) => set((state) => ({
    textLayers: state.textLayers.filter(layer => layer.id !== id)
  })),
  
  // Background settings
  updateBackground: (updates) => set((state) => ({
    background: { ...state.background, ...updates }
  })),
  
  // Legacy methods for backwards compatibility
  updateTextPosition: (position) => set((state) => {
    if (state.textLayers.length > 0) {
      const updatedLayers = [...state.textLayers]
      updatedLayers[0].position = position
      return { 
        textLayers: updatedLayers,
        textPosition: position,
        imagePosition: 'background' 
      }
    }
    return { 
      textPosition: position,
      imagePosition: 'background' 
    }
  }),
  
  resetTextPosition: () => set({ textPosition: null })
}))