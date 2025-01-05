import React, { useState, useRef } from "react";
import "./PhotoUpload.css";

const PhotoUpload = () => {
  const [images, setImages] = useState([]);
  const fileInputRef = useRef();

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prevImages) => [...prevImages, ...newImages].slice(0, 10)); // 최대 10개 제한
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div className="photo-upload-container">
      <label className="photo-upload-label">사진 업로드</label>
      <div className="photo-upload-grid">
        {images.map((img, index) => (
          <div key={index} className="photo-preview">
            <img src={img.preview} alt={`Preview ${index}`} />
            <button
              type="button"
              className="photo-delete-button"
              onClick={() => removeImage(index)}
            >
              &times;
            </button>
          </div>
        ))}
        {images.length < 10 && (
          <button
            type="button"
            className="photo-add-button"
            onClick={() => fileInputRef.current.click()}
          >
            +
          </button>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
    </div>
  );
};

export default PhotoUpload;
