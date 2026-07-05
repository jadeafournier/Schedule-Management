export default function DialogCloseButton({ onClick, disabled = false, label = 'Close dialog' }) {
  return (
    <button
      type="button"
      className="icon-button dialog-close-button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title="Close"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-button-svg">
        <path
          fill="currentColor"
          d="M6.225 4.811a1 1 0 0 1 1.414 0L12 9.172l4.361-4.361a1 1 0 1 1 1.414 1.414L13.414 10.586l4.361 4.361a1 1 0 0 1-1.414 1.414L12 12l-4.361 4.361a1 1 0 0 1-1.414-1.414l4.361-4.361-4.361-4.361a1 1 0 0 1 0-1.414Z"
        />
      </svg>
    </button>
  );
}
