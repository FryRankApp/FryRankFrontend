const colorClass = {
    danger: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-white text-slate-900 hover:bg-slate-100 border border-slate-300",
    primary: "bg-slate-900 text-white hover:bg-slate-700"
};

const Button = ({ children, color = "primary", onClick, disabled, type = "button", className = "" }) => {
    return (
        <button
            type={type}
            className={`my-2 mr-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition ${colorClass[color] || colorClass.primary} ${disabled ? "cursor-not-allowed opacity-60" : ""} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
