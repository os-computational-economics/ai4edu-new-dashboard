import Cookies from "js-cookie";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { ToastContainer, toast } from "react-toastify";
import logout from './logout'
import "react-toastify/dist/ReactToastify.css";
import { ping } from '@/api/auth/auth'

const decodeToken = () => { 
    checkExpired()
    const access_token = Cookies.get('access_token')
    const refresh_token = Cookies.get('refresh_token')
    
    if (access_token) {
        const decodedToken = jwt.decode(access_token) as JwtPayload
        return decodedToken
    } else if (refresh_token) {
        return null
    }
}

const getWorkspaceRole = () => { 
    return decodeToken()?.workspace_role
}

const getCurrentUser = () => { 
    return decodeToken()?.student_id
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

const checkExpired = () => {
    // check if there is no access token but there is a refresh token
    if (!Cookies.get('access_token') && Cookies.get('refresh_token')) {
        // call the refresh token endpoint
        ping()
            .then((res) => {
                // if the refresh token is valid, set the new access token
                window.location.reload()
            })
            .catch((err) => {
                window.location.href = '/auth/signin';
            })
    }
}

export { formatedCourses, isAdmin, checkExpired, getCurrentUser, getWorkspaceRole }