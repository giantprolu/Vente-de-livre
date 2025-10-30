import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import AdminLogin from "@/components/admin-login"

export default async function AdminLoginPage() {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get("admin_authenticated")?.value === "true"

  if (isAuthenticated) {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <AdminLogin />
    </div>
  )
}
