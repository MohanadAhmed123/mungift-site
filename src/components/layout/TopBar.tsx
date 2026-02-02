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
      
                              {/*'grid-cols-[1fr_4fr_1fr]' is for allotting more space to middle section relative to the left/right sections*/}
      <div className="h-14 grid grid-cols-[1fr_4fr_1fr] gap-2 items-center px-4">
        {/* LEFT */}
        <div className="flex items-center justify-center">
          <PopupNav />
        </div>

        {/* CENTER */}
        <div className="flex justify-center">
          <div className="flex-1 text-2xl text-center font-semibold">
            Muna Gift App
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 pr-2 justify-end">


          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Avatar className="">
                    <AvatarImage src={profile?.avatar_url ?? ""} />
                    <AvatarFallback>
                      {profile?.display_name?.[0] ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
                <p className="hidden sm:inline text-sm font-semibold max-w-30">
                  {profile?.display_name}
                </p>
              </div>
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
