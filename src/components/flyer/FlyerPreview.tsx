import { useRef, useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Move, Hand, Layers } from "lucide-react"
import { useFlyerStore, pageSizeDimensions } from "@/store/flyerStore"
import { useLanguageStore } from "@/store/languageStore"
import html2canvas from "html2canvas"

export function FlyerPreview() {
  const { 
    template, 
    textLayers,
    selectedImage, 
    imageLayers,
    textColor, 
    backgroundColor, 
    fontFamily,
    imagePosition,
    pageSize,
    customPageSize,
    updateImageLayer,
    updateTextLayer,
    textPosition,
    background
  } = useFlyerStore()
  
  const { language, translations } = useLanguageStore()
  const t = translations[language]
  const flyerRef = useRef<HTMLDivElement>(null)

  // States for dragging
  const [activeDragItem, setActiveDragItem] = useState<string | null>(null)
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 })
  const [isDraggingEnabled, setIsDraggingEnabled] = useState(false)
  const [dragStartOffset, setDragStartOffset] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(0.7) // Scale factor for preview display
  
  // Toggle all layers visibility for debugging
  const [showAllLayers, setShowAllLayers] = useState(false)

  // Font mapping
  const fontMap = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
    display: 'font-sans tracking-wide',
    handwriting: 'font-serif italic'
  }

  // Get current dimensions based on page size
  const getCurrentDimensions = () => {
    if (pageSize === 'custom') {
      return customPageSize
    }
    return pageSizeDimensions[pageSize]
  }

  const dimensions = getCurrentDimensions()
  const displayWidth = dimensions.width * scale
  const displayHeight = dimensions.height * scale

  // Background style mapping
  const getBackgroundStyle = () => {
    if (!background.image) return {}
    
    let styleObj: Record<string, string> = {
      backgroundImage: `url(${background.image})`,
      opacity: background.opacity.toString(),
    }
    
    if (background.filter) {
      styleObj.filter = background.filter
    }
    
    switch (background.style) {
      case 'cover':
        return {
          ...styleObj,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      case 'contain':
        return {
          ...styleObj,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }
      case 'stretch':
        return {
          ...styleObj,
          backgroundSize: '100% 100%'
        }
      case 'repeat':
        return {
          ...styleObj,
          backgroundRepeat: 'repeat'
        }
      case 'pattern':
        return {
          ...styleObj,
          backgroundSize: 'auto',
          backgroundRepeat: 'repeat'
        }
      case 'overlay':
        return {
          ...styleObj,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }
      default:
        return styleObj
    }
  }

  // Event handlers for dragging
  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    if (!isDraggingEnabled) return
    
    // Prevent default to avoid text selection during drag
    e.preventDefault()
    
    // Get mouse position relative to the flyer container
    const flyerRect = flyerRef.current?.getBoundingClientRect()
    if (!flyerRect) return
    
    const mouseX = (e.clientX - flyerRect.left) / scale
    const mouseY = (e.clientY - flyerRect.top) / scale
    
    setActiveDragItem(id)
    setDragStartPos({ x: mouseX, y: mouseY })
    
    // Calculate offset for the current element
    if (id.startsWith('text-')) {
      const layer = textLayers.find(layer => layer.id === id)
      if (layer) {
        setDragStartOffset({
          x: mouseX - layer.position.x,
          y: mouseY - layer.position.y
        })
      }
    } else {
      // For image layers
      const layer = imageLayers.find(layer => layer.id === id)
      if (layer) {
        setDragStartOffset({
          x: mouseX - layer.position.x,
          y: mouseY - layer.position.y
        })
      }
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!activeDragItem || !isDraggingEnabled || !flyerRef.current) return
    
    // Get mouse position relative to the flyer container
    const flyerRect = flyerRef.current.getBoundingClientRect()
    const mouseX = (e.clientX - flyerRect.left) / scale
    const mouseY = (e.clientY - flyerRect.top) / scale
    
    // Calculate new position
    const newX = Math.max(0, Math.min(dimensions.width - 10, mouseX - dragStartOffset.x))
    const newY = Math.max(0, Math.min(dimensions.height - 10, mouseY - dragStartOffset.y))
    
    if (activeDragItem.startsWith('text-')) {
      // Update text layer position
      updateTextLayer(activeDragItem, {
        position: { x: newX, y: newY }
      })
    } else {
      // Update image layer position
      updateImageLayer(activeDragItem, {
        position: { x: newX, y: newY }
      })
    }
  }

  const handleMouseUp = () => {
    setActiveDragItem(null)
  }

  // Add and remove event listeners
  useEffect(() => {
    if (activeDragItem) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [activeDragItem, isDraggingEnabled, scale, dragStartOffset])

  // Handle download
  const handleDownload = async () => {
    if (!flyerRef.current) return
    
    try {
      const canvas = await html2canvas(flyerRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Enable CORS for images
        allowTaint: true,
        backgroundColor: null
      })
      
      const image = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = image
      link.download = `flyer-${template}-${new Date().getTime()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error generating download:", error)
      alert("There was an error generating your download. Please try again.")
    }
  }

  // Function to render text layer
  const renderTextLayer = (layer: typeof textLayers[0]) => {
    const fontStyle = layer.fontFamily ? fontMap[layer.fontFamily] : fontMap[fontFamily]
    const textStyles: React.CSSProperties = {
      position: 'absolute',
      left: `${layer.position.x}px`,
      top: `${layer.position.y}px`,
      color: layer.color || textColor,
      opacity: layer.opacity,
      zIndex: layer.zIndex,
      fontSize: `${layer.fontSize}px`,
      fontWeight: layer.bold ? 'bold' : 'normal',
      fontStyle: layer.italic ? 'italic' : 'normal',
      transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
      maxWidth: layer.width ? `${layer.width}px` : '80%',
      cursor: isDraggingEnabled ? 'move' : 'default',
    }

    return (
      <div
        key={layer.id}
        className={`${fontStyle} p-2 ${activeDragItem === layer.id ? 'ring-2 ring-primary' : ''}`}
        style={textStyles}
        onMouseDown={(e) => handleMouseDown(e, layer.id)}
      >
        <div className="whitespace-pre-line">{layer.text}</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold">{t.preview}</h3>
              <Button 
                variant={isDraggingEnabled ? "secondary" : "outline"} 
                size="sm" 
                onClick={() => setIsDraggingEnabled(!isDraggingEnabled)}
                title={isDraggingEnabled ? t.disableDragMode : t.enableDragMode}
              >
                {isDraggingEnabled ? <Hand className="h-4 w-4" /> : <Move className="h-4 w-4" />}
              </Button>
              <Button 
                variant={showAllLayers ? "secondary" : "outline"} 
                size="sm" 
                onClick={() => setShowAllLayers(!showAllLayers)}
                title={t.toggleLayerBorders || "Toggle layer borders"}
              >
                <Layers className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              {t.downloadFlyer}
            </Button>
          </div>
          
          <div className="flex justify-center">
            <div
              style={{
                width: `${displayWidth}px`,
                height: `${displayHeight}px`,
                maxWidth: '100%',
                maxHeight: '70vh',
                overflow: 'hidden'
              }}
              className="border shadow-md"
            >
              <div
                ref={flyerRef}
                style={{ 
                  backgroundColor,
                  width: `${dimensions.width}px`,
                  height: `${dimensions.height}px`,
                  transform: `scale(${scale})`,
                  transformOrigin: '0 0',
                  cursor: isDraggingEnabled ? 'move' : 'default',
                  position: 'relative',
                  overflow: 'hidden',
                  ...getBackgroundStyle()
                }}
                className="relative"
              >
                {/* Legacy support for old image positioning when no layers */}
                {!background.image && textLayers.length === 0 && imageLayers.length === 0 && (
                  <div className="relative w-full h-full">
                    {selectedImage && (
                      <img 
                        src={selectedImage} 
                        alt="Flyer" 
                        className={
                          imagePosition === 'top' || imagePosition === 'bottom' 
                            ? 'w-full h-48 object-cover' 
                            : imagePosition === 'left' || imagePosition === 'right'
                            ? 'w-1/2 h-full object-cover'
                            : 'absolute w-full h-full object-cover opacity-30'
                        }
                        style={{
                          position: imagePosition === "background" ? 'absolute' : 'static',
                          top: 0,
                          left: 0
                        }}
                      />
                    )}
                    
                    {/* Legacy text if no text layers */}
                    {textLayers.length === 0 && (
                      <div 
                        className={`p-4 ${fontMap[fontFamily]}`}
                        style={{
                          color: textColor,
                          position: textPosition ? 'absolute' : 'static',
                          left: textPosition ? `${textPosition.x}px` : 'auto',
                          top: textPosition ? `${textPosition.y}px` : 'auto'
                        }}
                      >
                        <h2 className="text-2xl font-bold mb-2">
                          {template === 'business' ? 'Business Showcase' : 
                           template === 'event' ? 'Upcoming Event' : 
                           'Special Promotion'}
                        </h2>
                        <p>
                          {template === 'business' 
                            ? 'Introducing our professional services for your business needs'
                            : template === 'event'
                              ? 'Join us for an amazing event on July 15th, 2025'
                              : 'Limited time offer - 50% off all products!'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* All image layers */}
                {imageLayers.map((layer) => (
                  <div
                    key={layer.id}
                    style={{
                      position: 'absolute',
                      left: `${layer.position.x}px`,
                      top: `${layer.position.y}px`,
                      width: `${layer.size.width}px`,
                      height: `${layer.size.height}px`,
                      opacity: layer.opacity,
                      zIndex: layer.zIndex,
                      cursor: isDraggingEnabled ? 'move' : 'default',
                      filter: layer.style || ''
                    }}
                    onMouseDown={(e) => handleMouseDown(e, layer.id)}
                    className={`${activeDragItem === layer.id || showAllLayers ? 'ring-2 ring-primary' : ''}`}
                  >
                    <img
                      src={layer.image}
                      alt={`Layer ${layer.id}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      draggable={false}
                    />
                  </div>
                ))}
                
                {/* All text layers */}
                {textLayers.map(renderTextLayer)}
              </div>
            </div>
          </div>
          
          <div className="text-xs text-center text-muted-foreground mt-2">
            {t.pageSize}: {dimensions.width} × {dimensions.height} px
            {isDraggingEnabled && (
              <span className="ml-2 font-medium text-primary">
                • {t.dragModeEnabled || "Drag Mode Enabled"}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}