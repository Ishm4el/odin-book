export default function SearchForm(dispatch: {
  setInput: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <form>
      <search>
        <input
          type="search"
          placeholder="Search Following"
          className="my-1 border p-1"
          onInput={(e) => dispatch.setInput(e.currentTarget.value)}
        />
      </search>
    </form>
  );
}
