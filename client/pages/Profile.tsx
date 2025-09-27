import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { AttomLookupResponse, ProfileInput } from "@shared/api";

const schema = z.object({
  name: z.string().min(1, "Required"),
  phone: z.string().min(7, "Enter a valid phone"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
  notificationPreference: z.enum(["email", "sms", "both"]),
  address: z.object({
    street: z.string().min(1, "Required"),
    city: z.string().min(1, "Required"),
    state: z.string().min(2, "Required"),
    postalCode: z.string().min(3, "Required"),
  }),
  householdMembers: z.coerce.number().min(0).default(0),
  hasPets: z.boolean().default(false),
  laundryInUnit: z.boolean().default(false),
  hasDishwasher: z.boolean().default(false),
  evacuationPlanImageDataUrl: z.string().nullable().optional(),
});

export default function Profile() {
  const [attomDetails, setAttomDetails] = useState<{
    bedrooms: number | null;
    bathrooms: number | null;
    source: string;
  } | null>(null);
  const [submitted, setSubmitted] = useState<ProfileInput | null>(null);

  const stored = useMemo(() => {
    try {
      const raw = localStorage.getItem("homeguard_profile");
      return raw ? (JSON.parse(raw) as ProfileInput) : null;
    } catch {
      return null;
    }
  }, []);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: stored ?? {
      name: "",
      phone: "",
      email: "",
      password: "",
      notificationPreference: "email",
      address: { street: "", city: "", state: "", postalCode: "" },
      householdMembers: 0,
      hasPets: false,
      laundryInUnit: false,
      hasDishwasher: false,
      evacuationPlanImageDataUrl: null,
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (stored) setSubmitted(stored);
  }, [stored]);

  const handleImageUpload = async (file?: File | null) => {
    if (!file) return null;
    const reader = new FileReader();
    return await new Promise<string>((resolve) => {
      reader.onload = () => resolve(String(reader.result));
      reader.readAsDataURL(file);
    });
  };

  const lookupProperty = async () => {
    const values = form.getValues();
    try {
      const resp = await fetch("/api/attom/property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: values.address }),
      });
      const data = (await resp.json()) as AttomLookupResponse;
      if (data?.ok && data.details) {
        setAttomDetails({
          bedrooms: data.details.bedrooms ?? null,
          bathrooms: data.details.bathrooms ?? null,
          source: data.details.source,
        });
      }
    } catch (e) {
      // ignore, optional
    }
  };

  const onSubmit = async (values: z.infer<typeof schema>) => {
    if (!attomDetails) {
      await lookupProperty();
      return; // let the user confirm details first
    }

    const full: ProfileInput = {
      ...values,
      propertyDetails: {
        bedrooms: attomDetails.bedrooms ?? undefined,
        bathrooms: attomDetails.bathrooms ?? undefined,
        source:
          attomDetails.source === "attom"
            ? "attom"
            : attomDetails.source === "mock"
              ? "mock"
              : "manual",
      },
    };

    setSubmitted(full);
    localStorage.setItem("homeguard_profile", JSON.stringify(full));
    localStorage.setItem("homeguard_logged_in", "true");
  };

  if (submitted) {
    return (
      <section className="container py-10">
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground mt-2 max-w-prose">
          This summary is used to personalize your tracker and reminders. You
          can edit anytime.
        </p>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6 space-y-3">
              <h3 className="font-semibold text-lg">Account</h3>
              <div className="text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>{" "}
                  {submitted.name}
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span>{" "}
                  {submitted.phone}
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>{" "}
                  {submitted.email}
                </div>
                <div>
                  <span className="text-muted-foreground">Notifications:</span>{" "}
                  {submitted.notificationPreference}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-3">
              <h3 className="font-semibold text-lg">Home</h3>
              <div className="text-sm">
                <div>{submitted.address.street}</div>
                <div>
                  {submitted.address.city}, {submitted.address.state}{" "}
                  {submitted.address.postalCode}
                </div>
                <div className="mt-1">
                  <span className="text-muted-foreground">
                    Household members:
                  </span>{" "}
                  {submitted.householdMembers}
                </div>
                <div className="mt-1">
                  <span className="text-muted-foreground">Pets:</span>{" "}
                  {submitted.hasPets ? "Yes" : "No"}
                </div>
                <div className="mt-1">
                  <span className="text-muted-foreground">
                    Laundry in unit:
                  </span>{" "}
                  {submitted.laundryInUnit ? "Yes" : "No"}
                </div>
                <div className="mt-1">
                  <span className="text-muted-foreground">Dishwasher:</span>{" "}
                  {submitted.hasDishwasher ? "Yes" : "No"}
                </div>
                {submitted.propertyDetails && (
                  <div className="mt-2">
                    <span className="text-muted-foreground">
                      Bedrooms/Bathrooms:
                    </span>{" "}
                    {submitted.propertyDetails.bedrooms ?? "?"} bd ·{" "}
                    {submitted.propertyDetails.bathrooms ?? "?"} ba
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {submitted.evacuationPlanImageDataUrl && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Emergency Evacuation Plan</h3>
            <img
              src={submitted.evacuationPlanImageDataUrl}
              alt="Uploaded evacuation plan"
              className="max-h-96 rounded-md border"
            />
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <Button onClick={() => setSubmitted(null)} variant="outline">
            Edit Profile
          </Button>
          <Button asChild>
            <a href="/tracker">Go to Tracker</a>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-10">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-2">
          Tell us about you and your home. Scroll to complete all fields. We’ll
          pull basic property details from ATTOM and ask you to confirm.
        </p>
      </div>

      <div className="mt-8 max-w-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (for login)</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="(555) 123-4567"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Create a password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notificationPreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    How would you like to receive notifications?
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select one" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <h2 className="text-xl font-semibold">Home address</h2>
              <div className="mt-4 grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Street</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal code</FormLabel>
                      <FormControl>
                        <Input placeholder="ZIP / Postal code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="householdMembers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Do you have any household members? How many?
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min={0} placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasPets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Do you have any pets?</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(v) => field.onChange(Boolean(v))}
                        />
                        <span className="text-sm text-muted-foreground">
                          Yes
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="laundryInUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Is the laundry in unit?</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(v) => field.onChange(Boolean(v))}
                        />
                        <span className="text-sm text-muted-foreground">
                          Yes
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasDishwasher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Is there a dishwasher?</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(v) => field.onChange(Boolean(v))}
                        />
                        <span className="text-sm text-muted-foreground">
                          Yes
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="evacuationPlanImageDataUrl"
              render={() => (
                <FormItem>
                  <FormLabel>
                    Upload emergency evacuation plan (optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        const dataUrl = await handleImageUpload(file);
                        form.setValue(
                          "evacuationPlanImageDataUrl",
                          dataUrl ?? null,
                          { shouldDirty: true },
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {attomDetails ? (
              <Card className="bg-emerald-50/50 border-emerald-100">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">Is this correct?</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        We found {attomDetails.bedrooms ?? "?"} bedrooms and{" "}
                        {attomDetails.bathrooms ?? "?"} bathrooms
                        {attomDetails.source === "mock" ? " (sample data)" : ""}
                        .
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setAttomDetails(null)}
                      >
                        Edit
                      </Button>
                      <Button type="submit">Confirm</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={lookupProperty}
                >
                  Fetch property details
                </Button>
                <Button type="submit">Continue</Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </section>
  );
}
