"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { usePathname, useRouter } from 'next/navigation' // Import useRouter

function Header() {
    const path = usePathname();
    const router = useRouter(); // Initialize router for navigation

    useEffect(() => {
        console.log(path)
    }, [path]);

    return (
        <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
            <Image src={'/logo.png'} width={160} height={100} alt='logo' />

            <ul className='hidden md:flex gap-6'>
                <li 
                    className={`hover:text-primary hover:font-bold transition-all cursor-pointer
                    ${path === '/dashboard' && 'text-primary font-bold'}
                    `}
                    onClick={() => router.push('/dashboard')} // Navigate on click
                >
                    Dashboard
                </li>

                <li 
                    className={`hover:text-primary hover:font-bold transition-all cursor-pointer
                    ${path === '/dashboard/questions' && 'text-primary font-bold'}
                    `}
                    onClick={() => router.push('/dashboard/questions')} // Navigate on click
                >
                    Question
                </li>

                <li 
                    className={`hover:text-primary hover:font-bold transition-all cursor-pointer
                    ${path === '/dashboard/upgrade' && 'text-primary font-bold'}
                    `}
                    onClick={() => router.push('/dashboard/upgrade')} // Navigate on click
                >
                    Upgrade
                </li>

                <li 
                    className={`hover:text-primary hover:font-bold transition-all cursor-pointer
                    ${path === '/dashboard/how' && 'text-primary font-bold'}
                    `}
                    onClick={() => router.push('/dashboard/how')} // Navigate on click
                >
                    How it Works?
                </li>
            </ul>

            <UserButton />
        </div>
    );
}

export default Header;
