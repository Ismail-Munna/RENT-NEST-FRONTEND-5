import RegisterForm from "../_components/RegisterForm";

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-slate-900">
            <div className="w-full max-w-md space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Join RentNest
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Create an account to browse properties or list your rental homes
                    </p>
                </div>
                <RegisterForm />
            </div>
        </div>
    );
}