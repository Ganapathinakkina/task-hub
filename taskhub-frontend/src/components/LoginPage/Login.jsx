import React from 'react'

const Login = () => {
  return (
    <section class="h-screen bg-[#d5e7f7] flex flex-col justify-between items-center px-5 py-10 gap-10 sm:p-10">
      <h1 className='h-[10vh] text-[#389ef1] text-3xl font-bold'>Welcome</h1>
      <div className='h-[90vh] w-[100%] py-30 flex justify-center items-baseline'>
        <div className=' bg-[#edf6ff] p-7 w-full flex flex-col  flex-wrap sm:w-md'>
          <h2 className='text-2xl font-medium text-sky-700 mb-5 text-center'>Login</h2>
          <form className='bg-white p-5 w-full flex flex-col '>
            <div class=" mb-2">
              <label for="Email" class="leading-7 text-sm text-gray-600">Email</label>
              <input type="email" id="email" name="email" class="w-full bg-white rounded border border-gray-300 focus:border-sky-300 focus:ring-2 focus:ring-sky-200 text-sm outline-none text-gray-700 py-1 px-3 leading-6 transition-colors duration-200 ease-in-out" />
            </div>
            <div class=" mb-2">
              <label for="Email" class="leading-7 text-sm text-gray-600">Password</label>
              <input type="password" id="password" name="password" class="w-full bg-white rounded border border-gray-300 focus:border-sky-300 focus:ring-2 focus:ring-sky-200 text-sm outline-none text-gray-700 py-1 px-3 leading-6 transition-colors duration-200 ease-in-out" />
            </div>
            <button type='button' className='bg-[#379ef1] rounded-md text-white  mt-10 px-8 py-1'>Submit</button>
          </form>
        </div>
      </div>

    </section>
  )
}

export default Login