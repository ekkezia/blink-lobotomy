const GameForm = ({ isOpen, onSubmit }) => {
  return (
    <div>
      <label>Name </label>
      <input aria-label="Name"></input>
      <button type="button" onClick={onSubmit}>
        {isOpen ? "Stop" : "Submit & Start Game"}
      </button>
    </div>
  );
};

export default GameForm;
