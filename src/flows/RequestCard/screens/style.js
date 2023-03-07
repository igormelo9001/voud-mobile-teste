import { StyleSheet } from "react-native";
import { getPaddingForNotch } from '../../../utils/is-iphone-with-notch';
import { colors } from "../../../styles";

const Style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
        paddingBottom: getPaddingForNotch(),
    },
    containerCard:{
        elevation:8,
        position:"absolute",
        // backgroundColor:"red",
        // width:"100%",
        // alignItems:"center",
        // marginTop: 192 /  2.5,
        marginHorizontal:5,
    },
    description:{
        color: colors.GRAY,
        fontSize: 14,
    },
    containerDescription:{
        flexDirection:"row",
        marginTop: 122 ,
        marginHorizontal:16,
    },
    groupInfoContainer: {
        // paddingTop: 8,
        paddingBottom: 16
      },
      personalDataText: {
        lineHeight: 24,
      },
      containerRegister:{
        flex: 1
      },
      containerDataPersonal:{
        marginTop: 24
      },
      containerHeaderDelivery:{
        marginTop: 23,
      },
      containerDelivery:{
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        marginTop: 16,
        justifyContent:"center",
        marginHorizontal:16,
        // backgroundColor:"red",
        padding: 5,
      },
      deliveryOption:{
        height: 72,
        width: 160,
        borderColor: "#DADADA",
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "center",
        marginRight:8,
        marginLeft:8
      },
      deliveryOptionSelected:{
        height: 72,
        width: 160,
        borderColor: "#A84D97",
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "center",
        marginRight:8,
        marginLeft:8,
      },
      textTitle:{
        color: "#C6C6C6",
        fontSize: 14,
        alignItems: "center"
      },
      textTitleSelected:{
        color: "#A84D97",
        fontSize: 14,
        alignItems: "center"
      },
      containerCheckBox:{
        marginTop:16,
        marginHorizontal:16
      },
      containerAddAddress:{
        marginTop:16,
        marginHorizontal:16,
      },
      containerTitleButtonaddAddress:{
        flex: 1,
        height: 32,
        borderRadius: 2,
        backgroundColor: "#EAEAEA",
        alignItems: "center",
        justifyContent: "center",
      },
      titleButtonAddAddress:{
        fontSize: 12,
        fontWeight: 'bold',
        lineHeight: 16
      },
      containerInformation:{
        marginTop: 23,
         marginHorizontal: 16,
      },
      textInformation:{
        fontSize: 14,
        color: "#707070"
      },
      containerLabel:{
        marginHorizontal: 16,
      },
      containerAddressDelivery:{
        flex:1,
        marginTop:16,
        marginHorizontal:16,
        alignItems:"center",
        justifyContent:"center"
      },
      descriptionAddress:{
        color:"#707070",
        fontSize:14,
        lineHeight: 20
      },
      continerAddress: {
        flex: 1,
      },
      zipCodeAddress:{
        marginLeft: 16,
        marginRight: 188
      },
      containerNumberSupplement:{
        flexDirection: "row"
      },
      numberAddress :{
        flex: 1,
        marginRight: 16,
        marginLeft: 16
      },
      containerSupplement:{
        flex: 1,
        marginRight: 16
      },
      containerCityState:{
        flexDirection: "row"
      },
      city:{
        marginLeft: 16,
        marginRight: 16,
        flex: 1
      },
      state:{
        marginLeft: 16,
        marginRight: 16,
        flex: 1
      },
      containerZipCode: {
        marginLeft: 16,
        marginRight: 188
    },
    containerDistrictAndSupplement: {
      flex: 1,
      marginRight: 16,
      marginLeft: 16
  },
  isSelected:{
    opacity: 0.5,
},
isNotSelected:{
opacity: 1,
},
containerNumberDelivery:{
  flexDirection: "row"
}
});

export default Style;
