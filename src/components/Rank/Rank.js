const Rank = ({ name, entries }) => {
  return (
    <div>
      <div className="white f3">
        <p>{`${name}, your current entry count is ...`}</p>
      </div>
      {entries ? (
        <div className="white f3">{entries}</div>
      ) : (
        <div className="white f3">0</div>
      )}
    </div>
  );
};
export default Rank;
