import './Button.css';

const Button = ({ label, onClick, cancel }) => {
  return (
    <div className='button-group'>
      <button
        className={`button ${cancel ? 'button-cancel' : 'button-primary'}`}
        onClick={onClick}
      >
        {label}
      </button>
    </div>
  );
};

export default Button;