import React, { useState } from 'react';
import { View, StyleSheet, TouchableHighlight, ScrollView } from 'react-native';
import { TextInput, Button,Modal, Portal, Text,Card } from 'react-native-paper';
import {IconButton, MD3Colors } from 'react-native-paper';




const AddItemsForm = () => {
    const [items, setItems] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newItem, setNewItem] = useState({});
    const [editedItem, setEditedItem] = useState(undefined);

    const inputs = [
        //  ItemDescription, Height, Width, Depth, Weight, Quantity, SpecialInstructions
        { name: 'ItemDescription', type: 'default', placeholder: 'Item Description' },
        { name: 'Height', type: 'numeric', placeholder: 'Height(Cm)' },
        { name: 'Width', type: 'numeric', placeholder: 'Width(Cm)' },
        { name: 'Depth', type: 'numeric', placeholder: 'Depth(Cm)' },
        { name: 'Weight', type: 'numeric', placeholder: 'Weight(Kg)' },
        { name: 'Quantity', type: 'numeric', placeholder: 'Quantity' },
        { name: 'SpecialInstructions', checkbox:true, type: 'default', placeholder: 'Special Instructions' }
    ]
    console.log(items)

    const handleSubmit = (item) => {
        setEditedItem(item);
    }
    const handleChange = (e,item) =>{
        setNewItem(prev=>({...prev,[`${item.name}`]:e}));
    }

    const handleAddItem = (e) => {
        // if quantity is not a number, return qunatity = 1
        if(isNaN(newItem.Quantity)){
            newItem.Quantity = 1;
        }
        // if special instructions is empty, return special instructions = "None"
        if(newItem.SpecialInstructions === "" || newItem.SpecialInstructions === undefined){
            newItem.SpecialInstructions = "None";
        }

        setItems([...items, newItem]);
        setIsModalVisible(false);
        setEditedItem(undefined);
        setNewItem({});
        
    };

    const handleEditItem = (e) => {
        setItems(items.filter((i,ind)=>i!==e))
        setNewItem(e);
        Object.keys(e).forEach(key=>{ if(typeof e[key] !== 'string'){ e[key] = e[key].toString()}});
        setEditedItem(e);
        setIsModalVisible(true);
    }

    const handleCancel = () => {
        if(editedItem){
            setItems([...items, editedItem]);
        }else{
            setNewItem({});
        }
        setIsModalVisible(false);
    }

    return (
        <View style={{justifyContent:"space-between",height:'90%',padding:10}}>
            {/* Render the list of items */}
{ 
    items.length === 0 ? <Text style={styles.text}>No items added yet</Text>       
   :
   <ScrollView>
   {items.map((item, index) => (
                // box with the item details
    <Card mode='outlined'>

    <Card.Actions>
    <IconButton
    icon="trash-can"
    iconColor={MD3Colors.error50}
    key={index+"delete"}
    mode='contained'
    size={20}
    onPress={()=>setItems(items.filter((i,ind)=>ind!==index))}
    />
          <IconButton
    key={index+"edit"}
    mode='contained'
    icon="pencil"
    iconColor={MD3Colors.error50}
    size={20}
    onPress={()=>handleEditItem(item)}
    />
    </Card.Actions>
    <Card.Content>
        <Text key={index+"ItemDescription"} variant="titleLarge">{item.ItemDescription}</Text>
        <Text key={index+"Height"} variant="bodyMedium"> Height  {item.Height}</Text>
        <Text key={index+"Width"} variant="bodyMedium"> Width  {item.Width}</Text>
        <Text key={index+"Depth"} variant="bodyMedium"> Depth  {item.Depth}</Text>
        <Text key={index+"Weight"} variant="bodyMedium"> Weight  {item.Weight}</Text>
        <Text key={index+"Quantity"} variant="bodyMedium"> Quantity  {item.Quantity}</Text>
        <Text key={index+"SpecialInstructions"} variant="bodyMedium">Special Instructions {item.SpecialInstructions}</Text>
    </Card.Content>

  </Card>
            ))}
    </ScrollView>
}
   

            {/* Render the form */}
            <Portal>
            <Modal  style={styles.modal} onDismiss={handleCancel}  visible={isModalVisible}>
                <Text style={{textAlign:'center',fontSize:20,marginBottom:10}}>Add Item</Text>
                {inputs.map((input, index) => (
                        
              
                    <TextInput
                        label={input.placeholder}
                        keyboardType ={input.type}
                        value = {newItem[input.name] || ''}
                        onChangeText ={(e)=>handleChange(e,input)}
                        key={index+"input"}
                        mode="outlined"
                        />
                    ))}
                    <View style={{justifyContent:'space-evenly',marginTop:20,flexDirection:'row'}} >
               <Button buttonColor='green'  mode="contained" onPress={handleAddItem}>Add</Button>

               <Button buttonColor='red' mode="contained" onPress={handleCancel}>Cancel</Button>
                    </View>
            </Modal>
            </Portal>
            <View style={{justifyContent:'center',alignItems:'center'}}>

                
          <Button onPress={() => setIsModalVisible(true)}
                        mode='contained'>
                           Add Item
                        </Button>
                    {
                        items.length > 0 && 
                        <Button onPress={() => handleSubmit()} 
                        mode='contained'>
                            That's all 
                        </Button>
                     
                    }
          
          </View>
        </View>
    );
};

const styles = StyleSheet.create({
    AddItemBtn:{
        backgroundColor: 'green',
        textAlign: 'center',
        padding: 10,
        borderRadius: 50,
        height: 50,
        width:"50%",
        marginTop: 10,
        display: 'flex',
        borderWidth:3
        
    },
    AddButton:{
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
    },
    CancelButton:{
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    ButtonContiner:{
        display: 'flex',
        flexDirection:"row",
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10

    },
    modal:{
        backgroundColor: 'white',
        borderWidth: 2,
        height: 'fit-content',
        padding: 20,
        // height: '80%',
       
    },
    
    input: {
        // make it so the text is styled inside the input and when focused on the input the border color changes
        // width: '80%',
        flex:1,
        // padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        textAlign: 'center',
        borderRadius: 5,
        marginTop:10,


    },
    text: {
        fontSize: 20,
        color: 'black',
        // marginBottom: 10
    }
});

export default AddItemsForm;