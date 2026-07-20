import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

function StockCard({ stock }) {
    const [quote, setQuote] = useState(null);

    useEffect(() => {
        if (!stock) return;

        const fetchQuote = async () => {
            try {
                const response = await api.get(
                    `/stocks/quote/${stock.symbol}`
                );

                setQuote(response.data.quote);

            } catch (error) {
                toast.error("Failed to fetch stock quote");
            }
        };

        fetchQuote();
    }, [stock]);

    if (!stock) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8">

            <h2 className="text-3xl font-bold">
                {stock.symbol}
            </h2>

            <p className="text-slate-500 mb-6">
                {stock.description}
            </p>

            {quote ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                    <div>
                        <p className="text-slate-500 text-sm">
                            Current Price
                        </p>

                        <h3 className="text-2xl font-bold">
                            ₹{quote.c}
                        </h3>
                    </div>

                    <div>
                        <p className="text-slate-500 text-sm">
                            High
                        </p>

                        <h3 className="text-xl font-semibold">
                            ₹{quote.h}
                        </h3>
                    </div>

                    <div>
                        <p className="text-slate-500 text-sm">
                            Low
                        </p>

                        <h3 className="text-xl font-semibold">
                            ₹{quote.l}
                        </h3>
                    </div>

                    <div>
                        <p className="text-slate-500 text-sm">
                            Previous Close
                        </p>

                        <h3 className="text-xl font-semibold">
                            ₹{quote.pc}
                        </h3>
                    </div>

                </div>
            ) : (
                <p>Loading...</p>
            )}

        </div>
    );
}

export default StockCard;
