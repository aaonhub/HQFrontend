// Checklist.tsx
import React from 'react'
import CustomButton from '../components/Button'

const TestPage: React.FC = () => {
	return (
		<CustomButton onClick={() => console.log('clicked')}>Click Me</CustomButton>
	)
}

export default TestPage