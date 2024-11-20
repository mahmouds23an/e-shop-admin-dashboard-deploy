/* eslint-disable react/prop-types */
const ImageModal = ({ imageSrc, onClose }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div className="relative">
        <img
          src={imageSrc}
          alt="Enlarged Product"
          className="max-w-[90vw] max-h-[80vh] w-auto h-auto object-contain rounded-lg shadow-lg"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white text-black rounded-full p-1"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
