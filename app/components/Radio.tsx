import { StyleSheet, View } from "react-native"
import { useThemeColors } from "../hooks/useThemeColors"



type Props = {
    checked:boolean
}

export function Radio ({checked}:Props){
const colors=useThemeColors()
return <View style={[styles.radio,{borderColor:colors.tint}]}>
        {checked && <View style={[styles.radioInner,{backgroundColor:colors.tint}]}/>}
</View>
}


const styles= StyleSheet.create({
    radio:{
        width:14,
        height:14,
        borderStyle:'solid',
        borderWidth:1,
        borderRadius:15,
        alignContent:'center',
        justifyContent:'center'
    },
    radioInner:{
        width:8,
        height:8,
        borderRadius:6,
        marginLeft:2
    },
    
})