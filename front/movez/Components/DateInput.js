import React, { useState } from 'react';
import { Button, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { View } from 'react-native';

export default function DateInput({dateState}) {

  const [show, setShow] = useState(false);
  const [moveDate, setMoveDate] = dateState;

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || moveDate;
    setShow(false);
    setMoveDate(currentDate);
  };

  return (
    <View style={{flex:1}}>
      <Button onPress={() => setShow(true)}>Select date</Button>
      <TextInput label="Date" value={moveDate.toDateString()} editable={false} />
      {show && (
        <DateTimePicker
          value={moveDate}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
	  </View>
  );
}