
'use client'
import React, { FormEventHandler, useState } from 'react'
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useMyUser } from '@/store/users';
import axios from '@/helper/axios';
import route from '@/api/route';
// import { useAuth } from '@/store/auth'; 

const SignInForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [setMyUser] = useMyUser((state) => [state.setMyUser]);
    const router = useRouter();
    // const { setAuthStatus } = useAuth();
    
    const handleLogin = async () => {
        if (!email || !password) {
        setError('Please fill in all fields');
        return;
        }
        try {
        const response = await axios.post(`${route.serverURL}/auth/login`, {
            email: email,
            password: password
        });
        if (response.status === 200) {
            setMyUser({
            id: response.data.id,
            full_name: response.data.full_name,
            email: response.data.email,
            isUserVisible: response.data.isUserVisible,
            type: response.data.type,
            token: response.data.token
            });
            console.log('a');
            
            window.location.href = '/';
        }
        } catch (error: any) {
        let errorMessage = 'Login failed';
        if (error && error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        }
        setError(errorMessage);
        }
    }

    return (
        <div className='w-[100%]'>
            <form
                className="flex flex-col gap-[20px] w-[100%] items-center"
                >
                <div className="flex flex-col gap-[10px] w-[100%]">
                    <Input type="email" name='email' placeholder="Email" className="w-[100%]" onChange={(e) => setEmail(e.target.value)} />
                    <Input type="password" name='password' placeholder="Password" className="w-[100%]" onChange={(e) => setPassword(e.target.value)} />
                </div>
                {/* <div>
                    <Button
                        className='bg-transparent text-black hover:bg-transparent hover:text-[var(--dark-blue)]'
                        type="button"
                    >Forgot your password?</Button>
                </div> */}
                <Button
                    type="button"
                    onClick={handleLogin}
                    className={"w-[100%] bg-[var(--dark-blue)]"}
                >Sign in</Button> 
            </form>
        </div>
    )
}

export default SignInForm
