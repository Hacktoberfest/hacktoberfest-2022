const CheckRadio = ({ radio, title, message, ...props }) => {
  return (
    <div>
      <label>
        <input
          type={radio ? 'radio' : 'checkbox'}
          {...props}
        />
        {title}
        <i>{message}</i>
      </label>
    </div>
  );
};

export default CheckRadio;
