import useAuth from "../../hooks/useAuth";

function WelcomeBanner() {
    const { user } = useAuth();

    const hour = new Date().getHours();

    let greeting = "";

    if (hour < 12) {
        greeting = "Good Morning ☀️";
    } else if (hour < 18) {
        greeting = "Good Afternoon 🌤️";
    } else {
        greeting = "Good Evening 🌙";
    }

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">

            <p className="text-lg text-slate-500">
                {greeting}
            </p>

            <h1 className="text-3xl font-bold text-slate-800 mt-2">
                Welcome back, {user?.fullName}!
            </h1>

            <p className="text-slate-500 mt-2">
                Here's your financial summary for today.
            </p>

            <p className="text-sm text-slate-400 mt-4">
                {today}
            </p>

        </div>
    );
}

export default WelcomeBanner;