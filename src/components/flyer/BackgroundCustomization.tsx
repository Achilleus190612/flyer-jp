import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { 
  useFlyerStore, 
  BackgroundStyle, 
  backgroundStyles,
  filterPresets
} from "@/store/flyerStore"
import { useLanguageStore } from "@/store/languageStore"
import { ImageIcon } from "lucide-react"

export function BackgroundCustomization() {
  const { 
    background, 
    updateBackground,
    backgroundColor,
    setBackgroundColor,
    selectedImage,
    setSelectedImage
  } = useFlyerStore()

  const { language, translations } = useLanguageStore()
  const t = translations[language]

  // Background style options
  const bgStyleOptions: { value: BackgroundStyle; label: string }[] = [
    { value: "cover", label: t.bgStyleCover || "Cover (Fill)" },
    { value: "contain", label: t.bgStyleContain || "Contain (Fit)" },
    { value: "stretch", label: t.bgStyleStretch || "Stretch" },
    { value: "repeat", label: t.bgStyleRepeat || "Repeat" },
    { value: "pattern", label: t.bgStylePattern || "Pattern" },
    { value: "overlay", label: t.bgStyleOverlay || "Overlay" }
  ]

  // Filter options
  const filterOptions = [
    { value: "none", label: t.filterNone || "None" },
    { value: "grayscale", label: t.filterGrayscale || "Grayscale" },
    { value: "sepia", label: t.filterSepia || "Sepia" },
    { value: "vintage", label: t.filterVintage || "Vintage" },
    { value: "blur", label: t.filterBlur || "Blur" },
    { value: "contrast", label: t.filterContrast || "High Contrast" },
    { value: "bright", label: t.filterBright || "Brighten" },
    { value: "dark", label: t.filterDark || "Darken" },
    { value: "warm", label: t.filterWarm || "Warm" },
    { value: "cool", label: t.filterCool || "Cool" }
  ]

  const handleUseSelectedImage = () => {
    if (selectedImage) {
      updateBackground({ image: selectedImage })
    }
  }

  const handleRemoveBackgroundImage = () => {
    updateBackground({ image: '' })
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">
          {t.backgroundSettings || "Background Settings"}
        </h3>

        <div className="space-y-4">
          <div>
            <Label className="text-sm">{t.backgroundColor}</Label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-8 h-8 rounded"
              />
              <Input
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="h-8 flex-grow"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">{t.backgroundImage || "Background Image"}</Label>
            
            {background.image ? (
              <div className="space-y-2">
                <div className="relative h-24 rounded overflow-hidden">
                  <img 
                    src={background.image} 
                    alt="Background" 
                    className="w-full h-full object-cover"
                    style={{ 
                      filter: background.filter 
                    }}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={handleRemoveBackgroundImage}
                  >
                    <span className="sr-only">{t.remove || "Remove"}</span>
                    <span aria-hidden="true">×</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-24 rounded border border-dashed border-muted-foreground/50 bg-muted/30">
                <Button 
                  variant="outline" 
                  onClick={handleUseSelectedImage}
                  disabled={!selectedImage}
                  className="flex items-center gap-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  {t.useSelectedImage || "Use Selected Image"}
                </Button>
              </div>
            )}
          </div>

          {background.image && (
            <>
              <div>
                <Label className="text-sm">{t.backgroundStyle || "Display Style"}</Label>
                <Select
                  value={background.style}
                  onValueChange={(value: BackgroundStyle) => 
                    updateBackground({ style: value })}
                >
                  <SelectTrigger className="h-8 mt-1">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {bgStyleOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm">{t.imageFilter || "Image Filter"}</Label>
                <Select
                  value={Object.keys(filterPresets).find(
                    key => filterPresets[key as keyof typeof filterPresets] === background.filter
                  ) || "none"}
                  onValueChange={(value) => 
                    updateBackground({ filter: filterPresets[value as keyof typeof filterPresets] })}
                >
                  <SelectTrigger className="h-8 mt-1">
                    <SelectValue placeholder="Select filter" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <Label className="text-sm">{t.opacity}</Label>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(background.opacity * 100)}%
                  </span>
                </div>
                <Slider
                  defaultValue={[background.opacity]}
                  value={[background.opacity]}
                  min={0}
                  max={1}
                  step={0.05}
                  onValueChange={(value) => updateBackground({ opacity: value[0] })}
                />
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}