import { useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { 
  X, ArrowUp, ArrowDown, Move, ImageIcon,
  Filter
} from "lucide-react"
import { useFlyerStore, filterPresets } from "@/store/flyerStore"
import { useLanguageStore } from "@/store/languageStore"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

export function ImageLayers() {
  const { 
    imageLayers, 
    updateImageLayer, 
    removeImageLayer,
    textLayers
  } = useFlyerStore()
  
  const { language, translations } = useLanguageStore()
  const t = translations[language]
  
  const dragLayerRef = useRef<{ id: string | null, startX: number, startY: number }>({
    id: null,
    startX: 0,
    startY: 0
  })

  if (imageLayers.length === 0) {
    return null
  }

  const handleOpacityChange = (id: string, value: number[]) => {
    updateImageLayer(id, { opacity: value[0] })
  }

  const handleSizeChange = (id: string, dimension: 'width' | 'height', value: string) => {
    const numValue = parseInt(value)
    if (isNaN(numValue)) return
    
    const layer = imageLayers.find(layer => layer.id === id)
    if (!layer) return
    
    updateImageLayer(id, {
      size: {
        ...layer.size,
        [dimension]: numValue
      }
    })
  }

  const changeZIndex = (id: string, direction: 'up' | 'down') => {
    // Combine text and image layers to determine proper z-index ordering
    const allLayers = [
      ...textLayers.map(l => ({ id: l.id, zIndex: l.zIndex, type: 'text' })),
      ...imageLayers.map(l => ({ id: l.id, zIndex: l.zIndex, type: 'image' }))
    ].sort((a, b) => a.zIndex - b.zIndex)
    
    const currentIndex = allLayers.findIndex(l => l.id === id)
    
    if (direction === 'up' && currentIndex < allLayers.length - 1) {
      const nextLayer = allLayers[currentIndex + 1]
      if (nextLayer.type === 'image') {
        updateImageLayer(id, { zIndex: nextLayer.zIndex })
        updateImageLayer(nextLayer.id, { zIndex: allLayers[currentIndex].zIndex })
      } else {
        // Handle cross-type layer (text over image or image over text)
        const currentLayer = allLayers[currentIndex]
        if (currentLayer.type === 'image') {
          updateImageLayer(id, { zIndex: nextLayer.zIndex + 1 })
        }
      }
    } else if (direction === 'down' && currentIndex > 0) {
      const prevLayer = allLayers[currentIndex - 1]
      if (prevLayer.type === 'image') {
        updateImageLayer(id, { zIndex: prevLayer.zIndex })
        updateImageLayer(prevLayer.id, { zIndex: allLayers[currentIndex].zIndex })
      } else {
        // Handle cross-type layer (text under image or image under text)
        const currentLayer = allLayers[currentIndex]
        if (currentLayer.type === 'image') {
          updateImageLayer(id, { zIndex: prevLayer.zIndex - 1 })
        }
      }
    }
  }

  // Filter options
  const filterOptions = [
    // { value: "", label: t.filterNone || "None" },
    { value: filterPresets.grayscale, label: t.filterGrayscale || "Grayscale" },
    { value: filterPresets.sepia, label: t.filterSepia || "Sepia" },
    { value: filterPresets.vintage, label: t.filterVintage || "Vintage" },
    { value: filterPresets.blur, label: t.filterBlur || "Blur" },
    { value: filterPresets.contrast, label: t.filterContrast || "High Contrast" },
    { value: filterPresets.bright, label: t.filterBright || "Brighten" },
    { value: filterPresets.dark, label: t.filterDark || "Darken" },
    { value: filterPresets.warm, label: t.filterWarm || "Warm" },
    { value: filterPresets.cool, label: t.filterCool || "Cool" }
  ]

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">
          {t.imageLayers} ({imageLayers.length})
        </h3>
        
        <div className="space-y-4">
          {[...imageLayers]
            .sort((a, b) => b.zIndex - a.zIndex)
            .map((layer) => (
              <div key={layer.id} className="border rounded-md p-3 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={layer.image} 
                      alt="Layer thumbnail" 
                      className="h-full w-full object-cover"
                      style={{ filter: layer.style || '' }}
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium truncate">
                      {t.layer} {layer.zIndex}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {layer.size.width} × {layer.size.height}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => changeZIndex(layer.id, 'up')}
                      title={t.moveUp || "Move Up"}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => changeZIndex(layer.id, 'down')}
                      title={t.moveDown || "Move Down"}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => removeImageLayer(layer.id)}
                      title={t.remove || "Remove"}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-xs">{t.opacity}</Label>
                  <Slider
                    defaultValue={[layer.opacity]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={(value) => handleOpacityChange(layer.id, value)}
                    className="my-2"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">{t.width}</Label>
                    <Input
                      type="number"
                      value={layer.size.width}
                      onChange={(e) => handleSizeChange(layer.id, 'width', e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">{t.height}</Label>
                    <Input
                      type="number"
                      value={layer.size.height}
                      onChange={(e) => handleSizeChange(layer.id, 'height', e.target.value)}
                      className="h-8"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">X {t.position}</Label>
                    <Input
                      type="number"
                      value={layer.position.x}
                      onChange={(e) => updateImageLayer(layer.id, { 
                        position: { ...layer.position, x: parseInt(e.target.value) || 0 } 
                      })}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Y {t.position}</Label>
                    <Input
                      type="number"
                      value={layer.position.y}
                      onChange={(e) => updateImageLayer(layer.id, { 
                        position: { ...layer.position, y: parseInt(e.target.value) || 0 } 
                      })}
                      className="h-8"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs">{t.imageFilter || "Image Filter"}</Label>
                  <Select
                    value={layer.style || ""}
                    onValueChange={(value) => updateImageLayer(layer.id, { style: value })}
                  >
                    <SelectTrigger className="h-8 mt-1">
                      <SelectValue placeholder="Select filter" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.map(option => (
                        <SelectItem key={option.label} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}