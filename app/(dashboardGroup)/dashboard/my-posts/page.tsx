import { redirect } from "next/navigation";

export default function MyPostsRedirect() {
    redirect("/dashboard/tenant");
}
