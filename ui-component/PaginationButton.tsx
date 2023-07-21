import React from 'react';

const PaginationButton = React.forwardRef(({ children, page, setPage, ...props }: any, ref) => {
    return (
        <span {...props} ref={ref} onClick={() => setPage(page)}>
            {children}
        </span>
    )
})

PaginationButton.displayName = 'PaginationButton';

export default PaginationButton
