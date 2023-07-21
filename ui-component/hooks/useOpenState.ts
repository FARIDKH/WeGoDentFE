import { useState } from 'react'

export const useOpenState = (isOpenDefault = false) => {
    const [isOpen, setOpen] = useState(isOpenDefault)

    return {
        isOpen,
        open: () => setOpen(true),
        close: () => setOpen(false),
        toggle: () => setOpen((open) => !open),
    }
}
