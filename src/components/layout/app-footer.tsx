import { LogoIcon } from "@/components/icons/logo-icon";

export function AppFooter() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <LogoIcon className="h-6 w-6 text-primary" />
            <p className="font-headline font-semibold">Mineblox Studio</p>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Mineblox Corporation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
