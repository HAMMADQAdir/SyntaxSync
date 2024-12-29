 const Dialog = ({ user, onAdmit, onClose }) => {
  return (
    <div className="fixed bottom-4 left-4 bg-white shadow-md rounded-lg p-4 border border-gray-200">
      <p className="text-gray-800">
        <strong>{user}</strong> has joined the room.
      </p>
      <div className="flex gap-2 mt-2">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          onClick={onAdmit}>
          Admit
        </button>
        <button
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Dialog