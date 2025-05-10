
import { useEffect , useState} from 'react'
// Import the getMyInfo function from the local apis/auth file (used to get user info from the server)
import { getMyInfo } from '../apis/auth';
// Import the ResponseMyInfoDto type definition from the local types/auth file (describes the shape of the user info data)
import { ResponseMyInfoDto } from '../types/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const Mypage = () => {
    const {logout} =useAuth()
    const navigate = useNavigate();
    // The state can be either of type ResponseMyInfoDto or null (initially null)
    const [data, setData] = useState<ResponseMyInfoDto| null>(null);
    // Here, it runs only once after the component mounts (because of the empty dependency array)
    useEffect(() => {
        // Define an asynchronous function to fetch user info
        const getData = async () => {
            // Call the getMyInfo API function and wait for the response
            const response = await getMyInfo();
            console.log("API Response:", response);
            console.log(response);

            setData(response);
        };
        // Call the getData function to actually fetch the data
        getData();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    // Format date strings for display
    const formatDate = (dateString?: string | Date | null) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    // Render a styled user info card if data exists
    return (
        <div style={{
            maxWidth: '400px',
            margin: '40px auto',
            padding: '24px',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            background: '#fafbfc',
            fontFamily: 'sans-serif',
        }}>
            <h2 style={{marginBottom: '16px'}}>My Profile</h2>
            <div><strong>Name:</strong> {data?.data?.name || '-'}</div>
            <div><strong>Email:</strong> {data?.data?.email || '-'}</div>
            <div><strong>Created At:</strong> {formatDate(data?.data?.createdAt)}</div>
            <div><strong>Updated At:</strong> {formatDate(data?.data?.updatedAt)}</div>
            <img src="/images/google.png" style={{ width: "30px", height: "30px" }} />
            <button className='cursor=pointer bg-blue-500 text-white px-4 py-2 rounded-md' onClick={handleLogout}>로그아웃</button>
        </div>
    );
}

// Export the Mypage component as the default export from this file
export default Mypage;
