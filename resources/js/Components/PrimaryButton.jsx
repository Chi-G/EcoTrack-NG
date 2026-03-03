export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-xl bg-emerald-grad px-6 py-3 text-sm font-bold text-white transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover-scale focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${disabled && 'opacity-50 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
