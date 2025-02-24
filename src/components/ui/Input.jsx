import { forwardRef, useState } from "react";
import cn from "../../utilis/cn";

// Input variants
const inputVariants = {
  default: "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800",
  outline: "border-gray-200 dark:border-gray-700 bg-transparent",
  ghost: "border-transparent bg-gray-100 dark:bg-gray-800",
  underline:
    "border-0 border-b-2 border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus:border-blue-500 focus:outline-none",
};

// Input sizes
const inputSizes = {
  sm: "h-8 text-sm px-3",
  md: "h-10 text-base px-4",
  lg: "h-12 text-lg px-5",
};

// Input states
const inputStates = {
  error:
    "border-red-500 dark:border-red-400 focus:ring-border-500 dark:focus:border-red-400",
  success:
    "border-green-500 dark:border-green-400 focus:border-green-500 dark:focus:border-green-400",
  warning:
    "border-yellow-500 dark:border-yellow-400 focus:border-yellow-500 dark:focus:border-yellow-400",
};

export const Input = forwardRef(
  (
    {
      className,
      type = "text",
      variant = "default",
      size = "md",
      state,
      label,
      helperText,
      error,
      success,
      warning,
      required,
      disabled,
      loading,
      leftIcon,
      rightIcon,
      onClear,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const currentType = isPassword && showPassword ? "text" : type;

    // Determine input state
    let inputState = "";
    if (error || state === "error") inputState = inputStates.error;
    if (success || state === "success") inputState = inputStates.success;
    if (warning || state === "warning") inputState = inputStates.warning;

    // Helper/Error message
    const message = error || warning || helperText || success;

    return (
      <>
        {/* Label */}
        {label && (
          <label
            className={cn(
              "block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200",
              disabled && "opacity-50",
              error && "text-red-500 dark:text-red-400",
              success && "text-green-500 dark:text-green-400",
              warning && "text-yellow-500 dark:text-yellow-400"
            )}
          >
            {label}
            {required && (
              <span className="ml-1 text-red-500 dark:text-red-400">*</span>
            )}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 text-gray-400 -translate-y-1/2">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={currentType}
            disabled={disabled || loading}
            required={required}
            className={cn(
              // Base styles
              "w-full border rounded-lg transition-all duration-200",
              "placeholder:text-gray-400 dark:placeholder:text-gray-500",
              "disabled:opacity-50 disabled:cursor-not-allowed ",

              // Variants
              inputVariants[variant],
              // Sizes
              inputSizes[size],
              // States
              inputState,
              // Icon padding
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              // Clear button padding
              onClear && "pr-10",
              // Password toggle padding
              isPassword && "pr-10",
              // Custom classes
              className
            )}
            {...props}
          />

          {/* Loading spinner */}
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 rounded-full border-2 border-gray-200 animate-spin border-t-blue-500" />
            </div>
          )}

          {/* Clear button */}
          {onClear && !disabled && !loading && props.value && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 top-1/2 text-gray-400 -translate-y-1/2 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Clear input"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {/* Password toggle */}
          {isPassword && !loading && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 text-gray-400 -translate-y-1/2 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              )}
            </button>
          )}

          {/* Right Icon */}
          {rightIcon && !loading && !onClear && !isPassword && (
            <div className="absolute right-3 top-1/2 text-gray-400 -translate-y-1/2">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Helper/Error/Success/Warning text */}
        {message && (
          <p
            className={cn(
              "mt-2 text-sm",
              error && "text-red-500 dark:text-red-400",
              success && "text-green-500 dark:text-green-400",
              warning && "text-yellow-500 dark:text-yellow-400",
              !error &&
                !success &&
                !warning &&
                "text-gray-500 dark:text-gray-400"
            )}
          >
            {message}
          </p>
        )}
      </>
    );
  }
);

Input.displayName = "Input";
