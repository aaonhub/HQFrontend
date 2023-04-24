import { Divider, ListItem, ListItemText, Typography } from "@mui/material";
import { format } from "date-fns";
import React from "react";


interface LogItemProps {
	log: any;
	index: number;
	prevLog: any;
}

const LogItem = React.memo(({ log, index, prevLog }: LogItemProps) => {
	const logTime = new Date(log.logTime);
	const prevLogTime = prevLog && new Date(prevLog.logTime);
	const isSameDay = prevLogTime && logTime.getDate() === prevLogTime.getDate();
	const showDateHeader = !prevLog || !isSameDay;

	return (
		<>
			{showDateHeader && (
				<ListItem>
					<Typography variant="subtitle1" fontWeight="bold">
						{format(logTime, 'EEEE, MMMM d, yyyy')}
					</Typography>
				</ListItem>
			)}
			<ListItem alignItems="flex-start">
				<ListItemText
					primary={
						<>
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
							<Typography component="span" pl={1}>
								{log.log}
							</Typography>
						</>
					}
				/>
			</ListItem>
			<Divider />
		</>
	);
});


export default LogItem;