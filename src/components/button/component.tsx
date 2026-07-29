import './button.css';

export type ButtonProps = {
  variant?: 'primary' | 'primary-dark' | 'secondary' | 'secondary-dark';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  className,
  children,
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`button ${variant} ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
