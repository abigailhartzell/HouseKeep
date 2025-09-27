import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { getStoredProfile, useAuth } from "@/hooks/useAuth";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(id, pw);
    if (ok) {
      const p = getStoredProfile();
      nav(p ? "/tracker" : "/profile");
    } else {
      setError("Incorrect credentials. Try again.");
    }
  };

  return (
    <section className="container py-10 max-w-md">
      <h1 className="text-3xl font-bold tracking-tight">Login</h1>
      <p className="text-muted-foreground mt-2">Enter your email or phone and password.</p>
      <Card className="mt-6">
        <CardContent className="p-6">
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="text-sm font-medium">Email or phone</label>
              <Input value={id} onChange={(e) => setId(e.target.value)} placeholder="you@example.com or (555) 123-4567" />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Your password" />
            </div>
            {error && <div className="text-sm text-destructive">{error}</div>}
            <div className="flex gap-2">
              <Button type="submit">Log in</Button>
              <Button type="button" variant="outline" onClick={() => nav("/profile")}>Create profile</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
