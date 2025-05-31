'use client';
import React from 'react'
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs';
function Signup() {
    return (
        <div>
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">

                    <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
                        Create a new account
                    </h2>
                    <p className="mt-2 text-center text-sm leading-5 text-gray-500 max-w">
                        Or
                    </p>
                    <h2 className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition ease-in-out duration-150">
                        login to your account
                    </h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form>
                            <div className="mt-6">
                                <SignedOut>
                                    <SignInButton>
                                        <button className="px-4 py-2 rounded-full border border-black bg-white text-sm font-medium hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:-translate-y-[1px] transition-all duration-200">
                                            Sign In
                                        </button>
                                    </SignInButton>
                                    <SignUpButton>
                                        <button className="px-4 py-2 rounded-full border border-black bg-black text-white text-sm font-medium hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:-translate-y-[1px] transition-all duration-200">
                                            Sign Up
                                        </button>
                                    </SignUpButton>
                                </SignedOut>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup