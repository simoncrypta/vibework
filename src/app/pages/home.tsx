import { HelloForm } from "@/app/components/hello-form";
import { InfoCard } from "@/app/components/info-card";

/**
 * Server Component page: Tailwind for layout, small client islands for interactivity.
 */
export const Home = () => {
  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Vibework</h1>
          <p className="text-slate-600">
            RedwoodSDK RSC on Cloudflare Workers. Tailwind for layout — bring your own design system
            or pick a{" "}
            <a
              href="https://github.com/simoncrypta/vibework.X.Astryx"
              className="font-medium text-blue-600 underline-offset-2 hover:underline"
            >
              pre-wired variant
            </a>
            .
          </p>
        </header>

        <hr className="border-slate-200" />

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium">Compose components</h2>
          <InfoCard
            tags={["RSC", "Tailwind", "Edge"]}
            description="Pages stay Server Components. Controlled inputs and local state live in small client islands."
            ctaLabel="Get started"
          />
        </section>

        <hr className="border-slate-200" />

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium">Client island (forms)</h2>
          <p className="text-sm text-slate-600">
            The form below is a client component so the page shell remains a Server Component.
          </p>
          <div className="max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <HelloForm />
          </div>
        </section>
      </div>
    </main>
  );
};
