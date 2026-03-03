import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);
    const [show, setShow] = useState(false);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    const isPassword = type === 'password';
    const inputType = isPassword ? (show ? 'text' : 'password') : type;

    return (
        <div className={`relative group ${className}`}>
            <input
                {...props}
                type={inputType}
                className={
                    'rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-300 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-300 w-full ' +
                    (isPassword ? 'pr-12 ' : '')
                }
                ref={localRef}
            />
            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all duration-200"
                    tabIndex="-1"
                >
                    {show ? (
                        <EyeOff className="w-5 h-5" />
                    ) : (
                        <Eye className="w-5 h-5" />
                    )}
                </button>
            )}
        </div>
    );
});
