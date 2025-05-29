'use client';
import React from 'react'

function LogintoClient() {
    return (
        <div>login into Client then only oy can get access
            <div className="py-8 px-4 mx-auto sm:py-16 lg:px-6 bg-green-50 mt-40">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h2 className="mb-4 text-3xl tracking-tight font-bold leading-tight text-green-800">Start login With Your Client</h2>
                    <p className="mb-6 text-green-700 md:text-lg">login into Client then only oy can get access</p>


                    <a href="/"
                        className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-green-700 focus:ring-green-500 ">
                        Go to home page to ligin to client
                        <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd"
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                clipRule="evenodd"></path>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default LogintoClient