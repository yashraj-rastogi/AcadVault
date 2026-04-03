import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 aurora-bg relative" style={{ background: '#0b1326' }}>
      {/* Aurora glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl pointer-events-none"
           style={{ background: 'radial-gradient(ellipse, #4edea3 0%, transparent 70%)' }} />
      <LoginForm />
    </div>
  )
}
