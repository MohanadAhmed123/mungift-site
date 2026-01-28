import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { PopupNav } from "@/components/layout/PopupNav"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme/theme-provider"


export function TopBar() {
  const { profile, signOut } = useAuth()
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 border-b bg-primary">
      <div className="flex h-14 items-center px-4">
        {/* LEFT */}
        <div className="flex items-center">
          <PopupNav />
        </div>

        {/* CENTER */}
        <div className="flex-1 text-2xl text-center font-semibold">
          Muna Gift App
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url ?? ""} />
                  <AvatarFallback>
                    {profile?.display_name?.[0] ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm">
                  {profile?.display_name}
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {profile?.display_name}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        {theme === "dark" ? (
                        <Moon />
                        ) : (
                        <Sun />
                        )}
                        Theme
                    </DropdownMenuSubTrigger>

                    <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                        <Sun />
                        Light
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                        <Moon />
                        Dark
                        </DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={signOut}
                variant="destructive"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
