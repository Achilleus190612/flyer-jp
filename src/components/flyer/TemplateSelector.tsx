import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Briefcase, Calendar, Megaphone } from "lucide-react"
import { useFlyerStore } from "@/store/flyerStore"
import { useLanguageStore } from "@/store/languageStore"

export function TemplateSelector() {
  const { template, setTemplate } = useFlyerStore()
  const { language, translations } = useLanguageStore()
  const t = translations[language]

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">{t.templateTitle}</h3>
        <RadioGroup
          value={template}
          onValueChange={(value) => setTemplate(value as any)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div>
            <RadioGroupItem value="business" id="business" className="peer sr-only" />
            <Label
              htmlFor="business"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <Briefcase className="mb-3 h-6 w-6" />
              <span className="text-center">{t.businessTemplate}</span>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem value="event" id="event" className="peer sr-only" />
            <Label
              htmlFor="event"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <Calendar className="mb-3 h-6 w-6" />
              <span className="text-center">{t.eventTemplate}</span>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem value="promotion" id="promotion" className="peer sr-only" />
            <Label
              htmlFor="promotion"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <Megaphone className="mb-3 h-6 w-6" />
              <span className="text-center">{t.promotionTemplate}</span>
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}