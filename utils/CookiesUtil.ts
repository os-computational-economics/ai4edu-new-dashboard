import Cookies from "js-cookie";
import jwt, { JwtPayload } from 'jsonwebtoken'

const decodeToken = () => { 
    const access_token = Cookies.get('access_token')
    const refresh_token = Cookies.get('refresh_token')
    
    if (access_token) {
        const decodedToken = jwt.decode(access_token) as JwtPayload
        return decodedToken
    } else if (refresh_token) {
        return null
    }
}

const formatedCourses = () => { 
    const roles = decodeToken()?.workspace_role || {}
    const formattedCourses = Object.entries(roles).map(([id, role]) => ({
        id,
        role: role as string,
        name: id
    }))
    return formattedCourses
}

const isAdmin = () => { 
    return decodeToken()?.system_admin
    // return true
}

export { formatedCourses, isAdmin }