import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";

function Login() {

    //navigate between pages
    const navigate = useNavigate();

    //Instead of writing lots of useState() code, React Hook Form manages the form.
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();


    // onsubmit
    const onSubmit = async (data) => {
        try {
            const response = await api.post("/auth/login", data);


            localStorage.setItem("token", response.data.token);

            toast.success("Login Successful");
            navigate("/dashboard");
    
        } catch (error) {
            console.log("Error:", error.response.data);

            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-xl p-8">

                {/* Heading */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-green-400">
                        TradeSphere AI
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Smart Investing & Personal Finance
                    </p>
                </div>

                {/* Login Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >

                    {/* Email */}
                    <input
                        type="email"
                        placeholder="Enter your email"
                        {...register("email", {
                            required: "Email is required",
                        })}
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-green-500"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                        </p>
                    )}

                    {/* Password */}
                    <input
                        type="password"
                        placeholder="Enter your password"
                        {...register("password", {
                            required: "Password is required",
                        })}
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-green-500"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.password.message}
                        </p>
                    )}

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>

                </form>

                {/* Register Link */}
                <div className="text-center mt-6 text-slate-400">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-green-400 hover:underline"
                    >
                        Register
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default Login;