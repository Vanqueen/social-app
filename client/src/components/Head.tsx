// Head.tsx

import { useEffect } from "react";

const Head = ({ title }: { title: string }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return <></>
};

export default Head;
