// import React from 'react'

interface TrimTextProps {
  item: string;
  maxLength: number;
}

const TrimText = ({item, maxLength}: TrimTextProps) => {
  return (
    <>
        {item?.length > maxLength ? item?.substring(0, maxLength) + "..." : item}
    </>
  )
}

export default TrimText