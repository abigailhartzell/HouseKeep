import { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export default function Protected({ children }: PropsWithChildren) {
  const { authed } = useAuth();
  if (authed) return <>{children}</>;
  return (
    <div className="container py-10">
      <Card>
        <CardContent className="p-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold">Please log in to continue</h2>
            <p className="text-sm text-muted-foreground">Access to this section requires your email/phone and password.</p>
          </div>
          <Button asChild><a href="/login">Go to Login</a></Button>
        </CardContent>
      </Card>
    </div>
  );
}
