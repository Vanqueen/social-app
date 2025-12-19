// import React from 'react'
 
const HeaderInfo = ({ text }: {text: string}) => {
 
    return (
        <header className='haderInfo'>
            <h3 style={{textAlign: 'center'}}>{text}</h3>
        </header>
    )
}
 
export default HeaderInfo