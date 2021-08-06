import React from 'react'

function Label({ label, isRequired }) {
  return (
    <label className="label">
      {label}
      {isRequired && <span style={{ color: 'red' }}>*</span>}
    </label>
  )
}

function Error({ touched, error }) {
  return (
    <div>
      <div className="error">{touched && error}</div>
    </div>
  )
}

export default function Input({
  type, // input (detfault) ou textarea
  label, // label (opcional)
  name, // identificador
  placeholder,
  values,
  onChange,
  onBlur,
  isRequired,
  touched,
  errors
}) {
  const commonProps = {
    name,
    value: values[name],
    placeholder,
    onChange,
    onBlur,
    className: errors[name] ? 'input-error' : ''
  }
  return (
    <div className="form-item">
      <Label label={label} isRequired={isRequired} />
      <div>
        {
          {
            input: <input type="text" {...commonProps} />,
            textarea: <textarea rows="4" {...commonProps} />
          }[type || 'input']
        }
        <Error touched={touched[name]} error={errors[name]} />
      </div>
    </div>
  )
}
