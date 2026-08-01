"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { loginAction } from "../_actions/authActions";
import { KeyRound, Mail, ArrowRight, Loader2 } from "lucide-react";

const LoginForm = () => {
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") ?? "";
    const [state, action, pending] = useActionState(loginAction.bind(null, redirectTo), {});

    useEffect(() => {
        if (!state) return;
        if (state.success === false && state.message) {
            toast.error(state.message || "Login failed. Please check your credentials.");
        }
    }, [state]);

    return (
        <Card className="p-6 shadow-xl border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
            <form action={action} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                    </Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            className="pl-9"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-medium">
                            Password
                        </Label>
                    </div>
                    <div className="relative">
                        <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-9"
                            required
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={pending}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 shadow-md transition-all cursor-pointer"
                >
                    {pending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Logging in...
                        </>
                    ) : (
                        <>
                            Log In <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>

                <div className="text-center pt-2 text-sm text-slate-500">
                    Don't have an account?{" "}
                    <Link href="/register" className="font-semibold text-blue-600 hover:underline">
                        Create one now
                    </Link>
                </div>
            </form>
        </Card>
    );
};

export default LoginForm;