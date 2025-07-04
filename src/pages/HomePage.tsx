import { LanguageSelector } from "@/components/flyer/LanguageSelector"
import { TemplateSelector } from "@/components/flyer/TemplateSelector"
import { PromptInput } from "@/components/flyer/PromptInput"
import { ImageSearch } from "@/components/flyer/ImageSearch"
import { FlyerCustomization } from "@/components/flyer/FlyerCustomization"
import { FlyerPreview } from "@/components/flyer/FlyerPreview"
import { ImageLayers } from "@/components/flyer/ImageLayers"
import { TextLayers } from "@/components/flyer/TextLayers"
import { BackgroundCustomization } from "@/components/flyer/BackgroundCustomization"
import { useLanguageStore } from "@/store/languageStore"
import { useFlyerStore } from "@/store/flyerStore"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { 
  Image as ImageIcon,
  Type,
  PaintBucket,
  Settings,
  Layout
} from "lucide-react"

function HomePage() {
  const { language, translations } = useLanguageStore()
  const { textLayers, addTextLayer } = useFlyerStore()
  const t = translations[language]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">{t.appTitle}</h1>
          <LanguageSelector />
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - Tools */}
          <div className="lg:col-span-3 space-y-6">
            <TemplateSelector />
            <PromptInput />
            
            <Tabs defaultValue="images" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="images" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.images || "Images"}</span>
                </TabsTrigger>
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.text || "Text"}</span>
                </TabsTrigger>
                <TabsTrigger value="background" className="flex items-center gap-2">
                  <PaintBucket className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.background || "Background"}</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.settings || "Settings"}</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="images" className="space-y-4">
                <ImageSearch />
                <ImageLayers />
              </TabsContent>
              
              <TabsContent value="text" className="space-y-4">
                {textLayers.length === 0 ? (
                  <div className="text-center py-6 space-y-4 border rounded-lg bg-muted/30">
                    <p>{t.noTextLayers || "No text layers yet"}</p>
                    <button 
                      className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      onClick={() => addTextLayer()}
                    >
                      + {t.addTextLayer || "Add Text Layer"}
                    </button>
                  </div>
                ) : (
                  <TextLayers />
                )}
              </TabsContent>
              
              <TabsContent value="background" className="space-y-4">
                <BackgroundCustomization />
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4">
                <FlyerCustomization />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-2 sticky top-4 self-start">
            <FlyerPreview />
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t bg-white py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 {t.appTitle}
        </div>
      </footer>
    </div>
  )
}

export default HomePage;