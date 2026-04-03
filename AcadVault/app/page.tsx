"use client";

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { GraduationCap, Users, BookOpen, Award, Shield, Sparkles, ArrowRight, Zap, CheckCircle } from "lucide-react"

export default function HomePage() {
  const router = useRouter();

  const handlePortalAccess = (e: React.MouseEvent, portalHref: string) => {
    e.preventDefault();
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const currentUser = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;

    if (!token || !currentUser) {
      router.push('/auth/login');
      return;
    }

    try {
      const user = JSON.parse(currentUser);
      if (user?.role === 'admin') {
        router.push('/admin');
      } else if (user?.role === 'faculty') {
        router.push('/faculty');
      } else {
        router.push('/student');
      }
    } catch {
      router.push('/auth/login');
    }
  };
  return (
    <div className="min-h-screen aurora-bg" style={{ background: '#0b1326' }}>
      {/* Floating Navigation */}
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="AcadVault Logo" width={40} height={40} className="rounded-xl shadow-[0_0_15px_rgba(78,222,163,0.3)] transition-transform hover:scale-105 duration-300" />
            <span className="text-xl font-bold" style={{ color: '#dae2fd' }}>AcadVault</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="link-emerald text-sm font-medium" style={{ color: '#86948a' }}>Features</a>
            <a href="#stats" className="link-emerald text-sm font-medium" style={{ color: '#86948a' }}>About</a>
            <Link href="/auth/login" className="btn-glow px-5 py-2.5 rounded-lg text-sm font-semibold">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Aurora Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-20 blur-3xl pointer-events-none"
             style={{ background: 'radial-gradient(ellipse, #4edea3 0%, transparent 70%)' }} />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6"
                   style={{ background: 'rgba(78, 222, 163, 0.1)', color: '#4edea3', border: '1px solid rgba(78, 222, 163, 0.15)' }}>
                <Sparkles className="h-3.5 w-3.5" />
                Academic Achievement Platform
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6" 
                  style={{ color: '#dae2fd', letterSpacing: '-0.04em' }}>
                Your Academic Achievements, <span style={{ background: 'linear-gradient(135deg, #4edea3, #6ffbbe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Beautifully Organized</span>
              </h1>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: '#86948a' }}>
                A premium platform to track, verify, and showcase your academic milestones in a professional portfolio. Elevate your scholarly identity.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/auth/login" className="btn-glow px-8 py-3.5 rounded-xl text-base font-semibold inline-flex items-center gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#features" className="btn-glass px-8 py-3.5 rounded-xl text-base font-medium inline-flex items-center gap-2">
                  Learn More
                </a>
              </div>
            </div>

            {/* Floating Dashboard Preview */}
            <div className="animate-fade-up-delay-2 hidden lg:block">
              <div className="animate-float">
                <div className="glass-card rounded-2xl p-6 relative" style={{ border: '1px solid rgba(78, 222, 163, 0.1)' }}>
                  {/* Mini Dashboard */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(78, 222, 163, 0.15)' }}>
                      <Zap className="h-4 w-4" style={{ color: '#4edea3' }} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: '#dae2fd' }}>Student Dashboard</div>
                      <div className="text-xs" style={{ color: '#86948a' }}>Real-time overview</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="rounded-xl p-4" style={{ background: 'rgba(34, 42, 61, 0.6)' }}>
                      <div className="text-2xl font-bold" style={{ color: '#4edea3' }}>9.2</div>
                      <div className="text-xs" style={{ color: '#86948a' }}>CGPA</div>
                    </div>
                    <div className="rounded-xl p-4" style={{ background: 'rgba(34, 42, 61, 0.6)' }}>
                      <div className="text-2xl font-bold" style={{ color: '#6ffbbe' }}>12</div>
                      <div className="text-xs" style={{ color: '#86948a' }}>Achievements</div>
                    </div>
                  </div>
                  {/* Mini Activity */}
                  <div className="space-y-2">
                    {['Research Paper', 'Hackathon Winner', 'Workshop'].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(19, 27, 46, 0.6)' }}>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3.5 w-3.5" style={{ color: '#4edea3' }} />
                          <span className="text-xs" style={{ color: '#b9c7e0' }}>{item}</span>
                        </div>
                        <span className="badge-approved text-xs px-2 py-0.5 rounded-full">Approved</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-fade-up">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#4edea3' }}>Features</p>
            <h2 className="text-3xl lg:text-4xl font-bold" style={{ color: '#dae2fd', letterSpacing: '-0.02em' }}>
              Empowering Your Academic Journey
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Award, title: "Achievement Tracking", desc: "Submit and manage your academic achievements with a streamlined, intuitive interface designed for researchers and students.", delay: "1" },
              { icon: BookOpen, title: "Portfolio Generation", desc: "Create professional portfolios automatically. Export high-fidelity digital resumes that showcase your verified milestones.", delay: "2" },
              { icon: Shield, title: "Faculty Verification", desc: "Get achievements verified directly by faculty members via secure, cryptographically signed credentials.", delay: "3" },
            ].map((feature, i) => (
              <div key={i} className={`glass-card rounded-2xl p-8 hover-lift animate-fade-up-delay-${feature.delay}`}>
                <div className="h-14 w-14 rounded-xl flex items-center justify-center mb-6"
                     style={{ background: 'rgba(78, 222, 163, 0.1)', border: '1px solid rgba(78, 222, 163, 0.1)' }}>
                  <feature.icon className="h-7 w-7" style={{ color: '#4edea3' }} />
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: '#dae2fd' }}>{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#86948a' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal Cards Section */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#4edea3' }}>Portals</p>
            <h2 className="text-3xl lg:text-4xl font-bold" style={{ color: '#dae2fd' }}>Access Your Dashboard</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: BookOpen, title: "Student Portal", desc: "Manage achievements, build portfolios, and track your academic journey", href: "/student", color: "#4edea3", features: ["Submit and track achievements", "Build professional portfolios", "View academic records"] },
              { icon: Users, title: "Faculty Portal", desc: "Verify achievements, mentor students, and manage academic oversight", href: "/faculty", color: "#b9c7e0", features: ["Verify student achievements", "Manage mentee profiles", "Data-driven mentorship"] },
              { icon: Shield, title: "Admin Portal", desc: "Manage users, generate reports, and oversee institutional operations", href: "/admin", color: "#fc7c78", features: ["Manage all users", "Generate NAAC/NIRF reports", "Institutional oversight"] },
            ].map((portal, i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden hover-lift">
                <div className="p-8">
                  <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-6"
                       style={{ background: `rgba(${portal.color === '#4edea3' ? '78,222,163' : portal.color === '#b9c7e0' ? '185,199,224' : '252,124,120'}, 0.1)` }}>
                    <portal.icon className="h-8 w-8" style={{ color: portal.color }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: '#dae2fd' }}>{portal.title}</h3>
                  <p className="text-sm mb-6" style={{ color: '#86948a' }}>{portal.desc}</p>

                  <div className="space-y-3 mb-8">
                    {portal.features.map((feat, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" style={{ color: portal.color }} />
                        <span className="text-sm" style={{ color: '#b9c7e0' }}>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <Link href={portal.href}
                        onClick={(e) => handlePortalAccess(e, portal.href)}
                        className="block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-300"
                        style={{
                          background: `rgba(${portal.color === '#4edea3' ? '78,222,163' : portal.color === '#b9c7e0' ? '185,199,224' : '252,124,120'}, 0.1)`,
                          color: portal.color,
                          border: `1px solid rgba(${portal.color === '#4edea3' ? '78,222,163' : portal.color === '#b9c7e0' ? '185,199,224' : '252,124,120'}, 0.15)`,
                        }}>
                    Enter {portal.title.split(' ')[0]} Portal
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section id="stats" className="py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-card rounded-2xl p-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "10K+", label: "Students" },
                { value: "50K+", label: "Achievements" },
                { value: "500+", label: "Faculty" },
                { value: "100+", label: "Departments" },
              ].map((stat, i) => (
                <div key={i} className="animate-count-up" style={{ animationDelay: `${i * 0.15}s` }}>
                  <div className="text-3xl lg:text-4xl font-extrabold mb-1" style={{ color: '#4edea3' }}>{stat.value}</div>
                  <div className="text-sm" style={{ color: '#86948a' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(78, 222, 163, 0.06) 0%, transparent 60%)' }} />
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#dae2fd' }}>
            Ready to Archive Your Legacy?
          </h2>
          <p className="text-lg mb-8" style={{ color: '#86948a' }}>
            Join thousands of students and researchers documenting their path to excellence.
          </p>
          <Link href="/auth/login" className="btn-glow px-10 py-4 rounded-xl text-base font-bold inline-flex items-center gap-2 animate-glow-pulse">
            Get Started Today <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6" style={{ borderTop: '1px solid rgba(78, 222, 163, 0.06)' }}>
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="AcadVault Logo" width={24} height={24} className="rounded-md" />
            <span className="text-sm font-semibold" style={{ color: '#dae2fd' }}>AcadVault</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="link-emerald text-xs" style={{ color: '#86948a' }}>Privacy Policy</a>
            <a href="#" className="link-emerald text-xs" style={{ color: '#86948a' }}>Terms of Service</a>
            <a href="#" className="link-emerald text-xs" style={{ color: '#86948a' }}>Support</a>
          </div>
          <div className="text-xs" style={{ color: '#3c4a42' }}>© 2025 AcadVault. All rights reserved <br /> Yashraj Rastogi.</div>
        </div>
      </footer>
    </div>
  )
}
