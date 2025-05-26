// Import the function to send a sign-in request to the server
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
// Import a custom hook for form handling
import useForm  from '../hooks/useForm.ts';
import { UserSigninInformation , validateSignin} from '../utils/validate.ts';
import { useEffect, useState } from 'react'; // Import useState for password visibility
import { useLogin } from "../hooks/mutations/useLogin.ts";
import PageLayout from "../components/PageLayout";

// Define the LoginPage functional component
const LoginPage = () => {
    const {login, accessToken} = useAuth();
    const navigate = useNavigate();
    const { setTokens } = useAuth(); // 예: 토큰 저장 함수
    const loginMutation = useLogin();

    useEffect(() => {
        if (accessToken) {
            navigate('/')
        }
    }, [accessToken, navigate])

    
    const { values, errors, touched , getInputProps} = 
        useForm<UserSigninInformation>({
        initialValue: {
            email: '', // Initial value for email input
            password: '' // Initial value for password input
        },
        validate: validateSignin, // Validation function for the form
    });

    // State to control whether the password is visible or hidden
    const [showPassword, setShowPassword] = useState(false);

    // Function to handle form submission
    const handleSubmit = async () => {
        try {
            const data = await loginMutation.mutateAsync({ email: values.email, password: values.password });
            // 예: data.data.accessToken, data.data.refreshToken 등
            setTokens(data.data.accessToken, data.data.refreshToken);
            navigate("/");
        } catch (error) {
            alert("로그인에 실패했습니다.");
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
    };

    // Determine if the login button should be disabled
    // Disabled if there are any errors or if any value is empty
    const isDisabled = 
    Object.values(errors || {}).some((error) => error.length > 0) || 
    Object.values(values).some((value) => value === "");

    // Render the login form
    return (
        <PageLayout>
            <div className='flex flex-col items-center justify-center h-full gap-4'>
                <div className='flex flex-col gap-3'>
                    {/* Email input field */}
                    <input 
                        {...getInputProps('email')}
                        name="email"
                        className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                            ${errors?.email && touched?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                        type={"email"}
                        placeholder="이메일"
                    />
                    {/* Show error message for email if any */}
                    {errors?.email && touched?.email && (
                        <div className='text-red-500 text-sm'>{errors.email}</div>
                    )}
                   
                    {/* Password input field with show/hide button */}
                    <div style={{ position: 'relative', width: 300 }}>
                      <input
                        {...getInputProps('password')}
                        name="password"
                        className={'border border-[#ccc] w-full p-[10px] focus:border-[#807bff] rounded-sm pr-12'}
                        id="password-input"
                        type={showPassword ? "text" : "password"}
                        placeholder="비밀번호"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        style={{
                          position: 'absolute',
                          right: 8,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          fontSize: 16
                        }}
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? '🔓' : '🔒'}
                      </button>
                    </div>
                    {/* Show error message for password if any */}
                    {errors?.password && touched?.password && (
                            <div className="text-red-500 text-sm">{errors.password}</div>
                            )}
                    {/* Login button */}
                    <button type="button"
                    onClick={handleSubmit}
                    disabled={isDisabled}
                    className='w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors curosor-pointer disabled:bg-gray-300'
                    >
                        로그인
                    </button>
                    <button
                    type='button'
                    onClick = {handleGoogleLogin}
                        className='w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors curosor-pointer disabled:bg-gray-300'
                    >
                    <div className='flex items-center justify-center gap-4'>
                    <img src="/images/google.png" style={{ width: "30px", height: "30px" }} />
                        <span>구글 로그인</span>
                    </div>
                    </button>
                </div>
            </div>
        </PageLayout>
    ); 
};

// Export the LoginPage component so it can be used in other files
export default LoginPage;
