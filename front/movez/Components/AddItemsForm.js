import React, { useState } from 'react';
import { View, Text, Button, Modal, TextInput, StyleSheet, ScrollView, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

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
        console.log("wow",e)
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
        // if one of the values are not string then convert it to string
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
   items.map((item, index) => (
                // box with the item details
               
                <View style={{fontSize:10,marginTop:5,padding:10,borderRadius:15,backgroundColor:"grey"}} key={index}>
                    <View style={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                    <Icon name="trash" style={{padding:5}} size={30} color="black" onPress={()=>setItems(items.filter((i,ind)=>ind!==index))}/>
                    <Icon name="edit" style={{padding:5}}  size={30} color="black" onPress={()=>handleEditItem(item)}/>
                    </View>
                    <Text>Item Description {item.ItemDescription}</Text>
                    <Text> Height  {item.Height}</Text>
                    <Text> Width  {item.Width}</Text>
                    <Text> Depth  {item.Depth}</Text>
                    <Text> Weight  {item.Weight}</Text>
                    <Text> Quantity  {item.Quantity}</Text>
                    <Text>Special Instructions {item.SpecialInstructions}</Text>
                </View>
            ))}

   

            {/* Render the form */}
            <Modal  style={styles.modal} visible={isModalVisible}>
            <ScrollView contentContainerStyle={{justifyContent:"center"}} style={{flex:1}}>
                {inputs.map((input, index) => (
                        
                <View key={index+"view"}>
                    <Text   key={index+input.name} style={styles.text}>{input.placeholder}</Text>
                    <TextInput
                        keyboardType ={input.type}
                        value = {newItem[input.name] || ''}
                        onChangeText ={(e)=>handleChange(e,input)}
                        key={index+"input"}
                        style={styles.input}
                        />
                </View>
                
                 

                    ))}
                </ScrollView>
                    <View style={styles.ButtonContiner}>
                    <TouchableHighlight  onPress={handleAddItem} style={styles.AddButton}>
                    <Text>Add</Text>
                    </TouchableHighlight>

                    <TouchableHighlight onPress={() => handleCancel()}  style={styles.CancelButton}>

                    <Text   
                      >Cancel</Text>
                    </TouchableHighlight>

                    </View>
            </Modal>
            <View style={{justifyContent:'center',alignItems:'center'}}>

                     {/* Button to open the form */}
                     <TouchableHighlight  onPress={() => setIsModalVisible(true)} style={styles.AddItemBtn}>
              
             
              <Text style={{flex:1,textAlign:'center'}}>Add Item</Text>
          </TouchableHighlight>
                    {
                        items.length > 0 && 
                        
                        <TouchableHighlight  onPress={() => handleSubmit()} style={styles.AddItemBtn}>
              
             
                          <Text style={{flex:1,textAlign:'center'}}>That's all</Text>
                            </TouchableHighlight>
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
        margin: 0, // This is the important style you need to set
        // padding: 20,
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