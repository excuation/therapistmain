import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = ({ setProfilePicture }) => {
    const [user, setUser] = useState({});
    const [profilePicture, setProfilePictureLocal] = useState('');
    const [file, setFile] = useState(null);

    // Fetch user profile on component mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setUser(response.data);
                setProfilePictureLocal(response.data.profilePicture);
                setProfilePicture(response.data.profilePicture); // Set initial profile picture in header
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchUserProfile();
    }, [setProfilePicture]); // Add setProfilePicture to dependencies

    // Handle file input change
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Handle profile picture upload
    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('profilePicture', file);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/upload-profile-picture', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setProfilePictureLocal(response.data.profilePicture);
            setProfilePicture(response.data.profilePicture); // Update header with new profile picture
        } catch (error) {
            console.error('Error uploading profile picture:', error.response?.data?.msg || error.message);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#FAEBEB' }}>
            <h2>{user.name}'s Profile</h2>
            <div style={{ margin: '20px 0' }}>
                {profilePicture ? (
                    <img
                        src={`http://localhost:5000/${profilePicture}`} // Ensure this matches your backend URL structure
                        alt="Profile"
                        style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                ) : (
                    <p>No profile picture uploaded</p>
                )}
            </div>

            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>

            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} style={{ marginTop: '10px' }}>Upload Profile Picture</button>
        </div>
    );
};

export default Profile;