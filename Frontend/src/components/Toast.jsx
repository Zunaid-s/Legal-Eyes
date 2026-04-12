export default function Toast({ message, show }) {
  return (
    <div className={`ls-toast${show ? ' show' : ''}`}>
      {message}
    </div>
  );
}
