import React, { Component, ErrorInfo, ReactNode } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface ErrorBoundaryProps {
    children: ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(_: Error): ErrorBoundaryState {
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('Error caught:', error, errorInfo)
        toast.error('An error occurred. Please try again later.')
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return null // You can return a fallback UI here
        }

        return (
            <>
                {this.props.children}
                <ToastContainer />
            </>
        )
    }
}

export default ErrorBoundary
