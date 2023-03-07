import { StyleSheet } from "react-native";

const Style = StyleSheet.create({

    container:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        marginLeft:10
    },
    circle:{
        width:6,
        height:6,
        borderRadius:3,
        backgroundColor:'#6e3e91',
        margin:5
    },
    line:{
        flex:1, 
        height:1,
        backgroundColor:'#dadada',
        marginRight:20,
        marginLeft:20
    }
    
});

export default Style;