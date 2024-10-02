import { Image, StyleSheet, TextInput,View } from "react-native"
import { Row } from "./Row"
import { useThemeColors } from "../hooks/useThemeColors"





type Props = {
    value:string,
    onChange: (s:string)=> void
}



export function SearchBar({value,onChange}:Props){
    const colors = useThemeColors()
    return <Row 
    gap={8} 
    style={[styles.wrapper,{backgroundColor:colors.grayWhite}]}>
        <Image 
        source={require('@/assets/images/search.png')} 
        width={16} 
        height={16} 
        tintColor={colors.tint}
       />
        <TextInput 
        onChangeText={onChange} 
        value={value}
        style={styles.input}
        />
    </Row>
}


const styles = StyleSheet.create({
    wrapper : {
        flex:1,
        borderRadius:16,
        height:45,
        paddingHorizontal:12,
       // padding:20
    },
    input:{
        flex:1,
        height:16,
        lineHeight:16,
        fontSize:10
    }
}) 