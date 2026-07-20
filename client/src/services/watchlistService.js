import api from "./api";

export const addToWatchlist = async (symbol, companyName) => {
  const response = await api.post("/watchlist", {
    symbol,
    companyName,
  });

  return response.data;
};

export const getWatchlist = async () => {
  const response = await api.get("/watchlist");
  return response.data;
};

export const removeFromWatchlist = async (symbol) => {
  const response = await api.delete(`/watchlist/${symbol}`);
  return response.data;
};
