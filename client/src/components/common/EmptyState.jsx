import { Link } from "react-router-dom";

function EmptyState({
  icon,
  title,
  description,
  buttonText,
  buttonLink,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-10 flex flex-col items-center justify-center text-center border border-slate-100 max-w-xl mx-auto my-8">
      <div className="text-5xl mb-4">
        {icon}
      </div>
      <h2 className="text-xl font-black text-slate-800">
        {title}
      </h2>
      <p className="text-slate-500 mt-2 text-xs font-semibold max-w-sm leading-relaxed">
        {description}
      </p>
      {buttonText && buttonLink && (
        <Link
          to={buttonLink}
          className="mt-5 bg-green-600 hover:bg-green-700 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-lg shadow-green-600/10 transition-all text-xs"
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
}

export default EmptyState;
