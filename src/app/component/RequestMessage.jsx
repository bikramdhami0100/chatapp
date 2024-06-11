import React from 'react'

function RequestMessage({ requestmessage }) {
    return (
        <div className=''>
            <p>{requestmessage.message}</p>
            <p>{requestmessage.status}</p>
        </div>
    )
}

export default RequestMessage