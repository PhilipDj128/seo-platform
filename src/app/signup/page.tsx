import SignupForm from "@/components/Auth/SignupForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
  title: "Skapa konto | SEO Platform",
};

export default function SignupPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-200px)] max-w-md items-center px-4 py-16">
      <div className="w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Skapa ditt konto</h1>
          <p className="mt-2 text-slate-400">
            Kom igång med din SEO-resa idag
          </p>
        </div>
        <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Registrera dig</CardTitle>
          </CardHeader>
          <CardContent>
            <SignupForm />
            <p className="mt-4 text-center text-sm text-slate-400">
              Har du redan ett konto?{" "}
              <Link
                href="/login"
                className="font-medium text-brand-400 hover:text-brand-300"
              >
                Logga in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
