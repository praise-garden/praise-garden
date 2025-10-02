import { Button } from "@/components/ui/button";
import Image from "next/image";
import appIcon from "./icon.png";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground font-sans">
      {/* Cosmic background glow */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[60vh] w-[80vw] -translate-x-1/2 rounded-full blur-3xl opacity-40" style={{ background: "radial-gradient(60% 60% at 50% 50%, rgba(137,254,101,0.35) 0%, rgba(34,197,94,0.15) 35%, rgba(34,197,94,0.0) 70%)" }} />
        <div className="absolute left-1/3 bottom-[-10%] h-[40vh] w-[50vw] -translate-x-1/2 rounded-full blur-3xl opacity-30" style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(137,254,101,0.25) 0%, rgba(34,197,94,0.1) 40%, rgba(34,197,94,0.0) 70%)" }} />
      </div>

      {/* Header + Hero */}
      <section className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-6 sm:pt-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={appIcon}
              alt="Praise Garden logo"
              width={28}
              height={28}
              className="h-7 w-7 rounded-md border border-border shadow-sm object-contain"
              priority
            />
            <span className="text-sm font-medium tracking-[-0.05em]">Praise Garden</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-foreground/80">
            <a className="hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-sm px-1" href="#features">Features</a>
            <a className="hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-sm px-1" href="#developers">Developers</a>
            <a className="hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-sm px-1" href="#pricing">Pricing</a>
          </nav>
          <div className="hidden sm:flex items-center gap-3">
            <Button asChild style={{ backgroundColor: "var(--color-accent)" }} className="text-background shadow-sm">
              <a href="/dashboard">Get started</a>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto mt-8 max-w-3xl text-center">
            <div className="mx-auto w-fit rounded-full border border-border bg-background/70 px-3 py-1 text-xs text-foreground/70 backdrop-blur">
              Open-source engine for your Wall of Love
            </div>
            <h1 className="mt-6 text-4xl sm:text-6xl font-semibold tracking-[-0.06em] leading-[1.05]">
              Turn happy users into high‑converting testimonials.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-foreground/70">
              Collect video and text testimonials with one link. Approve in one click. Embed a beautiful Wall of Love anywhere.
            </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button asChild size="lg" style={{ backgroundColor: "var(--color-accent)" }} className="text-background shadow-sm">
              <a href="/dashboard">Collect testimonials now</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#developers">View Docs</a>
            </Button>
          </div>
          

          {/* UI Mock with lime stroke + glow */}
          <div className="relative mt-14 rounded-2xl border border-border bg-background/60 p-3 backdrop-blur shadow-sm">
            <div className="absolute inset-0 -z-10 rounded-2xl" style={{ boxShadow: "0 0 120px 20px rgba(137,254,101,0.18)" }} aria-hidden="true" />
            <div className="rounded-xl border border-[rgba(137,254,101,0.45)] bg-background p-6 text-left">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-block size-2 rounded-full bg-[rgba(137,254,101,0.9)]" aria-hidden="true" />
                    <span className="text-xs font-medium tracking-[-0.03em]">Your Testimonial Wall</span>
                  </div>
                  <a href="#" className="text-xs text-foreground/60 hover:text-foreground">Share Page ↗</a>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    { n: "A", name: "Alex D.", quote: '"Switching from closed tools to open-source was a no-brainer. Gorgeous UX."' },
                    { n: "B", name: "Brianna C.", quote: '"Collecting testimonials went from days to minutes. The embed is perfect."' },
                    { n: "C", name: "Chris P.", quote: '"Moderation is seamless. Approve and publish in one click."' },
                    { n: "D", name: "Dev Co.", quote: '"We self-hosted in hours. Great docs, love the SDK."' },
                  ].map((t) => (
                    <div key={t.name} className="rounded-lg border border-border p-3">
                      <div className="flex items-center gap-2">
                        <span aria-label="avatar" className="inline-flex size-6 items-center justify-center rounded-full border border-border bg-background text-[10px]">{t.n}</span>
                        <span className="text-xs font-medium">{t.name}</span>
                      </div>
                      <p className="mt-2 text-xs text-foreground/80">{t.quote}</p>
                    </div>
                  ))}
                  <div className="sm:col-span-2 rounded-lg border border-dashed border-border p-3 text-center">
                    <button className="text-xs text-foreground/70 hover:text-foreground w-full h-full">+ Add your testimonial</button>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section id="features" className="mx-auto mt-20 max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "One-link submissions",
                desc: "Share a branded page and collect text, image, or video in seconds.",
              },
              {
                title: "Moderate & approve",
                desc: "Review, edit, and publish to your Wall with one click.",
              },
              {
                title: "Embed anywhere",
                desc: "Drop the Wall or carousel into your site, docs, or Notion.",
              },
              {
                title: "Open-source & self-hosted",
                desc: "Own your data, customize flows, and contribute. MIT core.",
              },
              {
                title: "Developer-friendly SDKs",
                desc: "Type-safe APIs, webhooks, and CLI for automations and pipelines.",
              },
              {
                title: "Privacy & control",
                desc: "Consent-first submissions, custom fields, and granular visibility.",
              },
          ].map((f) => (
            <div key={f.title} className="group relative overflow-hidden rounded-xl border border-border bg-background/60 p-6 backdrop-blur transition shadow-sm">
              <div className="absolute -inset-0.5 -z-10 rounded-xl opacity-0 blur-2xl transition-opacity group-hover:opacity-40" style={{ background: "radial-gradient(60% 60% at 50% 50%, rgba(137,254,101,0.25) 0%, rgba(137,254,101,0) 70%)" }} />
              <div className="mb-3 inline-flex size-8 items-center justify-center rounded-md border border-[rgba(137,254,101,0.5)] text-[10px]" aria-hidden="true">★</div>
              <h3 className="text-lg font-semibold tracking-[-0.03em]">{f.title}</h3>
              <p className="mt-1 text-sm text-foreground/70">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Developer section with code card */}
      <section id="developers" className="mx-auto mt-20 max-w-6xl px-6">
        <div className="grid grid-cols-1 items-center gap-8 sm:grid-cols-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.05em]">Developers: automate your testimonial flow</h2>
            <p className="mt-3 text-sm text-foreground/70">Use our TypeScript SDK, webhooks, and embeds to collect, moderate, and publish from your stack.</p>
            <div className="mt-6 flex gap-3">
              <Button asChild style={{ backgroundColor: "var(--color-accent)" }} className="text-background">
                <a href="/dashboard">Install SDK</a>
              </Button>
              <Button asChild variant="outline">
                <a href="#">GitHub</a>
              </Button>
            </div>
          </div>
          <div className="relative rounded-xl border border-[rgba(137,254,101,0.45)] bg-background p-4 shadow-sm">
            <div className="absolute inset-0 -z-10 rounded-xl" style={{ boxShadow: "0 0 80px 12px rgba(137,254,101,0.15)" }} aria-hidden="true" />
            <pre className="font-mono text-xs leading-relaxed text-foreground/90">
{`// Collect a testimonial via SDK
import { client } from "@praise/sdk"

const submit = async () => {
  const t = await client.testimonials.create({
    name: "Alex D.",
    handle: "@alex",
    quote: "Loved the self-host option and clean embed.",
    rating: 5,
  })

  // Auto-approve via rule or send to moderation queue
  await client.moderation.approve(t.id)

  // Publish to a wall
  await client.walls.publish({ wallId: "wall_123", testimonialId: t.id })
}

submit()`}
            </pre>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="mx-auto mt-20 max-w-6xl px-6">
        <div className="rounded-2xl border border-border bg-background/60 p-6 backdrop-blur">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-center sm:text-left">
              <p className="text-sm text-foreground/70">Trusted by creators and teams building in public</p>
              <div className="mt-3 flex -space-x-2">
                {["A","B","C","D","E"].map((l) => (
                  <span key={l} aria-label={`avatar ${l}`} className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-background text-xs">
                    {l}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs text-foreground/60">
              {['Next.js','Vercel','Tailwind'].map((logo) => (
                <div key={logo} className="rounded-md border border-border bg-background px-3 py-2 text-center">{logo}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="mx-auto mt-20 max-w-6xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-2xl border border-[rgba(137,254,101,0.45)] bg-background p-6 shadow-sm">
          <div className="absolute inset-0 -z-10 rounded-2xl" style={{ boxShadow: "0 0 120px 20px rgba(137,254,101,0.18)" }} aria-hidden="true" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-[1.2fr_1fr]">
            <div>
              <h3 className="text-2xl font-semibold tracking-[-0.05em]">Create your Wall of Love in minutes</h3>
              <p className="mt-2 text-sm text-foreground/70">Free for personal projects. Pro adds custom domains, advanced embeds, webhooks, and roles.</p>
            </div>
            <div className="flex items-center justify-start sm:justify-end gap-3">
              <Button asChild size="lg" style={{ backgroundColor: "var(--color-accent)" }} className="text-background">
                <a href="/dashboard">Create your Wall of Love</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#">Talk to sales</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
