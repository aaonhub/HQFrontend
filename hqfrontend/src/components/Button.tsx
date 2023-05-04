import React, { CSSProperties } from 'react';

const CustomButton = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => {
	const buttonStyle: CSSProperties = {
		width: '130px',
		height: '40px',
		color: '#000',
		border: 'none',
		borderRadius: '5px',
		padding: '10px 25px',
		fontFamily: "'Lato', sans-serif",
		fontWeight: 500,
		background: 'transparent',
		cursor: 'pointer',
		transition: 'all 0.3s ease',
		position: 'relative',
		display: 'inline-block',
		boxShadow:
			'inset 2px 2px 2px 0px rgba(255,255,255,.5), 7px 7px 20px 0px rgba(0,0,0,.1), 4px 4px 5px 0px rgba(0,0,0,.1)',
		outline: 'none',
	};

	const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
		const target = e.target as HTMLButtonElement;
		target.style.color = '#000';
	};

	const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
		const target = e.target as HTMLButtonElement;
		target.style.color = '#000';
	};

	const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
		const target = e.target as HTMLButtonElement;
		target.style.top = '2px';
	};

	const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
		const target = e.target as HTMLButtonElement;
		target.style.top = '0px';
	};

	return (
		<button
			className="custom-btn btn-16"
			style={buttonStyle}
			onClick={onClick}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
		>
			{children}
		</button>
	);
};

export default CustomButton;
