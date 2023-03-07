import { StyleSheet } from "react-native";

const Style = StyleSheet.create({

    container: {
        flexDirection:'row',
        padding:5,
        alignItems:'center',
        marginTop:5,
    },

    iconLocation:{
        fontSize:24,
        marginRight: 0,
    },
    containerAddress:{
        justifyContent:'center',
        marginLeft: 15,
        flex:1,
        alignItems:'flex-start',
    },
    textAddress :{
        fontWeight: 'bold',
        flex:1,
        overflow:'hidden',
        fontSize:12
    },
    textHour:{
        fontSize:12
    }

});

export default Style;