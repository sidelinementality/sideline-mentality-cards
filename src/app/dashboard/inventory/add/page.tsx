import { redirect } from "next/navigation";

export default function AddCardPage() {
  redirect("/dashboard/inventory/new");
}