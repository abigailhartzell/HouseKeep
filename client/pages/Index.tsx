import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Home safety and prevention, made simple
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-prose">
              HouseKeep helps you track the safety actions you’ve taken and
              gently reminds you about upcoming prevention tasks. Minimal,
              modern, and sustainably designed.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/profile">Create your profile</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/tracker">View tracker</Link>
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>
                <span className="block text-2xl font-bold text-emerald-600">
                  Sustainable
                </span>
                Low-contrast, energy-friendly theme
              </div>
              <div>
                <span className="block text-2xl font-bold text-emerald-600">
                  Private
                </span>
                Your data stays with you
              </div>
              <div>
                <span className="block text-2xl font-bold text-emerald-600">
                  Helpful
                </span>
                Smart reminders for your home
              </div>
            </div>
          </div>
          <Card className="md:translate-y-2 bg-gradient-to-br from-emerald-50 to-emerald-100/40 border-emerald-100">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold">About HouseKeep</h3>
              <p className="mt-2 text-muted-foreground">
                This app is your companion for a safer home. Track what you’ve
                done—like testing smoke alarms, cleaning dryer vents, replacing
                filters—and get reminded when it’s time again.
              </p>
              <Separator className="my-6" />
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Track completed safety actions
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Get email or SMS reminders
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Pull bedroom/bath data from ATTOM to prefill details
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/30 border-y">
        <div className="container py-14 grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-emerald-600 font-semibold">Step 1</div>
            <h3 className="text-xl font-semibold mt-1">Create your profile</h3>
            <p className="mt-2 text-muted-foreground">
              Tell us about your home and how you want notifications.
            </p>
          </div>
          <div>
            <div className="text-emerald-600 font-semibold">Step 2</div>
            <h3 className="text-xl font-semibold mt-1">Verify home details</h3>
            <p className="mt-2 text-muted-foreground">
              We pull basic property info from ATTOM and ask you to confirm.
            </p>
          </div>
          <div>
            <div className="text-emerald-600 font-semibold">Step 3</div>
            <h3 className="text-xl font-semibold mt-1">
              Track and be reminded
            </h3>
            <p className="mt-2 text-muted-foreground">
              Your tracker shows actions and future reminders in one place.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
