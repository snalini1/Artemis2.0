import { redirect } from "next/navigation";

export default function Home() {
  // Automatically redirect to the profile page
  redirect("/ProfilePage");
}
