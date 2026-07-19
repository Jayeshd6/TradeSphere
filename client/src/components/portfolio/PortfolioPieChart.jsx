import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const COLORS = [
    "#2563eb",
    "#16a34a",
    "#dc2626",
    "#f59e0b",
    "#9333ea",
    "#0891b2",
    "#ea580c",
    "#4f46e5",
];

function PortfolioPieChart({ portfolios }) {
    // Convert portfolio data into chart data
    const data = portfolios.map((stock) => ({
        name: stock.symbol,
        value: stock.currentValue,
    }));

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">
                    Portfolio Allocation
                </h2>

                <p className="text-slate-500">
                    No investments available to display.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">

            <h2 className="text-xl font-bold text-slate-800 mb-6">
                Portfolio Allocation
            </h2>

            <div className="h-96">

                <ResponsiveContainer width="100%" height="100%">

                    <PieChart>

                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={130}
                            innerRadius={70}
                            paddingAngle={3}
                            label={({ name, percent }) =>
                                `${name} ${(percent * 100).toFixed(1)}%`
                            }
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={index}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>

                        <Tooltip
                            formatter={(value) =>
                                `₹${Number(value).toLocaleString("en-IN")}`
                            }
                        />

                        <Legend />

                    </PieChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
}

export default PortfolioPieChart;