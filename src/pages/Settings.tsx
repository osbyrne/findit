import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"
import { SunIcon, MoonIcon, LaptopIcon, ArrowLeft } from "lucide-react" // Assuming lucide-react is installed
import { useNavigate } from "react-router-dom"; // Import useNavigate

export function Settings() {
    const { theme, setTheme } = useTheme()
    const navigate = useNavigate(); // Initialize navigate

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center mb-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="mr-2">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">Settings</h1>
            </div>
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Appearance</h2>
                <RadioGroup value={theme} onValueChange={setTheme}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="light" />
                        <Label htmlFor="light" className="flex items-center gap-2">
                            <SunIcon className="h-4 w-4" /> Light
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="dark" />
                        <Label htmlFor="dark" className="flex items-center gap-2">
                            <MoonIcon className="h-4 w-4" /> Dark
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="system" id="system" />
                        <Label htmlFor="system" className="flex items-center gap-2">
                            <LaptopIcon className="h-4 w-4" /> System
                        </Label>
                    </div>
                </RadioGroup>
            </div>
        </div>
    )
}