import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Bell, LogOut, User } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { getHospitalLogo } from "@/utils/hospitalInfo";

interface AppHeaderProps {
  onSidebarToggle: () => void;
  sidebarOpen: boolean;
}

export function AppHeader({ onSidebarToggle, sidebarOpen }: AppHeaderProps) {
  const { user, signOut } = useAuth();
  const [hospitalLogo, setHospitalLogo] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchHospitalLogo = async () => {
      const logo = await getHospitalLogo();
      setHospitalLogo(logo);
    };
    
    fetchHospitalLogo();
  }, []);

  const handleSignOut = () => {
    signOut();
  };

  return (
    <header className="border-b">
      <div className="flex h-16 items-center gap-4 px-4">
        <Sheet open={sidebarOpen} onOpenChange={onSidebarToggle}>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>
        
        <div className="flex items-center gap-3">
          {hospitalLogo ? (
            <img 
              src={hospitalLogo} 
              alt="Logo Rumah Sakit" 
              className="h-10 w-10 object-contain rounded"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">RS</span>
            </div>
          )}
          <div>
            <h2 className="font-semibold text-lg">SIMRS</h2>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <Button size="icon" variant="outline" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-xs text-destructive-foreground flex items-center justify-center">
              3
            </span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" alt="@user" />
                  <AvatarFallback>
                    {user?.email?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem>
                <User className="h-4 w-4 mr-2" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                <span>Keluar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}