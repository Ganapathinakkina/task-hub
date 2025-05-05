'use client';
import { useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';

const Register = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState('Select Role');

    const roles = ['Admin', 'Manager', 'Employee'];

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (role) => {
        setSelectedRole(role);
        setIsOpen(false);
    };

    return (
        <section class=" bg-[#d5e7f7] flex flex-col justify-baseline items-center p-10 gap-10">
            <h1 className='text-[#389ef1] text-3xl font-bold'>Welcome</h1>
            <div className='bg-[#edf6ff] p-7 w-full flex flex-col  flex-wrap sm:w-md'>
                <h2 className='text-2xl font-medium text-sky-700 mb-5 text-center'>Signup</h2>
                <form className='bg-white p-5 w-full flex flex-col '>
                    <div class=" mb-2">
                        <label for="Name" class="leading-7 text-sm text-gray-600">Name</label>
                        <input type="text" id="full-name" name="full-name" class="w-full bg-white rounded border border-gray-300 focus:border-sky-300 focus:ring-2 focus:ring-sky-200 text-sm outline-none text-gray-700 py-1 px-3 leading-6 transition-colors duration-200 ease-in-out" />
                    </div>
                    <div class=" mb-2">
                        <label for="Email" class="leading-7 text-sm text-gray-600">Email</label>
                        <input type="email" id="email" name="email" class="w-full bg-white rounded border border-gray-300 focus:border-sky-300 focus:ring-2 focus:ring-sky-200 text-sm outline-none text-gray-700 py-1 px-3 leading-6 transition-colors duration-200 ease-in-out" />
                    </div>
                    <div class=" mb-2">
                        <label for="Email" class="leading-7 text-sm text-gray-600">Password</label>
                        <input type="password" id="password" name="password" class="w-full bg-white rounded border border-gray-300 focus:border-sky-300 focus:ring-2 focus:ring-sky-200 text-sm outline-none text-gray-700 py-1 px-3 leading-6 transition-colors duration-200 ease-in-out" />
                    </div>

                    <div className="relative text-left mt-5">
                        {/* Dropdown button */}
                        <button
                            type="button"
                            className="flex justify-center w-full rounded-md border border-gray-300 shadow-sm  px-2 py-2 bg-white text-sm font-medium text-black hover:bg-sky-50"
                            onClick={toggleDropdown}
                        >
                            <div className='w-[90%] text-center'>
                                {selectedRole}
                            </div>
                            <div className=" flex justify-end items-center  width-[10%] text-center">
                                <FaCaretDown />
                            </div>
                        </button>

                        {/* Dropdown menu */}
                        {isOpen && (
                            <div className="origin-top-right absolute right-0 mt-2 w-30 rounded-md shadow-lg bg-[#edf6ff] ring-1 ring-sky-400 ring-opacity-1 focus:outline-none transition-transform duration-200 ease-in-out">
                                <div className="py-1">
                                    {roles.map((role, index) => (
                                        <a
                                            key={index}
                                            href="#"
                                            className="block px-3 py-1 text-sm text-black  hover:bg-sky-200"
                                            onClick={() => handleSelect(role)}
                                        >
                                            {role}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <button type='button' className='bg-[#379ef1] rounded-md text-white  mt-10 px-8 py-1'>Submit</button>
                </form>
            </div>

        </section>
    )
}

export default Register