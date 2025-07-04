import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFlyerStore, FontFamily, ImagePosition, PageSize, pageSizeDimensions } from "@/store/flyerStore"
import { useLanguageStore } from "@/store/languageStore"

export function FlyerCustomization() {
  const { 
    textLayers,
    updateTextLayer,
    textColor, 
    setTextColor,
    backgroundColor,
    setBackgroundColor,
    fontFamily,
    setFontFamily,
    imagePosition,
    setImagePosition,
    pageSize,
    setPageSize,
    customPageSize,
    setCustomPageSize
  } = useFlyerStore()
  
  const { language, translations } = useLanguageStore()
  const t = translations[language]

  // Get text from first text layer or empty string if no layers exist
  const text = textLayers.length > 0 ? textLayers[0].text : "";
  
  // Update text in the first text layer
  const setText = (newText: string) => {
    if (textLayers.length > 0) {
      updateTextLayer(textLayers[0].id, { text: newText });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="text">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="text">{t.customizeText}</TabsTrigger>
            <TabsTrigger value="style">{t.style}</TabsTrigger>
            <TabsTrigger value="size">{t.pageSize}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-4">
            <div>
              <Label htmlFor="flyer-text">{t.customizeText}</Label>
              <Textarea
                id="flyer-text"
                placeholder={t.placeholderText}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div>
              <Label htmlFor="font-family">{t.fontSelector}</Label>
              <Select 
                value={fontFamily} 
                onValueChange={(value) => setFontFamily(value as FontFamily)}
              >
                <SelectTrigger id="font-family">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sans">Sans-serif</SelectItem>
                  <SelectItem value="serif">Serif</SelectItem>
                  <SelectItem value="mono">Monospace</SelectItem>
                  <SelectItem value="display">Display</SelectItem>
                  <SelectItem value="handwriting">Handwriting</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="style" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="text-color">{t.textColor}</Label>
                <div className="flex gap-2">
                  <Input
                    id="text-color"
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-12 p-1 h-10"
                  />
                  <Input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="background-color">{t.backgroundColor}</Label>
                <div className="flex gap-2">
                  <Input
                    id="background-color"
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-12 p-1 h-10"
                  />
                  <Input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="image-position">{t.imagePositionTitle}</Label>
              <Select 
                value={imagePosition} 
                onValueChange={(value) => setImagePosition(value as ImagePosition)}
              >
                <SelectTrigger id="image-position">
                  <SelectValue placeholder="Image position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="background">Background</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="size" className="space-y-4">
            <div>
              <Label htmlFor="page-size">{t.pageSize}</Label>
              <Select 
                value={pageSize} 
                onValueChange={(value) => setPageSize(value as PageSize)}
              >
                <SelectTrigger id="page-size">
                  <SelectValue placeholder="Select page size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4 (210 × 297 mm)</SelectItem>
                  <SelectItem value="letter">US Letter (8.5 × 11 in)</SelectItem>
                  <SelectItem value="social">Social Media (1080 × 1080 px)</SelectItem>
                  <SelectItem value="poster">Poster (510 × 768 px)</SelectItem>
                  <SelectItem value="custom">Custom Size</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {pageSize === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="custom-width">{t.width} (px)</Label>
                  <Input
                    id="custom-width"
                    type="number"
                    value={customPageSize.width}
                    onChange={(e) => setCustomPageSize({ 
                      ...customPageSize, 
                      width: parseInt(e.target.value) || 100 
                    })}
                    min={50}
                    max={2000}
                  />
                </div>
                <div>
                  <Label htmlFor="custom-height">{t.height} (px)</Label>
                  <Input
                    id="custom-height"
                    type="number"
                    value={customPageSize.height}
                    onChange={(e) => setCustomPageSize({ 
                      ...customPageSize, 
                      height: parseInt(e.target.value) || 100 
                    })}
                    min={50}
                    max={2000}
                  />
                </div>
              </div>
            )}
            
            {pageSize !== 'custom' && (
              <div className="text-sm text-muted-foreground">
                {t.currentDimensions}: {pageSizeDimensions[pageSize].width} × {pageSizeDimensions[pageSize].height} px
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}