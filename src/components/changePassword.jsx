import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatePassword } from '../store/slice/UserSlice';
import { FaKey } from 'react-icons/fa6';
import { useToast } from '@chakra-ui/react';

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const dispatch = useDispatch();
  const toast = useToast();

  const handleChangePassword = () => {
    // Fetch the userData from local storage
    const userDataString = localStorage.getItem("userData");
    const userData = userDataString ? JSON.parse(userDataString) : null;
    const employee_id = userData ? userData.employee_id : null;

    if (employee_id && newPassword) {
      dispatch(updatePassword({ employee_id, newPassword }));
      toast({
        title: 'Password Changed.',
        description: "User password changed successfully",
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      setNewPassword(''); // Clear the input after dispatching
    } else {
      alert("User data is not available. Please log in.");
    }
  };


  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
      margin: '40px auto',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    },
    input: {
      width: '100%',
      padding: '10px',
      margin: '10px 0',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    button: {
      padding: '10px 20px',
      fontSize: '16px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '10px',
    },
    title: {
      color: '#333',
      fontSize: "24px",
      fontWeight: "bold",
      display: "flex",
      gap: "10px",
      alignItems: "center",
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title} className='mb-4'><FaKey /> Change Password</h2>
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleChangePassword} style={styles.button}>
        Change Password
      </button>
    </div>
  );
};




export default ChangePassword;
