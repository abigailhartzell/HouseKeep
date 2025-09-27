import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { ProfileInput, ReminderItem } from "@shared/api";
import { Button } from "@/components/ui/button";

function generateReminders(p: ProfileInput | null): ReminderItem[] {
  const now = new Date();
  const inDays = (d: number) => new Date(now.getTime() + d * 86400000).toISOString();
  const base: ReminderItem[] = [
    { id: "smoke", title: "Test smoke and CO alarms", cadence: "Monthly", nextDueDateISO: inDays(30), relatedTo: "general" },
    { id: "filters", title: "Replace HVAC/AC filters", cadence: "Quarterly", nextDueDateISO: inDays(90), relatedTo: "general" },
    { id: "dryer", title: "Clean dryer lint trap and vent", cadence: "Monthly", nextDueDateISO: inDays(30), relatedTo: "laundry" },
  ];
  if (p?.hasPets) base.push({ id: "pets-kit", title: "Refresh pet emergency kit", cadence: "Biannually", nextDueDateISO: inDays(180), relatedTo: "pets" });
  if (p?.hasDishwasher) base.push({ id: "dishwasher-clean", title: "Run dishwasher cleaner", cadence: "Monthly", nextDueDateISO: inDays(30), relatedTo: "dishwasher" });
  return base;
}

import Protected from "@/components/Protected";

export default function Tracker() {
  const profile = useMemo<ProfileInput | null>(() => {
    try { return JSON.parse(localStorage.getItem("homeguard_profile") || "null"); } catch { return null; }
  }, []);

  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  useEffect(() => { setReminders(generateReminders(profile)); }, [profile]);

  return (
    <section className="container py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tracker</h1>
          <p className="text-muted-foreground mt-2">Your profile powers these suggestions and future reminders.</p>
        </div>
        <Button asChild variant="outline"><a href="/profile">Edit Profile</a></Button>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Profile snapshot</h3>
            {profile ? (
              <div className="text-sm text-muted-foreground space-y-1">
                <div>{profile.name}</div>
                <div>{profile.address.street}</div>
                <div>{profile.address.city}, {profile.address.state} {profile.address.postalCode}</div>
                <div>Notifications: {profile.notificationPreference}</div>
                {profile.propertyDetails && (
                  <div>{profile.propertyDetails.bedrooms ?? "?"} bd · {profile.propertyDetails.bathrooms ?? "?"} ba</div>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No profile yet. Create one to personalize your tracker.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Future reminders</h3>
            <ul className="space-y-3">
              {reminders.map((r) => (
                <li key={r.id} className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium">{r.title}</div>
                    <div className="text-xs text-muted-foreground">{r.cadence}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">Due {new Date(r.nextDueDateISO).toLocaleDateString()}</div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
