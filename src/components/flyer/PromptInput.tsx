import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { useFlyerStore } from "@/store/flyerStore"
import { useLanguageStore } from "@/store/languageStore"

export function PromptInput() {
  const [loading, setLoading] = useState(false)
  const { prompt, setPrompt, setText } = useFlyerStore()
  const { language, translations } = useLanguageStore()
  const t = translations[language]

  const handleGenerate = () => {
    if (!prompt.trim()) return
    
    setLoading(true)
    
    // Simulate AI text generation based on prompt
    setTimeout(() => {
      // This would be replaced with actual AI-generated text in a real app
      const generatedText = generateText(prompt)
      setText(generatedText)
      setLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleGenerate()
    }
  }

  // Simple text generation simulation
  const generateText = (prompt: string) => {
    // This is just a placeholder for demonstration
    // In a real app, this would call an AI service
    let baseText = ""
    
    if (prompt.toLowerCase().includes("sale") || prompt.toLowerCase().includes("discount")) {
      baseText = "SPECIAL SALE EVENT\n\n50% OFF ALL ITEMS\n\nLimited Time Offer\nJuly 10-15, 2025\n\nVisit our store today!"
    } else if (prompt.toLowerCase().includes("event") || prompt.toLowerCase().includes("conference")) {
      baseText = "ANNUAL TECH CONFERENCE\n\nJoin industry leaders for a day of innovation\n\nJuly 15, 2025\n9:00 AM - 6:00 PM\n\nRegister now at example.com"
    } else if (prompt.toLowerCase().includes("business") || prompt.toLowerCase().includes("service")) {
      baseText = "PROFESSIONAL CONSULTING SERVICES\n\nStrategic Solutions for Business Growth\n\nContact us today:\nemail@example.com\n(555) 123-4567"
    } else {
      baseText = prompt.toUpperCase() + "\n\nSpecial announcement\n\nJoin us on July 15, 2025\n\nContact: info@example.com"
    }
    
    return baseText
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">{t.enterPrompt}</h3>
        <div className="flex gap-2">
          <Input
            placeholder={t.enterPrompt + "..."}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button 
            onClick={handleGenerate} 
            disabled={!prompt.trim() || loading}
            className="whitespace-nowrap"
          >
            {loading ? (
              <span className="flex items-center">
                <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                {t.generateFlyer}...
              </span>
            ) : (
              <span className="flex items-center">
                <Sparkles className="mr-2 h-4 w-4" />
                {t.generateFlyer}
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}