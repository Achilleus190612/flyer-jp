import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Upload, Plus } from "lucide-react"
import { useFlyerStore } from "@/store/flyerStore"
import { useLanguageStore } from "@/store/languageStore"

// Simulated image search results
const getSearchResults = (query: string) => {
  // For demonstration, we'll use Unsplash with the query
  const baseImages = [
    `https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop`,
    `https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&h=200&fit=crop`,
    `https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=300&h=200&fit=crop`,
    `https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop`,
    `https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=200&fit=crop`,
    `https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=300&h=200&fit=crop`,
  ]
  
  // In a real app, this would be an actual API call to search for images
  return baseImages
}

export function ImageSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { setSelectedImage, addImageLayer } = useFlyerStore()
  const { language, translations } = useLanguageStore()
  const t = translations[language]

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = getSearchResults(searchQuery)
      setSearchResults(results)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setUploadedImages(prev => [...prev, event.target.result as string])
        }
      }
      reader.readAsDataURL(file)
    })
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleImageSelect = (image: string, addAsLayer = false) => {
    if (addAsLayer) {
      addImageLayer(image)
    } else {
      setSelectedImage(image)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">{t.imageSearch}</h3>
        
        <Tabs defaultValue="search">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="search">{t.searchImages}</TabsTrigger>
            <TabsTrigger value="upload">{t.uploadImages}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Input
                placeholder={`${t.imageSearch}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button onClick={handleSearch} type="button">
                <Search className="mr-2 h-4 w-4" />
                {t.search}
              </Button>
            </div>
            
            {searchResults.length > 0 && (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {searchResults.map((image, index) => (
                    <div 
                      key={index} 
                      className="relative group cursor-pointer border rounded-md overflow-hidden hover:ring-2 hover:ring-primary"
                    >
                      <img 
                        src={image} 
                        alt={`Search result ${index + 1}`}
                        className="w-full h-24 object-cover"
                        onClick={() => handleImageSelect(image)}
                      />
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleImageSelect(image, true)
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {t.clickToSelectMain} - {t.clickPlusToAddLayer}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/*" 
                  multiple 
                  onChange={handleImageUpload}
                  className="hidden" 
                />
                <Button 
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {t.uploadImages}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">{t.uploadImagesDescription}</p>
              </div>
              
              {uploadedImages.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">{t.uploadedImages}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {uploadedImages.map((image, index) => (
                      <div 
                        key={index} 
                        className="relative group cursor-pointer border rounded-md overflow-hidden hover:ring-2 hover:ring-primary"
                      >
                        <img 
                          src={image} 
                          alt={`Uploaded image ${index + 1}`}
                          className="w-full h-24 object-cover"
                          onClick={() => handleImageSelect(image)}
                        />
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleImageSelect(image, true)
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {t.clickToSelectMain} - {t.clickPlusToAddLayer}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}