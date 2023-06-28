import React from 'react'


interface BasicTemplateProps {
    id: string;
    handleClose: () => void;
}


const BasicTemplate = ({ id, handleClose }: BasicTemplateProps) => {


    return (
        <p>
            Hello
        </p>
    )
}

export default BasicTemplate