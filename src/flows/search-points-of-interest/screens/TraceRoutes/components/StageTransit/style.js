import { StyleSheet } from "react-native";

import { colors } from '../../../../../../styles';

const Style = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row',
        marginLeft:10,
        margin:5,
    },
    iconVoud: {
        fontSize: 20,
        marginRight: 0,
        color: colors.BRAND_PRIMARY,
        borderRadius:9,
      },
      barStage:{
        height:160, 
        width:20,
        backgroundColor:'#782F40',
        borderRadius:10,
        justifyContent:'flex-end',
        alignItems:'center',
      },
      containerIcon:{
        width:24,
        height:24,
        borderRadius:12,
        borderWidth:0,
        backgroundColor:'#fff',
        position:'absolute',
        zIndex:1,
        alignItems:'center',
        justifyContent:'center',
        marginLeft:-2,
        elevation:3,
        shadowColor: '#000',
        shadowOffset: {x:0,y:0},
        shadowRadius:5,
        
        
      },
      line: {
        backgroundColor:'#fff',
        borderRadius:7,
        width:14,
        height:14, 
        marginBottom:5,
      },
      containerDescription:{
          flex:1
      },
      titleLine:{
        flex:1, 
        overflow:'hidden',
        fontWeight:'bold',
        fontSize:12,
      },
      containerDescriptionLine :{
        flexDirection:'row',
        marginTop:5,
        paddingHorizontal:0,
        paddingVertical: 0,
      },
      descriptionLine:{
        backgroundColor:'#782F40', 
        height:25,
        width:80, 
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        marginTop:5,
      },
      textLine: {
        color:'#fff', 
        fontWeight:'bold',
        fontSize:12,
      },
      textLineDescripiton:{
        alignItems:'center', 
        justifyContent:'flex-end', 
        marginLeft:0
      },
      containerTrace:{
        marginTop:5
      },
      trace:{
        flex:1, 
        height:1,
        backgroundColor:'#dadada'
      },
      descriptionOption:{
        marginTop: 17
      },
      containerTrace:{
        marginTop: 15
      },
      title:{
        fontSize:12,
      }
      
});

export default Style;