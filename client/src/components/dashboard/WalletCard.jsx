function WalletCard({ balance }) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">

            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        Available Balance
                    </p>

                    <h2 className="text-3xl font-bold text-green-600 mt-2">
                       ₹{Number(balance).toLocaleString("en-IN")}
                    </h2>
                </div>

                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-2xl"></span>
                </div>
            </div>

        </div>
    );
}

export default WalletCard;