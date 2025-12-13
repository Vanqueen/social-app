// import React from 'react'

const TrimText = ({item, maxLength}: any) => {
  return (
    <>
        {item?.length > maxLength ? item?.substring(0, maxLength) + "..." : item}
    </>
  )
}

export default TrimText