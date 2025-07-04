import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { 
  X, ArrowUp, ArrowDown, Bold, Italic, RotateCw
} from "lucide-react"
import { useFlyerStore, TextLayer, FontFamily } from "@/store/flyerStore"
import { useLanguageStore } from "@/store/languageStore"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function TextLayers() {
  const { 
    textLayers, 
    addTextLayer, 
    updateTextLayer, 
    removeTextLayer, 
    imageLayers 
  } = useFlyerStore()
  
  const { language, translations } = useLanguageStore()
  const t = translations[language]
  
  const [activeLayer, setActiveLayer] = useState<string | null>(null)
  
  // Font options
  const fontOptions: { value: FontFamily; label: string }[] = [
    { value: "sans", label: "Sans-serif" },
    { value: "serif", label: "Serif" },
    { value: "mono", label: "Monospace" },
    { value: "display", label: "Display" },
    { value: "handwriting", label: "Handwriting" }
  ]

  // Font mapping for preview
  const fontMap: Record<FontFamily, string> = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
    display: 'font-sans tracking-wide',
    handwriting: 'font-serif italic'
  }

  // Function to handle layer z-index change
  const changeZIndex = (id: string, direction: 'up' | 'down') => {
    // Combine text and image layers to determine proper z-index ordering
    const allLayers = [
      ...textLayers.map(l => ({ id: l.id, zIndex: l.zIndex, type: 'text' })),
      ...imageLayers.map(l => ({ id: l.id, zIndex: l.zIndex, type: 'image' }))
    ].sort((a, b) => a.zIndex - b.zIndex)
    
    const currentIndex = allLayers.findIndex(l => l.id === id)
    
    if (direction === 'up' && currentIndex < allLayers.length - 1) {
      const nextLayer = allLayers[currentIndex + 1]
      if (nextLayer.type === 'text') {
        updateTextLayer(id, { zIndex: nextLayer.zIndex })
        updateTextLayer(nextLayer.id, { zIndex: allLayers[currentIndex].zIndex })
      } else {
        // Handle cross-type layer (text over image or image over text)
        const currentLayer = allLayers[currentIndex]
        if (currentLayer.type === 'text') {
          updateTextLayer(id, { zIndex: nextLayer.zIndex + 1 })
        }
      }
    } else if (direction === 'down' && currentIndex > 0) {
      const prevLayer = allLayers[currentIndex - 1]
      if (prevLayer.type === 'text') {
        updateTextLayer(id, { zIndex: prevLayer.zIndex })
        updateTextLayer(prevLayer.id, { zIndex: allLayers[currentIndex].zIndex })
      } else {
        // Handle cross-type layer (text under image or image under text)
        const currentLayer = allLayers[currentIndex]
        if (currentLayer.type === 'text') {
          updateTextLayer(id, { zIndex: prevLayer.zIndex - 1 })
        }
      }
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {t.textLayers || "Text Layers"} ({textLayers.length})
          </h3>
          <Button onClick={() => addTextLayer()} size="sm">
            + {t.addTextLayer || "Add Text"}
          </Button>
        </div>
        
        {textLayers.length === 0 ? (
          <div className="text-center text-muted-foreground py-6">
            {t.noTextLayers || "No text layers. Click Add Text to create a layer."}
          </div>
        ) : (
          <div className="space-y-4">
            {[...textLayers]
              .sort((a, b) => b.zIndex - a.zIndex)
              .map((layer) => (
                <div 
                  key={layer.id} 
                  className={cn(
                    "border rounded-md p-3 space-y-3",
                    activeLayer === layer.id ? "border-primary" : ""
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className={cn(
                          "px-2 py-1 text-sm truncate max-w-[150px] border rounded",
                          fontMap[layer.fontFamily],
                          layer.bold ? "font-bold" : "",
                          layer.italic ? "italic" : ""
                        )}
                        style={{ color: layer.color }}
                      >
                        {layer.text.substring(0, 20)}
                        {layer.text.length > 20 ? "..." : ""}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        z:{layer.zIndex}
                      </span>
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
                        onClick={() => removeTextLayer(layer.id)}
                        title={t.remove || "Remove"}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">{t.text || "Text"}</Label>
                    <Textarea
                      value={layer.text}
                      onChange={(e) => updateTextLayer(layer.id, { text: e.target.value })}
                      className="mt-1 h-20"
                      placeholder={t.placeholderText}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">{t.fontSize || "Font Size"}</Label>
                      <div className="flex gap-2 items-center">
                        <Slider
                          defaultValue={[layer.fontSize]}
                          min={8}
                          max={72}
                          step={1}
                          onValueChange={(value) => updateTextLayer(layer.id, { fontSize: value[0] })}
                          className="flex-grow"
                        />
                        <div className="text-xs w-8 text-right">{layer.fontSize}px</div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">{t.opacity}</Label>
                      <div className="flex gap-2 items-center">
                        <Slider
                          defaultValue={[layer.opacity]}
                          min={0}
                          max={1}
                          step={0.05}
                          onValueChange={(value) => updateTextLayer(layer.id, { opacity: value[0] })}
                          className="flex-grow"
                        />
                        <div className="text-xs w-8 text-right">{Math.round(layer.opacity * 100)}%</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">{t.textColor}</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={layer.color}
                          onChange={(e) => updateTextLayer(layer.id, { color: e.target.value })}
                          className="w-8 h-8 rounded"
                        />
                        <Input
                          value={layer.color}
                          onChange={(e) => updateTextLayer(layer.id, { color: e.target.value })}
                          className="h-8 flex-grow"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs">{t.fontSelector}</Label>
                      <Select
                        value={layer.fontFamily}
                        onValueChange={(value: FontFamily) => 
                          updateTextLayer(layer.id, { fontFamily: value })}
                      >
                        <SelectTrigger className="h-8 mt-1">
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map(option => (
                            <SelectItem 
                              key={option.value} 
                              value={option.value}
                              className={fontMap[option.value]}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">{t.position}</Label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <span className="text-xs">X:</span>
                          <Input
                            type="number"
                            value={layer.position.x}
                            onChange={(e) => updateTextLayer(layer.id, { 
                              position: { ...layer.position, x: parseInt(e.target.value) || 0 } 
                            })}
                            className="h-8"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs">Y:</span>
                          <Input
                            type="number"
                            value={layer.position.y}
                            onChange={(e) => updateTextLayer(layer.id, { 
                              position: { ...layer.position, y: parseInt(e.target.value) || 0 } 
                            })}
                            className="h-8"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs">{t.rotation || "Rotation"}</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Slider
                          defaultValue={[layer.rotation]}
                          min={0}
                          max={360}
                          step={5}
                          onValueChange={(value) => updateTextLayer(layer.id, { rotation: value[0] })}
                          className="flex-grow"
                        />
                        <div className="flex items-center gap-1">
                          <RotateCw className="h-3 w-3" />
                          <span className="text-xs">{layer.rotation}°</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={layer.bold}
                        onCheckedChange={(checked) => 
                          updateTextLayer(layer.id, { bold: checked })}
                        id={`bold-${layer.id}`}
                      />
                      <Label htmlFor={`bold-${layer.id}`} className="flex items-center cursor-pointer">
                        <Bold className="h-4 w-4 mr-1" />
                        <span className="text-xs">{t.bold || "Bold"}</span>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={layer.italic}
                        onCheckedChange={(checked) => 
                          updateTextLayer(layer.id, { italic: checked })}
                        id={`italic-${layer.id}`}
                      />
                      <Label htmlFor={`italic-${layer.id}`} className="flex items-center cursor-pointer">
                        <Italic className="h-4 w-4 mr-1" />
                        <span className="text-xs">{t.italic || "Italic"}</span>
                      </Label>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}