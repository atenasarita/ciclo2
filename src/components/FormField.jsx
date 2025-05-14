export default function FormField({
  label,
  id,
  type = 'text',
  value,
  onChange,
  disabled = false,
  className = 'field'   
}) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <input
        className={className}
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required
      />
    </div>
  );
}
