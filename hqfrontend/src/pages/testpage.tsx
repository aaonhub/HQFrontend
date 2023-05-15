import React from 'react';
import { useSound } from 'use-sound';
import confirmation from '../sounds/confirmation.mp3'

const Test = () => {
	const [playSound] = useSound(confirmation, { volume: 0.1 }); // Adjust the volume value as per your requirement

	const handleButtonClick = () => {
		playSound();
	};

	return (
		<div>
			<button onClick={handleButtonClick}>Play Sound</button>
		</div>
	);
};

export default Test;
