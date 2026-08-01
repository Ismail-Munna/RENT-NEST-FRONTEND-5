"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { registerAction } from "../_actions/authActions";
import { User, Mail, Phone, KeyRound, ArrowRight, Loader2, Home, UserCheck } from "lucide-react";

const RegisterForm = () => {
    const [state, action, pending] = useActionState(registerAction, {});
    const [role, setRole] = useState<"TENANT" | "LANDLORD">("TENANT");

    useEffect(() => {
        if (!state) return;
        if (state.success === false && state.message) {
            toast.error(state.message || "Registration failed.");
        }
    }, [state]);

    return (
        <Card className="p-6 shadow-xl border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
            <form action={action} className="space-y-4">
                <input type="hidden" name="role" value={role} />

                {/* Role Selector */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">I want to</Label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setRole("TENANT")}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 text-sm font-medium transition-all cursor-pointer ${
                                role === "TENANT"
                                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400"
                            }`}
                        >
                            <UserCheck className="h-5 w-5 mb-1" />
                            Rent a Home (Tenant)
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole("LANDLORD")}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 text-sm font-medium transition-all cursor-pointer ${
                                role === "LANDLORD"
                                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400"
                            }`}
                        >
                            <Home className="h-5 w-5 mb-1" />
                            List Properties (Landlord)
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                        Full Name
                    </Label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            className="pl-9"
                            required
                        />
                    </div>
                </div>

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
                    <Label htmlFor="phone" className="text-sm font-medium">
                        Phone Number (Optional)
                    </Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                        Password
                    </Label>
                    <div className="relative">
                        <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Create a strong password"
                            className="pl-9"
                            minLength={6}
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
                            Creating Account...
                        </>
                    ) : (
                        <>
                            Create Account <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>

                <div className="text-center pt-2 text-sm text-slate-500">
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-blue-600 hover:underline">
                        Log in
                    </Link>
                </div>
            </form>
        </Card>
    );
};

export default RegisterForm;
