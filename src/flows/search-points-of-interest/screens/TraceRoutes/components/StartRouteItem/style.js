import { StyleSheet } from "react-native";
import { colors } from '../../../../../../styles';


// Styles
const Style = StyleSheet.create({
    resultSearchRouteListItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      backgroundColor: 'white'
    },
    itemWrapper: {
      borderBottomWidth: 1,
      borderBottomColor: colors.GRAY_LIGHT2,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal:0,
    
    },
    noBorder: {
      borderBottomWidth: 0
    },
    contentLeft: {
      flexDirection: 'column',
      alignItems: 'center',
      paddingVertical: 8,
      width: 48,
    },
    contentMiddle: {
      flexDirection: 'column',
      alignItems: 'center',
      paddingVertical: 8,
      height: 56,
      marginHorizontal: 8,
      width: 24,
    },
    contentRight: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      paddingVertical:5,

    },
    iconVoud: {
      fontSize: 16,
      marginRight: 0,
      color: colors.BRAND_PRIMARY
    },
    icon: {
      fontSize: 16,
      color: colors.GRAY
    },
    img: {
      maxWidth: 26
    },
    bomImg: {
      height: 10
    },
    buImg: {
      height: 19
    },
    buImgLarge: {
      height: 24
    },
    bomImgLarge:{
      height: 24
    },
    routeStepsWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'stretch',
      marginBottom: 4
    },
    mb8: {
      marginBottom: 8,
    },
    containerPrice:{
      backgroundColor:'#fff',
      alignItems:'center',
      justifyContent:'center',
      marginRight:5
    },
    price: {
      fontWeight: 'bold',
      fontSize:11,
      flex:1,
    },
    img: {
      maxWidth: 24
    },
    imgBom :{
      maxWidth: 24
    },
    contentMiddle: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent:'center',
      paddingVertical: 0,
      height: 56,
      marginHorizontal: 5,
      width: 24,
    },
    contentDurationWrapper:{
      flex:1,
      flexDirection:"row",
      alignItems:"flex-end",
      justifyContent:"flex-end"
    },
    contentIconDirections:{
      flexDirection:'row',
      alignItems: 'center',
      paddingVertical: 8,
      width: 35,
    }
    
  });

  export default Style;