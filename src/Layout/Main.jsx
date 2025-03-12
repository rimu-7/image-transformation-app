import React from 'react';
import { Outlet } from 'react-router-dom';

const Main = () => {
    return (
        <div className='bg-[#212121] text-white'>

            <div className=''>
                <Outlet />
            </div>
            
        </div>
    );
};

export default Main;