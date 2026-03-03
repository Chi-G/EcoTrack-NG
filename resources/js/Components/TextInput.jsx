import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-300 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-300 ' +
                className
            }
            ref={localRef}
        />
    );
});
