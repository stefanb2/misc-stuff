import React from 'react';

import './ErrorMessage.css';

interface ErrorMessageProps {
  error: Error
}

export const ErrorMessage = ({error}: ErrorMessageProps) => (
  <div className="error-container">
    <div className="error-message">An error occured:</div>
    <div className="error-message">{error.message}</div>
    {error.stack?.split('\n').map((line, index) => (
      <code
        className="error-stacktrace"
        key={index}
      >
        {/* &nbsp; preserves the leading spaces from the line */}
        &nbsp;{line}
      </code>
    ))}
  </div>
)
