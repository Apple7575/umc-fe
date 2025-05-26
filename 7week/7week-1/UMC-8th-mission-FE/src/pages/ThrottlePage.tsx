import { useEffect, useState } from "react";
import useThrottle from "../hooks/useThrottle";
import PageLayout from "../components/PageLayout";

const ThrottlePage = () => {
  const [scrollY , setScrollY] = useState<number>( 0);

  const handleScroll = useThrottle( () => {
    setScrollY(window.scrollY);
  }, 2000);

  useEffect( () => {
    window.addEventListener( "scroll", handleScroll);

    return () => window.removeEventListener(  "scroll", handleScroll);
  }, [handleScroll]);

  console.log("렌더링");

  return (
    <PageLayout>
      <div className="h-dvh flex flex-col items-center justify-center">
        <div>
          <h1>스크롤링이 무엇일까요?</h1>
          <p>ScrollY : {scrollY}px</p>
        </div>
      </div>
    </PageLayout>
  );
};

export default ThrottlePage;