import React from "react";
import PropTypes from "prop-types";

import PublicNavbar from "./PublicNavbar";

export default function Container({ children }) {
  return (
    <div className="overflow-hidden scrollbar-none">
      <PublicNavbar />
      <div className="max-w-2xl mx-auto px-4 py-8 h-[calc(100vh-90px)] overflow-y-auto scrollbar-none">
        {children}
      </div>
    </div>
  );
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
};
