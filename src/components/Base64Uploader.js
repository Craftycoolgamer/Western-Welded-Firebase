import { useState } from 'react';
import './Base64Uploader.css';

function Base64Uploader({ onImageUpload, currentImage }) {
  const [preview, setPreview] = useState(currentImage || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image
    if (!file.type.match('image.*')) {
      alert('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        return 'Only JPEG, PNG, or WebP images are allowed';
    }

    // Limit to 2MB (free Firebase Realtime Database has 1MB/node limit)
    if (file.size > 2 * 1024 * 1024) {
      alert('Please select an image smaller than 2MB');
      return;
    }

    setIsLoading(true);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setPreview(base64String);
      onImageUpload(base64String);
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreview('');
    onImageUpload('');
  };

  return (
    <div className="base64-uploader">
      {preview ? (
        <div className="image-preview-container">
          <img 
            src={preview} 
            alt="Preview" 
            className="image-preview"
          />
          <div className="image-actions">
            <label className="change-image-btn">
              Change Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
            </label>
            <label className="remove-image-btn">
              Remove
              <input
                type="click"
                accept="image/*"
                onClick={handleRemoveImage}
                className="file-input"
              />
            </label>
            {/* <button 
              className="remove-image-btn"
              onClick={handleRemoveImage}
            >
              Remove
            </button> */}
          </div>
        </div>
      ) : (
        <label className="upload-label input-field">
          {isLoading ? 'Processing...' : 'Upload Image'}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isLoading}
            className="file-input"
          />
        </label>
      )}
    </div>
  );
}

export default Base64Uploader;