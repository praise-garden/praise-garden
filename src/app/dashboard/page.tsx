import Sidebar from "@/components/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50/30 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
            <div className="flex items-center justify-between h-16 px-6">
              <div className="flex items-center gap-4">
                <button
                  className="lg:hidden inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                  aria-label="Open navigation"
                >
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  Menu
                </button>
                <div className="hidden lg:block">
                  <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
                  <p className="text-sm text-gray-500">Welcome back to your testimonials center</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Breadcrumb or additional navigation could go here */}
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                  <span>Acme Corporation</span>
                  <span>/</span>
                  <span className="text-gray-900">Overview</span>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-6 space-y-8">
            {/* Stats Grid */}
            <section aria-labelledby="stats-heading">
              <h2 id="stats-heading" className="sr-only">Statistics Overview</h2>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {statCards.map((stat, index) => (
                  <Card key={stat.label} className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`size-10 rounded-2xl flex items-center justify-center ${
                          index === 0 ? 'bg-blue-50' : 
                          index === 1 ? 'bg-green-50' : 
                          index === 2 ? 'bg-purple-50' : 'bg-orange-50'
                        }`}>
                          <div className={`size-4 rounded-full ${
                            index === 0 ? 'bg-blue-500' : 
                            index === 1 ? 'bg-green-500' : 
                            index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                          }`} />
                        </div>
                        <Badge variant="outline" className="text-xs font-medium border-gray-200 text-gray-600 rounded-full px-2 py-1">
                          {stat.change}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Main Grid */}
            <section className="grid gap-8 xl:grid-cols-3">
              {/* Recent Testimonials */}
              <Card className="xl:col-span-2 bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden">
                <CardHeader className="p-6 pb-4">
                  <CardTitle className="text-xl font-semibold tracking-tight">Recent Testimonials</CardTitle>
                  <CardDescription className="text-gray-500">Latest customer feedback and reviews</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="space-y-4">
                    {testimonials.map((testimonial, index) => (
                      <div key={index} className="group p-4 rounded-2xl hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-10">
                              <AvatarFallback className="bg-gray-100 text-gray-700 font-medium text-sm">
                                {testimonial.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">{testimonial.name}</p>
                              <p className="text-sm text-gray-500">{testimonial.company}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Icon key={i} name="star" className="size-4 text-yellow-400" />
                              ))}
                            </div>
                            <span className="text-xs text-gray-400">{testimonial.date}</span>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{testimonial.text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Activity Feed */}
              <Card className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden">
                <CardHeader className="p-6 pb-4">
                  <CardTitle className="text-xl font-semibold tracking-tight">Activity Feed</CardTitle>
                  <CardDescription className="text-gray-500">Recent system activity</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="space-y-4">
                    {activities.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                        <div className="size-2 rounded-full bg-gray-300" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">{activity.text}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Analytics Chart */}
            <section>
              <Card className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden">
                <CardHeader className="p-6 pb-4">
                  <CardTitle className="text-xl font-semibold tracking-tight">Performance Analytics</CardTitle>
                  <CardDescription className="text-gray-500">Review trends and engagement metrics</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="h-64 w-full rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="size-12 rounded-2xl bg-gray-200 mx-auto mb-3 flex items-center justify-center">
                        <Icon name="chart" className="size-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-600">Chart visualization</p>
                      <p className="text-xs text-gray-400">Analytics data will appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
