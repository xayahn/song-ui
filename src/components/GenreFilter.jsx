export default function GenreFilter({ genres = [], onGenreSelect, selectedGenre }) {
  if (genres.length === 0) {
    return <div className="text-gray-400 text-sm">No genres available</div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onGenreSelect(null)}
        className={`px-4 py-2 rounded transition text-sm ${
          selectedGenre === null
            ? 'bg-green-500 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        All Genres
      </button>
      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => onGenreSelect(genre)}
          className={`px-4 py-2 rounded transition text-sm ${
            selectedGenre === genre
              ? 'bg-green-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}