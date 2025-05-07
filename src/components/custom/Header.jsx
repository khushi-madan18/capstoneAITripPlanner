import React from 'react'
import { Button } from '../ui/button'

function Header() {
  return (
    <div>
        {/* logo aayega yaha */}
        <div className='p-3 shadow-sm flex justify-end items-center px-5'>
            <Button>Sign In</Button>
        </div>
    </div>
  )
}

export default Header