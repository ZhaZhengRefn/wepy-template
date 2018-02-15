import wepy from 'wepy'
import jwtDecode from 'jwt-decode'
import { getJWT } from '@lib/util'

export default class Decode extends wepy.mixin {

    decodeToken(){
        const token = getJWT()
        if(token && token.length > 0){
            return jwtDecode(token)
        }
        return null
    }

}