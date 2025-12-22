import { useState, useCallback, useMemo } from 'react';

// IMPORTANT: Ensure your FastAPI server URL is correct
const API_BASE_URL = 'http://127.0.0.1:8000';

// Icons (using inline SVG for simplicity)
const EditIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil">
    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const UserIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-2">
    <circle cx="12" cy="7" r="5" />
    <path d="M17.8 19.2c-1.5-.7-3.2-1.2-5.8-1.2s-4.3.5-5.8 1.2" />
  </svg>
);

/**
 * Reusable component for displaying and editing the user's profile photo URL.
 * It expects the parent to pass a function via onPhotoChange to trigger a state update.
 * @param {{onPhotoChange: (newUrl: string) => void}} props
 */
export default function ProfilePictureEditor({ onPhotoChange }) {
  // Initial state derived from localStorage
  const initialUrl = localStorage.getItem('profile_photo_url') || '';
  
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(initialUrl);
  const [newPhotoUrlInput, setNewPhotoUrlInput] = useState(initialUrl);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', isError: false });

  const token = localStorage.getItem('access_token');
  
  // Custom placeholder for error state or missing URL
  const PhotoPlaceholder = useMemo(() => (
    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
      <UserIcon className="w-16 h-16" />
    </div>
  ), []);

  const handleUpdate = useCallback(async () => {
    if (!token) {
      setFeedback({ message: 'Authentication required to update photo.', isError: true });
      return;
    }
    
    // Simple validation to prevent empty submission (we allow null/empty string)
    const urlToSubmit = newPhotoUrlInput.trim();
    
    setIsLoading(true);
    setFeedback({ message: '', isError: false });

    try {
      const response = await fetch(`${API_BASE_URL}/update_profile_photo`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        // Backend expects a JSON body with the URL embedded
        body: JSON.stringify({ photo_url: urlToSubmit }),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUrl = data.profile_photo_url || '';
        
        // 1. Update Local Storage (Step 3 implementation)
        if (updatedUrl) {
          localStorage.setItem('profile_photo_url', updatedUrl);
        } else {
          localStorage.removeItem('profile_photo_url');
        }

        // 2. Update local state
        setCurrentPhotoUrl(updatedUrl);
        setNewPhotoUrlInput(updatedUrl);
        setFeedback({ message: 'Photo URL updated successfully!', isError: false });
        
        // 3. Notify parent component
        onPhotoChange(updatedUrl);
        
        // Close modal after a short delay
        setTimeout(() => setShowModal(false), 1500);

      } else {
        const errorMessage = data.detail || 'Failed to update photo URL.';
        setFeedback({ message: errorMessage, isError: true });
      }

    } catch (error) {
      console.error("Profile Update Error:", error);
      setFeedback({ 
        message: `Connection failed: ${error.message}`, 
        isError: true 
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, newPhotoUrlInput, onPhotoChange]);


  // Handles image loading errors (e.g., if the URL is broken)
  const handleImageError = useCallback(() => {
    // If the image fails to load, remove the current broken URL and force placeholder display
    // Note: We don't update the backend here, only the front-end display
    if (currentPhotoUrl) {
      setCurrentPhotoUrl('');
    }
  }, [currentPhotoUrl]);

  return (
    <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto group">
      {/* Photo Display Area */}
      <div className="w-full h-full rounded-full overflow-hidden border-4 border-indigo-500 shadow-xl bg-white transition-all duration-300 transform group-hover:scale-[1.03]">
        {currentPhotoUrl ? (
          <img
            src={currentPhotoUrl}
            alt="Profile"
            className="w-full h-full object-cover transition-opacity duration-500"
            onError={handleImageError}
            // Use a fallback to ensure placeholder is shown if loading fails
            onLoad={(e) => e.target.style.opacity = 1} 
            style={{ opacity: 0 }} // Start invisible until loaded
          />
        ) : (
          PhotoPlaceholder
        )}
      </div>

      {/* Edit Button Overlay */}
      <button
        type="button"
        onClick={() => {
          setNewPhotoUrlInput(currentPhotoUrl); // Reset input value to current URL when opening
          setFeedback({ message: '', isError: false }); // Clear feedback
          setShowModal(true);
        }}
        className="absolute bottom-0 right-0 p-3 bg-indigo-600 text-white rounded-full shadow-lg border-2 border-white transition-all duration-300 opacity-90 hover:opacity-100 hover:bg-indigo-700 active:scale-95 transform translate-y-1/4 group-hover:translate-y-0"
        aria-label="Change profile picture"
      >
        <EditIcon className="w-5 h-5" />
      </button>

      {/* Modal for Editing */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 sm:p-8 space-y-6 transform scale-100 transition-all duration-300"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <h3 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
              Update Profile Photo
            </h3>

            {/* Input Field */}
            <div className="space-y-2">
              <label htmlFor="photo-url" className="block text-sm font-medium text-gray-700">
                Image URL (e.g., from an image hosting service)
              </label>
              <input
                id="photo-url"
                type="url"
                value={newPhotoUrlInput}
                onChange={(e) => setNewPhotoUrlInput(e.target.value)}
                placeholder="https://example.com/new-photo.jpg (or leave empty to remove)"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                disabled={isLoading}
              />
            </div>
            
            {/* Feedback Message */}
            {feedback.message && (
              <div 
                role="alert"
                className={`p-3 rounded-lg text-sm font-semibold border ${feedback.isError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}
              >
                {feedback.message}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-xl text-gray-700 border border-gray-300 bg-white hover:bg-gray-50 transition-colors duration-150 disabled:opacity-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                disabled={isLoading}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow-md transition-all duration-200 hover:bg-indigo-700 active:scale-98 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 disabled:cursor-wait"
              > 
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="60"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : 'Save Changes'} 
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
