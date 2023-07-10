import { Divider, ListItem, ListItemText, Typography } from "@mui/material";
import { format } from "date-fns";
import React from "react";

// Models
import Log from "../../models/log";


interface LogItemProps {
	log: Log;
	prevLog: any;
}

const LogItem = React.memo(({ log, prevLog }: LogItemProps) => {
	const logTime = new Date(log.logTime);
	const prevLogTime = prevLog && new Date(prevLog.logTime);
	const isSameDay = prevLogTime && logTime.getDate() === prevLogTime.getDate();
	const showDateHeader = !prevLog || !isSameDay;

	return (
		<React.Fragment>

			{/* Date display */}
			{showDateHeader && (
				<ListItem>
					<Typography variant="subtitle1" fontWeight="bold">
						{format(logTime, 'EEEE, MMMM d, yyyy')}
					</Typography>
				</ListItem>
			)}


			{/* Log display */}
			<ListItem alignItems="flex-start">
				<ListItemText
					primary={
						<>

							{/* Timestamp */}
							<Typography
								variant="body2"
								component="span"
								sx={{
									fontFamily: 'monospace',
									backgroundColor: 'background.paper',
									borderRadius: '3px',
									padding: '1px 3px',
								}}
							>
								{format(logTime, 'hh:mm a')}
							</Typography>

							{/* Text */}
							<Typography component="span" pl={1}>
								{log.text}
							</Typography>


						</>
					}
				/>
			</ListItem>

			<Divider />


		</React.Fragment>
	);
});


export default LogItem;