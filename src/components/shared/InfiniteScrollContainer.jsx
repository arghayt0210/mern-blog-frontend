import PropTypes from "prop-types";
import { useInView } from "react-intersection-observer";

export default function InfiniteScrollContainer({
  children,
  onBottomReached,
  className,
}) {
  const { ref } = useInView({
    rootMargin: "200px",
    onChange(inView) {
      if (inView) {
        onBottomReached();
      }
    },
  });

  return (
    <div className={className}>
      {children}
      <div ref={ref}></div>
    </div>
  );
}

InfiniteScrollContainer.propTypes = {
  children: PropTypes.node.isRequired,
  onBottomReached: PropTypes.func.isRequired,
  className: PropTypes.string,
};
