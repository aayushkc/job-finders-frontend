import { NextResponse } from 'next/server'

const userProtectedPaths = [
    '/create-profile',
    '/job-status',
    '/my-profile'
]

const logedUserNoViewPaths = [
    '/forget-password',
    '/signin',
    '/register-as-recruiter',
    '/register-as-user',
    '/reset-password',
]

export async function middleware(request) {
    const accessToken = request.cookies.get('accessToken')?.value
    const isVerified = request.cookies.get('hasUserBeenActivated')?.value
    const isSeeker = request.cookies.get('isSeeker')?.value

    if(isSeeker === 'true' && request.nextUrl.pathname === '/' && isVerified === 'false') {
       
        return NextResponse.redirect(new URL('/account-activation', request.url))
    } 

    if(request.nextUrl.pathname.startsWith('/jobs') && accessToken && isSeeker ==='true'){
        if(isVerified === 'false'){
            return NextResponse.redirect(new URL('/account-activation', request.url))
        }
        return NextResponse.next()
    }
    //Check if the given path requires Authentication
    //AccessToken set in the cookies determines if the user is authenticated
    if (request.nextUrl.pathname.startsWith(userProtectedPaths[0]) || request.nextUrl.pathname.startsWith(userProtectedPaths[1]) || request.nextUrl.pathname.startsWith(userProtectedPaths[2])) {
        
        //Redirect to signin page if user is not authenticated
        // if (!accessToken) {
        //     return NextResponse.redirect(new URL('/signin', request.url))
        // }
        if(isVerified === 'false'){
            return NextResponse.redirect(new URL('/account-activation', request.url))
        }
        return NextResponse.next()
    }

    //Check if the given path requires can be accessed by authenticated user
    if (request.nextUrl.pathname.startsWith(logedUserNoViewPaths[0]) || request.nextUrl.pathname.startsWith(logedUserNoViewPaths[1]) || request.nextUrl.pathname.startsWith(logedUserNoViewPaths[2]) || request.nextUrl.pathname.startsWith(logedUserNoViewPaths[3])) {
        
        //Redirect to home page if user is authenticated
        if (accessToken) {
            return NextResponse.redirect(new URL('/', request.url))
        }
        return NextResponse.next()

    }

    if(request.nextUrl.pathname.startsWith('/recruiter') && isVerified === 'false'){
        return NextResponse.redirect(new URL('/account-activation', request.url))
    }

    return NextResponse.next()

}

