import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="flex items-center gap-4">
        <Link href="/login">
          <Button size="lg">Login</Button>
        </Link>
        <Link href="/register">
          <Button size="lg" variant="outline">Registrar</Button>
        </Link>
      </div>
    </div>
  );
}
