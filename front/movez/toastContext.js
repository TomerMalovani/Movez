import React, { createContext, useState } from 'react';
import { Chip, Icon, Portal, Snackbar, Text } from 'react-native-paper';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
	const [toastMessage, setToastMessage] = useState('');
	const [toastMode, setToastMode] = useState("error");

	const showError = (message) => {
		setToastMode("error");
		setToastMessage(message);
	};

	const showSuccess = (message) => {
		setToastMode("success");
		setToastMessage(message);
	}

	const hideToast = () => {
		setToastMessage('');
	}



	return (
		<ToastContext.Provider
			value={{ showError, showSuccess, hideToast, toastMessage, setToastMessage }}
		>
			{children}
			<Snackbar style={{zIndex:50,backgroundColor:toastMode === "error" ? "red" : "green"}} visible={toastMessage !== ''}
				onDismiss={hideToast}
				action={{
					label: 'hide',
					onPress: () => {
						hideToast()
					},
				}}
		
			>
		
					
					{toastMessage}
			
		
			</Snackbar>
		
		</ToastContext.Provider>
	);
};