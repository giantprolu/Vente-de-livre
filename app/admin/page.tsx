export const dynamic = "force-dynamic"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getAllOrders } from "@/lib/db"
import AdminDashboard from "@/components/admin-dashboard"

export default async function AdminPage() {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get("admin_authenticated")?.value === "true"

  if (!isAuthenticated) {
    redirect("/admin/login")
  }

  const orders = await getAllOrders()

  return <AdminDashboard orders={orders} />
}
