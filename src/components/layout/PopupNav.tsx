import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { label: "Vocabulary", path: "/vocabulary" },
  { label: "Recipes", path: "/recipes" },
  { label: "Texts", path: "/texts" },
  { label: "Media", path: "/media" },
]

export function PopupNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5 size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-30">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.path)

          return (
            <DropdownMenuItem
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "cursor-pointer",
                isActive && "font-semibold"
              )}
            >
              {item.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
