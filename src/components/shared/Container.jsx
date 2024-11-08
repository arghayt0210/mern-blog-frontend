import React from "react";
import PropTypes from "prop-types";

import PublicNavbar from "./PublicNavbar";

export default function Container({ children }) {
  return (
    <div>
      <PublicNavbar />
      {children}
    </div>
  );
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
};
