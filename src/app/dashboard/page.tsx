import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const statCards = [
  { label: "Total Reviews", value: "2,847", change: "+12%" },
  { label: "Avg Rating", value: "4.8", change: "+0.2" },
  { label: "This Month", value: "284", change: "+23%" },
  { label: "Response Rate", value: "94%", change: "+2%" },
];

const testimonials = [
  { name: "Sarah Johnson", company: "TechCorp", rating: 5, text: "Outstanding service and support", date: "2 hours ago" },
  { name: "Michael Chen", company: "StartupXYZ", rating: 5, text: "Exceeded all expectations", date: "5 hours ago" },
  { name: "Emily Davis", company: "DesignStudio", rating: 4, text: "Great experience overall", date: "1 day ago" },
  { name: "David Wilson", company: "Enterprise Inc", rating: 5, text: "Highly recommend this service", date: "2 days ago" },
];

const activities = [
  { text: "New testimonial from TechCorp", time: "2h" },
  { text: "Rating updated to 4.8 stars", time: "5h" },
  { text: "Monthly report generated", time: "1d" },
  { text: "Integration with Slack completed", time: "2d" },
];

const Icon = ({ name, className }: { name: string; className?: string }) => {
  if (name === "home") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className}><path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" fill="currentColor"/></svg>
    );
  }
  if (name === "star") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/></svg>
    );
  }
  if (name === "form") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2v6h6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 13H8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 17H8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 9H8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    );
  }
  if (name === "widget") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className}><path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    );
  }
  if (name === "plus") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className}><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    );
  }
  if (name === "code") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className}><path d="M16 18l6-6-6-6M8 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    );
  }
  if (name === "upload") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    );
  }
  if (name === "check") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className}><path d="M20.3 5.7a1 1 0 0 1 0 1.4l-10 10a1 1 0 0 1-1.4 0l-5-5a1 1 0 1 1 1.4-1.4L9 14.59 18.9 5.7a1 1 0 0 1 1.4 0z" fill="currentColor"/></svg>
    );
  }
  if (name === "chart") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className}><path d="M4 19a1 1 0 0 1-1-1V5a1 1 0 1 1 2 0v13a1 1 0 0 1-1 1zm6 0a1 1 0 0 1-1-1V9a1 1 0 1 1 2 0v9a1 1 0 0 1-1 1zm6 0a1 1 0 0 1-1-1V6a1 1 0 1 1 2 0v12a1 1 0 0 1-1 1z" fill="currentColor"/></svg>
    );
  }
  if (name === "gear") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className}><path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm9.4 4a7.4 7.4 0 0 0-.2-1.6l2-1.5-2-3.5-2.3 1a7.7 7.7 0 0 0-2.7-1.6l-.3-2.5H10l-.3 2.5a7.7 7.7 0 0 0-2.7 1.6l-2.3-1-2 3.5 2 1.5A7.4 7.4 0 0 0 2.6 12c0 .54.07 1.07.2 1.6l-2 1.5 2 3.5 2.3-1a7.7 7.7 0 0 0 2.7 1.6l.3 2.5h4.8l.3-2.5a7.7 7.7 0 0 0 2.7-1.6l2.3 1 2-3.5-2-1.5c.13-.52.2-1.05.2-1.6z" fill="currentColor"/></svg>
    );
  }
  if (name === "chevron-down") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className}><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    );
  }
  return null;
};

const DashboardPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <section aria-labelledby="stats-heading" className="space-y-6">
        <h2 id="stats-heading" className="sr-only">
          Statistics Overview
        </h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat, index) => (
            <Card
              key={stat.label}
              className="overflow-hidden rounded-3xl border-gray-800 bg-gray-900 shadow-lg transition-all duration-300 hover:shadow-blue-500/10"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className={`flex size-10 items-center justify-center rounded-2xl ${
                      index === 0
                        ? "bg-blue-900/50"
                        : index === 1
                          ? "bg-green-900/50"
                          : index === 2
                              ? "bg-purple-900/50"
                              : "bg-orange-900/50"
                    }`}
                  >
                    <div
                      className={`size-4 rounded-full ${
                        index === 0
                          ? "bg-blue-500"
                          : index === 1
                              ? "bg-green-500"
                              : index === 2
                                  ? "bg-purple-500"
                                  : "bg-orange-500"
                      }`}
                    />
                  </div>
                  <Badge className="rounded-full border-gray-700 px-2 py-1 text-xs font-medium text-gray-300" variant="outline">
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold tracking-tight text-gray-50">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-3">
        <Card className="xl:col-span-2 overflow-hidden rounded-3xl border-gray-800 bg-gray-900 shadow-lg transition-all duration-300 hover:shadow-blue-500/10">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-xl font-semibold tracking-tight">Recent Testimonials</CardTitle>
            <CardDescription className="text-gray-400">Latest customer feedback and reviews</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="group rounded-2xl p-4 transition-colors duration-200 hover:bg-gray-800/50"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10">
                        <AvatarFallback className="text-sm font-medium text-gray-300">
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-50">{testimonial.name}</p>
                        <p className="text-sm text-gray-400">{testimonial.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Icon key={i} className="size-4 text-yellow-400" name="star" />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{testimonial.date}</span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-300">{testimonial.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-3xl border-gray-800 bg-gray-900 shadow-lg transition-all duration-300 hover:shadow-blue-500/10">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-xl font-semibold tracking-tight">Activity Feed</CardTitle>
            <CardDescription className="text-gray-400">Recent system activity</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-xl p-3 transition-colors duration-200 hover:bg-gray-800/50"
                >
                  <div className="size-2 rounded-full bg-gray-600" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-300">{activity.text}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="overflow-hidden rounded-3xl border-gray-800 bg-gray-900 shadow-lg transition-all duration-300 hover:shadow-blue-500/10">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-xl font-semibold tracking-tight">Performance Analytics</CardTitle>
            <CardDescription className="text-gray-400">Review trends and engagement metrics</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800/50">
              <div className="text-center">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-gray-800">
                  <Icon className="size-6 text-gray-500" name="chart" />
                </div>
                <p className="text-sm font-medium text-gray-400">Chart visualization</p>
                <p className="text-xs text-gray-500">Analytics data will appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default DashboardPage;