import { StyleSheet } from "react-native";
import { colors } from '../../../../../../styles';

const Style = StyleSheet.create({

    container:{
        marginLeft:10,
        margin:0,
        flexDirection:'row'
    },

    iconVoud: {
        fontSize: 18,
        marginRight: 0,
        color: colors.BRAND_PRIMARY
      },
      
      text: {
        marginLeft:15,
        fontSize:12,
      }

});

export default Style;