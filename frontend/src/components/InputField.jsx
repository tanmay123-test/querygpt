import { EyeIcon, EyeOffIcon } from './icons.jsx'

export default function InputField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  leftIcon,
  showToggle,
  showPassword,
  onTogglePassword,
}) {
  const inputType = showToggle ? (showPassword ? 'text' : 'password') : type

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-label">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtext">
            {leftIcon}
          </span>
        )}
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-lg border bg-input-bg py-2.5 text-sm text-heading outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary ${
            leftIcon ? 'pl-10' : 'px-3.5'
          } ${showToggle ? 'pr-10' : 'pr-3.5'} ${
            error ? 'border-error' : 'border-input-border'
          }`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-subtext hover:text-heading"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  )
}
