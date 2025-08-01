import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    gender: "",
  });
  const [originalEmail, setOriginalEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
    const API_URL = import.meta.env.VITE_API_URL;


  const getUserDetails = async () => {
    if (user?.email) {
      try {
        const res = await axios.post(`${API_URL}/api/users/get-user`, {
          email: user.email,
        });
        setProfileData(res.data);
        setNewEmail(res.data.email);
        setOriginalEmail(res.data.email);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }
  };

  useEffect(() => {
    getUserDetails();
  }, [user]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const isChanged = (
    profileData.firstName !== user.firstName ||
    profileData.lastName !== user.lastName ||
    profileData.mobile !== user.mobile ||
    profileData.gender !== user.gender ||
    newEmail !== originalEmail ||
    newPassword
  );

  const handleUpdate = async () => {
    if (!newEmail.trim()) {
      return alert("Email cannot be empty");
    }

    if (newPassword && newPassword !== confirmPassword) {
      return alert("New password and confirm password do not match!");
    }

    try {
      const updateData = {
        _id: profileData._id, // required for the backend to locate user
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        mobile: profileData.mobile,
        gender: profileData.gender,
        email: newEmail.trim(),
      };

      if (newPassword) {
        updateData.password = newPassword;
      }

      await axios.put(`${API_URL}/api/users/update-user`, updateData);

      alert("Profile Updated Successfully!");
      setNewPassword("");
      setConfirmPassword("");

      const sensitiveChanged = newEmail !== user.email || newPassword;

      if (sensitiveChanged) {
        alert("Email or password changed. Please login again.");
        onLogout();
        navigate("/login");
      } else {
        getUserDetails();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Unknown error occurred";
      alert("Error updating profile: " + errorMsg);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Profile</h2>

      <div style={{ marginBottom: '20px' }}>
        <input
          name="firstName"
          value={profileData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <input
          name="lastName"
          value={profileData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <input
          name="mobile"
          value={profileData.mobile}
          onChange={handleChange}
          placeholder="Mobile"
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <select
          name="gender"
          value={profileData.gender}
          onChange={handleChange}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input
          name="email"
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Email"
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />

        <input
          name="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password (leave blank to keep current)"
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />

        <input
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm New Password"
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleUpdate}
            disabled={!isChanged}
            style={{
              padding: '10px 20px',
              backgroundColor: isChanged ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isChanged ? 'pointer' : 'not-allowed'
            }}
          >
            Update Profile
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
