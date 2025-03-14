import UsersTable from "@/components/UsersTable";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="flex w-full flex-col items-center justify-center min-h-screen p-2 bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-7xl">
        <UsersTable />
      </div>
    </div>
  );
}
