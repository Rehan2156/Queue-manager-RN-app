import React, { Component } from 'react'
import { Text, StyleSheet, View, Button,TouchableOpacity } from 'react-native'
import * as firebase from 'firebase'
import { FlatList } from 'react-native-gesture-handler';
import Card from '../../../shared/card';
import { globalStyles } from '../../../styles/global';
import { FontAwesome } from '@expo/vector-icons';




export default class Shopkeeper extends Component {
    
    constructor(){
      super()
      this.state={
        customers:[
            {name:'Rehan',token:99,key:'1'}
        ],
        shopName:"",
        tempArray:[],
        isReady:false,
        isOpen: 0,
        qLen: 0,
        howMany: '',
        line: {},
    }
    }


    componentDidMount = async () => {
        var myArray = []

        await firebase.database().ref('shop/' + firebase.auth().currentUser.uid).once('value' , snapshot => {
          this.setState({
              isOpen: snapshot.toJSON().isOpen, 
          })
      })

        firebase
        .database()
        .ref('/shop/'+firebase.auth().currentUser.uid)
        .on("value",(snapshot)=>{
            var shopName = snapshot.child("/shop_name").val().toString()
            console.log("shop name "+shopName)
            this.setState({
                shopName:shopName
            })
        })

        try {
            console.log("here")
            var myJSON
          var ref = firebase.database().ref('shop/' + firebase.auth().currentUser.uid + '/line');
          ref.once("value", (snapshot) => {
            if(snapshot.exists()){
              var number = 0;
              snapshot.forEach( data => {
                number++;
                var key = data.key
                var name = data.toJSON().Name
                var token = data.toJSON().Token
                myArray = [...myArray, {name:name,token:token, key: key }]
              })
                this.setState({
                  customers: [...this.state.customers, ...myArray],
                })
              
              } else {  
                this.setState({ qLen: 0 })              
              }
                this.setState({
                  tempArray: this.state.customers,
                  isReady: true,
                })

          })
        } catch(e) {
          console.log('Error: ', e)
        }
      }
    
    render(){
        return (
          <View style={{backgroundColor:'#Fedbd0'}}>
            <View style={styles.body}>
                <Text style={styles.head}>People in queue</Text>
                <FlatList data={this.state.tempArray} renderItem={({ item }) => (
                    <View>
          <TouchableOpacity style={styles.touch}>
            <View style={styles.cardAlign}>
            <View>
              <Text style={globalStyles.titleText}>{ item.name }</Text>
              <Text>Token : {item.token}</Text>
            </View>  
            </View>
          </TouchableOpacity>
          <FontAwesome name="arrow-down" style={styles.icon}/>
                    </View>
        )} 
        contentContainerStyle={{ paddingBottom: 600}}
        />
            </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    head:{
        padding:15,
        fontWeight:'bold',
        fontSize:20,
        textAlign:'center',
        opacity:0.7,
        color:'white'
    },
    body:{
        backgroundColor:'#424242',
        padding:50,
        borderTopLeftRadius:150,
    },
    
    touch:{
        backgroundColor:'#Fedbd0',
        margin:10,
        marginLeft:10,
        marginRight:10,
        alignItems: 'center',
    //   justifyContent: 'center',
    //   alignContent:'center',
      shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    borderBottomEndRadius:15,
    borderTopLeftRadius:15,
    elevation: 3,
    },
    cardAlign:{
        padding:10,
        margin:10,
        opacity:0.5,
        color:'transparent'
    },
    txt:{
        color:'white'
    },
    icon:{
        alignItems: 'center',
      justifyContent: 'center',
      alignContent:'center',
      textAlign:'center',
      fontSize:20,
      color:'#8A8A87'
    }
})
