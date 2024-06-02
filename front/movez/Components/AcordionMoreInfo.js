import * as React from 'react';
import { List } from 'react-native-paper';

const AcordionMoreInfo = ({data}) => {
	const [expanded, setExpanded] = React.useState(true);

	const handlePress = () => setExpanded(!expanded);

	console.log("data", data)

	return (

			<List.Accordion
				title="More Info"
				
				expanded={expanded}
				onPress={handlePress}>
					{
						data.map((item, index) => {
							return <List.Item key={index} title={item.info} left={props=> <List.Icon {...props} icon={item.icon}/>} />
						})
					
					}
		
			</List.Accordion>
	
	);
};

export default AcordionMoreInfo;