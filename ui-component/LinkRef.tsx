import React from 'react'
import Link from 'next/link'

const LinkRef = React.forwardRef(
  ({ children, ...props }: any, ref) => {
    return (
      <Link {...props}>
        <span {...props} ref={ref}>
          {children}
        </span>
      </Link>
    )
  }
)

export default LinkRef